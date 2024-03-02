# Overview

The multimedia packager available in GPAC is called MP4Box. It is mostly designed for processing ISOBMF files (e.g. MP4, 3GP), but can also be used to import/export media from container files like AVI, MPG, MKV, MPEG-2 TS ...

For detailed information on MP4Box options, check this wiki and `MP4Box -h`.

The command-line documentation available in this subsection is based on GPAC 2.0, and is automatically generated from the source tree on a daily basis.

In short, MP4Box can be used for:

* [manipulating](mp4box-gen-opts) ISOBMF files like MP4, 3GP, HEIF: removing/editing/tagging tracks, editing for specific devices, [tagging](mp4box-other-opts#tagging-support)... 
* [importing](mp4box-import-opts) audio, video and presentation data (including subtitles) from different sources and in different formats,
* packaging of content for [[HTTP Adaptive Streaming|DASH-intro]]  (MPEG-DASH, HLS), [RTP/RTSP](mp4box-other-opts#hinting-options) streaming or HTTP download
* editing/packaging of [HEIF image](mp4box-meta-opts) files
* [encryption and decryption](mp4box-gen-opts#encryptiondecryption-options) of streams
* [exporting and splitting](mp4box-dump-opts) ISOBMFF files
* [transcoding](mp4box-filters) audio and video
* [encoding/decoding](mp4box-scene-opts) presentation languages like MPEG-4 XMT or W3C SVG into/from binary formats like MPEG-4 BIFS or LASeR


# Examples

This section only lists very basic but common usage of MP4Box. For more examples, check GPAC [test suite](https://github.com/gpac/testsuite).

## Content Packaging

MP4Box can be used to repackage existing content to compliant ISO Base Media Files (MP4, 3GP, 3G2, OMA DCF). 

_Note  MP4Box prior to 0.9.0 does NOT re-encode audio, video and still image content, external tools shall be used for this purpose. With MP4Box 0.9.0 or above, MP4Box can be used in combination with encoding filters to [transcode the content](mp4box-filters)._

*   Remove specific track/streams from an MP4 file (this removes the third and fourth streams):

`MP4Box -rem 3 -rem 4 file.mp4`

*   Importing a media file to an existing MP4 file:

`MP4Box -add file.avi my_file.mp4`

*   Importing a media file to an new MP4 file:

`MP4Box -add file.avi -new new_file.mp4`

*   Adding a secondary audio track to the previous file:

`MP4Box -add audio2.mp3 new_file.mp4`

*   MP4Box can import specific media from an existing container. To get the supported media that can be imported from a container:

`MP4Box -info file`

*   Add a single audio stream  from a container:

`MP4Box -add file.mpg#audio new_file.mp4`

*   Add a specific duration of a media from a container:

`MP4Box -add file.mpg#audio:dur=10 new_file.mp4`

*   Adjust/correct a video stream with an incorrect aspect ratio (DAR = SAR x PAR):

`MP4Box -par 1=4:3 file.mp4`

*   To replace the label on an audio or subtitle track (uses udta "name" atom, shown by players like vlc):

`MP4Box -udta 3:type=name -udta 3:type=name:str="Director Commentary" file.mp4`

## Delivery Setup

MP4Box can be used to prepare files for different delivery protocols, mainly HTTP downloading or RTP streaming.

*   To prepare a file for simple progressive HTTP download, the following instruction will interleave file data by chunks of 500 milliseconds in order to enable playback while downloading the file (HTTP FastStart):

`MP4Box -inter 500 file.mp4`

*   To prepare for RTP, the following instruction will create RTP hint tracks for the file. This enables classic streaming servers like DarwinStreamingServer or QuickTime Streaming Server to deliver the file through RTSP/RTP:

`MP4Box -hint file.mp4`

*   To prepare for adaptive streaming (MPEG-DASH), the following instruction will create the DASH manifest and associated files. For more information on DASH see [[this page|DASH Support in MP4Box]]:

`MP4Box -dash 1000 file.mp4`

*   To prepare for CMAF MPEG-DASH and HLS:

```
MP4Box -dash 1000 file.mp4 -out live.m3u8:dual:cmaf
MP4Box -dash 1000 file.mp4 -out live.mpd --dual --cmaf
```

## Scene Transcoding

MP4Box can be used to encode MPEG-4 scene descriptions BIFS and LASeR and to decode MPEG-4 scene descriptions BIFS and LASeR.

*   To encode an existing description:

`MP4Box -mp4 scene.bt`

_Note MP4Box will do its best to encode VRML/X3D to MPEG-4, but that not all tools from X3D or VRML extensions are supported in MPEG-4._

*   To decode an existing BIFS track to a BIFS Text format (VRML-like format)description:

`MP4Box -bt file.mp4`

*   To decode an existing BIFS track to XMT-A format:

`MP4Box -xmt file.mp4`

*   To decode an existing LASeR track to an XSR format (SAF+LASeR Markup Language) description:

`MP4Box -lsr file.mp4`

*   To decode the first sample of an existing LASeR track to an SVG file:

`MP4Box -svg file.mp4`


