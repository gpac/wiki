<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# OpenHEVC decoder  
  
Register name used to load filter: __ohevcdec__  
This filter may be automatically loaded during graph resolution.  
  
This filter decodes HEVC and LHVC (HEVC scalable extensions) from one or more PIDs through the OpenHEVC library  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="threading">__threading__</a> (enum, default: _frame_): set threading mode  

- frameslice: parallel decoding of both frames and slices  
- frame: parallel decoding of frames  
- slice: parallel decoding of slices  
</div>  
  
<div markdown class="option">  
<a id="nb_threads" data-level="basic">__nb_threads__</a> (uint, default: _0_): set number of threads (if 0, uses number of cores minus one)  
</div>  
<div markdown class="option">  
<a id="no_copy">__no_copy__</a> (bool, default: _false_): directly dispatch internal decoded frame without copy  
</div>  
<div markdown class="option">  
<a id="pack_hfr">__pack_hfr__</a> (bool, default: _false_): pack 4 consecutive frames in a single output  
</div>  
<div markdown class="option">  
<a id="seek_reset">__seek_reset__</a> (bool, default: _false_): reset decoder when seeking  
</div>  
<div markdown class="option">  
<a id="force_stereo">__force_stereo__</a> (bool, default: _true_): use stereo output for multiview (top-bottom only)  
</div>  
<div markdown class="option">  
<a id="reset_switch">__reset_switch__</a> (bool, default: _false_): reset decoder at config change  
</div>  
  
