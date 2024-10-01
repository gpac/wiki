<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# OGG multiplexer  
  
Register name used to load filter: __oggmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter multiplexes audio and video to produce an OGG stream.  
  
The [cdur](#cdur) option allows specifying the interleaving duration (max time difference between consecutive packets of different streams).   
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="cdur" data-level="basic">__cdur__</a> (frac, default: _1/10_): stream interleaving duration in seconds  
</div>  
<div markdown class="option">  
<a id="rcfg" data-level="basic">__rcfg__</a> (frac, default: _0/1_): stream config re-injection frequency in seconds  
</div>  
  
