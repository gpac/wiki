With [our work](https://biblio.telecom-paristech.fr/cgi-bin/download.cgi?id=11076) on [Dynamic Adaptive Streaming over HTTP (DASH)](https://www.slideshare.net/christian.timmerer/http-streaming-of-mpeg-media), in the current version of GPAC (revision 2642 on SVN), we now have many options for interleaving, fragmenting and segmenting ... which may be confusing.

It is time to clarify their usage in MP4Box. Some related aspects using MPEG-2 TS instead of MP4 can be seen in this [previous post](http://concolato.wp.imt.fr/2011/01/10/gpac-and-digital-radio-services/).

The options are:

```
-inter time_in_ms (with possibly -tight) or -flat (no interleaving)
-frag time_in_ms
-dash dur_in_ms
-split time_sec (or -split-size)
```

Interleaving (`-inter`) is when (groups of) samples of different tracks are stored alternatively in the file: e.g. N milliseconds of video samples, followed by N milliseconds of audio samples, followed by N milliseconds of video samples ... Typically, interleaved samples are grouped within an interleaving window. Interleaving reduces disk accesses, playback buffer requirements and enables progressive download and playback.

Fragmentation (`-frag`) is an optional process applicable to the MP4 file format. By default, MP4 files generated with MP4Box are not fragmented. This process consists in using Movie Fragments (moof). Movie Fragments is a tool introduced in the ISO spec to improve recording of long-running sequences and that is now used for HTTP streaming. Even if it is possible, according to the ISO spec, to do interleaving on fragments, MP4Box currently does not support it, because we don't see important use cases for it. For instance, all audio samples within a fragment are contiguously stored and similarly for the video samples. The only way to 'interleave' tracks is to have small fragments. There may be some overhead for big files, we welcome comments on this.

Segmentation (`-dash`) is the process of creating segments, parts of an original file meant for individual/separate HTTP download (not necessarily for individual playback). A segment can be a part of a big file or a separate file. It is not specific to the MP4 file format (in particular it may apply to MPEG-2 TS) but a segment may imply specific ISO signaling (`styp` and `sidx` boxes, for instance). A segment is what is referred to by the XML file used to drive the HTTP Streaming and segment boundaries can be convenient places for bitstream switching. Segmentation often implies fragmentation but not necessarily.

Last, MP4Box can split (-split) a file and create individual playable files from an original one. It does not use segmentation in the above sense, it removes fragmentation and can use interleaving.

Some examples of MP4Box usages:
- Rewrites a file with an interleaving window of 1 sec.

`MP4Box -inter 1000 file.mp4`

- Rewrites a file with 10 sec. fragments

`MP4Box -frag 10000 file.mp4`

- Rewrites a file (and creates the associated XML) with 10 sec. fragments and 30 sec. segments

`MP4Box -frag 10000 -dash 30000 file.mp4`

- Segmentation of a file into 30 sec. segment files with 10 sec. fragments (and creation of the associated XML file.mpd)

`MP4Box -frag 10000 -dash 30000 -segment-name segment\_file file.mp4`

Interested readers can find more details about the ISO Base Media File Format specification, [here](http://standards.iso.org/ittf/PubliclyAvailableStandards/c051533_ISO_IEC_14496-12_2008.zip).
