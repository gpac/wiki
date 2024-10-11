---
tags:
- mpd
- ffmpeg
- data
- codec
- multiplexer
- sample
- compression
- frame
- raw
- stream
- encode
- bitstream
- sequence
- block
- media
- segment
- isobmff
- group
- h264
- chunk
- track
- profile
- mp4
- source
- input
- isomedia
- binary
- decoding
- mpeg
- dash
- encoder
---



Telecom Paris has been generating a set of DASH sequences, and is making them available for DASH conformance testing. 

These sequences are distributed under the terms of the [Creative Common by-nc-nd Licence](http://creativecommons.org/licenses/by-nc-nd/3.0).

[![CCbyncnd](https://gpac.io/files/2012/02/CCbyncnd-300x104.jpg)](https://gpac.io/files/2012/02/CCbyncnd.jpg)

# Sequences Links

DASH Conformance ([browse directory](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/), including the encoded source sequences and the bash script to regenerate the sequences)

## ISOBMF Sequences

*   **live** profile without bitstream switching support: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live/mp4-live-mpd-A-NBS.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live/mp4-live-mpd-V-NBS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live/mp4-live-mpd-AV-NBS.mpd)
*   **live** profile with bitstream switching support: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live/mp4-live-mpd-A-BS.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live/mp4-live-mpd-V-BS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live/mp4-live-mpd-AV-BS.mpd)
*   **live** profile multiplexed audio+video [with bitstream switching](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-mux/mp4-live-mux-mpd-AV-BS.mpd) and [without bitstream switching](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-mux/mp4-live-mux-mpd-AV-NBS.mpd)
*   **live** profile with two audio codecs (@group attribute) [without bitstream switching](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-group/mp4-live-group-mpd-A-NBS.mpd)
*   **live** profile with five periods [without bitstream switching](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-periods/mp4-live-periods-mpd.mpd)
*   **main** profile, single file without bitstream switching support: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-single/mp4-main-single-mpd-A-NBS.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-single/mp4-main-single-mpd-V-NBS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-single/mp4-main-single-mpd-AV-NBS.mpd)
*   **main** profile, single file with bitstream switching support: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-single/mp4-main-single-mpd-A-BS.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-single/mp4-main-single-mpd-V-BS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-single/mp4-main-single-mpd-AV-BS.mpd)
*   **main** profile, multiple files without bitstream switching support: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-multi/mp4-main-multi-mpd-A-NBS.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-multi/mp4-main-multi-mpd-V-NBS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-multi/mp4-main-multi-mpd-AV-NBS.mpd)
*   **main** profile, multiple files with bitstream switching support: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-multi/mp4-main-multi-mpd-A-BS.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-multi/mp4-main-multi-mpd-V-BS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-multi/mp4-main-multi-mpd-AV-BS.mpd)
*   **main** profile, OpenGOP without bitstream switching support: [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-ogop/mp4-main-ogop-mpd-V-NBS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-ogop/mp4-main-ogop-mpd-AV-NBS.mpd)
*   **main** profile, OpenGOP with bitstream switching support: [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-ogop/mp4-main-ogop-mpd-V-BS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-main-ogop/mp4-main-ogop-mpd-AV-BS.mpd)
*   **onDemand** profile: [Audio](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-onDemand/mp4-onDemand-mpd-A.mpd) [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-onDemand/mp4-onDemand-mpd-V.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-onDemand/mp4-onDemand-mpd-AV.mpd)
*   **full** profile, Gradual Decoding Refresh without bitstream switching support: [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-full-gdr/mp4-full-gdr-mpd-V-NBS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-full-gdr/mp4-full-gdr-mpd-AV-NBS.mpd)
*   **full** profile, Gradual Decoding Refresh with bitstream switching support: [Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-full-gdr/mp4-full-gdr-mpd-V-BS.mpd) [Audio+Video](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-full-gdr/mp4-full-gdr-mpd-AV-BS.mpd)

## MPEG-2 TS Sequences

