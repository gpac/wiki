<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AVC/HEVC to AnnexB writer  {:data-level="all"}  
  
Register name used to load filter: __ufnalu__  
This filter may be automatically loaded during graph resolution.  
  
This filter converts AVC|H264 and HEVC streams into AnnexB format, with inband parameter sets and start codes.  
  

# Options    
  
<a id="rcfg">__rcfg__</a> (bool, default: _true_): force repeating decoder config at each I-frame  
<a id="extract">__extract__</a> (enum, default: _all_): layer extraction mode  

- all: extracts all layers  
- base: extract base layer only  
- layer: extract non-base layer(s) only  
  
<a id="delim">__delim__</a> (bool, default: _true_): insert AU Delimiter NAL  
<a id="pps_inband">__pps_inband__</a> (bool, default: _false_): inject PPS at each non SAP frame, ignored if rcfg is not set  
  
