---
tags:
- mpd
- tile
- codec
- filter
- sample
- compression
- frame
- raw
- stream
- hevc
- bitrate
- dump
- scene
- compositor
- isobmff
- decoder
- track
- option
- profile
- mp4
- graph
- source
- input
- isomedia
- output
- mpeg
- sink
- dash
- encoder
---



GPAC supports streaming HEVC tiled DASH videos. In this page, you will find some helpful information to get started with this feature. In the following, we assume the input video has resolution of 3840x2160 and a frame rate of 30 frames/sec.

# How to generate tiled streamable video content

The open-source [Kvazaar encoder](https://github.com/ultravideo/kvazaar) allows encoding HEVC with motion constrained tiling. To instruct the encoder to encapsulate each tile in a separate slice, the `--slices` option is used with the value `tiles`. Motion vectors are then constrained within in each tile using `--mv-constraint`.

```bash
kvazaar -i input.yuv --input-res 3840x2160 -o output.hvc --tiles 3x3 --slices tiles --mv-constraint frametilemargin --bitrate 128000 --period 30 --input-fps 30
```

We can also set the target bitrate by `--bitrate` in bps instead of setting QP. It will turn the rate controller on. If you plan on merging tiles with different quality, keep the same QP settings and adjust the bitrate (changing QP would generate incompatible bitstreams). The output of the encoder is a raw bitstream and should be packaged within a container. To do so, MP4Box from GPAC can be used as follows, where the set value for `-fps` should match that of the encoded video.

```bash
MP4Box -add video_tiled.hvc:split_tiles -fps 30 -new video_tiled.mp4
```

The generated MP4 file includes one base track containing parameter sets and/or SEI messages plus one track for each tile. Now you can generate DASH segments and descriptor for the packaged video as follows.

```bash
MP4Box -dash 1000 -rap -frag-rap -profile live -out dash_tiled.mpd video_tiled.mp4
```

MP4Box can also generate an MPD with multiple representations by adding more input files.

```bash
MP4Box -dash 1000 -rap -frag-rap -profile live -out dash_tiled.mpd video_tiled_rep1.mp4 video_tiled_rep2.mp4
```

For more information, please refer [the HEVC Tile based adaptation guide](https://wiki.gpac.io/Howtos/dash/HEVC-Tile-based-adaptation-guide/).


# How to stream 360 video content

Once the content is generated and stored on the server side, you can play it from the client side. The only required argument is the URL of the MPD file. In the case of 360/VR videos, it is possible to render only the viewport using `#VR` right after the URL. For example:

```
gpac -gui http://server:port/test.mpd
gpac -gui http://server:port/test.mpd#VR
```

Note that 360 rendering requires usage of the compositor filter (so use `gpac -gui` or `gpac -mp4c`).

# Coding Aspects

## Main Rendering Loop in Compositor Filter

The main loop to render the 360 video content (in `#VR` mode) is roughly as follows.

```
gf_sc_draw_frame
   gf_sc_render_frame
      gf_sc_draw_scene
         visual_draw_frame
            visual_3d_draw_frame
               visual_3d_setup
               visual_3d_setup_traversing_state
               visual_3d_setup_clipper
               visual_3d_init_shaders
               for each view
                  visual_3d_draw_node // for root
                  for each scenegraph
                     gf_sc_traverse_subscene
```

Since HEVC supports tiling, putting the tiles back to form the whole frame is done inside the decoder. Therefore, the output of the decoder is the projected 2D video (e.g. equirectangular). The decoder puts each decoded frame as a composition unit (CU) inside the composition buffer (CB). The compositor takes out CUs one at a time (by calling `gf_sc_texture_update_frame()` function) and tries to push the texture to the graphics device (by calling `gf_sc_texture_push_image()` function).


The conversion from YUV (YU12) to RGB is done with the help of a fragment shader. `visual_3d_shader_with_flags()` function is used to load the shaders.


The video output interface (DirectX, SDL, or Raw) is loaded from a module in `gf_sc_create()` function and signaled to setup in `gf_sc_reconfig_task()` function.

## Scene Graph in #VR Mode

```
TAG_MPEG4_OrderedGroup
   |
   |--- TAG_MPEG4_Background2D
   |--- TAG_MPEG4_Viewpoint
   |--- TAG_MPEG4_NavigationInfo
   |--- TAG_MPEG4_Sound2D
   |       |
   |       |--- Source: TAG_MPEG4_AudioClip
   |
   |--- TAG_MPEG4_Transform2D
           |
           |--- TAG_MPEG4_TouchSensor
           |--- TAG_MPEG4_Transform2D
                   |
                   |--- TAG_MPEG4_Shape
                           |
                           |--- Appearance: TAG_MPEG4_Appearance
                           |                   |
                           |                   |--- Texture: TAG_MPEG4_MovieTexture
                           |
                           |--- Geometry: TAG_MPEG4_Sphere
```

