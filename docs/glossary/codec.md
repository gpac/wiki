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




`codec` refers to a compression algorithm used to encode and decode multimedia data (such as video, audio, etc.) into different formats for transmission and storage.

## Reference

### 
```bash
codec(input_file, output_file, codec_name)
```
## Usage

- **Compressing video or audio using different codecs**
- **Optimizing multimedia files for storage or streaming**
- **Converting between different codecs for compatibility**

## Troubleshooting

### File not playing correctly
- Ensure the codec used is compatible with the media player.

### Poor quality
- Verify that the encoding settings for the codec are optimized, such as using higher bitrates.

## Example

```bash
codec("input.mp4", "output.mp4", "libx265")
```

```mermaid

graph LR;
    A[input.mp4] --> B[libx265];
    B --> C[output.mp4];
```


## Parameters

- **input_file**: Path to the multimedia file.
- **output_file**: Path where the output file will be saved.
- **codec_name**: The codec to be used for encoding, e.g., `libx265` for HEVC.

## See Also
- [Bitrate](bitrate.md)
- [Transcode](transcode.md)

