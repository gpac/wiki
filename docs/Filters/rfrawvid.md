<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# RAW video reframer  
  
Register name used to load filter: __rfrawvid__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses raw YUV and RGB files/data and outputs corresponding raw video PID and frames.  
  
The filter also parses YUV4MPEG format.  
  

# Options    
  
<a id="size">__size__</a> (v2di, default: _0x0_): source video resolution  
<a id="spfmt">__spfmt__</a> (pfmt, default: _none_, Enum: none|yuv420|yvu420|yuv420_10|yuv422|yuv422_10|yuv444|yuv444_10|uyvy|vyuy|yuyv|yvyu|uyvl|vyul|yuyl|yvyl|nv12|nv21|nv1l|nv2l|yuva|yuvd|yuv444a|yuv444p|v308|yuv444ap|v408|v410|v210|grey|algr|gral|rgb4|rgb5|rgb6|rgba|argb|bgra|abgr|rgb|bgr|xrgb|rgbx|xbgr|bgrx|rgbd|rgbds|uncv): source pixel format. When not set, derived from file extension  
  
<a id="fps">__fps__</a> (frac, default: _25/1_): number of frames per second  
<a id="copy">__copy__</a> (bool, default: _false_): copy source bytes into output frame. If not set, source bytes are referenced only  
  
