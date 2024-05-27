<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Compositor  
  
Register name used to load filter: __compositor__  
This filter may be automatically loaded during graph resolution.  
  
The GPAC compositor allows mixing audio, video, text and graphics in a timed fashion.  
The compositor operates either in media-client or filter-only mode.  
  
# Media-client mode  
  
In this mode, the compositor acts as a pseudo-sink for the video side and creates its own output window.  
The video frames are dispatched to the output video PID in the form of frame pointers requiring later GPU read if used.  
The audio part acts as a regular filter, potentially mixing and resampling the audio inputs to generate its output.  
User events are directly processed by the filter in this mode.  
  
# Filter mode  
  
In this mode, the compositor acts as a regular filter generating frames based on the loaded scene.  
It will generate its outputs based on the input video frames, and will process user event sent by consuming filter(s).  
If no input video frames (e.g. pure BIFS / SVG / VRML), the filter will generate frames based on the [fps](#fps), at constant or variable frame rate.  
It will stop generating frames as soon as all input streams are done, unless extended/reduced by [dur](#dur).  
If audio streams are loaded, an audio output PID is created.  
  
The default output pixel format in filter mode is:  
- `rgb` when the filter is explicitly loaded by the application  
- `rgba` when the filter is loaded during a link resolution  
This can be changed by assigning the [opfmt](#opfmt) option.  
If either [opfmt](#opfmt) specifies alpha channel or [bc](#bc) is not 0 but has alpha=0, background creation in default scene will be skipped.  
  
In filter-only mode, the special URL `gpid://` is used to locate PIDs in the scene description, in order to design scenes independently from source media.  
When such a PID is associated to a `Background2D` node in BIFS (no SVG mapping yet), the compositor operates in pass-through mode.  
In this mode, only new input frames on the pass-through PID will generate new frames, and the scene clock matches the input packet time.  
The output size and pixel format will be set to the input size and pixel format, unless specified otherwise in the filter options.  
  
If only 2D graphics are used and display driver is not forced, 2D rasterizer will happen in the output pixel format (including YUV pixel formats).  
In this case, in-place processing (rasterizing over the input frame data) will be used whenever allowed by input data.  
  
If 3D graphics are used or display driver is forced, OpenGL will be used on offscreen surface and the output packet will be an OpenGL texture.  
  
# Specific URL syntaxes  
  
The compositor accepts any URL type supported by GPAC. It also accepts the following schemes for URLs:  
* views:// : creates an auto-stereo scene of N views from `views://v1::.::vN`  
* mosaic:// : creates a mosaic of N views from `mosaic://v1::.::vN`  
  
For both syntaxes, `vN` can be any type of URL supported by GPAC.  
For `views://` syntax, the number of rendered views is set by [nbviews](#nbviews):  
- If the URL gives less views than rendered, the views will be repeated  
- If the URL gives more views than rendered, the extra views will be ignored  
  
The compositor can act as a source filter when the [src](#src) option is explicitly set, independently from the operating mode:  
Example
```
gpac compositor:src=source.mp4 vout
```  
  
The compositor can act as a source filter when the source url uses one of the compositor built-in protocol schemes:  
Example
```
gpac -i mosaic://URL1:URL2 vout
```  
  

# Options    
  
<a id="aa">__aa__</a> (enum, default: _all_, updatable): set anti-aliasing mode for raster graphics; whether the setting is applied or not depends on the graphics module or graphic card  
* none: no anti-aliasing  
* text: anti-aliasing for text only  
* all: complete anti-aliasing  
  
<a id="hlfill">__hlfill__</a> (uint, default: _0x0_, updatable): set highlight fill color (ARGB)  
<a id="hlline">__hlline__</a> (uint, default: _0xFF000000_, updatable): set highlight stroke color (ARGB)  
<a id="hllinew">__hllinew__</a> (flt, default: _1.0_, updatable): set highlight stroke width  
<a id="sz">__sz__</a> (bool, default: _true_, updatable): enable scalable zoom. When scalable zoom is enabled, resizing the output window will also recompute all vectorial objects. Otherwise only the final buffer is stretched  
<a id="bc">__bc__</a> (uint, default: _0_, updatable): default background color to use when displaying transparent images or video with no scene composition instructions  
<a id="yuvhw">__yuvhw__</a> (bool, default: _true_, updatable): enable YUV hardware for 2D blit  
<a id="blitp">__blitp__</a> (bool, default: _true_, updatable): partial hardware blit. If not set, will force more redraw  
<a id="softblt">__softblt__</a> (bool, default: _true_): enable software blit/stretch in 2D. If disabled, vector graphics rasterizer will always be used  
<a id="stress">__stress__</a> (bool, default: _false_, updatable): enable stress mode of compositor (rebuild all vector graphics and texture states at each frame)  
<a id="fast">__fast__</a> (bool, default: _false_, updatable): enable speed optimization - whether the setting is applied or not depends on the graphics module / graphic card  
<a id="bvol">__bvol__</a> (enum, default: _no_, updatable): draw bounding volume of objects  
* no: disable bounding box  
* box: draws a rectangle (2D) or box (3D)  
* aabb: draws axis-aligned bounding-box tree (3D) or rectangle (2D)  
  
<a id="textxt">__textxt__</a> (enum, default: _default_, updatable): specify whether text shall be drawn to a texture and then rendered or directly rendered. Using textured text can improve text rendering in 3D and also improve text-on-video like content  
* default: use texturing for OpenGL rendering, no texture for 2D rasterizer  
* never: never uses text textures  
* always: always render text to texture before drawing  
  
<a id="out8b">__out8b__</a> (bool, default: _false_, updatable): convert 10-bit video to 8 bit texture before GPU upload  
<a id="drop">__drop__</a> (bool, default: _false_, updatable): drop late frame when drawing. If not set, frames are not dropped until a desynchronization of 1 second or more is observed  
<a id="sclock">__sclock__</a> (bool, default: _false_, updatable): force synchronizing all streams on a single clock  
<a id="sgaze">__sgaze__</a> (bool, default: _false_, updatable): simulate gaze events through mouse  
<a id="ckey">__ckey__</a> (uint, default: _0_, updatable): color key to use in windowless mode (0xFFRRGGBB). GPAC currently does not support true alpha blitting to desktop due to limitations in most windowing toolkit, it therefore uses color keying mechanism. The alpha part of the key is used for global transparency of the output, if supported  
<a id="timeout">__timeout__</a> (uint, default: _10000_, updatable): timeout in ms after which a source is considered dead (0 disable timeout)  
<a id="fps">__fps__</a> (frac, default: _30/1_, updatable): simulation frame rate when animation-only sources are played (ignored when video is present)  
<a id="timescale">__timescale__</a> (uint, default: _0_, updatable): timescale used for output packets when no input video PID. A value of 0 means fps numerator  
<a id="autofps">__autofps__</a> (bool, default: _true_): use video input fps for output, ignored in player mode. If no video or not set, uses [fps](#fps)  
<a id="vfr">__vfr__</a> (bool, default: _false_): only emit frames when changes are detected. (always true in player mode and when filter is dynamically loaded)  
<a id="dur">__dur__</a> (dbl, default: _0_, updatable): duration of generation. Mostly used when no video input is present. Negative values mean number of frames, positive values duration in second, 0 stops as soon as all streams are done  
<a id="fsize">__fsize__</a> (bool, default: _false_, updatable): force the scene to resize to the biggest bitmap available if no size info is given in the BIFS configuration  
<a id="mode2d">__mode2d__</a> (enum, default: _defer_, updatable): specify whether immediate drawing should be used or not  
* immediate: the screen is completely redrawn at each frame (always on if pass-through mode is detected)  
* defer: object positioning is tracked from frame to frame and dirty rectangles info is collected in order to redraw the minimal amount of the screen buffer  
* debug: only renders changed areas, resetting other areas  
Whether the setting is applied or not depends on the graphics module and player mode  
  
<a id="amc">__amc__</a> (bool, default: _true_): audio multichannel support; if disabled always down-mix to stereo. Useful if the multichannel output does not work properly  
<a id="asr">__asr__</a> (uint, default: _0_): force output sample rate (0 for auto)  
<a id="ach">__ach__</a> (uint, default: _0_): force output channels (0 for auto)  
<a id="alayout">__alayout__</a> (uint, default: _0_): force output channel layout (0 for auto)  
<a id="afmt">__afmt__</a> (afmt, default: _s16_, Enum: none|u8|s16|s16b|s24|s24b|s32|s32b|flt|fltb|dbl|dblb|u8p|s16p|s24p|s32p|fltp|dblp): force output channel format (0 for auto)  
  
<a id="asize">__asize__</a> (uint, default: _1024_): audio output packet size in samples  
<a id="abuf">__abuf__</a> (uint, default: _100_): audio output buffer duration in ms - the audio renderer fills the output PID up to this value. A too low value will lower latency but can have real-time playback issues  
<a id="avol">__avol__</a> (uint, default: _100_, updatable): audio volume in percent  
<a id="apan">__apan__</a> (uint, default: _50_, updatable): audio pan in percent, 50 is no pan  
<a id="async">__async__</a> (bool, default: _true_, updatable): audio resynchronization; if disabled, audio data is never dropped but may get out of sync  
<a id="max_aspeed">__max_aspeed__</a> (dbl, default: _2.0_, updatable): silence audio if playback speed is greater than specified value  
<a id="max_vspeed">__max_vspeed__</a> (dbl, default: _4.0_, updatable): move to i-frame only decoding if playback speed is greater than specified value  
<a id="buffer">__buffer__</a> (uint, default: _3000_, updatable): playout buffer in ms (overridden by `BufferLength` property of input PID)  
<a id="rbuffer">__rbuffer__</a> (uint, default: _1000_, updatable): rebuffer trigger in ms (overridden by `RebufferLength` property of input PID)  
<a id="mbuffer">__mbuffer__</a> (uint, default: _3000_, updatable): max buffer in ms, must be greater than playout buffer (overridden by `BufferMaxOccupancy` property of input PID)  
<a id="ntpsync">__ntpsync__</a> (uint, default: _0_, updatable): ntp resync threshold in ms (drops frame if their NTP is more than the given threshold above local ntp), 0 disables ntp drop  
<a id="nojs">__nojs__</a> (bool, default: _false_): disable javascript  
<a id="noback">__noback__</a> (bool, default: _false_): ignore background nodes and viewport fill (useful when dumping to PNG)  
<a id="ogl">__ogl__</a> (enum, default: _auto_, updatable): specify 2D rendering mode  
* auto: automatically decides between on, off and hybrid based on content  
* off: disables OpenGL; 3D will not be rendered  
* on: uses OpenGL for all graphics; this will involve polygon tesselation and 2D graphics will not look as nice as 2D mode  
* hybrid: the compositor performs software drawing of 2D graphics with no textures (better quality) and uses OpenGL for all 2D objects with textures and 3D objects  
  
<a id="pbo">__pbo__</a> (bool, default: _false_, updatable): enable PixelBufferObjects to push YUV textures to GPU in OpenGL Mode. This may slightly increase the performances of the playback  
<a id="nav">__nav__</a> (enum, default: _none_, updatable): override the default navigation mode of MPEG-4/VRML (Walk) and X3D (Examine)  
* none: disables navigation  
* walk: 3D world walk  
* fly: 3D world fly (no ground detection)  
* pan: 2D/3D world zoom/pan  
* game: 3D world game (mouse gives walk direction)  
* slide: 2D/3D world slide  
* exam: 2D/3D object examine  
* orbit: 3D object orbit  
* vr: 3D world VR (yaw/pitch/roll)  
  
<a id="linegl">__linegl__</a> (bool, default: _false_, updatable): indicate that outlining shall be done through OpenGL pen width rather than vectorial outlining  
<a id="epow2">__epow2__</a> (bool, default: _true_, updatable): emulate power-of-2 textures for OpenGL (old hardware). Ignored if OpenGL rectangular texture extension is enabled  
* yes: video texture is not resized but emulated with padding. This usually speeds up video mapping on shapes but disables texture transformations  
* no: video is resized to a power of 2 texture when mapping to a shape  
  
<a id="paa">__paa__</a> (bool, default: _false_, updatable): indicate whether polygon antialiasing should be used in full antialiasing mode. If not set, only lines and points antialiasing are used  
<a id="bcull">__bcull__</a> (enum, default: _on_, updatable): indicate whether backface culling shall be disable or not  
* on: enables backface culling  
* off: disables backface culling  
* alpha: only enables backface culling for transparent meshes  
  
<a id="wire">__wire__</a> (enum, default: _none_, updatable): wireframe mode  
* none: objects are drawn as solid  
* only: objects are drawn as wireframe only  
* solid: objects are drawn as solid and wireframe is then drawn  
  
<a id="norms">__norms__</a> (enum, default: _none_, updatable): normal vector drawing for debug  
* none: no normals drawn  
* face: one normal per face drawn  
* vertex: one normal per vertex drawn  
  
<a id="rext">__rext__</a> (bool, default: _true_, updatable): use non power of two (rectangular) texture GL extension  
<a id="cull">__cull__</a> (bool, default: _true_, updatable): use aabb culling: large objects are rendered in multiple calls when not fully in viewport  
<a id="depth_gl_scale">__depth_gl_scale__</a> (flt, default: _100_, updatable): set depth scaler  
<a id="depth_gl_type">__depth_gl_type__</a> (enum, default: _none_, updatable): set geometry type used to draw depth video  
* none: no geometric conversion  
* point: compute point cloud from pixel+depth  
* strip: same as point but thins point set  
  
<a id="nbviews">__nbviews__</a> (uint, default: _0_, updatable): number of views to use in stereo mode  
<a id="stereo">__stereo__</a> (enum, default: _none_, updatable): stereo output type. If your graphic card does not support OpenGL shaders, only `top` and `side` modes will be available  
* none: no stereo  
* side: images are displayed side by side from left to right  
* top: images are displayed from top (laft view) to bottom (right view)  
* hmd: same as side except that view aspect ratio is not changed  
* ana: standard color anaglyph (red for left view, green and blue for right view) is used (forces views=2)  
* cols: images are interleaved by columns, left view on even columns and left view on odd columns (forces views=2)  
* rows: images are interleaved by columns, left view on even rows and left view on odd rows (forces views=2)  
* spv5: images are interleaved by for SpatialView 5 views display, fullscreen mode (forces views=5)  
* alio8: images are interleaved by for Alioscopy 8 views displays, fullscreen mode (forces views=8)  
* custom: images are interleaved according to the shader file indicated in [mvshader](#mvshader). The shader is exposed each view as uniform sampler2D gfViewX, where X is the view number starting from the left  
  
<a id="mvshader">__mvshader__</a> (str, updatable): file path to the custom multiview interleaving shader  
<a id="fpack">__fpack__</a> (enum, default: _none_, updatable): default frame packing of input video  
* none: no frame packing  
* top: top bottom frame packing  
* side: side by side packing  
  
<a id="camlay">__camlay__</a> (enum, default: _offaxis_, updatable): camera layout in multiview modes  
* straight: camera is moved along a straight line, no rotation  
* offaxis: off-axis projection is used  
* linear: camera is moved along a straight line with rotation  
* circular: camera is moved along a circle with rotation  
  
<a id="iod">__iod__</a> (flt, default: _6.4_, updatable): inter-ocular distance (eye separation) in cm (distance between the cameras).   
<a id="rview">__rview__</a> (bool, default: _false_, updatable): reverse view order  
<a id="dbgpack">__dbgpack__</a> (bool, default: _false_, updatable): view packed stereo video as single image (show all)  
<a id="tvtn">__tvtn__</a> (uint, default: _30_, updatable): number of point sampling for tile visibility algorithm  
<a id="tvtt">__tvtt__</a> (uint, default: _8_, updatable): number of points above which the tile is considered visible  
<a id="tvtd">__tvtd__</a> (enum, default: _off_, updatable): debug tiles and full coverage SRD  
* off: regular draw  
* partial: only displaying partial tiles, not the full sphere video  
* full: only display the full sphere video  
  
<a id="tvtf">__tvtf__</a> (bool, default: _false_, updatable): force all tiles to be considered visible, regardless of viewpoint  
<a id="fov">__fov__</a> (flt, default: _1.570796326794897_, updatable): default field of view for VR  
<a id="vertshader">__vertshader__</a> (str): path to vertex shader file  
<a id="fragshader">__fragshader__</a> (str): path to fragment shader file  
<a id="autocal">__autocal__</a> (bool, default: _false_, updatable): auto calibration of znear/zfar in depth rendering mode  
<a id="dispdepth">__dispdepth__</a> (sint, default: _-1_, updatable): display depth, negative value uses default screen height  
<a id="dispdist">__dispdist__</a> (flt, default: _50_, updatable): distance in cm between the camera and the zero-disparity plane. There is currently no automatic calibration of depth in GPAC  
<a id="focdist">__focdist__</a> (flt, default: _0_, updatable): distance of focus point  
<a id="osize">__osize__</a> (v2di, default: _0x0_, updatable): force output size. If not set, size is derived from inputs  
<a id="dpi">__dpi__</a> (v2di, default: _96x96_, updatable): default dpi if not indicated by video output  
<a id="dbgpvr">__dbgpvr__</a> (flt, default: _0_, updatable): debug scene used by PVR addon  
<a id="player">__player__</a> (enum, default: _no_): set compositor in player mode  
* no: regular mode  
* base: player mode  
* gui: player mode with GUI auto-start  
  
<a id="noaudio">__noaudio__</a> (bool, default: _false_): disable audio output  
<a id="opfmt">__opfmt__</a> (pfmt, default: _none_, Enum: none|yuv420|yvu420|yuv420_10|yuv422|yuv422_10|yuv444|yuv444_10|uyvy|vyuy|yuyv|yvyu|uyvl|vyul|yuyl|yvyl|nv12|nv21|nv1l|nv2l|yuva|yuvd|yuv444a|yuv444p|v308|yuv444ap|v408|v410|v210|grey|algr|gral|rgb4|rgb5|rgb6|rgba|argb|bgra|abgr|rgb|bgr|xrgb|rgbx|xbgr|bgrx|rgbd|rgbds|uncv): pixel format to use for output. Ignored in [player](#player) mode  
  
<a id="drv">__drv__</a> (enum, default: _auto_): indicate if graphics driver should be used  
* no: never loads a graphics driver, software blit is used, no 3D possible (in player mode, disables OpenGL)  
* yes: always loads a graphics driver, output pixel format will be RGB (in player mode, same as `auto`)  
* auto: decides based on the loaded content  
  
<a id="src">__src__</a> (cstr): URL of source content  
<a id="gaze_x">__gaze_x__</a> (sint, default: _0_, updatable): horizontal gaze coordinate (0=left, width=right)  
<a id="gaze_y">__gaze_y__</a> (sint, default: _0_, updatable): vertical gaze coordinate (0=top, height=bottom)  
<a id="gazer_enabled">__gazer_enabled__</a> (bool, default: _false_, updatable): enable gaze event dispatch  
<a id="subtx">__subtx__</a> (sint, default: _0_, updatable): horizontal translation in pixels towards right for subtitles renderers  
<a id="subty">__subty__</a> (sint, default: _0_, updatable): vertical translation in pixels towards top for subtitles renderers  
<a id="subfs">__subfs__</a> (uint, default: _0_, updatable): font size for subtitles renderers (0 means automatic)  
<a id="subd">__subd__</a> (sint, default: _0_, updatable): subtitle delay in milliseconds for subtitles renderers  
<a id="audd">__audd__</a> (sint, default: _0_, updatable): audio delay in milliseconds  
<a id="clipframe">__clipframe__</a> (bool, default: _false_): visual output is clipped to bounding rectangle  
  
