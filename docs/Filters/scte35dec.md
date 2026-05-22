<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# SCTE35 decoder  
  
Register name used to load filter: __scte35dec__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter transforms SCTE-35 markers attached as properties to audio and video  
packets or inside a dedicated stream, into the request format. It also creates  
empty 'emeb' box in between following segmentation as hinted by the graph.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="mode" data-level="basic">__mode__</a> (enum, default: _evte_): mode to operate in  

- evte: outputs emib/emeb boxes for Event Tracks  
- m2ts: immediate dispatch of entire MPEG-2 TS splice_info_section as per ANSI/SCTE 67 2017 (13.1.1.3)  
- passthrough: pass-through mode adding cue start property on splice points  
</div>  
  
<div markdown class="option">  
<a id="sampdur" data-level="basic">__sampdur__</a> (frac, default: _0/1_): segmentation duration in seconds. Default value 0 only flushes when content changes  
</div>  
<div markdown class="option">  
<a id="prop" data-level="basic">__prop__</a> (bool, default: _false_): also attach data as property in case dasher needs it for dual in+out band  
</div>  
  
