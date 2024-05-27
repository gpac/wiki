<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# TTXT/TX3G decoder  
  
Register name used to load filter: __ttxtdec__  
This filter may be automatically loaded during graph resolution.  
  
This filter decodes TTXT/TX3G streams into a BIFS scene graph of the compositor filter.  
The TTXT documentation is available at https://wiki.gpac.io/xmlformats/TTXT-Format-Documentation  
  
In stand-alone rendering (no associated video), the filter will use:  
- `Width` and `Height` properties of input pid if any  
- otherwise, `osize` option of compositor if set  
- otherwise, [txtw](#txtw) and [txth](#txth)  
  

# Options    
  
<a id="texture">__texture__</a> (bool, default: _false_): use texturing for output text  
<a id="outline">__outline__</a> (bool, default: _false_): draw text outline  
<a id="txtw">__txtw__</a> (uint, default: _400_): default width in standalone rendering  
<a id="txth">__txth__</a> (uint, default: _200_): default height in standalone rendering  
  
