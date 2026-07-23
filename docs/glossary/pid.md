---
hide:
- toc
tags:
- pid
- filter
- graph
- property
- stream
- data
---

# PID

A PID is the data channel through which packets flow from one [filter](filter.md) to another. GPAC's own documentation never spells out what the acronym stands for — only what it does: "a PID is in charge of allocating/tracking data packets, and passing the packets to the destination filter(s)." A filter's output PID may fan out to zero or more connected filters; GPAC has no separate "tee" filter for this.

Each PID carries a set of [properties](property.md) — width, height, codec, timescale, and so on — that filters use to negotiate connections and can reconfigure themselves around at runtime.

## Usage in GPAC

List every built-in PID and packet property GPAC recognizes:
```bash
gpac -h props
```
See [built-in properties](filters_properties) for the full reference, and [general concepts](filters_general) for how PIDs are matched and connected between filters.

## See Also
- [Filter](filter.md)
- [Property](property.md)
