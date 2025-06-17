<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AV1/IVF/VP9/IAMF reframer  
  
Register name used to load filter: __rfav1__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses AV1 OBU, AV1 AnnexB or IVF with AV1 or VP9 files/data and outputs corresponding visual PID and frames. It also parses IAMF OBU and outputs corresponding temporal units containing audio frames and parameter blocks.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="fps" data-level="basic">__fps__</a> (frac, default: _0/1000_): import frame rate (0 default to FPS from bitstream or 25 Hz)  
</div>  
<div markdown class="option">  
<a id="index" data-level="basic">__index__</a> (dbl, default: _-1.0_): indexing window length. If 0, bitstream is not probed for duration. A negative value skips the indexing if the source file is larger than 20M (slows down importers) unless a play with start range > 0 is issued  
</div>  
<div markdown class="option">  
<a id="importer">__importer__</a> (bool, default: _false_): compatibility with old importer  
</div>  
<div markdown class="option">  
<a id="deps">__deps__</a> (bool, default: _false_): import sample dependency information  
</div>  
<div markdown class="option">  
<a id="notime">__notime__</a> (bool, default: _false_): ignore input timestamps, rebuild from 0  
</div>  
<div markdown class="option">  
<a id="temporal_delim">__temporal_delim__</a> (bool, default: _false_): keep temporal delimiters in reconstructed frames  
</div>  
<div markdown class="option">  
<a id="bsdbg">__bsdbg__</a> (enum, default: _off_): debug OBU parsing in `media@debug logs`  

- off: not enabled  
- on: enabled  
- full: enable with number of bits dumped  
</div>  
  
  
