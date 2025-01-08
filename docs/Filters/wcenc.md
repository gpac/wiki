<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# WebCodec encoder  
  
Register name used to load filter: __wcenc__  
This filter may be automatically loaded during graph resolution.  
  
This filter encodes video streams using WebCodec encoder of the browser  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="c" data-level="basic">__c__</a> (str): codec identifier. Can be any supported GPAC codec name or ffmpeg codec name - updated to ffmpeg codec name after initialization  
</div>  
<div markdown class="option">  
<a id="fintra" data-level="basic">__fintra__</a> (frac, default: _-1/1_): force intra / IDR frames at the given period in sec, e.g. `fintra=2` will force an intra every 2 seconds and `fintra=1001/1000` will force an intra every 30 frames on 30000/1001=29.97 fps video; ignored for audio  
</div>  
<div markdown class="option">  
<a id="all_intra">__all_intra__</a> (bool, default: _false_, updatable): only produce intra frames  
</div>  
<div markdown class="option">  
<a id="b" data-level="basic">__b__</a> (uint, default: _0_): bitrate in bits per seconds, defaults to 2M for video and 124K for audio  
</div>  
<div markdown class="option">  
<a id="queued" data-level="basic">__queued__</a> (uint, default: _10_): maximum number of packets to queue in webcodec instance  
</div>  
  
