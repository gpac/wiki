---
hide:
- toc
tags:
- mp4
- graph
- source
- transcode
- input
- media
- isomedia
- bitrate
- data
- encode
- isobmff
- output
- codec
- hevc
- sink
- dump
---

# Codec

A codec identifies the compression format used to encode or decode audio, video, or other media data — for example AVC/H.264, HEVC, or AAC. In GPAC, a codec is named on an encoder or decoder filter, or resolved automatically from a PID's `CodecID` property.

## Usage in GPAC

Encode raw YUV video to AVC|H264 by naming the codec on the [enc](filters_general#specifying-encoders-and-decoders) filter shortcut:
```bash
gpac -i source.yuv:size=1280x720 enc:c=avc -o test.mp4
```
See [Encoding](../Howtos/encoding.md) for choosing and configuring codecs, including passing codec-specific options through to the underlying encoder.

## See Also
- [Decoder](decoder.md)
- [Bitrate](bitrate.md)
- [Encode](encode.md)
- [Transcode](transcode.md)
