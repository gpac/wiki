# Overview
GPAC provides a highly configurable multimedia player through the [compositor](compositor) filter.

This player is much more than a traditional audiovisual player because, in addition to its capabilities to play most video or audio formats and its support for most of the existing delivery protocols, it focuses on graphics, animations and interactivity technologies.

The player can playback audiovisual content mixed with 2D or 3D content in the following formats: MPEG-4 BIFS and LASeR, W3C SVG, W3D VRML and X3D. The player also supports 360 video (EQR projection only for now), and QTVR images (Cube Maps).


## GUI Media player

The GUI media player mode runs the compositor filter with an interactive GUI.
It can be used to play interactive BIFS, VRML or SVG files, 360 videos, select streams in a session, view statistics, etc.

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

## Simple Media player

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


## Basic Media player

In most cases your content consists of one audio stream and one video stream and composing them together is not needed.
You can play such content using:
```
gpac -play source

#alias equivalent is
gpac -i source aout vout
```

See [this howto](filters-playback) for more details.
 
# Checking playback capabilities

For the purpose of evaluating if the compilation and installation steps went well, the GPAC framework provides a test content in the form of an MPEG-4 file containing an MPEG-4 BIFS stream testing JavaScript, text rendering, 2D vector graphics and OpenGL playback, image display (PNG stream), video playback( MPEG-4 video Part 2 stream) and audio playback (AAC stream).

This file is called [gpac_cfg_test.mp4](https://github.com/gpac/gpac/raw/filters/share/doc/gpac_cfg_test.mp4)  and is located in the share install directory of GPAC (/usr/share/gpac/, \Program Files\GPAC\share\) and 

If the installation step went well, you should see this result and hear the audio:

[[/images/test_compositor_ok.png]]

Otherwise you should see at least one of the following lines:

[[/images/test_compositor_ko.png]]

# Configuring the player
Currently there is no graphical interface for configuring the player (old GUI apps have been deprecated).

You will need to modify the GPAC configuration file for persistent modifications, or pass the appropriated options and filter arguments (see [[core_config]])


