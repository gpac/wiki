<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AVC/HEVC to AnnexB rewriter  
  
Register name used to load filter: __ufnalu__  
This filter may be automatically loaded during graph resolution.  
  
This filter converts AVC|H264 and HEVC streams into AnnexB format, with inband parameter sets and start codes.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="rcfg" data-level="basic">__rcfg__</a> (bool, default: _true_): force repeating decoder config at each I-frame  
</div>  
<div markdown class="option">  
<a id="extract">__extract__</a> (enum, default: _all_): layer extraction mode  

- all: extracts all layers  
- base: extract base layer only  
- layer: extract non-base layer(s) only  
</div>  
  
<div markdown class="option">  
<a id="delim">__delim__</a> (bool, default: _true_): insert AU Delimiter NAL  
</div>  
<div markdown class="option">  
<a id="pps_inband" data-level="basic">__pps_inband__</a> (bool, default: _false_): inject PPS at each non SAP frame, ignored if rcfg is not set  
</div>  
  
