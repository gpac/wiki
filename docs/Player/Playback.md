# Introduction
GPAC can playback content in two main ways:
- through its interactive renderer using the [Compositor](compositor) filter
- through simple audio and video output filters.

This section of the wiki discusses various use cases for content playback with GPAC.

# Simple Playback

In most cases your content consists of one audio stream and one video stream and composing them together is not needed.
You can play such content using:
```gpac -play source```

The `-play` alias resolves to `-i @{1} aout vout`, so the above is equivalent to:
```gpac -i source aout vout```

If you only want to play the audio, use
```gpac -i source aout```

If you only want to play the video, use
```gpac -i source vout```

If you only want to play the video as fast as possible without dropping, use
```gpac -i source vout:vsync=0```


See [this howto](filters-playback) for more details.

# GUI Media player

The media player mode runs the compositor filter with an interactive GUI. It can be used to play interactive BIFS, VRML or SVG files, 360 videos, select streams in a session, view statistics, etc.

The player is invoked using [gpac](gpac_general) application:

```
#launching the GUI
gpac -gui

#launching the GUI with a target URL
gpac -gui source_url

```

The GUI accepts command-line options described in 
```
#help on GUI options
gpac -h gui
```

Using this command, the player will use 2 extra threads (i.e. `-threads=2` set by default). 

# Simple Media player

The simple media player mode runs the compositor filter without any GUI. It can be used to play interactive BIFS, VRML or SVG files, 360 videos, etc.

The simple player mode is invoked using [gpac](gpac_general) application:

```gpac -mp4c source_url```

Using this command, the player will use 2 extra threads (i.e. `-threads=2` set by default). 

The available options for this mode can be checked using:

```
#help on GUI options
gpac -h mp4c
```

_NOTE This mode is mostly used to debug scenes or when GUI is not needed._

 
