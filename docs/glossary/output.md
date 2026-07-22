---
hide:
- toc
tags:
- mp4
- media
- isomedia
- data
- isobmff
- stream
- output
- codec
- hevc
- decoding
- decoder
- sink
- dump
---

# Output

Output refers to the destination of a GPAC filter pipeline — a file, stream, or device that the final filter(s) write to. It's specified with `-o`/`-dst`, or by using a destination filter directly, e.g. [fout](fout) (file), [pout](pout) (pipe), [sockout](sockout) (socket).

## Usage in GPAC

```bash
gpac -i source.mp4 -o dst.aac
```
This finds a filter able to write `dst.aac` (here, [fout](fout)), transcoding the source if needed to match. The same result can be written explicitly as `fout:dst=dst.aac`. See [Source and Sink filters](filters_general#source-and-sink-filters) for the full `src=`/`dst=` syntax.

## See Also
- [Source](source.md)
- [Sink](sink.md)
