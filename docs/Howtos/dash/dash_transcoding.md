# Foreword

In this howto, we will study various setups for DASH transcoding. 

Please make sure you are familiar with [DASH terminology](DASH-basics) before reading. 

It is likely that your source media is not properly encoded for DASH or HLS delivery, most likely because:
- openGOPs are used 
- key-frame position do not match between your different qualities
- key-frame intervals are not constant

__Note__
Non-constant key frame interval is not problematic for on demand use cases, as most profiles can deal with it. 

You can use GPAC to transcode your content, and inject the result in a GPAC filter session. 

We assume GPAC 2.0 or above for command line syntax.

As usual in GPAC, the concepts presented here can be reused with different filter chains, for example input being a live source or output being a non-dash file.

# Single Quality Transcoding

To transcode a source to DASH using 2s segments to AVC|H264 single quality 1 Mbps and not modifying the audio:

```
gpac -i source_av.mp4 c=avc:b=1m -o dash/live.mpd:segdur=2
```

The segment duration will be passed to the encoder to force key frame insertion. If gpac still complains about open-gop present at segment boundaries, force encoder reset:

```
gpac -i source_av.mp4 c=avc:b=1m:rc -o dash/live.mpd:segdur=2
```

You can force an intra refresh frequency lower than the segment duration, for example 2s I-frames for 4s segments:

```
gpac -i source_av.mp4 c=avc:b=1m:fintra=2 -o dash/live.mpd:segdur=4
```
 

You can also transcode to HLS:

```
gpac -i source_av.mp4 c=avc:b=1m -o dash/live.m3u8:segdur=2
```

or to both HLS and DASH:

```
gpac -i source_av.mp4 c=avc:b=1m -o dash/live.m3u8:dual:segdur=2
```


You may also transcode the audio:

```
gpac -i source_av.mp4 c=avc:b=1m c=aac:b=64k -o dash/live.mpd:segdur=2
```

To transcode only non-aac tracks, you must use explicit PID linking (you may need to single-quot the link string to escape '!'):

```
gpac -i source_av.mp4 c=avc:b=1m @1#CodecID=!aac c=aac:b=64k -o dash/live.mpd:segdur=2
```

If no non-AAC audio tracks are present, you will get a warning indicating the AAC encoder was not used:
```
Filters not connected:
ffenc (c=aac:b=64k)
```


# Multiple Quality Transcoding
## Same resolution

To transcode in two bitrates your video, you must add explicit links between your encoders and the source (or desired filter in the source chain).

For example, to transcode video source to 1 mbps and 200 kbps streams:

```
gpac -i source_av.mp4 @ c=avc:b=1m @@ c=avc:b=200k @ @1 -o dash/live.mpd:segdur=2
```

We use here the `@@` link shortcut to get the first filter declared. This is equivalent to:

```
gpac -i source_av.mp4 @ c=avc:b=1m @1 c=avc:b=200k @ @1 -o dash/live.mpd:segdur=2
gpac -i source_av.mp4:FID=S c=avc:b=1m:SID=S:FID=V1 c=avc:b=200k:SID=S:FID=V2 -o dash/live.mpd:segdur=2:SID=V1,V2
```


If you need audio passthrough:
```
gpac -i source_av.mp4 @ c=avc:b=1m @@ c=avc:b=200k @ @1 @@#audio -o dash/live.mpd:segdur=2
```

The same command using explicit filter IDs:
```
gpac -i source_av.mp4:FID=S c=avc:b=1m:SID=S:FID=V1 c=avc:b=200k:SID=S:FID=V2 -o dash/live.mpd:segdur=2:SID=V1,V2,S#audio
```


If you need audio encoding:
```
gpac -i source_av.mp4 @ c=avc:b=1m @@ c=avc:b=200k @@ c=aac:b=64k @ @1 @2 -o dash/live.mpd:segdur=2
```

The same command using explicit filter IDs:
```
gpac -i source_av.mp4:FID=S c=avc:b=1m:SID=S:FID=V1 c=avc:b=200k:SID=S:FID=V2 c=aac:b=64k:SID=S:FID=A1 -o dash/live.mpd:segdur=2:SID=V1,V2,A1
```


## Multiple resolutions

To transcode in multiple resolutions your video, we will need the [rescaler](ffsws) filter.


```
gpac -i source_1080p.mp4 ffsws:osize=1280x720 @ c=avc:b=1m @@ c=avc:b=2m @ @1 -o dash/live.mpd:segdur=2
```

Obviously you can combine with the above approach to provide multiple bitrates for each resolution:

```
gpac -i source_1080p.mp4 @ ffsws:osize=1280x720 @ c=avc:b=1m @1 c=avc:b=500k @@ c=avc:b=4m @@ c=avc:b=2m @ @1 @2 @3 -o dash/live.mpd:segdur=2
```

If you specify the rescaler after the HD encoders:
```
gpac -i source_1080p.mp4 @ c=avc:b=4m @@ c=avc:b=2m @@ ffsws:osize=1280x720 @ c=avc:b=1m @1 c=avc:b=500k @ @1 @3 @4 -o dash/live.mpd:segdur=2
```

If you add more encoders, it may be simpler to understand the command line using explicit IDs:
```
gpac -i source_1080p.mp4:FID=S c=avc:b=4m:SID=S:FID=V1 c=avc:b=2m:SID=S:FID=V2 ffsws:osize=1280x720:SID=RZ c=avc:b=1m:SID=RZ:FID=V3 c=avc:b=500k:SID=RZ:FID=V4 -o dash/live.mpd:segdur=2:SID=V1,V2,V3,V4
```

# Live Transcoding

The concepts are the same, except that you may need to add a real-time reframer after your input if it is not realtime


```
gpac -i source_1080p.mp4 reframer:rt=on ffsws:osize=1280x720 @ c=avc:b=1m @2 c=avc:b=2m @ @1 -o dash/live.mpd:segdur=2:dmode=dynamic
```

Using explicit IDs

```
gpac -i source_1080p.mp4:FID=S reframer:rt=on:SID=S:FID=RT ffsws:osize=1280x720:SID=RT:FID=RZ c=avc:b=1m:SID=RZ:FID=V1 c=avc:b=2m:SID=RT:FID=V2 -o dash/live.mpd:segdur=2:SID=V1,V2:dmode=dynamic
```

