#!/bin/sh
git clone --depth 1 https://github.com/gpac/gpac.wiki.git ./docs
cd $(pwd)/docs
git apply --reject --whitespace=fix ../patches/hotfix.diff
git apply --reject --whitespace=fix ../patches/mkdocs-patch.diff
