There are plenty of [subtitle formats](http://en.wikipedia.org/wiki/Subtitle_(captioning)#Subtitle_formats) and plenty of [types](http://en.wikipedia.org/wiki/Subtitle_(captioning)#Types) and [categories](http://en.wikipedia.org/wiki/Subtitle_(captioning)#Categories) of subtitles. GPAC's support for subtitles is based on the support for the ISO Base Media File Format (ISOBMFF). 

The ISOBMFF considers that any data that produces human readable text to be used as subtitles, closed captions, is, well, ...subtitles. It further considers that there are two major classes of subtitle formats: formats which require only text processing capabilities (text decoding, text layout) and formats which also require image processing capabilities. These classes are identified by the `Track Handler Type`.

The handler type is a code given with 4 ASCII characters. Formats which require only text processing are stored in tracks identified by the handler **`text`**. Formats which may require also image processing are identified by the handler **`subt`**. 

GPAC supports both classes of tracks. The choice of which track handler type to use is not left to the content creator or to the packager. It is decided by the specification defining the carriage of that subtitle format in ISO tracks. Since tracks of a given handler type may be used to store different possible formats, there is a need to identify that format when processing the file at a high level (i.e. without decoding the subtitle frames or before the file is transmitted). This is done by the so-called `Sample Entry Code`.

This sample entry code is also a 4 ASCII character code. So identifying a track type requires at least the couple ('handler type', 'sample entry code'). In this post and the followings, I'll use the syntax `<handler-type>:<sample-entry-code>` to identify a track type. Some sample entry codes are very specific to a particular format. Some other are generic formats. In fact, any one can define and register its sample entry code for its specific format. A registry of those identifiers is maintained by the [MPEG Registration Authority](https://mp4ra.org/#/codecs). Here is a list of subtitle formats and their associated identifiers from the MP4RA site:

<table>

<tbody>

<tr>

<th>Identifier</th>

<th style="text-align: center">Description</th>

</tr>

<tr>

<td>text:tx3g</td>

<td>Tracks containing samples whose payload is binary data according to the <a href="http://www.etsi.org/deliver/etsi_ts/126200_126299/126245/11.00.00_60/ts_126245v110000p.pdf">3GPP Timed Text</a> format defined by 3GPP/MPEG.</td>

</tr>

<tr>

<td>sbtl:tx3g</td>

<td>Apple specific identifiers for so-called <a href="https://developer.apple.com/library/mac/documentation/quicktime/qtff/QTFFChap3/qtff3.html">"Subtitle media"</a>. The payload is the same as text:tx3g.</td>

</tr>

<tr>

<td>text:text</td>

<td>Apple specific identifiers for so-called <a href="https://developer.apple.com/library/mac/documentation/quicktime/qtff/QTFFChap3/qtff3.html">"Text media"</a>. The payload is similar to text:tx3g and sbtl:tx3g with some differences, and this is not officially registered on MP4RA.</td>

</tr>

<tr>

<td>clcp:c608 and clcp:c708</td>

<td>Apple specific identifiers for so-called <a href="https://developer.apple.com/library/mac/documentation/quicktime/qtff/QTFFChap3/qtff3.html">"Closed Captioning media"</a>. Not supported by GPAC (import/export and playback, DASHing may work).This is not officially registered on MP4RA.</td>

</tr>

<tr>

<td>text:wvtt</td>

<td>Tracks containing samples whose payload is <a href="http://www.iso.org/iso/home/store/catalogue_tc/catalogue_detail.htm?csnumber=63107">binary data defined by MPEG</a> that encapsulates <a href="https://w3c.github.io/webvtt/">W3C WebVTT</a> subtitles.</td>

</tr>

<tr>

<td>subt:stpp</td>

<td>Tracks containing samples whose payload are XML documents. This format is defined by MPEG. All samples carry one entire XML document and use the same XML language. Further information stored in the Sample Entry box (such as namespace) and possibly in the XML samples is required to precisely identify the XML languages of those subtitles. This is currently used to carry <a href="http://www.w3.org/TR/ttaf1-dfxp/">TTML</a>, <a href="https://www.smpte.org/sites/default/files/st2052-1-2010.pdf">SMPTE-TT</a> or <a href="https://tech.ebu.ch/docs/tech/tech3381.pdf">EBU-TT</a> (more on <a href="EBU-TTD-support-in-GPAC">GPAC support for EBU-TTD</a>) but may be used by any other XML format. A particular version of this format is adopted by DECE.</td>

</tr>

<tr>

<td>text:stxt</td>

<td>Tracks containing samples whose payload is raw text. This format is defined by MPEG. Additional sample entry information (namely mime type) is required to identify the type of text data. This is only used experimentally for the moment (in particular in GPAC).</td>

</tr>

<tr>

<td>subt:sbtt</td>

<td>Similar to text:stxt, but for "subtitles". It is defined also by MPEG but not yet used.</td>

</tr>

</tbody>

</table>

MP4Box supports all these types as described in the following figure:

[![MP4Box subtitle import/export capabilities](https://gpac.io/files/2014/09/mp4box-subtitle-support.png)](https://gpac.io/files/2014/09/mp4box-subtitle-support.png)
_MP4Box subtitle import/export capabilities_

The associated command lines using MP4Box are as follows:

1.   Importing [GPAC Timed Text XML](TTXT-Format-Documentation) as a 3GPP Timed Text track (text:tx3g):
    
    ```
    MP4Box -add file.ttxt output.mp4
    ```
    
2.  Exporting a 3GPP Timed Text track as GPAC Timed Text XML (assuming 1 is the trackId of the track):
    
    ```
    MP4Box -ttxt 1 output.mp4
    ```
    
3.  Importing SRT subtitles as a 3GPP Timed Text track:
    
    ```
    MP4Box -add file.srt output.mp4
    ```
    
4.  Exporting a 3GPP Timed Text track as an SRT file:
    
    ```
    MP4Box -srt 1 output.mp4
    ```
    
5.  Converting GPAC Timed Text XML to SVG:
    
    ```
    MP4Box -svg file.ttxt
    ```
    
6.  Converting SRT to SVG:
    
    ```
    MP4Box -svg file.srt
    ```
    
7.  Exporting a 3GPP Timed Text Track as SVG (not yet possible).
8.  Importing WebVTT content as a WVTT track:
    
    ```
    MP4Box -add file.vtt output.mp4
    ```
    
9.  Exporting a WebVTT file from a WVTT track:
    
    ```
    MP4Box -raw 1 output.mp4
    ```
    
10. Importing a TTML file as a STPP Track:

    ```
    MP4Box -add file.ttml output.mp4
    ```
    
11.  Exporting an STPP Track as a TTML document.  
    **/!\\ Not available yet** as a track reconstruction but you can extract the individual samples (will generate one TTML output per MP4 sample):
    
    ```
    MP4Box -raws 1 output.mp4
    ```
    
12.  Importing an SRT file as WVTT track:
    
    ```
    MP4Box -add file.srt:fmt=VTT output.mp4
    ```


Note that it is also possible using a combination of those steps to convert TTXT or SRT to WebVTT.

As a consequence of the packaging, it is possible to create DASH content using those formats.

Given that importers and exporters of MP4Box are simply wrappers on a filter session, the following syntaxes are also possible:
```
gpac -i subtitle.srt -o sub.mp4
gpac -i subtitle.srt -o sub.vtt
gpac -i subtitle.vtt -o sub.srt
gpac -i subtitle.mp4 -o sub.vtt
...
```

# Apple and QuickTime specifics

You need to change the QT handler name to ```stbl```, using:
```
MP4Box -i SRC:hdlr=sbtl ... 
```

The alternate group shall be set if multiple subs are present e.g.:
```
gpac -i video.264 \
   -i audio.aac:#udta_tagc="public.accessibility.describes-video":#udta_name="English (describes video)":#Language=en \
   -i sub-fr.srt:#Language=fr:#AltGroup=2:#StreamSubtype=sbtl:#Disable \
   -i sub-en.srt:#Language=en:#AltGroup=2:#StreamSubtype=sbtl \
  -o result.mp4
```
 
# Rendering support
GPAC support rendering of text:tx3g, text:wvtt and subt:stpp. The former is natively supported while the latter are supported through JavaScript by converting WebVTT or TTML samples to SVG.

Rendering is automatically activated when using the compositor filter (e.g. `gpac -gui` or `gpac -mp4c`).
It is also possible to render subtitles to image or video sequences:
```
gpac -i source.vtt -o dump_$num$.png
gpac -i source.vtt -o dump.264
```
