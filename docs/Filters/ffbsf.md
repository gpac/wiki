<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFmpeg BitStream filter  {:data-level="all"}  
  
Register name used to load filter: __ffbsf__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter provides bitstream filters (BSF) for compressed audio and video formats.  
See FFmpeg documentation (https://ffmpeg.org/documentation.html) for more details  
To list all supported bitstream filters for your GPAC build, use `gpac -h ffbsf:*`.  
  
Several BSF may be specified in [f](#f) for different coding types. BSF not matching the coding type are silently ignored.  
When no BSF matches the input coding type, or when [f](#f) is empty, the filter acts as a passthrough filter.  
  
Options are specified after the desired filters:  

- `ffbsf:f=h264_metadata:video_full_range_flag=0`  
- `ffbsf:f=h264_metadata,av1_metadata:video_full_range_flag=0:color_range=tv`  

  
_Note: Using BSFs on some media types (e.g. avc, hevc) may trigger creation of a reframer filter (e.g. rfnalu)_  
  

# Options    
  
<a id="f">__f__</a> (strl):    bitstream filters name - see filter help  
<a id="*">__*__</a> (str):     any possible options defined for AVBitstreamFilter and sub-classes. See `gpac -hx ffbsf` and `gpac -hx ffbsf:*`  
  
