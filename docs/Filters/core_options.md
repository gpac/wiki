<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->
# GPAC Core Options

# libgpac core options:  
  
<div markdown class="option">
<a id="tmp" data-level="basic">__-tmp__</a> (string): specify directory for temporary file creation instead of OS-default temporary file management  
</div>
<div markdown class="option">
<a id="noprog">__-noprog__</a>: disable progress messages  
</div>
<div markdown class="option">
<a id="quiet">__-quiet__</a>:  disable all messages, including errors  
</div>
<div markdown class="option">
<a id="proglf">__-proglf__</a>: use new line at each progress messages  
</div>
<div markdown class="option">
<a id="strict-error">__-strict-error__</a>,__-se__: exit after the first error is reported  
</div>
<div markdown class="option">
<a id="store-dir">__-store-dir__</a> (string): set storage directory  
</div>
<div markdown class="option">
<a id="mod-dirs">__-mod-dirs__</a> (string list): set additional module directories as a semi-colon `;` separated list  
</div>
<div markdown class="option">
<a id="js-dirs">__-js-dirs__</a> (string list): set javascript directories  
</div>
<div markdown class="option">
<a id="no-js-mods">__-no-js-mods__</a> (string list): disable javascript module loading  
</div>
<div markdown class="option">
<a id="ifce" data-level="basic">__-ifce__</a> (string): set default multicast interface (default is ANY), either an IP address or a device name as listed by `gpac -h net`. Prefix '+' will force using IPv6 for dual interface  
</div>
<div markdown class="option">
<a id="lang" data-level="basic">__-lang__</a> (string): set preferred language  
</div>
<div markdown class="option">
<a id="cfg">__-cfg__</a>,__-opt__ (string): get or set configuration file value. The string parameter can be formatted as:  

- `section:key=val`: set the key to a new value  
- `section:key=null`, `section:key`: remove the key  
- `section=null`: remove the section  
- no argument: print the entire configuration file  
- `section`: print the given section  
- `section:key`: print the given `key` in `section` (section can be set to `*`)- `*:key`: print the given `key` in all sections  
</div>
  
<div markdown class="option">
<a id="no-save">__-no-save__</a>: discard any changes made to the config file upon exit  
</div>
<div markdown class="option">
<a id="mod-reload">__-mod-reload__</a>: unload / reload module shared libs when no longer used  
</div>
<div markdown class="option">
<a id="for-test">__-for-test__</a>: disable all creation/modification dates and GPAC versions in files  
</div>
<div markdown class="option">
<a id="old-arch">__-old-arch__</a>: enable compatibility with pre-filters versions of GPAC  
</div>
<div markdown class="option">
<a id="ntp-shift">__-ntp-shift__</a> (int): shift NTP clock by given amount in seconds  
</div>
<div markdown class="option">
<a id="bs-cache-size">__-bs-cache-size__</a> (int, default: __512__): cache size for bitstream read and write from file (0 disable cache, slower IOs)  
</div>
<div markdown class="option">
<a id="no-check">__-no-check__</a>: disable compliance tests for inputs (ISOBMFF for now). This will likely result in random crashes  
</div>
<div markdown class="option">
<a id="unhandled-rejection">__-unhandled-rejection__</a>: dump unhandled promise rejections  
</div>
<div markdown class="option">
<a id="startup-file">__-startup-file__</a> (string): startup file of compositor in GUI mode  
</div>
<div markdown class="option">
<a id="docs-dir">__-docs-dir__</a> (string): default documents directory (for GUI on iOS and Android)  
</div>
<div markdown class="option">
<a id="last-dir">__-last-dir__</a> (string): last working directory (for GUI)  
</div>
<div markdown class="option">
<a id="no-poll">__-no-poll__</a>: disable poll and use select for socket groups  
</div>
<div markdown class="option">
<a id="no-tls-rcfg">__-no-tls-rcfg__</a>: disable automatic TCP to TLS reconfiguration  
</div>
<div markdown class="option">
<a id="no-fd">__-no-fd__</a>:  use buffered IO instead of file descriptor for read/write - this can speed up operations on small files  
</div>
  
<div markdown class="option">
<a id="no-mx">__-no-mx__</a>:  disable all mutexes, threads and semaphores (do not use if unsure about threading used)  
</div>
<div markdown class="option">
<a id="xml-max-csize">__-xml-max-csize__</a> (int, default: __100k__): maximum XML content or attribute size  
</div>
<div markdown class="option">
<a id="users">__-users__</a> (string): authentication configuration file for users and groups  
</div>
<div markdown class="option">
<a id="netcap">__-netcap__</a> (string): set packet capture and filtering rules formatted as [CFG][RULES]. Each `-netcap` argument will define a configuration  
[CFG] is an optional comma-separated list of:  

