<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Closed-Caption decoder  
  
Register name used to load filter: __ccdec__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter decodes Closed Captions to unframed SRT.  
Supported video media types are MPEG2, AVC, HEVC, VVC and AV1 streams.  
  
Only a subset of CEA 608/708 is supported.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="field" data-level="basic">__field__</a> (uint, default: _1_): field to decode  
</div>  
<div markdown class="option">  
<a id="agg" data-level="basic">__agg__</a> (enum, default: _none_): output aggregation mode  

- none: forward data as decoded (default)  
- word: aggregate words (separated by a space)  
</div>  
  
  
