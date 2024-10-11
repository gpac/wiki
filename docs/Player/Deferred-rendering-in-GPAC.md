---
tags:
- mp4
- sample
- isomedia
- compression
- isobmff
- frame
- compositor
- codec
- h264
---



The GPAC compositor can render content in a special mode allowing to debug deferred rendering in 2D. In this mode, only the rectangular regions of the window that have changed since the previous frame are drawn in each frame. 

To enable this mode, you need to modify the GPAC configuration file, by setting `mode2d` to `debug` in the `filter@compositor` section, or using `--mode2d=debug`.

Below is a video showing the rendering by GPAC of an SVG animation.

[![](https://gpac.io/files/2013/03/animate-elem-04-t-defer.png)](https://gpac.io/files/2013/03/animate-elem-04-t-defer-avc.mp4)

The next video shows the same SVG animation being rendered in defer-debug mode. You can see that since only the triangle moves, only the triangle and its surroundings need to be redrawn.

[![](https://gpac.io/files/2013/03/animate-elem-04-t-defer-debug.png)](https://gpac.io/files/2013/03/animate-elem-04-t-defer-avc-debug.mp4)


