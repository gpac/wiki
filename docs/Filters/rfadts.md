<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# ADTS reframer  
  
Register name used to load filter: __rfadts__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses AAC files/data and outputs corresponding audio PID and frames.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="frame_size">__frame_size__</a> (uint, default: _1024_): size of AAC frame in audio samples  
</div>  
<div markdown class="option">  
<a id="index" data-level="basic">__index__</a> (dbl, default: _1.0_): indexing window length  
</div>  
<div markdown class="option">  
<a id="ovsbr">__ovsbr__</a> (bool, default: _false_): force oversampling SBR (does not multiply timescales by 2)  
</div>  
<div markdown class="option">  
<a id="sbr">__sbr__</a> (enum, default: _no_): set SBR signaling  

- no: no SBR signaling at all  
- imp: backward-compatible SBR signaling (audio signaled as AAC-LC)  
- exp: explicit SBR signaling (audio signaled as AAC-SBR)  
</div>  
  
<div markdown class="option">  
<a id="ps">__ps__</a> (enum, default: _no_): set PS signaling  

- no: no PS signaling at all  
- imp: backward-compatible PS signaling (audio signaled as AAC-LC)  
- exp: explicit PS signaling (audio signaled as AAC-PS)  
</div>  
  
<div markdown class="option">  
<a id="expart" data-level="basic">__expart__</a> (bool, default: _false_): expose pictures as a dedicated video PID  
</div>  
<div markdown class="option">  
<a id="aacchcfg">__aacchcfg__</a> (sint, default: _0_): set AAC channel configuration to this value if missing from ADTS header, use negative value to always override  
</div>  
  
