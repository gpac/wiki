<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Video crop  {:data-level="all"}  
  
Register name used to load filter: __vcrop__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter is used to crop raw video data.  
  

# Options    
  
<a id="wnd">__wnd__</a> (str): size of output to crop, indicated as TxLxWxH. If % is indicated after a number, the value is in percent of the source width (for L and W) or height (for T and H). An absolute offset (+x, -x) can be added after percent  
<a id="copy">__copy__</a> (bool, default: _false_): copy the source pixels. By default the filter will try to forward crop frames by adjusting offsets and strides of the source if possible (window contained in frame)  
<a id="round">__round__</a> (enum, default: _up_): adjust dimension to be a multiple of 2  

- up: up rounding  
- down: down rounding  
- allup: up rounding on formats that do not require it (RGB, YUV444)  
- alldown: down rounding on formats that do not require it (RGB, YUV444)  
  
  
