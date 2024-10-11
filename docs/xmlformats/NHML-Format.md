---
tags:
- pid
- data
- codec
- sample
- packet
- compression
- frame
- subsample
- xml
- stream
- hevc
- bitstream
- sequence
- scene
- media
- isobmff
- decoder
- property
- group
- box
- track
- profile
- mp4
- source
- input
- isomedia
- binary
- decoding
- mpeg
---



# NHML Overview
The `NHML`  (Network Hint Markup Language) format has been developed at Telecom Paris in order to provide import support on media formats not natively supported by GPAC, typically for ISOBMFF file constructions. It is an XML translation and extension of a binary format called [[NHNT Format]] used during the development of MPEG-4 Systems.

The NHML format is an XML-based description of a single media stream, allowing to specify media stream properties and media samples in GPAC.

To obtain some sample NHML files, simply use `MP4Box -nhml trackID srcFile`

Just like any XML file, the file must begin with the usual xml header. The file encoding SHALL BE UTF-8.

The root element of an NHML file is the `NHNTStream` element, containing zero or one `DecoderSpecificInfo` element and zero or more `NHNTSample` elements.

The `NHNTStream`, `NHNTSample`,`SAI` and `P` elements may use child [bitstream constructors](XML-Binary), allow assembling bytes and files as needed to construct the desired data.

## NHML Syntax

The following shows the different elements defined in NHML.
```
<?xml version="1.0" encoding="UTF-8" ?>
<NHNTStream  ... >
 <!-- decoder config from XML binary -->
 <DecoderSpecificInfo>
	<BS/>
 </DecoderSpecificInfo>

 <!-- regular sample -->
 <NHNTSample ... />    

 <!-- sample building its data from XML binary -->
 <NHNTSample ... >
  <BS  ... />
 </NHNTSample>
 
 <!-- sample with subsample definitions -->
 <NHNTSample ...>
 	<SubSamples>
		<SubSample ... />
		<SubSample ... />
	</SubSamples>
 </NHNTSample>

 <!-- sample using XML binary with subsample definitions-->
 <NHNTSample ...>
   <BS dataFile="file1"/>
   <BS dataFile="file2"/>
   <BS value="30" bits="16"/>
   <SubSamples>
	<SubSample sfile="file1" />
	<SubSample size="2" sfile="file2" />
   </SubSamples>
 </NHNTSample>

 <!-- sample with auxiliary info definitions using XML binary -->
 <NHNTSample ...>
  <SAI type="fooX">
   <BS value="0" bits="8"/>
  </SAI>
 </NHNTSample>

 <!-- stream reconfiguration -->
 <NHNTReconfig />

 <!-- sample with sample group description using XML binary -->
 <NHNTSample ...>
  <SAI id="g2" group="true" type="barZ">
   <BS value="0" bits="8"/>
  </SAI>
 </NHNTSample>

 <!-- sample with sample group description reference -->
 <NHNTSample ...>
  <SAI ref="g2"/>
 </NHNTSample>

 <!-- sample using XML binary -->
 <NHNTSample ...>
   <BS value="0" bits="8"/>
   <BS value="2" bits="32"/>
 </NHNTSample>

 <!-- sample with sample group description and using XML binary construction -->
 <NHNTSample ...>
  <Media>
   <BS value="24" bits="32"/>
  </Media>  
  <SAI group="true" type="barZ">
   <BS value="3" bits="8"/>
  </SAI>
 </NHNTSample>

</NHNTStream>
```
## NHNTStream

### Overview

The `NHNTStream` element describes stream properties applying throughout the stream.