- id=ID: ID (string) for this configuration. If NULL, configuration will apply to all sockets not specifying a netcap ID  
- src=F: read packets from `F`, as produced by GPAC or a pcap or pcapng file  
- dst=F: output packets to `F` (GPAC or pcap/pcapng file), cannot be set if src is set  
- loop[=N]: loop capture file N times, or forever if N is not set or negative  
- nrt: disable real-time playback  

[RULES] is an optional list of `[OPT,OPT2...]` with OPT in:  

- m=K: set rule mode - `K` can be `r` for reception only (default), `w` for send only or `rw` for both  
- s=K: set packet start range to `K`  
- e=K: set packet end range to `K` - only used for `r` and `f` rules, 0 or not set means rule apply until end  
- n=K: set number of packets to drop to `K` - not set, 0 or 1 means single packet  
- r=K: random drop `n` packet every `K`  
- f=K: drop first `n` packets every `K`  
- d=K: reorder `n` packets after the next `K` packets, can be used with `f` or `r` rules  
- p=K: filter packets on port `K` only, if not set the rule applies to all packets  
- o=K: patch packet instead of dropping (always true for TCP), replacing byte at offset `K` (0 is first byte, <0 for random)  
- v=K: set patch byte value to `K` (hexa) or negative value for random (default)  
- S=K: same as `s` but adds number of capture file reload/loop  
- E=K: same as `e` but adds number of capture file reload/loop  

  
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
</div>
  
<div markdown class="option">
<a id="cache">__-cache__</a> (string): cache directory location  
</div>
<div markdown class="option">
<a id="proxy">__-proxy__</a> (string): set HTTP proxy server address and port (if no protocol scheme is set, use same as target)  
</div>
<div markdown class="option">
<a id="maxrate">__-maxrate__</a> (int): set max HTTP download rate in bits per sec. 0 means unlimited  
</div>
<div markdown class="option">
<a id="no-cache">__-no-cache__</a>: disable HTTP caching  
</div>
<div markdown class="option">
<a id="offline-cache">__-offline-cache__</a>: enable offline HTTP caching (no re-validation of existing resource in cache)  
</div>
<div markdown class="option">
<a id="clean-cache" data-level="basic">__-clean-cache__</a>: indicate if HTTP cache should be clean upon launch/exit  
</div>
<div markdown class="option">
<a id="cache-size">__-cache-size__</a> (int, default: __100M__): specify maximum cache size on disk in bytes  
</div>
<div markdown class="option">
<a id="cache-check">__-cache-check__</a> (int, default: __60__): cache clean interval in seconds, 0 only clean cache at startup  
</div>
<div markdown class="option">
<a id="tcp-timeout">__-tcp-timeout__</a> (int, default: __5000__): time in milliseconds to wait for HTTP/RTSP connect before error  
</div>
<div markdown class="option">
<a id="req-timeout">__-req-timeout__</a> (int, default: __10000__): time in milliseconds to wait on HTTP/RTSP request before error (0 disables timeout)  
</div>
<div markdown class="option">
<a id="no-timeout">__-no-timeout__</a>: ignore HTTP 1.1 timeout in keep-alive  
</div>
<div markdown class="option">
<a id="broken-cert">__-broken-cert__</a>: enable accepting broken SSL certificates  
</div>
<div markdown class="option">
<a id="ca-bundle">__-ca-bundle__</a> (string): path to a custom CA certificates bundle file  
</div>
<div markdown class="option">
<a id="user-agent">__-user-agent__</a>,__-ua__ (string): set user agent name for HTTP/RTSP  
</div>
<div markdown class="option">
<a id="user-profileid">__-user-profileid__</a> (string): set user profile ID (through __X-UserProfileID__ entity header) in HTTP requests  
</div>
<div markdown class="option">
<a id="user-profile">__-user-profile__</a> (string): set user profile filename. Content of file is appended as body to HTTP HEAD/GET requests, associated Mime is __text/xml__  
</div>
<div markdown class="option">
<a id="query-string">__-query-string__</a> (string): insert query string (without `?`) to URL on requests  
</div>
<div markdown class="option">
<a id="dm-threads">__-dm-threads__</a>: force using threads for async download requests rather than session scheduler  
</div>
<div markdown class="option">
<a id="cte-rate-wnd">__-cte-rate-wnd__</a> (int, default: __20__): set window analysis length in milliseconds for chunk-transfer encoding rate estimation  
</div>
<div markdown class="option">
<a id="cred">__-cred__</a> (string): path to 128 bits key for credential storage  
</div>
<div markdown class="option">
<a id="no-h2">__-no-h2__</a>:  disable HTTP2  
</div>
<div markdown class="option">
<a id="no-h2c">__-no-h2c__</a>: disable HTTP2 upgrade (i.e. over non-TLS)  
</div>
<div markdown class="option">
<a id="h2-copy">__-h2-copy__</a>: enable intermediate copy of data in nghttp2 (default is disabled but may report as broken frames in wireshark)  
</div>
<div markdown class="option">
<a id="curl">__-curl__</a>:    use CURL instead of GPAC HTTP stack  
</div>
<div markdown class="option">
<a id="h3">__-h3__</a> (Enum, default: __auto__): set HTTP/3 mode  

