<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# PCM reframer  
  
Register name used to load filter: __rfpcm__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses raw PCM file/data or WAVE files and outputs corresponding raw audio PID and frames.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="sr" data-level="basic">__sr__</a> (uint, default: _44100_): sample rate  
</div>  
<div markdown class="option">  
<a id="safmt" data-level="basic">__safmt__</a> (afmt, default: _none_, Enum: none|u8|s16|s16b|s24|s24b|s32|s32b|flt|fltb|dbl|dblb|u8p|s16p|s24p|s32p|fltp|dblp): audio format  
</div>  
  
<div markdown class="option">  
<a id="ch" data-level="basic">__ch__</a> (uint, default: _2_): number of channels  
</div>  
<div markdown class="option">  
<a id="framelen">__framelen__</a> (uint, default: _1024_): number of samples to put in one audio frame. For planar formats, indicate plane size in samples  
</div>  
  
