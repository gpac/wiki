<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# File output  
  
Register name used to load filter: __fout__  
This filter may be automatically loaded during graph resolution.  
  
This filter is used to write data to disk, and does not produce any output PID.  
In regular mode, the filter only accept PID of type file. It will dump to file incoming packets (stream type file), starting a new file for each packet having a _frame_start_ flag set, unless operating in [cat](#cat) mode.  
If the output file name is `std` or `stdout`, writes to stdout.  
The output file name can use gpac templating mechanism, see `gpac -h doc`.The filter watches the property `FileNumber` on incoming packets to create new files.  
  
By default output files are created directly, which may lead to issues if concourrent programs attempt to access them.  
By enabling [atomic](#atomic), files will be created in target destination folder with the `.gftmp` suffix and move to their final name upon close.  
  
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
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="dst" data-level="basic">__dst__</a> (cstr): location of destination file  
</div>  
<div markdown class="option">  
<a id="append">__append__</a> (bool, default: _false_): open in append mode  
</div>  
<div markdown class="option">  
<a id="dynext">__dynext__</a> (bool, default: _false_): indicate the file extension is set by filter chain, not dst  
</div>  
<div markdown class="option">  
<a id="start" data-level="basic">__start__</a> (dbl, default: _0.0_): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
</div>  
<div markdown class="option">  
<a id="speed" data-level="basic">__speed__</a> (dbl, default: _1.0_): set playback speed when vsync is on. If negative and start is 0, start is set to -1  
</div>  
<div markdown class="option">  
<a id="ext">__ext__</a> (cstr): set extension for graph resolution, regardless of file extension  
</div>  
<div markdown class="option">  
<a id="mime">__mime__</a> (cstr): set mime type for graph resolution  
</div>  
<div markdown class="option">  
<a id="cat">__cat__</a> (enum, default: _none_): cat each file of input PID rather than creating one file per filename  

- none: never cat files  
- auto: only cat if files have same names  
- all: always cat regardless of file names  
</div>  
  
<div markdown class="option">  
<a id="ow" data-level="basic">__ow__</a> (enum, default: _yes_): overwrite output mode when concatenation is not used  

- yes: override file if existing  
- no: throw error if file existing  
- ask: interactive prompt  
</div>  
  
<div markdown class="option">  
<a id="mvbk" data-level="basic">__mvbk__</a> (uint, default: _8192_): block size used when moving parts of the file around in patch mode  
</div>  
<div markdown class="option">  
<a id="redund" data-level="basic">__redund__</a> (bool, default: _false_): keep redundant packet in output file  
</div>  
<div markdown class="option">  
<a id="max_cache_segs">__max_cache_segs__</a> (sint, default: _0_): maximum number of segments cached per HAS quality when recording live sessions (0 means no limit)  
</div>  
<div markdown class="option">  
<a id="force_null">__force_null__</a> (bool, default: _false_): force no output regardless of file name  
</div>  
<div markdown class="option">  
<a id="atomic">__atomic__</a> (bool, default: _false_): use atomic file write for non append modes  
</div>  
  
