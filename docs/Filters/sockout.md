<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# UDP/TCP output  
  
Register name used to load filter: __sockout__  
This filter may be automatically loaded during graph resolution.  
  
This filter handles generic output sockets (mono-directional) in blocking mode only.  
The filter can work in server mode, waiting for source connections, or in client mode, directly connecting to a server.  
In server mode, the filter can be instructed to keep running at the end of the stream.  
In server mode, the default behavior is to keep input packets when no more clients are connected; this can be adjusted though the [kp](#kp) option, however there is no realtime regulation of how fast packets are dropped.  
If your sources are not real time, consider adding a real-time scheduler in the chain (cf reframer filter), or set the send [rate](#rate) option.  
  
- UDP sockets are used for destinations URLs formatted as `udp://NAME`  
- TCP sockets are used for destinations URLs formatted as `tcp://NAME`  
- UDP unix domain sockets are used for destinations URLs formatted as `udpu://NAME`  
- TCP unix domain sockets are used for destinations URLs formatted as `tcpu://NAME`  
  
When ports are specified in the URL and the default option separators are used (see `gpac -h doc`), the URL must either:  
- have a trailing '/', e.g. `udp://localhost:1234/[:opts]`  
- use `gpac` escape, e.g. `udp://localhost:1234[:gpac:opts]`  
  
The socket output can be configured to drop or revert packet order for test purposes.  
A window size in packets is specified as the drop/revert fraction denominator, and the index of the packet to drop/revert is given as the numerator/  
If the numerator is 0, a packet is randomly chosen in that window.  
Example
```
:pckd=4/10
```  
This drops every 4th packet of each 10 packet window.  
Example
```
:pckr=0/100
```  
This reverts the send order of one random packet in each 100 packet window.  
  

# Options    
  
<a id="dst">__dst__</a> (cstr): URL of destination  
<a id="sockbuf">__sockbuf__</a> (uint, default: _65536_): block size used to read file  
<a id="port">__port__</a> (uint, default: _1234_): default port if not specified  
<a id="ifce">__ifce__</a> (cstr): default multicast interface  
<a id="ext">__ext__</a> (str): file extension of pipe data  
<a id="mime">__mime__</a> (str): mime type of pipe data  
<a id="listen">__listen__</a> (bool, default: _false_): indicate the output socket works in server mode  
<a id="maxc">__maxc__</a> (uint, default: _+I_): max number of concurrent connections  
<a id="ka">__ka__</a> (bool, default: _false_): keep socket alive if no more connections  
<a id="kp">__kp__</a> (bool, default: _true_): keep packets in queue if no more clients  
<a id="start">__start__</a> (dbl, default: _0.0_): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
<a id="speed">__speed__</a> (dbl, default: _1.0_): set playback speed. If negative and start is 0, start is set to -1  
<a id="rate">__rate__</a> (uint, default: _0_): set send rate in bps, disabled by default (as fast as possible)  
<a id="pckr">__pckr__</a> (frac, default: _0/0_): reverse packet every N  
<a id="pckd">__pckd__</a> (frac, default: _0/0_): drop packet every N  
<a id="ttl">__ttl__</a> (uint, default: _0_, minmax: 0-127): multicast TTL  
  
