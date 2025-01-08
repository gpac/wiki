<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Thumbnail generator  
  
Register name used to load filter: __thumbs__  
This is a JavaScript filter. It is not checked during graph resolution and needs explicit loading.  
Author: GPAC team  
  
This filter generates screenshots from a video stream.  
  
The input video is down-sampled by the [scale](#scale) factor. The output size is configured based on the number of images per line and per column in the [grid](#grid).   
Once configured, the output size is no longer modified.  
  
The [snap](#snap) option indicates to use one video frame every given seconds. If value is 0, all input frames are used.  
  
If the number of rows is 0, it will be computed based on the source duration and desired [snap](#snap) time, and will default to 10 if it cannot be resolved.  
  
To output one image per input frame, use `:grid=1x1`.  
  
If a single image per output frame is used, the default value for [snap](#snap) is 0 and for [scale](#scale) is 1.  
Otherwise, the default value for [snap](#snap) is 1 second and for [scale](#scale) is 10.  
  
A single line of text can be inserted over each frame. Predefined keywords can be used in input text, identified as `$KEYWORD$`:  

- ts: replaced by packet timestamp  
- timescale: replaced by PID timescale  
- time: replaced by packet time as HH:MM:SS.ms  
- cpu: replaced by current CPU usage of process  
- mem: replaced by current memory usage of process  
- version: replaced by GPAC version  
- fversion: replaced by GPAC full version  
- mae: replaced by Mean Absolute Error with previous frame  
- mse: replaced by Mean Square Error with previous frame  
- P4CC, PropName: replaced by corresponding PID property  

  
Example
```
gpac -i src reframer:saps=1 thumbs:snap=30:grid=6x30 -o dump/$num$.png
```
  
This will generate images from key-frames only, inserting one image every 30 seconds. Using key-frame filtering is much faster but may give unexpected results if there are not enough key-frames in the source.  
  
Example
```
gpac -i src thumbs:snap=0:grid=5x5 -o dump/$num$.png
```
  
This will generate one image containing 25 frames every second at 25 fps.  
  
If a single image per output frame is used and the scaling factor is 1, the input packet is reused as input with text and graphics overlaid.  
  
Example
```
gpac -i src thumbs:grid=1x1:txt='Frame $time$' -o dump/$num$.png
```
  
This will inject text over each frame and keep timing and other packet properties.  
  
A json output can be specified in input [list](#list) to let applications retrieve frame position in output image from its timing.  
  
# Scene change detection  
  
The filter can compute the absolute and/or square error metrics between consecutive images and drop image if the computed metric is less than the given threshold.  
If both [mae](#mae) and [mse](#mse) thresholds are 0, scene detection is not performed (default).  
If both [mae](#mae) and [mse](#mse) thresholds are not 0, the frame is added if it passes both thresholds.  
  
For both metrics, a value of 0 means all pixels are the same, a value of 100 means all pixels have 100% intensity difference (e.g. black versus white).  
  
The scene detection is performed after the [snap](#snap) filtering and uses:  

- the previous frame in the stream, whether it was added or not, if [scref](#scref) is not set,  
- the last added frame otherwise.  

  
Typical thresholds for scene cut detection are 14 to 20 for [mae](#mae) and 5 to 7 for [mse](#mse).  
  
Since this is a costly process, it is recommended to use it combined with key-frames selection:  
  
Example
```
gpac -i src reframer:saps=1 thumbs:mae=15 -o dump/$num$.png
```
  
  
The [maxsnap](#maxsnap) option can be used to force insertion after the given time if no scene cut is found.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="grid" data-level="basic">__grid__</a> (v2di, default: _6x0_): number of images per lines and columns  
</div>  
<div markdown class="option">  
<a id="scale" data-level="basic">__scale__</a> (dbl, default: _-1_): scale factor for input size  
</div>  
<div markdown class="option">  
<a id="mae">__mae__</a> (uint, default: _0_, minmax: 0,100): scene diff threshold using Mean Absolute Error  
</div>  
<div markdown class="option">  
<a id="mse">__mse__</a> (uint, default: _0_, minmax: 0,100): scene diff threshold using Mean Square Error  
</div>  
<div markdown class="option">  
<a id="lw">__lw__</a> (dbl, default: _0.0_): line width between images in pixels  
</div>  
<div markdown class="option">  
<a id="lc">__lc__</a> (str, default: _white_): line color  
</div>  
<div markdown class="option">  
<a id="clear">__clear__</a> (str, default: _white_): clear color  
</div>  
<div markdown class="option">  
<a id="snap" data-level="basic">__snap__</a> (dbl, default: _-1_): duration between images, 0 for all images  
</div>  
<div markdown class="option">  
<a id="maxsnap" data-level="basic">__maxsnap__</a> (dbl, default: _-1_): maximum duration between two thumbnails when scene change detection is enabled  
</div>  
<div markdown class="option">  
<a id="pfmt">__pfmt__</a> (pfmt, default: _rgb_): output pixel format  
</div>  
<div markdown class="option">  
<a id="txt">__txt__</a> (str, default: __): text to insert per thumbnail  
</div>  
<div markdown class="option">  
<a id="tc">__tc__</a> (str, default: _white_): text color  
</div>  
<div markdown class="option">  
<a id="tb">__tb__</a> (str, default: _black_): text shadow  
</div>  
<div markdown class="option">  
<a id="font">__font__</a> (str, default: _SANS_): font to use  
</div>  
<div markdown class="option">  
<a id="fs">__fs__</a> (dbl, default: _10_): font size to use in percent of scaled height  
</div>  
<div markdown class="option">  
<a id="tv">__tv__</a> (dbl, default: _0_): text vertical position in percent of scaled height  
</div>  
<div markdown class="option">  
<a id="thread">__thread__</a> (sint, default: _-1_): number of threads for software rasterizer, -1 for all available cores  
</div>  
<div markdown class="option">  
<a id="blt">__blt__</a> (bool, default: _true_): use blit instead of software rasterizer  
</div>  
<div markdown class="option">  
<a id="scref">__scref__</a> (bool, default: _false_): use last inserted image as reference for scene change detection  
</div>  
<div markdown class="option">  
<a id="dropfirst">__dropfirst__</a> (bool, default: _false_): drop first image  
</div>  
<div markdown class="option">  
<a id="list">__list__</a> (str, default: _null_): export json list of frame times and positions to given file  
</div>  
<div markdown class="option">  
<a id="lxy">__lxy__</a> (bool, default: _false_): add explicit x and y in json export  
</div>  
  
