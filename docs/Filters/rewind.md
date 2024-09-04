<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Audio/Video rewinder  {:data-level="all"}  
  
Register name used to load filter: __rewind__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter reverses audio and video frames in negative playback speed.  
The filter is in passthrough if speed is positive. Otherwise, it reverts decoded GOPs for video, or revert samples in decoded frame for audio (not really nice for most codecs).  
  

# Options    
  
<a id="rbuffer">__rbuffer__</a> (uint, default: _100_): size of video rewind buffer in frames. If more frames than this, flush is performed  
  
