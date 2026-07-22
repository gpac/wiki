---
hide:
- toc
tags:
- mp4
- encrypt
- source
- input
- isomedia
- isobmff
- decoder
- output
- xml
- sink
- dump
---

# Encrypt

Encryption in GPAC applies Common Encryption (CENC) to a media pipeline using the [cecrypt](cecrypt) filter, driven by a DRM/key configuration file. Decryption is the inverse operation, done with [cdcrypt](cdcrypt).

## Usage in GPAC

```bash
gpac -i source1.mp4 -i source2.aac cecrypt:cfile=drm.xml -o live.mpd
```
This encrypts both sources using the keys described in `drm.xml` and packages the result for DASH/HLS. See the [Encryption introduction](Encryption-Introduction) howto, the [cecrypt](cecrypt)/[cdcrypt](cdcrypt) filter pages, and [Common Encryption](Common-Encryption) for the key file format.

## See Also
- [Decoder](decoder.md)
