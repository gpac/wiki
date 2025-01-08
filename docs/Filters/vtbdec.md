<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# VideoToolBox decoder  
  
Register name used to load filter: __vtbdec__  
This filter may be automatically loaded during graph resolution.  
  
This filter decodes video streams through OSX/iOS VideoToolBox (MPEG-2, H263, AVC|H264, HEVC, ProRes). It allows GPU frame dispatch or direct frame copy.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="reorder">__reorder__</a> (uint, default: _6_): number of frames to wait for temporal re-ordering  
</div>  
<div markdown class="option">  
<a id="no_copy">__no_copy__</a> (bool, default: _true_): dispatch decoded frames as OpenGL textures (true) or as copied packets (false)   
</div>  
<div markdown class="option">  
<a id="ofmt">__ofmt__</a> (pfmt, default: _nv12_): set default pixel format for decoded video. If not found, fall back to `nv12`  
</div>  
<div markdown class="option">  
<a id="disable_hw" data-level="basic">__disable_hw__</a> (bool, default: _false_): disable hardware decoding  
</div>  
<div markdown class="option">  
<a id="wait_sync" data-level="basic">__wait_sync__</a> (bool, default: _false_, updatable): wait for sync frame before decoding  
</div>  
  
