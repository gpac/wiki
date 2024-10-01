<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# WebVTT to TX3G  
  
Register name used to load filter: __vtt2tx3g__  
This filter may be automatically loaded during graph resolution.  
  
This filter rewrites unframed WebVTT to TX3G / QT Timed Text (binary format)  
  
Unframed WebVTT packets consist in single cues:  

- cue payload as packet payload  
- prefix as packet string property `vtt_pre`  
- cue ID as packet string property `vtt_cueid`  
- cue settings as packet string property `vtt_settings`  
- packet timing contains the cue timing (start and duration)  

  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="fontname" data-level="basic">__fontname__</a> (str): default font  
</div>  
<div markdown class="option">  
<a id="fontsize" data-level="basic">__fontsize__</a> (uint, default: _18_): default font size  
</div>  
  
