<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# pipe input  
  
Register name used to load filter: __pin__  
This filter may be automatically loaded during graph resolution.  
  
This filter handles generic input pipes (mono-directional) in blocking or non blocking mode.  

__Warning: Input pipes cannot seek.__  
  
Data format of the pipe may be specified using extension (either in file name or through [ext](#ext)) or MIME type through [mime](#mime).  
_Note: Unless disabled at session level (see [-no-probe](core_options/#no-probe) ), file extensions are usually ignored and format probing is done on the first data block._  
  
# stdin pipe  
  
The filter can handle reading from stdin, by using `-` or `stdin` as input file name.  
Example
```
gpac -i - vout  
gpac -i stdin vout
```
  
  
# Named pipes  
  
The filter can handle reading from named pipes. The associated protocol scheme is `pipe://` when loaded as a generic input (e.g. `-i pipe://URL` where URL is a relative or absolute pipe name).  
On Windows hosts, the default pipe prefix is `\\.\pipe\gpac\` if no prefix is set.  
`dst=mypipe` resolves in `\\.\pipe\gpac\mypipe`  
`dst=\\.\pipe\myapp\mypipe` resolves in `\\.\pipe\myapp\mypipe`  
Any destination name starting with `\\` is used as is, with `\` translated in `/`.  
  
Input pipes are created by default in non-blocking mode.  
  
The filter can create the pipe if not found using [mkp](#mkp). On windows hosts, this will create a pipe server.  
On non windows hosts, the created pipe will delete the pipe file upon filter destruction.  
    
Input pipes can be setup to run forever using [ka](#ka). In this case:  

- any potential pipe close on the writing side will be ignored  
- pipeline flushing will be triggered upon pipe close if [sigflush](#sigflush) is set  
- final end of stream will be triggered upon session close.  

    
This can be useful to pipe raw streams from different process into gpac:  

- Receiver side: `gpac -i pipe://mypipe:ext=.264:mkp:ka`  
- Sender side: `cat raw1.264 > mypipe && gpac -i raw2.264 -o pipe://mypipe:ext=.264`    

The pipeline flush is signaled as EOS while keeping the stream active.  
This is typically needed for mux filters waiting for EOS to flush their data.  
    
If [marker](#marker) is set, the following strings (all 8-bytes with ``  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): name of source pipe  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _5000_): buffer size used to read pipe  
</div>  
<div markdown class="option">  
<a id="ext" data-level="basic">__ext__</a> (str): indicate file extension of pipe data  
</div>  
<div markdown class="option">  
<a id="mime" data-level="basic">__mime__</a> (str): indicate mime type of pipe data  
</div>  
<div markdown class="option">  
<a id="blk">__blk__</a> (bool, default: _false_): open pipe in block mode  
</div>  
<div markdown class="option">  
<a id="ka">__ka__</a> (bool, default: _false_): keep-alive pipe when end of input is detected  
</div>  
<div markdown class="option">  
<a id="mkp" data-level="basic">__mkp__</a> (bool, default: _false_): create pipe if not found  
</div>  
<div markdown class="option">  
<a id="sigflush">__sigflush__</a> (bool, default: _false_): signal end of stream upon pipe close - cf filter help  
</div>  
<div markdown class="option">  
<a id="marker">__marker__</a> (bool, default: _false_): inspect payload for flush and reconfigure signals - cf filter help  
</div>  
<div markdown class="option">  
<a id="bpcnt">__bpcnt__</a> (uint, default: _0_): number of broken pipe allowed before exiting, 0 means forever  
</div>  
<div markdown class="option">  
<a id="timeout">__timeout__</a> (uint, default: _0_): timeout in ms before considering input is in end of stream (0: no timeout)  
</div>  
  
