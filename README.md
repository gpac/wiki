# GPAC wiki

## Contributing

this documentation uses the [materials theme](https://squidfunk.github.io/mkdocs-material/) for [mkdocs](https://www.mkdocs.org/).

### navigation

The navigation tree is entirely hand written in the `mkdocs.yml` config.
This is to ensure compatibility while migrating away from github's wiki.
`mkdocs` can otherwise automatically generate navigation from directory structure.

> [!IMPORTANT]
> Make sure to keep the navigation up to date when adding/removing new pages.

### mkdocs hooks

[mkdocs hooks](https://www.mkdocs.org/user-guide/configuration/#hooks) are used to fix issues with the github wiki coontent:
- automatically fixes most broken links
- offset all headings to avoid breaking [breaking the table of content](https://github.com/squidfunk/mkdocs-material/issues/3110)

These hooks are fixing the markdown on the fly when running `mkdocs serve` or `build`, and will be disabled to avoid encouraging producing content not properly formated, as soon as the markdown files have been fixed.


### auto-generated content from GPAC/MP4Box

Some of the documentation is generated automaticaly by GPAC/MP4Box:
```
cd Filters
gpac -genmd
cd ../MP4Box
MP4Box -genmd
cd ..
```
The dockerfile is the easiest way to keep these up to date with the latest release.

> [!IMPORTANT]
> These files must be edited in GPAC C source code. 


### adding a notice to github's wiki about the new wiki 
```bash
python3 scripts/migrate_wiki.py
```

prepends the following message to all markdown files except sidebars and footer:
```
> [!WARNING]
> **GPAC's wiki is moving to [wiki.gpac.io](https://wiki.gpac.io/)**.
> The github wiki is no longer updated.
```


## Development & build

patch GPAC's github wiki for compatibility with mkdocs
```bash
git clone https://github.com/gpac/gpac.wiki.git docs
git checkout ae93bb19120806acf946098d7bd236dce47aa90d
cd docs && git apply --reject --whitespace=fix ../docs.diff
```

intall the **mkdocs** theme and its dependencies:
```bash
$ python3 -m venv .venv 
$ source .venv/bin/activate
(.venv)$ python3 -m pip install mkdocs-material
```
*using* `venv` *is optional*

live preview localy:
```bash
(.venv)$ mkdocs serve
```

release build:
```
(.venv)$ mkdocs build --clean -d ./site
```
