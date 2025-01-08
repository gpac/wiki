<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFmpeg decoder  
  
Register name used to load filter: __ffdec__  
This filter may be automatically loaded during graph resolution.  
  
This filter decodes audio and video streams using FFmpeg.  
See FFmpeg documentation (https://ffmpeg.org/documentation.html) for more details.  
To list all supported decoders for your GPAC build, use `gpac -h ffdec:*`.  
  
Options can be passed from prompt using `--OPT=VAL`  
Decoder flags can be passed directly as `:FLAGNAME`.  
The default threading mode is to let libavcodec decide how many threads to use. To enforce single thread, use `--threads=1`  
  
# Codec Map  
  
The [ffcmap](#ffcmap) option allows specifying FFmpeg codecs for codecs not supported by GPAC.  
Each entry in the list is formatted as `GID@name` or `GID@+name`, with:  

- GID: 4CC or 32 bit identifier of codec ID, as indicated by `gpac -i source inspect:full`  
- name: FFmpeg codec name  
- `+': is set and extra data is set and formatted as an ISOBMFF box, removes box header  

  
Example
```
gpac -i source.mp4 --ffcmap=BKV1@binkvideo vout
```
  
This will map an ISOBMFF track declared with coding type `BKV1` to binkvideo.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="ffcmap" data-level="basic">__ffcmap__</a> (strl): codec map  
</div>  
<div markdown class="option">  
<a id="c">__c__</a> (str):     codec name (GPAC or ffmpeg), only used to query possible arguments - updated to ffmpeg codec name after initialization  
</div>  
<div markdown class="option">  
<a id="*" data-level="basic">__*__</a> (str): any possible options defined for AVCodecContext and sub-classes. See `gpac -hx ffdec` and `gpac -hx ffdec:*`  
</div>  
  
