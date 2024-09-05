---
hide:
  - navigation
---


**SOURCE** is a keyword in GPAC representing an input element that provides media data to be processed. It is typically the starting point of a media processing pipeline.

**Reference:**

`SOURCE`

**Usage:**

- Serving as the entry point in a media processing chain.
- Loading various media types (e.g., video, audio) for further processing.
- Configuring the initial properties of media streams before processing.

**Troubleshooting:**

- **No input data available:**
  Ensure the correct path or media source is specified and accessible.
- **Invalid media format:**
  Verify that the source format is supported by GPAC and correctly configured.

**Example:**

```plaintext
gpac -i input.mp4 -o output.mp4
```

**Parameters:**

- **input_file**: Path to the multimedia file to be loaded as a source.
- **options**: Additional parameters to control the behavior of the source filter (e.g., loop, start time).
  
## See Also:
- [Input](link-to-input.md)
- [Filter](link-to-filter.md)
- [Decode](link-to-decode.md)

