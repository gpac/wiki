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

# Sink

A sink is a filter with no output PID — the terminal point of a GPAC filter graph, such as [vout](vout) (video display), [aout](aout) (audio playback), or [fout](fout) (file output).

## Usage in GPAC

```bash
gpac -i input.mp4 -o output.avi
```
Here the destination `output.avi` resolves to a [fout](fout) sink. For on-screen/audio playback instead of a file, use `gpac -play source`, which opens [vout](vout)/[aout](aout) sinks — see [playback](filters-playback).

## See Also
- [Source](source.md)
- [Output](output.md)
