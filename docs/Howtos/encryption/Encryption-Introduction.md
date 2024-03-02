GPAC can be used to encrypt or decrypt media streams in a more or less format-agnostic manner, according to the Common Encryption, ISMA E&A and OMA DRM 2.0 specifications. An XML language is used by GPAC to get/set the encryption parameters.

GPAC supports the ISMA E&A specification, better known as ISMACryp. This specification provides reliable transmission of encrypted media data with key signaling and cryptographic re-synchronization in case of packet loss or random access.

GPAC partially supports the OMA DRM PDCF specification available [here](https://www.openmobilealliance.org/release/DRM/V2_1_2-20110531-A/OMA-TS-DRM_DCF-V2_1-20081014-A.pdf). This specification is derived from the ISMA E&A specification and OMA DRM PDCF files have a structure almost equivalent to ISMA protected files. GPAC does NOT support the ROAP protocol and other tools from the OMA DRM framework, but this could be added through a dedicated OMA DRM filter.

GPAC supports the complete Common Encryption specification. 

Note that ISMACryp or CENC do not mandate anything regarding how keys are to be distributed (hereafter referred to as `KMS - Key Management System`) which is up to the content provider/distributor. In other words, CENC and ISMACryp are concerned with cryptographic interoperability only, not rights management.

These specifications use for encryption the AES 128 bit algorithm in counter mode (AES-CTR) for ISMA/OMA and CENC, or in CBC mode for CENC. You do not need to know of all these things, the only thing you need to know is that you will need a 128 bit key and a 64 bit salt, which would have to be fetched by the client at some point for decryption. In this document, the key and the salt will simply be referred to as `key` unless specified otherwise.

One interesting feature of the CENC and ISMACryp specifications is that they allow for selective encryption, in other words you may decide to encrypt only specific samples in the media track rather than the whole media. Selective encryption will reduce the complexity of the decryption process, and may also be very nice in demonstrations - for example, encrypting only I-frames in a video can give very nice effects ...

If you are familiar with MPEG-4 IPMPX specification, you must be aware that this selective encryption is different from IPMP-X one: in CENC or ISMACryp, selective encryption means whether or not a sample is encrypted while in IPMP-X selective encryption usually means whether specific bitstream syntax elements (motion vectors, DCT, etc) are encrypted or not.

Another interesting feature of CENC and ISMACryp is the possibility to `roll` keys, e.g. have more than one key needed for stream decryption: sample-based synchronization of keys and media are provided in both specifications. GPAC does not currently support usage of multiple keys in ISMACryp, only one key can be used in the stream lifetime.
