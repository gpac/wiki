<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Video output  
  
Register name used to load filter: __vout__  
This filter may be automatically loaded during graph resolution.  
  
This filter displays a single visual input PID in a window.  
The window is created unless a window handle (HWND, xWindow, etc) is indicated in the config file ( [Temp]OSWnd=ptr).  
The output uses GPAC video output module indicated in [drv](#drv) option or in the config file (see GPAC core help).  
The video output module can be further configured (see GPAC core help).  
The filter can use OpenGL or 2D blit of the graphics card, depending on the OS support.  
The filter can be used do dump frames as written by the graphics card (GPU read-back) using [dumpframes](#dumpframes).  
In this case, the window is not visible and only the listed frames are drawn to the GPU.  
The pixel format of the dumped frame is always RGB in OpenGL and matches the video backbuffer format in 2D mode.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="drv" data-level="basic">__drv__</a> (cstr): video driver name  
</div>  
<div markdown class="option">  
<a id="vsync">__vsync__</a> (bool, default: _true_): enable video screen sync  
</div>  
<div markdown class="option">  
<a id="drop">__drop__</a> (bool, default: _false_, updatable): enable dropping late frames  
</div>  
<div markdown class="option">  
<a id="disp">__disp__</a> (enum, default: _gl_): display mode  

- gl: OpenGL  
- pbo: OpenGL with PBO  
- blit: 2D hardware blit  
- soft: software blit  
</div>  
  
<div markdown class="option">  
<a id="start" data-level="basic">__start__</a> (dbl, default: _0.0_, updatable): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
</div>  
<div markdown class="option">  
<a id="dur" data-level="basic">__dur__</a> (lfrac, default: _0_): only play the specified duration  
</div>  
<div markdown class="option">  
<a id="speed" data-level="basic">__speed__</a> (dbl, default: _1.0_, updatable): set playback speed when vsync is on. If speed is negative and start is 0, start is set to -1  
</div>  
<div markdown class="option">  
<a id="hold" data-level="basic">__hold__</a> (dbl, default: _1.0_): number of seconds to hold display for single-frame streams (a negative value force a hold on last frame for single or multi-frames streams)  
</div>  
<div markdown class="option">  
<a id="linear">__linear__</a> (bool, default: _false_): use linear filtering instead of nearest pixel for GL mode  
</div>  
<div markdown class="option">  
<a id="back">__back__</a> (uint, default: _0x808080_): back color for transparent images  
</div>  
<div markdown class="option">  
<a id="wsize">__wsize__</a> (v2di, default: _-1x-1_): default init window size  

- 0x0 holds the window size of the first frame  
- negative values indicate video media size  
</div>  
  
<div markdown class="option">  
<a id="wpos">__wpos__</a> (v2di, default: _-1x-1_): default position (0,0 top-left)  
</div>  
<div markdown class="option">  
<a id="vdelay">__vdelay__</a> (frac, default: _0_, updatable): set delay in sec, positive value displays after audio clock  
</div>  
<div markdown class="option">  
<a id="hide" data-level="basic">__hide__</a> (bool, default: _false_): hide output window  
</div>  
<div markdown class="option">  
<a id="fullscreen" data-level="basic">__fullscreen__</a> (bool, default: _false_, updatable): use fullscreen  
</div>  
<div markdown class="option">  
<a id="buffer" data-level="basic">__buffer__</a> (uint, default: _100_): set playout buffer in ms  
</div>  
<div markdown class="option">  
<a id="mbuffer" data-level="basic">__mbuffer__</a> (uint, default: _0_): set max buffer occupancy in ms. If less than buffer, use buffer  
</div>  
<div markdown class="option">  
<a id="rbuffer" data-level="basic">__rbuffer__</a> (uint, default: _0_, updatable): rebuffer trigger in ms. If 0 or more than buffer, disable rebuffering  
</div>  
<div markdown class="option">  
<a id="dumpframes">__dumpframes__</a> (uintl): ordered list of frames to dump, 1 being first frame. Special value `0` means dump all frames  
</div>  
<div markdown class="option">  
<a id="out">__out__</a> (str, default: _dump_): radical of dump frame filenames. If no extension provided, frames are exported as `$OUT_%d.PFMT`  
</div>  
<div markdown class="option">  
<a id="async">__async__</a> (bool, default: _true_): sync video to audio output if any  
</div>  
<div markdown class="option">  
<a id="owsize">__owsize__</a> (v2di): output window size (readonly)  
</div>  
<div markdown class="option">  
<a id="buffer_done">__buffer_done__</a> (bool): buffer done indication (readonly)  
</div>  
<div markdown class="option">  
<a id="rebuffer">__rebuffer__</a> (luint): system time in us at which last rebuffer started, 0 if not rebuffering (readonly)  
</div>  
<div markdown class="option">  
<a id="vjs">__vjs__</a> (bool, default: _true_): use default JS script for vout control  
</div>  
<div markdown class="option">  
<a id="media_offset">__media_offset__</a> (dbl, default: _0_): media offset (substract this value to CTS to get media time - readonly)  
</div>  
<div markdown class="option">  
<a id="wid">__wid__</a> (uint, default: _0_): window id (readonly)  
</div>  
<div markdown class="option">  
<a id="vflip">__vflip__</a> (enum, default: _no_, updatable): flip video (GL only)  

- no: no flipping  
- v: vertical flip  
- h: horizontal flip  
- vh: horizontal and vertical  
- hv: same as vh  
</div>  
  
<div markdown class="option">  
<a id="vrot">__vrot__</a> (enum, default: _0_, updatable): rotate video by given angle  

- 0: no rotation  
- 90: rotate 90 degree counter clockwise  
- 180: rotate 180 degree  
- 270: rotate 90 degree clockwise  
</div>  
  
  
