<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AVI multiplexer  {:data-level="all"}  
  
Register name used to load filter: __avimx__  
This filter may be automatically loaded during graph resolution.  
  
This filter multiplexes raw or compressed audio and video to produce an AVI output.  
  
Unlike other multiplexing filters in GPAC, this filter is a sink filter and does not produce any PID to be redirected in the graph.  
The filter can however use template names for its output, using the first input PID to resolve the final name.  
The filter watches the property `FileNumber` on incoming packets to create new files.  
  
The filter will look for property `AVIType` set on the input stream.  
The value can either be a 4CC or a string, indicating the mux format for the PID.  
If the string is prefixed with `+` and the decoder configuration is present and formatted as an ISOBMFF box, the box header will be removed.  
  

# Options    
  
<a id="dst">__dst__</a> (cstr): location of destination file  
<a id="fps">__fps__</a> (frac, default: _25/1_): default framerate if none indicated in stream  
<a id="noraw">__noraw__</a> (bool, default: _false_): disable raw output in AVI, only compressed ones allowed  
<a id="opendml_size">__opendml_size__</a> (luint, default: _0_): force opendml format when chunks are larger than this amount (0 means 1.9Gb max size in each riff chunk)  
  
