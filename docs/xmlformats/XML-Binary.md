It is possible to describe bit sequences when importing XML data. This applies to:

- [NHML](NHML-Format): some elements in the format may or must have child bitstream constructors

- [Encryption](Common-Encryption): a `DRMInfo` element may have child bitstream constructors

- Data loading in filter properties using `bxml@` syntax

- ISOBMFF [box patches](BoxPatch)

- Blob generation using MP4Box

The XML syntax used is a sequence of one or more `BS` elements specifying a value and a number of bits to use.
If a non `BS` element is found, its content is recursively parsed for `BS` elements.

### Syntax

```xml
<BS  bits="..." value="..." mediaOffset="..." mediaFile="..." dataLength="..." text="..." fcc="..."/>
```

### Semantics

-  `bits` : number of bits used to write the value
- `value` : integer value to write
- `float` : float value to write, (32 bits)
- `double` : double value to write (64 bits)
- `mediaFile` or `dataFile`: file to get data from
- `mediaOffset` or `dataOffset`: offset in the file
- `dataLength`: number of bytes to copy from the file
- `text` or `string`: writes text without trailing 0. If `bits` is set, first writes the size of the text string using `bits` bits
- `textmode`: if set to **yes**, opens the indicate file in text mode
- `fcc`: writes a four character code on 32 bits
- `ID128`: writes a 128 bit value given in hexadecimal
- `data64`: writes data given encoded in base64. If `bits` is set, first writes the size of the data using `bits` bits.
- `data`: writes data given in hexadecimal. If `bits` is set, first writes the size of the data using `bits` bits.
- `endian`: if set to **little**, writes integers in little endian formats (for 16 and 32 bits only), otherwise in big endian format.
- `base64`: writes tag as base64 encoded date. Possible values are:
  - `true`, `yes`: the given tag is written as base64, except if base64 context is active (see below)
  - `start`: starts base64 context or ignored if base64 context is already started : all following elements are written in a secondary bitstream
  - `end`: closes base64 context or ignored if no base64 context is started: the separate bitstream content is written as base 64 encoded data
- `base64Prefix`: when closing base64 context, prepend base64 string length on given number of bits. If 16, 32 or 64 bits are used, use `endian` to indicate endianness. Default value is 0 (no prefix).

_Note_: When recursive parsing is used, a new base64 encoding context is created for each child parsed.


## NHML Example

This example was used to generate files conforming to ISO/IEC 14496-18 AMD1. It shows how the bitstream constructor is used to create a custom font sample description fntC in the stsd entry called fnt1. The duration on the last sample is used to extend the duration of the track.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<NHNTStream version="1.0" timeScale="1000" trackID="1" mediaType="fdsm" mediaSubType="fnt1">
   <DecoderSpecificInfo>
      <BS id="size" bits="32" value="24" />
      <!-- box size is 4+4+3+strlen(TriodPostnaja)-->
      <BS id="type" fcc="fntC" />
      <BS id="fontFormat" bits="7" value="1" />
      <BS id="storeFont" bits="1" value="0" />
      <BS id="fontName" bits="8" text="TriodPostnaja" />
      <BS id="fontSubsetID" bits="7" value="1" />
      <BS id="reserved" bits="1" value="1" />
   </DecoderSpecificInfo>
   <NHNTSample DTS="0" isRAP="yes" mediaFile="TriodPostnaja\_subsets/TriodPostnaja\_CyrillicCaps.ttf" />
   <NHNTSample DTS="2000" isRAP="yes" mediaFile="TriodPostnaja\_subsets/TriodPostnaja\_CyrillicSmall.ttf" />
   <NHNTSample DTS="4000" isRAP="yes" mediaFile="TriodPostnaja\_subsets/TriodPostnaja\_LatinCaps.ttf" />
   <NHNTSample DTS="6000" isRAP="yes" mediaFile="TriodPostnaja\_subsets/TriodPostnaja\_LatinSmall.ttf" />
   <NHNTSample DTS="8000" duration="4000" isRAP="yes" mediaFile="TriodPostnaja\_subsets/TriodPostnaja\_symbols+numerals.ttf" />
</NHNTStream>
```

When used in an NHML sample, if a `BS` element describes file data (`dataLength` and/or `mediaOffset` are set) but no file is given, the source file is:

- the `mediaFile` indicated at the sample level, if present
- otherwise the `baseMediaFile` indicated at the NHML stream level, if present
- otherwise the media file associated with the NHML, e.g. `track.media` for `track.nhml`


### MP4Box XML binary generation

As of revision 5601, it is possible to convert an XML file with BS syntax element to a binary file directly using `MP4Box -bin source.xml` . The source file can be any XML file. BS element can furthermore be located in children nodes if needed.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<SomeRoot>
 <SomeChild>
  <BS id="size" bits="32" value="100" />
  <SomeOtherChild>
  <BS id="size" bits="32" value="20000" endian="little"/>
  </SomeOtherChild>
 </SomeChild>
</SomeRoot>
```

This example `source.xml` will generate a binary file containing 2 32-bits integers (first big endian, second little endian).

### Common Encryption binary generation
See [[Common Encryption]]

### Filter property specification using binary XML

```
gpac -i somesource:#MyProp=bxml@blob.xml ...
```

This example loads PID(s) from `somesource` and assigns them a property with name `MyProp` of type data with the property content set to the binarized XML in `blob.xml`.

### ISOBMFF blob patching using binary XML

```
xml
<?xml version="1.0" encoding="UTF-8" />
<GPACBOXES>

<Box path="moov-">
<BS fcc="GPAC"/>
<BS value="2" bits="32"/>
<BS value="1" bits="32"/>
</Box>

</GPACBOXES>
```

This box patch inserts at the beginning of the `moov` box a new box of type `GPAC` with a payload of 8 bytes `0x0000000100000002`.


### Base64 binary XML

```
<?xml version="1.0" encoding="UTF-8" />
<SomeRoot>
 <SomeChild>
  <BS bits="32" value="100" />
  <BS bits="32" value="1000" base64="start"/>
  <BS bits="32" value="10000"/>
  <BS bits="32" value="100000" base64="end"/>
 </SomeChild>
</SomeRoot>
```

This will write the value 100 in a 32 bit field big-endian, followed by the base64 data resulting of the encoding of the three values `1000`, `10000` and `100000` (all coded here as 32 bits big endian values).
