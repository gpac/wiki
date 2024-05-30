<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Subtitle loader  
  
Register name used to load filter: __txtin__  
This filter may be automatically loaded during graph resolution.  
  
This filter reads subtitle data from input PID to produce subtitle frames on a single PID.  
The filter supports the following formats:  
* SRT: https://en.wikipedia.org/wiki/SubRip  
* WebVTT: https://www.w3.org/TR/webvtt1/  
* TTXT: https://wiki.gpac.io/xmlformats/TTXT-Format-Documentation  
* QT 3GPP Text XML (TexML): Apple QT6, likely deprecated  
* TTML: https://www.w3.org/TR/ttml2/  
* SUB: one subtitle per line formatted as `{start_frame}{end_frame}text`  
* SSA (Substation Alpha): basic parsing support for common files  
  
Input files must be in UTF-8 or UTF-16 format, with or without BOM. The internal frame format is:   
* WebVTT (and srt if desired): ISO/IEC 14496-30 VTT cues  
* TTML: ISO/IEC 14496-30 XML subtitles  
* Others: 3GPP/QT Timed Text  
  
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
Example
```
gpac -i test.ttml:ttml_zero=T10:00:00 [...]  
MP4Box -add test.ttml:sopt:ttml_zero=T10:00:00 [...]  
gpac -i test.ttml --ttml_zero=10:00:00 [...]  
gpac -i test.ttml --ttml_zero=T10:00:00 [...]  
MP4Box -add test.ttml --ttml_zero=10:00:00 [...]
```  
  
# Simple Text Support  
  
The text loader can convert input files in simple text streams of a single packet, by forcing the codec type on the input:EX gpac -i test.txt:#CodecID=stxt  [...]  
Example
```
gpac fin:pck="Text Data":#CodecID=stxt  [...]
```  
  
The content of the source file will be the payload of the text sample. The [stxtmod](#stxtmod) option allows specifying WebVTT, TX3G or simple text mode for output format.  
In this mode, the [stxtdur](#stxtdur) option is used to control the duration of the generated subtitle:  
- a positive value always forces the duration  
- a negative value forces the duration if input packet duration is not known  
  

# Options    
  
<a id="webvtt">__webvtt__</a> (bool, default: _false_): force WebVTT import of SRT files  
<a id="nodefbox">__nodefbox__</a> (bool, default: _false_): skip default text box  
<a id="noflush">__noflush__</a> (bool, default: _false_): skip final sample flush for srt  
<a id="fontname">__fontname__</a> (str): default font  
<a id="fontsize">__fontsize__</a> (uint, default: _18_): default font size  
<a id="lang">__lang__</a> (str): default language  
<a id="width">__width__</a> (uint, default: _0_): default width of text area  
<a id="height">__height__</a> (uint, default: _0_): default height of text area  
<a id="txtx">__txtx__</a> (uint, default: _0_): default horizontal offset of text area: -1 (left), 0 (center) or 1 (right)  
<a id="txty">__txty__</a> (uint, default: _0_): default vertical offset of text area: -1 (bottom), 0 (center) or 1 (top)  
<a id="zorder">__zorder__</a> (sint, default: _0_): default z-order of the PID  
<a id="timescale">__timescale__</a> (uint, default: _1000_): default timescale of the PID  
<a id="ttml_split">__ttml_split__</a> (bool, default: _true_): split ttml doc in non-overlapping samples  
<a id="ttml_cts">__ttml_cts__</a> (lfrac, default: _-1/1_): first sample cts - see filter help  
<a id="ttml_dur">__ttml_dur__</a> (frac, default: _0/1_): sample duration when not spliting split - see filter help  
<a id="ttml_embed">__ttml_embed__</a> (bool, default: _false_): force embedding TTML resources  
<a id="ttml_zero">__ttml_zero__</a> (str): set subtitle zero time for TTML  
<a id="no_empty">__no_empty__</a> (bool, default: _false_): do not send empty samples  
<a id="stxtdur">__stxtdur__</a> (frac, default: _1_): duration for simple text  
<a id="stxtmod">__stxtmod__</a> (enum, default: _none_): simple text stream mode  
* none: declares output PID as simple text stream  
* tx3g: declares output PID as TX3G/Apple stream  
* vtt: declares output PID as WebVTT stream  
  
  
