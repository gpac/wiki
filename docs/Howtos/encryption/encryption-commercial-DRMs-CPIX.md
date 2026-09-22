---
tags:
- option
- mp4
- encrypt
- mpd
- source
- pid
- input
- media
- manifest
- isomedia
- data
- isobmff
- xml
- property
- dash
---


# Overview {:data-level="all"}

We discuss here how to use commercial DRMs with GPAC. We assume that you are familiar with encrypting ISOBMFF files with GPAC. If not, please read the [Encryption](Encryption-Introduction page) first.

GPAC provides a generic framework for protecting data with encryption. As Free Software, GPAC's community is more inclined towards privacy. However we need [your inputs](https://github.com/gpac/wiki/issues/new?template=bug_report.md) to support commercial DRMs too.

# DRM config file {:data-level="beginner"}

## Introduction

For historical reasons, commercial DRMs require some custom processing and fields, often centralized in the `pssh` box or thr MPEG-DASH MPD manifest, but not only. GPAC tries an automatic detection or relies on user-based input such as a [DRM config file](Common-Encryption).

## PSSH box localisation

With adapting streaming (`dasher` filter), the `pssh` box can be set both inband (in the global `moov` or the fragment `moof`) or outband (in the manifest). Most DRMs mandate both (`dasher:pssh=mv`).

## Specifying right management servers

### License Acquisition

If you need to specify a License Acquisition server URL ("LAURL"), use the [dasher](dasher) filter `laurl` parameter.

If all streams share the same LAURL, specify `laurl` like this:

 ```
 MP4Box -dash 1000 cypted.mp4 -out dash/manifest.mpd:laurl=https://drm.com/GetLicence
 ```


If each source has its own licence URL:
 ```
 MP4Box -dash 1000 cypted.mp4:#LAUrl=https://ck.gpac.io/GetLicence1 cypted2.mp4:#LAUrl=https://ck.gpac.io/GetLicence2  -out dash/manifest.mpd
 ```

### Certificate information

If you need to specify a server to get certificate information("CertURL"), use the [dasher](dasher) filter `certurl` parameter. This is for instance needed with Apple FairPlay.

If all streams share the same URL, specify `certurl` like this:

 ```
 MP4Box -dash 1000 cypted.mp4 -out dash/manifest.mpd:cerurl=https://drm.com/cert.cer
 ```

If each source has its own licence URL:
 ```
 MP4Box -dash 1000 cypted.mp4:#CertUrl=https://ck.gpac.io/cert1.cer cypted2.mp4:#CertUrl=https://ck.gpac.io/cert2.cer  -out dash/manifest.mpd
 ```

## Mapping the DRM-vendor information with

Most vendors will provide you some mapping with GPAC. If they don't, they will likely provide you with standard information such as a `PSSH` ISOBMFF box. Not that GPAC write the box for you so you need to remove the header from the DRM PSSH manually by removing the first 48 bytes:
 - The 8 first bytes which represent the box header.
 - The next 32 bytes corresponds to the System Id (=a DRM unique identifier).
 - The next 8 bytes encode the size of the following payload.

