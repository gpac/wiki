<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# HEVC Tile extractor  
  
Register name used to load filter: __hevcsplit__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter splits a motion-constrained tiled HEVC PID into N independent HEVC PIDs.  
Use hevcmerge filter to merge initially motion-constrained tiled HEVC PID in a single output.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="minl">__minl__</a> (bool, default: _true_): rewrite level to minimum value acceptable for each stream  
</div>  
  
