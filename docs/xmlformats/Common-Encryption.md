_MP4Box is able to encrypt and decrypt ISOBMFF files according to CENC specification (ISO/IEC 23001-7:2016), including latest pattern encryption tools introduced in the standard._ 

_In order to encrypt or decrypt an MP4 file, MP4Box will need a side file containing all information about crypto/DRM system and the information needed to encrypt a given track, hereafter referred as `drm_file`. Sample files are available in [GPAC's test suite](https://github.com/gpac/testsuite/tree/filters/media/encryption)._ 

_The file is an XML with a root element called `GPACDRM` with one or more `CrypTrack` children, zero or more `DRMInfo` children and  zero or more `DRMInfoTemplate` children._
_Just like any XML file, the file must begin with the usual xml header. The file MUST be encoded in UTF-8._ 

# XML Syntax {: data-level="all"}

```xml
<GPACDRM type="...">
 <DRMInfo >
    ...
 </DRMInfo>
 <CrypTrack  trackID="..." [see possible attributes below] >
  <key KID="..." value="..."/>
  <key KID="..." value="..."/>
 </CrypTrack>
</GPACDRM>
```

# GPACDRM Element Semantics

*   `type` : is the default protection scheme type used for all tracks in the source media file. The possible values are (full name or 4 char code):
    *   **ISMA** or **iAEC**: ISMA E&A (ISMACryp) Scheme
    *   **Adobe** or **adkm**: Adobe Scheme
    *   **CENC AES-CTR** or **cenc**: CENC Protection Scheme using AES 128-bit keys in Counter Mode (AES-128 CTR),
    *   **CENC AES-CBC** or **cbc1**: CENC Protection Scheme using AES 128-bit keys in Cipher-block chaining mode (AES-128 CBC),
    *   **CENC AES-CTR Pattern** or **cens**: CENC Protection Scheme using AES 128-bit keys in Counter Mode (AES-128 CTR) using pattern of unencrypted/encrypted bytes,
    *   **CENC AES-CBC Pattern** or **cbcs**: CENC Protection Scheme using AES 128-bit keys in Cipher-block chaining mode (AES-128 CBC) using pattern of unencrypted/encrypted bytes.
    *   **piff**: PIFF Protection Scheme using AES 128-bit keys in Counter Mode (AES-128 CTR); this will force using PIFF specific boxes for storage of CENC information.
    *   **HLS SAES**: HLS Sample-AES Protection Scheme (AES-128 CBC) using pattern of unencrypted/encrypted bytes, 32 bytes clear header for AVC and 16 bytes clear header for AAC, used for SAES with MPEG-2 TS. Constant IV shall be used, and pattern {1 crypt, 9 clear} is always enforced.


## DRMInfo Element Semantics
The `DRMInfo` element contains information needed by a Content Protection System to play back the content such as SystemID, the URL of license server(s) or rights issuer(s) used, embedded licenses/rights, embedded keys(s), and/or other protection system specific metadata. It is possible to specify  more than one DRM system by using one DRMInfo element per system ID. 
The children of this element use the binary XML construction of GPAC to build a binary blob representing:

- the CENC PSSH box payload without box size, type, version and no data size field
- or a complete pssh box 

The payload of a DRMInfo describing a PSSH blob can be encrypted using AES-128 CTR mode. In this case, the first byte of PSSH data is the first byte after the SystemID (version 0 of PSSH) or after the list of keys (version 1 of PSSH).

*   `type`: the only defined value is **pssh**, indicating this DRMInfo describes a PSSH blob.
*   `version`: if 0, indicates the payload is a PSSH version 0 (no key IDs given after the 16-bytes SystemID), otherwise a version 1 or more of PSSH.
*   `cypherMode`: indicates the cypher mode of the PSSH blob. Possible values are:
    *   **no** : no encryption (default if no cypher key is given)
    *   **yes** : encrypts all PSSH data in AES-128 CTR mode (default if cypher key is given)
*   `cypherKey`: indicates the cypher key to use (16 bytes). If not present, PSSH data is not encrypted.
*   `cypherIV`: indicates the cypher IV to use (16 bytes). If not present, PSSH data is not encrypted.
*   `cypherOffset`: indicates the offset in PSSH data to start encryption from, 0 if not present. 

The following example shows a simple GPAC DRM system info:
    
### Simple GPAC DRM system info
    
    ```xml
    <!-- example for GPAC 'clear' DRM System - keys are listed after the content and UL follows -->
    <DRMInfo type="pssh" version="1" cypherOffset="9" cypherKey="0x6770616363656E6364726D746F6F6C31" cypherIV="0x00000000000000000000000000000001">
        <!-- this indicates the PSSH SystemID -->
        <BS ID128="6770616363656E6364726D746F6F6C31"/>
        <!-- this indicates the PSSH number of keys (version 1), on 32 bits -->
        <BS value="2" bits="32"/>
        <!-- this gives the two key IDs in the PSSH (version 1) -->
        <BS ID128="0x279926496a7f5d25da69f2b3b2799a7f"/>
        <BS ID128="0x676cb88f302d10227992649885984045"/>
        <!-- the rest describe the remaining of the PSSH blob, the cypherOffset of 9 will keep the first 8 bytes in the clear -->
        <BS bits="8" string="CID=Toto"/>
        <BS ID128="0xccc0f2b3b279926496a7f5d25da692f6"/>
        <BS ID128="0xccc0f2b3b279926496a7f5d25da692d6"/>
    </DRMInfo>
    ```
## CrypTrack Element Semantics
    
*   `trackID` or `ID`: specifies the track ID to encrypt. If not set, this crypt configuration applies to all tracks for which no `CrypTrack` with a `trackID` is specified.
*   `type`: is the protection scheme type used for this track. If not set, use the type specified at `GPACDRM` level. Syntax is the same as type at `GPACDRM` level.
*   `forceType`: if set, `type` is used during decryption instead of scheme type information indicated in encrypted track.
*   `IsEncrypted` : is the flag which indicates the encryption state of the samples in this track. Default is 1.
*   `IV_size` : is the size in bytes of the Initialization Vector. It should be 0 (if track is not encrypted i.e the IsEncrypted flag is 0x0), 8 or 16. When not set, guessed from the size of the `first_IV` attribute. If `cbcs` mode is used, this attribute is equivalent to `constant_IV_size`.
*   `first_IV` : is the first Initialization Vector used for this track. If the scheme type uses constant IV and `constant_IV` attribute is not present, this will be used as constant IV. When set, this must describe an 8 or 16 byte key. If `cbcs` mode is used, this attribute is equivalent to `constant_IV`.

*   `selectiveType` : specifies how selective encryption is to be used. The possible values are:
    *   **None** : no selective encryption, all samples encrypted (this is the default behavior).
    *   **Clear**: samples are not encrypted but track is signaled as using encryption and sample group seig is used.
    *   ForceClear[=N]**: samples are not encrypted, track is signaled as using encryption but no sample groups are used. If `N` is set, only leaves the first N samples in the clear and switch to regular encryption after. If N is 0, all samples are encrypted. If N is -1, no samples are encrypted.
    *   **RAP** : only Random Access Samples (key frames) will be encrypted. If all media samples are RAPs, this defaults to `None`.
    *   **Non-RAP** : only non-Random Access Samples (non-key frames) will be encrypted. If all media samples are RAPs, this defaults to `None`.
    *   **Rand** : random selection of samples to encrypt is performed.
    *   **X** : encrypts the first sample every `X` samples. `X` must be an integer greater than 2.
    *   **RandX** : encrypts one random samples out of `X` samples. `X` must be an integer greater than 2.
*   `saiSavedBox` : type of the box where we save the CENC sample auxiliary information. The possible values are:
    *   **uuid\_psec** : box type 'uuid', extend-type = 0xA2394F52-5A9B-4f14-A244-6C427C648DF4, according to The Protected Interoperable File Format (PIFF) specification of Microsoft.
    *   **senc** : box type 'senc', according to HbbTV 1.5 and CFF 1.0.5 specifications. This is the default value.
*   `keyRoll` : key selection policy and key rolling configuration. Common Encryption allows groups of samples within the track to use different keys. The encryption parameters (i.e KID, initialization vector size and encryption flag) are contained in a 'SampleGroupDescriptionBox' and will override the default parameters for this track. The first key is assigned to the first set of samples, and key index is incremented based on the roll type and roll number `N`, and rolls back to 0 if greater than number of defined keys. If roll number `N` is not set or is 0, value 1 is assumed. The possible values are:
    *   **idx=N** : use only key whose index is N (zero-based index) for encrypting this track. By default, the first key (N=0) is used.
    *   **samp[=N]** or **roll[=N]** :  roll keys at every `N` samples.
    *   **rap[=N]** : roll keys at every N packets of SAP type 1 or 2 (closed gop) for streams having SAPs, do not roll key for others (all-intra, audio, ...)
    *   **seg[=N]** : roll keys every N DASH/HLS segment. Input must use segment boundary signaling.
    *   **period[=N]** : roll keys every N DASH periods. Input must use segment boundary signaling.
*   `skip_byte_block` : number of 16-bytes blocks in the clear at the beginning of the encryption pattern. When not set and the scheme type uses pattern (cens, cbcs), a value of 9 is assumed for NAL-based tracks and 0 for other tracks.
*   `crypt_byte_block` : number of 16-bytes blocks encrypted at the beginning of the encryption pattern. When not set and the scheme type uses pattern (cens, cbcs), a value of 1 is assumed.
*   `byte_offset` : number of bytes to leave in the clear (defaut: auto) at the begining of each NALU/OBU/etc. The final value will be at least the slice header size.
*   `constant_IV_size` : size of constant IV used in pattern encryption mode. When not set, guessed from the size of the `constant_IV` attribute.
*   `constant_IV` : constant IV used for all samples in cbcs pattern encryption mode. If `IV_size` is set, constant IV is ignored and each sample has a dedicated IV.  If the scheme type does not use constant IV and `first_IV` attribute is not present, this will be used as the first IV.
*   `encryptSliceHeader`: enables old behavior for cenc scheme for AVC in avc1 mode, for which slice headers (and other nal such as SEI) can be encrypted.
*   `clear_bytes`: number of bytes to leave in the clear for non NAL-based tracks. Only used in cbcs mode.
*   `blockAlign`: for 'cenc' scheme, enforces block alignment (multiple of 16 bytes) for encrypted part of subsamples to avoid partial cipher blocks at the end of subsamples. The possible values are:
    *   **always**: always perform block alignment, even if resulting sample is not encrypted
    *   **disable**: never perform block alignment
    *   **default**: performs block alignment unless the resulting sample would not be encrypted. This is the default behaviour.

*   `clearStsd`: indicates if a non-protected sample entry shall be used for non-protected samples. The possible values are:
    *   **none**: no additional sample entry is used (default)
    *   **before**: a clear sample entry is used for non-protected sample, declared before the protected sample entry in `stsd` box
    *   **after**: a clear sample entry is used for non-protected sample, declared after the protected sample entry in `stsd` box

*   `subsamples` : allows selective encryption of subsamples. This can take one or more options, separated by a semi-colon:
    *   **subs=a,b,c** : encrypt only VCL subsample with the given indices. (Note: we use 1-based index)
    *   **rand[=N]** : select a subsample for encryption if rand() % N is 0 (default N is 2)

*   `multikey` : enables multi key per samples. When multi-key is enabled, `keyRoll` is ignored and all defined keys are used for multikey. Possible values are:
    *   **on**, **all** : encrypt using multi key per sample (one per subsample), rotating keys at each VCL NAL / video OBU. (Note: we use 1-based index)
    *   **no** : do not use multi key (default)
    *   **roll[=N]** : use multi-key and roll the key every N VCL NAL / video OBU (a value of 0 disable key roll, using a single key for each subsample)
    *   **subs=a,b,c** : use indicated key index per VCL NAL/OBU. Value 0 means leave VCL unencrypted. If more subsamples than keys, remaining subsamples are left unencrypted

*   `random` : generates random number for IV, keys and KIDs, typically used together with `DRMInfoTemplate`. If set to `true` or `yes`, all key definitions are ignored.

## Key Element Semantics
The `Key` element is used to specify key(s) applying to the parent track. This element must be a child of a `CrypTrack` Element.
The key ID and value must be specified as a 32 bytes hex string, using an improper length will result in an error. At least one key shall be defined. Key selection policy and key rolling are defined by `keyRoll` attribute.
If the KID attribute is not specified, the key will match any KID in the file. Such a key should be placed after all other key declarations.

 The defined attributes are:

*   `KID` : the ID of the key (KID in CENC) to use
*    `value`: the AES-128 bit key corresponding to this KID to use. 
*    `hlsInfo`: the associated info for HLS, must contain at least `URI="..."`  and may also contain other params of EXT-X-KEY, except `METHOD` which is set by GPAC. Multiple key options may be specified using `URI="uri1",KEYFORMAT="identity",URI="uri1",KEYFORMAT="myown"` (the code will look for `,URI` as a separator.
*   `IV_size` : the IV size of the key. If not set, use the one defined at the CryptTrack level.
*   `constant_IV` : constant IV associated with key. If not set, use the one defined at the CryptTrack level.
*   `rep` : ID of DASH representation (decryption only).
*   `period` : ID of DASH period (decryption only).
*   `as` : ID of DASH AdaptationSet (decryption only).


The `rep`, `period` and `as` attributes can be used to differentiate keys with the same KID but with different key values used in different DASH qualities, Adaptation Sets or periods while using a single DRM file.


## DRMInfoTemplate Element Semantics
The `DRMInfoTemplate` element describes information for a Content Protection System to be injected at each key change.
This is typically used when `DRMInfo` contains information about a root key, and keys are then delivered inband crypted with this root key.

The children of this element use the binary XML construction of GPAC to build the CENC PSSH payload. 

The payload of a DRMInfoTemplate describing a PSSH blob is not encrypted, however the key value is encrypted using AES-128 in CTR, CBC or ECB mode.

*   `version`: if 0, indicates the payload is a PSSH version 0 (no key IDs given after the 16-bytes SystemID), otherwise a version 1 or more of PSSH. Default value is 1.
*   `system`: indicates the systemID, as written in pssh (16 bytes). It must be provided.
*   `key`: indicates the cypher key to use (16 bytes). It must be provided.
*    `mode`: indicate cypher mode, either `cbc` (default) , `ctr` or `ecb`
*   `IV`: indicates the cypher IV to use (16 bytes) for `cbc` or  `ctr` encryption, set to 0 if not present.

There can be multiple `DRMInfoTemplate`, typically one per system ID.

When a new key is activated, each `DRMInfoTemplate` will be serialized with the following templating:

-  in the first child `<BS>` element with an attribute `ID128` set to `KEY`, attribute value is replaced with the encrypted value of the new key (encrypted with `DRMInfoTemplate@key`)
-  in the first child `<BS>` element with an attribute `ID128` set to `KID`, attribute value is replaced with the new key ID (usually not needed if using pssh version 1)

The following example shows a simple DRMInfoTemplate info:
    
```xml
<DRMInfoTemplate version="1" system="6770616363656E6364726D746F6F6C31" KEY="0x5344694d47473326622665665a396b30">
<BS ID128="KEY"/>
</DRMInfoTemplate>
```

This will generate a PSSH blob version 1 (including the new KID) with the new key value as payload of PSSH.

You can customize the payload with other `<BS>` elements.

__WARNING Non-fragmented files produced with this approach are not CENC-compatible as multiple PSSHs varying over time cannot be represented in CENC at the current time.
GPAC uses a sample group of type `PSSH` to store this info, each entry being the concatenation of box content of all active PSSHs (cf `CENC_PSSH` [property](filters_properties) ).__

_Note: templating is only supported for single key mode, multi-keys per sample cannot use templating at the current time._

# Encrypting/Decrypting a MP4 file with GPAC

The command line is as follows:

```
MP4Box -crypt drm_file.xml movie.mp4 -out movie_encrypted.mp4
MP4Box -decrypt drm_file.xml movie_encrypted.mp4 -out movie_decrypted.mp4
```

The following example shows an example file `drm_file_gpac_clear.xml` for encrypting all samples in a track, using only one key, and with GPAC 'clear' DRM System:

## drm\_file\_gpac\_clear.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GPACDRM type="CENC AES-CTR">
<!-- example for GPAC 'clear' DRM System - keys are listed after the content and UL follows -->
    <DRMInfo type="pssh" version="1" cypherOffset="9" cypherKey="0x6770616363656E6364726D746F6F6C31" cypherIV="0x00000000000000000000000000000001">
        <BS ID128="6770616363656E6364726D746F6F6C31"/>
        <BS value="2" bits="32"/>
        <BS ID128="0x279926496a7f5d25da69f2b3b2799a7f"/>
        <BS ID128="0x676cb88f302d10227992649885984045"/>
        <BS bits="8" string="CID=Toto"/>
        <BS ID128="0xccc0f2b3b279926496a7f5d25da692f6"/>
        <BS ID128="0xccc0f2b3b279926496a7f5d25da692d6"/>
    </DRMInfo>
    <CrypTrack trackID="1" IsEncrypted="1" IV_size="16" first_IV="0x0a610676cb88f302d10ac8bc66e039ed" saiSavedBox="senc">
        <key KID="0x279926496a7f5d25da69f2b3b2799a7f" value="0xccc0f2b3b279926496a7f5d25da692f6"/>
        <key KID="0x676cb88f302d10227992649885984045" value="0xccc0f2b3b279926496a7f5d25da692d6"/>
    </CrypTrack>
</GPACDRM>
```

In the above XML, the `BS` element from NHML syntax is used to describe what needs to be written in the PSSH box. In this example, the PSSH block contains:

*   128 bit system ID
*   key IDs count (2) on 32 bits
*   two key IDs on 128 bits each
*   8 byte string prefixed with a length size on 8 bits
*   two keys on 128 bits each

For more information on what is supported by the `BS` element, check the [[NHML documentation|NHML Format]]. 

Another example `drm_file_2_drms.xml` shows how to use 2 DRM Systems:

## drm\_file\_2\_drms.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GPACDRM type="CENC AES-CTR">
<!-- PlayReady - data contains the cyphered key & co -->
    <DRMInfo type="pssh" version="0">
        <BS ID128="9A04F07998404286AB92E65BE0885F95"/> <!-- SystemID -->
        <BS data="application/data;base64:ACE125"/> <!-- binary blob, could also use dataFile="cenc_blob.bin" -->
    </DRMInfo>
    <!-- GPAC 'clear' DRM System - keys are listed after the content and UL follows -->
    <DRMInfo type="pssh" version="1" cypherOffset="9" cypherKey="0x6770616363656E6364726D746F6F6C31" cypherIV="0x00000000000000000000000000000001">
        <BS ID128="6770616363656E6364726D746F6F6C31"/>
        <BS value="2" bits="32"/>
        <BS ID128="0x279926496a7f5d25da69f2b3b2799a7f"/>
        <BS ID128="0x676cb88f302d10227992649885984045"/>
        <BS bits="8" string="CID=Toto"/>
        <BS ID128="0xccc0f2b3b279926496a7f5d25da692f6"/>
        <BS ID128="0xccc0f2b3b279926496a7f5d25da692d6"/>
    </DRMInfo>
    <CrypTrack trackID="1" IsEncrypted="1" IV_size="16" first_IV="0x0a610676cb88f302d10ac8bc66e039ed" saiSavedBox="senc">
        <key KID="0x279926496a7f5d25da69f2b3b2799a7f" value="0xccc0f2b3b279926496a7f5d25da692f6"/>
        <key KID="0x676cb88f302d10227992649885984045" value="0xccc0f2b3b279926496a7f5d25da692d6"/>
    </CrypTrack>
</GPACDRM>
```

In the above XML, there are 2 PSSH blocks. For a non-GPAC DRM block, the opaque DRM specific data can be generated using the BS syntax or read from a data attribute or from a file indicated in dataFile attribute. Another example `drm_file_rap.xml` shows an advanced case: we will encrypt only the RAP and we use also key rolling policy.

## drm\_file\_rap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GPACDRM type="CENC AES-CTR">
    <DRMInfo type="pssh" version="1" cypherOffset="9" cypherKey="0x6770616363656E6364726D746F6F6C31" cypherIV="0x00000000000000000000000000000001">
        <BS ID128="6770616363656E6364726D746F6F6C31"/>
        <BS value="4" bits="32"/>
        <BS ID128="0x279926496a7f5d25da69f2b3b2799a7f"/>
        <BS ID128="0x597669572e55547e656b56586e2f6f68"/>
        <BS ID128="0x205b2b293a342f3d3268293e6f6f4e29"/>
        <BS ID128="0x32783e367c2e4d4d6b46467b3e6b5478"/>
        <BS bits="8" string="CID=Toto"/>>
        <BS ID128="0x5544694d47473326622665665a396b36"/>
        <BS ID128="0x7959493a764556786527517849756635"/>
        <BS ID128="0x3a4f3674376d6c48675a273464447b40"/>
        <BS ID128="0x3e213f6d45584f51713d534f4b417855"/>
    </DRMInfo>
    <CrypTrack trackID="1" IsEncrypted="1" IV_size="16" first_IV="0x0a610676cb88f302d10ac8bc66e039ed" selectiveType="RAP" saiSavedBox="senc" keyRoll="roll=5">
        <key KID="0x279926496a7f5d25da69f2b3b2799a7f" value="0x5544694d47473326622665665a396b36"/>
        <key KID="0x597669572e55547e656b56586e2f6f68" value="0x7959493a764556786527517849756635"/>
        <key KID="0x205b2b293a342f3d3268293e6f6f4e29" value="0x3a4f3674376d6c48675a273464447b40"/>
        <key KID="0x32783e367c2e4d4d6b46467b3e6b5478" value="0x3e213f6d45584f51713d534f4b417855"/>
    </CrypTrack>
</GPACDRM>
```

# Adobe's Protection Scheme Support in MP4Box

Adobe's Protection Scheme is supported in GPAC (dump/encrypt/decrypt) using the base syntax. The below example shows a `drm_file` using for Adobe cryto:

## drm\_file.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GPACDRM type="ADOBE">
    <CrypTrack trackID="1" IsEncrypted="1" first_IV="0x0a610676cb88f302d10ac8bc66e039ed" selectiveType="RAP" metadata="url=toto" metadata_len="8">
        <key value="0x5544694d47473326622665665a396b36"/>
    </CrypTrack>
</GPACDRM>
```

In this example, `metadata` is a string used by the DRM client to retrieve decryption key

# Playing an encrypted file with GPAC Player
## GPAC DRM format

GPAC Player can play protected files which use the GPAC SystemID. This system is mostly used for test purposes, as keys are carried encrypted with a fixed, public _system_ key.

The SystemID and _system_ key are _0x6770616363656E6364726D746F6F6C31_.

The PSSH version is used as follows:

- version 0 (no KID) indicates that inband keys are used (key rolling)
- version 1 identifies regular keys.

_Note: a version 1 with a single KID set to GPAC SystemID is equivalent to a version 0._

The specific DRM info (following KIDs + 32 bits private_data_len) is structured as:

- 8 bit field indicating a length `N` followed by `N` bytes of clear data `D`. This may be omitted.
  - if the first 6 bytes of `D` equal `master`, this indicates a master key - only the first KID/KEY value is used
  - if the first 4 bytes of `D` equal `leaf`, this indicates a leaf key - only the first KID/KEY value is used
  - if `N=0` or field is absent, this indicates a leaf key if a master key is in place, or regular keys otherwise. If inband keys are used or key is a leaf key, only the first KID/KEY value is used.

- encrypted keys (nbKIDs * 16 bytes)
	- a leaf key is encrypted in CBC using master key
	- an inband key is encrypted in CBC using _system_ key
	- all other keys are encrypted in CTR mode with an IV value of 1

- the remainder of the data is ignored


## ClearKey
GPAC can fetch keys from ClearKey server as announced in the DASH manifest

## Custom formats

If you want to play with the sample decryption module to add your own CENC system, have a look at [gpac/src/filters/decrypt\_cenc\_isma.c](https://github.com/gpac/gpac/blob/master/src/filters/decrypt_cenc_isma.c).

You don't need to modify the encryptor, only inject the data you need in the DRM configuration.
