<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# Extracting Options  
  
MP4Box can be used to extract media tracks from MP4 files. If you need to convert these tracks however, please check the [filters doc](Filters).  
    
Options:  
<div markdown class="option">
<a id="raw" data-level="basic">__-raw__</a> (string): extract given track in raw format when supported. Use `tkID:output=FileName` to set output file name  
</div>
<div markdown class="option">
<a id="raws" data-level="basic">__-raws__</a> (string): extract each sample of the given track to a file. Use `tkID:N` to extract the Nth sample  
</div>
<div markdown class="option">
<a id="nhnt" data-level="basic">__-nhnt__</a> (int): extract given track to [NHNT](nhntr) format  
</div>
<div markdown class="option">
<a id="nhml" data-level="basic">__-nhml__</a> (string): extract given track to [NHML](nhmlr) format. Use `tkID:full` for full NHML dump with all packet properties  
</div>
<div markdown class="option">
<a id="webvtt-raw" data-level="basic">__-webvtt-raw__</a> (string): extract given track as raw media in WebVTT as metadata. Use `tkID:embedded` to include media data in the WebVTT file  
</div>
<div markdown class="option">
<a id="single" data-level="basic">__-single__</a> (int): extract given track to a new mp4 file  
</div>
<div markdown class="option">
<a id="six" data-level="basic">__-six__</a> (int): extract given track as raw media in __experimental__ XML streaming instructions  
</div>
<div markdown class="option">
<a id="mux" data-level="basic">__-mux__</a> (string): multiplex input file to given destination  
</div>
<div markdown class="option">
<a id="qcp" data-level="basic">__-qcp__</a> (int): same as [-raw](#raw) but defaults to QCP file for EVRC/SMV  
</div>
<div markdown class="option">
<a id="saf" data-level="basic">__-saf__</a>: multiplex input file to SAF multiplex  
</div>
<div markdown class="option">
<a id="dvbhdemux" data-level="basic">__-dvbhdemux__</a>: demultiplex DVB-H file into IP Datagrams sent on the network  
</div>
<div markdown class="option">
<a id="raw-layer" data-level="basic">__-raw-layer__</a> (int): same as [-raw](#raw) but skips SVC/MVC/LHVC extractors when extracting  
</div>
<div markdown class="option">
<a id="diod" data-level="basic">__-diod__</a>: extract file IOD in raw format  
</div>
<div markdown class="option">
<a id="mpd" data-level="basic">__-mpd__</a> (string): convert given HLS or smooth manifest (local or remote http) to MPD - options `-url-template` and `-segment-timeline`can be used in this mode.    
_Note: This only provides basic conversion, for more advanced conversions, see `gpac -h dasher`_  
    

__Warning: This is not compatible with other DASH options and does not convert associated segments__  
  
</div>
  

# File Dumping  
  
    
MP4Box has many dump functionalities, from simple track listing to more complete reporting of special tracks.  
    
Options:  
<div markdown class="option">
<a id="std" data-level="basic">__-std__</a>: dump/write to stdout and assume stdout is opened in binary mode  
</div>
<div markdown class="option">
<a id="stdb" data-level="basic">__-stdb__</a>: dump/write to stdout and try to reopen stdout in binary mode  
</div>
<div markdown class="option">
<a id="tracks" data-level="basic">__-tracks__</a>: print the number of tracks on stdout  
</div>
<div markdown class="option">
<a id="info" data-level="basic">__-info__</a> (string): print movie info (no parameter) or track extended info with specified ID  
</div>
<div markdown class="option">
<a id="infon" data-level="basic">__-infon__</a> (string): print track info for given track number, 1 being the first track in the file  
</div>
<div markdown class="option">
<a id="infox" data-level="basic">__-infox__</a>: print movie and track extended info (same as -info N` for each track)`  
</div>
<div markdown class="option">
<a id="diso" data-level="basic">__-diso__</a>,__-dmp4__: dump IsoMedia file boxes in XML output  
</div>
<div markdown class="option">
<a id="dxml" data-level="basic">__-dxml__</a>: dump IsoMedia file boxes and known track samples in XML output  
</div>
<div markdown class="option">
<a id="disox" data-level="basic">__-disox__</a>: dump IsoMedia file boxes except sample tables in XML output  
</div>
<div markdown class="option">
<a id="keep-comp" data-level="basic">__-keep-comp__</a>: do not decompress boxes when dumping  
</div>
<div markdown class="option">
<a id="keep-ods" data-level="basic">__-keep-ods__</a>: do not translate ISOM ODs and ESDs tags (debug purpose only)  
</div>
<div markdown class="option">
<a id="bt" data-level="basic">__-bt__</a>: dump scene to BT format  
</div>
<div markdown class="option">
<a id="xmt" data-level="basic">__-xmt__</a>: dump scene to XMT format  
</div>
<div markdown class="option">
<a id="wrl" data-level="basic">__-wrl__</a>: dump scene to VRML format  
</div>
<div markdown class="option">
<a id="x3d" data-level="basic">__-x3d__</a>: dump scene to X3D XML format  
</div>
<div markdown class="option">
<a id="x3dv" data-level="basic">__-x3dv__</a>: dump scene to X3D VRML format  
</div>
<div markdown class="option">
<a id="lsr" data-level="basic">__-lsr__</a>: dump scene to LASeR XML (XSR) format  
</div>
<div markdown class="option">
<a id="svg" data-level="basic">__-svg__</a>: dump scene to SVG  
</div>
<div markdown class="option">
<a id="drtp" data-level="basic">__-drtp__</a>: dump rtp hint samples structure to XML output  
</div>
<div markdown class="option">
<a id="dts" data-level="basic">__-dts__</a>: print sample timing, size and position in file to text output  
</div>
<div markdown class="option">
<a id="dtsx" data-level="basic">__-dtsx__</a>: same as [-dts](#dts) but does not print offset  
</div>
<div markdown class="option">
<a id="dtsc" data-level="basic">__-dtsc__</a>: same as [-dts](#dts) but analyses each sample for duplicated dts/cts (_slow !_)  
</div>
<div markdown class="option">
<a id="dtsxc" data-level="basic">__-dtsxc__</a>: same as [-dtsc](#dtsc) but does not print offset (_slow !_)  
</div>
<div markdown class="option">
<a id="dnal" data-level="basic">__-dnal__</a> (int): print NAL sample info of given track  
</div>
<div markdown class="option">
<a id="dnalc" data-level="basic">__-dnalc__</a> (int): print NAL sample info of given track, adding CRC for each nal  
</div>
<div markdown class="option">
<a id="dnald" data-level="basic">__-dnald__</a> (int): print NAL sample info of given track without DTS and CTS info  
</div>
<div markdown class="option">
<a id="dnalx" data-level="basic">__-dnalx__</a> (int): print NAL sample info of given track without DTS and CTS info and adding CRC for each nal  
</div>
<div markdown class="option">
<a id="sdp" data-level="basic">__-sdp__</a>: dump SDP description of hinted file  
</div>
<div markdown class="option">
<a id="dsap" data-level="basic">__-dsap__</a> (int): dump DASH SAP cues (see -cues) for a given track  
</div>
<div markdown class="option">
<a id="dsaps" data-level="basic">__-dsaps__</a> (int): same as [-dsap](#dsap) but only print sample number  
</div>
<div markdown class="option">
<a id="dsapc" data-level="basic">__-dsapc__</a> (int): same as [-dsap](#dsap) but only print CTS  
</div>
<div markdown class="option">
<a id="dsapd" data-level="basic">__-dsapd__</a> (int): same as [-dsap](#dsap) but only print DTS  
</div>
<div markdown class="option">
<a id="dsapp">__-dsapp__</a> (int): same as [-dsap](#dsap) but only print presentation time  
</div>
<div markdown class="option">
<a id="dcr" data-level="basic">__-dcr__</a>: dump ISMACryp samples structure to XML output  
</div>
<div markdown class="option">
<a id="dchunk" data-level="basic">__-dchunk__</a>: dump chunk info  
</div>
<div markdown class="option">
<a id="dump-cover" data-level="basic">__-dump-cover__</a>: extract cover art  
</div>
<div markdown class="option">
<a id="dump-chap" data-level="basic">__-dump-chap__</a>: extract chapter file as TTXT format  
</div>
<div markdown class="option">
<a id="dump-chap-ogg" data-level="basic">__-dump-chap-ogg__</a>: extract chapter file as OGG format  
</div>
<div markdown class="option">
<a id="dump-chap-zoom" data-level="basic">__-dump-chap-zoom__</a>: extract chapter file as zoom format  
</div>
<div markdown class="option">
<a id="dump-udta" data-level="basic">__-dump-udta__</a> `[tkID:]4cc`: extract user data for the given 4CC. If `tkID` is given, dumps from UDTA of the given track ID, otherwise moov is used  
</div>
<div markdown class="option">
<a id="mergevtt" data-level="basic">__-mergevtt__</a>: merge vtt cues while dumping  
</div>
<div markdown class="option">
<a id="ttxt" data-level="basic">__-ttxt__</a> (int): convert input subtitle to GPAC TTXT format if no parameter. Otherwise, dump given text track to GPAC TTXT format  
</div>
<div markdown class="option">
<a id="srt" data-level="basic">__-srt__</a> (int): convert input subtitle to SRT format if no parameter. Otherwise, dump given text track to SRT format  
</div>
<div markdown class="option">
<a id="nstat" data-level="basic">__-nstat__</a>: generate node/field statistics for scene  
</div>
<div markdown class="option">
<a id="nstats" data-level="basic">__-nstats__</a>: generate node/field statistics per Access Unit  
</div>
<div markdown class="option">
<a id="nstatx" data-level="basic">__-nstatx__</a>: generate node/field statistics for scene after each AU  
</div>
<div markdown class="option">
<a id="hash" data-level="basic">__-hash__</a>: generate SHA-1 Hash of the input file  
</div>
<div markdown class="option">
<a id="comp" data-level="basic">__-comp__</a> (string): replace with compressed version all top level box types given as parameter, formatted as `orig_4cc_1=comp_4cc_1[,orig_4cc_2=comp_4cc_2]`  
</div>
<div markdown class="option">
<a id="topcount" data-level="basic">__-topcount__</a> (string): print to stdout the number of top-level boxes matching box types given as parameter, formatted as `4cc_1,4cc_2N`  
</div>
<div markdown class="option">
<a id="topsize" data-level="basic">__-topsize__</a> (string): print to stdout the number of bytes of top-level boxes matching types given as parameter, formatted as `4cc_1,4cc_2N` or `all` for all boxes  
</div>
<div markdown class="option">
<a id="bin" data-level="basic">__-bin__</a>: convert input XML file using NHML bitstream syntax to binary  
</div>
<div markdown class="option">
<a id="mpd-rip" data-level="basic">__-mpd-rip__</a>: fetch MPD and segment to disk  
</div>
<div markdown class="option">
<a id="udp-write">__-udp-write__</a> (string, default: __IP[:port]__): write input name to UDP (default port 2345)  
</div>
<div markdown class="option">
<a id="raw-cat">__-raw-cat__</a> (string): raw concatenation of given file with input file  
</div>
<div markdown class="option">
<a id="wget">__-wget__</a> (string): fetch resource from http(s) URL  
</div>
<div markdown class="option">
<a id="dm2ts" data-level="basic">__-dm2ts__</a>: dump timing of an input MPEG-2 TS stream sample timing  
</div>
<div markdown class="option">
<a id="check-xml" data-level="basic">__-check-xml__</a>: check XML output format for -dnal*, -diso* and -dxml options  
</div>
<div markdown class="option">
<a id="fuzz-chk">__-fuzz-chk__</a>: open file without probing and exit (for fuzz tests)  
</div>
    

# File splitting  
  
MP4Box can split input files by size, duration or extract a given part of the file to new IsoMedia file(s).  
This requires that at most one track in the input file has non random-access points (typically one video track at most).  
Splitting will ignore all MPEG-4 Systems tracks and hint tracks, but will try to split private media tracks.  
The input file must have enough random access points in order to be split. If this is not the case, you will have to re-encode the content.  
You can add media to a file and split it in the same pass. In this case, the destination file (the one which would be obtained without splitting) will not be stored.  
    
Time ranges are specified as follows:  

- `S-E`: `S` start and `E` end times, formatted as `HH:MM:SS.ms`, `MM:SS.ms` or time in seconds (int, double, fraction)  
- `S:E`: `S` start time and `E` end times in seconds (int, double, fraction). If `E` is prefixed with `D`, this sets `E = S + time`  
- `S:end` or `S:end-N`: `S` start time in seconds (int, double), `N` number of seconds (int, double) before the end  

    
MP4Box splitting runs a filter session using the `reframer` filter as follows:  

- `splitrange` option of the reframer is always set  
- source is demultiplexed with `alltk` option set  
- start and end ranges are passed to `xs` and `xe` options of the reframer  
- for `-splitz`, options `xadjust` and `xround=after` are enforced  
- for `-splitg`, options `xadjust` and `xround=before` are enforced  
- for `-splitf`, option `xround=seek` is enforced and `propbe_ref`set if not specified at prompt  
- for `-splitx`, option `xround=closest` and `propbe_ref` are enforced if not specified at prompt  

    
The default output storage mode is to full interleave and will require a temp file for each output. This behavior can be modified using `-flat`, `-newfs`, `-inter` and `-frag`.  
The output file name(s) can be specified using `-out` and templates (e.g. `-out split$num%04d$.mp4` produces split0001.mp4, split0002.mp4, ...).  
Multiple time ranges can be specified as a comma-separated list for `-splitx`, `-splitz` and `-splitg`.  
    
<div markdown class="option">
<a id="split" data-level="basic">__-split__</a> (string): split in files of given max duration (float number) in seconds. A trailing unit can be specified:  

- `M`, `m`: duration is in minutes  
- `H`, `h`: size is in hours  
</div>
  
<div markdown class="option">
<a id="split-rap" data-level="basic">__-split-rap__</a>,__-splitr__: split in files at each new RAP  
</div>
<div markdown class="option">
<a id="split-size" data-level="basic">__-split-size__</a>,__-splits__ (string): split in files of given max size (integer number) in kilobytes. A trailing unit can be specified:  

- `M`, `m`: size is in megabytes  
- `G`, `g`: size is in gigabytes  
</div>
  
<div markdown class="option">
<a id="split-chunk" data-level="basic">__-split-chunk__</a>,__-splitx__ (string): extract the specified time range as follows:  

- the start time is moved to the RAP sample closest to the specified start time  
- the end time is kept as requested  
</div>
  
<div markdown class="option">
<a id="splitz" data-level="basic">__-splitz__</a> (string): extract the specified time range so that ranges `A:B` and `B:C` share exactly the same boundary `B`:  

- the start time is moved to the RAP sample at or after the specified start time  
- the end time is moved to the frame preceding the RAP sample at or following the specified end time  
</div>
  
<div markdown class="option">
<a id="splitg" data-level="basic">__-splitg__</a> (string): extract the specified time range as follows:  

- the start time is moved to the RAP sample at or before the specified start time  
- the end time is moved to the frame preceding the RAP sample at or following the specified end time  
</div>
  
<div markdown class="option">
<a id="splitf" data-level="basic">__-splitf__</a> (string): extract the specified time range and insert edits such that the extracted output is exactly the specified range  
  
</div>
