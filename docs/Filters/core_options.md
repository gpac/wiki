<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->
# GPAC Core Options

# libgpac core options:  
  
<a id="noprog">__-noprog__</a>: disable progress messages  
<a id="quiet">__-quiet__</a>:  disable all messages, including errors  
<a id="proglf">__-proglf__</a>: use new line at each progress messages  
<a id="strict-error">__-strict-error__</a>,__-se__: exit after the first error is reported  
<a id="store-dir">__-store-dir__</a> (string): set storage directory  
<a id="mod-dirs">__-mod-dirs__</a> (string list): set additional module directories as a semi-colon `;` separated list  
<a id="js-dirs">__-js-dirs__</a> (string list): set javascript directories  
<a id="no-js-mods">__-no-js-mods__</a> (string list): disable javascript module loading  
<a id="ifce">__-ifce__</a> (string): set default multicast interface (default is ANY), either an IP address or a device name as listed by `gpac -h net`. Prefix '+' will force using IPv6 for dual interface  
<a id="lang">__-lang__</a> (string): set preferred language  
<a id="cfg">__-cfg__</a>,__-opt__ (string): get or set configuration file value. The string parameter can be formatted as:  
* `section:key=val`: set the key to a new value  
* `section:key=null`, `section:key`: remove the key  
* `section=null`: remove the section  
* no argument: print the entire configuration file  
* `section`: print the given section  
* `section:key`: print the given `key` in `section` (section can be set to `*`)- `*:key`: print the given `key` in all sections  
  
<a id="no-save">__-no-save__</a>: discard any changes made to the config file upon exit  
<a id="mod-reload">__-mod-reload__</a>: unload / reload module shared libs when no longer used  
<a id="for-test">__-for-test__</a>: disable all creation/modification dates and GPAC versions in files  
<a id="old-arch">__-old-arch__</a>: enable compatibility with pre-filters versions of GPAC  
<a id="ntp-shift">__-ntp-shift__</a> (int): shift NTP clock by given amount in seconds  
<a id="bs-cache-size">__-bs-cache-size__</a> (int, default: __512__): cache size for bitstream read and write from file (0 disable cache, slower IOs)  
<a id="no-check">__-no-check__</a>: disable compliance tests for inputs (ISOBMFF for now). This will likely result in random crashes  
<a id="unhandled-rejection">__-unhandled-rejection__</a>: dump unhandled promise rejections  
<a id="startup-file">__-startup-file__</a> (string): startup file of compositor in GUI mode  
<a id="docs-dir">__-docs-dir__</a> (string): default documents directory (for GUI on iOS and Android)  
<a id="last-dir">__-last-dir__</a> (string): last working directory (for GUI)  
<a id="no-poll">__-no-poll__</a>: disable poll and use select for socket groups  
<a id="no-tls-rcfg">__-no-tls-rcfg__</a>: disable automatic TCP to TLS reconfiguration  
<a id="no-fd">__-no-fd__</a>:  use buffered IO instead of file descriptor for read/write - this can speed up operations on small files  
  
<a id="no-mx">__-no-mx__</a>:  disable all mutexes, threads and semaphores (do not use if unsure about threading used)  
<a id="netcap">__-netcap__</a> (string): set packet capture and filtering rules formatted as [CFG][RULES]. Each `-netcap` argument will define a configuration  
[CFG] is an optional comma-separated list of:  
* id=ID: ID (string) for this configuration. If NULL, configuration will apply to all sockets not specifying a netcap ID  
* src=F: read packets from `F`, as produced by GPAC or a pcap or pcapng file  
* dst=F: output packets to `F` (no pcap/pcapng support), cannot be set if src is set  
* loop[=N]: loop capture file N times, or forever if N is not set or negative  
* nrt: disable real-time playback  
[RULES] is an optional list of `[OPT,OPT2...]` with OPT in:  
* m=N: set rule mode - `N` can be `r` for reception only (default), `w` for send only or `rw` for both  
* s=N: set packet start range to `N`  
* e=N: set packet end range to `N` (only used for `r` and `f` rules)  
* n=N: set number of packets to drop to `N` - not set, 0 or 1 means single packet  
* r=N: random drop one packet every `N`  
* f=N: drop first packet every `N`  
* p=P: local port number to filter, if not set the rule applies to all packets  
* o=N: patch packet instead of droping (always true for TCP), replacing byte at offset `N` (0 is first byte, <0 for random)  
* v=N: set patch byte value to `N` (hexa) or negative value for random (default)  
  
Example
```
-netcap=dst=dump.gpc
```  
This will record packets to dump.gpc  
  
Example
```
-netcap=src=dump.gpc,id=NC1 -i session1.sdp:NCID=NC1 -i session2.sdp
```  
This will read packets from dump.gpc only for session1.sdp and let session2.sdp use regular sockets  
  
