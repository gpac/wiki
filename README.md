# GPAC wiki

This repository contains [GPAC's wiki](https://wiki.gpac.io), the entrypoint to [MP4Box](https://wiki.gpac.io/MP4Box) and [GPAC](https://wiki.gpac.io/Filters) documentation.


## Contributiing

Contributions are welcome and can be submitted through pull requests.

Some of the markdown files are autogenerated by GPAC and MP4Box, see: `scripts/genmd.sh`. These files must be edited by editing GPAC C source code and contributed to GPAC.


Make sure to keep the navigation structure in the `mkdocs.yml` configuration up to date when adding or removing new pages.


URLs are autogenerated from the markdown file names.



## Development & build

This documentation uses the [**materials** theme](https://squidfunk.github.io/mkdocs-material/) for [**mkdocs**](https://www.mkdocs.org/).

**Intall all dependencies**:
```bash
python3 -m pip install mkdocs-material==9.5.26
```

**Local preview with hot reloading**:
```bash
mkdocs serve
```

**Release build**:

```
mkdocs build --clean -d ./site
```
