---
hide:
- toc
tags:
- session
- filter
- graph
- pipeline
- chain
---

# Session

A filter session is the running instance of a filter graph. GPAC's re-architecture documentation describes its job as providing automatic link resolution between filters, executing each filter whenever input packets are available, and reconfiguring parts of the chain whenever required — potentially replacing a sub-chain with another one at runtime. The [gpac](gpac_general) application's entire job is to build and run one filter session per invocation.

## Usage in GPAC

Report on a running session while it executes:
```bash
gpac -i source.mp4 -o dst.mp4 -r
```
A session can also use extra worker threads (`-threads`) and can be interrupted at any time with `ctrl+c`, flushing the session to save whatever has been processed so far.

## See Also
- [Filter](filter.md)
- [PID](pid.md)
