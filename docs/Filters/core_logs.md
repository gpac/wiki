<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->
# GPAC Log System

# libgpac logs options:  
  
<a id="noprog">__-noprog__</a>: disable progress messages  
<a id="quiet">__-quiet__</a>:  disable all messages, including errors  
<a id="log-file">__-log-file__</a>,__-lf__ (string): set output log file  
<a id="log-clock">__-log-clock__</a>,__-lc__: log time in micro sec since start time of GPAC before each log line except for `app` tool  
<a id="log-utc">__-log-utc__</a>,__-lu__: log UTC time in ms before each log line except for `app` tool  
<a id="logs">__-logs__</a> (string): set log tools and levels.    
    
You can independently log different tools involved in a session.    
log_args is formatted as a colon (':') separated list of `toolX[:toolZ]@levelX`    
`levelX` can be one of:  
* quiet: skip logs  
* error: logs only error messages  
* warning: logs error+warning messages  
* info: logs error+warning+info messages  
* debug: logs all messages  
  
`toolX` can be one of:  
* core: libgpac core  
* mutex: log all mutex calls  
* mem: GPAC memory tracker  
* module: GPAC modules (av out, font engine, 2D rasterizer)  
* filter: filter session debugging  
* sched: filter session scheduler debugging  
* codec: codec messages (used by encoder and decoder filters)  
* coding: bitstream formats (audio, video, scene)  
* container: container formats (ISO File, MPEG-2 TS, AVI, ...) and multiplexer/demultiplexer filters  
* network: TCP/UDP sockets and TLS  
* http: HTTP traffic  
* cache: HTTP cache subsystem  
* rtp: RTP traffic  
* dash: HTTP streaming logs  
* route: ROUTE (ATSC3) debugging  
* media: messages from generic filters and reframer/rewriter filters  
* parser: textual parsers (svg, xmt, bt, ...)  
* mmio: I/O management (AV devices, file, pipes, OpenGL)  
* audio: audio renderer/mixer/output  
* script: script engine except console log  
* console: script console log  
* scene: scene graph and scene manager  
* compose: composition engine (2D, 3D, etc)  
* ctime: media and SMIL timing info from composition engine  
* interact: interaction messages (UI events and triggered DOM events and VRML route)  
* rti: run-time stats of compositor  
* all: all tools logged - other tools can be specified afterwards.    
The special keyword `ncl` can be set to disable color logs.    
The special keyword `strict` can be set to exit at first error.    
  
Example
```
-logs=all@info:dash@debug:ncl
```  
This moves all log to info level, dash to debug level and disable color logs  
  
<a id="proglf">__-proglf__</a>: use new line at each progress messages  
<a id="log-dual">__-log-dual__</a>,__-ld__: output to both file and stderr  
