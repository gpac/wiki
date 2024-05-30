<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Compressed bitstream rewriter  
  
Register name used to load filter: __bsrw__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter rewrites some metadata of various bitstream formats.  
The filter can currently modify the following properties in video bitstreams:  
- MPEG-4 Visual:  
  - sample aspect ratio  
  - profile and level  
- AVC|H264, HEVC and VVC:  
  - sample aspect ratio  
  - profile, level, profile compatibility  
  - video format, video fullrange  
  - color primaries, transfer characteristics and matrix coefficients (or remove all info)  
- ProRes:  
  - sample aspect ratio  
  - color primaries, transfer characteristics and matrix coefficients  
    
Values are by default initialized to -1, implying to keep the related info (present or not) in the bitstream.  
A [sar](#sar) value of `0/0` will remove sample aspect ratio info from bitstream if possible.  
    
The filter can currently modify the following properties in the stream configuration but not in the bitstream:  
* HEVC: profile IDC, profile space, general compatibility flags  
* VVC: profile IDC, general profile and level indication  
    
The filter will work in passthrough mode for all other codecs and media types.  
  

# Options    
  
<a id="cprim">__cprim__</a> (cprm, default: _-1_, Enum: reserved0|BT709|undef|reserved3|BT470M|BT470G|SMPTE170|SMPTE240|FILM|BT2020|SMPTE428|SMPTE431|SMPTE432|EBU3213, updatable): color primaries according to ISO/IEC 23001-8 / 23091-2  
  
<a id="ctfc">__ctfc__</a> (ctfc, default: _-1_, Enum: reserved0|BT709|undef|reserved3|BT470M|BT470BG|SMPTE170|SMPTE249|Linear|Log100|Log316|IEC61966|BT1361|sRGB|BT2020_10|BT2020_12|SMPTE2084|SMPTE428|STDB67, updatable): color transfer characteristics according to ISO/IEC 23001-8 / 23091-2  
  
<a id="cmx">__cmx__</a> (cmxc, default: _-1_, Enum: GBR|BT709|undef|FCC|BT601|SMPTE170|SMPTE240|YCgCo|BT2020|BT2020cl|YDzDx, updatable): color matrix coeficients according to ISO/IEC 23001-8 / 23091-2  
  
<a id="sar">__sar__</a> (frac, default: _-1/-1_, updatable): aspect ratio to rewrite  
<a id="m4vpl">__m4vpl__</a> (sint, default: _-1_, updatable): set ProfileLevel for MPEG-4 video part two  
<a id="fullrange">__fullrange__</a> (bool, default: _false_, updatable): video full range flag  
<a id="novsi">__novsi__</a> (bool, default: _false_, updatable): remove video_signal_type from VUI in AVC|H264 and HEVC  
<a id="novuitiming">__novuitiming__</a> (bool, default: _false_, updatable): remove timing_info from VUI in AVC|H264 and HEVC  
<a id="prof">__prof__</a> (sint, default: _-1_, updatable): profile indication for AVC|H264  
<a id="lev">__lev__</a> (sint, default: _-1_, updatable): level indication for AVC|H264, level_idc for VVC  
<a id="pcomp">__pcomp__</a> (sint, default: _-1_, updatable): profile compatibility for AVC|H264  
<a id="pidc">__pidc__</a> (sint, default: _-1_, updatable): profile IDC for HEVC and VVC  
<a id="pspace">__pspace__</a> (sint, default: _-1_, updatable): profile space for HEVC  
<a id="gpcflags">__gpcflags__</a> (sint, default: _-1_, updatable): general compatibility flags for HEVC  
<a id="rmsei">__rmsei__</a> (bool, default: _false_, updatable): remove SEI messages from bitstream for AVC|H264, HEVC and VVC  
<a id="vidfmt">__vidfmt__</a> (enum, default: _-1_, updatable): video format for AVC|H264, HEVC and VVC (component|pal|ntsc|secam|mac|undef)  
  
  
