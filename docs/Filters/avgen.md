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
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="type" data-level="basic">__type__</a> (enum, default: _av_): output selection  

- a: audio only  
- v: video only  
- av: audio and video  
</div>  
  
<div markdown class="option">  
<a id="evte" data-level="basic">__evte__</a> (uint, default: _0_): output event stream  

- 0: disable  
- 1+: period (sec) of dummy events  
</div>  
  
<div markdown class="option">  
<a id="freq" data-level="basic">__freq__</a> (uint, default: _440_): frequency of beep  
</div>  
<div markdown class="option">  
<a id="freq2" data-level="basic">__freq2__</a> (uint, default: _659_): frequency of odd beep  
</div>  
<div markdown class="option">  
<a id="sr" data-level="basic">__sr__</a> (uint, default: _44100_): output samplerate  
</div>  
<div markdown class="option">  
<a id="flen" data-level="basic">__flen__</a> (uint, default: _1024_): output frame length in samples  
</div>  
<div markdown class="option">  
<a id="ch" data-level="basic">__ch__</a> (uint, default: _1_): number of channels  
</div>  
<div markdown class="option">  
<a id="alter" data-level="basic">__alter__</a> (bool, default: _false_): beep alternatively on each channel  
</div>  
<div markdown class="option">  
<a id="blen" data-level="basic">__blen__</a> (uint, default: _50_): length of beep in milliseconds  
</div>  
<div markdown class="option">  
<a id="fps" data-level="basic">__fps__</a> (frac, default: _25_): video frame rate  
</div>  
<div markdown class="option">  
<a id="sizes" data-level="basic">__sizes__</a> (v2il, default: _1280x720_): video size in pixels  
</div>  
<div markdown class="option">  
<a id="pfmt" data-level="basic">__pfmt__</a> (pfmt, default: _yuv_): output pixel format  
</div>  
<div markdown class="option">  
<a id="lock" data-level="basic">__lock__</a> (bool, default: _false_): lock timing to video generation  
</div>  
<div markdown class="option">  
<a id="dyn" data-level="basic">__dyn__</a> (bool, default: _true_): move bottom banner  
</div>  
<div markdown class="option">  
<a id="ntp" data-level="basic">__ntp__</a> (bool, default: _true_): send NTP along with packets  
</div>  
<div markdown class="option">  
<a id="copy" data-level="basic">__copy__</a> (bool, default: _false_): copy the framebuffer into each video packet instead of using packet references  
</div>  
<div markdown class="option">  
<a id="dur" data-level="basic">__dur__</a> (frac, default: _0/0_): run for the given time in second  
</div>  
<div markdown class="option">  
<a id="adjust" data-level="basic">__adjust__</a> (bool, default: _true_): adjust start time to synchronize counter and UTC  
</div>  
<div markdown class="option">  
<a id="pack" data-level="basic">__pack__</a> (enum, default: _no_): packing mode for stereo views  

- no: no packing  
- ss: side by side packing, forces [views](#views) to 2  
- tb: top-bottom packing, forces [views](#views) to 2  
</div>  
  
<div markdown class="option">  
<a id="disparity" data-level="basic">__disparity__</a> (uint, default: _20_): disparity in pixels between left-most and right-most views  
</div>  
<div markdown class="option">  
<a id="views" data-level="basic">__views__</a> (uint, default: _1_): number of views  
</div>  
<div markdown class="option">  
<a id="rates" data-level="basic">__rates__</a> (strl): number of target bitrates to assign, one per size  
</div>  
<div markdown class="option">  
<a id="logt" data-level="basic">__logt__</a> (bool): log frame time to console  
</div>  
<div markdown class="option">  
<a id="banner" data-level="basic">__banner__</a> (str, default: _many thanks to QuickJS, FreeType, OpenSSL, SDL, FFmpeg, OpenHEVC, libjpeg, libpng, faad2, libmad, a52dec, xvid, OGG ..._): banner text to display  
</div>  
  
