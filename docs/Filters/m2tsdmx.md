<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MPEG-2 TS demultiplexer  {:data-level="all"}  
  
Register name used to load filter: __m2tsdmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter demultiplexes MPEG-2 Transport Stream files/data into a set of media PIDs and frames.  
  

# Options    
  
<a id="temi_url">__temi_url__</a> (cstr): force TEMI URL  
<a id="dsmcc">__dsmcc__</a> (bool, default: _no_): enable DSMCC receiver  
<a id="seeksrc">__seeksrc__</a> (bool, default: _true_): seek local source file back to origin once all programs are setup  
<a id="sigfrag">__sigfrag__</a> (bool, default: _false_): signal segment boundaries on output packets for DASH or HLS sources  
<a id="dvbtxt">__dvbtxt__</a> (bool, default: _false_): export DVB teletext streams  
  
