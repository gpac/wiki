---
hide:
- toc
tags:
- mp4
- transcode
- input
- isomedia
- bitrate
- data
- isobmff
- output
- codec
- hevc
- sink
- dump
---

# Bitrate

Bitrate is the target data rate of an encoded stream, in bits per second. In GPAC it's set on an encoder filter with `b=`, `rate=`, or `bitrate=`.

## Usage in GPAC

```bash
gpac -i source.mp4 c=avc:b=2M -o test.avc
```
This encodes the video track of `source.mp4` to AVC|H264 at 2 Mbit/s. Values accept unit suffixes — `k`/`K` (×1,000), `m`/`M` (×1,000,000), `g`/`G` (×1,000,000,000) — see [property and filter option format](filters_general#property-and-filter-option-format) for the full syntax.

## See Also
- [Codec](codec.md)
- [Encode](encode.md)
- [Transcode](transcode.md)
