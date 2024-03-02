<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# HTTP Server  
  
Register name used to load filter: __httpout__  
This filter may be automatically loaded during graph resolution.  
  
The HTTP output filter can act as:  
- a simple HTTP server  
- an HTTP server sink  
- an HTTP server file sink  
- an HTTP _client_ sink  
- an HTTP server _source_  
    
The server currently handles GET, HEAD, PUT, POST, DELETE methods, and basic OPTIONS support.  
Single or multiple byte ranges are supported for both GET and PUT/POST methods, in all server modes.  
- for GET, the resulting body is a single-part body formed by the concatenated byte ranges as requested (no overlap checking).  
- for PUT/POST, the received data is pushed to the target file according to the byte ranges specified in the client request.  
    

__Warning: the partial PUT request is RFC2616 compliant but not compliant with RFC7230. PATCH method is not yet implemented in GPAC.__  
  
    
When a single read directory is specified, the server root `/` is the content of this directory.  
When multiple read directories are specified, the server root `/` contains the list of the mount points with their directory names.  
When a write directory is specified, the upload resource name identifies a file in this directory (the write directory name is not present in the URL).  
    
A directory rule file (cf `gpac -h creds`) can be specified in [rdirs](#rdirs) but NOT in [wdir](#wdir). When rules are used:  
- if a directory has a `name` rule, it will be used in the URL  
- otherwise, the directory is directly available under server root `/`  
- read and write access rights are checked  
Example
```
[foodir]  
name=bar
```  
Content `RES` of this directory is exposed as `http://SERVER/bar/RES`.  
    
Listing can be enabled on server using [dlist](#dlist).  
When disabled, a GET on a directory will fail.  
When enabled, a GET on a directory will return a simple HTML listing of the content inspired from Apache.  
    
Custom headers can be specified using [hdrs](#hdrs), they apply to all requests. For more advanced control on requests, use a javascript binding (see [js](#js) and howtos).  
    
Text files are compressed using gzip or deflate if the client accepts these encodings, unless [no_z](#no_z) is set.  
    

# Simple HTTP server  
  
In this mode, the filter does not need any input connection and exposes all files in the directories given by [rdirs](#rdirs).  
PUT and POST methods are only supported if a write directory is specified by [wdir](#wdir) option.  
Example
```
gpac httpout:rdirs=outcoming
```  
This sets up a read-only server.  
    
Example
```
gpac httpout:wdir=incoming
```  
This sets up a write-only server.  
    
Example
```
gpac httpout:rdirs=outcoming:wdir=incoming:port=8080
```  
This sets up a read-write server running on [port](#port) 8080.  
    

# HTTP server sink  
  
In this mode, the filter will forward input PIDs to connected clients, trashing the data if no client is connected unless [hold](#hold) is specified.  
The filter does not use any read directory in this mode.  
This mode is mostly useful to setup live HTTP streaming of media sessions such as MP3, MPEG-2 TS or other multiplexed representations:  
Example
```
gpac -i MP3_SOURCE -o http://localhost/live.mp3 --hold
```  
In this example, the server waits for client requests on `/live.mp3` and will then push each input packet to all connected clients.  
If the source is not real-time, you can inject a reframer filter performing realtime regulation.  
Example
```
gpac -i MP3_SOURCE reframer:rt=on -o http://localhost/live.mp3
```  
In this example, the server will push each input packet to all connected clients, or trash the packet if no connected clients.  
    
In this mode, ICECast meta-data can be inserted using [ice](#ice). The default inserted values are `ice-audio-info`, `icy-br`, `icy-pub` (set to 1) and `icy-name` if input `ServiceName` property is set.  
The server will also look for any property called `ice-*` on the input PID and inject them.  
Example
```
gpac -i source.mp3:#ice-Genre=CoolRock -o http://IP/live.mp3 --ice
```  
This will inject the header `ice-Genre: CoolRock` in the response.    
Once one complete input file is sent, it is no longer available for download unless [reopen](#reopen) is set and input PID is not over.  
    
This mode should not be used with multiple files muxers such as DASH or HLS.  
    

# HTTP server file sink  
  
In this mode, the filter will write input PIDs to files in the first read directory specified, acting as a file output sink.  
The filter uses a read directory in this mode, which must be writable.  
Upon client GET request, the server will check if the requested URL matches the name of a file currently being written by the server.  
- If so, the server will:  
  - send the content using HTTP chunk transfer mode, starting with what is already written on disk  
  - push remaining data to the client as soon as received while writing it to disk, until source file is done  
- If not so, the server will simply send the file from the disk as a regular HTTP session, without chunk transfer.  
    
This mode is typically used for origin server in HAS sessions where clients may request files while they are being produced (low latency DASH).  
Example
```
gpac -i SOURCE reframer:rt=on -o http://localhost:8080/live.mpd --rdirs=temp --dmode=dynamic --cdur=0.1
```  
In this example, a real-time dynamic DASH session with chunks of 100ms is created, writing files to `temp`. A client connecting to the live edge will receive segments as they are produced using HTTP chunk transfer.  
    
The server can store incoming files to memory mode by setting the read directory to `gmem`.  
In this mode, [max_cache_segs](#max_cache_segs) is always at least 1.  
    
If [max_cache_segs](#max_cache_segs) value `N` is not 0, each incoming PID will store at most:  
- `MIN(N, time-shift depth)` files if stored in memory  
- `-N` files if stored locally and `N` is negative  
- `MAX(N, time-shift depth)` files if stored locally and `N` is positive  
- unlimited otherwise (files stored locally, `N` is positive and no time-shift info)  
    

# HTTP client sink  
  
In this mode, the filter will upload input PIDs data to remote server using PUT (or POST if [post](#post) is set).  
This mode must be explicitly activated using [hmode](#hmode).  
The filter uses no read or write directories in this mode.  
Example
```
gpac -i SOURCE -o http://targethost:8080/live.mpd:gpac:hmode=push
```  
In this example, the filter will send PUT methods to the server running on [port](#port) 8080 at `targethost` location (IP address or name).  
    

# HTTP server source  
  
In this mode, the server acts as a source rather than a sink. It declares incoming PUT or POST methods as output PIDs  
This mode must be explicitly activated using [hmode](#hmode).  
The filter uses no read or write directories in this mode, and uploaded data is NOT stored by the server.  
Example
```
gpac httpout:hmode=source vout aout
```  
In this example, the filter will try to play uploaded files through video and audio output.  
    

# HTTPS server  
  
The server can run over TLS (https) for all the server modes. TLS is enabled by specifying [cert](#cert) and [pkey](#pkey) options.  
Both certificate and key must be in PEM format.  
The server currently only operates in either HTTPS or HTTP mode and cannot run both modes at the same time. You will need to use two httpout filters for this, one operating in HTTPS and one operating in HTTP.  
    

# Multiple destinations on single server  
  
When running in server mode, multiple HTTP outputs with same URL/port may be used:  
- the first loaded HTTP output filter with same URL/port will be reused  
- all httpout options of subsequent httpout filters, except [dst](#dst) will be ignored, other options will be inherited as usual  
  
Example
```
gpac -i dash.mpd dashin:forward=file:FID=D1 dashin:forward=segb:FID=D2 -o http://localhost:80/live.mpd:SID=D1:rdirs=dash -o http://localhost:80/live_rw.mpd:SID=D2:sigfrag
```  
This will:  
- load the HTTP server and forward (through `D1`) the dash session to this server using `live.mpd` as manifest name  
- reuse the HTTP server and regenerate the manifest (through `D2` and `sigfrag` option), using `live_rw.mpd` as manifest name  
  

# Options    
  
<a id="dst">__dst__</a> (cstr): location of destination resource  
<a id="port">__port__</a> (uint, default: _0_): server port  
<a id="ifce">__ifce__</a> (str): default network interface to use  
<a id="rdirs">__rdirs__</a> (strl): list of directories to expose for read  
<a id="wdir">__wdir__</a> (str): directory to expose for write  
<a id="cert">__cert__</a> (str): certificate file in PEM format to use for TLS mode  
<a id="pkey">__pkey__</a> (str): private key file in PEM format to use for TLS mode  
<a id="block_size">__block_size__</a> (uint, default: _10000_): block size used to read and write TCP socket  
<a id="user_agent">__user_agent__</a> (str, default: _$GUA_): user agent string, by default solved from GPAC preferences  
<a id="close">__close__</a> (bool, default: _false_): close HTTP connection after each request  
<a id="maxc">__maxc__</a> (uint, default: _100_): maximum number of connections, 0 is unlimited  
<a id="maxp">__maxp__</a> (uint, default: _6_): maximum number of connections for one peer (0 is unlimited)  
<a id="cache_control">__cache_control__</a> (str): specify the `Cache-Control` string to add (`none` disable cache control and ETag)  
<a id="hold">__hold__</a> (bool, default: _false_): hold packets until one client connects  
<a id="hmode">__hmode__</a> (enum, default: _default_): filter operation mode, ignored if [wdir](#wdir) is set  
* default: run in server mode  
* push: run in client mode using PUT or POST  
* source: use server as source filter on incoming PUT/POST  
  
<a id="timeout">__timeout__</a> (uint, default: _30_): timeout in seconds for persistent connections (0 disable timeout)  
<a id="ext">__ext__</a> (cstr): set extension for graph resolution, regardless of file extension  
<a id="mime">__mime__</a> (cstr): set mime type for graph resolution  
<a id="quit">__quit__</a> (bool, default: _false_): exit server once all input PIDs are done and client disconnects (for test purposes)  
<a id="post">__post__</a> (bool, default: _false_): use POST instead of PUT for uploading files  
<a id="dlist">__dlist__</a> (bool, default: _false_): enable HTML listing for GET requests on directories  
<a id="sutc">__sutc__</a> (bool, default: _false_): insert server UTC in response headers as `Server-UTC: VAL_IN_MS`  
<a id="cors">__cors__</a> (enum, default: _auto_): insert CORS header allowing all domains  
* off: disable CORS  
* on: enable CORS  
* auto: enable CORS when `Origin` is found in request  
  
<a id="reqlog">__reqlog__</a> (str): provide short log of the requests indicated in this option (comma separated list, `*` for all) regardless of HTTP log settings. Value `REC` logs file writing start/end. If prefix `-` is set, do not log request end  
<a id="ice">__ice__</a> (bool, default: _false_): insert ICE meta-data in response headers in sink mode  
<a id="max_client_errors">__max_client_errors__</a> (uint, default: _20_): force disconnection after specified number of consecutive errors from HTTTP 1.1 client (ignored in H/2 or when `close` is set)  
<a id="max_cache_segs">__max_cache_segs__</a> (sint, default: _5_): maximum number of segments cached per HAS quality (see filter help)  
<a id="reopen">__reopen__</a> (bool, default: _false_): in server mode with no read dir, accept requests on files already over but with input pid not in end of stream  
<a id="max_async_buf">__max_async_buf__</a> (uint, default: _100000_): maximum async buffer size in bytes when sharing output over multiple connection without file IO  
<a id="blockio">__blockio__</a> (bool, default: _false_): use blocking IO in push or source mode or in server mode with no read dir  
<a id="ka">__ka__</a> (bool, default: _true_): keep input alive if failure in push mode  
<a id="hdrs">__hdrs__</a> (strl): additional HTTP headers to inject, even values are names, odd values are values   
<a id="js">__js__</a> (str):   javascript logic for server  
<a id="zmax">__zmax__</a> (uint, default: _50000_): maximum uncompressed size allowed for gzip or deflate compression for text files (only enabled if client indicates it), 0 will disable compression  
  
