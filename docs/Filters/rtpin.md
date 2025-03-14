<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# RTP/RTSP/SDP input  
  
Register name used to load filter: __rtpin__  
This filter may be automatically loaded during graph resolution.  
  
This filter handles SDP/RTSP/RTP input reading. It supports:  

- SDP file reading  
- RTP direct url through `rtp://` protocol scheme  
- RTSP session processing through `rtsp://` and `satip://` protocol schemes  

   
The filter produces either PIDs with media frames, or file PIDs with multiplexed data (e.g. MPEG-2 TS).   
The filter will use:  

- RTSP over HTTP tunnel if server port is 80 or 8080 or if protocol scheme is `rtsph://`.  
- RTSP over TLS if server port is 322 or if protocol scheme is `rtsps://`.  
- RTSP over HTTPS tunnel if server port is 443 and if protocol scheme is `rtsph://`.  

   
The filter will attempt reconnecting in TLS mode after two consecutive initial connection failures.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): location of source content (SDP, RTP or RTSP URL)  
</div>  
<div markdown class="option">  
<a id="firstport">__firstport__</a> (uint, default: _0_): default first port number to use (0 lets the filter decide)  
</div>  
<div markdown class="option">  
<a id="ifce">__ifce__</a> (str): default interface IP to use for multicast. If NULL, the default system interface will be used  
</div>  
<div markdown class="option">  
<a id="ttl">__ttl__</a> (uint, default: _127_, minmax: 0-127): multicast TTL  
</div>  
<div markdown class="option">  
<a id="reorder_len">__reorder_len__</a> (uint, default: _1000_): reorder length in packets  
</div>  
<div markdown class="option">  
<a id="reorder_delay">__reorder_delay__</a> (uint, default: _50_): max delay in RTP re-orderer, packets will be dispatched after that  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _0x100000_): buffer size for RTP/UDP or RTSP when interleaved  
</div>  
<div markdown class="option">  
<a id="disable_rtcp">__disable_rtcp__</a> (bool, default: _false_): disable RTCP reporting  
</div>  
<div markdown class="option">  
<a id="nat_keepalive">__nat_keepalive__</a> (uint, default: _0_): delay in ms of NAT keepalive, disabled by default (except for SatIP, set to 30s by default)  
</div>  
<div markdown class="option">  
<a id="force_mcast">__force_mcast__</a> (str): force multicast on indicated IP in RTSP setup  
</div>  
<div markdown class="option">  
<a id="use_client_ports">__use_client_ports__</a> (bool, default: _false_): force using client ports (hack for some RTSP servers overriding client ports)  
</div>  
<div markdown class="option">  
<a id="bandwidth">__bandwidth__</a> (uint, default: _0_): set bandwidth param for RTSP requests  
</div>  
<div markdown class="option">  
<a id="default_port" data-level="basic">__default_port__</a> (uint, default: _554_, minmax: 0-65535): set default RTSP port  
</div>  
<div markdown class="option">  
<a id="satip_port" data-level="basic">__satip_port__</a> (uint, default: _1400_, minmax: 0-65535): set default port for SATIP  
</div>  
<div markdown class="option">  
<a id="transport">__transport__</a> (enum, default: _auto_): set RTP over RTSP  

- auto: set interleave on if HTTP tunnel is used, off otherwise and retry in interleaved mode if UDP timeout  
- tcp: enable RTP over RTSP  
- udp: disable RTP over RTSP  
</div>  
  
<div markdown class="option">  
<a id="udp_timeout" data-level="basic">__udp_timeout__</a> (uint, default: _10000_): default timeout before considering UDP is down  
</div>  
<div markdown class="option">  
<a id="rtcp_timeout">__rtcp_timeout__</a> (uint, default: _5000_): default timeout for RTCP traffic in ms. After this timeout, playback will start out of sync. If 0 always wait for RTCP  
</div>  
<div markdown class="option">  
<a id="first_packet_drop">__first_packet_drop__</a> (uint, default: _0_, updatable): set number of first RTP packet to drop (0 if no drop)  
</div>  
<div markdown class="option">  
<a id="frequency_drop">__frequency_drop__</a> (uint, default: _0_, updatable): drop 1 out of N packet (0 disable dropping)  
</div>  
<div markdown class="option">  
<a id="loss_rate">__loss_rate__</a> (sint, default: _-1_, updatable): loss rate to signal in RTCP, -1 means real loss rate, otherwise a per-thousand of packet lost  
</div>  
<div markdown class="option">  
<a id="user_agent" data-level="basic">__user_agent__</a> (str, default: _$GUA_): user agent string, by default solved from GPAC preferences  
</div>  
<div markdown class="option">  
<a id="languages" data-level="basic">__languages__</a> (str, default: _$GLANG_): user languages, by default solved from GPAC preferences  
</div>  
<div markdown class="option">  
<a id="stats">__stats__</a> (uint, default: _500_): update statistics to the user every given MS (0 disables reporting)  
</div>  
<div markdown class="option">  
<a id="max_sleep">__max_sleep__</a> (sint, default: _1000_): set max sleep in milliseconds:  

- a negative value `-N` means to always sleep for `N` ms  
- a positive value `N` means to sleep at most `N` ms but will sleep less if frame duration is shorter  
</div>  
  
<div markdown class="option">  
<a id="rtcpsync">__rtcpsync__</a> (bool, default: _true_): use RTCP to adjust synchronization  
</div>  
<div markdown class="option">  
<a id="forceagg">__forceagg__</a> (bool, default: _false_): force RTSP control aggregation (patch for buggy servers)  
</div>  
<div markdown class="option">  
<a id="ssm">__ssm__</a> (strl): list of IP to include for source-specific multicast  
</div>  
<div markdown class="option">  
<a id="ssmx">__ssmx__</a> (strl): list of IP to exclude for source-specific multicast  
</div>  
  
