<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# BT/XMT/X3D loader  
  
Register name used to load filter: __btplay__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses MPEG-4 BIFS (BT and XMT), VRML97 and X3D (wrl and XML) files directly into the scene graph of the compositor.  
  
When [sax_dur=N](#sax_dur=N) is set, the filter will do a progressive load of the source and cancel current loading when processing time is higher than `N`.  
  

# Options    
  
<a id="sax_dur">__sax_dur__</a> (uint, default: _0_): duration for SAX parsing (XMT), 0 disables SAX parsing  
  
