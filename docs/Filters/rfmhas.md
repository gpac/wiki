<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MPEH-H Audio Stream reframer  
  
Register name used to load filter: __rfmhas__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses MHAS files/data and outputs corresponding audio PID and frames.  
By default, the filter expects a MHAS stream with SYNC packets set, otherwise tune-in will fail. Using [nosync](#nosync)=false can help parsing bitstreams with no SYNC packets.  
The default behavior is to dispatch a framed MHAS bitstream. To demultiplex into a raw MPEG-H Audio, use [mpha](#mpha).  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="index" data-level="basic">__index__</a> (dbl, default: _1.0_): indexing window length  
</div>  
<div markdown class="option">  
<a id="mpha" data-level="basic">__mpha__</a> (bool, default: _false_): demultiplex MHAS and only forward audio frames  
</div>  
<div markdown class="option">  
<a id="pcksync" data-level="basic">__pcksync__</a> (uint, default: _4_): number of unknown packets to tolerate before considering sync is lost  
</div>  
<div markdown class="option">  
<a id="nosync" data-level="basic">__nosync__</a> (bool, default: _true_): initial sync state  
</div>  
  
