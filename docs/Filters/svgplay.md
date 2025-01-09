<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# SVG decoder  
  
Register name used to load filter: __svgplay__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses SVG files directly into the scene graph of the compositor.  
  
When [sax_dur](#sax_dur) is set to `N`, the filter will do a progressive load of the source and cancel current loading when processing time is higher than `N`.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="sax_dur">__sax_dur__</a> (uint, default: _0_): loading duration for SAX parsing, 0 disables SAX parsing  
</div>  
  
