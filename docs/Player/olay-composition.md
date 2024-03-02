# Overview

We discuss here how to use GPAC's compositor for complex scenes or simple AV as a filter rather than the player.

 
# Simple AV scene: No compositor :)
Let's start with something simple before pulling out the hammer.  
Assume you have a source (MP4, RTP, DASH, ...) and you want to output the raw decoded data of this source to something such as [pipes](pipes) , [sockets](sockets) , or [raw data](raw-formats).

The simplest way to do this in GPAC is to use the [reframer](reframer) filter, enforcing it to use RAW data.
 
```
gpac -i $SOURCE reframer:raw -o dump.yuv
gpac -i $SOURCE reframer:raw -o dump.pcm
gpac -i $SOURCE reframer:raw -o dump.pcm -o dump.yuv
```

If you need to perform say resampling and resizing:

Prior to GPAC 2.0
```gpac -i $SOURCE reframer:raw:FID=1 resample:sr=48k:ch=1:SID=1 @ -o dump.pcm ffsws:osize=256x256:SID=1 @ -o dump.yuv```

With GPAC 2.0, syntax can be simplified (old syntax is still working)
```gpac -i $SOURCE resample:sr=48k:ch=1 ffsws:osize=256x256 -o dump.pcm -o dump.yuv```


 You can obviously replace the output filters with any filters you like.
```gpac -i $SOURCE reframer:raw @ -o pipe://videopipe:ext=yuv @1 -o udp://127.0.0.1:1234/:ext=pcm```

With GPAC 2.0:
```gpac -i $SOURCE reframer:raw -o pipe://videopipe:ext=yuv -o udp://127.0.0.1:1234/:ext=pcm```

# Complex AV scene

The [compositor](compositor) filter is a in charge of 2D+3D rasterization of natural and synthetic content and audio mixing, in a timed fashion. It is the core of [interactive rendering](Player) of gpac, but it can also be used in non-interactive mode to compose scenes in a filter chain. The compositor currently uses BIFS/BT/XMT, SVG/LASeR or VRML/X3D to describe multimedia scenes, scriptable through JavaScript.

## Overlaying 

Assume you want to insert some text and logo over a video. To do this with GPAC, you can:
- use a BIFS/BT/XMT scene
- use a [JavaScript drawing](evg) filter
- use the [AVMix](avmix) filter (see [howto](avmix_tuto) )

In this HowTo, we will only talk about using the compositor filter.

Design your scene, play it (`gpac -mp4c $BTSCENE`) to see the result. You can get a lot of inspiration from the gpac [BIFS tests](https://github.com/gpac/gpac/tree/master/tests/media/bifs).
In order to perform overlays, you need to use a Background2D node with a url `gpid://` cf [this example](http://download.tsi.telecom-paristech.fr/gpac/gpac_test_suite/resources/media/raw/overlay.bt). This will instruct the video to take the first visual PID connecting to the compositor and use it as source for this background node.

You can then compose the scene as follows:

```gpac -i $SOURCE -i $BTSCENE compositor -o dump.pcm -o dump.rgb```

In this mode, the compositor will generate a new visual frame for each incoming video frame (keeping its timing info), update the scene time based on that frame time and then render animations and mix audio according to this clock.  
This is a work in progress in GPAC, we might want to use the overlay facility with SVG or VRML/X3D as well (but these scene graphs don't have the convenient notion of 2D video background).

__Discussion__
The compositor is quite flexible and provides many options. It can be instructed to enforce a given output pixel format or audio format. When using 3D scenes, the compositor will output OpenGL textures as data packets. When using 2D scenes, it will output (unless enforced otherwise) regular data packets, by default in the source video pixel format. If the filter chains allows it, the video processing is done in place on the video input frame; this requires no other filter use these frames obviously. If the output format is enforced, video data will be copied. Audio is send as PCM data using the compositor audio options.


## Complex scenes
This is very similar to overlaying, except you don't need to use any specific `gpid://` url. Just take your scene and dump it:

```gpac -i $SCENE compositor -o dump.pcm -o dump.rgb```

