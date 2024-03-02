<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# pipe output  
  
Register name used to load filter: __pout__  
This filter may be automatically loaded during graph resolution.  
  
This filter handles generic output pipes (mono-directional) in blocking mode only.  

__Warning: Output pipes do not currently support non blocking mode.__  
  
The associated protocol scheme is `pipe://` when loaded as a generic output (e.g. -o `pipe://URL` where URL is a relative or absolute pipe name).  
Data format of the pipe __shall__ be specified using extension (either in filename or through [ext](#ext) option) or MIME type through [mime](#mime)  
The pipe name indicated in [dst](#dst) can use template mechanisms from gpac, e.g. `dst=pipe_$ServiceID$`  
  
On Windows hosts, the default pipe prefix is `\\.\pipe\gpac\` if no prefix is set   
`dst=mypipe` resolves in `\\.\pipe\gpac\mypipe`  
`dst=\\.\pipe\myapp\mypipe` resolves in `\\.\pipe\myapp\mypipe`  
Any destination name starting with `\\` is used as is, with `\` translated in `/`  
  
The pipe input can create the pipe if not found using [mkp](#mkp). On windows hosts, this will create a pipe server.  
On non windows hosts, the created pipe will delete the pipe file upon filter destruction.  
The pipe can be kept alive after a broken pipe is detected using [ka](#ka). This is typically used when clients crash/exits and resumes.  
When a keep-alive pipe is broken, input data is discarded and the filter will keep trashing data as fast as possible.  
It is therefore recommended to use this mode with real-time inputs (use a [reframer](reframer) if needed).  
If [marker](#marker) is set, the string `GPACPIF` (8 bytes including 0-terminator) will be written to the pipe at each detected pipeline flush.  
Pipeline flushing is currently triggered by DASH segment end or ISOBMF fragment end.  
  

# Options    
  
<a id="dst">__dst__</a> (cstr): name of destination pipe  
<a id="ext">__ext__</a> (str): indicate file extension of pipe data  
<a id="mime">__mime__</a> (str): indicate mime type of pipe data  
<a id="dynext">__dynext__</a> (bool, default: _false_): indicate the file extension is set by filter chain, not dst  
<a id="start">__start__</a> (dbl, default: _0.0_): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
<a id="speed">__speed__</a> (dbl, default: _1.0_): set playback speed. If negative and start is 0, start is set to -1  
<a id="mkp">__mkp__</a> (bool, default: _false_): create pipe if not found  
<a id="block_size">__block_size__</a> (uint, default: _5000_): buffer size used to write to pipe, Windows only  
<a id="ka">__ka__</a> (bool, default: _false_): keep pipe alive when broken pipe is detected  
<a id="marker">__marker__</a> (bool, default: _false_): inject marker upon pipeline flush events  
  
