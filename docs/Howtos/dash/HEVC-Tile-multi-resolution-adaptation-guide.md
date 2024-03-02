
This page gives a quick walk-through on how to build and play tiled HEVC sequences with multiple resolutions

# Foreword

Using multiple resolutions for tile-based streaming is quite different from tile-track approach [covered here](HEVC-Tile-multi-resolution-adaptation-guide).
Although the content preparation is roughly the same, combining tiles of different resolutions requires slice header and SPS/PPS rewrite, hence tile tracks cannot be used here.


# Content Preparation

Check the [HEVC Tile-based adaptation guide](HEVC-Tile-multi-resolution-adaptation-guide) for content preparation.

We recommend using source videos with 
- the same aspect ration (regular dash requirement)
- multiple of 64 (or max CU size if you tweek the encoder) for both width and height. Not doing so will likely result in decoding artefacts of the merged bitstream

## Packaging your video

You will need to package your raw HEVC bitstream, rewriting each tile as a stand-alone HEVC bitstream using the [hevcsplit](hevcsplit) filter:


```
MP4Box -add video_tiled.hvc:@hevcsplit -new video_tiled.mp4
```
Or using gpac:
```
gpac -i video_tiled.hvc hevcsplit -o video_tiled.mp4
```

For a NxM tiling, the resulting file will contain NxM independent HEVC video tracks.

You can view the result using:
```
gpac -i video_tiled.mp4 hevcmerge vout
```


You can check the motion constrained is well respected by removing a tile track from the file:

```
MP4Box -rem 4 video_tiled.mp4 -out test_tile_lost.mp4
gpac -i test_tile_lost.mp4 hevcmerge vout
```

## DASHing your video

Your video can be DASHed as any other video with MP4Box, for example

```
MP4Box -dash 1000 -profile live -out dash_tiled.mpd video_tiled.mp4
```

or with gpac:
```
gpac -i video_tiled.mp4 -o dash_tiled.mpd
#alternative version splitting tiles and tiling from raw bitstream in one pass
gpac -i video_tiled.hvc hevcsplit -o dash_tiled.mpd
```

The resulting MPD will contain as many adaptation sets are there are tile tracks in the input video(s), and each tile adaptation set will contain representations for each quality specified. 

## Live setup

Check the [HEVC Tile-based adaptation guide](HEVC-Tile-multi-resolution-adaptation-guide) for live setup, using hevcsplit instead of tilesplit.


# Content Playback

The logic of content playback is as follows:
- the MPD indicates SRD information and a GPAC extension for mergeable bitstream
- when the compositor is used, the [hevcmerge](hevcmerge) filter is automatically created to reassemble the streams
- otherwise (using vout), each PID is declared as an alternative to the other

A quick way to look at the output of the hevc merger filter is to run:
```
gpac -i dash.mpd hevcmerge vout
```

You will see the reconstructed tiles, very likely not in the order you would expect. You can comment out one of the qualities and check the result.
You can also set `--auto_switch=-1`, which will change qualities of tiles one after the other.

The reordering of the tiles into a proper texture cannot be done by the merger, due to the different tile sizes.
This reordering is done by the compositor filter (3D mode required), remapping texture coordinates to restore the proper layout:

```
#2D playabck without GUI
gpac -mp4c dash.mpd  

#2D playabck with GUI
gpac -gui dash.mpd

#VR playabck without GUI
gpac -mp4c dash.mpd#VR  

#VR playabck with GUI
gpac -gui dash.mpd#VR
```

The GUI will only indicate a single visual object, as all input streams are merged back to a single HEVC bitstream.

Tile adaptation logic is similar to the one using HEVC tile tracks.

The option [--skip_lqt](dashin#skip_lqt) is not supported in this mode.



# Custom tiling adaptation

You can devise your own custom tiling adaptation logic by using the general DASH [custom algorithm](jsdash).
 
