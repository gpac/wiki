<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFmpeg multiplexer  
  
Register name used to load filter: __ffmx__  
This filter may be automatically loaded during graph resolution.  
  
Multiplexes files and open output protocols using FFmpeg.  
See FFmpeg documentation (https://ffmpeg.org/documentation.html) for more details.  
To list all supported multiplexers for your GPAC build, use `gpac -h ffmx:*`.This will list both supported output formats and protocols.  
Output protocols are listed with `Description: Output protocol`, and the subclass name identifies the protocol scheme.  
For example, if `ffmx:rtmp` is listed as output protocol, this means `rtmp://` destination URLs are supported.  
  
Some URL formats may not be sufficient to derive the multiplexing format, you must then use [ffmt](#ffmt) to specify the desired format.  
  
Unlike other multiplexing filters in GPAC, this filter is a sink filter and does not produce any PID to be redirected in the graph.  
The filter can however use template names for its output, using the first input PID to resolve the final name.  
The filter watches the property `FileNumber` on incoming packets to create new files.  
  
All PID properties prefixed with `meta:` will be added as metadata.  
  
The [proto](#proto) flag will disable FFmpeg muxer and use GPAC instead. Default format is MPEG-2 TS and can be specified using [ext](#ext) or [mime](#mime).  
Example
```
gpac -i SRC -o srt://127.0.0.1:1234:gpac:proto[:ext=mp4:frag]This will use the SRT protocol handler but GPAC m2ts multiplexer or mp4 muxer if `ext=mp4:frag` is set
```
  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="dst" data-level="basic">__dst__</a> (cstr): location of destination file or remote URL  
</div>  
<div markdown class="option">  
<a id="start" data-level="basic">__start__</a> (dbl, default: _0.0_): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
</div>  
<div markdown class="option">  
<a id="speed" data-level="basic">__speed__</a> (dbl, default: _1.0_): set playback speed. If negative and start is 0, start is set to -1  
</div>  
<div markdown class="option">  
<a id="ileave">__ileave__</a> (frac, default: _1_): interleave window duration in second, a value of 0 disable interleaving  
</div>  
<div markdown class="option">  
<a id="nodisc">__nodisc__</a> (bool, default: _false_): ignore stream configuration changes while multiplexing, may result in broken streams  
</div>  
<div markdown class="option">  
<a id="mime">__mime__</a> (cstr): set mime type for graph resolution  
</div>  
<div markdown class="option">  
<a id="ffiles">__ffiles__</a> (bool, default: _false_): force complete files to be created for each segment in DASH modes  
</div>  
<div markdown class="option">  
<a id="ffmt">__ffmt__</a> (str): force ffmpeg output format for the given URL  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _4096_): block size used to read file when using avio context  
</div>  
<div markdown class="option">  
<a id="keepts">__keepts__</a> (bool, default: _true_): do not shift input timeline back to 0  
</div>  
<div markdown class="option">  
<a id="proto">__proto__</a> (bool, default: _false_): use protocol only: do not try to mux (useful when sending a SRT stream with remuxing)  
</div>  
<div markdown class="option">  
<a id="psleep">__psleep__</a> (uint, default: _1000_): in protocol only mode, sleep for given amount of ms before EOS (do not kill connection right away for some protocols)  
</div>  
<div markdown class="option">  
<a id="*" data-level="basic">__*__</a> (str): any possible options defined for AVFormatContext and sub-classes (see `gpac -hx ffmx` and `gpac -hx ffmx:*`)  
</div>  
  
