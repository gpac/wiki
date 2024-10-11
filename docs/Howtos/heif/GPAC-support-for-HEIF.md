---
tags:
- mp4
- source
- heif
- compression
- data
- isobmff
- tile
- output
- codec
- mpeg
- stream
- frame
- hevc
- box
---



# Context {:data-level="all"}

HEIF is a new image format defined within MPEG, by companies such as Apple, Nokia, Canon, ... and by the GPAC team and Telecom Paris ! 

HEIF is based on the various constructs of ISOBMFF, supported in GPAC. For example, HEIF enables the storage of single images or image collections through the `meta` box and so-called items. HEIF also supports the storage of image sequences (like animated GIFs) using usual tracks, but with a new handler type called `pict`. HEIF was developed as a codec-agnostic container format (like ISOBMFF), but a first derivation of this generic format was standardized for images coded using the High Efficiency Video Codec (HEVC). 

Nice examples of HEIF images and of its benefits compared to other formats can also be found [on the website of some playback tools developed by Nokia](http://nokiatech.github.io/heif/), or on your iOS devices.


## Generating HEIF images

GPAC supports generating HEIF images using MP4Box, with the following command line:

```
MP4Box -add-image file.hvc:primary -ab heic -new image.heic
```

This will take the first image of the HEVC file, create a `meta` box, add one image item, make it a primary item and add the `heic` brand to the output file.

The following command line will do the same but for the next IDR frame after the given time and the `heix` brand.

```
MP4Box -add-image file.hvc:time=1.2:primary -ab heix -new image.heic
```

Finally, the following command line will take a tiled HEVC stream (as described in [[this page|HEVC Tile-based adaptation guide]]) and generate one item per tile and one item for the entire image.

```
MP4Box -add-image tiled.hvc:split_tiles:primary -ab heic -new tiled.heic
```

For more options, look at `MP4Box -h meta`.

## Playback 

Playback of HEIF (avc and hevc codecs) is also possible using the usual syntax:

```
gpac -i heif_url vout
gpac -play heif_url
gpac -gui heif_url
```

for HEIF collections, the source can be played as a file sequence:
```
gpac -play heif_url:itt
gpac -gui heif_url:itt
```
