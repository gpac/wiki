<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# SVG loader  
  
Register name used to load filter: __svgplay__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses SVG files directly into the scene graph of the compositor.  
  
When [sax_dur=N](#sax_dur=N) is set, the filter will do a progressive load of the source and cancel current loading when processing time is higher than `N`.  
  

# Options    
  
<a id="sax_dur">__sax_dur__</a> (uint, default: _0_): loading duration for SAX parsing, 0 disables SAX parsing  
  