Example
```
-netcap=[p=1234,s=100,n=20][r=200,s=500,o=10,v=FE]
```  
This will use regular network interface and drop packets 100 to 119 on port 1234 and patch one random packet every 200 starting from packet 500, setting byte 10 to FE  
  
<a id="cache">__-cache__</a> (string): cache directory location  
<a id="proxy-on">__-proxy-on__</a>: enable HTTP proxy  
<a id="proxy-name">__-proxy-name__</a> (string): set HTTP proxy address  
<a id="proxy-port">__-proxy-port__</a> (int, default: __80__): set HTTP proxy port  
<a id="maxrate">__-maxrate__</a> (int): set max HTTP download rate in bits per sec. 0 means unlimited  
<a id="no-cache">__-no-cache__</a>: disable HTTP caching  
<a id="offline-cache">__-offline-cache__</a>: enable offline HTTP caching (no re-validation of existing resource in cache)  
<a id="clean-cache">__-clean-cache__</a>: indicate if HTTP cache should be clean upon launch/exit  
<a id="cache-size">__-cache-size__</a> (int, default: __100M__): specify cache size in bytes  
<a id="tcp-timeout">__-tcp-timeout__</a> (int, default: __5000__): time in milliseconds to wait for HTTP/RTSP connect before error  
<a id="req-timeout">__-req-timeout__</a> (int, default: __10000__): time in milliseconds to wait on HTTP/RTSP request before error (0 disables timeout)  
<a id="no-timeout">__-no-timeout__</a>: ignore HTTP 1.1 timeout in keep-alive  
<a id="broken-cert">__-broken-cert__</a>: enable accepting broken SSL certificates  
<a id="user-agent">__-user-agent__</a>,__-ua__ (string): set user agent name for HTTP/RTSP  
<a id="user-profileid">__-user-profileid__</a> (string): set user profile ID (through __X-UserProfileID__ entity header) in HTTP requests  
<a id="user-profile">__-user-profile__</a> (string): set user profile filename. Content of file is appended as body to HTTP HEAD/GET requests, associated Mime is __text/xml__  
<a id="query-string">__-query-string__</a> (string): insert query string (without `?`) to URL on requests  
<a id="dm-threads">__-dm-threads__</a>: force using threads for async download requests rather than session scheduler  
<a id="cte-rate-wnd">__-cte-rate-wnd__</a> (int, default: __20__): set window analysis length in milliseconds for chunk-transfer encoding rate estimation  
<a id="cred">__-cred__</a> (string): path to 128 bits key for credential storage  
<a id="no-h2">__-no-h2__</a>:  disable HTTP2  
<a id="no-h2c">__-no-h2c__</a>: disable HTTP2 upgrade (i.e. over non-TLS)  
<a id="h2-copy">__-h2-copy__</a>: enable intermediate copy of data in nghttp2 (default is disabled but may report as broken frames in wireshark)  
<a id="dbg-edges">__-dbg-edges__</a>: log edges status in filter graph before dijkstra resolution (for debug). Edges are logged as edge_source(status, weight, src_cap_idx, dst_cap_idx)  
<a id="full-link">__-full-link__</a>: throw error if any PID in the filter graph cannot be linked  
<a id="no-dynf">__-no-dynf__</a>: disable dynamically loaded filters  
<a id="no-block">__-no-block__</a> (Enum, default: __no__): disable blocking mode of filters  
* no: enable blocking mode  
* fanout: disable blocking on fan-out, unblocking the PID as soon as one of its destinations requires a packet  
* all: disable blocking  
  
<a id="no-reg">__-no-reg__</a>: disable regulation (no sleep) in session  
<a id="no-reassign">__-no-reassign__</a>: disable source filter reassignment in PID graph resolution  
<a id="sched">__-sched__</a> (Enum, default: __free__): set scheduler mode  
* free: lock-free queues except for task list (default)  
* lock: mutexes for queues when several threads  
* freex: lock-free queues including for task lists (experimental)  
* flock: mutexes for queues even when no thread (debug mode)  
* direct: no threads and direct dispatch of tasks whenever possible (debug mode)  
  
