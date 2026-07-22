#!/usr/bin/env python3
"""Derive an mkdocs-llmstxt `sections:` block from mkdocs.yml's `nav:` tree.

This keeps llms.txt/llms-full.txt in sync with the hand-curated nav instead
of maintaining a second, parallel list of pages that can drift. Top-level
nav categories (Howtos, MP4Box, GPAC, ...) become llms.txt sections; nested
sub-groups are flattened into their parent section, and each page's nav
label is used verbatim as its description.

Usage:
    scripts/gen_llms_sections.py            # print the `sections:` YAML block
    scripts/gen_llms_sections.py --stats     # print per-section page counts only
    scripts/gen_llms_sections.py --check     # verify mkdocs.yml matches nav (exit 1 if not)
"""
import argparse
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
MKDOCS_YML = REPO_ROOT / "mkdocs.yml"
EXCLUDE_PREFIXES = ("glossary/",)


def _ignore_multi(loader, suffix, node):
    return None


def _ignore_scalar(loader, node):
    return None


def load_config():
    loader = yaml.SafeLoader
    # mkdocs.yml uses tags PyYAML's safe loader doesn't know about
    # (!ENV for env-var substitution, !!python/name:... for a markdown
    # extension callable). Neither appears inside `nav:` or `plugins:`, so
    # it's safe to just stub them out rather than pull in a full/unsafe loader.
    loader.add_multi_constructor("tag:yaml.org,2002:python/name:", _ignore_multi)
    loader.add_constructor("!ENV", _ignore_scalar)
    with open(MKDOCS_YML) as f:
        return yaml.load(f, Loader=loader)


def load_nav(config):
    return config["nav"]


def walk(node, out):
    """Collect (path, label) leaf entries from a nav subtree into out."""
    if isinstance(node, list):
        for item in node:
            walk(item, out)
    elif isinstance(node, dict):
        for label, value in node.items():
            if isinstance(value, str):
                if value.endswith(".md"):
                    out.append((value, label))
                # else: external link (e.g. https://doxygen.gpac.io) -- skip
            else:
                walk(value, out)
    # bare strings (a nav leaf with no label) don't occur in this nav today;
    # if they show up later they'd need a label to describe them, so skip.


def build_sections(config):
    nav = load_nav(config)
    sections = {}
    for entry in nav:
        if not isinstance(entry, dict):
            continue
        for section_name, value in entry.items():
            leaves = []
            walk(value, leaves)
            leaves = [
                (path, label)
                for path, label in leaves
                if not path.startswith(EXCLUDE_PREFIXES)
            ]
            if leaves:
                sections[section_name] = leaves
    return sections


def load_current_sections(config):
    """Read the `sections:` block currently embedded under `plugins: - llmstxt:`.

    Returns {section_name: [path, ...]} or None if the plugin isn't configured.
    Entries may be bare strings (`path.md`) or single-key dicts (`path.md: label`,
    from --with-labels output); both are normalized to bare paths for comparison,
    since the check only cares whether the *set of pages* matches nav, not
    whether a description was attached.
    """
    for entry in config.get("plugins", []):
        if isinstance(entry, dict) and "llmstxt" in entry:
            raw = (entry["llmstxt"] or {}).get("sections", {})
            normalized = {}
            for name, items in raw.items():
                paths = []
                for item in items:
                    if isinstance(item, dict):
                        paths.append(next(iter(item)))
                    else:
                        paths.append(item)
                normalized[name] = paths
            return normalized
    return None


def check(config):
    """Compare the embedded `sections:` block against a fresh derivation from
    nav. Returns True if in sync, prints a diff and returns False otherwise.
    """
    current = load_current_sections(config)
    expected = {
        name: [path for path, _label in leaves]
        for name, leaves in build_sections(config).items()
    }

    if current is None:
        print("mkdocs.yml has no `plugins: - llmstxt:` section configured.")
        return False

    if current == expected:
        print("llms.txt sections are up to date with nav.")
        return True

    print("llms.txt sections in mkdocs.yml are out of sync with nav:")

    current_sections = set(current)
    expected_sections = set(expected)
    for name in sorted(expected_sections - current_sections):
        print(f"  + section added to nav: {name!r}")
    for name in sorted(current_sections - expected_sections):
        print(f"  - section removed from nav: {name!r}")

    for name in sorted(current_sections & expected_sections):
        cur_paths = set(current[name])
        exp_paths = set(expected[name])
        for path in sorted(exp_paths - cur_paths):
            print(f"  + {name}: {path}")
        for path in sorted(cur_paths - exp_paths):
            print(f"  - {name}: {path}")
        if current[name] != expected[name] and cur_paths == exp_paths:
            print(f"  ~ {name}: same pages, different order")

    return False


def to_plugin_yaml(sections, with_labels=False):
    lines = ["      sections:"]
    for name, files in sections.items():
        lines.append(f"        {name}:")
        for path, label in files:
            if with_labels:
                lines.append(f"          - {path}: {label}")
            else:
                lines.append(f"          - {path}")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--stats", action="store_true", help="print per-section page counts only"
    )
    parser.add_argument(
        "--with-labels",
        action="store_true",
        help="use each page's nav label as its llms.txt description (redundant with "
        "the auto-derived link title in most cases; off by default)",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify mkdocs.yml's llmstxt sections match nav; exit 1 if stale "
        "(for use in a pre-commit hook / CI, prints nothing else)",
    )
    args = parser.parse_args()

    config = load_config()

    if args.check:
        sys.exit(0 if check(config) else 1)

    sections = build_sections(config)

    if args.stats:
        total = 0
        for name, files in sections.items():
            print(f"{name}: {len(files)} pages")
            total += len(files)
        print(f"TOTAL: {total} pages across {len(sections)} sections")
        return

    print(to_plugin_yaml(sections, with_labels=args.with_labels))


if __name__ == "__main__":
    main()
