<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Subtitle loader  
  
Register name used to load filter: __txtin__  
This filter may be automatically loaded during graph resolution.  
  
This filter reads subtitle data from input PID to produce subtitle frames on a single PID.  
The filter supports the following formats:  

- SRT: https://en.wikipedia.org/wiki/SubRip  
- WebVTT: https://www.w3.org/TR/webvtt1/  
- TTXT: https://wiki.gpac.io/xmlformats/TTXT-Format-Documentation  
- QT 3GPP Text XML (TexML): Apple QT6, likely deprecated  
- TTML: https://www.w3.org/TR/ttml2/  
- SUB: one subtitle per line formatted as `{start_frame}{end_frame}text`  
- SSA (Substation Alpha): basic parsing support for common files  

  
Input files must be in UTF-8 or UTF-16 format, with or without BOM. The internal frame format is:   

- WebVTT (and srt if desired): ISO/IEC 14496-30 VTT cues  
- TTML: ISO/IEC 14496-30 XML subtitles  
- stxt and sbtt: ISO/IEC 14496-30 text stream and text subtitles  
- Others: 3GPP/QT Timed Text  

  
# TTML Support  
  
If [ttml_split](#ttml_split) option is set, the TTML document is split in independent time segments by inspecting all overlapping subtitles in the body.  
Empty periods in TTML will result in empty TTML documents or will be skipped if [no_empty](#no_empty) option is set.  
  
The first sample has a CTS assigned as indicated by [ttml_cts](#ttml_cts):  

- a numerator of -2 indicates the first CTS is 0  
- a numerator of -1 indicates the first CTS is the first active time in document  
- a numerator &gt;= 0 indicates the CTS to use for first sample  

  
When TTML splitting is disabled, the duration of the TTML sample is given by [ttml_dur](#ttml_dur) if not 0, or set to the document duration  
  
By default, media resources are kept as declared in TTML2 documents.  
  
[ttml_embed](#ttml_embed) can be used to embed inside the TTML sample the resources in `<head>` or `<body>`:  

- for `<source>`, `<image>`, `<audio>`, `<font>`, local URIs indicated in `src` will be loaded and `src` rewritten.  
- for `<data>` with base64 coding, the data will be decoded, `<data>` element removed and parent &lt;source&gt; rewritten with `src` attribute inserted.  

  
The embedded data is added as a subsample to the TTML frame, and the referring elements will use `src=urn:mpeg:14496-30:N` with `N` the index of the subsample.  
  
A `subtitle zero` may be specified using [ttml_zero](#ttml_zero). This will remove all subtitles before the given time `T0`, and rewrite each subtitle begin/end `T` to `T-T0` using millisecond accuracy.  

__Warning: Original time formatting (tick, frames/subframe ...) will be lost when this option is used, converted to `HH:MM:SS.ms`.__  
  
The subtitle zero time __must__ be prefixed with `T` when the option is not set as a global argument:  
```
gpac -i test.ttml:ttml_zero=T10:00:00 [...]  
MP4Box -add test.ttml:sopt:ttml_zero=T10:00:00 [...]  
gpac -i test.ttml --ttml_zero=10:00:00 [...]  
gpac -i test.ttml --ttml_zero=T10:00:00 [...]  
MP4Box -add test.ttml --ttml_zero=10:00:00 [...]
```
  
  
# Simple Text Support  
  
The text loader can convert input files in simple text streams of a single packet, by forcing the codec type on the input:  
```
gpac -i test.txt:#CodecID=stxt  [...]  
gpac fin:pck="Text Data":#CodecID=stxt  [...]
```
  
  
The content of the source file will be the payload of the text sample. The [stxtmod](#stxtmod) option allows specifying WebVTT, TX3G or simple text mode for output format.  
In this mode, the [stxtdur](#stxtdur) option is used to control the duration of the generated subtitle:  

- a positive value always forces the duration  
- a negative value forces the duration if input packet duration is not known  

  
# Notes  
  
When reframing simple text streams from demuxers (e.g. subtitles from MKV), the output format of these streams can be selected using [stxtmod](#stxtmod).  
  
When importing SRT, SUB or SSA files, the output format of the PID can be selected using [stxtmod](#stxtmod).  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="nodefbox">__nodefbox__</a> (bool, default: _false_): skip default text box  
</div>  
<div markdown class="option">  
<a id="noflush">__noflush__</a> (bool, default: _false_): skip final sample flush for srt  
</div>  
<div markdown class="option">  
<a id="fontname" data-level="basic">__fontname__</a> (str): default font  
</div>  
<div markdown class="option">  
<a id="fontsize" data-level="basic">__fontsize__</a> (uint, default: _18_): default font size  
</div>  
<div markdown class="option">  
<a id="lang" data-level="basic">__lang__</a> (str): default language  
</div>  
<div markdown class="option">  
<a id="width" data-level="basic">__width__</a> (uint, default: _0_): default width of text area  
</div>  
<div markdown class="option">  
<a id="height" data-level="basic">__height__</a> (uint, default: _0_): default height of text area  
</div>  
<div markdown class="option">  
<a id="txtx" data-level="basic">__txtx__</a> (uint, default: _0_): default horizontal offset of text area: -1 (left), 0 (center) or 1 (right)  
</div>  
<div markdown class="option">  
<a id="txty" data-level="basic">__txty__</a> (uint, default: _0_): default vertical offset of text area: -1 (bottom), 0 (center) or 1 (top)  
</div>  
<div markdown class="option">  
<a id="zorder">__zorder__</a> (sint, default: _0_): default z-order of the PID  
</div>  
<div markdown class="option">  
<a id="timescale">__timescale__</a> (uint, default: _1000_): default timescale of the PID  
</div>  
<div markdown class="option">  
<a id="ttml_split">__ttml_split__</a> (bool, default: _true_): split ttml doc in non-overlapping samples  
</div>  
<div markdown class="option">  
<a id="ttml_cts">__ttml_cts__</a> (lfrac, default: _-1/1_): first sample cts - see filter help  
</div>  
<div markdown class="option">  
<a id="ttml_dur">__ttml_dur__</a> (frac, default: _0/1_): sample duration when not spliting split - see filter help  
</div>  
<div markdown class="option">  
<a id="ttml_embed">__ttml_embed__</a> (bool, default: _false_): force embedding TTML resources  
</div>  
<div markdown class="option">  
<a id="ttml_zero">__ttml_zero__</a> (str): set subtitle zero time for TTML  
</div>  
<div markdown class="option">  
<a id="no_empty">__no_empty__</a> (bool, default: _false_): do not send empty samples  
</div>  
<div markdown class="option">  
<a id="stxtdur">__stxtdur__</a> (frac, default: _1_): duration for simple text  
</div>  
<div markdown class="option">  
<a id="stxtmod">__stxtmod__</a> (enum, default: _tx3g_): text stream mode for simple text streams and SRT inputs  

- stxt: output PID formatted as simple text stream (remove markup in VTT/SRT payload)  
- sbtt: output PID formatted as subtitle text stream (keep markup in VTT/SRT payload)  
- tx3g: output PID formatted as TX3G/Apple stream  
- vtt: output PID formatted as WebVTT stream  
- webvtt: same as vtt (for backward compatiblity  
</div>  
  
  
