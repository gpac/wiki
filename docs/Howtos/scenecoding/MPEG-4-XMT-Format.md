---
tags:
- mp4
- media
- isomedia
- data
- encode
- isobmff
- xml
- stream
---



# XMT Format {:data-level="all"}

XMT is the official textural description of MPEG-4 scenes. It is part of ISO/IEC 14496-11, and is quite similar to the X3D XML language. 

## Importing media with MP4Box and XMT

There is no standard element in XMT-A allowing to describe multiplexing parameters for MP4. In order to do this MP4Box uses an XML representation of `MuxInfo` in the `StreamSource` sub elements (encoding hints) called `MP4MuxHints`.

The complete syntax is:

```xml
<StreamSource url="filename" >
    <MP4MuxHints GroupID="..." startTime="..." duration="..." useDataReference="..." noFrameDrop="..." SBR_Type="..." frameRate="..." compactSize="..." textNode="..." fontNode="..." />
</StreamSource>
```

The streamFormat parameter is not represented in XMT-A.

_**Note**_ When decompressing an mp4 file to bt (XMT-A), a MuxInfo (MP4MuxHints) is automatically generated for all streams other than BIFS and OD in order to keep track of media location in the original MP4. You can then simply modify and re-encode the BT or XMT file without specifying the media data location.
