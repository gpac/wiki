<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# JPG encoder  {:data-level="all"}  
  
Register name used to load filter: __jpgenc__  
This filter may be automatically loaded during graph resolution.  
  
This filter encodes a single uncompressed video PID to JPEG using libjpeg.  
  

# Options    
  
<a id="dctmode">__dctmode__</a> (enum, default: _fast_): type of DCT used  

- slow: precise but slow integer DCT  
- fast: less precise but faster integer DCT  
- float: float DCT  
  
<a id="quality">__quality__</a> (uint, default: _100_, minmax: 0-100, updatable): compression quality  
  
