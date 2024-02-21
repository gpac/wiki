# GPAC wiki

This repo builds gpac wiki using the popular [mkdocs](https://www.mkdocs.org/) documentation framework.

## Getting started

patch GPAC's wiki for compatibility with mkdocs
```bash
git clone https://github.com/gpac/gpac.wiki.git docs
git checkout ae93bb19120806acf946098d7bd236dce47aa90d
cd docs && git apply --reject --whitespace=fix ../docs.diff
```

intall **mkdocs** dependencies. venv is optional but highly recommended:
```bash
$ python3 -m venv .venv 
$ source .venv/bin/activate
(.venv)$ python3 -m pip install mkdocs-material
```

live preview localy:
```bash
(.venv)$ mkdocs serve
```

release build:
```
mkdocs build --clean -d ./site
```

## add a notice to github's wiki about the new wiki 
```bash
python scripts/migrate_wiki.py
```

prepends the following message to all markdown files except sidebars and footer 
```
> [!WARNING]
> **GPAC's wiki is moving to [wiki.gpac.io](https://wiki.gpac.io/)**.
> The github wiki is no longer updated.
```

## part of GPAC wiki is auto generated and should be updated with the following commands
```
cd Filters
gpac -genmd
cd ../MP4Box
MP4Box -genmd
cd ..
```