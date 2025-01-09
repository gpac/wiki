<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# RTSP server  
  
Register name used to load filter: __rtspout__  
This filter may be automatically loaded during graph resolution.  
  
The RTSP server partially implements RTSP 1.0, with support for OPTIONS, DESCRIBE, SETUP, PLAY, PAUSE and TEARDOWN.  
Multiple PLAY ranges are not supported, PLAY range end is not supported, PAUSE range is not supported.  
Only aggregated control is supported for PLAY and PAUSE, PAUSE/PLAY on single stream is not supported.  
The server only runs on TCP, and handles request in sequence: it will not probe for commands until previous response is sent.  
The server supports both RTP over UDP delivery and RTP interleaved over RTSP delivery.  
  
The scheduling algorithm and RTP options are the same as the RTP output filter, see [gpac -h rtpout](rtpout)  
The server will disconnect UDP streaming sessions if no RTCP traffic has been received for [timeout](#timeout) seconds.  
  
The server can run over TLS by specifying [cert](#cert) and [pkey](#pkey), in which case the default [port](#port) is 322.  
  
# Sink mode  
  
The filter can work as a simple output filter by specifying the [dst](#dst) option:  
```
gpac -i source -o rtsp://myip/sessionname  
gpac -i source -o rtsp://myip/sessionname
```
  
In this mode, only one session is possible. It is possible to [loop](#loop) the input source(s).  
  
# Server mode  
  
The filter can work as a regular RTSP server by specifying the [mounts](#mounts) option to indicate paths of media file to be served:  
```
gpac rtspout:mounts=mydir1,mydir2
```
  
In this case, content `RES` from any of the specified directory is exposed as `rtsp://SERVER/RES`  
  
The [mounts](#mounts) option can also specify access rule file(s), see `gpac -h creds`. When rules are used:  

- if a directory has a `name` rule, it will be used in the URL  
- otherwise, the directory is directly available under server root `/`  
- only read access and multicast rights are checked  

Example
```
[foodir]  
name=bar
```
  
Content `RES` of this directory is exposed as `rtsp://SERVER/bar/RES`.  
    
  
In this mode, it is possible to load any source supported by gpac by setting the option [dynurl](#dynurl).  
The expected syntax of the dynamic RTSP URLs is `rtsp://servername/?URL1[&URLN]` or `rtsp://servername/@URL1[@URLN]`   
Each URL can be absolute or local, in which case it is resolved against the mount point(s).  
Example
```
gpac -i rtsp://localhost/?pipe://mynamepipe&myfile.mp4 [dst filters]
```
  
The server will resolve this URL in a new session containing streams from `myfile.mp4` and streams from pipe `mynamepipe`.  
When setting [runfor](#runfor) in server mode, the server will exit at the end of the last session being closed.  
  
The parameter `name=VAL` is reserved to assign a session name in case multicast mirroring is used.  
Example
```
gpac -i rtsp://localhost/?name=live?pipe://mynamepipe&myfile.mp4 [dst filters]
```
  
  
Usage of dynamic URLs can also be configured using the specific directory `$dynurl` in an access rule file.  
EX[$dynurl]  
ru=foo  
This will allow dynamic URLs only for `foo` user.  
  
_Note: If the [dynurl](#dynurl) is set, it is enabled for all users, without authentication._  
  
# Multicasting  
  
In both modes, clients can setup multicast if the [mcast](#mcast) option is `on` or `mirror`.  
When [mcast](#mcast) is set to `mirror` mode, any DESCRIBE command on a resource already delivered through a multicast session will use that multicast.  
Consequently, only DESCRIBE methods are processed for such sessions, other methods will return Unauthorized.  
  
In server mode, multicast can be enabled per read directory using the `mcast` access rule of the directory configuration - see `gpac -h creds`.  
  
# HTTP Tunnel  
  
The server mode supports handling RTSP over HTTP tunnel by default. This can be disabled using [htun](#htun).  
The tunnel conforms to QT specification, and only HTTP 1.0 and 1.1 tunnels are supported.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="dst" data-level="basic">__dst__</a> (cstr): location of destination resource  
</div>  
<div markdown class="option">  
<a id="port" data-level="basic">__port__</a> (uint, default: _554_): server port  
</div>  
<div markdown class="option">  
<a id="firstport">__firstport__</a> (uint, default: _6000_): port for first stream in session  
</div>  
<div markdown class="option">  
<a id="mtu" data-level="basic">__mtu__</a> (uint, default: _1460_): size of RTP MTU in bytes  
</div>  
<div markdown class="option">  
<a id="ttl">__ttl__</a> (uint, default: _0_): time-to-live for multicast packets (a value of 0 uses client requested TTL, or 1)  
</div>  
<div markdown class="option">  
<a id="ifce">__ifce__</a> (str): default network interface to use  
</div>  
<div markdown class="option">  
<a id="payt">__payt__</a> (uint, default: _96_, minmax: 96-127): payload type to use for dynamic decoder configurations  
</div>  
<div markdown class="option">  
<a id="mpeg4" data-level="basic">__mpeg4__</a> (bool, default: _false_): send all streams using MPEG-4 generic payload format if possible  
</div>  
<div markdown class="option">  
<a id="delay">__delay__</a> (sint, default: _0_): send delay for packet (negative means send earlier)  
</div>  
<div markdown class="option">  
<a id="tt">__tt__</a> (uint, default: _1000_): time tolerance in microsecond (whenever schedule time minus realtime is below this value, the packet is sent right away)  
</div>  
<div markdown class="option">  
<a id="runfor">__runfor__</a> (sint, default: _-1_): run the session for the given time in ms. A negative value means run for ever if loop or source duration, value 0 only outputs the sdp  
</div>  
<div markdown class="option">  
<a id="tso">__tso__</a> (sint, default: _-1_): set timestamp offset in microseconds (negative value means random initial timestamp)  
</div>  
<div markdown class="option">  
<a id="xps">__xps__</a> (bool, default: _false_): force parameter set injection at each SAP. If not set, only inject if different from SDP ones  
</div>  
<div markdown class="option">  
<a id="latm" data-level="basic">__latm__</a> (bool, default: _false_): use latm for AAC payload format  
</div>  
<div markdown class="option">  
<a id="mounts" data-level="basic">__mounts__</a> (strl): list of directories to expose in server mode  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _10000_): block size used to read TCP socket  
</div>  
<div markdown class="option">  
<a id="maxc">__maxc__</a> (uint, default: _100_): maximum number of connections  
</div>  
<div markdown class="option">  
<a id="timeout">__timeout__</a> (uint, default: _20_): timeout in seconds for inactive sessions (0 disable timeout)  
</div>  
<div markdown class="option">  
<a id="user_agent" data-level="basic">__user_agent__</a> (str, default: _$GUA_): user agent string, by default solved from GPAC preferences  
</div>  
<div markdown class="option">  
<a id="close">__close__</a> (bool, default: _false_): close RTSP connection after each request, except when RTP over RTSP is used  
</div>  
<div markdown class="option">  
<a id="loop">__loop__</a> (bool, default: _false_): loop all streams in session (not always possible depending on source type)  
</div>  
<div markdown class="option">  
<a id="dynurl">__dynurl__</a> (bool, default: _false_): allow dynamic service assembly  
</div>  
<div markdown class="option">  
<a id="mcast">__mcast__</a> (enum, default: _off_): control multicast setup of a session  

- off: clients are never allowed to create a multicast  
- on: clients can create multicast sessions  
- mirror: clients can create a multicast session. Any later request to the same URL will use that multicast session  
</div>  
  
<div markdown class="option">  
<a id="quit">__quit__</a> (bool, default: _false_): exit server once first session is over (for test purposes)  
</div>  
<div markdown class="option">  
<a id="htun">__htun__</a> (bool, default: _true_): enable RTSP over HTTP tunnel  
</div>  
<div markdown class="option">  
<a id="trp">__trp__</a> (enum, default: _both_): transport mode  

- both: allow TCP or UDP traffic  
- udp: only allow UDP traffic  
- tcp: only allow TCP traffic  
</div>  
  
<div markdown class="option">  
<a id="cert" data-level="basic">__cert__</a> (str): certificate file in PEM format to use for TLS mode  
</div>  
<div markdown class="option">  
<a id="pkey" data-level="basic">__pkey__</a> (str): private key file in PEM format to use for TLS mode  
</div>  
  
