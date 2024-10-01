<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# M1V/M2V/M4V reframer  
  
Register name used to load filter: __rfmpgvid__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses MPEG-1/2 and MPEG-4 part 2 video files/data and outputs corresponding video PID and frames.  
_Note: The filter uses negative CTS offsets: CTS is correct, but some frames may have DTS greater than CTS._  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="fps" data-level="basic">__fps__</a> (frac, default: _0/1000_): import frame rate (0 default to FPS from bitstream or 25 Hz)  
</div>  
<div markdown class="option">  
<a id="index" data-level="basic">__index__</a> (dbl, default: _-1.0_): indexing window length. If 0, bitstream is not probed for duration. A negative value skips the indexing if the source file is larger than 20M (slows down importers) unless a play with start range > 0 is issued  
</div>  
<div markdown class="option">  
<a id="vfr">__vfr__</a> (bool, default: _false_): set variable frame rate import  
</div>  
<div markdown class="option">  
<a id="importer">__importer__</a> (bool, default: _false_): compatibility with old importer, displays import results  
</div>  
<div markdown class="option">  
<a id="notime">__notime__</a> (bool, default: _false_): ignore input timestamps, rebuild from 0  
</div>  
  
