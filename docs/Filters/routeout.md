<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MABR & ROUTE output  
  
Register name used to load filter: __routeout__  
This filter may be automatically loaded during graph resolution.  
  
The ROUTE output filter is used to distribute a live file-based session using ROUTE or DVB-MABR.  
The filter supports DASH and HLS inputs, ATSC3.0 signaling and generic ROUTE or DVB-MABR signaling.  
  
The filter is identified using the following URL schemes:  

- `atsc://`: session is a full ATSC 3.0 session  
- `route://IP:port`: session is a ROUTE session running on given multicast IP and port  
- `mabr://IP:port`: session is a DVB-MABR session using FLUTE running on given multicast IP and port  

  
The filter only accepts input PIDs of type `FILE`.  

- HAS Manifests files are detected by file extension and/or MIME types, and sent as part of the signaling bundle or as LCT object files for HLS child playlists.  
- HAS Media segments are detected using the `OrigStreamType` property, and send as LCT object files using the DASH template string.  
- A PID without `OrigStreamType` property set is delivered as a regular LCT object file (called `raw` hereafter).  

    
For `raw` file PIDs, the filter will look for the following properties:  

- `MCASTName`: set resource name. If not found, uses basename of URL  
- `MCASTCarousel`: set repeat period. If not found, uses [carousel](#carousel). If 0, the file is only sent once  
- `MCASTUpload`: set resource upload time. If not found, uses [carousel](#carousel). If 0, the file will be sent as fast as possible.  

  
When DASHing for ROUTE, DVB-MABR or single service ATSC, a file extension, either in [dst](#dst) or in [ext](#ext), may be used to identify the HAS session type (DASH or HLS).  
Example
```
"route://IP:PORT/manifest.mpd", "route://IP:PORT/:ext=mpd"
```
  
  
When DASHing for multi-service ATSC, forcing an extension will force all service to use the same formats.  
Example
```
"atsc://:ext=mpd", "route://IP:PORT/manifest.mpd"
```
  
If multiple services with different formats are needed, you will need to explicit your filters:  
```
gpac -i DASH_URL:#ServiceID=1 dashin:forward=file:FID=1 -i HLS_URL:#ServiceID=2 dashin:forward=file:FID=2 -o atsc://:SID=1,2  
gpac -i MOVIE1:#ServiceID=1 dasher:FID=1:mname=manifest.mpd -i MOVIE2:#ServiceID=2 dasher:FID=2:mname=manifest.m3u8 -o atsc://:SID=1,2
```
  
  
__Warning: When forwarding an existing DASH/HLS session, do NOT set any extension or manifest name.__  
  
The filter will look for `MCASTIP` and `MCASTPort` properties on the incoming PID to setup multicast of each service. If not found, the default [ip](#ip) and port will be used, with port incremented by one for each new multicast stream.  
  
By default, all streams in a service are assigned to a single multicast session, and differentiated by TSI (see [splitlct](#splitlct)).  
TSI are assigned as follows:  

- signaling TSI is always 0 for ROUTE, 1 for DVB+Flute  
- raw files are assigned TSI 1 and increasing number of TOI  
- otherwise, the first PID found is assigned TSI 10, the second TSI 20 etc ...  

  
When [splitlct](#splitlct) is set to `mcast`, the IP multicast address is computed as follows:  

    - if `MCASTIP` is set on the PID and is different from the service multicast IP, it is used  
    - otherwise the service multicast IP plus one is used  

The multicast port used is set as follows:  

- if `MCASTPort` is set on the PID, it is used  
- otherwise the same port as the service one is used.  

Init segments and HLS child playlists are sent before each new segment, independently of [carousel](#carousel).  

# ATSC 3.0 mode  
  
In this mode, the filter allows multiple service multiplexing, identified through the `ServiceID` property.  
By default (see above), a single multicast IP is used for route sessions, each service will be assigned a different port.  
  
ATSC 3.0 attributes set by using the following PID properties:  

- ATSC3ShortServiceName: set the short service name, maxiumu of 7 characters.  If not found, `ServiceName` is checked, otherwise default to `GPAC`.  
- ATSC3MajorChannel: set major channel number of service. Default to 2.  This really should be set and should not use the default.  
- ATSC3MinorChannel: set minor channel number of service. Default of 1.  
- ATSC3ServiceCat: set service category, default to 1 if not found. 1=Linear a/v service. 2=Linear audio only service. 3=App-based service. 4=ESg service. 5=EA service. 6=DRM service.  
- ATSC3hidden: set if service is hidden.  Boolean true or false. Default of false.  
- ATSC3hideInGuide: set if service is hidden in ESG.  Boolean true or false. Default of false.  
- ATSC3configuration: set service configuration.  Choices are Broadcast or Broadband.  Default of Broadcast  

  
# ROUTE mode  
  
In this mode, only a single service can be distributed by the ROUTE session.  
_Note: [ip](#ip) is ignored, and [first_port](#first_port) is used if no port is specified in [dst](#dst)._  
The ROUTE session will include a multi-part MIME unsigned package containing manifest and S-TSID, sent on TSI=0.  
  
# DVB-MABR mode  
  
In this mode, the filter allows multiple service multiplexing, identified through the `ServiceID` and `ServiceName` properties.  
_Note: [ip](#ip) and [first_port](#first_port) are used to send the multicast gateway configuration. [first_port](#first_port) is used only if no port is specified in [dst](#dst)._  
  
The session will carry DVB-MABR gateway configuration, maifests and init segments on `TSI=1`. The [use_inband](#use_inband) option can be used to send manifests and init segments in media multicast sessions.  
  
The FLUTE session always uses a symbol length of [mtu](#mtu) minus 44 bytes.  
  
The `MABRBaseURLs` property can be set on sources to declare a list of alternate repair servers to be injected.  
Each base URL can be prefixed with `N;`, where `N` gives the relative weight of the server, a negative value skipping the server.  
The special value `src` is used to indicate the source of the session.  
Example
```
gpac -i HTTP_MPD_URL:gpac::#MABRBaseURLs=-1;src,SOME_ALT_URL dashin:forward=file -o mabr://225.0.0.1:1234/
```
  
This will forward the source DASH session to multicast and:  

- hide the source server as a repair URL  
- add `SOME_ALT_URL` as a repair URL  

  
# Low latency mode  
  
When using low-latency mode (-llmode)(), the input media segments are not re-assembled in a single packet but are instead sent as they are received.  
In order for the real-time scheduling of data chunks to work, each fragment of the segment should have a CTS and timestamp describing its timing.  
If this is not the case (typically when used with an existing DASH session in file mode), the scheduler will estimate CTS and duration based on the stream bitrate and segment duration. The indicated bitrate is increased by [brinc](#brinc) percent for safety.  
If this fails, the filter will trigger warnings and send as fast as possible.  
_Note: The LCT objects are sent with no length (TOL header) assigned until the final segment size is known, potentially leading to a final 0-size LCT fragment signaling only the final size._  
  
In this mode, init segments and manifests are sent at the frequency given by property `MCASTCarousel` of the source PID if set or by (-carousel)[] option.  
Indicating `MCASTCarousel=0` will disable mid-segment repeating of manifests and init segments.  

# Examples  
  
Since the ROUTE filter only consumes files, it is required to insert:  

- the dash demultiplexer in file forwarding mode when loading a DASH session  
- the dash multiplexer when creating a DASH session  

  
Multiplexing an existing DASH session in route:  
```
gpac -i source.mpd dashin:forward=file -o route://225.1.1.0:6000/
```
  
Multiplexing an existing DASH session in atsc:  
```
gpac -i source.mpd dashin:forward=file -o atsc://
```
  
Dashing and multiplexing in route:  
```
gpac -i source.mp4 dasher:profile=live -o route://225.1.1.0:6000/manifest.mpd
```
  
Dashing and multiplexing in route Low Latency:  
```
gpac -i source.mp4 dasher -o route://225.1.1.0:6000/manifest.mpd:profile=live:cdur=0.2:llmode
```
  
  
Sending a single file in ROUTE using half a second upload time, 2 seconds carousel:  
```
gpac -i URL:#MCASTUpload=0.5:#MCASTCarousel=2 -o route://225.1.1.0:6000/
```
  
  
Common mistakes:  
```
gpac -i source.mpd -o route://225.1.1.0:6000/
```
  
This will only send the manifest file as a regular object and will not load the dash session.  
Example
```
gpac -i source.mpd dashin:forward=file -o route://225.1.1.0:6000/manifest.mpd
```
  
This will force the ROUTE multiplexer to only accept .mpd files, and will drop all segment files (same if [ext](#ext) is used).  
Example
```
gpac -i source.mpd dasher -o route://225.1.1.0:6000/  
gpac -i source.mpd dasher -o route://225.1.1.0:6000/manifest.mpd
```
  
These will demultiplex the input, re-dash it and send the output of the dasher to ROUTE  
  
# Error simulation  
  
It is possible to simulate errors with (-errsim)(). In this mode the LCT network sender implements a 2-state Markov chain:  
```
gpac -i source.mpd dasher -o route://225.1.1.0:6000/:errsim=1.0x98.0
```
  
This will set a 1.0 percent chance to transition to error (not sending data over the network) and 98.0 percent chance to transition from error back to OK.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="dst" data-level="basic">__dst__</a> (cstr): destination URL  
</div>  
<div markdown class="option">  
<a id="ext">__ext__</a> (cstr): set extension for graph resolution, regardless of file extension  
</div>  
<div markdown class="option">  
<a id="mime">__mime__</a> (cstr): set mime type for graph resolution  
</div>  
<div markdown class="option">  
<a id="ifce">__ifce__</a> (str): default interface to use for multicast. If NULL, the default system interface will be used  
</div>  
<div markdown class="option">  
<a id="carousel">__carousel__</a> (uint, default: _1000_): carousel period in ms for repeating signaling and raw file data  
</div>  
<div markdown class="option">  
<a id="first_port">__first_port__</a> (uint, default: _6000_): port number of first ROUTE session in ATSC mode  
</div>  
<div markdown class="option">  
<a id="ip">__ip__</a> (str, default: _225.1.1.0_): multicast IP address for ROUTE session in ATSC mode  
</div>  
<div markdown class="option">  
<a id="ttl" data-level="basic">__ttl__</a> (uint, default: _0_): time-to-live for multicast packets  
</div>  
<div markdown class="option">  
<a id="bsid">__bsid__</a> (uint, default: _800_): ID for ATSC broadcast stream  
</div>  
<div markdown class="option">  
<a id="mtu" data-level="basic">__mtu__</a> (uint, default: _1472_): size of LCT MTU in bytes  
</div>  
<div markdown class="option">  
<a id="splitlct" data-level="basic">__splitlct__</a> (enum, default: _off_): split mode for LCT channels  

- off: all streams are in the same LCT channel  
- type: each new stream type results in a new LCT channel  
- all: all streams are in dedicated LCT channel, the first stream being used for STSID signaling  
- mcast: all streams are in dedicated multicast groups  
</div>  
  
<div markdown class="option">  
<a id="korean" data-level="basic">__korean__</a> (bool, default: _false_): use Korean version of ATSC 3.0 spec instead of US  
</div>  
<div markdown class="option">  
<a id="llmode">__llmode__</a> (bool, default: _false_): use low-latency mode  
</div>  
<div markdown class="option">  
<a id="brinc">__brinc__</a> (uint, default: _10_): bitrate increase in percent when estimating timing in low latency mode  
</div>  
<div markdown class="option">  
<a id="noreg">__noreg__</a> (bool, default: _false_): disable rate regulation for media segments, pushing them as fast as received  
</div>  
<div markdown class="option">  
<a id="runfor" data-level="basic">__runfor__</a> (uint, default: _0_): run for the given time in ms  
</div>  
<div markdown class="option">  
<a id="nozip" data-level="basic">__nozip__</a> (bool, default: _false_): do not zip signaling package (STSID+manifest)  
</div>  
<div markdown class="option">  
<a id="flute" data-level="basic">__flute__</a> (bool, default: _true_): use flute for DVB-MABR object delivery  
</div>  
<div markdown class="option">  
<a id="csum" data-level="basic">__csum__</a> (enum, default: _meta_): send MD5 checksum for DVB flute  

- no: do not send checksum  
- meta: only send checksum for configuration files, manifests and init segments  
- all: send checksum for everything  
</div>  
  
<div markdown class="option">  
<a id="recv_obj_timeout" data-level="basic">__recv_obj_timeout__</a> (uint, default: _50_): set timeout period in ms before client resorts to unicast repair  
</div>  
<div markdown class="option">  
<a id="errsim" data-level="basic">__errsim__</a> (v2d, default: _0.0x100.0_): simulate errors using a 2-state Markov chain. Value are percentages  
</div>  
<div markdown class="option">  
<a id="use_inband" data-level="basic">__use_inband__</a> (bool, default: _false_): send manifest and init segments in media transport sessions for MABR  
</div>  
<div markdown class="option">  
<a id="ssm" data-level="basic">__ssm__</a> (bool, default: _false_): indicate source-specific multicast for DVB-MABR, requires `ifce` to be set  
</div>  
  
