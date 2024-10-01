---
hide:
  - toc
---

### **Decoder**

A `decoder` is responsible for converting encoded multimedia data back into its original format or an uncompressed format that can be processed by media players or other applications.

## Reference

### 
```bash
decoder(input_file, output_file, codec)
```
## Usage

- **Decoding video files for playback**
- **Decoding audio files for editing or playback**
- **Converting encoded formats into raw data for further processing**

## Troubleshooting

### File not playing correctly after decoding
- Ensure the correct codec was used for decoding.

### Decoding is slow
- Check if the system has enough resources or try using a different decoder.

## Example

```bash
decoder("input.mp4", "output.yuv", "libx264")
```

## Parameters

- **input_file**: Path to the encoded multimedia file.
- **output_file**: Path where the decoded file will be saved.
- **codec**: Codec used for decoding (e.g., `libx264` for H.264).

## See Also:
- [Codec](codec.md)
- [Bitrate](bitrate.md)