<a id="max-chain">__-max-chain__</a> (int, default: __6__): set maximum chain length when resolving filter links. Default value covers for _[ in -> ] dmx -> reframe -> decode -> encode -> reframe -> mx [ -> out]_. Filter chains loaded for adaptation (e.g. pixel format change) are loaded after the link resolution. Setting the value to 0 disables dynamic link resolution. You will have to specify the entire chain manually  
<a id="max-sleep">__-max-sleep__</a> (int, default: __50__): set maximum sleep time slot in milliseconds when regulation is enabled  
<a id="threads">__-threads__</a> (int): set N extra thread for the session. -1 means use all available cores  
<a id="no-probe">__-no-probe__</a>: disable data probing on sources and relies on extension (faster load but more error-prone)  
<a id="no-argchk">__-no-argchk__</a>: disable tracking of argument usage (all arguments will be considered as used)  
<a id="blacklist">__-blacklist__</a> (string): blacklist the filters listed in the given string (comma-separated list). If first character is '-', this is a whitelist, i.e. only filters listed in the given string will be allowed  
<a id="no-graph-cache">__-no-graph-cache__</a>: disable internal caching of filter graph connections. If disabled, the graph will be recomputed at each link resolution (lower memory usage but slower)  
<a id="no-reservoir">__-no-reservoir__</a>: disable memory recycling for packets and properties. This uses much less memory but stresses the system memory allocator much more  
<a id="buffer-gen">__-buffer-gen__</a> (int, default: __1000__): default buffer size in microseconds for generic pids  
<a id="buffer-dec">__-buffer-dec__</a> (int, default: __1000000__): default buffer size in microseconds for decoder input pids  
<a id="buffer-units">__-buffer-units__</a> (int, default: __1__): default buffer size in frames when timing is not available  
<a id="gl-bits-comp">__-gl-bits-comp__</a> (int, default: __8__): number of bits per color component in OpenGL  
<a id="gl-bits-depth">__-gl-bits-depth__</a> (int, default: __16__): number of bits for depth buffer in OpenGL  
<a id="gl-doublebuf">__-gl-doublebuf__</a>: enable OpenGL double buffering  
<a id="glfbo-txid">__-glfbo-txid__</a> (int): set output texture ID when using `glfbo` output. The OpenGL context shall be initialized and gf_term_process shall be called with the OpenGL context active  
<a id="video-output">__-video-output__</a> (string): indicate the name of the video output module to use (see `gpac -h modules`). The reserved name `glfbo` is used in player mode to draw in the OpenGL texture identified by [glfbo-txid](#glfbo-txid).  In this mode, the application is responsible for sending event to the compositor  
<a id="audio-output">__-audio-output__</a> (string): indicate the name of the audio output module to use  
<a id="font-reader">__-font-reader__</a> (string): indicate name of font reader module  
<a id="font-dirs">__-font-dirs__</a> (string): indicate comma-separated list of directories to scan for fonts  
<a id="rescan-fonts">__-rescan-fonts__</a>: indicate the font directory must be rescanned  
<a id="wait-fonts">__-wait-fonts__</a>: wait for SVG fonts to be loaded before displaying frames  
<a id="webvtt-hours">__-webvtt-hours__</a>: force writing hour when serializing WebVTT  
<a id="charset">__-charset__</a> (string): set charset when not recognized from input. Possible values are:  
* utf8: force UTF-8  
* utf16: force UTF-16 little endian  
* utf16be: force UTF-16 big endian  
* other: attempt to parse anyway  
  
<a id="rmt">__-rmt__</a>:      enable profiling through [Remotery](https://github.com/Celtoys/Remotery). A copy of Remotery visualizer is in gpac/share/vis, usually installed in _/usr/share/gpac/vis_ or _Program Files/GPAC/vis_  
<a id="rmt-port">__-rmt-port__</a> (int, default: __17815__): set remotery port  
<a id="rmt-reuse">__-rmt-reuse__</a>: allow remotery to reuse port  
<a id="rmt-localhost">__-rmt-localhost__</a>: make remotery only accepts localhost connection  
<a id="rmt-sleep">__-rmt-sleep__</a> (int, default: __10__): set remotery sleep (ms) between server updates  
<a id="rmt-nmsg">__-rmt-nmsg__</a> (int, default: __10__): set remotery number of messages per update  
<a id="rmt-qsize">__-rmt-qsize__</a> (int, default: __131072__): set remotery message queue size in bytes  
<a id="rmt-log">__-rmt-log__</a>: redirect logs to remotery (experimental, usually not well handled by browser)  
<a id="rmt-ogl">__-rmt-ogl__</a>: make remotery sample opengl calls  
<a id="m2ts-vvc-old">__-m2ts-vvc-old__</a>: hack for old TS streams using 0x32 for VVC instead of 0x33  
<a id="piff-force-subsamples">__-piff-force-subsamples__</a>: hack for PIFF PSEC files generated by 0.9.0 and 1.0 MP4Box with wrong subsample_count inserted for audio  
<a id="vvdec-annexb">__-vvdec-annexb__</a>: hack for old vvdec+libavcodec supporting only annexB format  
<a id="heif-hevc-urn">__-heif-hevc-urn__</a>: use HEVC URN for alpha and depth in HEIF instead of MPEG-B URN (HEIF first edition)  
<a id="boxdir">__-boxdir__</a> (string): use box definitions in the given directory for XML dump  
