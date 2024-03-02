# ISMACryp authoring

In order to encrypt an MP4 file, MP4Box will need a specific file containing all cryptographic information, usually referred to as `drm_file` in MP4Box documentation. The command line is as follows:

```
MP4Box -crypt drm_file.xml movie.mp4 -out movie_encrypted.mp4
```

The DRM file is an XML document containing mainly key information, KMS information, encryption instructions and eventually MPEG-4 IPMP(X) indications. This page documents ISMA-specific options of the DRM file, see [Common Encryption](Common-Encryption) for more details on generic options.

## XML Syntax

```xml
<GPACDRM type="ISMA">
    <CrypTrack trackID="..." key="..." salt="..." scheme_URI="..." kms_URI="..." selectiveType="..." ipmpType="..." ipmpDescriptorID="..." />
</GPACDRM
```

## CrypTrack Semantics for ISMA

*   `trackID` : specifies the track ID to encrypt (mandatory, see [Common Encryption](Common-Encryption) ).
*   `key` : the AES-128 bit key to use. The key must be specified as an 32 bytes hex string, like **0x2b7e151628aed2a6abf7158809cf4f3c**. This is a mandatory field, not specifying it or using an improper length will result in an error.
*   `salt` : the 64 bit salt key to use for the counter mode. The salting key must be specified as an 16 bytes hex string, like **0xf8f9fafbfcfdfeff**. This is a mandatory field, not specifying it or using an improper length will result in an error.
*   `scheme_URI` : the URI of the scheme used for protection (for example the cryptographic tool provider). The default value is **urn:gpac:isma:encryption\_scheme**. This URI is added to the track meta-data.
*   `kms_URI` : the URI of the key management system. This is the URI to which an ISMACryp client will request the keys. This URI is added to the track meta-data. Apart from regular URLs and URIs, two specific values are interpreted by GPAC:
    *   **self** : the keys will be written in the media track meta-data using base64 encoding. This is mainly useful for testing :)
    *   **file** : the URI will be set to this drm\_file name as given to MP4Box - in other words, if you indicate a relative path for the drm\_file, then the relative path will be used for the KMS URI.
*   `selectiveType` : specifies how selective encryption is to be used. See [Common Encryption](Common-Encryption) for more details
*   `ipmpType` : specifies what kind of MPEG-4 IPMP signaling must be used for this media. The possible values are:
    *   **None** : no MPEG-4 IPMP signaling.
    *   **IPMP** : use MPEG-4 IPMP (`the hooks`) signaling.
    *   **IPMPX** : use MPEG-4 IPMP-X (`ISO-IEC 14496-13` signaling.
*   `ipmpDescriptorID` : specifies the IPMP(X) descriptor ID for this media. If not set, **defaults to the media track 1-based index**. Ignored when IPMP(X) signaling is not used.

# Sample GPAC ISMA drm files

The following example shows how to encrypt a file with one track, using selective encryption of RAP samples, embedded keys and no IPMP signaling.

```xml
<?xml version="1.0" encoding="UTF-8" >
<GPACDRM type="ISMA">
	<CrypTrack trackID="1" key="0x2b7e151628aed2a6abf7158809cf4f3c" salt="0xf8f9fafbfcfdfeff" selectiveType="RAP" KMS_URI="self"/>
</GPACDRM>
```

The following example shows how to encrypt a file with one track, using random encryption over 30 samples, using the source file as KMS URI and IPMP-X signaling.

```xml
<?xml version="1.0" encoding="UTF-8" >
<GPACDRM type="ISMA">
	<CrypTrack trackID="1" key="0x2b7e151628aed2a6abf7158809cf4f3c" salt="0xf8f9fafbfcfdfeff" selectiveType="Rand30" KMS_URI="file" ipmpType="IPMPX" ipmpDescriptorID="20" />
</GPACDRM>
```

The following example shows how to encrypt a file with one track, without selective encryption, a KMS URI and no IPMP signaling.

```xml
<?xml version="1.0" encoding="UTF-8" >
<GPACDRM type="ISMA">
	<CrypTrack trackID="1" key="0x2b7e151628aed2a6abf7158809cf4f3c" salt="0xf8f9fafbfcfdfeff" selectiveType="None" KMS_URI="https://gpac.sourceforge.net/kms/file.xml" />
</GPACDRM>
```

# Decrypting a file with GPAC

MP4Box/GPAC players will attempt to load the keys from a KMS URI as follows:

*   if kms\_URI begins with **(key)**, the keys are Base64 encoded in the track and can be fetched. This corresponds to the case of special value `kms_URI="self"` when encrypting.
*   if the scheme URI is GPAC default one (**urn:gpac:isma:encryption\_scheme**) and the kms\_URI points to a file (ONLY LOCAL FILES FOR MP4BOX), the key and salt will be fetched from this file. This corresponds to the case of special value `kms_URI="file"` when encrypting. In this case only the `trackID`, `key` and `salt` attributes of the **ISMACrypTrack**element are needed.
*   if kms\_URI is `AudioKey` or `VideoKey`, KMS is assumed to be MPEG4IP one and the file ~/.kms\_data is checked (cf [MPEG4IP](https://sourceforge.net/projects/mpeg4ip/) documentation).

In all other cases:

*   For MP4Box: You will need to provide a drm\_file for decryption (e.g. `MP4Box -decrypt drm_file myfile.mp4`).
*   For GPAC client: key fetching will fail and the stream will be decoded WITHOUT being decrypted.
