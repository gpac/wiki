---
hide:
- toc
tags:
- mp4
- input
- media
- data
- decoder
- raw
- output
- codec
- hevc
- decoding
- bitrate
---

# Decoder

A decoder is a filter that converts compressed media data back into raw, uncompressed samples (e.g. YUV video, PCM audio). GPAC's filter graph resolver loads a decoder automatically whenever a destination needs raw data that the source doesn't already provide, and can just as easily leave the data compressed if the destination accepts it directly.

## Usage in GPAC

Dumping an MP4 video track to raw YUV forces a decode, with no decoder named explicitly:
```bash
gpac -i source.mp4 -o dst_$Width$_$Height$.yuv
```
GPAC ships several decoder filters, e.g. [ffdec](ffdec) (FFmpeg), [ohevcdec](ohevcdec) (OpenHEVC), [nvdec](nvdec) (NVIDIA). Use `gpac -h FNAME` (e.g. `gpac -h ffdec`) to see a specific decoder's options, or `gpac -h filters` to list all filters available in your build.

## See Also
- [Codec](codec.md)
- [Source](source.md)
