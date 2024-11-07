---
tags:
- mpd
- pid
- reframer
- data
- filter
- pipe
- sample
- session
- manifest
- pipeline
- frame
- stream
- xml
- bitstream
- sequence
- dump
- block
- link
- media
- cue
- segment
- isobmff
- property
- chunk
- track
- option
- profile
- mp4
- source
- chain
- input
- isomedia
- output
- sink
- dash
---



# Foreword
In this howto, we will study complex use cases for DASH and HLS (and sometimes SmoothStreaming) powered by GPAC.

Please make sure you have read most if not all of the server-side and client-side DASH documentation of GPAC before going on.

Some of these examples may work with MP4Box, however MP4Box does not support session interruption which can be quite useful for these examples.

We therefore illustrate these with [gpac](gpac_general), for which the session can be interrupted and flushed using `ctrl+c`.

# HAS reading
## Quick record examples

Record the session in fragmented MP4
```
gpac -i $HAS_URL -o grab/record.mp4:frag
```
Note that we specify [frag](mp4mx#store) option for the generated MP4 so that:

- we don't have a long multiplexing process at the end 
- if anything goes wrong (crash / battery dead / ...), we still have a file containing all media until the last written fragment. 

Record the session, max quality with no adaptation in fragmented MP4 and TS
```
gpac -i $HAS_URL --algo=none --start_with=max_q -o grab/record.mp4:frag -o record.ts
```

HAS to Multicast TS
```
gpac -i $HAS_URL --algo=none --start_with=max_q -o udp://224.0.0.1:1234/:ext=ts
```


## Quality splitting
The [DASH reader](dashin) can be configured through [-split_as](dashin#split_as)  to consider each quality in a HAS  manifest to be an independent media rather than part of an adaptation bundle.
This can be used for example to grab all qualities of a HAS session. For live cases, you will need to have enough bandwidth or a quite large server timeshift buffer !

For single file recording of all qualities:
```
gpac -i $HAS_URL:split_as -o grab/record.mp4:frag
```

For one file per source media recording of all qualities, using [filter chain templating](filters_general#templating-filter-chains):
```
gpac -i $HAS_URL:split_as -o grab/record_$PID$.mp4:frag:SID=#PID=
```
We must use chain templating here since the MP4 multiplexer would accept any number of input PIDs.

If your sources were multiplexed AV and you want to store a multiplex, simply use the `Representation` property instead of the `PID` property, since AV streams were part of the same representation (mux):
```
gpac -i $HAS_URL:split_as -o grab/record_$PID$.mp4:SID=#Representation=
```



## File forward mode
The [DASH reader](dashin) can be configured through [-forward=file](dashin#forward)  to deliver multiplexed files instead of demultiplexed media frames into the pipeline - see [here](dashin#file-mode) for more details. 
This can be combined with the `split_as`option to forward all files from the source.

The important thing to remember about this mode is that it changes the link capabilities of the `dashin` filter and consequently the filter must be explicitly created.

Recording on disk:
```
gpac -i $HAS_URL dashin:forward=file -o grab/record_$File$:dynext
```

Acting as an HTTP proxy:
```
gpac -i $HAS_URL dashin:forward=file -o http://localhost:8080/:gpac:rdirs=output_dir
```

In this mode, files grabbed are deleted according to the [-max_cache_segs](httpout#max_cache_segs) option.


[ROUTE](route) forwarding:
```
gpac -i $HAS_URL dashin:forward=file -o route://225.1.1.0:6000
```


## Segment forward mode

The [DASH reader](dashin) can be configured through [-forward](dashin#forward)  to insert segment boundaries in the media pipeline - see [here](dashin#segment-bound-modes) for more details.
 Two variants of this mode exist:

- `segb`: this enables `split_as`, DASH cue insertion (segment start signal) and fragment bounds signalling
- `mani`: same as `segb` and also forward manifests (MPD, M3U8) as packet properties.

This mode is quite useful to do some media processing on a DASH session and output the same segment names/duration and fragment structure. Processing could mean transcoding, encrypting/decrypting and so on.

Take for example:

```
gpac -i $HAS_URL reframer -o re_has.mpd
```
This will read the HAS session and invoke a dash segmenter which will operate with the default settings, i.e. 1s dash duration, ignoring completely the segmentation properties of the source.


When forcing segment boundaries signalling:
```
gpac -i $HAS_URL --forward:segb reframer -o re_has.mpd
```

then the dasher will operate in [cue-driven mode](dasher#cue-driven-segmentation) and will reproduce the same boundaries as the input, using the input default segment duration. It will also use the same file name for segments as the source ones.

By replacing the reframer with a media processor, for example an encrypter:

```
gpac -i $HAS_URL --forward:segb cecrypt:cfile=DRM.xml -o encrypted_has.mpd
```

this creates a DASH/HLS encryption gateway. And, as usual, the output can be a ROUTE session, an HTTP server or an HTTP push sink.


In this mode, the dasher will however recreate its own manifest. If the source manifest had extensions or features not handled by GPAC, they will get lost in the process.
To avoid this, the `mani` mode can then be used to tell the dasher to use the source manifest, patch it and republish it.
 
```
gpac -i $DASH_URL --forward:mani cecrypt:cfile=DRM.xml -o encrypted_dash.mpd
```


# HAS writing
## Explicit cue-driven segmentation 

If you have already encoded your media in an optimized way, you will likely have variable segment durations not compatible with regular dashing. 
You may also have IDR in the middle of your segments, but still do not want the dasher to cut there (for example because these in-between IDRs are not there for all qualities).

You can instruct the dasher to follow a list of cues telling it when to start a new segment.  The following shows a cue file listing the segment boundaries by sample (frame) number:
```
?xml version="1.0" encoding="UTF-8"?>
<DASHCues xmlns="urn:gpac:dash:schema:cues:2018">
<Stream id="1">
<Cue sample="101"/>
<Cue sample="201"/>
<Cue sample="301"/>
<Cue sample="351"/>
<Cue sample="476"/>
<Cue sample="601"/>
</Stream>
</DASHCues>
```

The XML syntax for cue files is detailed [here](dasher#cue-driven-segmentation).

This is then used as follows:
```
gpac -i source.mp4:#DCue=cues.xml -o dash.mpd:profile=ondemand
gpac -i source.mp4:#DCue=cues.xml -o dash.mpd:profile=live:stl
gpac -i source.mp4:#DCue=cues.xml -o hls.m3u8
```

If using DASH but not an on-demand profile,  you will need to use segment timeline [stl](dasher#stl) option, since the segment durations will likely vary a lot.


## Implicit cue-driven segmentation 
We have covered in the previous section usage of cues with the segment forward mode of the HAS reader. 

The `flist` filter also offers the same possibility, by inserting cues at each new file. You should however make sure your files have the same codecs !

 
```
#first segment, not fragmented
intro.mp4
#second segment, not fragmented
chap1.mp4
#and so on
```

You can now dash in the same way:

```
gpac -i playlist.txt:sigcues -o dash.mpd:profile=ondemand
gpac -i playlist.txt:sigcues -o dash.mpd:profile=live:stl
```

You can prepare one playlist per quality, and then dash everything (here using a global filter option rather than repeating it):
```
gpac --sigcues -i pl_low.txt -i pl_mid.txt -i pl_high.txt -o dash.mpd:profile=ondemand
```


## Manifest-only generation

The dasher can operate in manifest-only generation, read pre-fragmented input files and output DASH or HLS manifest. Look [here](dasher#manifest-generation-only-mode) for more details about this mode.
