# Overview 

We discuss here how to use the [JavaScript Filter](jsf) to generate 3D vector graphics in GPAC.  
The [JS scripts](https://github.com/gpac/testsuite/tree/filters/media/jsf) in the GPAC test suite are also a good source of examples.

GPAC provides a media composition engine through its [Compositor Filter](compositor), capable of rendering BIFS, SVG, VRML and X3D. It requires however a scene description, and is limited to what the scene description syntax allows.
For a simpler and/or more customized support of 3D graphics, GPAC includes WebGL JavaScript bindings, allowing 3D graphics generation using the JS filter.
 
 Check the documentation of the [WebGL APIs](https://doxygen.gpac.io/group__webgl__grp.html) for more details. 


# Setting up WebGL
You need to import WebGL JavaScript bindings in your script:

```
import {WebGLContext} from 'webgl'
```

You will also very likely need to use matrices and textures. Helper tools from [EVG](evg) might help here:

```
import {Texture, Matrix} from 'evg'
```

As explained in the API documentation, WebGL in GPAC is not using DOM and does not use a canvas element to access the context. Rather, the context is explicitly created through a constructor:

```
let width=1280;
let height=720;
let gl = new WebGLContext(width, height);
```

You can also pass a WebGLContextAttributes object to the constructor:

```
let gl = new WebGLContext(width, height, {depth: false});
```

The second important thing regarding WebGL in GPAC is that a filter is responsible for deciding when to issue GL calls, and this is not always in the process callback. Your therefore must call `activate` on the context before issuing calls:

 ```
gl.activate(true);

//draw scene
...
//done
gl.activate(false);
 ```
 
Similarly, the context being not tied to a window or a particular PID, it is the filter's responsibility to resize the underlying framebuffer of the WebGL context:

```
gl.resize(640, 480);
```

You now have a working WebGL context to draw your content. There is no such thing as `requestAnimationFrame` in GPAC, so you either need to draw your content upon `filter.process` callback or post a given for your filter (using `filter.post_task`).

 
# Sending the framebuffer

Once your scene is drawn, you will likely want to use the results for later processing or display. 

## GPU texture output

In this mode, the dispatched packet will only contain reference to the GL texture associated with the frame buffer used, typically color. This avoids unnecessary GPU->systems memory transfer if the consuming filter is capable of processing GL textures.

This approach is simply performed by creating a new packet from your canvas:

```
//draw scene
...

let output_pck = output_pid.new_packet(gl);
//setup output packet, set DTS/CTS/etc..
...
//send packet
output_pck.send();
```

Note that a single framebuffer is created for each WebGL context. One problem with the above approach is that you will not know when the output frame is consumed, hence you will probably erase the associated framebuffer before it is processed. It is therefore recommended to use a callback to track the packet release:

```
if (filter.frame_pending) return;
//draw scene
...

//output canvas
let output_pck = output_pid.new_packet(gl, () => { filter.frame_pending=false; } );
//setup output packet, set DTS/CTS/etc..
...
//send packet
filter.frame_pending=true;
output_pck.send();
```


## Framebuffer copy output
In this mode, the dispatched packet will contain a copy of the framebuffer directly in system memory. The simplest way to do this is configuring the output PID to `rgb` or 'rgba` , allocating the packet and reading back the framebuffer throw gl.ReadPixels:

 ```
 let output_pck = output_pid.new_packet(width*height*3);
 
 gl.ReadPixels(0, 0, width, height, gl.RGB, gl.UNSIGNED_BYTE, output_pck.data);
 gl.activate(false);

 //setup output packet, set DTS/CTS/etc..
 ...
 //send packet
 output_pck.send();
 ```

Note that in this case you don't need to track when the output packet is consumed since it contains a full copy of the framebuffer.  
 
 # Using textures
 
 GPAC uses regular WebGL textures as well as what we call `NamedTexture` .
 
 Please [read the WebGL GPAC doc](https://doxygen.gpac.io/group__webgl__grp.html) for more details on textures.

## Regular textures 

 [EVG](evg) textures can be used to quickly load JPG or PNG images:
```
let texture = gl.createTexture();
let tx = new evg.Texture('source.jpg');
gl.bindtexture(gl.TEXTURE_2D, texture);
gl.texImage2D(target, level, internalformat, format, type, tx);
//at this point the data is uploaded on GPU, the EVG texture is no longer needed and can be GC'ed 
```

EVG texture combined with EVG Canvas can be used to draw text and 2D shapes:

```
let canvas = new evg.Canvas(200, 200, 'rgba');
 /* draw stuff on 2D canvas
 ...
 */
 let texture = gl.createTexture();
 let tx = new evg.Texture(canvas);
 gl.bindtexture(gl.TEXTURE_2D, texture);
 gl.texImage2D(target, level, internalformat, format, type, tx);
 //at this point the data is uploaded on GPU, the EVG texture and canvas are no longer needed and can be GC'ed 
```

## NamedTextures 

Named textures provide a quick way of setting up texturing in various formats supported by GPAC for later use in GLSL shaders, hiding all the complexity of pixel conversion.

A named texture is a texture created with a name:
```
let tx = gl.createTexture('myVidTex');
```

The texture data is then associated using upload():
```

//source data is in system memory or already in OpenGL textures
let pck = input_pid.get_packet();
tx.upload(pck);
//or
//source data is only in system memory
tx.upload(some_evg_texture);
```

Regular bindTexture and texImage2D can also be used if you don't like changing your code too much:
```
let pck = input_pid.get_packet();
gl.bindTexture(gl.TEXTURE_2D, tx);
//source data is in system memory or already in OpenGL textures
gl.texImage2D(target, level, internalformat, format, type, pck);
//or
gl.bindTexture(gl.TEXTURE_2D, tx);
//source data is only in system memory
gl.texImage2D(target, level, internalformat, format, type, some_evg_texture);
```

The magic comes in when creating your shaders: any call to texture2D on a sampler2D using the same name as the NamedTexture is rewritten before compilation and replaced with GLSL code handling the pixel format conversion for you !
```
varying vec2 vTextureCoord;
uniform sampler2D myVidTex; //this will get replaced before compilation
uniform sampler2D imageSampler; //this will NOT get replaced
void main(void) {
  vec2 tx = vTextureCoord;
  vid = texture2D(myVidTex, tx); //this will get replaced before compilation
  img = texture2D(imageSampler, tx); //this will NOT get replaced
  vid.alpha = img.alpha;
  gl_FragColor = vid;
}
```

The resulting fragment shader may contain one or more sampler2D and a few additional uniforms, but they are managed for you by GPAC!

The named texture is then used as usual:
```
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tx);
//this one is ignored for named textures (the uniformlocation object exists but is deactivated) but you can just keep your code as usual
gl.uniform1i(myVidTexUniformLocation, 0);
gl.activeTexture(gl.TEXTURE0 + tx.nb_textures);
gl.bindTexture(gl.TEXTURE_2D, imageTexture);
gl.uniform1i(imageSamplerUniformLocation, 0);
```

In the above code, note the usage of `tx.nb_textures` : this allows fetching the underlying number of texture units used by the named texture, and properly setting up multi-texturing.

The core concept for dealing with NamedTexture is that the fragment shader sources must be set AFTER the texture is being setup (upload / texImage2D). Doing it before will result in an unmodified fragment shader and missing uniforms.

To summarize, NamedTexture allows you to use existing glsl fragment shaders sources with any pixel format for your source, provided that:

- you tag the texture with the name of the sampler2D you want to replace
- you upload data to your texture before creating the program using it


# Primary framebuffer
You can setup your WebGL context to work on the main (primary) framebuffer. This can be done by specifying the `primary` attribute in the WebGLContextAttributes object:

```
let gl = new WebGLContext(width, height, {primary: true});
```

You can then dispatch your output packets as usual:
```
if (filter.frame_pending) return;
//draw scene
...

//output canvas
let output_pck = output_pid.new_packet(gl, () => { filter.frame_pending=false; } );
//setup output packet, set DTS/CTS/etc..
...
//send packet
filter.frame_pending=true;
output_pck.send();
```

In this mode, the `vout` filter consuming the output packets will only perform a backbuffer swap.

# Dispatching the depth buffer

You can setup your WebGL context to allow dispatching of the depth buffer as GPU textures by specifying the `depth` attribute in the WebGLContextAttributes object:

```
let gl = new WebGLContext(width, height, {depth: texture});
```

The depth buffer can then be dispatched by creating an output packet:

```
let output_pck = output_pid.new_packet(gl, () => { filter.frame_pending=false; }, true );
```

This mode still lets you output the color buffer.  This mode is however not compatible with usage of the primary framebuffer.

You can also dispatch the depth buffer as a regular system memory packet by reading back the depth buffer using `gl.ReadPixels`. 