- no: disable HTTP/3  
- first: force trying first with HTTP/3  
- auto: connect using HTTP 1 or 2 and use HTTP/3 for next request(s) if announced  
- only: only use HTTP/3  
</div>
  
<div markdown class="option">
<a id="dbg-edges">__-dbg-edges__</a>: log edges status in filter graph before dijkstra resolution (for debug). Edges are logged as edge_source(status(disable_depth), weight, src_cap_idx -> dst_cap_idx)  
</div>
<div markdown class="option">
<a id="full-link">__-full-link__</a>: throw error if any PID in the filter graph cannot be linked  
</div>
<div markdown class="option">
<a id="no-dynf">__-no-dynf__</a>: disable dynamically loaded filters  
</div>
<div markdown class="option">
<a id="no-block">__-no-block__</a> (Enum, default: __no__): disable blocking mode of filters  

- no: enable blocking mode  
- fanout: disable blocking on fan-out, unblocking the PID as soon as one of its destinations requires a packet  
- all: disable blocking  
</div>
  
<div markdown class="option">
<a id="no-reg">__-no-reg__</a>: disable regulation (no sleep) in session  
</div>
<div markdown class="option">
<a id="no-reassign">__-no-reassign__</a>: disable source filter reassignment in PID graph resolution  
</div>
<div markdown class="option">
<a id="sched">__-sched__</a> (Enum, default: __free__): set scheduler mode  

- free: lock-free queues except for task list (default)  
- lock: mutexes for queues when several threads  
- freex: lock-free queues including for task lists (experimental)  
- flock: mutexes for queues even when no thread (debug mode)  
- direct: no threads and direct dispatch of tasks whenever possible (debug mode)  
</div>
  
