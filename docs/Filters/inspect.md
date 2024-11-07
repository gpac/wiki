<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Inspect packets  
  
Register name used to load filter: __inspect__  
This filter is not checked during graph resolution and needs explicit loading.  
  
The inspect filter can be used to dump PID and packets. It may also be used to check parts of payload of the packets.  
  
The default options inspect only PID changes.  
If [full](#full) is not set, [mode=frame](#mode=frame) is forced and PID properties are formatted in human-readable form, one PID per line.  
Otherwise, all properties are dumped.  
_Note: specifying [xml](#xml), [analyze](#analyze), [fmt](#fmt) or using `-for-test` will force [full](#full) to true._  
  
# Custom property dumping  
  
The packet inspector can be configured to dump specific properties of packets using [fmt](#fmt).  
When the option is not present, all properties are dumped. Otherwise, only properties identified by `$TOKEN$` are printed. You may use '$', '@' or '%' for `TOKEN` separator. `TOKEN` can be:  

- pn: packet (frame in framed mode) number  
- dts: decoding time stamp in stream timescale, N/A if not available  
- ddts: difference between current and previous packets decoding time stamp in stream timescale, N/A if not available  
- cts: composition time stamp in stream timescale, N/A if not available  
- dcts: difference between current and previous packets composition time stamp in stream timescale, N/A if not available  
- ctso: difference between composition time stamp and decoding time stamp in stream timescale, N/A if not available  
- dur: duration in stream timescale  
- frame: framing status  

    - interface: complete AU, interface object (no size info). Typically a GL texture  
    - frame_full: complete AU  
    - frame_start: beginning of frame  
    - frame_end: end of frame  
    - frame_cont: frame continuation (not beginning, not end)  

- sap or rap: SAP type of the frame  
- ilace: interlacing flag (0: progressive, 1: top field, 2: bottom field)  
- corr: corrupted packet flag  
- seek: seek flag  
- bo: byte offset in source, N/A if not available  
- roll: roll info  
- crypt: crypt flag  
- vers: carousel version number  
- size: size of packet  
- csize: total size of packets received so far  
- crc: 32 bit CRC of packet  
- lf or n: insert new line  
- t: insert tab  
- data: hex dump of packet (_big output!_) or as string if legal UTF-8  
- lp: leading picture flag  
- depo: depends on other packet flag  
- depf: is depended on other packet flag  
- red: redundant coding flag  
- start: packet composition time as HH:MM:SS.ms  
- startc: packet composition time as HH:MM:SS,ms  
- end: packet end time as HH:MM:SS.ms  
- endc: packet end time as HH:MM:SS,ms  
- ck: clock type used for PCR discontinuities  
- pcr: MPEG-2 TS last PCR, n/a if not available  
- pcrd: difference between last PCR and decoding time, n/a if no PCR available  
- pcrc: difference between last PCR and composition time, n/a if no PCR available  
- P4CC: 4CC of packet property  
- PropName: Name of packet property  
- pid.P4CC: 4CC of PID property  
- pid.PropName: Name of PID property  
- fn: Filter name  

  
Example
```
fmt="PID $pid.ID$ packet $pn$ DTS $dts$ CTS $cts$ $lf$"
```
  
This dumps packet number, cts and dts as follows: `PID 1 packet 10 DTS 100 CTS 108 \n`  
    
An unrecognized keyword or missing property will resolve to an empty string.  
  
_Note: when dumping in interleaved mode, there is no guarantee that the packets will be dumped in their original sequence order since the inspector fetches one packet at a time on each PID._  
  
# Note on playback  
  
Buffering can be enabled to check the input filter chain behaviour, e.g. check HAS adaptation logic.  
The various buffering options control when packets are consumed. Buffering events are logged using `media@info` for state changes and `media@debug` for media filling events.  
The [speed](#speed) option is only used to configure the filter chain but is ignored by the filter when consuming packets.  
If real-time consumption is required, a reframer filter must be setup before the inspect filter.  
Example
```
gpac -i SRC reframer:rt=on inspect:buffer=10000:rbuffer=1000:mbuffer=30000:speed=2
```
  
This will play the session at 2x speed, using 30s of maximum buffering, consuming packets after 10s of media are ready and rebuffering if less than 1s of media.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="log" data-level="basic">__log__</a> (str, default: _stdout_, Enum: _any|stderr|stdout|GLOG|TL|null): set probe log filename  

- _any: target file path and name  
- stderr: dump to stderr  
- stdout: dump to stdout  
- GLOG: use GPAC logs `app@info`  
- TL: use GPAC log tool `TL` at level `info`  
- null: silent mode  
</div>  
  
<div markdown class="option">  
<a id="mode" data-level="basic">__mode__</a> (enum, default: _pck_): dump mode  

- pck: dump full packet  
- blk: dump packets before reconstruction  
- frame: force reframer  
- raw: dump source packets without demultiplexing  
</div>  
  
<div markdown class="option">  
<a id="interleave">__interleave__</a> (bool, default: _true_): dump packets as they are received on each PID. If false, logs are reported for each PID at end of session  
</div>  
<div markdown class="option">  
<a id="deep">__deep__</a> (bool, default: _false_, updatable): dump packets along with PID state change, implied when [fmt](#fmt) is set  
</div>  
<div markdown class="option">  
<a id="props">__props__</a> (bool, default: _true_, updatable): dump packet properties, ignored when [fmt](#fmt) is set  
</div>  
<div markdown class="option">  
<a id="dump_data">__dump_data__</a> (bool, default: _false_, updatable): enable full data dump (_very large output_), ignored when [fmt](#fmt) is set  
</div>  
<div markdown class="option">  
<a id="fmt">__fmt__</a> (str, updatable): set packet dump format  
</div>  
<div markdown class="option">  
<a id="hdr">__hdr__</a> (bool, default: _true_): print a header corresponding to fmt string without '$' or "pid"  
</div>  
<div markdown class="option">  
<a id="allp">__allp__</a> (bool, default: _false_): analyse for the entire duration, rather than stopping when all PIDs are found  
</div>  
<div markdown class="option">  
<a id="info">__info__</a> (bool, default: _false_, updatable): monitor PID info changes  
</div>  
<div markdown class="option">  
<a id="full">__full__</a> (bool, default: _false_, updatable): full dump of PID properties (always on if XML)  
</div>  
<div markdown class="option">  
<a id="pcr">__pcr__</a> (bool, default: _false_, updatable): dump M2TS PCR info  
</div>  
<div markdown class="option">  
<a id="speed" data-level="basic">__speed__</a> (dbl, default: _1.0_): set playback command speed. If negative and start is 0, start is set to -1  
</div>  
<div markdown class="option">  
<a id="start" data-level="basic">__start__</a> (dbl, default: _0.0_): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
</div>  
<div markdown class="option">  
<a id="dur" data-level="basic">__dur__</a> (frac, default: _0/0_): set inspect duration  
</div>  
<div markdown class="option">  
<a id="analyze">__analyze__</a> (enum, default: _off_, updatable): analyze sample content (NALU, OBU), similar to `-bsdbg` option of reframer filters  

- off: no analyzing  
- on: simple analyzing  
- bs: log bitstream syntax (all elements read from bitstream)  
- full: log bitstream syntax and bit sizes signaled as `(N)` after field value, except 1-bit fields (omitted)  
</div>  
  
<div markdown class="option">  
<a id="xml" data-level="basic">__xml__</a> (bool, default: _false_, updatable): use xml formatting (implied if (-analyze]() is set) and disable [fmt](#fmt)  
</div>  
<div markdown class="option">  
<a id="crc" data-level="basic">__crc__</a> (bool, default: _false_, updatable): dump crc of samples of subsamples (NALU or OBU) when analyzing  
</div>  
<div markdown class="option">  
<a id="fftmcd">__fftmcd__</a> (bool, default: _false_, updatable): consider timecodes use ffmpeg-compatible signaling rather than QT compliant one  
</div>  
<div markdown class="option">  
<a id="dtype" data-level="basic">__dtype__</a> (bool, default: _false_, updatable): dump property type  
</div>  
<div markdown class="option">  
<a id="buffer">__buffer__</a> (uint, default: _0_): set playback buffer in ms  
</div>  
<div markdown class="option">  
<a id="mbuffer" data-level="basic">__mbuffer__</a> (uint, default: _0_): set max buffer occupancy in ms. If less than buffer, use buffer  
</div>  
<div markdown class="option">  
<a id="rbuffer" data-level="basic">__rbuffer__</a> (uint, default: _0_, updatable): rebuffer trigger in ms. If 0 or more than buffer, disable rebuffering  
</div>  
<div markdown class="option">  
<a id="stats">__stats__</a> (bool, default: _false_): compute statistics for PIDs  
</div>  
<div markdown class="option">  
<a id="test">__test__</a> (enum, default: _no_, updatable): skip predefined set of properties, used for test mode  

- no: no properties skipped  
- noprop: all properties/info changes on PID are skipped, only packets are dumped  
- network: URL/path dump, cache state, file size properties skipped (used for hashing network results)  
- netx: same as network but skip track duration and templates (used for hashing progressive load of fmp4)  
- encode: same as network plus skip decoder config (used for hashing encoding results)  
- encx: same as encode and skip bitrates, media data size and co  
- nocrc: disable packet CRC dump  
- nobr: skip bitrate  
</div>  
  
  
