#!/bin/sh

cd docs/Filters
gpac -genmd
cd ../MP4Box
MP4Box -genmd
cd ..

