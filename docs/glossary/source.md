---
hide:
- toc
tags:
- mp4
- source
- input
- chain
- media
- isomedia
- isobmff
- data
- stream
- output
- filter
- decoder
---

# Source

A source is a filter that provides media data into a GPAC pipeline — a file, live capture device, or network stream. It's specified with `-i`/`-src`, or by using a source filter directly, e.g. [fin](fin) (file), [pin](pin) (pipe), [sockin](sockin) (socket).

## Usage in GPAC

```bash
gpac -i source.mp4 -o output.mp4
```
This finds a filter able to read `source.mp4` (here, [fin](fin)) and connects its output PID(s) to the destination. The same result can be written explicitly as `fin:src=source.mp4`. See [Source and Sink filters](filters_general#source-and-sink-filters) for the full `src=`/`dst=` syntax.

## See Also
- [Sink](sink.md)
- [Output](output.md)
