# HLS Generation

GPAC can be used to generate HLS rather than MPEG-DASH manifest formats, and can also be used to generate the two manifests in one pass.
The guidelines on segmentation are the same as with general dashing, please refer to the rest of the wiki for more info on this.
HLS generation is supported by both [MP4Box](MP4Box) and [gpac](gpac_general).

## HLS with one file per segment
Generating an HLS with one file per media segment is equivalent to dashing under the live profile.

```
MP4Box -dash 1000 -profile live -out res/live.m3u8 source1 source2 
gpac -i source1 -i source2 -o res/live.m3u8:profile=live
```


This will by default generate ISOBMFF / fmp4 files.  To generate MPEG-2 TS files, use:  
```gpac -i source1 -i source2 -o res/live.m3u8:profile=live:muxtype=ts```

Note that gpac will by default generate non-multiplexed outputs. To generate a multiplexed file, you need to flag inputs as belonging to the same quality , or `Representation` in DASH terminology:  
```gpac -i video:#Representation=main -i audio:#Representation=main -o res/live.m3u8:profile=live:muxtype=ts```

## HLS with a single file for all segments
Generating an HLS with one file per quality is equivalent to dashing under the onDemand profile.

```gpac -i source1 -i source2 -o res/live.m3u8:profile=onDemand```


## Specifying manifest names
The child playlist names are by default the manifest (master playlist) radical suffixed with `_1`,  `_2`  ...
This can be changed by using the PID property `HLSPL` :

```gpac -i source1:#HLSPL=video.m3u8 -i source2:#HLSPL=audio.m3u8 -o res/live.m3u8```

This will generate `live.m3u8`, `video.m3u8` and `audio.m3u8`


# Renditions
## Grouping
When several renditions are possible for a set of inputs, the default behavior is as follows:

- if video is present, it is used as the main content
- otherwise, audio is used as the main content

The main content is repeated for each combination with other content. For example with 1 video and 3 audios, you will have:
```
#EXT-X-STREAM-INF:BANDWIDTH=1000000,CODECS="avc1.42C01F,mp4a.40.2",RESOLUTION=1280x720,FRAME-RATE="25",AUDIO="audio1"
video.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,CODECS="avc1.42C01F,mp4a.40.2",RESOLUTION=1280x720,FRAME-RATE="25",AUDIO="audio2"
video.m3u8

#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio1",NAME="1",LANGUAGE="fra",AUTOSELECT=YES,URI="audio_1.m3u8",CHANNELS="1"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio2",NAME="2",LANGUAGE="eng",AUTOSELECT=YES,URI="audio_2.m3u8",CHANNELS="1"
```

This behavior can be changed by specifying a group for input streams using the PID property `HLSGroup` :
```gpac -i source1 -i audio1:#HLSGroup=MyAudio -i audio2:#HLSGroup=MyAudio -o res/live.m3u8```

This will result in:

```
#EXT-X-STREAM-INF:BANDWIDTH=1000000,CODECS="avc1.42C01F,mp4a.40.2",RESOLUTION=1280x720,FRAME-RATE="25",AUDIO="MyAudio"
video.m3u8

#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="MyAudio",NAME="1",LANGUAGE="fra",AUTOSELECT=YES,URI="audio_1.m3u8",CHANNELS="1"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="MyAudio",NAME="2",LANGUAGE="eng",AUTOSELECT=YES,URI="audio_2.m3u8",CHANNELS="1"
```

**Warning**  
**__GPAC will not check if streams within a group have the same codec properties, you must only put in the same group streams with the same coding configurations, i.e. streams for which the `CODECS` parameter is the same.__**

## Naming
The component names are the DASH representation ID. By default this is an integer value, but it can be set to whatever suits you:

```gpac -i source1 -i audio1:#HLSGroup=MyAudio:#Representation=Soustitres -i audio2:#HLSGroup=MyAudio:#Representation=Subtitles -o res/live.m3u8```

This will result in:

```
#EXT-X-STREAM-INF:BANDWIDTH=1000000,CODECS="avc1.42C01F,mp4a.40.2",RESOLUTION=1280x720,FRAME-RATE="25",AUDIO="MyAudio"
video.m3u8

#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="MyAudio",NAME="Soustitres",LANGUAGE="fra",AUTOSELECT=YES,URI="audio_1.m3u8",CHANNELS="1"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="MyAudio",NAME="Subtitles",LANGUAGE="eng",AUTOSELECT=YES,URI="audio_2.m3u8",CHANNELS="1"
```
# Dual DASH + HLS Generation

GPAC can generate a manifest for both HLS and DASH by using the [dual option](dasher#dual).


```gpac -i source1 -i source2 -o res/live.mpd:dual:profile=live```

This will generate `live.mpd`and `live.m3u8` together with one file per segment produced.

```gpac -i source1 -i source2 -o res/live.m3u8:dual:profile=onDemand```

This will generate `live.m3u8` and `live.mpd` together with a single file per quality. Since the DASH profile is onDemand, the ISOBMFF file of each quality will also contain a segment index (not used in HLS).




