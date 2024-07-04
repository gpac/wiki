#!/bin/sh

cd ../docs/Filters
gpac -genmd
git add *.md
cd ../MP4Box
MP4Box -genmd
git add *.md
cd ../../scripts
git add ../mkdocs.yml
