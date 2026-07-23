---
hide:
- toc
tags:
- data
- pid
- filter
- property
- stream
- dump
---

# Packet

A packet is the unit of data a [filter](filter.md) consumes and produces, carried from one filter to the next along a [PID](pid.md). Packets can carry their own properties in addition to the ones declared on their PID — GPAC's built-in property reference flags these `P` to mean "applies to a packet" as opposed to the PID as a whole (e.g. `RefID`, used for dependency tracking, usually the picture order count for video).

## Usage in GPAC

Inspect packet-level fields — DTS, SAP type, size — of a source:
```bash
gpac -i source inspect:deep:fmt="%dts% %dts% %sap% %size%%lf":log=mylogs.txt
```
Analyze packets in depth, including bitstream-level details:
```bash
gpac -i source.264 inspect:deep:analyze=on
```
See [built-in properties](filters_properties) for the full list of PID and packet properties, flagged `P` where they apply to a packet rather than the PID.

## See Also
- [Filter](filter.md)
- [PID](pid.md)
- [Property](property.md)
