<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFmpeg demultiplexer  
  
Register name used to load filter: __ffdmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter demultiplexes an input file or open a source protocol using FFmpeg.  
See FFmpeg documentation (https://ffmpeg.org/documentation.html) for more details.  
To list all supported demultiplexers for your GPAC build, use `gpac -h ffdmx:*`.  
This will list both supported input formats and protocols.  
Input protocols are listed with `Description: Input protocol`, and the subclass name identifies the protocol scheme.  
For example, if `ffdmx:rtmp` is listed as input protocol, this means `rtmp://` source URLs are supported.  
  
# Raw protocol mode  
  
The [proto](#proto) flag will disable FFmpeg demuxer and use GPAC instead. Default format is probed from initial data but can be set using [ext](#ext) or [mime](#mime) if probing is disabled.  
Example
```
gpac -i srt://127.0.0.1:1234:gpac:proto inspectThis will use the SRT protocol handler but GPAC demultiplexer
```
  
  
In this mode, the filter uses the time between the last two received packets to estimates how often it should check for inputs. The maximum and minimum times to wait between two calls is given by the [mwait](#mwait) option. The maximum time may need to be reduced for very high bitrates sources.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): URL of source content  
</div>  
<div markdown class="option">  
<a id="reparse" data-level="basic">__reparse__</a> (bool, default: _false_): force reparsing of stream content (AVC,HEVC,VVC,AV1 only for now)  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _4096_): block size used to read file when using GFIO context  
</div>  
<div markdown class="option">  
<a id="strbuf_min">__strbuf_min__</a> (uint, default: _1MB_): internal buffer size when demuxing from GPAC's input stream  
</div>  
<div markdown class="option">  
<a id="proto">__proto__</a> (bool, default: _false_): use protocol handler only and bypass FFmpeg demuxer  
</div>  
<div markdown class="option">  
<a id="mwait">__mwait__</a> (v2di, default: _1x30_): set min and max wait times in ms to avoid too frequent polling in proto mode  
</div>  
<div markdown class="option">  
<a id="ext" data-level="basic">__ext__</a> (str): indicate file extension of data in raw protocol mode  
</div>  
<div markdown class="option">  
<a id="mime" data-level="basic">__mime__</a> (str): indicate mime type of data in raw protocol mode  
</div>  
<div markdown class="option">  
<a id="*" data-level="basic">__*__</a> (str): any possible options defined for AVFormatContext and sub-classes. See `gpac -hx ffdmx` and `gpac -hx ffdmx:*`  
</div>  
  
