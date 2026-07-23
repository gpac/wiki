---
hide:
- toc
tags:
- property
- pid
- filter
- graph
---

# Property

A property is an attribute attached to a [PID](pid.md) or packet — such as width, height, codec, or timescale — that filters use to describe the data they produce and to negotiate connections during graph resolution. Properties can be built-in or user-defined, and a change in a PID's properties can trigger filter reconfiguration at runtime.

## Usage in GPAC

Assign a custom property (here, `ServiceID`) when muxing several sources together:
```bash
gpac -i v1.mp4:#ServiceID=4 -i v2.mp4:#ServiceID=2 -o dump.ts
```
This multiplexes both sources into `dump.ts`, tagging PIDs from `v1.mp4` with `ServiceID` 4 and those from `v2.mp4` with `ServiceID` 2. See [built-in properties](filters_properties) for the full list GPAC recognizes, and [general concepts](filters_general) for the complete property-assignment syntax.

## See Also
- [PID](pid.md)
- [Filter](filter.md)
