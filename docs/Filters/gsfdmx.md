<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# GSF demultiplexer  
  
Register name used to load filter: __gsfdmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter provides GSF (_GPAC Serialized Format_) demultiplexing.  
It de-serializes the stream states (config/reconfig/info update/remove/eos) and packets in the GSF bytestream.  
This allows either reading a session saved to file, or receiving the state/data of streams from another instance of GPAC using either pipes or sockets  
  
The stream format can be encrypted in AES 128 CBC mode, in which case the demultiplexing filter must be given a 128 bit key.  
  

# Options    
  
<a id="key">__key__</a> (mem): key for decrypting packets  
<a id="magic">__magic__</a> (str): magic string to check in setup packet  
<a id="mq">__mq__</a> (uint, default: _4_): set max packet queue length for loss detection. 0 will flush incomplete packet when a new one starts  
<a id="pad">__pad__</a> (uint, default: _0_, minmax: 0-255): byte value used to pad lost packets  
  
