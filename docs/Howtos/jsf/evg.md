# Overview

We discuss here how to use the [JavaScript Filter](jsf) to generate 2D vector graphics in GPAC.  
The [JS scripts](https://github.com/gpac/testsuite/tree/filters/media/jsf) in the gpac test suite are also a good source of examples.

GPAC provides a media composition engine through its [Compositor Filter](compositor), capable of rendering BIFS, SVG, VRML and X3D. It requires however a scene description, and is limited to what the scene description syntax allows.
For a simpler and/or more customized support of 2D graphics, GPAC includes JavaScript bindings to its 2D software rasterizer, allowing 2D graphics generation using the JS filter.
 
 Check the documentation of the [EVG APIs](https://doxygen.gpac.io/group__jsevg__grp.html) for more details. 


Please note that the EVG API is an immediate mode API and does not track objects drawn. If you want to partially redraw the surface, you will need to track changes and use clippers to redraw only changed areas.


# Setting up EVG
You need to import the EVG JavaScript bindings in your script:

```
import * as evg from 'evg'
```

# Setting up a canvas

In order to draw, a JS EVG filter requires a canvas, called surface in the API. This surface allows writing to a memory buffer in the desired pixel format, and can be setup in different ways.

# Creating a canvas

The simplest way to create a canvas is to allocate your own memory and setup the canvas:

```
let width=400;
let height=200;
let buffer = new ArrayBuffer(width*height*3);
let canvas = new evg.Canvas(width, height, 'rgb', buffer);

```

If your canvas is the output of your filter, simply allocate an output packet and create the canvas from this:

```
let width=400;
let height=200;
filter.set_cap({id: "StreamType", value: "Video", output: true} );
filter.set_cap({id: "CodecID", value: "raw", output: true} );
let opid = filter.new_pid();
opid.set_prop('StreamType', 'Visual');
opid.set_prop('Width', width);
opid.set_prop('Height', height);
opid.set_prop('PixelFormat', 'rgb');

filter.process = function
{
	let pck = opid.new_packet(width*height*3);
	let canvas = new evg.Canvas(width, height, 'rgb', pck.data);
	
	...
	pck.send();
}
```

If your PID properties do not change between frames (as is usually the case), you don't need to recreate a canvas at each frame, simply reassigning the buffer is enough:

```
if (canvas == null) {
	canvas = new evg.Canvas(width, height, 'rgb', pck.data);
} else {
	canvas.reassign(pck.data);
}

```

Once your canvas is setup, you need to indicate if the coordinate system is centered (0,0 at the center of the canvas, Y-axis going up) or not (0,0 at the top-left of the canvas, Y-axis going down). Non-centered coordinates are also referred to as "pixel coordinates".
```
canvas.centered=true;
```

You can then erase your canvas to the desired color:

```
canvas.clear('yellow');
canvas.clearf(1.0, 0.0., 0.0, 1.0);
```

All draw operations on the canvas, including clear, can be clipped by an axis-aligned rectangle whose coordinate are always in pixel coordinates (non-centered coordinates).

```
let clip = {x: 10, y:10, w: 40, h: 20};
canvas.clear(clip, 'yellow');
canvas.clearf(clip, 1.0, 0.0., 0.0, 1.0);
```


# Drawing a circle
The canvas works by filling with a given brush (solid color, linear or radial gradient, textures) a path. A path is a sequence of move, line and curves (cubic and quadratic bezier) in 2D.

The first step is therefore to create a graphical path containing a circle:

```
let circle = new Path();
//adds a centered ellipse with horizontal axis equal to vertical axis (i.e., circle with given diameter)
let circle.add_ellipse(0, 0, 100, 100);

```
Then create a simple brush:
```
let brush = new SolidBrush();
brush.set_color('cyan');
```

Then assign path to surface and draw path
 ```
canvas.path = circle;
canvas.fill(brush);
```
 
If we put all this together:

```
import * as evg from 'evg'

let width=400;
let height=200;
filter.set_cap({id: "StreamType", value: "Video", output: true} );
filter.set_cap({id: "CodecID", value: "raw", output: true} );
let opid = filter.new_pid();
opid.set_prop('StreamType', 'Visual');
opid.set_prop('Width', width);
opid.set_prop('Height', height);
opid.set_prop('PixelFormat', 'rgb');
//generate at 25 frames per second
opid.set_prop('Timescale', '25');
let canvas = null;
let cts = 0;

//create a static solid brush
let brush = new SolidBrush();
brush.set_color('cyan');

//create a static circle
let circle = new Path();
let circle.add_ellipse(0, 0, 100, 100);

filter.process = function()
{
	let pck = opid.new_packet(width*height*3);
	if (!pck) return GF_OUT_OF_MEM;

	if (canvas == null) {
		canvas = new evg.Canvas(width, height, 'rgb', pck.data);
		canvas.centered=true;
	} else {
		canvas.reassign(pck.data);
	}
	//animate clear color at each frame
	let red = (cts % 100) /100;
	canvas.clearf(red, 0.0, 0.0, 1.0);
	
	canvas.path = circle;	
	canvas.fill(brush);
	pck.cts = cts;
	cts++;
	pck.send();
}
```

You can also use a radial gradient:
```
let brush = new evg.RadialGradient();
brush.set_points(0.0, 0.0, 10.0, 10.0, 15.0, 15.0);
brush.set_stop(0.0, 'red');
brush.set_stopf(1.0, 0.0, 0.0, 1.0, 0.5);
brush.mode = GF_GRADIENT_MODE_SPREAD;
```
or a linear gradient:

```
let brush = new evg.LinearGradient();
brush.set_points(0.0, 0.0, 1.0, 0.0);
brush.set_stop(0.0, 'red');
brush.set_stopf(1.0, 0.0, 0.0, 1.0, 0.5);
brush.mode = GF_GRADIENT_MODE_PAD;
```


# Moving a Path
In GPAC EVG, a path is constructed in its local coordinate system; for the example above, the center of the circle was 0,0. Without any transformation, the (0,0) of the local coordinate system is positioned at the origin of the canvas (depending on the centered mode of the canvas).

In order to change the positioning of an object on the canvas, a Matrix2D object must be used. This matrix can specify any affine transformation (scale, rotate, translate, skew, ...).

```
let mx = new EVG.Matrix2D();
mx.scale(2.0, 0.5);

//our circle drawn with this matrix will now appear as an ellipse
canvas.matrix = mx;
canvas.path = circle;	
canvas.fill(brush);
```

You can also use a 3D matrix to draw a path, usually to apply perspective transform. In this case, all points in the path are considered to have 0 as Z coordinate.

 
 ```
 let mx = new EVG.Matrix();
 mx.perspective(Math.PI / 4, width/height, 0.1, 100);
 //apply other transformation to the matrix
 
 //our circle drawn with this matrix will now appear as an ellipse
 canvas.matrix3d = mx;
 canvas.path = circle;	
 canvas.fill(brush);
 ```

# Outlining a Path
GPAC EVG handles path outlines ("striking") as a regular path. If you want to outline a path, you first need to create the corresponding outline path using pen properties, then draw it as usual.

```
let outline = circle.outline({width: 5.0, align: GF_PATH_LINE_OUTSIDE, join: GF_LINE_JOIN_BEVEL, dash: GF_DASH_STYLE_DASH_DASH_DOT});


canvas.path = circle;	
canvas.fill(brush);

canvas.path = outline;	
canvas.fill(brush_green);

```

# Drawing text
GPAC EVG handles text by converting a text string with a given font as a set of Path objects. This conversion is done automatically and is transparent to the user.

```
/*create a text*/
let text = new evg.Text();
text.font = 'Times';
text.fontsize = 20;
text.align=GF_TEXT_ALIGN_CENTER;
text.set_text(['My awesome text', 'Powered by GPAC']);

canvas.path = text;	
canvas.fill(brush);
```

If you want to draw the outline of a text, you will need to first construct the text and then get its associated path:

```
let txtpath = text.get_path();
let outline = text.outline({width: 5.0, align: GF_PATH_LINE_OUTSIDE, join: GF_LINE_JOIN_BEVEL, dash: GF_DASH_STYLE_DASH_DASH_DOT});

canvas.path = outline;	
canvas.fill(brush);
```


# Using textures
GPAC EVG can use textures to fill path. There are several ways of creating a texture:
- create texture from your script data

```
let ab = new ArrayBuffer(2*2*4); //RGBA 2x2 data buffer
//fill the buffer
...
//create the texture
let tx = new EVG.Texture(2, 2, 'rgba', ab);
```

- create texture from a local PNG or JPEG file

```
let tx = new EVG.Texture('myimage.jpg', true);
```
Note that the image loader can resolve the image path as relative to the source JS or to the current working directory. In this example, we use source JS relative path. Only local files are supported by this API.

- create texture from a remote PNG or JPEG file

```
//get remote file using xhr with a response type set to arrayBuffer
xhr = xhr_fetch_file(file_url);
let tx = new EVG.Texture(xhr.response);
```
Check GPAC [XHR API](https://doxygen.gpac.io/group__xhr__grp.html) for more details.



- create texture from a GPAC packet

```
let pck = ipid.get_packet();

let tx = new EVG.Texture(pck);
```
In this case, the texture properties are derived from the packet's parent PID properties.


- create texture from a Canvas object

```
let tx = new EVG.Texture(canvas);
```
In this case, the texture properties are derived from the canvas properties. This is typically used to draw an offscreen canvas and use the result as a texture, similar to MPEG-4 CompositeTexture2D.



Once the texture data is setup, you will then need to setup the base transformation of your texture. This implies scaling the texture to the desired size in object local coordinate system, and translating it at the right position (e.g. center). If we take the example of our circle with 100 pixel, diameter, the texture must be scaled to occupy the full width and height (e.g. 100, 100) and translated to the center of the local coordinate system (e.g. 50, 50).

```
let mmx = new evg.Matrix2D();
mmx.scale(100/tx.width, 100/tx.height);
mmx.translate(50, 50);
//and apply the same transformation as the object
mmx.add(mx);
tx.mx = mmx;

canvas.path = circle;	
canvas.fill(tx);
```

Note that the canvas matrix is always applied to the texture matrix, so that you don't need to adjust texture matrix when moving the objects on the canvas.


# Overlays and canvas
As seen previously, it is possible to create a canvas from an output  packet. Now recall how packets can be created from JS: it is possible to clone a source packet as an output, thereby transferring the source data into the destination packet (or creating a copy of the source into the destination otherwise).
This means that you can create a canvas that operate on the pixels of your input video, thereby providing fast 2D graphics overlay:

```
let pfmt = ipid.get_prop('PixelFormat');
let width = ipid.get_prop('Width');
let height = ipid.get_prop('Height');

let ipck = ipid.get_packet();
let opck = opid.new_packet(ipck);
let canvas = new EVG.Canvas(width, height, pfmt, opck.data);

//draw on canvas, this will draw directly on the video

ipid.drop_packet();
opck.send();
```

_Note: this will only work if the input video data is not a set of GPU textures unavailable for read access._

In overlay mode, solid brush and gradients colors are internally converted to destination pixel format if needed (typically when drawing over YUV surfaces). This is however not the case for textures, you must do this conversion manually. For example when drawing an RGBA PNG image over a YUV canvas:

```
let canvas = ...
let image = new EVG.texture('myimage.png');
//if canvas is YUV, convert image to YUV
image = image.rgb2yuv(canvas);

```
 
This will avoid doing the RGB to YUV conversion each time the texture is used.
