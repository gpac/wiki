<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AV Counter Generator  
  
Register name used to load filter: __avgen__  
This is a JavaScript filter. It is not checked during graph resolution and needs explicit loading.  
Author: GPAC Team  
  
This filter generates AV streams representing a counter. Streams can be enabled or disabled using [type](#type).  
The filter is software-based and does not use GPU.  
  
When [adjust](#adjust) is set, the first video frame is adjusted such that a full circle happens at each exact second according to the system UTC clock.  
By default, video UTC and date are computed at each frame generation from current clock and not from frame number.  
This will result in broken UTC timing text when playing at speeds other than 1.0.  
This can be changed using [lock](#lock).  
  
Audio beep is generated every second, with octave (2xfreq) of even beep used every 10 seconds.  
When video is generated, beep is synchronized to video at each exact second.  
  
If NTP injection is used, each video packet (but not audio ones) has a `SenderNTP` property set; if video is not used, each audio packet has a `SenderNTP` property set.  
  
# Multiple output stream generation  
  
More than one output size can be specified. This will result in multiple sources being generated, one per size.  
A size can be specified more than once, resulting in packet references when [copy](#copy) is not set, or full copies otherwise.  
Target encoding bitrates can be assigned to each output using [rates](#rates). This can be useful when generating dash:  
Example
```
gpac avgen:sizes=1280x720,1920x1080:rates=2M,5M c=aac:FID=1 c=264:FID=2:clone -o live.mpd:SID=1,2
```  
  
# Multiview generation  
  
In multiview mode, only the animated counter will move in depth backward and forward, as indicated by the [disparity](#disparity) value.  
When [pack](#pack) is set, a packed stereo couple is generated for each video packet.  
Otherwise, when [views](#views) is greater than 2, each view is generated on a dedicated output PID with the property `ViewIdx` set in [1, views].  
Multi-view output forces usage of [copy](#copy) mode.  
  
# PID Naming  
  
The audio PID is assigned the name `audio` and ID `1`.  
If a single video PID is produced, it is assigned the name `video` and ID `2`.  
If multiple video PIDs are produced, they are assigned the names `videoN` and ID `N+1`, N in [1, sizes].  
If multiple [views](#views) are generated, they are assigned the names `videoN_vK` and ID `N*views+K-1`, N in [1, sizes], K in [1, views].  
  

# Options    
  
<a id="type">__type__</a> (enum, default: _av_): output selection  

- a: audio only  
- v: video only  
- av: audio and video  
  
<a id="freq">__freq__</a> (uint, default: _440_): frequency of beep  
<a id="freq2">__freq2__</a> (uint, default: _659_): frequency of odd beep  
<a id="sr">__sr__</a> (uint, default: _44100_): output samplerate  
<a id="flen">__flen__</a> (uint, default: _1024_): output frame length in samples  
<a id="ch">__ch__</a> (uint, default: _1_): number of channels  
<a id="alter">__alter__</a> (bool, default: _false_): beep alternatively on each channel  
<a id="blen">__blen__</a> (uint, default: _50_): length of beep in milliseconds  
<a id="fps">__fps__</a> (frac, default: _25_): video frame rate  
<a id="sizes">__sizes__</a> (v2il, default: _1280x720_): video size in pixels  
<a id="pfmt">__pfmt__</a> (pfmt, default: _yuv_): output pixel format  
<a id="lock">__lock__</a> (bool, default: _false_): lock timing to video generation  
<a id="dyn">__dyn__</a> (bool, default: _true_): move bottom banner  
<a id="ntp">__ntp__</a> (bool, default: _true_): send NTP along with packets  
<a id="copy">__copy__</a> (bool, default: _false_): copy the framebuffer into each video packet instead of using packet references  
<a id="dur">__dur__</a> (frac, default: _0/0_): run for the given time in second  
<a id="adjust">__adjust__</a> (bool, default: _true_): adjust start time to synchronize counter and UTC  
<a id="pack">__pack__</a> (enum, default: _no_): packing mode for stereo views  

- no: no packing  
- ss: side by side packing, forces [views](#views) to 2  
- tb: top-bottom packing, forces [views](#views) to 2  
  
<a id="disparity">__disparity__</a> (uint, default: _20_): disparity in pixels between left-most and right-most views  
<a id="views">__views__</a> (uint, default: _1_): number of views  
<a id="rates">__rates__</a> (strl): number of target bitrates to assign, one per size  
<a id="logt">__logt__</a> (bool): log frame time to console  
  
