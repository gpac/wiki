<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Bitstream metadata rewriter  
  
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
    - (AVC|HEVC) timecode- AV1:  
    - timecode  

- ProRes:  

    - sample aspect ratio  
    - color primaries, transfer characteristics and matrix coefficients  

    
Values are by default initialized to -1, implying to keep the related info (present or not) in the bitstream.  
A [sar](#sar) value of `0/0` will remove sample aspect ratio info from bitstream if possible.  
    
The filter can currently modify the following properties in the stream configuration but not in the bitstream:  

- HEVC: profile IDC, profile space, general compatibility flags  
- VVC: profile IDC, general profile and level indication  

    
The filter will work in passthrough mode for all other codecs and media types.  

# Timecode Manipulation  
  
One can optionally set the [tcxs](#tcxs) and [tcxe](#tcxe) to define the start and end of timecode manipulation. By default, the filter will process all packets.  
Some modes require you to define [tcsc](#tcsc). This follows the same format as the timecode itself ([-]() to `first` to infer the value from the first timecode when timecode manipulation starts. In this case, unless a timecode is found, the filter will not perform any operation./#). The use of negative values is only meaningful in the `shift` mode. It's also possible to set [tcsc](#tcsc) to `first` to infer the value from the first timecode when timecode manipulation starts. In this case, unless a timecode is found, the filter will not perform any operation.  

## Modes  
Timecode manipulation has four modes and they all have their own operating nuances.  
### Remove  
  
Remove all timecodes from the bitstream.  
### Insert  
  
Insert timecodes based on the CTS. If [tcsc](#tcsc) is set, it will be used as timecode offset.  
This mode will overwrite existing timecodes (if any).  
### Shift  
  
Shift all timecodes by the value defined in [tcsc](#tcsc).  
This mode will only modify timecodes if they exists, no new timecode will be inserted.  
### Constant  
  
Set all timecodes to the value defined in [tcsc](#tcsc).  
Again, this mode wouldn't insert new timecodes.  
### UTC  
  
Uses the `SenderNTP` property, `UTC` property on the packet, or the current UTC time to set the timecode.  
This mode will overwrite existing timecodes (if any).  

## Examples  
Example
```
gpac -i in.mp4 bsrw:tc=insert [dst]  
gpac -i in.mp4 bsrw:tc=insert:tcsc=TC00:00:10:00 [dst]  
gpac -i in.mp4 bsrw:tc=shift:tcsc=TC00:00:10:00:tcxs=TC00:01:00:00 [dst]
```
  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="cprim" data-level="basic">__cprim__</a> (cprm, default: _-1_, Enum: reserved0|BT709|undef|reserved3|BT470M|BT470G|SMPTE170|SMPTE240|FILM|BT2020|SMPTE428|SMPTE431|SMPTE432|EBU3213, updatable): color primaries according to ISO/IEC 23001-8 / 23091-2  
</div>  
  
<div markdown class="option">  
<a id="ctfc" data-level="basic">__ctfc__</a> (ctfc, default: _-1_, Enum: reserved0|BT709|undef|reserved3|BT470M|BT470BG|SMPTE170|SMPTE249|Linear|Log100|Log316|IEC61966|BT1361|sRGB|BT2020_10|BT2020_12|SMPTE2084|SMPTE428|STDB67, updatable): color transfer characteristics according to ISO/IEC 23001-8 / 23091-2  
</div>  
  
<div markdown class="option">  
<a id="cmx" data-level="basic">__cmx__</a> (cmxc, default: _-1_, Enum: GBR|BT709|undef|FCC|BT601|SMPTE170|SMPTE240|YCgCo|BT2020|BT2020cl|YDzDx, updatable): color matrix coefficients according to ISO/IEC 23001-8 / 23091-2  
</div>  
  
<div markdown class="option">  
<a id="sar" data-level="basic">__sar__</a> (frac, default: _-1/-1_, updatable): aspect ratio to rewrite  
</div>  
<div markdown class="option">  
<a id="m4vpl" data-level="basic">__m4vpl__</a> (sint, default: _-1_, updatable): set ProfileLevel for MPEG-4 video part two  
</div>  
<div markdown class="option">  
<a id="fullrange" data-level="basic">__fullrange__</a> (bool, default: _false_, updatable): video full range flag  
</div>  
<div markdown class="option">  
<a id="novsi" data-level="basic">__novsi__</a> (bool, default: _false_, updatable): remove video_signal_type from VUI in AVC|H264 and HEVC  
</div>  
<div markdown class="option">  
<a id="novuitiming" data-level="basic">__novuitiming__</a> (bool, default: _false_, updatable): remove timing_info from VUI in AVC|H264 and HEVC  
</div>  
<div markdown class="option">  
<a id="prof" data-level="basic">__prof__</a> (sint, default: _-1_, updatable): profile indication for AVC|H264  
</div>  
<div markdown class="option">  
<a id="lev" data-level="basic">__lev__</a> (sint, default: _-1_, updatable): level indication for AVC|H264, level_idc for VVC  
</div>  
<div markdown class="option">  
<a id="pcomp" data-level="basic">__pcomp__</a> (sint, default: _-1_, updatable): profile compatibility for AVC|H264  
</div>  
<div markdown class="option">  
<a id="pidc" data-level="basic">__pidc__</a> (sint, default: _-1_, updatable): profile IDC for HEVC and VVC  
</div>  
<div markdown class="option">  
<a id="pspace" data-level="basic">__pspace__</a> (sint, default: _-1_, updatable): profile space for HEVC  
</div>  
<div markdown class="option">  
<a id="gpcflags" data-level="basic">__gpcflags__</a> (sint, default: _-1_, updatable): general compatibility flags for HEVC  
</div>  
<div markdown class="option">  
<a id="tcxs" data-level="basic">__tcxs__</a> (str, updatable): timecode manipulation start  
</div>  
<div markdown class="option">  
<a id="tcxe" data-level="basic">__tcxe__</a> (str, updatable): timecode manipulation end  
</div>  
<div markdown class="option">  
<a id="tcdf" data-level="basic">__tcdf__</a> (bool, default: _false_, updatable): use NTSC drop-frame counting for timecodes  
</div>  
<div markdown class="option">  
<a id="tcsc" data-level="basic">__tcsc__</a> (str, updatable): timecode constant for use with shift/constant modes  
</div>  
<div markdown class="option">  
<a id="tc" data-level="basic">__tc__</a> (enum, default: _none_, updatable): timecode manipulation mode  

- none: do not change anything  
- remove: remove timecodes  
- insert: insert timecodes based on cts or `tcsc` (if provided)  
- shift: shift timecodes based by `tcsc`  
- constant: overwrite timecodes with `tcsc`  
- utc: insert timecodes based on the utc time on the packet or the current time  
</div>  
  
<div markdown class="option">  
<a id="seis">__seis__</a> (uintl, updatable): list of SEI message types (4,137,144,...). When used with `rmsei`, this serves as a blacklist. If left empty, all SEIs will be removed. Otherwise, it serves as a whitelist  
</div>  
<div markdown class="option">  
<a id="rmsei" data-level="basic">__rmsei__</a> (bool, default: _false_, updatable): remove SEI messages from bitstream for AVC|H264, HEVC and VVC  
</div>  
<div markdown class="option">  
<a id="vidfmt" data-level="basic">__vidfmt__</a> (sint, default: _-1_, Enum: component|pal|ntsc|secam|mac|undef, updatable): video format for AVC|H264, HEVC and VVC  
</div>  
  
  
