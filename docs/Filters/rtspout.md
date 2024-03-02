<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# RTSP Server  
  
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
Example
```
gpac -i source -o rtsp://myip/sessionname  
gpac -i source -o rtsp://myip/sessionname
```  
In this mode, only one session is possible. It is possible to [loop](#loop) the input source(s).  
  
# Server mode  
  
The filter can work as a regular RTSP server by specifying the [mounts](#mounts) option to indicate paths of media file to be served:  
Example
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
  

# Options    
  
<a id="dst">__dst__</a> (cstr): location of destination resource  
<a id="port">__port__</a> (uint, default: _554_): server port  
<a id="firstport">__firstport__</a> (uint, default: _6000_): port for first stream in session  
<a id="mtu">__mtu__</a> (uint, default: _1460_): size of RTP MTU in bytes  
<a id="ttl">__ttl__</a> (uint, default: _0_): time-to-live for multicast packets (a value of 0 uses client requested TTL, or 1)  
<a id="ifce">__ifce__</a> (str): default network interface to use  
<a id="payt">__payt__</a> (uint, default: _96_, minmax: 96-127): payload type to use for dynamic decoder configurations  
<a id="mpeg4">__mpeg4__</a> (bool, default: _false_): send all streams using MPEG-4 generic payload format if possible  
<a id="delay">__delay__</a> (sint, default: _0_): send delay for packet (negative means send earlier)  
<a id="tt">__tt__</a> (uint, default: _1000_): time tolerance in microsecond (whenever schedule time minus realtime is below this value, the packet is sent right away)  
<a id="runfor">__runfor__</a> (sint, default: _-1_): run the session for the given time in ms. A negative value means run for ever if loop or source duration, value 0 only outputs the sdp  
<a id="tso">__tso__</a> (sint, default: _-1_): set timestamp offset in microseconds (negative value means random initial timestamp)  
<a id="xps">__xps__</a> (bool, default: _false_): force parameter set injection at each SAP. If not set, only inject if different from SDP ones  
<a id="latm">__latm__</a> (bool, default: _false_): use latm for AAC payload format  
<a id="mounts">__mounts__</a> (strl): list of directories to expose in server mode  
<a id="block_size">__block_size__</a> (uint, default: _10000_): block size used to read TCP socket  
<a id="maxc">__maxc__</a> (uint, default: _100_): maximum number of connections  
<a id="timeout">__timeout__</a> (uint, default: _20_): timeout in seconds for inactive sessions (0 disable timeout)  
<a id="user_agent">__user_agent__</a> (str, default: _$GUA_): user agent string, by default solved from GPAC preferences  
<a id="close">__close__</a> (bool, default: _false_): close RTSP connection after each request, except when RTP over RTSP is used  
<a id="loop">__loop__</a> (bool, default: _true_): loop all streams in session (not always possible depending on source type)  
<a id="dynurl">__dynurl__</a> (bool, default: _false_): allow dynamic service assembly  
<a id="mcast">__mcast__</a> (enum, default: _off_): control multicast setup of a session  
* off: clients are never allowed to create a multicast  
* on: clients can create multicast sessions  
* mirror: clients can create a multicast session. Any later request to the same URL will use that multicast session  
  
<a id="quit">__quit__</a> (bool, default: _false_): exit server once first session is over (for test purposes)  
<a id="htun">__htun__</a> (bool, default: _true_): enable RTSP over HTTP tunnel  
<a id="trp">__trp__</a> (enum, default: _both_): transport mode  
* both: allow TCP or UDP traffic  
* udp: only allow UDP traffic  
* tcp: only allow TCP traffic  
  
<a id="cert">__cert__</a> (str): certificate file in PEM format to use for TLS mode  
<a id="pkey">__pkey__</a> (str): private key file in PEM format to use for TLS mode  
  
