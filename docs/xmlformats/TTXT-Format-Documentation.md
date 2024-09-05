# Foreword {: data-level="all"}

The 3GPP consortium has defined a standard for text streaming, independent of any scene description such as SMIL, SVG or BIFS: 3GPP Timed Text. MP4Box supports this standard and uses its own textual format to describe a streaming text session.

As of version 0.2.3, GPAC supports 3GPP timed text, also known as MPEG-4 Streaming Text. These standards provide a way to stream text and styles applying to text such as font size, color, highlighting. This is a very convenient way to encode subtitles, tickers, etc,... independently of the scene description language (MPEG-4, X3D, SVG/SMIL, ...).

For regular MPEG-4/VRML static text, please refer to the MPEG-4 tutorial or any VRML tutorials available on the internet.

# Overview of a timed text stream

The 3GPP timed text specification is called [3GPP TS 26.245](http://www.3gpp.org/ftp/Specs/archive/26_series/26.245/26245-600.zip) (3GPP web site) and will give you in-depth knowledge of this format. If you don't want to read and understand all the technical details, there are some important things to know about timed text streams, so let's review them.

A text stream can be divided in two major sections, very much like most modern audio/video codecs: the configuration data for the decoder and the data samples. As you can guess, this is quite different from most subtitling formats, where subtitles configuration is left up to the player (color, font size, positioning, etc..). 

Authoring 3GPP text streams therefore requires careful design as to which font size shall be picked, color used and similar. The terminal may not changed these settings as these have been chosen by the author, in other words the text stream becomes an element of the final content just like video or audio tracks (think of it as DVD subtitles whose styles and position are part of the DVD and cannot be changed by the DVD player).

## Decoder Configuration

The configuration data of a text stream provides information about positioning in the visual display, the list of ALL fonts used in the text stream and default styles (color, bold/italic, background color).

## Positioning

Just like any video or image media, a text stream has size information, usually called `Text Track` size. This size defines the maximum width and height used by the text stream. All text will be drawn within this defined rectangle which will also act as a clipper (i.e., nothing will appear outside it). 

This rectangle can be positioned in the final display through horizontal and vertical offsets, allowing for instance to define a text track of 320\*50 pixels at the bottom of a 320\*240 video.

## Default Styles

Samples in a text stream usually use the default properties defined in the decoder configuration. Since some styles may be used quite often in a text stream (for example, italic), the decoder configuration data contains a list of default styles, and samples then refer to a specific style in this list. This is known as the `TextSampleEntry` in 3GPP. 

A single `TextSampleEntry` contains:

*   A list of **font names** ("Times", "Arial", etc) with an associated ID - fonts are ALWAYS referenced by IDs in a 3GPP text stream. A compliant decoder shall be able to understand the default font names "Serif", "Sans-serif" and "Monospace".
*   **Text Styles:** default font ID, font size, font styles (italic, bold, underlined), text color in RGBA colorspace.
*   **Text Position:** in a 3GPP text stream, the text may be drawn in a given rectangle within the stream main display rectangle. This is known as the `TextBox` in 3GPP. Any text justification is always performed against this TextBox, not against the main display rectangle.
*   **Other styles:** background color in RGBA colorspace, horizontal and vertical justification, text scrolling modes, etc..

## Text Samples

Text samples convey text data and, optionally, temporary styles to apply to this text. The text data can be encoded in UTF-8 or UTF-16, and may be empty (typically used for subtitles). The temporary styles are known as `TextModifiers` in 3GPP, and are of two kinds: those impacting the entire text, and those impacting only a sub-string of the text, identified through starting and ending characters.

### Sub-String Text Modifiers

*   **Styles:** overrides text style (font name, size and style, text color) for a substring of the text. All text characters not covered by temporary modifiers use the default text style from the decoder configuration.
*   **Highlight:** specifies a given substring shall be highlighted.
*   **Hyper Text:** specifies a given substring shall be treated as an hyper-link, and gives associated URL.
*   **Blinking:** specifies a given substring shall blink - blinking frequency is left up to the decoder.
*   **Karaoke:** specifies how highlighting shall be dynamically applied to text characters for a karaoke style.

### Complete String Text Modifiers

*   **Text Box:** specifies a temporary box where this text sample is displayed.
*   **Highlight Color:** specifies the highlight color when highlighting is used. When no highlighting color is given the decoder should use reverse video.
*   **Wrap:** specifies text wrapping shall be done on the text string if needed.
*   **Scroll Delay:** specifies the amount of time a text shall be presented statically to the user during a scroll.

# GPAC TTXT Format

There is no official textual representation of a text stream. Moreover, the specification relies on IsoMedia knowledge for most structure descriptions. 

In order to help authoring text streams, an XML format has been developed in GPAC, called **TTXT** for timed-text - the extension used being`.ttxt`. 

This format is not related in any way to any scene description language to keep the timed text authoring a standalone step in the authoring process.

## Obtaining a sample TTXT file

As said above, this format has been developed in GPAC, and you will likely not find any tool other than MP4Box supporting this format for quite some time. To get a sample file, you have two possibilities:

*   Find a 3GP file with a text track, and run `MP4Box -ttxt trackID file.3gp`. This will dump the text track in TTXT format.
*   Find an SRT or SUB subtitle file, and run `MP4Box -ttxt file.srt`. This will convert the subtitles in TTXT format.

## Syntax of a TTXT file

The TTXT format is an XML description of the timed text stream, and as such MUST begin with the usual XML header with encoding hints - only UTF-8 has currently been tested. 

The text stream is encapsulated in a single element at the root of the document, called `TextStream`. This element has a single defined attribute `version` identifying the format version - the current and only defined version is "`1.0`". 

The TextStream element must have one and only one `TextStreamHeader` child and has as many `TextSample` children as desired. 

_Note:_ All coordinates are specified in pixels, framebuffer-coordinate like:

*   X-axis increases from left to right, with origin (0) on left edge.
*   Y-axis increases from top to bottom, with origin (0) on top edge.

## TextStreamHeader

The TextStreamHeader describes all 3GPP text stream decoder configuration. It must contain at least one TextSampleDescription element.

### Syntax

```xml
<TextStreamHeader width="..." height="..." translation_x="..." translation_y="..." layer="..." />
    ...
</TextStreamHeader>
```

### Semantics

*   `width` : defines text stream width in pixels (type: unsigned integer). Default value is 400 pixels.
*   `height` : defines text stream height in pixels (type: unsigned integer). Default value is 80 pixels.
*   `translation_x` : defines text stream horizontal translation in main display in pixels (type: signed integer). Default value is 0 pixels.
*   `translation_y` : defines text stream vertical translation in main display in pixels (type: signed integer). Default value is 0 pixels.
*   `layer` : defines text stream z-order (type: signed short). This is only needed when composing several text streams in a single presentation: more negative layer values are towards the viewer. Default value is 0.

## TextSampleDescription

The TextSampleDescription element may be present as many times as desired in a TextStreamHeader. It defines the default styles text samples may refer to in the stream. The TextSampleDescription may also contain zero or one `FontTable`, `TextBox` and `Style`.

### Syntax

```xml
<TextSampleDescription horizontalJustification="..." verticalJustification="..." backColor="..." verticalText="..." fillTextRegion="..." continuousKaraoke="..." scroll="..." scrollMode="..." >
    ...
</TextSampleDescription>
```

### Semantics

*   `horizontalJustification` : specifies horizontal text justification in the TextBox. Possible values are `"center"`, `"left"` and `"right"`. Default value is `"left"`.
*   `verticalJustification` : specifies vertical text justification in the TextBox. Possible values are`"center"`, `"top"` and `"bottom"`. Default value is `"bottom"`.
*   `backColor` : specifies the color to use for background fill. Expressed as space-separated, hexadecimal R, G, B and A values - for example, semi-transparent red is "ff 00 00 7f". Default value is "00 00 00 00" (no back color).
*   `verticalText` : specifies whether the text shall be drawn vertically or not. Possible values are `"yes"` and `"no"`. Default value is `"no"`.
*   `fillTextRegion` : specifies whether the entire text stream rectangle shall be filled with the backColor, or only the TextBox. Possible values are `"yes"` and `"no"`. Default value is `"no"`.
*   `continuousKaraoke` : specifies whether karaoke is continuous (all characters from beginning of text samples are highlighted) or not. Possible values are `"yes"` and `"no"`. Default value is `"no"`.
*   `scroll` : specifies text scrolling mode. Possible values are `"In"` (text is scrolling in), `"Out"`(text is scrolling out), `"InOut"` (text is scrolling in then out) and `"None"` (text is not being scrolled). Default value is `"None"`.
*   `scrollMode` : specifies text scrolling mode. Possible values are `"Credits"` (scroll from bottom to top), `"Marquee"` (scroll from right to left), `"Down"` (scroll from top to bottom) and`"Right"` (scroll from left to right). Default value is `"Credits"`.

## FontTable

The FontTable element specifies all fonts used by samples referring to this stream description. There should be one and only one FontTable element in a TextSampleDescription. If not found, the default "Serif" font will be used with an ID of 1.

### Syntax

```
<FontTable>
    <FontTableEntry fontID="..." fontName="..." />
</FontTable>
```

### Semantics

The FontTable has no attribute, it is a collection of `FontTableEntry` elements. The FontTableEntry element has two attributes:

*   `fontName` : specifies the font name to use. A terminal shall understand the names `Serif`,`Sans-Serif` and `Monospace`.
*   `fontID` : specifies the associated ID.

**NOTE** : There are no default values for this element, omitting values will result in undefined stream behaviour.

## TextBox

The TextBox element specifies where the text should be drawn within the stream main display rectangle. There should be one TextBox in a TextSampleDescription element. If the text box is not found or empty, the entire display rectangle will be used for the default text box.

### Syntax

```
<TextBox top="..." left="..." bottom="..." right="..." />
```

### Semantics

*   `top` : specifies vertical offset from stream main display rectangle top edge (type: signed integer). Default value: 0 pixels.
*   `left` : specifies horizontal offset from stream main display rectangle left edge (type: signed integer). Default value: 0 pixels.
*   `bottom` : specifies vertical extend of the text box (type: signed integer). Default value: 0 pixels.
*   `right` : specifies horizontal extend of the text box (type: signed integer). Default value: 0 pixels.

### Style

The Style element specifies the default text style for this sample description. There should be one and only one Style element in a TextSampleDescription. If not found, all default values are used with a fontID of 1.

### Syntax

```
<Style fromChar="..." toChar="..." fontID="..." fontSize="..." color="..." styles="..." />
```

### Semantics

*   `fromChar` : specifies the first character (0-based index) in the string this style applies to (type: unsigned integer). Default value is 0. Note: This field MUST be set to 0 when used in TextSampleDescription.
*   `toChar` : specifies the first character (0-based index) in the string this style stops applying to (type: unsigned integer). Default value is 0. Note: This field MUST be set to 0 when used in TextSampleDescription.
*   `fontID` : specifies the ID of the font to use, as defined in the FontTable element (type: unsigned integer). Default value: 1.
*   `fontSize` : specifies the font size to use (type: unsigned integer). Default value: 18.
*   `color` : specifies the color to use for text. Expressed as space-separated, hexadecimal R, G, B and A values - for example, semi-transparent red is "ff 00 00 7f". Default value is "ff ff ff ff" (opaque white).
*   `styles` : specifies the font styles to use (type: string). If set, it shall consist of a space-separated list of the following styles: `"Bold"` (text is in bold), `"Italic"` (text is in italic) and`"Underlined"` (text is underlined). Default value: no style ("").

## TextSample

The TextSample element describes a given text sample and all its associated style. Most of the time, no children elements will be specified.

### Syntax

```
<TextSample sampleTime="..." sampleDescriptionIndex="..." text="..." scrollDelay="..." highlightColor="..." wrap="..." >
...
</TextSample>
```

### Semantics

*   `sampleTime` : specifies the time at which the text sample shall be displayed. Time can be expressed in the usual "hh:mm:ss.ms" in hours, minutes, seconds and milliseconds format, or as a double-precision number in second unit. Default value is "0" second.
*   `sampleDescriptionIndex` : specifies the TextSampleDescription this sample referred to. This is a 1-based index, value 0 is forbidden. Default value is "1", which means you do not need to specify this field most of the time if the main sample description is the first one.
*   `text` : the text data itself. String shall be formatted as a series of lines, each line being enclosed by single-quote characters ('). This text MUST follow XML text encoding conventions. Currently only UTF-8 text is supported.
*   `scrollDelay` : specifies the scrollDelay in seconds (type: double-precision number. This is the delay after a scroll In and/or before scroll Out. Default value "0".
*   `highlightColor` : specifies the highlight color to be used by any enclosed highlighted strings (including karaoke). Expressed as other colors (see `Styles` above). Default value "0 0 0 0".
*   `wrap` : specifies whether text should be wraped or not. Possible values are "Automatic" (text is wrapped by terminal) or "None" (text is not wrapped). Default value is "None".

When text style modification or any special text effects are desired, they are described through children elements of the TextSample element. It is invalid to specify several modifiers of the same type (for instance two hyper-links) on the same character, you must make sure modifiers of a same type do not have overlapping character ranges.

## Style

See above for semantics.

## TextBox

See above for semantics. At most one TextBox modifier shall be set per sample.

## Highlight

The Highlight modifier indicates a given substring shall be highlighted.

### Syntax

```
<Highlight fromChar="..." toChar="..."/>
```

### Semantics

*   `fromChar` : specifies the first character (0-based index) in the string this style applies to (type: unsigned integer). Default value is 0.
*   `toChar` : specifies the first character (0-based index) in the string this style stops applying to (type: unsigned integer). Default value is 0.

## Blinking

The Blinking modifier indicates a given substring shall blink. The blinking rate is up to the terminal.

### Syntax

```
<Blinking fromChar="..." toChar="..."/>
```

### Semantics

*   `fromChar` : specifies the first character (0-based index) in the string this style applies to (type: unsigned integer). Default value is 0.
*   `toChar` : specifies the first character (0-based index) in the string this style stops applying to (type: unsigned integer). Default value is 0.

## HyperLink

The Hyperlink modifier indicates that a given substring shall be treated as a hyper link.

### Syntax

```
<Hyperlink fromChar="..." toChar="..." URL="..." URLToolTip="..."/>
```

### Semantics

*   `fromChar` : specifies the first character (0-based index) in the string this style applies to (type: unsigned integer). Default value is 0.
*   `toChar` : specifies the first character (0-based index) in the string this style stops applying to (type: unsigned integer). Default value is 0.
*   `URL` : URL this HyperLink is linking to. UTF-8 only format supported.
*   `URLToolTip` : "tooltip" presented to the user if supported by decoder. UTF-8 only format supported.

## Karaoke

The Karaoke element indicates dynamic highlighting, or karaoke, applies to this sample. At most one Karaoke element shall be set per TextSample. The Karaoke is defined as a sequence of highlighting times, all specified as children element of the Karaoke through the `KaraokeRange`element.

### Syntax

```
<Karaoke startTime="...">
    <KaraokeRange fromChar="..." toChar="..." endTime="..."/>
< /Karaoke >
```

### Semantics

*   `startTime` : specifies the highlighting start time offset in seconds from the beginning of the sample (type: double-precision number, default value "0").
*   `fromChar` : specifies the first character (0-based index) in the string this style applies to (type: unsigned integer). Default value is 0.
*   `toChar` : specifies the first character (0-based index) in the string this style stops applying to (type: unsigned integer). Default value is 0.
*   `endTime` : specifies the highlighting end time offset in seconds from the beginning of the sample (type: double-precision number, default value "0"). The start time of a karaoke segment is the end time of the previous one, or the start time of the `Karaoke` element.

# Encoding of text streams

Using text streams in a 3GPP file or outisde the MPEG-4 Systems scene description is quite straightforward. All you need to do is add the text stream to your (existing) file with MP4Box. 

For example, adding a text track and an AVI file into a new 3GP file can be done in a single call:  
 `MP4Box -3gp -add movie.avi -add text.ttxt dest.3gp`.

_Note:_ By default, when importing ttxt with MP4Box, the duration of the last text sample is the same as the duration of the previous sample. To specify the duration of the last sample, add an extra text sample at the end with no text content.

Note that you can use either SRT/SUB subtitles or TTXT files with the `-add` option. Other subtitles formats are currently not supported.

Using text streams within MPEG-4 scene description is much more tricky (is it?). You will add an ObjectDescriptor to your scene as you add an audio/video object, specifying the file name with the usual MuxInfo. **Note**: when using SRT/SUB, make sure you don't have `TextNode` specified in the MuxInfo, as this ALWAYS triggers subtitles to BIFS conversion and not 3GPP timed text.

The second step is controlling the new text object in the same way you control an audio or visual object. This is done through the AnimationStream node. Instead of controlling a BIFS stream, you can start/stop/play the text stream with this node.

# GPAC Implementation

*   During playback, GPAC does not support dynamic highlighting (Karaoke) nor soft text wrapping (wrapping is only done at newline characters).
*   GPAC should support vertical text drawing and alignment, but this has not be really tested yet.
*   GPAC should support UTF-16 text in decoding and hinting, but DOES NOT SUPPORT UTF-16 text at encoding time yet.
*   GPAC should support text streams placed below the main video or on its right, but cannot currently handle text streams placed above or on the left of the main video.

# Sample TTXT Files

The following files are taken from a 3GPP test suite and are pure translations to TTXT with MP4Box. They should give you a good overview of the format and help you author your own test tracks.

Download GPAC TTXT sample streams [.zip](http://gpac.sourceforge.net/downloads/ttxt_sample_streams.zip) [.tgz](http://gpac.sourceforge.net/downloads/ttxt_sample_streams.tar.gz)