*   **simple** profile in a [single file](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mpeg2-simple/mpeg2-simple-mpd.mpd)
*   **simple** profile in multiple files [with templates](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mpeg2-simple-files/mpeg2-simple-files-mpd-template.mpd) and [without templates](http://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mpeg2-simple-files/mpeg2-simple-files-mpd.mpd)

# Media Description

These sequences consist of a video object in various bitrates and resolutions, as well as an audio object in two different coding systems. All these files have been generated with open-source, freely available software. The sequences duration is 10 minutes.

## Audio

The audio track consists of beeps. Beeps occur precisely at each second. Beeps are alternatively high tone (even seconds) or low tone (odd seconds). The audio track is available as MP3 or AAC, 64kbps.

## Video

The video track consists of an animated pattern showing:

*   a circle becoming alternately white or grey every second
*   a time counter and a frame counter
*   information about the generation (frame rate, resolution, generation information)[![](https://gpac.io/files/2012/02/ConfSnapshot-300x225.png)](https://gpac.io/files/2012/02/ConfSnapshot.png)

The video track is a combination of:

*   a codec: AVC/H264 only;
*   available resolutions: 320x180, 640x360, 1280x720, 1920x1080
*   several GOP profiles:
    *   baseline profile, closed GOP, RAP 1s
    *   regular 2B-pattern open GOP, RAP 1s
    *   GDR (Gradual Decoding Refresh) with an 8-picture refresh
*   2 bitrates for each of the above combinations
*   SPS/PPS ids are unique for a given GOP profile, so as to avoid the switching issue caused by the use of same ids and are described in the table below
    
<table width="300" cellspacing="0" cellpadding="0" border="0">

<tbody>

<tr>

<td width="75" height="16">AVC Profile</td>

<td width="75">Resolution</td>

<td width="75">Bitrate (kbps)</td>

<td width="75">SPS ID</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">320x180</td>

<td width="75">48</td>

<td width="75">0</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">320x180</td>

<td width="75">128</td>

<td width="75">1</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">640x360</td>

<td width="75">96</td>

<td width="75">2</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">640x360</td>

<td width="75">192</td>

<td width="75">3</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">1280x720</td>

<td width="75">192</td>

<td width="75">4</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">1280x720</td>

<td width="75">512</td>

<td width="75">5</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">1920x1080</td>

<td width="75">384</td>

<td width="75">6</td>

</tr>

<tr>

<td width="75" height="16">Baseline</td>

<td width="75">1920x1080</td>

<td width="75">512</td>

<td width="75">7</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">320x180</td>

<td width="75">40</td>

<td width="75">4</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">320x180</td>

<td width="75">112</td>

<td width="75">5</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">640x360</td>

<td width="75">80</td>

<td width="75">6</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">640x360</td>

<td width="75">160</td>

<td width="75">7</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">1280x720</td>

<td width="75">160</td>

<td width="75">8</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">1280x720</td>

<td width="75">448</td>

<td width="75">9</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">1920x1080</td>

<td width="75">320</td>

<td width="75">10</td>

</tr>

<tr>

<td width="75" height="16">OpenGOP</td>

<td width="75">1920x1080</td>

<td width="75">640</td>

<td width="75">11</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">320x180</td>

<td width="75">64</td>

<td width="75">8</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">320x180</td>

<td width="75">160</td>

<td width="75">9</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">640x360</td>

<td width="75">128</td>

<td width="75">10</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">640x360</td>

<td width="75">224</td>

<td width="75">11</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">1280x720</td>

<td width="75">224</td>

<td width="75">12</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">1280x720</td>

<td width="75">576</td>

<td width="75">13</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">1920x1080</td>

<td width="75">448</td>

<td width="75">14</td>

</tr>

<tr>

<td width="75" height="16">GDR</td>

<td width="75">1920x1080</td>

<td width="75">896</td>

<td width="75">15</td>

</tr>

</tbody>

</table>    

# ISO File Format Sequences

All DASH MPDs are generated with:

*   10s segments, beginning with RAP
*   1s “moof” fragments (which corresponds to the GOP size)

Each adaptation set (described below) are available in the following ways:

*   Multiple segments:
    *   segment list conforming Main profile, except for GDR which complies with Full profile; MPD for these sequences are named `XXX-**files**.mpd,`
    *   segment URL Template conforming Live profile, except for GDR which complies with Full profile; MPD for these sequences are named `XXX-**url**.mpd`.
*   One file:
    *   indexes (n “sidx”) conforming Main profile, except for GDR which complies with Full profile; MPD for these sequences are named `XXX-**indexes**.mpd,`
    *   single segment (1 “sidx”) conforming OnDemand profile, except for GDR which complies with Full profile; MPD for these sequences are named `XXX-**single**.mpd.`

Currently the following combinations are provided:

*   1 Adaptation Set, with alternate MP3 or AAC audio representations;
*   2 Adaptation Sets, one with alternate MP3 or AAC audio representations, the other with baseline AVC video;
*   1 Adaptation Set, with audio (AAC) and video (open-GOP), using 2 components. Each segment is made of 2 sub-segments indexed as:
    *   1 primary “sidx” indexing both subsegments (“reference\_type” 1);
    *   each subsegment has a secondary A/V “sidx” (“reference\_type” 0) with 5 entries (one per “moof”).
*   1 Adaptation Set, with audio (AAC) and video (GDR with 8 frames roll recovery), using 2 components. Each segment is made of 5 sub-segments indexed with daisy chained SIDX; each SIDX contains two "reference\_type 0" subsegments (one per moof) and one "reference type 1" subsegment pointing to the next SIDX (except for the last SIDX).

# MPEG-2 TS Sequences

All DASH MPDs are generated with 10s segments, beginning with RAP. Only the baseline AVC|H264 profile is currently used. Each adaptation set (described below) are available in the following ways:

*   Multiple segments:
    *   segment list conforming Simple@TS profile; MPD for these sequences are named `XXX-**files**.mpd,`
    *   segment URL Template conforming Simple@TS profile; MPD for these sequences are named `XXX-**url**.mpd`.
*   One file:
    *   single segment (1 “sidx”) conforming Simple@TS profile; MPD for these sequences are named `XXX-**single**.mpd.`

# Uncovered DASH features

Not all features of DASH are tested with the current sequences. Especially, the sequences do not test:

*   Subsets
*   Segment Timeline
*   Sub Representations and sub-segment indexing
*   Metrics
*   Bitstream Switching Segments (although bitstream switching is tested)

# Sequences Generation

To generate these DASH sequences, several open-source software tools have been used (in the sequential order of stream generation):

*   GPAC/MP4Box to process the BIFS visual data and export it to a raw video track in AVI,
*   Audacity \[1.3 Beta\] to generate the raw audio track,
*   x264 \[0.118.2085 8a62835\] for the AVC|H.264 encoding,
*   faac \[as included in FFmpeg build\] for AAC encoding,
*   LAME \[as included in FFmpeg build\] for MP3 encoding,
*   GPAC/MP42TS \[REV3926\] for Transport Stream packaging,
*   GPAC/MP4Box \[REV3926\] for ISOBMF packaging, MPD generation and DASH segmentation (TS and ISOBMFF).

For more info on DASH generation, see [[DASH Support in MP4Box]].
