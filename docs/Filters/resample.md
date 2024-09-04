<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Audio resampler  {:data-level="all"}  
  
Register name used to load filter: __resample__  
This filter may be automatically loaded during graph resolution.  
Filters of this class can connect to each-other.  
  
This filter resamples raw audio to a target sample rate, number of channels or audio format.  
  

# Options    
  
<a id="och">__och__</a> (uint, default: _0_): desired number of output audio channels (0 for auto)  
<a id="osr">__osr__</a> (uint, default: _0_): desired sample rate of output audio (0 for auto)  
<a id="osfmt">__osfmt__</a> (afmt, default: _none_): desired sample format of output audio (`none` for auto)  
<a id="olayout">__olayout__</a> (alay, Enum: mono|stereo|3/0.0|3/1.0|3/2.0|3/2.1|5/2.1|1+1|2/1.0|2/2.0|3/3.1|3/4.1|11/11.2|5/2.1|5/5.2|5/4.1|6/5.1|6/7.1|5/6.1|7/6.1): desired CICP layout of output audio (null for auto)  
  
  
