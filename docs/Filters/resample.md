<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Audio resampler  
  
Register name used to load filter: __resample__  
This filter may be automatically loaded during graph resolution.  
Filters of this class can connect to each-other.  
  
This filter resamples raw audio to a target sample rate, number of channels or audio format.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="och" data-level="basic">__och__</a> (uint, default: _0_): desired number of output audio channels (0 for auto)  
</div>  
<div markdown class="option">  
<a id="osr" data-level="basic">__osr__</a> (uint, default: _0_): desired sample rate of output audio (0 for auto)  
</div>  
<div markdown class="option">  
<a id="osfmt" data-level="basic">__osfmt__</a> (afmt, default: _none_): desired sample format of output audio (`none` for auto)  
</div>  
<div markdown class="option">  
<a id="olayout" data-level="basic">__olayout__</a> (alay, Enum: mono|stereo|3/0.0|3/1.0|3/2.0|3/2.1|5/2.1|1+1|2/1.0|2/2.0|3/3.1|3/4.1|11/11.2|5/2.1|5/5.2|5/4.1|6/5.1|6/7.1|5/6.1|7/6.1): desired CICP layout of output audio (null for auto)  
</div>  
  
  