<div markdown class="option">
<a id="max-chain">__-max-chain__</a> (int, default: __6__): set maximum chain length when resolving filter links. Default value covers for _[ in -> ] dmx -> reframe -> decode -> encode -> reframe -> mx [ -> out]_. Filter chains loaded for adaptation (e.g. pixel format change) are loaded after the link resolution. Setting the value to 0 disables dynamic link resolution. You will have to specify the entire chain manually  
</div>
<div markdown class="option">
<a id="max-sleep">__-max-sleep__</a> (int, default: __50__): set maximum sleep time slot in milliseconds when regulation is enabled  
</div>
<div markdown class="option">
<a id="step-link">__-step-link__</a>: load filters one by one when solvink a link instead of loading all filters for the solved path  
</div>
<div markdown class="option">
<a id="threads">__-threads__</a> (int): set N extra thread for the session. -1 means use all available cores  
</div>
<div markdown class="option">
<a id="no-probe">__-no-probe__</a>: disable data probing on sources and relies on extension (faster load but more error-prone)  
</div>
<div markdown class="option">
<a id="no-argchk">__-no-argchk__</a>: disable tracking of argument usage (all arguments will be considered as used)  
</div>
<div markdown class="option">
<a id="blacklist">__-blacklist__</a> (string): blacklist the filters listed in the given string (comma-separated list). If first character is '-', this is a whitelist, i.e. only filters listed in the given string will be allowed  
</div>
<div markdown class="option">
<a id="no-graph-cache">__-no-graph-cache__</a>: disable internal caching of filter graph connections. If disabled, the graph will be recomputed at each link resolution (lower memory usage but slower)  
</div>
<div markdown class="option">
<a id="no-reservoir">__-no-reservoir__</a>: disable memory recycling for packets and properties. This uses much less memory but stresses the system memory allocator much more  
</div>
<div markdown class="option">
<a id="buffer-gen">__-buffer-gen__</a> (int, default: __1000__): default buffer size in microseconds for generic pids  
</div>
<div markdown class="option">
<a id="buffer-dec">__-buffer-dec__</a> (int, default: __1000000__): default buffer size in microseconds for decoder input pids  
</div>
<div markdown class="option">
<a id="buffer-units">__-buffer-units__</a> (int, default: __1__): default buffer size in frames when timing is not available  
</div>
<div markdown class="option">
<a id="check-props">__-check-props__</a>: check known property types upon assignment and PID vs packet types upon fetch (in test mode, exit with error code 5 if mismatch)  
</div>
<div markdown class="option">
<a id="gl-bits-comp">__-gl-bits-comp__</a> (int, default: __8__): number of bits per color component in OpenGL  
</div>
<div markdown class="option">
<a id="gl-bits-depth">__-gl-bits-depth__</a> (int, default: __16__): number of bits for depth buffer in OpenGL  
</div>
<div markdown class="option">
<a id="gl-doublebuf">__-gl-doublebuf__</a>: enable OpenGL double buffering  
</div>
<div markdown class="option">
<a id="glfbo-txid">__-glfbo-txid__</a> (int): set output texture ID when using `glfbo` output. The OpenGL context shall be initialized and gf_term_process shall be called with the OpenGL context active  
</div>
<div markdown class="option">
<a id="video-output">__-video-output__</a> (string): indicate the name of the video output module to use (see `gpac -h modules`). The reserved name `glfbo` is used in player mode to draw in the OpenGL texture identified by [glfbo-txid](#glfbo-txid).  In this mode, the application is responsible for sending event to the compositor  
</div>
<div markdown class="option">
<a id="audio-output">__-audio-output__</a> (string): indicate the name of the audio output module to use  
</div>
<div markdown class="option">
<a id="font-reader">__-font-reader__</a> (string): indicate name of font reader module  
</div>
<div markdown class="option">
<a id="font-dirs">__-font-dirs__</a> (string): indicate comma-separated list of directories to scan for fonts  
</div>
<div markdown class="option">
<a id="rescan-fonts">__-rescan-fonts__</a>: indicate the font directory must be rescanned  
</div>
<div markdown class="option">
<a id="wait-fonts">__-wait-fonts__</a>: wait for SVG fonts to be loaded before displaying frames  
</div>
<div markdown class="option">
<a id="webvtt-hours">__-webvtt-hours__</a>: force writing hour when serializing WebVTT  
</div>
<div markdown class="option">
<a id="charset">__-charset__</a> (string): set charset when not recognized from input. Possible values are:  

- utf8: force UTF-8  
- utf16: force UTF-16 little endian  
- utf16be: force UTF-16 big endian  
- other: attempt to parse anyway  
</div>
  
<div markdown class="option">
<a id="rmt">__-rmt__</a>:      enable remote monitoring webserver  
</div>
<div markdown class="option">
<a id="rmt-port">__-rmt-port__</a> (int, default: __6363__): set rmt ws port  
</div>
<div markdown class="option">
<a id="rmt-localhost">__-rmt-localhost__</a>: make rmt ws only accepts localhost connection  
</div>
<div markdown class="option">
<a id="rmt-sleep">__-rmt-sleep__</a> (int, default: __10__): set rmt ws sleep (ms) between server updates  
</div>
<div markdown class="option">
<a id="rmt-cert">__-rmt-cert__</a> (string): rmt ws: certificate file in PEM format to use for TLS mode  
</div>
<div markdown class="option">
<a id="rmt-pkey">__-rmt-pkey__</a> (string): rmt ws: private key file in PEM format to use for TLS mode  
</div>
<div markdown class="option">
<a id="m2ts-vvc-old">__-m2ts-vvc-old__</a>: hack for old TS streams using 0x32 for VVC instead of 0x33  
</div>
<div markdown class="option">
<a id="piff-force-subsamples">__-piff-force-subsamples__</a>: hack for PIFF PSEC files generated by 0.9.0 and 1.0 MP4Box with wrong subsample_count inserted for audio  
</div>
<div markdown class="option">
<a id="vvdec-annexb">__-vvdec-annexb__</a>: hack for old vvdec+libavcodec supporting only annexB format  
</div>
<div markdown class="option">
<a id="heif-hevc-urn">__-heif-hevc-urn__</a>: use HEVC URN for alpha and depth in HEIF instead of MPEG-B URN (HEIF first edition)  
</div>
<div markdown class="option">
<a id="boxdir">__-boxdir__</a> (string): use box definitions in the given directory for XML dump  
</div>
<div markdown class="option">
<a id="no-mabr-patch">__-no-mabr-patch__</a>: disable GPAC parsing of patched isom boxes from mabr (will behave like most browsers/players)  
</div>
