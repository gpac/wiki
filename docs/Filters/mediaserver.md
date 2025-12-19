<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Media Server  
  
Register name used to load filter: __mediaserver__  
This is a JavaScript filter. It is not checked during graph resolution and needs explicit loading.  
Author: GPAC team - (c) Telecom Paris 2024 - license LGPL v2  
  
This filter is an HTTP server and proxy for GET and HEAD requests supporting Multicast ABR sources.  
  
This filter does not produce PIDs, it attaches to HTTP output filter.  
If no HTTP output filter is specified in the session, the filter will create one.  
The file `.gpac_auth`, if present in current working directory, will be used for authentication unless `--rdirs` is set.  
  
If more options need to be specified for the HTTP output filter, they can be passed as local options or using global options:  
```
gpac mediaserver:cors=on --user_agent=MyUser
```
  
  
Although not recommended, a server may be specified explicitly:  
```
gpac mediaserver httpout:OPTS
```
  
In this case, the first `httpout` filter created will be used.  
  
Default request handling of `httpout` filter through read / write directories is disabled.  
  
# Services Configuration  
  
The service configuration is set using [scfg](#scfg). It shall be a JSON file containing a single array of services.  
Each service is a JSON object with one or more of the following properties:  

- id: (string, default null) Service identifier used for logs  
- active: (boolean, default true) service is ignored if false  
- http: (string, default null) URL of remote service to proxy (either resource name or server path)  
- gcache: (boolean, default false) use gpac local disk cache when fetching media from HTTP for this service  
- local: (string, default null) local mount point of this service  
- keepalive: (number, default 4) remove the service if no request received for the indicated delay in seconds (0 force service to stay in memory forever)  
- mabr: (string, default null) address of multicast ABR source for this service  
- timeshift: (number, default 10) time in seconds a cached file remains in memory  
- unload: (number, default 4) multicast unload policy  
- activate: (number, default 1) multicast activation policy  
- mcache: (boolean, default false) cache manifest files  
- repair: (string, default false) enable unicast repair in MABR stack  

    - false: disable repair  
    - true: enable repair using source URL or repair servers indicated in MABR  
    - auto: enable repair only from repair servers indicated in MABR  

- corrupted: (boolean, default false) forward corrupted files if parsable (valid container syntax, broken media)  
- check_ip: (boolean, , default false) monitor IP address and port rather than connection when tracking active clients  
- noproxy: (boolean) disable proxy for service when local mount point is set. Default is `true` if both `local` and `http` are set, `false` otherwise  
- sources: (array, default null) list of sources objects for file-only services. Each source has the following property:  
- name: name as used in resource path,  
- url: local or remote URL to use for this resource.  
- js: (string, default null) built-in or custom request resolver  

  
Any JSON object with the property `comment` set will be ignored.  
  
Not all properties are used for each type of service and other properties can be defined by custom request resolvers.  
  
# Proxy versus Server  
  
All services using `http` option can be exposed by the server without exposing the origin URL, rather than being proxied. To enable this, the `local` service configuration option must be set to:  

- the exposed server path, in which case manifest names are not rewritten  
- or the exposed manifest path, in which case manifest names are rewritten, but only one manifest can be exposed (does not work with dual MPD and M3U8 services)  

  
Example
```
{ "http": "https://test.com/live/dash/live.mpd", "local": "/service1/"}
```
  
The server will translate any request `/service1/foo/bar.ext` into `https://test.com/live/dash/foo/bar.ext`.  
  
Example
```
{ "http": "https://test.com/live/dash/live.mpd", "local": "/service1/manifest.mpd"}
```
  
The server will translate:  

- request `/service1/manifest.mpd` into `https://test.com/live/dash/live.mpd`  
- any request `/service1/foo/bar.ext` into `https://test.com/live/dash/foo/bar.ext`  

  
_Note: The URL must point to a self-contained subdirectory of the remote site. Any URLs outside this directory will either fail or be resolved as absolute path on the remote site._  
  
When `local` is not set, these services are always acting as proxies for the `http` URL.  
  
When `noproxy` is explicitly set to false for the services with both `http` and `local`, the remote URL will be available as a proxy service as well.  
  
# HTTP Proxy and Relay  
  
The server can act as a proxy for HTTP requests, either for any requests or by domain or resource name.  
  
_Service configuration parameters used :_ `http` (mandatory), `gcache`, `local`.  
  
Configuration for activating proxy for a specific network path:  
```
{ "http": "https://test.com/video/"}
```
  
  
Configuration for activating proxy for any network path:  
```
{ "http": "*"}
```
  
  
Configuration for a relay on a given path:  
```
{ "http": "https://test.com/some/path/to/video/", "local": "/myvids/"}
```
  
  
This will resolve any request `http://localhost/myvids/*` to `https://test.com/some/path/to/video/*`  
  
_Note: The requests are never cached in memory in this mode, but can be cached on disk if `gcache` is set._  
  
# HTTP Streaming Cache  
  
The server can act as a cache for live HTTP streaming sessions. The live edge can be cached in memory for a given duration.  
  
_Service configuration parameters used :_ `http` ( mandatory), `timeshift`, `mcache`, `gcache`, `keepalive` and `local`.  
  
Configuration for proxying while caching a live HTTP streaming service:  
```
{ "http": "https://test.com/dash/live.mpd", "timeshift": 30 }
```
  
  
Configuration for relay caching a live HTTP streaming service:  
```
{ "http": "https://test.com/dash/live.mpd", "timeshift": 30, "local": "/myservice/test.mpd"}
```
  
  
The `local` service configuration option can be set to:  

- the exposed server path, in which case manifest names are not rewritten  
- or the exposed manifest path, in which case manifest names are rewritten, but only one manifest can be exposed (does not work with dual MPD and M3U8 services)  

  
# Multicast ABR Gateway  
  
The server can be configured to use a multicast ABR source for an HTTP streaming service, without any HTTP source.  
  
_Service configuration parameters used :_ `mabr` (mandatory), `local` (mandatory), `corrupted`, `timeshift` and `keepalive`.  
  
The multicast source can be DVB-MABR (e.g. `mabr://235.0.0.1:1234/`), ATSC3.0 (e.g. `atsc://`) or ROUTE (e.g. `route://235.0.0.1:1234/`).  

- If the multicast is replayed from a file, netcap ID shall be set in this multicast URL (e.g. `:NCID=N`).  
- If a specific IP interface is used, it can also be set in multicast URL (e.g. `:ifce=IP`).  

  
For example, with `local` set to `/service/live.mpd` with `mabr` set, the server will expose the multicast service as `http://localhost/service/live.mpd`.  
The manifest name can be omitted, in which case the exact manifest name used in the broadcast shall be used (and known to the client).  
  
Configuration for exposing a MABR session:  
```
{ "mabr": "mabr://234.0.0.1:1234", "local": "/service1", "timeshift": 30 }
```
  
  
# Multicast ABR Gateway with HTTP cache  
  
The server can be configured to use a multicast source as an alternate data source of a given HTTP streaming service.  
  
_Service configuration parameters used :_ `http` (mandatory), `mabr` (mandatory), `local`, `corrupted`, `timeshift`, `repair`, `gcache`, `mcache`, `unload`, `activate`, `keepalive` and `js`.  
  
The multicast service can be dynamically loaded at run-time using the `unload` service configuration option:  

- if 0, the multicast is started when loading the server and never ended,  
- otherwise, the multicast is started dynamically and ended `unload` seconds after last deactivation.  

  
The qualities in the multicast service can be dynamically activated or deactivated using the `activate` service configuration option:  

- if 0, multicast streams are never deactivated,  
- otherwise, a multicast representation is activated only if at least `activate` clients are consuming it, and deactivated otherwise.  

  
The multicast service can use repair options of the MABR stack using `repair` service configuration option:  

- if false, the file will not be sent until completely received (this increases latency),  
- otherwise, file data will be pushed as soon as available in order (after reception or repair).  

  
If the `corrupted` option is set together with `repair`, HTTP-based repair is disabled and corrupted files are patched using the `repair=strict` mode of the `routein` filter.  
If files are completely lost, they will be fetched from `http`source.  

__Warning: This may likely result in decoding/buffering pipeline errors and could fail with some players expecting no timeline holes (such as browsers). GPAC supports this.__  
  
The number of active clients on a given quality is computed using the client connection state: any disconnect/reconnect from a client for the same quality will trigger a deactivate+activate sequence.  
If `check_ip` is set to true, the remote IP address+port are used instead of the connection. This however assumes that each client has a unique IP/port which may not always be true (NATs).  
  
If `timeshift` is 0 for the service, multicast segments will be trashed as soon as not in use (potentially before the client request).  
  
_Note: Manifest files coming from multicast are currently never cached._  
  
Configuration for caching a live HTTP streaming service with MABR backup:  
```
{ "http": "https://test.com/dash/live.mpd", "mabr": "mabr://234.0.0.1:1234", "timeshift": 30}
```
  
  
For such services, the custom HTTP header `X-From-MABR` is defined:  

- for client request, a value of `no` will disable MABR cache for this request; if absent or value is `yes`, MABR cache will be used if available  
- for client response, a value of `yes` indicates the content comes from the MABR cache; if absent or value is `no` or `off-edge`, the content comes from HTTP (`off-edge` indicates a request outside of the timeshift buffer)  

  
The dedicated root endpoint `/stats` returns, the response content type's count (`yes`, `no`, `off-edge`) served by the gateway.  
  
The `js` option can be set to a JS module exporting the following functions:  

- init : (mandatory) The function is called once at the start of the server. Parameters:  

    - scfg: the service configuration object  
    - return value: must be true if configuration and initialization are successful, false otherwise.  

  

- service_activation : (optional) The function is called when the service is activated or deactivated. Parameters:  

    - do_activate (boolean): if true, service is being loaded otherwise it is being unloaded  
    - return value: none  

  

- quality_activation : (optional) The function is called when the given quality is to be activated or deactivated. If not present, (de)activation always happens. Parameters (in order):  

    - do_activate (boolean): if true, quality is being activated otherwise it is being deactivated  
    - service_id (integer): ID of the service as announced in the multicast  
    - period_id (string): ID of the DASH Period, ignored (empty) for HLS  
    - adaptationSet_ID (integer): ID of the DASH AdaptationSet, ignored (-1) for HLS  
    - representation_ID (string): ID of the DASH representation or name of the HLS variant playlist  
    - return value: shall be true if activation/deactivation shall proceed and false if activation/deactivation shall be canceled.  

  

- get_mcast_address : (optional) The function is called when the service is activated. Parameters:  

    - service_url (string): URL of service for which the multicast adress is queried  
    - return value: shall be the multicast address to use for the service or null if no multicast is used (active multicast wil then be deactivated).  

  
# File Services  
  
A file system directory can be exposed as a service.  
  
_Service configuration parameters used :_ `local` (mandatory), `sources` (mandatory), `gcache` and `keepalive`.  
  
The `local` service configuration option must be set to the desired service path, and the `sources` service configuration option must one or more valid sources.  
Each source is either a file, a directory or a remote URL.  
  
Configuration for exposing a directory:  
```
{ "local": "/dserv/", "sources": [ { "name": "foo/", "url": "my_dir/" } ] }
```
  
This service will expose the content of directory `my_dir/*` as `http://localhost/dserv/foo/*`.  
  
In this mode, file serving is handled directly by httpout filter and no memory caching is used.  
If the source is a remote HTTP one, the `gcache` option will indicate if GPAC local cache shall be used.  
  
# Module development  
  
A JS module can be specified using the `js` option in the service configuration. The module export functions are:  

## init (mandatory)  
The function is called once at the start of the server  
Parameter: the service configuration object  
return value must be true if configuration and initialization are successful, false otherwise  
  
## resolve (mandatory)  
Parameter: an HTTP request object from GPAC  
  
The function returns an array of two values `[result, delay]`:  

- result: null if error, a resolved string indicating either a local file or the reply body, or an object  
- delay: if true, the reply is being delayed by the module for later processing  

  
When an object is returned, the request is handled by the JS module in charge of sending the reply and reading the data. The object shall have the following properties:  

- read: same semantics as the request read method  
- on_close: optional function called when the request is closed  

  
# Built-in modules  
  
## Source Remultiplexer  
Module is loaded when using `js=remux`  
  
This module remultiplexes the source files in a desired format without transcoding.  
  
_Service configuration parameters used :_ `local` (mandatory), `sources` (mandatory).  
  
_Service configuration additional parameters_  

- fmt: default format to use (default is mp4). Supported formats are:  

    - `src`: no remultiplexing  
    - `mp4`: fragmented MP4  
    - `ts`: MPEG-2 TS  
    - `gsf`: GPAC streaming format  
    - `dash`: MPEG-DASH format, single quality  
    - `hls`: HLS format, single quality  

  
Sources are described using the `sources` array in the service configuration.  
  
CGI parameters for request are:  

- fmt: (string, same as service configuration `fmt`) multiplexing format. If set to `src`, all other CGI parameters are ignored.  
- start: (number, default 0) start time in second of re-multiplexed content.  
- speed: (number, default 1) speed (>=0), keep video stream only and remove non SAP frames.  
- media: (string, default `av`) media filtering type  

    - 'av': keep both audio and video  
    - 'a': keep only audio  
    - 'v': keep only video  

  
Configuration for serving a directory with remultiplexing to mp4:  
```
{"local": "/service1/", "js": "remux", "sources": [{"name": "vids", "url": "/path/to/vids/"}], "fmt": "mp4"}
```
  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="scfg" data-level="basic">__scfg__</a> (str): service configuration file  
</div>  
<div markdown class="option">  
<a id="quit" data-level="basic">__quit__</a> (bool, default: _false_): exit server once last service has been deactivated  
</div>  
  
