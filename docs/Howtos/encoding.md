---
tags:
- transcode
- pid
- ffmpeg
- data
- codec
- filter
- connection
- encrypt
- session
- pipeline
- compression
- stream
- raw
- encode
- hevc
- scene
- link
- media
- signal
- isobmff
- decoder
- h264
- track
- option
- profile
- mp4
- graph
- source
- chain
- input
- isomedia
- mpeg
- encoder
---



# Overview {: data-level="all" }

We discuss here how to use encoders in GPAC.  

GPAC filter graph resolution always targets the shortest possible path between two filters to link them. This implies that for a given source, encoders may or may not be triggered depending on the destination.  
For example, if the source is an AAC file and the destination is an ISOBMFF file, since ISOBMFF accepts AAC data inputs, no encoder will be used. But if the source is an AAC file and the destination is an MP3 file, the graph resolver will load a decoder and an MP3 encoder to move source data from AAC to MP3.


# Encoding Video {: data-level="beginner" }

## Encoding from a raw video file

```gpac -i source.yuv:size=1280x720 -o test.avc```

The above command will encode the `source.yuv`  YUV420 8-bits into AVC|H264 using default encoding parameters of the encoder used. This may load a filter chain to adapt the PCM data to another format (floating point, etc ...).

```gpac -i source.yuv:size=1280x720 enc:c=avc -o test.mp4```

The above command will encode the `source.yuv`  YUV420 8-bits into AVC|H264 using default encoding parameters of the encoder used and mux this into MP4. 


