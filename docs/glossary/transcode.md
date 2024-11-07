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





`transcode` is the process of converting a multimedia file from one format to another by decoding and re-encoding the file.

## Reference

### 
```bash
transcode(input_file, output_file, codec, bitrate)
```

## Usage

- **Converting between formats for different devices**
- **Changing video resolution or quality while preserving content**
- **Adjusting parameters like codec and bitrate for various outputs**

## Troubleshooting

### File does not play after transcoding
- Ensure you used the correct codec and bitrate for the target platform.

### File quality is too low
- Check your codec and bitrate settings for proper optimization.

## Example

```bash
transcode("input.mp4", "output.mp4", "libvpx", "500k")
```

## Parameters

- **input_file**: File to be transcoded.
- **output_file**: Output file path.
- **codec**: Codec to be used (e.g., `libvpx` for VP8).
- **bitrate**: Desired bitrate for the output file.

## See Also:
- [Codec](codec.md)
- [Bitrate](bitrate.md)

