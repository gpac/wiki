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
<a id="*" data-level="basic">__*__</a> (str): any possible options defined for AVFormatContext and sub-classes. See `gpac -hx ffdmx` and `gpac -hx ffdmx:*`  
</div>  
  
