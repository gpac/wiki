---
hide:
- toc
tags:
- filter
- graph
- chain
- pipeline
- session
- pid
- source
- sink
---

# Filter

A filter is GPAC's core processing unit: it consumes and produces data packets, connected to other filters through [PIDs](pid.md) to form a processing graph. GPAC makes no conceptual distinction between a source, a sink, a decoder, an encoder, a multiplexer, or a raw audio/video effect — they're all filters. What differs between them is the set of inputs and outputs each one can handle.

## Usage in GPAC

Load a specific filter by name, here to inspect a source:
```bash
gpac -i source inspect
```
Every filter carries its own documentation and options — see them with `gpac -h FNAME`, e.g. `gpac -h inspect`. Most filters are never specified explicitly at the prompt; they're dynamically loaded during [filter linking](filters_general#filter-linking-link) to connect a [source](source.md) to a [sink](sink.md).

## See Also
- [PID](pid.md)
- [Session](session.md)
- [Source](source.md)
- [Sink](sink.md)