### Defined Attributes
*   `streamType` : identifies the media streamType as specified in MPEG-4, either the integer value or [GPAC name](filters_properties#stream-types).
*   `mediaType` : indicates the 4CC media type (handler) as used in IsoMedia. Not needed if streamType is specified. Value Type: 4 byte string. Officially supported handler types are listed [here](http://www.mp4ra.org/handler.html).
*   `mediaSubType` : indicates the 4CC media subtype (codec) to use in IsoMedia. This subtype will identify the sample description used (stsd table). Not needed if streamType is specified. Value Type: 4 byte string. Officially supported codec types are listed [here](http://www.mp4ra.org/codecs.html).
*   `objectTypeIndication` : identifies the media type as specified in MPEG-4. For example, 0x40 for MPEG-4 AAC. Officially supported object types are listed [here](http://www.mp4ra.org/object.html).
*   `codecID` : codec identifier (needed if neither `mediaSubType` nor `objectTypeIndication` is set). Can be a 4CC or [GPAC codec name](filters_properties#codecs).
*   `timeScale` : indicates the time scale in which the time stamps are given. Value type: unsigned integer. Default Value: 1000 or sample rate if specified.
*   `width`, `height` : indicates the dimension of a visual media. Ignored if the media is not video (streamType 0x04 or mediaType "vide"). Value Type: unsigned integer.
*   `parNum`, `parDen` : indicates the pixel aspect ratio of a visual media. Ignored if the media is not video (streamType 0x04 or mediaType "vide"). Value Type: unsigned integer.
*   `sampleRate` : indicates the sample rate of an audio media. Ignored if the media is not audio (streamType 0x05 or mediaType "soun"). Value Type: unsigned integer.
*   `numChannels` : indicates the number of channels of an audio media. Ignored if the media is not audio (streamType 0x05 or mediaType "soun"). Value Type: unsigned integer.
*   `baseMediaFile` : indicates the default location of the stream data. If not set, the file with the same name and extension `.media` is assumed to be the source.
*   `specificInfoFile` : indicates the location of the decoder configuration data if any.
*   `trackID` : indicates a desired trackID for this media when importing to IsoMedia. Value type: unsigned integer. Default Value: 0.
*   `inRootOD` : indicates if the imported stream is present in the InitialObjectDescriptor. Value type: "yes", "no". Default Value: "no".
*   `DTS_increment` : indicates a default time increment between two consecutive samples. Value type: unsigned integer. Default Value: 0.
*   `headerEnd` : Number of bytes to copy from specificInfoFile (if not set, use the entire file). Value type: unsigned integer. Default Value: 0.
*   `gzipSamples` : compress samples using `gzip`, `deflate` or `none`. Default Value: `none`.
*   `gzipDictionary` : gzip dictionary to use, either `self` or path to dict file. Value type: string. Default Value: null.

The following attributes are used when creating custom sample description in IsoMedia (i.e. not natively supported by GPAC). Their semantics are given in the QT (and IsoMedia) file format specification.

*   `compressorName` : compressor name. Value type: string. Default Value: null.
*   `codecVersion` : codec version. Value type: unsigned integer. Default Value: 0.
*   `codecRevision` : codec revision. Value type: unsigned integer. Default Value: 0.
*   `codecVendor` : 4CC of codec vendor. Value type: 4 byte string. Default Value: null.
*   `temporalQuality` : temporal quality. Value type: unsigned integer. Default Value: 0.
*   `spatialQuality` : spatial quality. Value type: unsigned integer. Default Value: 0.
*   `horizontalResolution` : horizontal resolution. Value type: unsigned integer. Default Value: 0.
*   `verticalResolution` : vertical resolution. Value type: unsigned integer. Default Value: 0.
*   `bitDepth` : vertical resolution. Value type: unsigned integer. Default Value: 0.
*   `bitsPerSample` : indicates the number of bits per audio sample for an audio media. Ignored if the media is not audio (streamType 0x05 or mediaType "soun"). Value Type: unsigned integer.

The following attributes are used when creating custom XML-base sample descriptions:

* `xml_namespace`: XML namespace to advertise for XML-base sample entries. Type: string. Default Value: unspecified.
* `xml_schema_location`: XML schema location to advertise for XML-base sample entries. Type: string. Default Value: unspecified.
* `xmlHeaderEnd`:  Name of element at the end of the header. The XML source will be copied from first byte to end of this element to create the decoder specific info. Type: string. Default Value: unspecified.
* `text_encoding`, `encoding`: text encoding. Type: string. Default Value: null.
* `content_encoding`: content encoding (`gzip`, `deflate` or `none` accepted). This indicates the compression of the source (no compression is done by importer). Type: string. Default Value: null.
*   `auxiliaryMimeTypes` : auxiliary data mime types (for TTML images). Value type: string. Default Value: null.

The following attributes are used when creating 3GPP DIMS sample descriptions:

*   `profile` : DIMS profile. Type: unsigned integer. Default Value: 0.
*   `level` : DIMS level. Type: unsigned integer. Default Value: 0.
*   `pathComponents` : DIMS/LASeR path components. Type: unsigned integer. Default Value: 0.
* `useFullRequestHost`: DIMS full request host flag. Type: boolean. Default Value: no.
* `contains_redundant`: DIMS redundant, either `main` , `redundant`  or `main+redundant`. Default Value: unspecified.
* `content_script_types`: DIMS mime type for scripts. Type: string. Default Value: unspecified.
* `text_encoding`, `encoding`: text encoding. Type: string. Default Value: null.
* `content_encoding`: content encoding (`gzip`, `deflate` or `none` accepted). This indicates the compression of the source (no compression is done by importer). Type: string. Default Value: null.


The decoder config of an `NHNTStream` can be specified using [XML bitstream constructors](XML-Binary). To do this, the BS elements shall be encapsulated in a `DecoderSpecificInfo` element present in the children of the `NHNTStream` element. The content of the `DecoderSpecificInfo` element is then inserted:

- in the ESD (MPEG-4 Systems)
- or after the base sampleDescription (ISOBMFF generic), in which case the data should likely be formatted as a box (4 byte size, 4 byte type then payload).


## NHNTSample

### Overview

The `NHNTSample` element describes an access unit, or a fragment of an access unit.

Each element may contain zero or one `SubSamples` element.
Each element may contain zero or more `SAI` elements.

If an `NHNTSample` has the same decode time than the previous `NHNTSample`, it is a continuation fragment of the frame started at that time. In this case, the fragment packet has no timing info, no SAP info and no dependency info. Subsamples and side data should not be used in this case.

  
### Defined Attributes

*   `DTS` or `time` : decoding time stamp of the sample. If not set, the previous sample DTS (or 0) plus the specified `DTS_increment` or the previous sample `duration` is used. Value type: unsigned integer or `HH:MM:SS.ms`. Default Value: 0.
*   `duration` : sets the duration of the sample. The duration set on the last sample will change the track duration. Default Value: 0.
*   `CTSOffset` : offset between the decoding and the composition time stamp of the sample. Value type: unsigned integer. Default Value: 0.
*   `isRAP` : indicates if the sample is a random access point or not. Value type: "yes", "no" or SAP type value (0 to 5). Default Value: "no".
*   `isSyncShadow` : indicates if the sample is a sync shadow sample (IsoMedia storage only). Value type: "yes", "no". Default Value: "no".
*   `mediaOffset` : indicates the position of the first byte of this sample in the media source file. Value type: unsigned integer. Default Value: 0.
*   `dataLength` : indicates the size of this sample. Value type: unsigned integer. Default Value: 0.
*   `mediaFile` : indicates the media source file to use. If not set, the `baseMediaFile` is used. If  `base64,` prefix is present in the name, data is loaded from the attribute value. Value type: string. Default Value: null.
*   `xmlFrom` : if the source file is XML data, indicates the location of the first element to copy fom the XML document. The location can be "doc.start", "elt\_id.start" or "elt\_id.end". Elements are identified through their "id", "xml:id" or "DEF" attributes.
*   `xmlTo` : if the source file is XML data, indicates the location of the last element to copy fom the XML document. The location can be "doc.end", "elt\_id.start" or "elt\_id.end". Elements are identified through their "id", "xml:id" or "DEF" attributes.
*   `is-Scene` : DIMS is-scene flag. Value type: boolean. Default Value: `no`.
*   `is-RAP` : DIMS is-rap flag. Value type: boolean. Default Value: `no`.
*   `is-redundant` : DIMS is-redundant flag. Value type: boolean. Default Value: `no`.
*   `redundant-exit` : DIMS redundant-exit flag. Value type: boolean. Default Value: `no`.
*   `priority` : DIMS priority flag. Value type: boolean. Default Value: `no`.
*   `compress` : DIMS compress flag. Value type: boolean. Default Value: `no`.

A `NHNTSample` can use [XML bitstream constructors](XML-Binary) in its children. If it does, the sample data (if any) is extended with the result of the binarized XML of the children if no `Media` child is present, or with the result of the binarized XML of the `Media` child.

The `Media` wrapping is required when combining both  XML construction for sample data and `SAI` children.

__WARNING Support for `Media` wrapping requires GPAC 2.0 or above.__

## SubSamples
### Overview

The `SubSamples` element is used to give subsample information for the parent sample.

A `SubSamples` element contains one or more `SubSample` element.

__WARNING Only the first `SubSamples` element in an `NHNTSample` is parsed at the current time.__

__WARNING Support for `SubSamples` requires GPAC 2.0 or above.__

### Defined Attributes for `SubSamples` element
*   `flags` : flags for the subsample box, default is 0

### Defined Attributes for `SubSample` element
*   `size` : size in bytes of the subsample, 0 by default
*   `fsize` : add to `size` the size of the file indicated by this attribute, default is NULL
*   `textmode` : if `fsize` is set, open the file in text mode if this attribute is set to `yes`, `true` or `1` , default is `no`
*   `discardable` : indicates if the subsample data is discardable (value `yes`, `true` or `1`), default is `no`
*   `priority` : indicates the subsample data priority , default is 0
*   `codec_info` : indicates the codec specific parameters (default is 0) for the subsample, as unsigned int or as hexadecimal data (prefixed with `0x`)


## Sample Auxiliary Information
### Definition

The `SAI` element is used to associate auxiliary information to the parent sample. The children of this element must use [bitstream constructors](XML-Binary) to describe the data.

Auxiliary information will be tanslated by the ISOBMFF multiplexer as:

- sample group description with `grouping_type` value of `type` if `group` is set
- sample auxiliary information with  `aux_info_type` value of `type` if `group` is not set

An `SAI` element can be a reference to another `SAI` element, in which case the data is generated from the reference element. This avoids repeating the structure when reused (sample groups).

Several `SAI` can be specified for different auxiliary types.

__WARNING Support for `SAI` requires GPAC 2.0 or above.__

### Defined Attributes

*   `id` : string assigning ID to this SAI for later reuse
*   `ref` : string indicating a defined SAI to use. The first SAI found (starting from first defined sample) with matching ID will be used
*   `group` : boolean. If set to `yes`, `true` or `1`, indicates that this auxiliary info must be signaled as sample grouping in ISOBMFF, otherwise auxiliary sample info is used
*   `type` : 4CC of the auxiliary data or of the sample group
*   `aux_info` : 32bit integer for the auxiliary data (`aux_info_type_parameter`in ISOBMFF) or for the sample grouping (`grouping_type_parameter` in ISOBMFF)

### Example

```
<NHNTSample>
	<SAI type="fooZ" aux_info="0" group="1">
		<BS value="0" bits="8"/>
	</SAI>
</NHNTSample>
```
This defines a sample grouping with type `GPAC` and a value of '0' on 8 bits.

```
<NHNTSample>
	<SAI type="barZ" aux_info="0">
		<BS value="1" bits="8"/>
	</SAI>
</NHNTSample>
```
This defines a sample auxiliary data with type `GPAC` and a value of '1' on 8 bits.


## Properties

The `Properties` element can be used to set packet or PID properties as used in GPAC filters.
The element is a list of `P` elements. Each `P` element can be a regular property (built-in or user defined), or can use  [bitstream constructors](XML-Binary) to construct the property data.

For `NHNTStream` element, the first `Properties` child element declared before the first `NHNTSample` element is used, if any.
For `NHNTSample` element, the first `Properties` child element  is used, if any.

__WARNING Support for `Properties` requires GPAC 2.0 or above.__

### Defined Attributes for Properties

* `id`: assigns an ID of the element 
* `ref`: uses the first `Properties` element with given ID found in the document.

### Defined Attributes for P
* `type`: property type. For non built-in properties, defaults to string or to data if bitstream constructors are used. Ignored for built-in properties.
* `name`: property name
* `value`: property value
* `id`: assigns an ID of the element 
* `ref`: uses the first `P` element with given ID found in the document.

If `name` attribute is not set, the first non-recognized attribute name is the property name and its value the property value.

### Examples
```
<Properties>
	<P name="foo" value="32" type="uint"/>
	<P myProp="Toto">
		<BS value="3" bits="8"/>
	</P>
</Properties>
```
 

## NHNTReconfig

### Overview
The `NHNTReconfig` element reconfigures the media stream properties between samples. It may happen as often as desired, and has exactly the same syntax as the `NHNTStream` element. 

If a `DecoderSpecificInfo` element is needed, it must be set as a child of the  `NHNTReconfig` element.

```
<NHNTReconfig ...>
	<DecoderSpecificInfo>
		<BS .../>
	</DecoderSpecificInfo>
</NHNTReconfig>
```

If  `Properties`element is needed, it must be set as a child of the  `NHNTReconfig` element.

```
<NHNTReconfig ...>
	<Properties>
		<P .../>
	</Properties>
</NHNTReconfig>
```

__WARNING Support for `NHNTReconfig` requires GPAC 2.0 or above.__
