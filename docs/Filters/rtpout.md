<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# RTP Streamer  
  
Register name used to load filter: __rtpout__  
This filter may be automatically loaded during graph resolution.  
  
The RTP streamer handles SDP/RTP output streaming.  

# SDP mode  
  
When the destination URL is an SDP, the filter outputs an SDP on a file PID and streams RTP packets over UDP, starting from the indicated [port](#port).  

# Direct RTP mode  
  
When the destination URL uses the protocol scheme `rtp://IP:PORT`, the filter does not output any SDP and streams a single input over RTP, using PORT indicated in the destination URL, or the first [port](#port) configured.  
In this mode, it is usually needed to specify the desired format using [ext](#ext) or [mime](#mime).  
Example
```
gpac -i src -o rtp://localhost:1234/:ext=ts
```
  
This will indicate that the RTP streamer expects a MPEG-2 TS mux as an input.  

# RTP Packets  
  
The RTP packets produced have a maximum payload set by the [mtu](#mtu) option (IP packet will be MTU + 40 bytes of IP+UDP+RTP headers).  
The real-time scheduling algorithm works as follows:  

- first initialize the clock by:  

    - computing the smallest timestamp for all input PIDs  
    - mapping this media time to the system clock  

- determine the earliest packet to send next on each input PID, adding [delay](#delay) if any  
- finally compare the packet mapped timestamp _TS_ to the system clock _SC_. When _TS_ - _SC_ is less than [tt](#tt), the RTP packets for the source packet are sent  

  
The filter does not check for RTCP timeout and will run until all input PIDs reach end of stream.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="ip" data-level="basic">__ip__</a> (str): destination IP address (NULL is 127.0.0.1)  
</div>  
<div markdown class="option">  
<a id="port" data-level="basic">__port__</a> (uint, default: _7000_): port for first stream in session  
</div>  
<div markdown class="option">  
<a id="loop" data-level="basic">__loop__</a> (bool, default: _true_): loop all streams in session (not always possible depending on source type)  
</div>  
<div markdown class="option">  
<a id="mpeg4">__mpeg4__</a> (bool, default: _false_): send all streams using MPEG-4 generic payload format if possible  
</div>  
<div markdown class="option">  
<a id="mtu" data-level="basic">__mtu__</a> (uint, default: _1460_): size of RTP MTU in bytes  
</div>  
<div markdown class="option">  
<a id="ttl">__ttl__</a> (uint, default: _2_): time-to-live for multicast packets  
</div>  
<div markdown class="option">  
<a id="ifce">__ifce__</a> (str): default network interface to use  
</div>  
<div markdown class="option">  
<a id="payt">__payt__</a> (uint, default: _96_, minmax: 96-127): payload type to use for dynamic decoder configurations  
</div>  
<div markdown class="option">  
<a id="delay" data-level="basic">__delay__</a> (sint, default: _0_): send delay for packet (negative means send earlier)  
</div>  
<div markdown class="option">  
<a id="tt">__tt__</a> (uint, default: _1000_): time tolerance in microseconds. Whenever schedule time minus realtime is below this value, the packet is sent right away  
</div>  
<div markdown class="option">  
<a id="runfor" data-level="basic">__runfor__</a> (sint, default: _-1_): run for the given time in ms. Negative value means run for ever (if loop) or source duration, 0 only outputs the sdp  
</div>  
<div markdown class="option">  
<a id="tso">__tso__</a> (sint, default: _-1_): set timestamp offset in microseconds. Negative value means random initial timestamp  
</div>  
<div markdown class="option">  
<a id="xps">__xps__</a> (bool, default: _false_): force parameter set injection at each SAP. If not set, only inject if different from SDP ones  
</div>  
<div markdown class="option">  
<a id="latm">__latm__</a> (bool, default: _false_): use latm for AAC payload format  
</div>  
<div markdown class="option">  
<a id="dst" data-level="basic">__dst__</a> (cstr): URL for direct RTP mode  
</div>  
<div markdown class="option">  
<a id="ext">__ext__</a> (str): file extension for direct RTP mode  
</div>  
<div markdown class="option">  
<a id="mime">__mime__</a> (cstr): set mime type for direct RTP mode  
</div>  
  
