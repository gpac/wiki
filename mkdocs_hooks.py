import logging
import posixpath
from urllib.parse import unquote as urlunquote
from urllib.parse import urlsplit, urlunsplit
from markdown.util import AMP_SUBSTITUTE
from mkdocs import utils
from mkdocs.structure import pages
import markdown
import os
from pathlib import Path
import logging as logger

FIX_MARDOWN_FILES = False
SAVE_BROKEN_FILELIST = False

RELATIVE_LINK_INVALID = "RELATIVE_LINK_INVALID"
RELATIVE_LINK_NOT_FOUND = "RELATIVE_LINK_NOT_FOUND"
LINKED_PAGE_EXCLUDED = "LINKED_PAGE_EXCLUDED"
ABSOLUTE_PATH_LINK = "ABSOLUTE_PATH_LINK"

BROKEN_LINKS = []

class BrokenLinkProcessor(pages._RelativePathTreeprocessor):

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.broken_links = []

    def add_broken_link(self, link_error, target, suggestion):
        self.broken_links.append((link_error, target, suggestion))

    def save_broken_link_fix(self, target, fix):
        BROKEN_LINKS.append((self.file.src_uri, target, fix))

    def fix_target(self, target, files):
        # know issues with gh-wiki
        if target.lower() == "mp4box-introduction":
            return "MP4Box/MP4Box.md"
        elif target == "route_out":
            return "Filters/routeout.md"
        elif target == "player":
            return "Player/Player.md"
        elif target.lower() == "ll-dash":
            return "Howtos/dash/LL-DASH.md"
        elif target == "Home":
            return "index.md"
        elif target.startswith("exemples"):
            return f"/{target}"

        # look for a filename that matches target, and return relative path
        parts = target.split("#")
        if len(parts) > 2:
            raise Exception('Invalid target URL')
        path = parts[0].rstrip("/") + '.md'
        anchor = parts[0] if len(parts) == 2 else None
        fix_candidates = [ f.src_uri for f in files._files if path == f.src_uri.split("/")[-1] ]
        if len(fix_candidates) > 1:
            logging.warning(f"Too many fix candidates:")
            for fc in fix_candidates:
                logging.warning(f"\t{fc}")
            return None
        elif len(fix_candidates) == 0:
            return None
        fix = fix_candidates[0]
        if anchor is not None:
            fix = f"{fix}#{anchor}"
        return fix

    def fix_broken_links(self, md, files):
        for bl in self.broken_links:
            _, target, fix = bl
            if target is None:
                logging.warning(f"Invalid broken link record: {bl[0]}")
                self.save_broken_link_fix(target, fix)
                continue
            if fix is None:
                fix = self.fix_target(target, files)
                if fix is None:
                    self.save_broken_link_fix(target, fix)
                    continue
                fix = utils.get_relative_url(fix, self.file.src_uri)
            self.save_broken_link_fix(target, fix)
            md = md.replace(f']({target})', f']({fix})')
            # logging.warn(f"Fixed link to '{target}' with target '{fix}'")

        return md
    
    def path_to_url(self, url: str) -> str:
            scheme, netloc, path, query, fragment = urlsplit(url)

            link_error = ABSOLUTE_PATH_LINK if url.startswith(('/', '\\')) else None
            target = None
            suggestion = None

            target_uri = None
            target_file = None

            if scheme or netloc:  # External link.
                return url
            elif AMP_SUBSTITUTE in url:  # AMP_SUBSTITUTE used by Markdown only for email.
                return url
            elif not path:  # query or fragment.
                return url

            path = urlunquote(path)
            # Determine the filepath of the target.
            possible_target_uris = self._possible_target_uris(
                self.file, path, self.config.use_directory_urls
            )

            if link_error == ABSOLUTE_PATH_LINK:
                # the primary lookup path should be preserved as a tip option.
                target_uri = url
                target = url
                target_file = None
            else:
                # Validate that the target exists in files collection.
                target_uri = next(possible_target_uris)
                target_file = self.files.get_file_from_path(target_uri)

            if target_file is None and (link_error != ABSOLUTE_PATH_LINK):
                # Primary lookup path had no match, definitely produce a warning, just choose which one.
                if not posixpath.splitext(path)[-1]:
                    # No '.' in the last part of a path indicates path does not point to a file.
                    target = url
                    link_error = RELATIVE_LINK_INVALID
                else:
                    target = f" '{target_uri}'" if target_uri != url else ""
                    link_error = RELATIVE_LINK_NOT_FOUND

            if link_error is not None:
                # There was no match, so try to guess what other file could've been intended.
                for path in possible_target_uris:
                    if self.files.get_file_from_path(path) is not None:
                        if fragment and path == self.file.src_uri:
                            path = ''
                        else:
                            path = utils.get_relative_url(path, self.file.src_uri)
                        suggestion = urlunsplit(('', '', path, query, fragment))
                        break
                    else:
                        if '@' in url and '.' in url and '/' not in url:
                            suggestion = f'mailto:{url}'
                self.add_broken_link(link_error, target, suggestion)
                return url

            assert target_uri is not None
            assert target_file is not None
            if target_file.inclusion.is_excluded():
                target = target_uri
                link_error = LINKED_PAGE_EXCLUDED

            path = utils.get_relative_url(target_file.url, self.file.url)
            self.add_broken_link(link_error, target, None)
            return urlunsplit(('', '', path, query, fragment))


def on_page_markdown(md_string, page, config, files):
    md = markdown.Markdown(
        extensions=config['markdown_extensions'],
        extension_configs=config['mdx_configs'] or {},
    )
    broken_link_ext = BrokenLinkProcessor(page.file, files, config)
    broken_link_ext._register(md)
    md_updated = md_string
    _ = md.convert(md_string)
    if len(broken_link_ext.broken_links) > 0:
        md_updated = broken_link_ext.fix_broken_links(md_string, files)
        if FIX_MARDOWN_FILES:
            with open(page.file.abs_src_path, "w") as md_file:
                md_file.write(md_updated)
    md_updated = fix_md_headings(md_updated)
    return md_updated


def on_post_build(*args, **kwargs) -> None:
    if SAVE_BROKEN_FILELIST:
        import csv
        with open('broken_links.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(BROKEN_LINKS)


def gh_wiki_cleanup():
    path = Path("docs")
    for p in path.rglob("*"):
        # remove legacy github wiki stuff
        if p.name == "_Sidebar.md" or p.name == "_Footer.md":
            logger.info(f"/!\\ removed {p}")
            os.remove(p)
        # fix Home page
        elif p.name == 'Home.md':
            os.remove(p)
        # cleanup names that contain spaces
        elif " " in p.name:
            n = p.parent / p.name.replace(" ", "-")
            logger.info(f"renamed {p} to {n}")
            os.rename(p, n)

def on_startup(*args, **kwargs):
    gh_wiki_cleanup()

def heading_level(line):
    hx = 0
    for char in line.lstrip():
        if char != "#":
            return hx
        hx+=1
    return hx

def fix_md_headings(md_content):
    md_fixed = []
    for l in md_content.splitlines():
        hx = heading_level(l)
        if hx > 0 and hx < 6:
            l = "#"+l
        elif hx >= 6:
            logger.warning("h6 detected - could not be fixed using mkdocs hooks")
        md_fixed.append(l)
    return '\n'.join(md_fixed)

if __name__ == "__main__":
    gh_wiki_cleanup()