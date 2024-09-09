---
hide:
  - toc
---

`output` refers to the destination file or format where the result of encoding, decoding, or transcoding processes will be stored.

## Reference

### 
```bash
output(output_file, format)
```
## Usage

- **Saving encoded or decoded multimedia files**
- **Specifying the format of the output file**
- **Exporting processed media streams**

## Troubleshooting

### Output file is corrupted or not working
- Verify the format and codec compatibility with the output media player.

### Output file size is too large
- Consider adjusting the bitrate or encoding settings.

## Example

```bash
output("output.mp4", "mp4")
```

## Parameters

- **output_file**: Path to save the output file.
- **format**: Format of the output file (e.g., `mp4`, `mkv`, `avi`).

## See Also:
- [Decoder](decoder.md)
- [Codec](codec.md)

