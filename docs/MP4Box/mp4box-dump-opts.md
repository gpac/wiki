<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# Extracting Options  
  
MP4Box can be used to extract media tracks from MP4 files. If you need to convert these tracks however, please check the [filters doc](Filters).  
    
Options:  
<a id="raw">__-raw__</a> (string): extract given track in raw format when supported. Use `tkID:output=FileName` to set output file name  
<a id="raws">__-raws__</a> (string): extract each sample of the given track to a file. Use `tkID:N` to extract the Nth sample  
<a id="nhnt">__-nhnt__</a> (int): extract given track to [NHNT](nhntr) format  
<a id="nhml">__-nhml__</a> (string): extract given track to [NHML](nhmlr) format. Use `tkID:full` for full NHML dump with all packet properties  
<a id="webvtt-raw">__-webvtt-raw__</a> (string): extract given track as raw media in WebVTT as metadata. Use `tkID:embedded` to include media data in the WebVTT file  
<a id="single">__-single__</a> (int): extract given track to a new mp4 file  
<a id="six">__-six__</a> (int): extract given track as raw media in __experimental__ XML streaming instructions  
<a id="mux">__-mux__</a> (string): multiplex input file to given destination  
<a id="qcp">__-qcp__</a> (int): same as [-raw](#raw) but defaults to QCP file for EVRC/SMV  
<a id="saf">__-saf__</a>:      multiplex input file to SAF multiplex  
<a id="dvbhdemux">__-dvbhdemux__</a>: demultiplex DVB-H file into IP Datagrams sent on the network  
<a id="raw-layer">__-raw-layer__</a> (int): same as [-raw](#raw) but skips SVC/MVC/LHVC extractors when extracting  
<a id="diod">__-diod__</a>:    extract file IOD in raw format  
<a id="mpd">__-mpd__</a> (string): convert given HLS or smooth manifest (local or remote http) to MPD - options `-url-template` and `-segment-timeline`can be used in this mode.    
_Note: This only provides basic conversion, for more advanced conversions, see `gpac -h dasher`_  
    

__Warning: This is not compatible with other DASH options and does not convert associated segments__  
  
  

# File Dumping  
  
    
MP4Box has many dump functionalities, from simple track listing to more complete reporting of special tracks.  
    
Options:  
<a id="std">__-std__</a>:      dump/write to stdout and assume stdout is opened in binary mode  
<a id="stdb">__-stdb__</a>:    dump/write to stdout and try to reopen stdout in binary mode  
<a id="tracks">__-tracks__</a>: print the number of tracks on stdout  
<a id="info">__-info__</a> (string): print movie info (no parameter) or track extended info with specified ID  
<a id="infon">__-infon__</a> (string): print track info for given track number, 1 being the first track in the file  
<a id="infox">__-infox__</a>:  print movie and track extended info (same as -info N` for each track)`  
<a id="diso">__-diso__</a>,__-dmp4__: dump IsoMedia file boxes in XML output  
<a id="dxml">__-dxml__</a>:    dump IsoMedia file boxes and known track samples in XML output  
<a id="disox">__-disox__</a>:  dump IsoMedia file boxes except sample tables in XML output  
<a id="keep-ods">__-keep-ods__</a>: do not translate ISOM ODs and ESDs tags (debug purpose only)  
<a id="bt">__-bt__</a>:        dump scene to BT format  
<a id="xmt">__-xmt__</a>:      dump scene to XMT format  
<a id="wrl">__-wrl__</a>:      dump scene to VRML format  
<a id="x3d">__-x3d__</a>:      dump scene to X3D XML format  
<a id="x3dv">__-x3dv__</a>:    dump scene to X3D VRML format  
<a id="lsr">__-lsr__</a>:      dump scene to LASeR XML (XSR) format  
<a id="svg">__-svg__</a>:      dump scene to SVG  
<a id="drtp">__-drtp__</a>:    dump rtp hint samples structure to XML output  
<a id="dts">__-dts__</a>:      print sample timing, size and position in file to text output  
<a id="dtsx">__-dtsx__</a>:    same as [-dts](#dts) but does not print offset  
<a id="dtsc">__-dtsc__</a>:    same as [-dts](#dts) but analyses each sample for duplicated dts/cts (_slow !_)  
<a id="dtsxc">__-dtsxc__</a>:  same as [-dtsc](#dtsc) but does not print offset (_slow !_)  
<a id="dnal">__-dnal__</a> (int): print NAL sample info of given track  
<a id="dnalc">__-dnalc__</a> (int): print NAL sample info of given track, adding CRC for each nal  
<a id="dnald">__-dnald__</a> (int): print NAL sample info of given track without DTS and CTS info  
<a id="dnalx">__-dnalx__</a> (int): print NAL sample info of given track without DTS and CTS info and adding CRC for each nal  
<a id="sdp">__-sdp__</a>:      dump SDP description of hinted file  
<a id="dsap">__-dsap__</a> (int): dump DASH SAP cues (see -cues) for a given track  
<a id="dsaps">__-dsaps__</a> (int): same as [-dsap](#dsap) but only print sample number  
<a id="dsapc">__-dsapc__</a> (int): same as [-dsap](#dsap) but only print CTS  
<a id="dsapd">__-dsapd__</a> (int): same as [-dsap](#dsap) but only print DTS  
<a id="dsapp">__-dsapp__</a> (int): same as [-dsap](#dsap) but only print presentation time  
<a id="dcr">__-dcr__</a>:      dump ISMACryp samples structure to XML output  
<a id="dchunk">__-dchunk__</a>: dump chunk info  
<a id="dump-cover">__-dump-cover__</a>: extract cover art  
<a id="dump-chap">__-dump-chap__</a>: extract chapter file as TTXT format  
<a id="dump-chap-ogg">__-dump-chap-ogg__</a>: extract chapter file as OGG format  
<a id="dump-chap-zoom">__-dump-chap-zoom__</a>: extract chapter file as zoom format  
<a id="dump-udta">__-dump-udta__</a> `[tkID:]4cc`: extract user data for the given 4CC. If `tkID` is given, dumps from UDTA of the given track ID, otherwise moov is used  
<a id="mergevtt">__-mergevtt__</a>: merge vtt cues while dumping  
<a id="ttxt">__-ttxt__</a> (int): convert input subtitle to GPAC TTXT format if no parameter. Otherwise, dump given text track to GPAC TTXT format  
<a id="srt">__-srt__</a> (int): convert input subtitle to SRT format if no parameter. Otherwise, dump given text track to SRT format  
<a id="nstat">__-nstat__</a>:  generate node/field statistics for scene  
<a id="nstats">__-nstats__</a>: generate node/field statistics per Access Unit  
<a id="nstatx">__-nstatx__</a>: generate node/field statistics for scene after each AU  
<a id="hash">__-hash__</a>:    generate SHA-1 Hash of the input file  
<a id="comp">__-comp__</a> (string): replace with compressed version all top level box types given as parameter, formatted as `orig_4cc_1=comp_4cc_1[,orig_4cc_2=comp_4cc_2]`  
<a id="topcount">__-topcount__</a> (string): print to stdout the number of top-level boxes matching box types given as parameter, formatted as `4cc_1,4cc_2N`  
<a id="topsize">__-topsize__</a> (string): print to stdout the number of bytes of top-level boxes matching types given as parameter, formatted as `4cc_1,4cc_2N` or `all` for all boxes  
<a id="bin">__-bin__</a>:      convert input XML file using NHML bitstream syntax to binary  
<a id="mpd-rip">__-mpd-rip__</a>: fetch MPD and segment to disk  
<a id="udp-write">__-udp-write__</a> (string, default: __IP[:port]__): write input name to UDP (default port 2345)  
<a id="raw-cat">__-raw-cat__</a> (string): raw concatenation of given file with input file  
<a id="wget">__-wget__</a> (string): fetch resource from http(s) URL  
<a id="dm2ts">__-dm2ts__</a>:  dump timing of an input MPEG-2 TS stream sample timing  
<a id="check-xml">__-check-xml__</a>: check XML output format for -dnal*, -diso* and -dxml options  
<a id="fuzz-chk">__-fuzz-chk__</a>: open file without probing and exit (for fuzz tests)  
    

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
    
<a id="split">__-split__</a> (string): split in files of given max duration (float number) in seconds. A trailing unit can be specified:  

- `M`, `m`: duration is in minutes  
- `H`, `h`: size is in hours  
  
<a id="split-rap">__-split-rap__</a>,__-splitr__ (string): split in files at each new RAP  
<a id="split-size">__-split-size__</a>,__-splits__ (string): split in files of given max size (integer number) in kilobytes. A trailing unit can be specified:  

- `M`, `m`: size is in megabytes  
- `G`, `g`: size is in gigabytes  
  
<a id="split-chunk">__-split-chunk__</a>,__-splitx__ (string): extract the specified time range as follows:  

- the start time is moved to the RAP sample closest to the specified start time  
- the end time is kept as requested  
  
<a id="splitz">__-splitz__</a> (string): extract the specified time range so that ranges `A:B` and `B:C` share exactly the same boundary `B`:  

- the start time is moved to the RAP sample at or after the specified start time  
- the end time is moved to the frame preceding the RAP sample at or following the specified end time  
  
<a id="splitg">__-splitg__</a> (string): extract the specified time range as follows:  

- the start time is moved to the RAP sample at or before the specified start time  
- the end time is moved to the frame preceding the RAP sample at or following the specified end time  
  
<a id="splitf">__-splitf__</a> (string): extract the specified time range and insert edits such that the extracted output is exactly the specified range  
  
