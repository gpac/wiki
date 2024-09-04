<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# TTML decoder  {:data-level="all"}  
  
Register name used to load filter: __ttmldec__  
This filter may be automatically loaded during graph resolution.  
  
This filter decodes TTML streams into a SVG scene graph of the compositor filter.  
The scene graph creation is done through JavaScript.  
The filter options are used to override the JS global variables of the TTML renderer.  
  
In stand-alone rendering (no associated video), the filter will use:  

- `Width` and `Height` properties of input pid if any  
- otherwise, `osize` option of compositor if set  
- otherwise, [txtw](#txtw) and [txth](#txth)  

  

# Options    
  
<a id="script">__script__</a> (str, default: _$GSHARE/scripts/ttml-renderer.js_): location of TTML SVG JS renderer  
<a id="font">__font__</a> (str, default: _SANS_, updatable): font  
<a id="fontSize">__fontSize__</a> (flt, default: _20_, updatable): font size  
<a id="color">__color__</a> (str, default: _white_, updatable): text color  
<a id="valign">__valign__</a> (enum, default: _bottom_, updatable): vertical alignment  

- bottom: align text at bottom of text area  
- center: align text at center of text area  
- top: align text at top of text area  
  
<a id="lineSpacing">__lineSpacing__</a> (flt, default: _1.0_, updatable): line spacing as scaling factor to font size  
<a id="txtw">__txtw__</a> (uint, default: _400_): default width in standalone rendering  
<a id="txth">__txth__</a> (uint, default: _200_): default height in standalone rendering  
  
