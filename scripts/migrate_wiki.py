from pathlib import Path

PREPEND_LINES = [
    "> [!WARNING]",
    "> **GPAC's wiki is moving to [wiki.gpac.io](https://wiki.gpac.io/)**.",
    "> The github wiki is no longer updated"
]

def prepend_warning():
    path = Path("docs")
    for fp in path.rglob("*.md"):
        if fp == "" or fp == "":
            continue
        with open(fp, "rw") as fo:
            updated = PREPEND_LINES + fo.readlines()
            fo.writelines(updated)

if __name__ == "__main__":
    prepend_warning()