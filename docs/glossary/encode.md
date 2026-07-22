---


tags:
- mp4
- source
- transcode
- input
- isomedia
- bitrate
- isobmff
- encode
- output
- codec
- hevc
- sink
- dump
---

# Encode

Encoding is the process of compressing raw media (video, audio) into a target codec using an encoder filter. In GPAC, the [enc](filters_general#specifying-encoders-and-decoders) filter shortcut loads whichever encoder filter provides the codec requested via `c=`.

## Usage in GPAC

```bash
gpac -i source.yuv:size=1280x720 enc:c=avc -o test.mp4
```
This encodes raw YUV420 video into AVC|H264 and multiplexes the result into an MP4 file. See [Encoding](../Howtos/encoding.md) for audio encoding, transcoding, and setting encoder-specific options.

## See Also
- [Codec](codec.md)
- [Bitrate](bitrate.md)
- [Transcode](transcode.md)