GPAC XML format supports many binary [formats](https://wiki.gpac.io/xmlformats/XML-Binary/#semantics). However one may still need to accomplish manual conversions depending on the data provided by the DRM vendor.

## PlayReady DRM

The DRM config file ([syntax](https://wiki.gpac.io/xmlformats/Common-Encryption/)) for PlayReady looks like (replace the three dots by your DRM vendor information - more on that above):

```
<?xml version="1.0" encoding="UTF-8" />
<GPACDRM type="CENC AES-CTR">

<!-- Playready -->
<DRMInfo type="pssh" version="0">
  <BS ID128="9a04f07998404286ab92e65be0885f95"/> <!-- System ID -->
  <BS data="9802000001..."/>
</DRMInfo>

<CrypTrack trackID="1" IsEncrypted="1" IV_size="16" first_IV="0x01234567890123456789012345678901" saiSavedBox="senc">
<key KID="0x01234567890123456789012345678901" value="0x173b1ae9f0bfc8bafa20f98eba0e07d9"/>
</CrypTrack>

</GPACDRM>
```

A corresponding PlayReady command-line is:

```
gpac -i input.mp4 cecrypt:cfile=playready.xml -o output/dash.mpd:pssh=mv:laurl=(playready)https://drm.com/auth?p=my_id
```

Some [examples](https://github.com/search?q=repo%3Agpac%2Ftestsuite%20playready&type=code) were contributed to the GPAC's testsuite too.

## Widevine DRM

The DRM config file ([syntax](https://wiki.gpac.io/xmlformats/Common-Encryption/)) for Widevine looks like (replace the three dots by your DRM vendor information - more on that above):

```
<?xml version="1.0" encoding="UTF-8" />
<GPACDRM type="CENC AES-CTR">

<!-- Widevine -->
<DRMInfo type="pssh" version="0">
  <BS ID128="edef8ba979d64acea3c827dcd51d21ed"/> <!-- System ID -->
  <BS data="12100123456789..."/>
</DRMInfo>

<CrypTrack trackID="1" IsEncrypted="1" IV_size="16" first_IV="0x01234567890123456789012345678901" saiSavedBox="senc">
<key KID="0x01234567890123456789012345678901" value="0x173b1ae9f0bfc8bafa20f98eba0e07d9"/>
</CrypTrack>

</GPACDRM>
```

A corresponding Widevine command-line is:

```
gpac -i input.mp4 cecrypt:cfile=../widevine.xml -o output/dash.mpd:pssh=mv:laurl=(widevine)https://drm.com/proxy?p=my_id
```

## FairPlay DRM

The DRM config file ([syntax](https://wiki.gpac.io/xmlformats/Common-Encryption/)) for FairPlay looks like (replace the three dots by your DRM vendor information - more on that above):

```
<?xml version="1.0" encoding="UTF-8" />
<GPACDRM type="cbcs">

<!-- FairPlay -->
<DRMInfo type="pssh" version="0">
  <BS ID128="94CE86FB07FF4F43ADB893D2FA968CA2"/> <!-- System ID -->
</DRMInfo>

<CrypTrack trackID="1" IsEncrypted="1" constant_IV_size="16" constant_IV="0x01234567890123456789012345678901" saiSavedBox="senc">
<key KID="0x01234567890123456789012345678901" value="0x173b1ae9f0bfc8bafa20f98eba0e07d9" hlsInfo='URI="skd://01234567-8901-2345-6789-012345678901:01234567890123456789012345678901",KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1"'/>
</CrypTrack>

</GPACDRM>
```

A corresponding FairPlay command-line is:

```
gpac -i input.mp4 cecrypt:cfile=fairplay.xml -o output/dash.mpd:pssh=mv:laurl=(fairplay)https://drm.com/auth?p=my_id&assetID=01234567-8901-2345-6789-012345678901:certurl=https://drm.com/cert.cer
```

## Other DRMs

All DRMs work similarly. In case of doubt, contact us.

## Combining multiple DRMs

Combining DRMs consist in stacking options. Make sure the encryption parameters are compatible among DRMs. The DRM config file contains several `PSSH` box descriptions:

```
<?xml version="1.0" encoding="UTF-8" />
<GPACDRM type="cbcs">

<!-- Playready -->
<DRMInfo type="pssh" version="0">
  <BS ID128="9a04f07998404286ab92e65be0885f95"/> <!-- System ID -->
  <BS data="9802000001..."/>
</DRMInfo>

<!-- Widevine -->
<DRMInfo type="pssh" version="0">
  <BS ID128="edef8ba979d64acea3c827dcd51d21ed"/> <!-- System ID -->
  <BS data="12100123456789..."/>
</DRMInfo>

<!-- FairPlay -->
<DRMInfo type="pssh" version="0">
  <BS ID128="94CE86FB07FF4F43ADB893D2FA968CA2"/> <!-- System ID -->
</DRMInfo>

<CrypTrack trackID="1" IsEncrypted="1" constant_IV_size="16" constant_IV="0x01234567890123456789012345678901" saiSavedBox="senc">
<key KID="0x01234567890123456789012345678901" value="0x173b1ae9f0bfc8bafa20f98eba0e07d9" hlsInfo='URI="skd://01234567-8901-2345-6789-012345678901:01234567890123456789012345678901",KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1"'/>
</CrypTrack>

</GPACDRM>
```

A corresponding multi-DRM command-line is:

```
gpac -i input.mp4 cecrypt:cfile=../widevine.xml -o output/dash.mpd:pssh=mv:laurl=(widevine)https://drm.com/proxy?p=my_id,(widevine)https://drm.com/proxy?p=my_id,(fairplay)https://drm.com/auth?p=my_id&assetID=01234567-8901-2345-6789-012345678901:certurl=https://drm.com/cert.cer
```

# Using CPIX

[CPIX](https://dashif.org/CPIX/) is a document format for DRM information exchange. GPAC offers to parse CPIX documents. If the current parsing is too limited for your needs, please contact our [open-source](https://github.com/gpac/gpac/issues/new) or [commercial teams](mailto:romain.bouqueau@motionspell.com).

```
gpac -i input.mp4 cecrypt:cfile=cpix.xml:laurl=... -o output/dash.mpd:pssh=mv"
```
