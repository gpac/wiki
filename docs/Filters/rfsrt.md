<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# SRT reframer  
  
Register name used to load filter: __rfsrt__  
This filter may be automatically loaded during graph resolution.  
  
This filter rewrites unframed SRT to TX3G / QT Timed Text (binary format)  
  
An unframed SRT packet consists in a single SRT cue as packet payload and packet timing contains the cue timing (start and duration).  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="fontname" data-level="basic">__fontname__</a> (str): default font  
</div>  
<div markdown class="option">  
<a id="fontsize" data-level="basic">__fontsize__</a> (uint, default: _18_): default font size  
</div>  
  
