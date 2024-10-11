---
hide:
- toc
tags:
- mp4
- source
- transcode
- chain
- input
- media
- isomedia
- data
- isobmff
- stream
- output
- codec
- hevc
- sink
- dump
---





`sink` refers to an output element that receives processed media data. It is usually the endpoint of a media processing pipeline.

## Reference

`SINK`

## Usage

-  **Finalizing the media processing chain by writing the output data.**
-  **Exporting media streams to various file formats (e.g., MP4, AVI).**
- **Displaying processed media in a player or exporting to a network stream.**

## Troubleshooting

### Output file not created
- Check the file path permissions and ensure the output format is supported.

### Corrupted output data
- Confirm that the input data is correctly processed and compatible with the specified output format.

## Example

```plaintext
gpac -i input.mp4 -o output.avi
```

## Parameters

- **output_file**: Path where the processed media data will be saved.
- **options**: Additional parameters to control the output settings (e.g., format, quality).

## See Also
- [Output](output.md) 
- [Codec](codec.md)
- [Transcode](transcode.md)

