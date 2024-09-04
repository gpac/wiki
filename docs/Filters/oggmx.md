<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# OGG multiplexer  {:data-level="all"}  
  
Register name used to load filter: __oggmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter multiplexes audio and video to produce an OGG stream.  
  
The [cdur](#cdur) option allows specifying the interleaving duration (max time difference between consecutive packets of different streams).   
  

# Options    
  
<a id="cdur">__cdur__</a> (frac, default: _1/10_): stream interleaving duration in seconds  
<a id="rcfg">__rcfg__</a> (frac, default: _0/1_): stream config re-injection frequency in seconds  
  
