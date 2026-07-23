---
hide:
- toc
tags:
- encrypt
- xml
- filter
- pid
- isobmff
---

# DRM

DRM (Digital Rights Management) is technology that restricts access to protected media content. In GPAC, DRM protection is applied through Common Encryption (CENC) — or ISMA/Adobe encryption — using the [cecrypt](cecrypt) filter to encrypt and [cdcrypt](cdcrypt) to decrypt, both driven by a DRM configuration file that declares keys as `CrypTrack` entries.

## Usage in GPAC

```bash
gpac -i source1.mp4 -i source2.aac cecrypt:cfile=drm.xml -o live.mpd
```
This encrypts both sources using the keys described in `drm.xml` and packages the result for DASH/HLS. The DRM config file can be set per PID via the `CryptInfo` property, or globally at the filter level via `cfile`. See the [Encryption introduction](Encryption-Introduction) howto and [Common Encryption](Common-Encryption) for the config file format — GPAC also supports scheme-specific variants like [OMA DRM](OMA-DRM).

## Commercial DRM systems (FairPlay, Widevine, PlayReady)

GPAC's tooling works at the generic CENC/PSSH level, not through named integrations with specific commercial DRM systems. A `<DRMInfo>` element in the `drm.xml` config file can carry a PSSH box for *any* DRM system, identified by that system's `SystemID` UUID plus its opaque vendor-specific payload — see [Common Encryption](Common-Encryption)'s `DRMInfo` documentation for the full syntax. [Common Encryption](Common-Encryption)'s own example XML embeds PlayReady's real SystemID (`9A04F07998404286AB92E65BE0885F95`) exactly this way.

What GPAC does *not* do is implement license acquisition or ship a vendor DRM client — that machinery is proprietary to each platform (browser CDMs, device DRM clients) and lives on the playback side, not in a packaging tool. 

## See Also
- [Encrypt](encrypt.md)
- [Filter](filter.md)
