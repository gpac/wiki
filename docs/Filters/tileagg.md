<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# HEVC tile aggregator  
  
Register name used to load filter: __tileagg__  
This filter may be automatically loaded during graph resolution.  
  
This filter aggregates a set of split tiled HEVC streams (`hvt1` or `hvt2` in ISOBMFF) into a single HEVC stream.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="tiledrop" data-level="basic">__tiledrop__</a> (uintl, updatable): specify indexes of tiles to drop  
</div>  
<div markdown class="option">  
<a id="ttimeout" data-level="basic">__ttimeout__</a> (uint, default: _10000_, updatable): number of milliseconds to wait until considering a tile packet lost, 0 waits forever  
</div>  
  
