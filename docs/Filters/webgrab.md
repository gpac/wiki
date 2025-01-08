<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Web-based AV capture  
  
Register name used to load filter: __webgrab__  
This filter may be automatically loaded during graph resolution.  
  
This filter grabs audio and video streams MediaStreamTrackProcessor of the browser  
  
Supported URL schemes:  

- video:// grabs from camera  
- audio:// grabs from microphone  
- av:// grabs both audio from microphone and video from camera  
- video://ELTID grabs from DOM element with ID `ELTID` (the element must be a valid element accepted by `VideoFrame` constructor)  

  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (str): source url  
</div>  
<div markdown class="option">  
<a id="vsize">__vsize__</a> (v2di, default: _0x0_): desired webcam resolution  
</div>  
<div markdown class="option">  
<a id="back">__back__</a> (bool, default: _false_): use back camera  
</div>  
<div markdown class="option">  
<a id="ntp">__ntp__</a> (bool, default: _false_): mark packets with NTP  
</div>  
<div markdown class="option">  
<a id="alpha">__alpha__</a> (bool, default: _false_): keep alpha when brabbing canvas  
</div>  
<div markdown class="option">  
<a id="fps">__fps__</a> (frac, default: _0/1_): framerate to use when grabbing images - 0 FPS means single image  
</div>  
  
