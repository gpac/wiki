---
tags:
- data
- codec
- multiplexer
- sample
- frame
- stream
- encode
- bitstream
- bitrate
- sequence
- media
- decoder
- track
- mp4
- source
- input
- nhnt
- decoding
- mpeg
- encoder
---



# NHNT Overview {: data-level="all"}
The NHNT format has been developed during the MPEG-4 Systems implementation phase, as a way to easily mux unknown media formats to an MP4 file or an MPEG-4 multiplex. The goal was to have the media encoder produce a description of the media time fragmentation (access units and timestamps) that could be reused by a media-unaware MPEG-4 multiplexer.

A NHNT source is composed of 2 or 3 parts:

*   **the media file**: This file contains all the media data as written by the encoder. The file extension must be `.media`.
*   **the NHNT (meta) file**: This file contains all the information needed by the MPEG-4 multiplexer to use the media data. The file extension must be `.nhnt`.
*   **the decoder initialization file**: If the media format requires decoder configuration data (MPEG-4 Visual, AAC, AVC/H264, ...), the binary data is put in this third file in order for the MPEG-4 multiplexer to correctly signal decoder configuration. This is required by the fact that in MPEG-4 Systems, configuration data is never sent in-band of the media stream, but through the object descriptor stream. The file extension must be `.info`.

## The NHNT file format

A NHNT file is made of a header, and a set of access units descriptors. All integers are written in network-byte order.

### Header Syntax

```c
char Signature[4];
bit(8) version;
bit(8) streamType;
bit(8) objectTypeIndication;
bit(16) reserved = 0;
bit(24) bufferSizeDB;
bit(32) avgBitRate;
bit(32) maxBitRate;
bit(32) timeStampResolution;
```

### Semantics

*   `Signature` : identifies the file as an NHNT file. The signature must be 'NHnt' or 'NHnl' for large files (using 64 bits offsets and timestamps).
*   `version` : identifies the NHNT version used to produce the file. Default version is 0.
*   `streamType` : identifies the media streamType as specified in MPEG-4 (0x04: Visual, 0x05: audio, ...). Officially supported stream types are listed [here](https://mp4ra.org/registered-types/object-types).
*   `objectTypeIndication` : identifies the media type as specified in MPEG-4. For example, 0x40 for MPEG-4 AAC. Officially supported object types are listed [here](https://mp4ra.org/registered-types/object-types).
*   `bufferSizeDB` : indicates the size of the decoding buffer for this stream in byte.
*   `avgBitRate` : indicates the average bitrate in bits per second of this elementary stream. For streams with variable bitrate this value shall be set to zero.
*   `maxBitRate` : indicates the maximum bitrate in bits per second of this elementary stream in any time window of one second duration.
*   `timeStampResolution` : indicates the unit in which the media timestamps are expressed in the file (`timeStampResolution` ticks = 1 second).

After the header, the file is just a succession of access unit (sample) info until the end of the file.

### Sample Header Syntax for 'NHnt' files

```c
bit(24) data_size;
bit(1) random_access_point;
bit(1) au_start_flag;
bit(1) au_end_flag;
bit(3) reserved = 0;
bit(2) frame_type;
bit(32) file_offset;
bit(32) compositionTimeStamp;
bit(32) decodingTimeStamp;
```

### Sample Header Syntax for 'NHnl' files

```c
bit(24) data_size;
bit(1) random_access_point;
bit(1) au_start_flag;
bit(1) au_end_flag;
bit(3) reserved = 0;
bit(2) frame_type;
bit(64) file_offset;
bit(64) compositionTimeStamp;
bit(64) decodingTimeStamp;
```

### Semantics

*   `data_size` : indicates the amount of data to fetch from the source file for this access unit.
*   `random_access_point` : indicates if the access unit is a random access point.
*   `au_start_flag` : indicates if this is the start of an access unit or not.
*   `au_end_flag` : indicates if this is the end of an access unit or not.
*   `frame_type` : Used for bidirectional video coding sources only, 0 otherwise.
    *   **frame\_type=2**: access unit is a B-frame
    *   **frame\_type=1**: access unit is a P-frame
    *   **frame\_type=0**: access unit is an I-frame
*   `file_offset` : indicates the position in the source file of the first byte to fetch for this data chunk.
*   `compositionTimeStamp` : indicates the composition (presentation) time stamp of this access unit.
*   `decodingTimeStamp` : indicates the decoding time stamp of this access unit.

**Note** : Samples must be described in decoding order in the nhnt file when using sample fragmentation. Otherwise, sample may be described out of order.
