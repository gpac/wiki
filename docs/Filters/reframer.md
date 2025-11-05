<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Media reframer  
  
Register name used to load filter: __reframer__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter provides various tools on inputs:  

- ensure reframing (1 packet = 1 Access Unit)  
- optionally force decoding  
- real-time regulation  
- packet filtering based on SAP types or frame numbers  
- time-range extraction and splitting  

    
This filter forces input PIDs to be properly framed (1 packet = 1 Access Unit).  
It is typically needed to force remultiplexing in file to file operations when source and destination files use the same format.  
    

# SAP filtering  
  
The filter can remove packets based on their SAP types using [saps](#saps) option.  
For example, this can be used to extract only the key frame (SAP 1,2,3) of a video to create a trick mode version.  
    

# Frame filtering  
  
This filter can keep only specific Access Units of the source using [frames](#frames) option.  
For example, this can be used to extract only specific key pictures of a video to create a HEIF collection.  
    

# Frame decoding  
  
This filter can force input media streams to be decoded using the [raw](#raw) option.  
Example
```
gpac -i m.mp4 reframer:raw=av [dst]
```
  

# Real-time Regulation  
  
The filter can perform real-time regulation of input packets, based on their timescale and timestamps.  
For example to simulate a live DASH:  
```
gpac -i m.mp4 reframer:rt=on -o live.mpd:dynamic
```
  
    

# Range extraction  
  
The filter can perform time range extraction of the source using [xs](#xs) and [xe](#xe) options.  
The formats allowed for times specifiers are:  

- 'TC'HH:MM:SS:FF: specify time in timecode  
- 'T'H:M:S, 'T'M:S: specify time in hours, minutes, seconds  
- 'T'H:M:S.MS, 'T'M:S.MS, 'T'S.MS: specify time in hours, minutes, seconds and milliseconds  
- INT, FLOAT, NUM/DEN: specify time in seconds (number or fraction)  
- 'D'INT, 'D'FLOAT, 'D'NUM/DEN: specify end time as offset to start time in seconds (number or fraction) - only valid for [xe](#xe)  
- 'F'NUM: specify time as frame number, 1 being first  
- XML DateTime: specify absolute UTC time  

    
In this mode, the timestamps are rewritten to form a continuous timeline, unless [xots](#xots) is set.  
When multiple ranges are given, the filter will try to seek if needed and supported by source.  
  
Example
```
gpac -i m.mp4 reframer:xs=T00:00:10,T00:01:10,T00:02:00:xe=T00:00:20,T00:01:20 [dst]
```
  
This will extract the time ranges [10s,20s], [1m10s,1m20s] and all media starting from 2m  
  
If no end range is found for a given start range:  

- if a following start range is set, the end range is set to this next start  
- otherwise, the end range is open  

  
Example
```
gpac -i m.mp4 reframer:xs=0,10,25:xe=5,20 [dst]
```
  
This will extract the time ranges [0s,5s], [10s,20s] and all media starting from 25s  
Example
```
gpac -i m.mp4 reframer:xs=0,10,25 [dst]
```
  
This will extract the time ranges [0s,10s], [10s,25s] and all media starting from 25s  
  
It is possible to signal range boundaries in output packets using [splitrange](#splitrange).  
This will expose on the first packet of each range in each PID the following properties:  

- `FileNumber`: starting at 1 for the first range, to be used as replacement for $num$ in templates  
- `FileSuffix`: corresponding to `StartRange_EndRange` or `StartRange` for open ranges, to be used as replacement for $FS$ in templates  

  
Example
```
gpac -i m.mp4 reframer:xs=T00:00:10,T00:01:10:xe=T00:00:20:splitrange -o dump_$FS$.264 [dst]
```
  
This will create two output files dump_T00.00.10_T00.02.00.264 and dump_T00.01.10.264.  
_Note: The `:` and `/` characters are replaced by `.` in `FileSuffix` property._  
  
It is possible to modify PID properties per range using [props](#props). Each set of property must be specified using the active separator set.  

__Warning: The option must be escaped using double separators in order to be parsed properly.__  
  
Example
```
gpac -i m.mp4 reframer:xs=0,30::props=#Period=P1,#Period=P2:#foo=bar [dst]
```
  
This will assign to output PIDs  

- during the range [0,30]: property `Period` to `P1`  
- during the range [30, end]: properties `Period` to `P2` and property `foo` to `bar`  

  
For uncompressed audio PIDs, input frame will be split to closest audio sample number.  
  
When [xround](#xround) is set to `seek`, the following applies:  

- a single range shall be specified  
- the first I-frame preceding or matching the range start is used as split point  
- all packets before range start are marked as seek points  
- packets overlapping range start are forwarded with a `SkipBegin` property set to the amount of media to skip  
- packets overlapping range end are forwarded with an adjusted duration to match the range end  

This mode is typically used to extract a range in a frame/sample accurate way, rather than a GOP-aligned way.  
  
When [xround](#xround) is not set to `seek`, compressed audio streams will still use seek mode.  
Consequently, these streams will have modified edit lists in ISOBMFF which might not be properly handled by players.  
This can be avoided using [no_audio_seek](#no_audio_seek), but this will introduce audio delay.  
  
# UTC-based range extraction  
  
The filter can perform range extraction based on UTC time rather than media time. In this mode, the end time must be:  

- a UTC date: range extraction will stop after this date  
- a time in second: range extraction will stop after the specified duration  

  
The UTC reference is specified using [utc_ref](#utc_ref).  
If UTC signal from media source is used, the filter will probe for [utc_probe](#utc_probe) before considering the source has no UTC signal.  
  
The properties `SenderNTP` and, if absent, `UTC` of source packets are checked for establishing the UTC reference.  

# Other split actions  
  
The filter can perform splitting of the source using [xs](#xs) option.  
The additional formats allowed for [xs](#xs) option are:  

- `SAP`: split source at each SAP/RAP  
- `D`VAL: split source by chunks of `VAL` seconds  
- `D`NUM/DEN: split source by chunks of `NUM/DEN` seconds  
- `S`VAL: split source by chunks of estimated size `VAL` bytes (can use property multipliers, e.g. `m`)  

  
_Note: In these modes, [splitrange](#splitrange) and [xadjust](#xadjust) are implicitly set._  
  
# Absorbing stream discontinuities  
  
Discontinuities may happen quite ofter in streaming sessions due to resolution switching, codec change, etc ...  
While GPAC handles these discontinuities internally, it may be desired to ignore them, for example when a source is knwon to have no discontinuity but GPAC detects some due to network errors or other changing properties that should be ignored.  
The [nodisc](#nodisc) option allows removing all discontinuities once a stream is setup.  

__Warning: Make sure you know what you are doing as using this option could make the stream not playable (ignoring a codec config change).__  
  
Example
```
gpac -i SOMEURL reframer:nodisc -o DASH_ORIGIN
```
  
In this example, the dasher filter will never trigger a period switch due to input stream discontinuity.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="exporter">__exporter__</a> (bool, default: _false_): compatibility with old exporter, displays export results  
</div>  
<div markdown class="option">  
<a id="rt" data-level="basic">__rt__</a> (enum, default: _off_, updatable): real-time regulation mode of input  

- off: disables real-time regulation  
- on: enables real-time regulation, one clock per PID  
- sync: enables real-time regulation one clock for all PIDs  
</div>  
  
<div markdown class="option">  
<a id="saps" data-level="basic">__saps__</a> (uintl, Enum: 0|1|2|3|4, updatable): list of SAP types (0,1,2,3,4) to forward, other packets are dropped (forwarding only sap 0 will break the decoding)  
</div>  
  
<div markdown class="option">  
<a id="refs" data-level="basic">__refs__</a> (bool, default: _false_, updatable): forward only frames used as reference frames, if indicated in the input stream  
</div>  
<div markdown class="option">  
<a id="speed">__speed__</a> (dbl, default: _0.0_, updatable): speed for real-time regulation mode, a value of 0 uses speed from play commands  
</div>  
<div markdown class="option">  
<a id="raw" data-level="basic">__raw__</a> (enum, default: _no_): force input AV streams to be in raw format  

- no: do not force decoding of inputs  
- av: force decoding of audio and video inputs  
- a: force decoding of audio inputs  
- v: force decoding of video inputs  
</div>  
  
<div markdown class="option">  
<a id="frames">__frames__</a> (sintl, updatable): drop all except listed frames (first being 1). A negative value `-V` keeps only first frame every `V` frames  
</div>  
<div markdown class="option">  
<a id="xs" data-level="basic">__xs__</a> (strl): extraction start time(s)  
</div>  
<div markdown class="option">  
<a id="xe" data-level="basic">__xe__</a> (strl): extraction end time(s). If less values than start times, the last time interval extracted is an open range  
</div>  
<div markdown class="option">  
<a id="xround">__xround__</a> (enum, default: _before_): adjust start time of extraction range to I-frame  

- before: use first I-frame preceding or matching range start  
- seek: see filter help  
- after: use first I-frame (if any) following or matching range start  
- closest: use I-frame closest to range start  
</div>  
  
<div markdown class="option">  
<a id="xadjust">__xadjust__</a> (bool, default: _false_): adjust end time of extraction range to be before next I-frame  
</div>  
<div markdown class="option">  
<a id="xots">__xots__</a> (bool, default: _false_): keep original timestamps after extraction  
</div>  
<div markdown class="option">  
<a id="xdts">__xdts__</a> (bool, default: _false_): compute start times based on DTS and not CTS  
</div>  
<div markdown class="option">  
<a id="nosap">__nosap__</a> (bool, default: _false_): do not cut at SAP when extracting range (may result in broken streams)  
</div>  
<div markdown class="option">  
<a id="splitrange">__splitrange__</a> (bool, default: _false_): signal file boundary at each extraction first packet for template-base file generation  
</div>  
<div markdown class="option">  
<a id="seeksafe">__seeksafe__</a> (dbl, default: _10.0_): rewind play requests by given seconds (to make sure the I-frame preceding start is catched)  
</div>  
<div markdown class="option">  
<a id="tcmdrw">__tcmdrw__</a> (bool, default: _true_): rewrite TCMD samples when splitting  
</div>  
<div markdown class="option">  
<a id="props">__props__</a> (strl): extra output PID properties per extraction range  
</div>  
<div markdown class="option">  
<a id="no_audio_seek">__no_audio_seek__</a> (bool, default: _false_): disable seek mode on audio streams (no change of priming duration)  
</div>  
<div markdown class="option">  
<a id="probe_ref">__probe_ref__</a> (bool, default: _false_): allow extracted range to be longer in case of B-frames with reference frames presented outside of range  
</div>  
<div markdown class="option">  
<a id="utc_ref">__utc_ref__</a> (enum, default: _any_): set reference mode for UTC range extraction  

- local: use UTC of local host  
- any: use UTC of media, or UTC of local host if not found in media after probing time  
- media: use UTC of media (abort if none found)  
- tc: use timecode of media (be careful: considered day will be today)  
</div>  
  
<div markdown class="option">  
<a id="utc_probe">__utc_probe__</a> (uint, default: _5000_): timeout in milliseconds to try to acquire UTC reference from media  
</div>  
<div markdown class="option">  
<a id="copy">__copy__</a> (bool, default: _false_, updatable): try copying frame interface into packets  
</div>  
<div markdown class="option">  
<a id="cues">__cues__</a> (enum, default: _no_, updatable): cue filtering mode  

- no: do no filter frames based on cue info  
- segs: only forward frames marked as segment start  
- frags: only forward frames marked as fragment start  
</div>  
  
<div markdown class="option">  
<a id="sapcue">__sapcue__</a> (uint, default: _0_): treat SAPs smaller than or equal to this value as cue points  
</div>  
<div markdown class="option">  
<a id="rmseek">__rmseek__</a> (bool, default: _false_, updatable): remove seek flag of all sent packets  
</div>  
<div markdown class="option">  
<a id="nodisc">__nodisc__</a> (bool, default: _false_, updatable): ignore all discontinuities from input - see filter help  
</div>  
  
