<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# SCTE35 decoder  
  
Register name used to load filter: __scte35dec__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter writes the SCTE-35 markers attached as properties to audio and video  
packets or inside a dedicated stream, as 23001-18 'emib' boxes. It also creates  
empty 'emeb' box in between following segmentation as hinted by the graph.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="mode" data-level="basic">__mode__</a> (enum, default: _23001-18_): mode to operate in  

- 23001-18: extract SCTE-35 markers as emib/emeb boxes for Event Tracks  
- passthrough: pass-through mode adding cue start property on splice points  
</div>  
  
<div markdown class="option">  
<a id="segdur" data-level="basic">__segdur__</a> (frac, default: _1/1_): segmentation duration in seconds. 0/0 flushes immediately for each input packet (beware of the bitrate overhead)  
</div>  
  
