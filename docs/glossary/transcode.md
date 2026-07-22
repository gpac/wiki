---
hide:
- toc
tags:
- mp4
- transcode
- input
- isomedia
- bitrate
- isobmff
- output
- codec
- hevc
- decoding
- sink
- dump
---

# Transcode

Transcoding is decoding a source into raw samples and re-encoding it into a different codec, bitrate, or resolution. In GPAC this happens automatically whenever the graph resolver can't connect a source directly to a destination in its existing format.

## Usage in GPAC

```bash
gpac -i av_source c=avc:b=2m c=aac:b=128k -o test.mp4
```
This transcodes both tracks of `av_source` — video to AVC|H264 at 2 Mbit/s, audio to AAC at 128 kbit/s — and multiplexes the result into `test.mp4`. Omit either encoder to transcode just one track; see [Encoding](../Howtos/encoding.md) for more.

To change resolution while transcoding, add a rescaler such as [ffsws](ffsws):
```bash
gpac -i source.mp4 ffsws:osize=1280x720 c=avc:b=1m -o test.avc
```

## See Also
- [Codec](codec.md)
- [Bitrate](bitrate.md)
- [Encode](encode.md)
