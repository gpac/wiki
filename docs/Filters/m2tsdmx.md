<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MPEG-2 TS demultiplexer  
  
Register name used to load filter: __m2tsdmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter demultiplexes MPEG-2 Transport Stream files/data into a set of media PIDs and frames.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="temi_url">__temi_url__</a> (cstr): force TEMI URL  
</div>  
<div markdown class="option">  
<a id="dsmcc">__dsmcc__</a> (bool, default: _no_): enable DSMCC receiver  
</div>  
<div markdown class="option">  
<a id="seeksrc">__seeksrc__</a> (bool, default: _true_): seek local source file back to origin once all programs are setup  
</div>  
<div markdown class="option">  
<a id="sigfrag">__sigfrag__</a> (bool, default: _false_): signal segment boundaries on output packets for DASH or HLS sources  
</div>  
<div markdown class="option">  
<a id="dvbtxt">__dvbtxt__</a> (bool, default: _false_): export DVB teletext streams  
</div>  
  
