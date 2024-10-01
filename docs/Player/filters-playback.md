# Overview {: data-level="all"}

We discuss here how to work with audio and video outputs in GPAC in filter chains, we do not discuss media playback through [GPAC player](player).


# Video Output

## Regular playback

```gpac -i source.mp4 vout```

The above command will play the first video track (and only this track) found in `source.mp4`.

__Discussion__  
In GPAC, the video output filter is a wrapper around the video output modules available on your platforms. To get more information on the modules available for your build, use `gpac -h modules`.

The `vout` filter will by default try to use OpenGL for video output, and currently only supports a full-window (or fill-screen) quad rendering.

You can view the statistics and graph used by the session as usual with `-stats` and `-graph` options.

```gpac -i source.mp4 vout:fullscreen```
The above command will launch the display in full-screen mode


```gpac -i source.mp4 vout:wsize=1280x720:wpos=100x100```

The above command will launch the display at 1280x720 resolution, keeping this resolution regardless of the input video resolution. It will also place the window at screen coordinate {100,100} (if supported by the underlying video output module).

## Advanced playback

```gpac -i source.mp4 vout:speed=2:start=4```

The above command will playback at twice the speed, starting at time 4 seconds.

```gpac -i source.mp4 vout:start=-0.5```

The above command will playback starting at time half the source duration.


```gpac -i source.mp4 vout:vsync=false```

The above command will start playback with vsync disabled, playing as fast as the GPU can handle it.


```gpac -i source.mp4 vout:speed=-1```

The above command will try to playback the source in reverse order, starting from the end.

__Discussion__  

Reverse playback may not work with all input formats. Furthermore, even if supported by the input format, it is likely that the video uses a compression scheme with predicted frames, in which case reverse playback will not be possible. However for MP4 inputs (and only them at the time being), the input demultiplexer allows backwards playback of full GOPs by reversing each GOP but keeping frames in decode order within the GOP. Long story short, using a rewinding filter might help in this case:

```gpac -i source.mp4 rewind vout:speed=-1```



```gpac -i source.mp4 vout:drv="X11 Video Output"```

The above command uses the [-drv](vout#drv) option to force the `X11 Video Output` module to be used for video output (see `gpac -h modules`).

# Audio Output
This is basically the same as video output.


```gpac -i source.mp4 aout```

The above command will play the first audio track (and only this track) found in `source.mp4`.

__Discussion__  
As with the video output filter, the audio output filter is a wrapper around the audio output modules in GPAC, which can be configured using [-drv](aout#drv) option (see `gpac -h modules`).

The default behaviour of the audio output filter is to use 100ms of sound data buffer, split in 2 buffers for audio output modules supporting this (DirectSound). It also uses a default input buffer of 100ms before starting the playback.

# AV Output
This is just a simple combine of the two

```gpac -i source.mp4 aout vout```

The above command will play the first audio and first video tracks (and only these tracks) found in `source.mp4`.

The above command is equivalent to the default [alias](gpac_general#using-aliases) `-play`:
 
 ```gpac -play source.mp4```
 
As usual with gpac, you can also monitor the various filters used during the session at run time:

```gpac -r -i source.mp4 vout```


