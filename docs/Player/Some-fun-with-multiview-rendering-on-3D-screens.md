---
tags:
- heif
- data
- filter
- frame
- stream
- bitstream
- sequence
- dump
- scene
- opengl
- media
- compositor
- track
- option
- mp4
- source
- output
- mpeg
- sink
---



GPAC can support various output type and view number, but requires OpenGL to do so. 

!!! warning
    Multi-view rendering is a costly operation. The scene gets rendered multiple times, and you will need a decent graphic card to try that, especially support for [VBO](http://en.wikipedia.org/wiki/Vertex_Buffer_Object)s to avoid sending the geometry data repeatedly, and OpenGL shaders for most screen configurations. 

The output type is selected in GPAC configuration file by the following keys

```
[filter@compositor]
nbviews=2
rview=no
stereo=custom
mvshader=/path/to/fragmentshader_sourcecode.glsl
dispdist=180
camlay=circular
```

See `gpac -hh compositor` for documentation of these options.


When shaders are used, each view X in \[`1, nbviews`\] is exposed to the shader as:

```
 uniform sampler2D gfViewX
```

For example, the column interleaving in GPAC is done with a built-in shader whose code is:

```
uniform sampler2D gfView1;
uniform sampler2D gfView2;

void main(void) {
 if ( int( mod(gl_FragCoord.x, 2.0) ) == 0)
  gl_FragColor = texture2D(gfView1, gl_TexCoord[0].st);
 else
  gl_FragColor = texture2D(gfView2, gl_TexCoord[0].st);
}
```

`camlay` defines how the camera is positioned in the 3D world. It can take the value `offaxis` (default), `circular` or `linear` - you can get pretty good overviews of this on the web. `dispdist` specifies the nominal viewing distance of the auto-stereoscopic display. GPAC will use that to compute each view's camera position in the virtual world. 

We started some experiments on automatic calibration of 3D models, but it is not yet fully tested and may results in too high disparity. Don't worry, this can be adjusted at run-time: use `Alt+shift+UP/Down` to modify the inter-ocular distance (by default 6.8 cm) and `Alt+shift+UP/Down` to modify the view distance.   

Here are some videos showing some of these modes. 

http://www.youtube.com/watch?v=_8sZc3dL9ds

Original scene designed during the [Triscope](http://triscope.enst.fr) project, in which we built an auto-stereoscopic mobile prototype.

http://www.youtube.com/watch?v=7bNHkuFBg0c

Anaglyph version of the Triscope demo.

http://www.youtube.com/watch?v=6kzK54XiRXw

Side-by-Side version of the Triscope Demo.

[![Triscope Demo 5 views interleaved](https://gpac.io/files/2011/05/triscope_menu_5views1-300x166.png)](https://gpac.io/files/2011/05/triscope_menu_5views1.png)[![](http://gpac.io/files/2011/05/triscope_dino_5views-300x166.png)](http://gpac.io/files/2011/05/triscope_dino_5views.png)[![](http://gpac.io/files/2011/05/triscope_nef_5views-300x166.png)](http://gpac.io/files/2011/05/triscope_nef_5views.png)

Custom interleaving version of the Triscope Demo for a 5 views display.

The demo is written in BIFS, and uses a hardcoded proto (e.g. gpac-specific) node called DepthGroup for the 2D menu. This node allows to specify depth translation and scaling factors to a sub-tree, which are then accumulated when going down the sub-tree. We could also have used Transform3D nodes, but we didn't want to have too many 3D matrices to handle (the original prototype platform was not that powerful). To declare such a node in a BT file, you need to insert the following code before your scene:

```c
EXTERNPROTO DepthGroup [
exposedField MFNode children []
exposedField SFInt32 _3d_type 4
exposedField SFFloat depth_gain 1.0
exposedField SFFloat depth_offset 0.0
 ] "urn:inet:gpac:builtin:DepthGroup"
```

You can ignore the \_3d\_type field, which was specific to the hardware part of the prototype.

The resulting depth value is scaled by a constant defined in GPAC configuration file:

```ini
[Compositor]
DepthScale=100
```

This is still very preliminary work, automatic scaling is planed in the near future.

Support for SVG and depth has also been [investigated](http://www.svgopen.org/2010/papers/54-SVG_Extensions_for_3D_displays/), but this work is not yet integrated in GPAC.

For images, we defined a new image format called PNGD. These are regular PNG files where the alpha channel is interpreted as the depth map of the RGB channels. These files can be played by GPAC whether in stereo-mode or not. 

For video, we defined a new (not standard yet) MPEG-4 descriptor defining a video stream as carrying the depth map of another video stream. This is in-sync with approaches based on [MPEG-C Part 3](http://www.google.com/url?sa=t&source=web&cd=1&ved=0CBgQFjAA&url=http%3A%2F%2Fvca.ele.tue.nl%2Fevents%2F3Dworkshop2006%2Fpdf%2FBourge_MPEG-C_Part3_EnablingTheIntroOfVideoPlusDepthContents.pdf&rct=j&q=MPEG-C%20carriage%20of%20auxiliary%20video&ei=Rd7CTbfyNcKKhQfJ1qy7BQ&usg=AFQjCNHlhdzaAamUyts5TjHn_fElcjFfPw&cad=rja). You can find a sample BT file showing this [here,](http://perso.telecom-paristech.fr/~lefeuvre/wwwfiles/video_and_depth.bt) then use MP4Box to produce the mp4 file. 

The playback of video+depth or image+depth is in its early stage in GPAC, you will need a BIG machine and a recent graphics card to get good results. Don't expect too much from high resolution video yet, they will likely overkill the player. The reason for this ? The video data is sent as as a point sprite, triangle strip elevation grid or vertex buffer, and this costs a lot (this will have to be improved in the future). 

The way depth video is rendered is defined by the following option:

```ini
[filter@compositor]
depth_gl_type=none
```

`depth_gl_type` take the following value:

*   `none`: video is rendered as a flat rectangle
*   `point`: video is rendered as a point sprite if **GL\_ARB\_point\_parameters** extension is supported
*   `strip`: video is rendered as a triangle strip. You may specify "Strips=V" as an option; this will perform two-pass rendering and V the cut-off value for the depth (expressed between 0 and 255)

The height of each vertex is taken from the depth map and multiplied by the `DepthScale` value. Note that you don't need stereo-rendering to play with this: http://www.youtube.com/watch?v=-AuaU1Eq5Xg 

When playing depth+video or depth+image, GPAC will automatically switch to OpenGL rendering if the `depth_gl_type` option is not `none`. 
