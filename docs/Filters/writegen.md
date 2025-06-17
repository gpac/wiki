<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Stream to File converter  
  
Register name used to load filter: __writegen__  
This filter may be automatically loaded during graph resolution.  
  
Generic single stream to file converter, used when extracting/converting PIDs.  
The writegen filter should usually not be explicitly loaded without a source ID specified, since the filter would likely match any PID connection.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="exporter">__exporter__</a> (bool, default: _false_): compatibility with old exporter, displays export results  
</div>  
<div markdown class="option">  
<a id="pfmt" data-level="basic">__pfmt__</a> (pfmt, default: _none_, Enum: none|yuv420|yvu420|yuv420_10|yuv422|yuv422_10|yuv444|yuv444_10|uyvy|vyuy|yuyv|yvyu|uyvl|vyul|yuyl|yvyl|nv12|nv21|nv1l|nv2l|yuva|yuvd|yuv444a|yuv444p|v308|yuv444ap|v408|v410|v210|grey|algr|gral|rgb4|rgb5|rgb6|rgba|argb|bgra|abgr|rgb|bgr|xrgb|rgbx|xbgr|bgrx|rgbd|rgbds|uncv): pixel format for raw extract. If not set, derived from extension  
</div>  
  
<div markdown class="option">  
<a id="afmt" data-level="basic">__afmt__</a> (afmt, default: _none_, Enum: none|u8|s16|s16b|s24|s24b|s32|s32b|flt|fltb|dbl|dblb|u8p|s16p|s24p|s32p|fltp|dblp): audio format for raw extract. If not set, derived from extension  
</div>  
  
<div markdown class="option">  
<a id="decinfo">__decinfo__</a> (enum, default: _auto_): decoder config insert mode  

- no: never inserted  
- first: inserted on first packet  
- sap: inserted at each SAP  
- auto: selects between no and first based on media type  
</div>  
  
<div markdown class="option">  
<a id="split">__split__</a> (bool, default: _false_): force one file per frame  
</div>  
<div markdown class="option">  
<a id="frame" data-level="basic">__frame__</a> (bool, default: _false_): force single frame dump with no rewrite. In this mode, all codec types are supported  
</div>  
<div markdown class="option">  
<a id="sstart" data-level="basic">__sstart__</a> (uint, default: _0_): start number of frame to forward. If 0, all samples are forwarded  
</div>  
<div markdown class="option">  
<a id="send" data-level="basic">__send__</a> (uint, default: _0_): end number of frame to forward. If less than start frame, all samples after start are forwarded  
</div>  
<div markdown class="option">  
<a id="dur" data-level="basic">__dur__</a> (frac, default: _0_): duration of media to forward after first sample. If 0, all samples are forwarded  
</div>  
<div markdown class="option">  
<a id="merge_region" data-level="basic">__merge_region__</a> (bool, default: _false_): merge TTML regions with same ID while reassembling TTML doc  
</div>  
<div markdown class="option">  
<a id="vtth" data-level="basic">__vtth__</a> (enum, default: _seg_): vtt header injection mode  

- single: inject only at first frame of the stream  
- seg: inject at each non-empty segment  
- all: inject at each segment even empty ones  
</div>  
  
<div markdown class="option">  
<a id="add_nl" data-level="basic">__add_nl__</a> (bool, default: _false_): add new line after each packet when dumping text streams  
</div>  
  
