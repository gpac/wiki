<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# HTTP input  
  
Register name used to load filter: __httpin__  
This filter may be automatically loaded during graph resolution.  
  
This filter dispatch raw blocks from a remote HTTP resource into a filter chain.  
Block size can be adjusted using [block_size](#block_size), and disk caching policies can be adjusted.  
Content format can be forced through [mime](#mime) and file extension can be changed through [ext](#ext).  
  
The filter supports both http and https schemes, and will attempt reconnecting as TLS if TCP connection fails.  
  
_Note: Unless disabled at session level (see [-no-probe](core_options/#no-probe) ), file extensions are usually ignored and format probing is done on the first data block._  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): URL of source content  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _100000_): block size used to read file  
</div>  
<div markdown class="option">  
<a id="cache">__cache__</a> (enum, default: _none_): set cache mode  

- auto: cache to disk if content length is known, no cache otherwise  
- disk: cache to disk,  discard once session is no longer used  
- keep: cache to disk and keep  
- mem: stores to memory, discard once session is no longer used  
- mem_keep: stores to memory, keep after session is reassigned but move to `mem` after first download  
- none: no cache  
- none_keep: stores to memory, keep after session is reassigned but move to `none` after first download  
</div>  
  
<div markdown class="option">  
<a id="range" data-level="basic">__range__</a> (lfrac, default: _0-0_): set byte range, as fraction  
</div>  
<div markdown class="option">  
<a id="ext" data-level="basic">__ext__</a> (cstr): override file extension  
</div>  
<div markdown class="option">  
<a id="mime" data-level="basic">__mime__</a> (cstr): set file mime type  
</div>  
<div markdown class="option">  
<a id="blockio">__blockio__</a> (bool, default: _false_): use blocking IO  
</div>  
  
