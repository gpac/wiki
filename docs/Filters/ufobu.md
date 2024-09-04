<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# IVF/OBU/annexB writer  {:data-level="all"}  
  
Register name used to load filter: __ufobu__  
This filter may be automatically loaded during graph resolution.  
  
This filter rewrites VPx or AV1 bitstreams into a IVF, annexB or OBU sequence.  
The temporal delimiter OBU is re-inserted in annexB (`.av1` and `.av1b`files, with obu_size set) and OBU sequences (`.obu`files, without obu_size)  
_Note: VP8/9 codecs will only use IVF output (equivalent to file extension `.ivf` or `:ext=ivf` set on output)._  
  

# Options    
  
<a id="rcfg">__rcfg__</a> (bool, default: _true_): force repeating decoder config at each I-frame  
  
