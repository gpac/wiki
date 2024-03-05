# CMAF Generation

GPAC can be used to generate DASH or HLS following the CMAF specification.


CMAF defines two structural brands `cmfc`and `cmf2`  for ISOBMFF-segmented content. 
The `cmfc` brand constraints:

- some default values in ISOBMFF boxes
- a single media per file
- a single track fragment per movie fragment (`moof`)
- a single track run per track fragment
- presence of ColorInformationBox and PixelAspectRatioBox in video tracks
- presence of a `tfdt` box in each track fragment
- no mix of clear and encrypted samples in a CMAF fragment (<=> DASH segment or HLS chunk)
- Restricted edit lists consisting of media skip only


The `cmf2`brand further restrict the `cmfc` brand for video tracks:

- no edit list shall be used
-  negative composition offset (`trun` version 1) shall be used
- sample default values shall be repeated in each track fragment
 
Activating CMAF is simply done by specifying a global filter option:
```
MP4Box -dash 1000 -profile live -out live/manifest.mpd --cmaf=cmfc source.mp4
MP4Box -dash 1000 -profile live -out live/manifest.mpd --cmaf=cmf2 source.mp4
```
or using option inheritance:
```
MP4Box -dash 1000 -profile live -out live/manifest.mpd:cmaf=cmfc
```

You can set the option per MPD if you need to generate both CMFC and CMF2 profiles:
```
gpac -i source.mp4 -o live/manifest.mpd:cmaf=cmfc @1 -o live2/manifest.mpd:cmaf=cmf2 
```

Note that usage of CMAF packaging is independent of the DASH profile chosen. 

# CMAF Multiplexing Validation status

_Note: Currently GPAC only ensures conformance of the container, not the codec level._

Color information, when not present in input file, is extracted from VUI if present or defaults to BT709 otherwise.

Constraints on SPS (VUI, cropping) and PPS  in AVC or HEVC are not checked for the moment.

Constraints on CENC (AVC slice header clear, bytesOfProtectedData multiple of 16 in `cenc` )  are not checked, it is assumed the encryption configuration is CENC compatible. Be careful when setting up your encryption - see [encryption XML format](Common-Encryption) for more details.


TTML packaging should be aligned with CMAF specification (injection of a `mime` box with properly formatted mime type in the sample description). 

