<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# JPG encoder  
  
Register name used to load filter: __jpgenc__  
This filter may be automatically loaded during graph resolution.  
  
This filter encodes a single uncompressed video PID to JPEG using libjpeg.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="dctmode">__dctmode__</a> (enum, default: _fast_): type of DCT used  

- slow: precise but slow integer DCT  
- fast: less precise but faster integer DCT  
- float: float DCT  
</div>  
  
<div markdown class="option">  
<a id="quality" data-level="basic">__quality__</a> (uint, default: _100_, minmax: 0-100, updatable): compression quality  
</div>  
  
