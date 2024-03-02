<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# GSF Multiplexer  
  
Register name used to load filter: __gsfmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter provides GSF (_GPAC Serialized Format_) multiplexing.  
It serializes the stream states (config/reconfig/info update/remove/eos) and packets of input PIDs. This allows either saving to file a session, or forwarding the state/data of streams to another instance of GPAC using either pipes or sockets. Upstream events are not serialized.  
  
The default behavior does not insert sequence numbers. When running over general protocols not ensuring packet order, this should be inserted.  
The serializer sends tune-in packets (global and per PID) at the requested carousel rate - if 0, no carousel. These packets are marked as redundant so that they can be discarded by output filters if needed.  
  
# Encryption  
  
The stream format can be encrypted in AES 128 CBC mode. For all packets, the packet header (header, size, frame size/block offset and optional seq num) are in the clear and the following bytes until the last byte of the last multiple of block size (16) fitting in the payload are encrypted.  
For data packets, each fragment is encrypted individually to avoid error propagation in case of losses.  
For other packets, the entire packet is encrypted before fragmentation (fragments cannot be processed individually).  
For header/tunein packets, the first 25 bytes after the header are in the clear (signature,version,IV and pattern).  
The [IV](#IV) is constant to avoid packet overhead, randomly generated if not set and sent in the initial stream header. Pattern mode can be used (cf CENC cbcs) to encrypt K block and leave N blocks in the clear.  
  
# Filtering properties  
  
The header/tunein packet may get quite big when all PID properties are kept. In order to help reduce its size, the [minp](#minp) option can be used: this will remove all built-in properties marked as droppable (cf property help) as well as all non built-in properties.  
The [skp](#skp) option may also be used to specify which property to drop:  
Example
```
skp="4CC1,Name2
```  
This will remove properties of type `4CC1` and properties (built-in or not) of name `Name2`.  
  
# File mode  
  
By default the filter only accepts framed media streams as input PID, not files. This can be changed by explicitly loading the filter with [ext](#ext) or [dst](#dst) set.  
Example
```
gpac -i source.mp4 gsfmx:dst=manifest.mpd -o dump.gsf
```  
This will DASH the source and store every files produced as PIDs in the GSF mux.  
In order to demultiplex such a file, the `gsfdmx`filter will likely need to be explicitly loaded:  
Example
```
gpac -i mux.gsf gsfdmx -o dump/$File$:dynext
```  
This will extract all files from the GSF mux.  
  
By default when working in file mode, the filter only accepts PIDs of type `file` as input.  
To allow a mix of files and streams, use [mixed](#mixed):  
Example
```
gpac -i source.mp4 gsfmx:dst=manifest.mpd:mixed -o dump.gsf
```  
This will DASH the source, store the manifest file and the media streams with their packet properties in the GSF mux.  
  

# Options    
  
<a id="sigsn">__sigsn__</a> (bool, default: _false_): signal packet sequence number after header field and before size field. Sequence number is per PID, encoded on 16 bits. Header packet does not have a SN  
<a id="sigdur">__sigdur__</a> (bool, default: _true_): signal duration  
<a id="sigbo">__sigbo__</a> (bool, default: _false_): signal byte offset  
<a id="sigdts">__sigdts__</a> (bool, default: _true_): signal decoding timestamp  
<a id="dbg">__dbg__</a> (enum, default: _no_): set debug mode  
* no: disable debug  
* nodata: force packet size to 0  
* nopck: skip packet  
  
<a id="key">__key__</a> (mem): encrypt packets using given key  
<a id="IV">__IV__</a> (mem):   set IV for encryption - a constant IV is used to keep packet overhead small (cbcs-like)  
<a id="pattern">__pattern__</a> (frac, default: _1/0_): set nb_crypt / nb_skip block pattern. default is all encrypted  
<a id="mpck">__mpck__</a> (uint, default: _0_): set max packet size. 0 means no fragmentation (each AU is sent in one packet)  
<a id="magic">__magic__</a> (str): magic string to append in setup packet  
<a id="skp">__skp__</a> (str): comma separated list of PID property names to skip  
<a id="minp">__minp__</a> (bool, default: _false_): include only the minimum set of properties required for stream processing  
<a id="crate">__crate__</a> (dbl, default: _0_): carousel period for tune-in info in seconds  
<a id="ext">__ext__</a> (str): file extension for file mode  
<a id="dst">__dst__</a> (str): target URL in file mode  
<a id="mixed">__mixed__</a> (bool, default: _false_): allow GSF to contain both files and media streams  
  
