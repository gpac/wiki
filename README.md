# GPAC wiki

This repo builds gpac wiki using the popular [mkdocs](https://www.mkdocs.org/) documentation framework.


## Getting started

clone the repo & submodule:
```bash
$ git clone --recurse-submodules git@github.com:nlsdvl/gpac-wiki.git
```

intall dependencies. venv is optional but highly recommended:
```bash
$ python3 -m venv .venv 
$ source .venv/bin/activate
(.venv)$ python3 -m pip install mkdocs-material
```

live preview localy:
```bash
(.venv)$ mkdocs serve
```


## Contributing

To update the wiki content, please commit to the [gpac wiki fork](https://github.com/nlsdvl/gpac-gh-wiki/), then update the git submodule in `./docs`.

`mkdocs.yml` contains the configuration. 

The [material for mkdocs theme](https://squidfunk.github.io/mkdocs-material/) is used. Navigation and sidebars are configured explicitly in `mkdocs.yml`
