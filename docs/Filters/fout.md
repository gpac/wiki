<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# File output  
  
Register name used to load filter: __fout__  
This filter may be automatically loaded during graph resolution.  
  
This filter is used to write data to disk, and does not produce any output PID.  
In regular mode, the filter only accept PID of type file. It will dump to file incoming packets (stream type file), starting a new file for each packet having a _frame_start_ flag set, unless operating in [cat](#cat) mode.  
If the output file name is `std` or `stdout`, writes to stdout.  
The output file name can use gpac templating mechanism, see `gpac -h doc`.The filter watches the property `FileNumber` on incoming packets to create new files.  
  
# Discard sink mode  
  
When the destination is `null`, the filter is a sink dropping all input packets.  
In this case it accepts ANY type of input PID, not just file ones.  
  
# HTTP streaming recording  
  
When recording a DASH or HLS session, the number of segments to keep per quality can be set using [max_cache_segs](#max_cache_segs).  
- value `0`  keeps everything (default behaviour)  
- a negative value `N` will keep `-N` files regardless of the time-shift buffer value  
- a positive value `N` will keep `MAX(N, time-shift buffer)` files  
  
Example
```
gpac -i LIVE_MPD dashin:forward=file -o rec/$File$:max_cache_segs=3
```  
This will force keeping a maximum of 3 media segments while recording the DASH session.  
  

# Options    
  
<a id="dst">__dst__</a> (cstr): location of destination file  
<a id="append">__append__</a> (bool, default: _false_): open in append mode  
<a id="dynext">__dynext__</a> (bool, default: _false_): indicate the file extension is set by filter chain, not dst  
<a id="start">__start__</a> (dbl, default: _0.0_): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
<a id="speed">__speed__</a> (dbl, default: _1.0_): set playback speed when vsync is on. If negative and start is 0, start is set to -1  
<a id="ext">__ext__</a> (cstr): set extension for graph resolution, regardless of file extension  
<a id="mime">__mime__</a> (cstr): set mime type for graph resolution  
<a id="cat">__cat__</a> (enum, default: _none_): cat each file of input PID rather than creating one file per filename  
* none: never cat files  
* auto: only cat if files have same names  
* all: always cat regardless of file names  
  
<a id="ow">__ow__</a> (enum, default: _yes_): overwrite output mode when concatenation is not used  
* yes: override file if existing  
* no: throw error if file existing  
* ask: interactive prompt  
  
<a id="mvbk">__mvbk__</a> (uint, default: _8192_): block size used when moving parts of the file around in patch mode  
<a id="redund">__redund__</a> (bool, default: _false_): keep redundant packet in output file  
<a id="max_cache_segs">__max_cache_segs__</a> (sint, default: _0_): maximum number of segments cached per HAS quality when recording live sessions (0 means no limit)  
<a id="force_null">__force_null__</a> (bool, default: _false_): force no output regardless of file name  
  
