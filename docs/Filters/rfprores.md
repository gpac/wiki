<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# ProRes reframer  {:data-level="all"}  
  
Register name used to load filter: __rfprores__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses ProRes raw files/data and outputs corresponding visual PID and frames.  
  

# Options    
  
<a id="fps">__fps__</a> (frac, default: _0/1000_): import frame rate (0 default to FPS from bitstream or 25 Hz)  
<a id="findex">__findex__</a> (bool, default: _true_): index frames. If true, filter will be able to work in rewind mode  
<a id="cid">__cid__</a> (str): set QT 4CC for the imported media. If not set, default is 'ap4h' for YUV444 and 'apch' for YUV422  
<a id="notime">__notime__</a> (bool, default: _false_): ignore input timestamps, rebuild from 0  
  
