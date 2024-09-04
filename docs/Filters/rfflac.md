<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FLAC reframer  {:data-level="all"}  
  
Register name used to load filter: __rfflac__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses FLAC files/data and outputs corresponding audio PID and frames.  
  
By default the reframer will only check CRC footer of frames if a change in sample rate or channel mapping is detected.  
This should accommodate for most configurations, but CRC check can be enforced using [docrc](#docrc).  
  

# Options    
  
<a id="index">__index__</a> (dbl, default: _1.0_): indexing window length  
<a id="docrc">__docrc__</a> (bool, default: _false_): perform CRC check after each frame  
  
