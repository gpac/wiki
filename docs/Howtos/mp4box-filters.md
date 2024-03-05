# Overview

We discuss here how to use the [MP4Box](MP4Box-introduction) together with filters in GPAC.

As discussed [here](Rearchitecture), the following features of MP4Box are now using the GPAC filter engine:

- Media importing
- Media exporting
- DASHing
- Encryption
- File splitting

At the time being, only media importing and DASHing operations can be extended to use other filters.

# Media Importing

# Customizing source and mux parameters

It is possible to provide additional parameters to both source and destination during an import operations. Most MP4Box parameters are mapped to the filter engine and they have roughly the same names, but the opposite is not true (i.e. most options of the various filters in GPAC are not mapped as MP4Box options). 
- source options are declared using `:sopt:` separator
- multiplexer options are declared using `:dopt:` separator
 
All regular MP4Box options must be given before any `sopt` or `dopt`.

```
MP4Box -add source.264:sopt:blocksize=20k:dopt:maxchunk=1M -new file.mp4
```

The above command will instruct the [source](fin) to use a block size of 20k and the [destination](mp4mx) to limit the chunk size of the imported track to 1M.

As discussed [here](core_config#global-filter-options), you can pass these options as global parameters if you import a single source or if you want the option to apply to all sources:
```
MP4Box -add source.264 --blocksize=20k --maxchunk=1M -new file.mp4
```


__Discussion__   
Any option for sources can be used, see the general [filter documentation](filters_general). The importer works by using the [mp4 multiplexer](mp4mx) filter in sink mode using the file specified as output for MP4Box.
The filter graph can be seen by using the `fgraph` option:

```
MP4Box -add source.aac:fgraph -new file.mp4

Filters connected:
fin (src=source.aac:gpac:importer:index_dur=0:FID=1) (1)
-(PID source.aac) rfadts (0x7fca97d0e430)
--(PID source.aac) mp4mx (importer:file=0x7fca97e03cb0:SID=1#PID=1) (0x7fca97d080d0)
```

The filter statistics can be seen by using the `fstat` option:

```
MP4Box -add source.aac:fstat -new file.mp4
```

# Filtering input streams
Assume you have an input file with several tracks/media streams, such as two videos in AVC and HEVC, and audios in english and french, and you only want to import AVC and english audio from that source file.

With regular MP4Box usage, you would need to know the track IDs of the desired tracks. If you have a collection of such files with varying track IDs, you would need complex dumping and analyzing of the file tracks to extract their track IDs and import them.
```
#get number of tracks
nbt=`MP4Box -tracks source.mp4`
#for each track
MP4Box -infon i source.mp4
#grep AVC / eng / ... and decide if you want this track
```

Thanks to the filter design and [link syntax](filters_general#complex-links), you have a much simpler way to do this:
 
```
MP4Box -add source.mp4:dopt:SID=#CodecID=avc,#Language=eng -new dest.mp4
```
This will assign option `SID=....` to the destination filter (the file multiplexer). The SID syntax in this example will instruct the filter session to only connect PIDs with property `CodecID=avc` or with property `Language=eng` to the destination multiplexer. 

You can use any [property](filters_properties) defined in GPAC, and even check for multiple properties:

```
MP4Box -add source.mp4:dopt:SID=#CodecID=avc,#Language=eng#CodecID=aac -new dest.mp4
```


# Inserting a filter chain
 
__WARNING__
MP4Box 1.0 used the syntax `@@` to identify filter chains. The syntax is still supported in later versions, but does not allow for complex paths in the filter chain. It is recommended to use the new syntax, as illustrated in this howto.


It is possible to provide a filter chain to a source being imported in MP4Box.
```
MP4Box -add source.264:@reframer:saps=1 -new file.mp4
```

The above command will invoke the [reframer](reframer) filter with the [saps](reframer#saps) option. The filter will be inserted between the source and the destination. 

You can also play with [encoding](encoding):
 
```
MP4Box -add source.264:@enc:c=avc:fintra=2 -new file.mp4
```
The above command will invoke an encoding filter chain in AVC|H264 format with a forced intra period of 2 seconds. The filter will be inserted between the source and the destination. 
 
If your source is YUV (or PCM), you will have to insert source parameters using the `sopt`option:
```
MP4Box -add source.yuv:sopt:size=320x240:fps=30000/1001:@enc:c=avc:fintra=2 -new file.mp4
```
The above command will load the source file as a YUV 420 8 bits 320x240 @ 29.97 Hz.


 
You may also specify several paths for the filter chain:
```
MP4Box -add source.mp4:@ffsws:osize=160x120@enc:c=avc:fintra=2:b=100k@@ffsws:osize=320x240@enc:c=avc:fintra=2:b=200k -new file.mp4
```
The above command will the source and:

- rescale it to 160x120 and encode it at 100 kbps
- rescale it to 320x240 and encode it at 200 kbps


__Discussion__   
You may ask yourself whether using MP4Box or gpac is more efficient for such an operation:

-  When you add a single track using MP4Box to a new file, gpac and MP4Box are strictly equivalent. 
- If you add several tracks in one shot in a new file, gpac will be more efficient as a single filter session will be used to import all tracks, whereas MP4Box uses one filter session per `-add` operation (unless [-newfs](mp4box-gen-opts#newfs) is set).
- The filter architecture does not support (for the moment) reading and writing in the same file, so if you need to add a track to an existing file, you must use MP4Box for that.


# DASHing


It is possible to provide a filter chain to each source being DASHed with MP4Box.
```
MP4Box -dash 1000 -profile live -out session.mpd source.mp4:@reframer:saps=1 source.mp4
```
The above command will invoke a reframer filter forwarding only IDR and discarding other frames, allowing to create a trick mode representation and a regular representation.

 
```
MP4Box -dash 2000 -profile live -out session.mpd source.mp4:@enc:c=avc:fintra=2
```
The above command will invoke an encoding filter chain in AVC|H264 format with a forced intra period of 2 seconds.

```
MP4Box -dash 2000 -profile live -out session.mpd source.mp4:@enc:c=avc:fintra=2:@cecrypt:cfile=drm.xml
```
The above command will invoke an encoding filter chain in AVC|H264 format with a forced intra period of 2 seconds, followed by an encryption driven by the file `drm.xml`.


```
MP4Box -dash 2000 -profile live -out session.mpd source.mp4:@enc:c=avc:fintra=2:b=1M:#Representation=1@@enc:c=avc:fintra=2:b=2M:#Representation=2
```
The above command will invoke two encoding filter chains in AVC|H264 format with a forced intra period of 2 seconds, and bitrates of 1 mbps and 2 mbps. Note that we need to assign the representation IDs in this case, as MP4Box dashing consider by default all streams from a given source as part of the same representation.


__Discussion__   
The filter chain will be run at each invocation of MP4Box. Therefore it is not recommended to use complex chains (e.g. encoding or encrypting) and [-dash-ctx](mp4box-dash-opts#dash-ctx) or [-dash-live](mp4box-dash-opts#dash-live) together, as the content would be processed (encoded, encrypted) multiple times, at least up to the current DASH time. 

You may ask yourself whether using MP4Box or gpac is more efficient for such an operation. If  you don't use `-add` options, MP4Box and gpac are strictly equivalent, a single filter session is used by both to dash the content.

Note: sources to MP4Box for dashing are no longer restricted to MP4 files. The dasher filter will enforce MP4 output but processes any source:

```
MP4Box -dash 2000 -profile live -out session.mpd source.264 source.aac
```
The above command will invoke create a DASH session from non packaged AVC|H264 and AAC sources, using ISOBMFF as output format.

```
MP4Box -dash 2000 -profile live -out session.mpd:m2ts source.264 source.aac
```
The above command will invoke create a DASH session from non packaged AVC|H264 and AAC sources, using MPEG-2 TS as output format.
