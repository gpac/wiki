# BT Format {:data-level="all"}

BT stands for BIFS Text and is an exact textual representation of the MPEG-4 BIFS scene. Its syntax is the same as the VRML/X3D (.wrl and .x3dv files) ones for the scene description part, and it has been extended for other MPEG-4 tools (OD, OCI, IPMP).

You will find plenty of example BT files in the tutorial and regression test suite, and we strongly recommend using these to get more familiar with the BT syntax.

The BT language has been originally developed at ENST as the textual format of the late MP4Tool. The format is still enhanced at ENST for GPAC needs, but we try not to mess up too much with it to keep VRML compatibility.

There are 3 major parts in a BT file:

*   The root scene, made of a collection of PROTO nodes if desired, a single top level node and a list of routes for interaction if needed. This is the part common to BT and VRML formats.
*   The InitialObjectDescriptor, describing the streams that must be opened when opening the MPEG-4 scene. It usually contains a BIFS stream description and an OD stream description when visual/audio media are present in the scene.
*   A succession of modification to the scene and their associated timing.

## MP4Box specific BT syntax

The syntax of BIFS/OD commands in BT has been enhanced to enable animation stream and scalable description encodings. The new elements are placed at the access unit declaration 'AT TIMING' element:

*   '`RAP`' element: specifies the following access unit is a random access points. This is needed because MP4Box cannot currently compute the scene random access state per stream. Note however that the first access unit of any systems stream is considered as a random access point
*   '`IN`' element: specifies the following access unit happens in the stream of given ID.

For example, `RAP AT 1000 IN 20 { ... }` means that the access unit is a random access point, its timing is 1000 (in stream timescale) and it happens in stream whose ES\_ID is 20.

The syntax of the '`AT TIMING`' element has been extended to support differential timing to enable authors to specify relative time between commands rather than absolute timing. The differential timing is signaled by using a capital D before the timing itself. For example, `AT D2000 { ... }` means that this access unit occurs 2000 time ticks after the preceding access unit.

## Importing media with MP4Box and BT

MP4Box uses a specific descriptor for stream importing called MuxInfo. This descriptor is not normative (although used by MP4Tool and all tools from MPEG-4 Systems Reference Software). It is never encoded in the file. The modifications made to this descriptor are backward compatible with other tools using this descriptor. 

The current syntax is:

```

MuxInfo {

fileName

streamFormat

GroupID

startTime

duration

frameRate

useDataReference

noFrameDrop

SBR_Type

compactSize

textNode

fontNode
}

```

### Semantics :

`fileName` : specifies location of stream to import. Optional for BIFS/OD streams, required for others. Supported formats are the same as those supported by MP4Box:

*   AVI, MPEG: syntax `src_filename` if only one video in movie, otherwise `src_filename#audio`, `src_filename#video`.
*   MP3, AAC-ADTS, JPG, PNG, SRT, SUB: syntax `src_filename`.
*   [[NHNT|NHNT Format]]: syntax `src_filename` where fileName is either the ".nhnt" or the ".media" file of the NHNT source.
*   [[NHML|NHML Format]]: fileName must be the NHML source file.
*   IsoMedia (MP4/3GP): syntax `src_filename` if only one track in file, `src_filename#trackID` where TrackID is the ID of the track to import from `src_filename`.

`streamFormat` : optional, one of "AVI", "MP3", "JPEG", "PNG", "MP4", "NHNT", "SRT" depending on input type. This should not be needed as MP4Box uses the file extension to figure out the media format, it is kept for old BT compatibility.

`GroupID` : optional integer, specifies the multiplexing order in the final mp4. Media tracks are interleaved by groups, the group with the lowest ID being written first to disk. Using groups may greatly improve http streaming of the file.

`startTime` : optional integer, specifies the DTS/CTS of the first sample - by default the first sample imported has CTS/DTS 0. Expressed in milliseconds.

`duration` : optional integer, specifies run-time of media data (from source start) to import. Expressed in milliseconds.

`Note` : When creating OCR tracks in MP4, you must use the muxInfo.duration to specify the desired duration of the OCR track, otherwise the OCR track won't have any associated duration and will never stop (looping not possible).

`useDataReference` : optional boolean, specifies that media data shall not be copied in the final MP4 but only referenced. This may not be supported depending on input data framing. cf '-dref' option in MP4Box.

`frameRate` : overrides the source media framerate when possible (same as `MP4Box -fps`).

`noFrameDrop` : optional boolean for AVI import only, specifies that video shall be imported at constant frame rate, e.g. non coded frames in AVI file shall be kept in MP4. cf '-nodrop' option in MP4Box.

`SBR_Type` : optional string for AAC-SBR import only, either "implicit" or "explicit" - cf MP4Box -sbr and -sbrx options.

`compactSize` : optional string, either "TRUE" or "FALSE", indicating if sample sizes should be stored in a compact way or not.

`textNode, fontNode` : required string identifier for SRT importing, ignored for other streams. SRT importing is done by creating a BIFS animation stream carrying the text and fonts modifications (sample available in regression test suite).

*   The `textNode` shall be the DEF identifier of the text node to modify (it can be a proto, but then it MUST have an MFString field named "string")
*   The `fontNode` may be ignored. If set, it shall be the DEF identifier of the font node to modify (it can be a proto, but then it MUST have an SFString field named "style")

