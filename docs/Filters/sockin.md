<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# UDP/TCP input  
  
Register name used to load filter: __sockin__  
This filter may be automatically loaded during graph resolution.  
  
This filter handles generic TCP and UDP input sockets. It can also probe for MPEG-2 TS over RTP input. Probing of MPEG-2 TS over UDP/RTP is enabled by default but can be turned off.  
  
Data format can be specified by setting either [ext](#ext) or [mime](#mime) options. If not set, the format will be guessed by probing the first data packet  
  

- UDP sockets are used for source URLs formatted as `udp://NAME`  
- TCP sockets are used for source URLs formatted as `tcp://NAME`  
- UDP unix domain sockets are used for source URLs formatted as `udpu://NAME`  
- TCP unix domain sockets are used for source URLs formatted as `tcpu://NAME`  

  
When ports are specified in the URL and the default option separators are used (see `gpac -h doc`), the URL must either:  

- have a trailing '/', e.g. `udp://localhost:1234/[:opts]`  
- use `gpac` separator, e.g. `udp://localhost:1234[:gpac:opts]`  

  
When the socket is listening in keep-alive [ka](#ka) mode:  

- a single connection is allowed and a single output PID will be produced  
- each connection close event will triger a pipeline flush  

  
# Time Regulation  
  
The filter uses the time between the last two received packets to estimates how often it should check for inputs. The maximum and minimum times to wait between two calls is given by the [mwait](#mwait) option. The maximum time may need to be reduced for very high bitrates sources.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): address of source content  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _0x60000_): block size used to read socket  
</div>  
<div markdown class="option">  
<a id="port" data-level="basic">__port__</a> (uint, default: _1234_): default port if not specified  
</div>  
<div markdown class="option">  
<a id="ifce">__ifce__</a> (cstr): default multicast interface  
</div>  
<div markdown class="option">  
<a id="listen" data-level="basic">__listen__</a> (bool, default: _false_): indicate the input socket works in server mode  
</div>  
<div markdown class="option">  
<a id="ka">__ka__</a> (bool, default: _false_): keep socket alive if no more connections  
</div>  
<div markdown class="option">  
<a id="maxc" data-level="basic">__maxc__</a> (uint, default: _+I_): max number of concurrent connections  
</div>  
<div markdown class="option">  
<a id="tsprobe">__tsprobe__</a> (bool, default: _true_): probe for MPEG-2 TS data, either RTP or raw UDP. Disabled if mime or ext are given and do not match MPEG-2 TS mimes/extensions  
</div>  
<div markdown class="option">  
<a id="ext" data-level="basic">__ext__</a> (str): indicate file extension of udp data  
</div>  
<div markdown class="option">  
<a id="mime" data-level="basic">__mime__</a> (str): indicate mime type of udp data  
</div>  
<div markdown class="option">  
<a id="block">__block__</a> (bool, default: _false_): set blocking mode for socket(s)  
</div>  
<div markdown class="option">  
<a id="timeout">__timeout__</a> (uint, default: _10000_): set timeout in ms for UDP socket(s), 0 to disable timeout  
</div>  
<div markdown class="option">  
<a id="mwait">__mwait__</a> (v2di, default: _1x30_): set min and max wait times in ms to avoid too frequent polling  
</div>  
<div markdown class="option">  
<a id="reorder_pck">__reorder_pck__</a> (uint, default: _100_): number of packets delay for RTP reordering (M2TS over RTP)   
</div>  
<div markdown class="option">  
<a id="reorder_delay">__reorder_delay__</a> (uint, default: _10_): number of ms delay for RTP reordering (M2TS over RTP)  
</div>  
<div markdown class="option">  
<a id="ssm">__ssm__</a> (strl): list of IP to include for source-specific multicast  
</div>  
<div markdown class="option">  
<a id="ssmx">__ssmx__</a> (strl): list of IP to exclude for source-specific multicast  
</div>  
  
