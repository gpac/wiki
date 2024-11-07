<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# DASH and HLS segmenter  
  
Register name used to load filter: __dasher__  
This filter may be automatically loaded during graph resolution.  
This filter requires the graph resolver to be activated.  
  
This filter provides segmentation and manifest generation for MPEG-DASH and HLS formats.  
The segmenter currently supports:  

- MPD and m3u8 generation (potentially in parallel)  
- ISOBMFF, MPEG-2 TS, MKV and raw bitstream segment formats  
- override of profiles and levels in manifest for codecs  
- most MPEG-DASH profiles  
- static and dynamic (live) manifest offering  
- context store and reload for batch processing of live/dynamic sessions  

  
The filter does perform per-segment real-time regulation using [sreg](#sreg).  
If you need per-frame real-time regulation on non-real-time inputs, insert a [reframer](reframer) before to perform real-time regulation.  
Example
```
gpac -i file.mp4 reframer:rt=on -o live.mpd:dmode=dynamic
```
  

## Template strings  
The segmenter uses templates to derive output file names, regardless of the DASH mode (even when templates are not used). The default one is `$File$_dash` for ondemand and single file modes, and `$File$_$Number$` for separate segment files  
Example
```
template=Great_$File$_$Width$_$Number$
```
  
If input is `foo.mp4` with `640x360` video resolution, this will resolve in `Great_foo_640_$Number$` for the DASH template.  
Example
```
template=Great_$File$_$Width$
```
  
If input is `foo.mp4` with `640x360` video resolution, this will resolve in `Great_foo_640.mp4` for onDemand case.  
  
Standard DASH replacement strings:   

- $Number[%%0Nd]$: replaced by the segment number, possibly prefixed with 0  
- $RepresentationID$: replaced by representation name  
- $Time$: replaced by segment start time  
- $Bandwidth$: replaced by representation bandwidth.  

_Note: these strings are not replaced in the manifest templates elements._  
  
Additional replacement strings (not DASH, not generic GPAC replacements but may occur multiple times in template):  

- $Init=NAME$: replaced by NAME for init segment, ignored otherwise  
- $XInit=NAME$: complete replace by NAME for init segment, ignored otherwise  
- $InitExt=EXT$: replaced by EXT for init segment file extensions, ignored otherwise  
- $Index=NAME$: replaced by NAME for index segments, ignored otherwise  
- $Path=PATH$: replaced by PATH when creating segments, ignored otherwise  
- $Segment=NAME$: replaced by NAME for media segments, ignored for init segments  
- $SegExt=EXT$: replaced by EXT for media segment file extensions, ignored for init segments  
- $FS$ (FileSuffix): replaced by `_trackN` in case the input is an AV multiplex, or kept empty otherwise  

_Note: these strings are replaced in the manifest templates elements._  
  
## PID assignment and configuration  
To assign PIDs into periods and adaptation sets and configure the session, the segmenter looks for the following properties on each input PID:  

- `Representation`: assigns representation ID to input PID. If not set, the default behavior is to have each media component in different adaptation sets. Setting the `Representation` allows explicit multiplexing of the source(s)  
- `Period`: assigns period ID to input PID. If not set, the default behavior is to have all media in the same period with the same start time  
- `PStart`: assigns period start. If not set, 0 is assumed, and periods appear in the Period ID declaration order. If negative, this gives the period order (-1 first, then -2 ...). If positive, this gives the true start time and will abort DASHing at period end  

_Note: When both positive and negative values are found, the by-order periods (negative) will be inserted AFTER the timed period (positive)_  

- `ASID`: assigns parent adaptation set ID. If not 0, only sources with same AS ID will be in the same adaptation set  

_Note: If multiple streams in source, only the first stream will have an AS ID assigned_  

- `xlink`: for remote periods, only checked for null PID  
- `Role`, `PDesc`, `ASDesc`, `ASCDesc`, `RDesc`: various descriptors to set for period, AS or representation  
- `BUrl`: overrides segmenter [-base] with a set of BaseURLs to use for the PID (per representation)  
- `Template`: overrides segmenter [template](#template) for this PID  
- `DashDur`: overrides segmenter segment duration for this PID  
- `StartNumber`: sets the start number for the first segment in the PID, default is 1  
- `IntraOnly`: indicates input PID follows HLS EXT-X-I-FRAMES-ONLY guidelines  
- `CropOrigin`: indicates x and y coordinates of video for SRD (size is video size)  
- `SRD`: indicates SRD position and size of video for SRD, ignored if `CropOrigin` is set  
- `SRDRef`: indicates global width and height of SRD, ignored if `CropOrigin` is set  
- `HLSPL`: name of variant playlist, can use templates  
- `HLSMExt`: list of extensions to add to master playlist entries, ['foo','bar=val'] added as `,foo,bar=val`  
- `HLSVExt`: list of extensions to add to variant playlist, ['#foo','#bar=val'] added as `#foo \n #bar=val`  
- Non-dash properties: `Bitrate`, `SAR`, `Language`, `Width`, `Height`, `SampleRate`, `NumChannels`, `Language`, `ID`, `DependencyID`, `FPS`, `Interlaced`, `Codec`. These properties are used to setup each representation and can be overridden on input PIDs using the general PID property settings (cf global help).  

    
Example
```
gpac -i test.mp4:#Bitrate=1M -o test.mpd
```
  
This will force declaring a bitrate of 1M for the representation, regardless of actual input bitrate.  
Example
```
gpac -i muxav.mp4 -o test.mpd
```
  
This will create un-multiplexed DASH segments.  
Example
```
gpac -i muxav.mp4:#Representation=1 -o test.mpd
```
  
This will create multiplexed DASH segments.  
Example
```
gpac -i m1.mp4 -i m2.mp4:#Period=Yep -o test.mpd
```
  
This will put src `m1.mp4` in first period, `m2.mp4` in second period.  
Example
```
gpac -i m1.mp4:#BUrl=http://foo/bar -o test.mpd
```
  
This will assign a baseURL to src `m1.mp4`.  
Example
```
gpac -i m1.mp4:#ASCDesc=&lt;ElemName val="attval"&gt;text&lt;/ElemName&gt; -o test.mpd
```
  
This will assign the specified XML descriptor to the adaptation set.  
_Note:  this can be used to inject most DASH descriptors not natively handled by the segmenter._  
The segmenter handles the XML descriptor as a string and does not attempt to validate it. Descriptors, as well as some segmenter filter arguments, are string lists (comma-separated by default), so that multiple descriptors can be added:  
Example
```
gpac -i m1.mp4:#RDesc=&lt;Elem attribute="1"/&gt;,&lt;Elem2&gt;text&lt;/Elem2&gt; -o test.mpd
```
  
This will insert two descriptors in the representation(s) of `m1.mp4`.  
Example
```
gpac -i video.mp4:#Template=foo$Number$ -i audio.mp4:#Template=bar$Number$ -o test.mpd
```
  
This will assign different templates to the audio and video sources.  
Example
```
gpac -i null:#xlink=http://foo/bar.xml:#PDur=4 -i m.mp4:#PStart=-1 -o test.mpd
```
  
This will insert an create an MPD with first a remote period then a regular one.  
Example
```
gpac -i null:#xlink=http://foo/bar.xml:#PStart=6 -i m.mp4 -o test.mpd
```
  
This will create an MPD with first a regular period, dashing only 6s of content, then a remote one.  
Example
```
gpac -i v1:#SRD=0x0x1280x360:#SRDRef=1280x720 -i v2:#SRD=0x360x1280x360 -o test.mpd
```
  
This will layout the `v2` below `v1` using a global SRD size of 1280x720.  
  
The segmenter will create multiplexing filter chains for each representation and will reassign PID IDs so that each media component (video, audio, ...) in an adaptation set has the same ID.  
  
For HLS, the output manifest PID will deliver the master playlist __and__ the variant playlists.  
The default variant playlist are $NAME_$N.m3u8, where $NAME is the radical of the output file name and $N is the 1-based index of the variant.  
  
When HLS mode is enabled, the segment [template](#template) is relative to the variant playlist file, which can also be templated.  
Example
```
gpac -i av.mp4:#HLSPL=$Type$/index.m3u8 -o dash/live.m3u8:dual:template='$Number$'
```
  
This will put video segments and playlist in `dash/video/` and audio segments and playlist in `dash/audio/`  
  
## Segmentation  
The default behavior of the segmenter is to estimate the theoretical start time of each segment based on target segment duration, and start a new segment when a packet with SAP type 1,2,3 or 4 with time greater than the theoretical time is found.  
This behavior can be changed to find the best SAP packet around a segment theoretical boundary using [sbound](#sbound):  

- `closest` mode: the segment will start at the closest SAP of the theoretical boundary  
- `in` mode: the segment will start at or before the theoretical boundary  


__Warning: These modes will introduce delay in the segmenter (typically buffering of one GOP) and should not be used for low-latency modes.__  
  
The segmenter can also be configured to:  

- completely ignore SAP when segmenting using [sap](#sap).  
- ignore SAP on non-video streams when segmenting using [strict_sap](#strict_sap).  

  
When [seg_sync](#seg_sync) is disabled, the segmenter will by default announce a new segment in the manifest(s) as soon as its size/offset is known or its name is known, but the segment (or part in LL-HLS) may still not be completely written/sent.  
This may result in temporary mismatches between segment/part size currently received versus size as advertized in manifest.  
When [seg_sync](#seg_sync) is enabled, the segmenter will wait for the last byte of the fragment/segment to be pushed before announcing a new segment in the manifest(s). This can however slightly increase the latency in MPEG-DASH low-latency.  
  
When (-sflush)[] is set to `single`, segmentation is skipped and a single segment is generated per input.  
  
## Dynamic (real-time live) Mode  
The dasher does not perform real-time regulation by default.  
For regular segmentation, you should enable segment regulation [sreg](#sreg) if your sources are not real-time.  
Example
```
gpac -i source.mp4 -o live.mpd:segdur=2:profile=live:dmode=dynamic:sreg
```
  
  
For low latency segmentation with fMP4, you will need to specify the following options:  

- cdur: set the fMP4 fragment duration  
- asto: set the availability time offset for DASH. This value should be equal or slightly greater than segment duration minus cdur  
- llhls: enable low latency for HLS  

  
_Note: [llhls](#llhls) does not force `cmaf` mode to allow for multiplexed media in segments but it enforces to `tfdt_traf` in the muxer._  
  
If your sources are not real-time, insert a reframer filter with real-time regulation  
Example
```
gpac -i source.mp4 reframer:rt=on -o live.mpd:segdur=2:cdur=0.2:asto=1.8:profile=live:dmode=dynamic
```
  
This will create DASH segments of 2 seconds made of fragments of 200 ms and indicate to the client that requests can be made 1.8 seconds earlier than segment complete availability on server.  
Example
```
gpac -i source.mp4 reframer:rt=on -o live.m3u8:segdur=2:cdur=0.2:llhls=br:dmode=dynamic
```
  
This will create DASH segments of 2 seconds made of fragments of 200 ms and produce HLS low latency parts using byte ranges in the final segment.  
Example
```
gpac -i source.mp4 reframer:rt=on -o live.m3u8:segdur=2:cdur=0.2:llhls=sf:dmode=dynamic
```
  
This will create DASH segments of 2 seconds made of fragments of 200 ms and produce HLS low latency parts using dedicated files.  
  
You can combine LL-HLS and DASH-LL generation:  
Example
```
gpac -i source.mp4 reframer:rt=on -o live.mpd:dual:segdur=2:cdur=0.2:asto=1.8:llhls=br:profile=live:dmode=dynamic
```
  
  
For DASH, the filter will use the local clock for UTC anchor points in DASH.  
The filter can fetch and signal clock in other ways using [utcs](#utcs).  
Example
```
[opts]:utcs=inband
```
  
This will use the local clock and insert in the MPD a UTCTiming descriptor containing the local clock.  
Example
```
[opts]::utcs=http://time.akamai.com[::opts]
```
  
This will fetch time from `http://time.akamai.com`, use it as the UTC reference for segment generation and insert in the MPD a UTCTiming descriptor containing the time server URL.  
_Note: if not set as a global option using `--utcs=`, you must escape the url using double `::` or use other separators._  
  
## Cue-driven segmentation  
The segmenter can take a list of instructions, or Cues, to use for the segmentation process, in which case only these are used to derive segment boundaries. Cues can be set through XML files or injected in input packets.  
  
Cue files can be specified for the entire segmenter, or per PID using `DashCue` property.  
Cues are given in an XML file with a root element called &lt;DASHCues&gt;, with currently no attribute specified. The children are one or more &lt;Stream&gt; elements, with attributes:  

- id: integer for stream/track/PID ID  
- timescale: integer giving the units of following timestamps  
- mode: if present and value is `edit`, the timestamp are in presentation time (edit list applied) otherwise they are in media time  
- ts_offset: integer giving a value (in timescale) to subtract to the DTS/CTS values listed  

  
The children of &lt;Stream&gt; are one or more &lt;Cue&gt; elements, with attributes:  

- sample: integer giving the sample/frame number of a sample at which splitting shall happen  
- dts: long integer giving the decoding time stamp of a sample at which splitting shall happen  
- cts: long integer giving the composition / presentation time stamp of a sample at which splitting shall happen  


__Warning: Cues shall be listed in decoding order.__  
  
If the `DashCue` property of a PID equals `inband`, the PID will be segmented according to the `CueStart` property of input packets.  
This feature is typically combined with a list of files as input:  
Example
```
gpac -i list.m3u:sigcues -o res/live.mpd
```
  
This will load the `flist` filter in cue mode, generating continuous timelines from the sources and injecting a `CueStart` property at each new file.  
  
If the [cues](#cues) option equals `none`, the `DashCue` property of input PIDs will be ignored.  
  
## Manifest Generation only mode  
The segmenter can be used to generate manifests from already fragmented ISOBMFF inputs using [sigfrag](#sigfrag).  
In this case, segment boundaries are attached to each packet starting a segment and used to drive the segmentation.  
This can be used with single-track ISOBMFF sources, either single file or multi file.  
For single file source:  

- if onDemand [profile](#profile) is requested, sources have to be formatted as a DASH self-initializing media segment with the proper sidx.  
- templates are disabled.  
- [sseg](#sseg) is forced for all profiles except onDemand ones.  

For multi files source:  

- input shall be a playlist containing the initial file followed by the ordered list of segments.  
- if no [template](#template) is provided, the full or main [profile](#profile) will be used  
- if [-template]() is provided, it shall be correct: the filter will not try to guess one from the input file names and will not validate it either.  

  
The manifest generation-only mode supports both MPD and HLS generation.  
  
Example
```
gpac -i ondemand_src.mp4 -o dash.mpd:sigfrag:profile=onDemand
```
  
This will generate a DASH manifest for onDemand Profile based on the input file.  
Example
```
gpac -i ondemand_src.mp4 -o dash.m3u8:sigfrag
```
  
This will generate a HLS manifest based on the input file.  
Example
```
gpac -i seglist.txt -o dash.mpd:sigfrag
```
  
This will generate a DASH manifest in Main Profile based on the input files.  
Example
```
gpac -i seglist.txt:Template=$XInit=init$$q1/$Number$ -o dash.mpd:sigfrag:profile=live
```
  
This will generate a DASH manifest in live Profile based on the input files. The input file will contain `init.mp4`, `q1/1.m4s`, `q1/2.m4s`...  
  
## Cue Generation only mode  
The segmenter can be used to only generate segment boundaries from a set of inputs using [gencues](#gencues), without generating manifests or output files.  
In this mode, output PIDs are declared directly rather than redirected to media segment files.  
The segmentation logic is not changed, and packets are forwarded with the same information and timing as in regular mode.  
  
Output PIDs are forwarded with `DashCue=inband` property, so that any subsequent dasher follows the same segmentation process (see above).  
  
The first packet in a segment has:  

- property `FileNumber` (and, if multiple files, `FileName`) set as usual  
- property `CueStart` set  
- property `DFPStart=0` set if this is the first packet in a period  

  
This mode can be used to pre-segment the streams for later processing that must take place before final dashing.  
Example
```
gpac -i source.mp4 dasher:gencues cecrypt:cfile=roll_seg.xml -o live.mpd
```
  
This will allow the encrypter to locate dash boundaries and roll keys at segment boundaries.  
Example
```
gpac -i s1.mp4 -i s2.mp4:#CryptInfo=clear:#Period=3 -i s3.mp4:#Period=3 dasher:gencues cecrypt:cfile=roll_period.xml -o live.mpd
```
  
If the DRM file uses `keyRoll=period`, this will generate:  

- first period crypted with one key  
- second period clear  
- third period crypted with another key  

  
## Forced-Template mode  
When [tpl_force](#tpl_force) is set, the [template](#template) string is not analyzed nor modified for missing elements.  
This is typically used to redirect segments to a given destination regardless of the dash profile.  
Example
```
gpac -i SRC -o null:ext=mpd:tpl_force --template=pipe://mypipe
```
  
This will trash the manifest and open `mypipe` as destination for the muxer result.  

__Warning: Options for segment destination cannot be set through the [template](#template), global options must be used.__  
  
## Batch Operations  
The segmentation can be performed in multiple calls using a DASH context set with [state](#state).  
Between calls, the PIDs are reassigned by checking that the PID ID match between the calls and:  

- the input file names match between the calls  
- or the representation ID (and period ID if specified) match between the calls  

  
If a PID is not matched, it will be assigned to a new period.  
  
The default behaviour assume that the same inputs are used for segmentation and rebuilds a contiguous timeline at each new file start.  
If the inputs change but form a continuous timeline, [-keep_ts])() must be used to skip timeline reconstruction.  
  
The inputs will be segmented for a duration of [subdur](#subdur) if set, otherwise the input media duration.  
When inputs are over, they are restarted if [loop](#loop) is set otherwise a new period is created.  
To avoid this behaviour, the [sflush](#sflush) option should be set to `end` or `single`, indicating that further sources for the same representations will be added in subsequent calls. When [sflush](#sflush) is not `off`, the (-loop)[] option is ignored.  
  
Example
```
gpac -i SRC -o dash.mpd:segdur=2:state=CTX && gpac -i SRC -o dash.mpd:segdur=2:state=CTX
```
  
This will generate all dash segments for `SRC` (last one possibly shorter) and create a new period at end of input.  
Example
```
gpac -i SRC -o dash.mpd:segdur=2:state=CTX:loop && gpac -i SRC -o dash.mpd:segdur=2:state=CTX:loop
```
  
This will generate all dash segments for `SRC` and restart `SRC` to fill-up last segment.  
Example
```
gpac -i SRC -o dash.mpd:segdur=2:state=CTX:sflush=end && gpac -i SRC -o dash.mpd:segdur=2:state=CTX:sflush=end
```
  
This will generate all dash segments for `SRC` without looping/closing the period at end of input. Timestamps in the second call will be rewritten to be contiguous with timestamp at end of first call.  
Example
```
gpac -i SRC1 -o dash.mpd:segdur=2:state=CTX:sflush=end:keep_ts && gpac -i SRC2 -o dash.mpd:segdur=2:state=CTX:sflush=end:keep_ts
```
  
This will generate all dash segments for `SRC1` without looping/closing the period at end of input, then for `SRC2`. Timestamps of the sources will not be rewritten.  
  
_Note: The default behaviour of MP4Box `-dash-ctx` option is to set the (-loop)[] to true._  
  
## Output redirecting  
When loaded implicitly during link resolution, the dasher will only link its outputs to the target sink  
Example
```
gpac -i SRC -o URL1:OPTS1 -o URL2:OPTS1
```
  
This will create one dasher (with options OPTS1) for the URL1 and one dasher (with options OPTS1) for URL2.  
This allows dashing to multiple outputs with different formats, dash durations, etc.  
  
It can be useful to redirect all the filter outputs to several sinks, for example to push through ROUTE and through HTTP the same segments.  
In order to do this, the filter MUST be explicitly loaded and all options related to dash and MP4 must be set either globally or on the dasher filter.  
Example
```
gpac -i SRC dasher:cmfc:segdur=2 -o URL1 -o URL2
```
  
This will create a single dasher whose outputs (manifests and segments) will be redirected to the given URLs.  
When explicitly loading the filter, the [dual](#dual) option will be disabled unless [mname](#mname) is set to the alternate output name.  
  
## Multiplexer development considerations  
Output multiplexers allowing segmented output must obey the following:  

- inspect packet properties  

    - FileNumber: if set, indicate the start of a new DASH segment  
    - FileName: if set, indicate the file name. If not present, output shall be a single file. This is only set for packet carrying the `FileNumber` property, and only on one PID (usually the first) for multiplexed outputs  
    - IDXName: gives the optional index name. If not present, index shall be in the same file as dash segment. Only used for MPEG-2 TS for now  
    - EODS: property is set on packets with no payload and no timestamp to signal the end of a DASH segment. This is only used when stopping/resuming the segmentation process, in order to flush segments without dispatching an EOS (see [subdur](#subdur) )  

- for each segment done, send a downstream event on the first connected PID signaling the size of the segment and the size of its index if any  
- for multiplexers with init data, send a downstream event signaling the size of the init and the size of the global index if any  
- the following filter options are passed to multiplexers, which should declare them as arguments:  

    - noinit: disables output of init segment for the multiplexer (used to handle bitstream switching with single init in DASH)  
    - frag: indicates multiplexer shall use fragmented format (used for ISOBMFF mostly)  
    - subs_sidx=0: indicates an SIDX shall be generated - only added if not already specified by user  
    - xps_inband=all|no|both: indicates AVC/HEVC/... parameter sets shall be sent inband, out of band, or both  
    - nofragdef: indicates fragment defaults should be set in each segment rather than in init segment  

  
The segmenter adds the following properties to the output PIDs:  

- DashMode: identifies VoD (single file with global index) or regular DASH mode used by segmenter  
- DashDur: identifies target DASH segment duration - this can be used to estimate the SIDX size for example  
- LLHLS: identifies LLHLS is used; the multiplexer must send fragment size events back to the dasher, and set `LLHLSFragNum` on the first packet of each fragment  
- SegSync: indicates that fragments/segments must be completely flushed before sending back size events  

  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="segdur" data-level="basic">__segdur__</a> (frac, default: _0/0_): target segment duration in seconds. A value less than or equal to 0 defaults to 1.0 second  
</div>  
<div markdown class="option">  
<a id="tpl" data-level="basic">__tpl__</a> (bool, default: _true_): use template mode (multiple segment, template URLs)  
</div>  
<div markdown class="option">  
<a id="stl" data-level="basic">__stl__</a> (bool, default: _false_): use segment timeline (ignored in on_demand mode)  
</div>  
<div markdown class="option">  
<a id="dmode" data-level="basic">__dmode__</a> (enum, default: _static_, updatable): dash content mode  

- static: static content  
- dynamic: live generation  
- dynlast: last call for live, will turn the MPD into static  
- dynauto: live generation and move to static manifest upon end of stream  
</div>  
  
<div markdown class="option">  
<a id="sseg">__sseg__</a> (bool, default: _false_): single segment is used  
</div>  
<div markdown class="option">  
<a id="sfile">__sfile__</a> (bool, default: _false_): use a single file for all segments (default in on_demand)  
</div>  
<div markdown class="option">  
<a id="align">__align__</a> (bool, default: _true_): enable segment time alignment between representations  
</div>  
<div markdown class="option">  
<a id="sap" data-level="basic">__sap__</a> (bool, default: _true_): enable splitting segments at SAP boundaries  
</div>  
<div markdown class="option">  
<a id="mix_codecs">__mix_codecs__</a> (bool, default: _false_): enable mixing different codecs in an adaptation set  
</div>  
<div markdown class="option">  
<a id="ntp">__ntp__</a> (enum, default: _rem_): insert/override NTP clock at the beginning of each segment  

- rem: removes NTP from all input packets  
- yes: inserts NTP at each segment start  
- keep: leaves input packet NTP untouched  
</div>  
  
<div markdown class="option">  
<a id="no_sar">__no_sar__</a> (bool, default: _false_): do not check for identical sample aspect ratio for adaptation sets  
</div>  
<div markdown class="option">  
<a id="bs_switch">__bs_switch__</a> (enum, default: _def_): bitstream switching mode (single init segment)  

- def: resolves to off for onDemand and inband for live  
- off: disables BS switching  
- on: enables it if same decoder configuration is possible  
- inband: moves decoder config inband if possible  
- both: inband and outband parameter sets  
- pps: moves PPS and APS inband, keep VPS,SPS and DCI out of band (used for VVC RPR)  
- force: enables it even if only one representation  
- multi: uses multiple stsd entries in ISOBMFF  
</div>  
  
<div markdown class="option">  
<a id="template" data-level="basic">__template__</a> (str): template string to use to generate segment name  
</div>  
<div markdown class="option">  
<a id="segext" data-level="basic">__segext__</a> (str): file extension to use for segments  
</div>  
<div markdown class="option">  
<a id="initext" data-level="basic">__initext__</a> (str): file extension to use for the init segment  
</div>  
<div markdown class="option">  
<a id="muxtype" data-level="basic">__muxtype__</a> (enum, default: _auto_): muxtype to use for the segments  

- mp4: uses ISOBMFF format  
- ts: uses MPEG-2 TS format  
- mkv: uses Matroska format  
- webm: uses WebM format  
- ogg: uses OGG format  
- raw: uses raw media format (disables multiplexed representations)  
- auto: guess format based on extension, default to mp4 if no extension  
</div>  
  
<div markdown class="option">  
<a id="rawsub">__rawsub__</a> (bool, default: _no_): use raw subtitle format instead of encapsulating in container  
</div>  
<div markdown class="option">  
<a id="asto">__asto__</a> (dbl, default: _0_): availabilityStartTimeOffset to use in seconds. A negative value simply increases the AST, a positive value sets the ASToffset to representations  
</div>  
<div markdown class="option">  
<a id="profile" data-level="basic">__profile__</a> (enum, default: _auto_): target DASH profile. This will set default option values to ensure conformance to the desired profile. For MPEG-2 TS, only main and live are used, others default to main  

- auto: turns profile to live for dynamic and full for non-dynamic  
- live: DASH live profile, using segment template  
- onDemand: MPEG-DASH live profile  
- main: MPEG-DASH main profile, using segment list  
- full: MPEG-DASH full profile  
- hbbtv1.5.live: HBBTV 1.5 DASH profile  
- dashavc264.live: DASH-IF live profile  
- dashavc264.onDemand: DASH-IF onDemand profile  
- dashif.ll: DASH IF low-latency profile (set UTC server to time.akamai.com if none set)  
</div>  
  
<div markdown class="option">  
<a id="profX">__profX__</a> (str): list of profile extensions, as used by DASH-IF and DVB. The string will be colon-concatenated with the profile used. If starting with `+`, the profile string by default is erased and `+` is skipped  
</div>  
<div markdown class="option">  
<a id="cp">__cp__</a> (enum, default: _set_): content protection element location  

- set: in adaptation set element  
- rep: in representation element  
- both: in both adaptation set and representation elements  
</div>  
  
<div markdown class="option">  
<a id="pssh">__pssh__</a> (enum, default: _v_): storage mode for PSSH box  

- f: stores in movie fragment only  
- v: stores in movie only, or movie and fragments if key roll is detected  
- m: stores in mpd only  
- mf: stores in mpd and movie fragment  
- mv: stores in mpd and movie  
- n: discard pssh from mpd and segments  
</div>  
  
<div markdown class="option">  
<a id="buf" data-level="basic">__buf__</a> (sint, default: _-100_): min buffer duration in ms. negative value means percent of segment duration (e.g. -150 = 1.5*seg_dur)  
</div>  
<div markdown class="option">  
<a id="spd" data-level="basic">__spd__</a> (sint, default: _0_): suggested presentation delay in ms  
</div>  
<div markdown class="option">  
<a id="timescale">__timescale__</a> (sint, default: _0_): set timescale for timeline and segment list/template. A value of 0 picks up the first timescale of the first stream in an adaptation set. A negative value forces using stream timescales for each timed element (multiplication of segment list/template/timelines). A positive value enforces the MPD timescale  
</div>  
<div markdown class="option">  
<a id="check_dur" data-level="basic">__check_dur__</a> (bool, default: _true_): check duration of sources in period, trying to have roughly equal duration. Enforced whenever period start times are used  
</div>  
<div markdown class="option">  
<a id="skip_seg">__skip_seg__</a> (bool, default: _false_): increment segment number whenever an empty segment would be produced - NOT DASH COMPLIANT  
</div>  
<div markdown class="option">  
<a id="title" data-level="basic">__title__</a> (str): MPD title  
</div>  
<div markdown class="option">  
<a id="source" data-level="basic">__source__</a> (str): MPD Source  
</div>  
<div markdown class="option">  
<a id="info" data-level="basic">__info__</a> (str): MPD info url  
</div>  
<div markdown class="option">  
<a id="cprt" data-level="basic">__cprt__</a> (str): MPD copyright string  
</div>  
<div markdown class="option">  
<a id="lang" data-level="basic">__lang__</a> (str): language of MPD Info  
</div>  
<div markdown class="option">  
<a id="location" data-level="basic">__location__</a> (strl): set MPD locations to given URL  
</div>  
<div markdown class="option">  
<a id="base">__base__</a> (strl): set base URLs of MPD  
</div>  
<div markdown class="option">  
<a id="refresh">__refresh__</a> (dbl, default: _0_): refresh rate for dynamic manifests, in seconds (a negative value sets the MPD duration, value 0 uses dash duration)  
</div>  
<div markdown class="option">  
<a id="tsb" data-level="basic">__tsb__</a> (dbl, default: _30_): time-shift buffer depth in seconds (a negative value means infinity)  
</div>  
<div markdown class="option">  
<a id="keep_segs" data-level="basic">__keep_segs__</a> (bool, default: _false_): do not delete segments no longer in time-shift buffer  
</div>  
<div markdown class="option">  
<a id="ast">__ast__</a> (str): set start date (as xs:date, e.g. YYYY-MM-DDTHH:MM:SSZ) for live mode. Default is now. !! Do not use with multiple periods, nor when DASH duration is not a multiple of GOP size !!  
</div>  
<div markdown class="option">  
<a id="state">__state__</a> (str): path to file used to store/reload state info when simulating live. This is stored as a valid MPD with GPAC XML extensions  
</div>  
<div markdown class="option">  
<a id="keep_ts">__keep_ts__</a> (bool, default: _false_): do not shift timestamp when reloading a context  
</div>  
<div markdown class="option">  
<a id="loop">__loop__</a> (bool, default: _false_): loop sources when dashing with subdur and state. If not set, a new period is created once the sources are over  
</div>  
<div markdown class="option">  
<a id="subdur">__subdur__</a> (dbl, default: _0_): maximum duration of the input file to be segmented. This does not change the segment duration, segmentation stops once segments produced exceeded the duration  
</div>  
<div markdown class="option">  
<a id="split">__split__</a> (bool, default: _true_): enable cloning samples for text/metadata/scene description streams, marking further clones as redundant  
</div>  
<div markdown class="option">  
<a id="hlsc">__hlsc__</a> (bool, default: _false_): insert clock reference in variant playlist in live HLS  
</div>  
<div markdown class="option">  
<a id="cues">__cues__</a> (str): set cue file  
</div>  
<div markdown class="option">  
<a id="strict_cues">__strict_cues__</a> (bool, default: _false_): strict mode for cues, complains if splitting is not on SAP type 1/2/3 or if unused cue is found  
</div>  
<div markdown class="option">  
<a id="strict_sap">__strict_sap__</a> (enum, default: _off_): strict mode for sap  

- off: ignore SAP types for PID other than video, enforcing `AdaptationSet@startsWithSAP=1`  
- sig: same as [off](#off) but keep `AdaptationSet@startsWithSAP` to the true SAP value  
- on: warn if any PID uses SAP 3 or 4 and switch to FULL profile  
- intra: ignore SAP types greater than 3 on all media types  
</div>  
  
<div markdown class="option">  
<a id="subs_sidx">__subs_sidx__</a> (sint, default: _-1_): number of subsegments per sidx. Negative value disables sidx. Only used to inherit sidx option of destination  
</div>  
<div markdown class="option">  
<a id="cmpd">__cmpd__</a> (bool, default: _false_): skip line feed and spaces in MPD XML for compactness  
</div>  
<div markdown class="option">  
<a id="styp">__styp__</a> (str): indicate the 4CC to use for styp boxes when using ISOBMFF output  
</div>  
<div markdown class="option">  
<a id="dual">__dual__</a> (bool): indicate to produce both MPD and M3U files  
</div>  
<div markdown class="option">  
<a id="sigfrag">__sigfrag__</a> (bool): use manifest generation only mode  
</div>  
<div markdown class="option">  
<a id="sbound">__sbound__</a> (enum, default: _out_): indicate how the theoretical segment start `TSS (= segment_number * duration)` should be handled  

- out: segment split as soon as `TSS` is exceeded (`TSS` <= segment_start)  
- closest: segment split at closest SAP to theoretical bound  
- in: `TSS` is always in segment (`TSS` >= segment_start)  
</div>  
  
<div markdown class="option">  
<a id="reschedule">__reschedule__</a> (bool, default: _false_): reschedule sources with no period ID assigned once done (dynamic mode only)  
</div>  
<div markdown class="option">  
<a id="sreg">__sreg__</a> (bool, default: _false_): regulate the session  

- when using subdur and context, only generate segments from the past up to live edge  
- otherwise in dynamic mode without context, do not generate segments ahead of time  
</div>  
  
<div markdown class="option">  
<a id="scope_deps">__scope_deps__</a> (bool, default: _true_): scope PID dependencies to be within source. If disabled, PID dependencies will be checked across all input PIDs regardless of their sources  
</div>  
<div markdown class="option">  
<a id="utcs">__utcs__</a> (str): URL to use as time server / UTCTiming source. Special value `inband` enables inband UTC (same as publishTime), special prefix `xsd@` uses xsDateTime schemeURI rather than ISO  
</div>  
<div markdown class="option">  
<a id="sflush">__sflush__</a> (enum, default: _off_): segment flush mode - see filter help:  

- off: no specific actions  
- single: force generating a single segment for each input  
- end: skip loop detection and clamp duration adjustment at end of input, used for state mode  
</div>  
  
<div markdown class="option">  
<a id="last_seg_merge">__last_seg_merge__</a> (bool, default: _false_): force merging last segment if less than half the target duration  
</div>  
<div markdown class="option">  
<a id="mha_compat">__mha_compat__</a> (enum, default: _no_): adaptation set generation mode for compatible MPEG-H Audio profile  

- no: only generate the adaptation set for the main profile  
- comp: only generate the adaptation sets for all compatible profiles  
- all: generate the adaptation set for the main profile and all compatible profiles  
</div>  
  
<div markdown class="option">  
<a id="mname">__mname__</a> (str): output manifest name for ATSC3 multiplexing (using 'm3u8' only toggles HLS generation)  
</div>  
<div markdown class="option">  
<a id="llhls">__llhls__</a> (enum, default: _off_): HLS low latency type  

- off: do not use LL-HLS  
- br: use LL-HLS with byte-range for segment parts, pointing to full segment (DASH-LL compatible)  
- sf: use separate files for segment parts (post-fixed .1, .2 etc.)  
- brsf: generate two sets of manifest, one for byte-range and one for files (`_IF` added before extension of manifest)  
</div>  
  
<div markdown class="option">  
<a id="hlsdrm">__hlsdrm__</a> (str): cryp file info for HLS full segment encryption  
</div>  
<div markdown class="option">  
<a id="hlsx">__hlsx__</a> (strl): list of string to append to master HLS header before variants with `['#foo','#bar=val']` added as `#foo \n #bar=val`  
</div>  
<div markdown class="option">  
<a id="hlsiv">__hlsiv__</a> (bool, default: _true_): inject IV in variant HLS playlist``  
</div>  
<div markdown class="option">  
<a id="ll_preload_hint">__ll_preload_hint__</a> (bool, default: _true_): inject preload hint for LL-HLS  
</div>  
<div markdown class="option">  
<a id="ll_rend_rep">__ll_rend_rep__</a> (bool, default: _true_): inject rendition reports for LL-HLS  
</div>  
<div markdown class="option">  
<a id="ll_part_hb">__ll_part_hb__</a> (dbl, default: _-1_): user-defined part hold-back for LLHLS, negative value means 3 times max part duration in session  
</div>  
<div markdown class="option">  
<a id="ckurl">__ckurl__</a> (str): set the ClearKey URL common to all encrypted streams (overriden by `CKUrl` pid property)  
</div>  
<div markdown class="option">  
<a id="hls_absu">__hls_absu__</a> (enum, default: _no_): use absolute url in HLS generation using first URL in [base]()  

- no: do not use absolute URL  
- var: use absolute URL only in variant playlists  
- mas: use absolute URL only in master playlist  
- both: use absolute URL everywhere  
</div>  
  
<div markdown class="option">  
<a id="hls_ap">__hls_ap__</a> (bool, default: _false_): use audio as primary media instead of video when generating playlists  
</div>  
<div markdown class="option">  
<a id="seg_sync">__seg_sync__</a> (enum, default: _auto_): control how waiting on last packet P of fragment/segment to be written impacts segment injection in manifest  

- no: do not wait for P  
- yes: wait for P  
- auto: wait for P if HLS is used  
</div>  
  
<div markdown class="option">  
<a id="cmaf">__cmaf__</a> (enum, default: _no_): use cmaf guidelines  

- no: CMAF not enforced  
- cmfc: use CMAF `cmfc` guidelines  
- cmf2: use CMAF `cmf2` guidelines  
</div>  
  
<div markdown class="option">  
<a id="pswitch">__pswitch__</a> (enum, default: _single_): period switch control mode  

- single: change period if PID configuration changes  
- force: force period switch at each PID reconfiguration instead of absorbing PID reconfiguration (for splicing or add insertion not using periodID)  
- stsd: change period if PID configuration changes unless new configuration was advertised in initial config  
</div>  
  
<div markdown class="option">  
<a id="chain">__chain__</a> (str): URL of next MPD for regular chaining  
</div>  
<div markdown class="option">  
<a id="chain_fbk">__chain_fbk__</a> (str): URL of fallback MPD  
</div>  
<div markdown class="option">  
<a id="gencues">__gencues__</a> (bool, default: _false_): only insert segment boundaries and do not generate manifests  
</div>  
<div markdown class="option">  
<a id="force_init">__force_init__</a> (bool, default: _false_): force init segment creation in bitstream switching mode  
</div>  
<div markdown class="option">  
<a id="keep_src">__keep_src__</a> (bool, default: _false_): keep source URLs in manifest generation mode  
</div>  
<div markdown class="option">  
<a id="gxns">__gxns__</a> (bool, default: _false_): insert some gpac extensions in manifest (for now, only tfdt of first segment)  
</div>  
<div markdown class="option">  
<a id="dkid">__dkid__</a> (enum, default: _auto_): control injection of default KID in MPD  

- off: default KID not injected  
- on: default KID always injected  
- auto: default KID only injected if no key roll is detected (as per DASH-IF guidelines)  
</div>  
  
<div markdown class="option">  
<a id="tpl_force">__tpl_force__</a> (bool, default: _false_): use template string as is without trying to add extension or solve conflicts in names  
</div>  
<div markdown class="option">  
<a id="ttml_agg">__ttml_agg__</a> (bool, default: _false_): force aggregation of TTML samples of a DASH segment into a single sample  
</div>  
  
