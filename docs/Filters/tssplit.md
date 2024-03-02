<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MPEG Transport Stream splitter  
  
Register name used to load filter: __tssplit__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter splits an MPEG-2 transport stream into several single program transport streams.  
Only the PAT table is rewritten, other tables (PAT, PMT) and streams (PES) are forwarded as is.  
If [dvb](#dvb) is set, global DVB tables of the input multiplex are forwarded to each output mux; otherwise these tables are discarded.  
  

# Options    
  
<a id="dvb">__dvb__</a> (bool, default: _true_): forward all packets from global DVB PIDs  
<a id="mux_id">__mux_id__</a> (sint, default: _-1_): set initial ID of output mux; the first program will use mux_id, the second mux_id+1, etc. If not set, this value will be set to sourceMuxId*255  
<a id="avonly">__avonly__</a> (bool, default: _true_): do not forward programs with no AV component  
<a id="nb_pack">__nb_pack__</a> (uint, default: _10_): pack N packets before sending  
  
