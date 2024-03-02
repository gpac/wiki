# OMA DRM authoring

In order to encrypt a 3GP/MP4 file into a PDCF file, MP4Box uses the same process as CENC or ISMA encryption, only the drm file syntax changes.

This page documents OMA-specific options of the DRM file, see [Common Encryption](Common-Encryption) for more details on generic options.

An `CryptTrack` element may have children describing the optional textual headers defined in OMA DRM 2.0. Each textual header is inserted as is during OMA encryption, so be careful not to specify twice the same header. More information on textual headers can be found in the [OMA (P)DCF specification](https://www.openmobilealliance.org/release/DRM/V2_1_2-20110531-A/OMA-TS-DRM_DCF-V2_1-20081014-A.pdf).

## XML Syntax

```xml
<GPACDRM type="OMA">
    <CryptTrack trackID="..." key="..." selectiveType="..." rightsIssuerURL="..." contentID="..." transactionID="..." >
        <OMATextHeader>textual header</OMATextHeader>
    </CryptTrack>
</GPACDRM>
```

## CrypTrack OMA-specific Semantics

*   `trackID` : specifies the track ID to encrypt (mandatory, see [Common Encryption](Common-Encryption) ).
*   `key` : the AES-128 bit key to use. The key must be specified as an 32 bytes hex string, like **0x2b7e151628aed2a6abf7158809cf4f3c**. This is a mandatory field, not specifying it or using an improper length will result in an error.
*   `rightsIssuerURL` : the URL of the OMA DRM licence server. This is the URL to which an OMA client will request the keys using the ROAP protocol.
*   `contentID` : a string identifier for the content, passed during ROAP exchanges.
*   `transactionID` : a string identifier for the transaction, passed during ROAP exchanges.
*   `selectiveType` : specifies how selective encryption is to be used, see [Common Encryption](Common-Encryption) for more details.

# Sample GPAC OMA drm files

The following example shows how to encrypt a file with one track, without selective encryption, using OMA DRM.

```xml
<?xml version="1.0" encoding="UTF-8" >
<OMADRM>
    <OMATrack trackID="1" key="0x2b7e151628aed2a6abf7158809cf4f3c" selectiveType="None" rightsIssuerURL="https://gpac.sourceforge.net/kms" contentID="WatchMe1984" transactionID="14fd12zd3q" >
        <OMATextHeader>Preview=instant;http://other.content.com/sonaive</OMATextHeader>
    </OMATrack>
</OMADRM>
```
