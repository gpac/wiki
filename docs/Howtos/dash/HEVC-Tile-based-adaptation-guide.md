GPAC supports HEVC tile-based adaptation in DASH. This page gives a quick walk-through on how to build and play such sequences.

# Content Preparation

You can check GPAC test suite [HEVC Tiling examples](https://github.com/gpac/testsuite/blob/filters/scripts/dash-srd-hevc.sh) for some example content, prepared following the following guidelines.

## Encoding your video

Thanks to our friends at [TUT](http://ultravideo.cs.tut.fi/#main), recent updates to the open-source [Kvazaar](https://github.com/ultravideo/kvazaar) encoder allow anyone to encode HEVC with motion constrained tiling. In order to perform tile-based adaptation in DASH, the tiles must be constrained in motion prediction, and each tile has to be encapsulated in one slice (typical configuration). 

Putting all your tiles in the same slice will not work, since the slice NALU(s) will likely not be split in different tracks, thereby forbidding individual downloads of tiles in DASH. In terms of Kvazaar encoding options, this means that you have to add to your usual command lines the following;

```
--tiles 3x3 --slices tiles --mv-constraint frametilemargin
```

This will instruct the decoder to use 3x3 uniform tiling for the encoding, with a single tile per slice in motion constrained mode. There are options in the Kvazaar encoder allowing you to specify a non-uniform tile grid, check the encoder usage/help.

## Packaging your video

You will need to package your raw HEVC bitstream with MP4Box, instructing it to split the tiles of each frame in different tracks, using the `:split_tiles` import switch:

```
MP4Box -add video_tiled.hvc:split_tiles -new video_tiled.mp4
```
Or using gpac [tilesplit](tilesplit) filter:
```
gpac -i video_tiled.hvc tilesplit -o video_tiled.mp4
```

For a NxM tiling, the resulting file will contain 1+NxM video tracks, a "base tile track" of type hvc2/hev2 containing parameter sets and/or SEI messages, if any, and NxM tile track of type hvt1 containing tile data.

You can check the motion constrained is well respected by removing a tile track from the file:

```
MP4Box -rem 3 video_tiled.mp4 -out test_tile_lost.mp4
```

You should then see a video with a clean cut, green area in place of the removed tile:

[![](https://gpac.io/files/2017/02/LostHEVCTile-300x177.png)](https://gpac.io/files/2017/02/LostHEVCTile.png)

You can also do this in one pass using gpac by combining  [tilesplit](tilesplit)  and  [tileagg](tileagg) filters:
```
gpac -i video_tiled.hvc tilesplit:tiledrop=2 tileagg -o test_tile_lost.mp4
```

__Note__
It is not recommended to discard the first tile track, as playback may be broken with most decoders (except OpenHEVC decoder). 

## DASHing your video

Your video can be DASHed as any other video with MP4Box, for example

```
MP4Box -dash 1000 -profile live -out dash_tiled.mpd video_tiled.mp4
```

or with gpac:
```
gpac -i video_tiled.mp4 -o dash_tiled.mpd
#alternative version splitting tiles and tiling from raw bitstream in one pass
gpac -i video_tiled.hvc tilesplit -o dash_tiled.mpd
```

The MPD will contain as many adaptation sets as there are tile tracks and tile base tracks in the source file. 

_NOTE:_ If you want to perform tile-based adaptation, you will need to encode several motion constrained tiled videos at various qualities, and DASH them as usual. Note however that GPAC support for HEVC tiles adaptation is for now limited to videos encoded with the same configuration (same SPS/PPS/VPS), so do not change your encoder settings too much except for the bitrate (especially, do not change the QP) and always work with the same source video resolution/bit depth and tiling grid.

The resulting MPD will contain as many adaptation sets are there are tile tracks and tile base tracks in one of the input video, and each tile adaptation set will contain representations for each quality specified. One such example is [available here](http://download.tsi.telecom-paristech.fr/gpac/SRD/srd_hevc/multi_rate/hevc_srd.mpd).

You can now playback your MPD using GPAC, and have fun with the different adaptation modes for tiling (through the GUI or through the configuration file).


## Live setup

If you want to produce a live feed of tiled video, you can either:
- produce short segments, package them and dash them using `-dash-live`, `dash-ctx` and `-subdur`, see discussion [here](https://github.com/gpac/gpac/issues/1648)
- produce a live session with a [tilesplit](tilesplit) filter.

GPAC does not have a direct wrapper for Kvazaar, but you can either:
- use a FFmpeg build with Kvazaar enabled (`--enable-libkvazaar` in ffmpeg configure) - check GPAC support using `gpac -h ffenc:libkvazaar`
- use an external grab+Kvazaar encoding and pipe its output into GPAC.

### Piping encoder output
Using external Kvazaar encoding, you will need to pipe its output into GPAC and inject a tilesplit filter before the dasher:
```
MP4Box -dash-live 1000 -profile live -out live.mpd source_pipe:@tilesplit 

gpac -i source_pipe tilesplit -o live.mpd

```
The drawback of this approach is that making multiple quality encodings becomes quite tricky and heavy.

### Kvazaar as a GPAC filter
When using FFmpeg Kvazaar encoding in GPAC you have more flexibility as the encoder is just another filter in the chain. Options are passed through `kvazar-params` option of libavcodec. Your typical options will be, for a 3x3 tiling: `kvazaar-params=tiles=3x3,slices=tiles,mv-constraint=frametilemargin,rc-algorithm=lambda` .

You can then setup a filter chain (here a 1 mbps encoding):
```
gpac -i source
 enc:c=libkvazaar:b=1m::kvazaar-params=tiles=3x3,slices=tiles,mv-constraint=frametilemargin,rc-algorithm=lambda
 -o dest
```

You can split the output of the encoder directly:
```
gpac -i source
 enc:c=libkvazaar:b=1m::kvazaar-params=tiles=3x3,slices=tiles,mv-constraint=frametilemargin,rc-algorithm=lambda
 tilesplit -o dest
```

The following is an example of a live tiled encoding from webcam using 2 qualities. Do not change Kvazaar options of the two instances, this could result in incompatible decoder configurations preventing tile adaptation to work.


```
gpac
  #kvazaar parameters passed as global meta arguments since they apply to all our kvazaar instances
 --kvazaar-params=tiles=3x3,slices=tiles,mv-constraint=frametilemargin,rc-algorithm=lambda 

 -i video:// 
 
 #setup a video rescaler for pixel format conversion (see below)
 ffsws:FID=S
  
 #first encoding at 1 mbps with tile splitter, forcing intra every second (see below)
 enc:SID=S:c=libkvazaar:b=1m:fintra=1:rc @ tilesplit:FID=1
 
 #second encoding at 200 kbps with tile splitter, forcing intra every second (see below)
 enc:SID=S:c=libkvazaar:b=200k:fintra=1:rc @ tilesplit:FID=2

 #dasher in dynamic mode, consuming only PIDs from tile splitters
 -o live.mpd:SID=1,2:dmode=dynamic
```


The resulting filter graph is quite fun (use `-graph` to check it) and shows:
- only one (or 0 depending on your webcam formats) pixel converter filter is used in the chain to feed both Kvazaar instances
- all tile PIDs (and only them) connecting to the dasher filter
- 21 output PIDs of the dasher: one for MPD, 2 x (1+3x3) media PIDs.

_Note_
In the above command, the `ffsws` filter is injected to make sure a single video conversion will be used. If not set, the PID capability negotiation will create a dedicated adaptation chain for each connection, resulting in two `ffsws` instances (working but less efficient).

As usual, the output does not need to be a file, you can output as an HTTP server or as an HTTP PUT sink, as discussed [here](LL-DASH), or even to a [ROUTE](route) session !

__Warning__
- You need to specify `rc-algorithm` option for Kvazaar to handle the `b` option. If not setting it, you will need to pass the `bitrate` option as part of the `kvazar-params` on each encoder instance, but then you won't be able to use global options.
- You MUST specify `rc` option for GOPs to be properly enforced in time, Kvazaar cannot currently close a GOP at any other place than its specified `period` option, it requires encoder reset. If you are sure no source frame drop will happen, you can omit `:rc:fintra=` and add `period=N` to Kvazaar options.



# Content Playback

In HEVC tile-based adaptation, the files corresponding to the different tiles after the DASH reader are automatically reassembled using the [tileagg](tileagg) filter into a single HEVC bitstream fed to the decoder. This means that a single video object is exposed to the player. The current DASH implementation for tiles creates a single download instance for the complete tile set, queuing segment requests one after the other (no parallel download of tiles, hence no low latency). This might change in the future.


In regular DASH+SRD mode (i.e., each video is an independently decodable stream), each video is exposed at the player and can be inspected independently in the GUI.


## 360 Video with HEVC tiling

If you want to experiment with DASH adaptation for 360 video in GPAC, you will need to follow the above guide using an equirectangular projection video, and play the resulting MPD as follows:

```
gpac -gui DASH_URL#VR
gpac -mp4c DASH_URL#VR
```

If you open a URL through the GUI, add `#VR` at the end of the URL. If you open a file through the GUI, long-click on the file and then select "View as 360".

In 360 navigation when the DASH [tile_mode](dashin#tile_mode) option is set to `none`, the DASH engine will select the tile quality based on the visible part of the 360 sphere.

_NOTE: projection signalling in MP4 files or DASH MPD is still a hot debate at MPEG, this will likely be updated in the near future. We may also introduce other projection formats, such as cube maps._

## 2D Tile adaptation
In 2D playback, the tile adaptation logic (for ROI for example)  is controlled by the  [tile_mode](dashin#tile_mode) and  [tiles_rate](dashin#tiles_rate) options. They can be changed through the GUI. As said above in the case of HEVC tiling, a single object will be shown by the player, but tile adaptation policy can still be modified.
 
## Gaze adaptation

The compositor can use gaze information to automatically decrease the quality of the tiles not below the gaze. 
The gaze information can be:
- emulated via mouse using [--sgaze](compositor#sgaze) option.
- signaled through filter updates on the [gazer_enabled](compositor#gazer_enabled) [gaze_x](compositor#gaze_x) [gaze_y](compositor#gaze_y) 

Gaze adaptation works for both 360 (ray hit to partial sphere) and regular 2D modes (mouse over rectangle).

## Debugging the tile selection
The default behaviour of GPAC's adaptation logic is to select the lowest quality for tiles that are not completely visible. In order to debug the content (especially when qualities are visually too close), you can skip fetching and decoding the hidden tiles by using the option [--skip_lqt](dashin#skip_lqt).
In HEVC tile mode, this will result in having a video where only the selected tiles are updated, the rest of the image showing the content of the associated reference frames at last decode (this may vary depending on the decoder implementation, i.e. whether the reference frames memory are reset to 0 at each new GOP or not).

For regular (not HEVC tiles) tiling with a full coverage video and tiles, you can also use the compositor [tvtd](compositor#tvtd) to debug the tiling.

## Custom tiling adaptation

You can devise your own custom tiling adaptation logic by using the general DASH [custom algorithm](jsdash).
 