__Discussion__  
Prior to GPAC 2.0, the following command had to be used:
```gpac -i source.yuv:size=1280x720 enc:c=avc @ -o test.mp4```
The link directive `@` is used here to prevent the raw YUV/RGB data PID to link against the `test.mp4` destination which would accept it. When a PID can directly connect to a filter without any adaptation chain, the graph resolver will not try to connect it to any other filters unless sourceIDs are explicitly set, as described in the [general documentation](filters_general#filter-linking-link). GPAC 2.0  and above simplified command line processing to avoid link directives in most cases.

The `enc` filter is an [internal reserved filter class](filters_general#specifying-encoders-and-decoders) used by GPAC to load an encoder satisfying the format given by `c=`. This means that if several encoders provide this format, the first one with the highest priority will be used.

You can directly call your preferred encoder rather than letting the link resolver pick it for you:

```gpac -i source.yuv:size=1280x720 ffenc:c=avc -o test.mp4```

This will explicitly load the FFmpeg encoder to do the job.

Note that for `ffenc`, since the filter provides all encoders supported by your FFmpeg build, you may have several choices within FFmpeg itself. To specify the true desired codec rather than the format, use the codec name directly:

```
gpac -i source.yuv:size=1280x720 enc:c=libx264 -o test.mp4
gpac -i source.yuv:size=1280x720 enc:c=libx264rgb -o test.mp4
```
__Warning: Hardware encoders of FFmpeg have not been tested yet!__
 
## Transcoding from a non raw video file

```gpac -i source.mp4 c=avc -o test.avc```

The above command will encode the video track in  `source.mp4`  into AVC|H264 using default encoding parameters of the encoder used and dump this as Annex B format (start codes).  

__Discussion__  
Prior to GPAC 2.0, the following command had to be used:
```gpac -i source.mp4 enc:c=avc @ -o test.avc```
As explained previously, the link directive `@` ensures that we do the transcoding. If we omit this directive and the `source.mp4` file has an AVC|H264 track in it, this track will simply be dumped to `test.avc`with no transcoding used. However, if we omit this and the file has video track __NOT__ in AVC|H264 format, the video will be transcoded.

## Setting encoder parameters

Currently, all encoders audio and video in GPAC are using FFmpeg. We therefore only illustrate encoder parameters with the [ffenc](ffenc) filter.

```gpac -i source.mp4 c=avc:b=2M -o test.avc```

The above command will encode the video track in  `source.mp4`  into AVC|H264 at 2 mbits per seconds.

```gpac -i source.mp4 c=avc:fintra=2:b=500k -o test.avc```

The above command will encode the video track in  `source.mp4`  into AVC|H264 at 500 kbps and enforce intra frames using [fintra](ffenc) every 2 seconds. This doesn't prevent the encoder to produce intra frames within this period (e.g. scene cut), but ensures you always have IDRs at the right period. This is obviously designed for HTTP Adaptive Streaming.


```gpac -i source.mp4 c=avc::x264-params=no-mbtree=1:sync-lookahead=0::profile=baseline -o test.avc```

The above command will encode the video track in  `source.mp4`  into AVC|H264 and pass two options to FFmpeg encoder:

-  `x264-params`, with value `no-mbtree=1:sync-lookahead=0`
-  `profile`, with value `baseline`

__Discussion__  
Note the usage of double colon in the command line. As explained [here](filters_general#specifying-encoders-and-decoders), this prevents the filter resolver to interpret arguments of `x264-params` as arguments of the ffenc filter; this is needed here since both gpac and libx264 use `:`-separated list of `key=value` pairs. Another possibility would be to change the set of separators used by GPAC using [-seps](gpac_general#seps). 

To get a list of all generic options supported by the [ffenc](ffenc) filter, use `gpac -h ffenc`.  

To get a list of all options supported by a given encoder of the ffenc filter, for example libx264, use `gpac -h ffenc:libx264`.

```gpac -i source.mp4 enc:c=avc:pfmt=yuv2 -o test.avc```
The above command will encode the video track in  `source.mp4`  into AVC|H264, converting the source data to YUV 422 8bit planar.

__Discussion__  
FFmpeg usually comes with several variations of the same coding type, with different pixel format supported. For example, AVC|H264 encoding can use both `libx264` and `libx264_rgb` encoders. If the source data is decoded into RGB by the decoder, the `ffenc` filter will match the `libx264_rgb` encoder as supporting RGB input and AVC format. The resulting file may be in a profile not supported by most devices !  

Setting the pixel format using [pfmt](ffenc) will make sure you encode in YUV format; alternatively, you can also enforce the encoder used by setting `ffc=libx264`. 

_Note: The `pfmt` option is a generic option of all present and future encoders in GPAC, while `ffc` option is specific to FFmpeg encoder._
   

## Changing Resolution

You can use the [ffsws](ffsws) filter to rescale videos in your pipeline:
 

```gpac -i source.mp4 ffsws:osize=1280x720 c=avc:b=1m -o test.avc```

This will resize (downscale or upscale) input to a resolution of 1280x720 without checking aspect ratio, and encode to AVC at 1 mbps. To keep aspect ratio, use `ffsws:osize=1280x720:keepar=full`.


# Encoding Audio {: data-level="beginner" }
## Encoding from files

This is basically the same as video

```gpac -i source.pcm:sr=48k:ch=2 -o test.aac```

The above command will encode the `source.pcm` 48000 Hz stereo signed 16 bit PCM into AAC using default encoding parameters of the encoder used. This may load a filter chain to adapt the PCM data to another format (floating point, etc ...).
 
```gpac -i source.mp4 enc:c=aac -o test.mp4```

The above command will encode the `source.mp4` audio tracks into AAC, even if the track is already in AAC format, and use FFmpeg `aac` encoder for the job. Note that the `ffc` option will only be used by the ffenc filter. If another filter provides AAC encoding and is used to encode the stream, the `ffc` option will likely be reported as not used by the filter session. 

## Changing sample rate

You can use the [audio resampler](resample) filter to change your input signal characteristics:

```gpac -i source.mp4 resampler:osr=48k:och=2 -o test.aac:b=128k```

This will resample the input signal to stereo 48000 Hz and encode to AAC at 128k.

# Transcoding AV file {: data-level="beginner" }

Combine the above tow steps:

```gpac -i av_source c=avc:b=2m c=aac:b=128k -o test.mp4```


If you only want video transcode, omit the audio encoder:

```gpac -i av_source c=avc:b=2m -o test.mp4```

If you only want audio transcode, omit the video encoder:

```gpac -i av_source c=aac:b=128k -o test.mp4```
