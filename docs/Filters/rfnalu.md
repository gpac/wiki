<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AVC/HEVC reframer  
  
Register name used to load filter: __rfnalu__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses AVC|H264 and HEVC files/data and outputs corresponding video PID and frames.  
This filter produces ISOBMFF-compatible output: start codes are removed, NALU length field added and avcC/hvcC config created.  
_Note: The filter uses negative CTS offsets: CTS is correct, but some frames may have DTS greater than CTS._  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="fps" data-level="basic">__fps__</a> (frac, default: _0/1000_): import frame rate (0 default to FPS from bitstream or 25 Hz)  
</div>  
<div markdown class="option">  
<a id="index" data-level="basic">__index__</a> (dbl, default: _-1.0_): indexing window length. If 0, bitstream is not probed for duration. A negative value skips the indexing if the source file is larger than 20M (slows down importers) unless a play with start range > 0 is issued  
</div>  
<div markdown class="option">  
<a id="explicit">__explicit__</a> (bool, default: _false_): use explicit layered (SVC/LHVC) import  
</div>  
<div markdown class="option">  
<a id="strict_poc">__strict_poc__</a> (enum, default: _off_): delay frame output of an entire GOP to ensure CTS info is correct when POC suddenly changes  

- off: disable GOP buffering  
- on: enable GOP buffering, assuming no error in POC  
- error: enable GOP buffering and try to detect lost frames  
</div>  
  
<div markdown class="option">  
<a id="nosei">__nosei__</a> (bool, default: _false_): remove all sei messages  
</div>  
<div markdown class="option">  
<a id="nosvc">__nosvc__</a> (bool, default: _false_): remove all SVC/MVC/LHVC data  
</div>  
<div markdown class="option">  
<a id="novpsext">__novpsext__</a> (bool, default: _false_): remove all VPS extensions  
</div>  
<div markdown class="option">  
<a id="importer">__importer__</a> (bool, default: _false_): compatibility with old importer, displays import results  
</div>  
<div markdown class="option">  
<a id="nal_length">__nal_length__</a> (uint, default: _4_): set number of bytes used to code length field: 1, 2 or 4  
</div>  
<div markdown class="option">  
<a id="subsamples">__subsamples__</a> (bool, default: _false_): import subsamples information  
</div>  
<div markdown class="option">  
<a id="deps">__deps__</a> (bool, default: _false_): import sample dependency information  
</div>  
<div markdown class="option">  
<a id="refs">__refs__</a> (bool, default: _false_): import sample reference picture list (currently only for HEVC and VVC)  
</div>  
<div markdown class="option">  
<a id="seirw">__seirw__</a> (bool, default: _true_): rewrite AVC sei messages for ISOBMFF constraints  
</div>  
<div markdown class="option">  
<a id="audelim">__audelim__</a> (bool, default: _false_): keep Access Unit delimiter in payload  
</div>  
<div markdown class="option">  
<a id="notime">__notime__</a> (bool, default: _false_): ignore input timestamps, rebuild from 0  
</div>  
<div markdown class="option">  
<a id="dv_mode">__dv_mode__</a> (enum, default: _auto_): signaling for DolbyVision  

- none: never signal DV profile  
- auto: signal DV profile if RPU or EL are found  
- clean: do not signal and remove RPU and EL NAL units  
- single: signal DV profile if RPU are found and remove EL NAL units  
</div>  
  
<div markdown class="option">  
<a id="dv_profile">__dv_profile__</a> (uint, default: _0_): profile for DolbyVision (currently defined profiles are 4, 5, 7, 8, 9), 0 for auto-detect  
</div>  
<div markdown class="option">  
<a id="dv_compatid">__dv_compatid__</a> (enum, default: _auto_): cross-compatibility ID for DolbyVision  

- auto: auto-detect  
- none: no cross-compatibility  
- hdr10: CTA HDR10, as specified by EBU TR 03  
- bt709: SDR BT.709  
- hlg709: HLG BT.709 gamut in ITU-R BT.2020  
- hlg2100: HLG BT.2100 gamut in ITU-R BT.2020  
- bt2020: SDR BT.2020  
- brd: Ultra HD Blu-ray Disc HDR  
</div>  
  
<div markdown class="option">  
<a id="bsdbg">__bsdbg__</a> (enum, default: _off_): debug NAL parsing in `media@debug` logs  

- off: not enabled  
- on: enabled  
- full: enable with number of bits dumped  
</div>  
  
  
