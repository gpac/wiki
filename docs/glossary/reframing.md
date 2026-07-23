---
hide:
- toc
tags:
- reframer
- filter
- pid
- decoding
- sap
---

# Reframing

Reframing is the process of forcing input PIDs to be properly framed — one packet per Access Unit — using GPAC's [reframer](reframer) filter. It's typically needed to force remultiplexing in file-to-file operations when source and destination use the same format, and can also force decoding, apply real-time regulation, filter packets by SAP type or frame number, or extract/split a specific time range.

## Usage in GPAC

Dump video key frames to PNG by filtering for SAP (stream access point) packets:
```bash
gpac -i source reframer:saps=1 -o dump/$num$.png
```
Force decoding of a source, discarding the result — useful for benchmarking a decoder:
```bash
gpac -i file.mp4 reframer:raw=av -o null
```

## See Also
- [Filter](filter.md)
- [SAP](sap.md)
