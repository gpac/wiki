# Overview {: data-level="all" }

We discuss here how to work with RAW, uncompressed audio and video data in GPAC.  


# RAW Video {: data-level="beginner" }

## Extracting raw video from a file

```gpac -i source.mp4 -o test.yuv```

The above command will dump the video content from `source.mp4` into a YUV420 8-bits `test.yuv`.   
If the source contains other tracks such as audio or text, they will be ignored as [described here](filters_general#general).  

__Discussion__  
In GPAC, file extension are used to infer the type of data being produced. Note that unless data probing is disabled, this is not the case for input files. 
For most supported media types, this association is given by the [writegen](writegen) filter, in charge of forwarding media streams of type `audio`, `video`, ... into data streams of type `file`. For more information on codec <-> file extension associations, check the writegen filter capabilities using `gpac -hh writegen`.

For raw formats, the writegen filter performs a PID capability negotiation to enforce a pixel format (or an audio format) to match the type indicated by the file extension. 
- The association between pixel format and file extension is [given here](filters_properties#pixel-formats).    
- The association between audio format and file extension is [given here](filters_properties#audio-formats).    


You can enforce the format even when using a different extension. 

```gpac -i source.mp4 -o test.foo:ext=yuv```


You are obviously not limited to physical file output, this works as well with pipes and sockets:

```
gpac -i source.mp4 -o pipe://mypipe:ext=yuv
gpac -i source.mp4 -o tcp://127.0.0.1:1234/:ext=yuv
gpac -i source.mp4 -o udp://127.0.0.1:1234/:ext=yuv
```

Note that in case of pipes or socket, the `ext` option shall be set to the desired format to solve the chain. See [pipes](pipes) and [sockets](sockets).
 
## Extracting and resizing raw video from a file

```gpac -i source.mp4 ffsws:osize=128x128 -o test.yuv```

The above command will dump the video content from `source.mp4` into a YUV420 8-bits resized to 128x128 pixels `test.yuv`.   

__Discussion__  
Prior to GPAC 2.0, the following command had to be used:

```gpac -i source.mp4 ffsws:osize=128x128 @ -o test.yuv```

The link directive `@` is used to prevent the decoded YUV/RGB data PID to link against the `test.yuv` destination, by enforcing the destination to only accept PIDs coming from `ffsws`, as described in the [general documentation](filters_general#filter-linking-link). GPAC 2.0 and above simplified command line processing to avoid link directives in most cases.


The simplest way to resize a video in GPAC at the current time is to use the FFmpeg-based [rescaler](ffsws).

The [writegen](writegen) filter used in the extraction process can be used to specify an extraction range using its [start](writegen#start) and [dur](writegen#dur) options:

```gpac -i source.mp4 ffsws:osize=128x128 -o test.yuv:start=10:dur=5```

This will resize and extract the video from start time 10s until end range 15s.

## Extracting multiple raw videos from a file

```gpac -i source.mp4 -o dump_$ID$.yuv```

The above command will dump each video track from `source.mp4` into a YUV420 8-bits  `dump_N.yuv` with `N` the video track ID, thanks to [URL templating](filters_general#url-templating).

## Extracting Frames from a file

```gpac -i source.mp4 -o dump_$num$.yuv```

The above command will dump each video frame  from `source.mp4` into a YUV420 8-bits  `test_N.yuv`, with `N` the frame number.

You can also simply extract to compressed formats by changing destination type (here dump to PNG):
```gpac -i source.mp4 -o dump_$num$.png```

Resizing images while extracting is similar as previously:

```gpac -i source.mp4 ffsws:osize=128x128 -o dump_$num$.png```

The [writegen](writegen) filter used in the extraction process can be used to specify an extraction range using its [start](writegen#start) and [dur](writegen#dur) options:

```gpac -i source.mp4 ffsws:osize=128x128 -o dump_$num$.png:start=10:dur=5```

This will resize and extract the video frames from start time 10s until end range 15s.


## Using raw video input
```gpac -i source.yuv:size=128x128 vout```

The above command will load a raw YUV420 planar 8-bits file using a resolution of 128x128 pixels, and display it using the [video output](vout) filter. The default frame rate is 25, as indicated in [the raw video reframer](rfrawvid).

# RAW Audio {: data-level="beginner" }
This is very similar to raw video.

## Extracting raw audio from a file

```gpac -i source.mp4 -o test.pcm```

The above command will dump the audio content from `source.mp4` into a 16-bit little endian PCM  `test.pcm` using sample rate and number of channels of source media.   

## Extracting and resampling raw audio from a file

```gpac -i source.mp4 resample:sr=44100:ch=2 -o test.pcm```

The above command will dump the audio content from `source.mp4` into a 16-bit little endian PCM at   `test.pcm` using 44100 Hz sample rate and two channels.   

## Using raw audio input
```gpac -i source.pcm:sr=44100 aout```

The above command will load a raw  16-bit little endian PCM  file using 44100 Hz sample rate, and play it using the [audio output](aout) filter. The default channel count is 2, as indicated in [the raw audio reframer](rfpcm).

# RAW Audio and Video {: data-level="beginner" }
## Direct extraction

```gpac -i source.mp4 -o test.pcm -o test.yuv```

The above command will do a one pass raw extraction of audio and video content from `source.mp4`.   

## Extraction with processing of raw data

```
gpac -i source.mp4 resample:sr=44100:ch=2 ffsws:osize=128x128 -o test.pcm -o test.yuv
#or with link directives
gpac -i source.mp4 resample:sr=44100:ch=2 ffsws:osize=128x128 -o test.pcm -o test.yuv
```

The above command lines will do a one pass raw extraction of audio and video content from `source.mp4`, performing audio resampling to 44100 Hz stereo and video resizing to 128x128 pixels.   

