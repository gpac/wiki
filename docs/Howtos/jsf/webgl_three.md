# Foreword {:data-level="all"}

We discuss here how to use the [JavaScript Filter](jsf) WebGL along with Three.js in GPAC.

[Three.js](https://threejs.org/) is a powerful JS library for 3D rendering, potentially using a software renderer as a fallback. Software rendering is not supported, as Three.js requires Canvas2D/SVG/CSS3D for this, which are not available in GPAC.

_Note: you may try to write a Canvas2D polyfill based on GPAC [EVG](evg)._

We recommend reading the [WebGL HowTo](webgl) before anything else.

GPAC does not allow loading JS filters using remote scripts, so you will need to download the latest release of Three.js (this howto was tested with r130). We assume:

- your JS filter script is called `ex3D.js`
- your Three.js distribution is unzipped as "three" in the same directory as  `ex3D.js`

Launching the result is done using:
```
gpac ex3d.js vout
```

__WARNING The code examples below do not check for errors :)__


# Basic WebGL and Three setup
You need to import WebGL bindings and Three.js in your script:

```
import {WebGLContext} from 'webgl'
import * as THREE from 'three/src/Three.js'
```

You then create a WebGL context (in this example, on a texture but you can also use the primary display):

```
let width=1280;
let height=720;
let gl = new WebGLContext(width, height);
```

You can also pass a WebGLContextAttributes object to the constructor:

```
let gl = new WebGLContext(width, height, {depth: false});
```

We do not cover here how to setup the output PID of your filter, see the [WebGL HowTo](webgl).


Three.js requires a console object, which is not available in GPAC JS. Let's create one:

```

let console = {};
console.loglevel=0;
console._do_log = function() {
  var msg = '';
  for (let i=0; i<arguments.length; i++) {
    if (i) msg += ' ';
    msg += '' + arguments[i];
  }
  print(this.loglevel, msg);
  this.loglevel=0;
}
console.error = function() { this.loglevel = 3; this._do_log.apply(this, arguments); };
console.warn = function() { this.loglevel = 2; this._do_log.apply(this, arguments); };
console.log = function() { this.loglevel = -1; this._do_log.apply(this, arguments); };
console.info = function() { this.loglevel = 1; this._do_log.apply(this, arguments); };
console.debug = function() { this.loglevel = 0; this._do_log.apply(this, arguments); };
globalThis.console=console;
```

Note that we need to export the console object to `globalThis` for Three.js to see it.


As previously explained, GPAC WebGL does not run in a DOM context, there is no such thing as a canvas element. 
Luckily for us, Three.js can initialize a WebGL renderer from a pre-existing canvas object and GL context.
We just need to create a basic canvas object that Three.js can interact with, and load the WebGL renderer:

```
let fake_canvas={};
fake_canvas.style={};
fake_canvas.addEventListener = function(evt_name, callback, use_capture) { print('CanvasAddEventListener: ' + evt_name); };

renderer = new THREE.WebGLRenderer( {canvas: fake_canvas, context: gl, width: width, height: height } );
renderer.setSize(width, height);
print('Three.js init !');

```

Congratulations, you now have Three.js ready to go ! Let's define a simple scene, a cube and light:

```
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(40, width / height, .5, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);


const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(5, 10, 2);
scene.add(light);
scene.add(light.target);

let cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({
                color: 0xFF0000
            }))

scene.add(cube);

``` 


We now need to render the scene. As GPAC WebGL runs outside of DOM, there is no `requestAnimationFrame` available. The rendering will happen in your filter process function.
Given that your filter is likely not the only one using the underlying OpenGL context, you will need to reset the state of the Three renderer before each draw call. 

The following shows animating the cube:

```
let cts=0
filter.process = function()
{
	if (filter.frame_pending) return GF_OK;
	//we MUST activate the context
	gl.activate(true);

	//let's rotate our cube
	cube.rotation.y = Math.PI * 2 * (cts%50)/50;  

	//we MUST reset Three.js renderer state
	renderer.state.reset();
	
	//and render
	renderer.render(scene, camera);
	
	//we are done, flush OpenGL pipeline and deactivate context
	gl.flush();
	gl.activate(false);

	//create packet from webgl framebuffer
	let opck = pid.new_packet(gl, () => { filter.frame_pending=false; } );
	this.frame_pending = true;
	opck.cts = cts;
	cts += 1;
	opck.send();
	return GF_OK;
}
```

And that's it !


The complete code for this example is [here](examples/three/ex1.js).


# Using textures

In WebGL, textures are passed using `img`, `video` or `canvas` tags, which we don't have in GPAC. Three.js uses the DOM to load these elements with the desired source.

We'll need to:

- trick Three.js again, by creating a `document` object intercepting calls to element creation. 
- use EVG textures to pass the data to WebGL

Import EVG:
```
import * as evg from 'evg'
```

Create our texture loader:

```
let pending_images = [];

let document = {};
document.createElementNS = function(ns, tag)
{
  if (tag != 'img') return null;
  //create a texture, empty since we don't yet have the `src` attribute !
  let img = new evg.Texture();
  img.on_load = function() {};
  img.on_error = function() {};

  //setup addEventListener for this image
  img.addEventListener = function(evt_name, callback, use_capture) { 
      if (evt_name == "load") {
        img.on_load = callback;
      } 
      else if (evt_name == "error") {
        img.on_error = callback;
      } 
  };
  //setup removeEventListener for this image - we don't use it in this example
  img.removeEventListener = function(evt_name, callback, use_capture) {};

  //remember the image still to be loaded
  pending_images.push(img);
  return img;

}
globalThis.document=document;
```

So far, what we did is create an EVG texture instead of an `img` DOM element, so that any call to `gl.texImage2D`  made for that image is indeed passing an EVG texture.


We need to load the image once the `src` attribute is set. In this example this is "brute force", you will likely find more elegant ways for this.

```

function process_pending_images()
{

  for (let i=0; i<pending_images.length; i++) {
    let img = pending_images[i];
    if (typeof img.src !== 'string') continue;
    pending_images.splice(i, 1);
    i--;

    print('Image URL is ' + img.src);
    //load image into EVG texture - this assumes JPG or PNG only.
    img.load(img.src, true);
    if (img.on_load != null) {
	  //pass a dummy event
      img.on_load({});
    }
  }
}

```

_Note: we pass `true` to `img.load` to indicate that the given path is relative to our script and not to the current working directory._

We can now setup texture loader as usual in Three.js:

```
const loader = new THREE.TextureLoader();

let cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                map: loader.load('logo.jpg')
            }))

scene.add(cube);

```

The complete code for this example is [here](examples/three/ex2.js).

You can expand this to create textures containing the result of an EVG canvas draw, as long as what you return is an object that is accepted by GPAC as a WebGL texture, as explained [here](https://doxygen.gpac.io/group__webgl__grp.html).


# Using Three.js loaders

Three.js model loaders rely on XmlHttpRequest to fetch data. You will need to import this:

```
import { XMLHttpRequest } from 'xhr'
globalThis.XMLHttpRequest = XMLHttpRequest;
```

Again, note that we need to export  to `globalThis` for Three.js to see the object.


You will also need to import the loader; in this example, we use the GLTF loader:

 
```
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
```

Also not that some loaders will use the `self` object without checking for its presence, so let's prevent any type error here:

```
globalThis.self={};
```

Then we only need to load the model !

```
const gltfLoader = new GLTFLoader();

let scene_root=null;
gltfLoader.load('Cube.gltf', (gltf) => {
  scene_root = gltf.scene;
  scene.add(scene_root);
  print('GLTF loaded');
});
```

The complete code for this example is [here](examples/three/ex3.js).



# Using video

We will now load a video as a texture in Three.js. Again, no `video` tag to help us, so we will use the same workaround as previously for images, and use EVG textures.

We will try to load the given resource as an EVG texture, and if this fails we try to load the resource as a filter. This implies:

- your filter will now accept video inputs
- you will have to relink input PIDs to sources

The first thing to do is accept incoming raw video for your filter, typically in initialize():
```
filter.initialize = function()
{
  //we accept and produce raw video streams
  this.set_cap({id: "StreamType", value: "Video", inout: true} );
  this.set_cap({id: "CodecID", value: "raw", inout: true} );

  //declare output PID
}
```

The check if loading an image fails:

```
    try {
      img.load(img.src, true);
      if (img.on_load != null)
        img.on_load({});
    } catch (e) {
      print('Loading as filter ' + img.src);
      load_src_as_filter(img);
    }
```

We now need to load a source filter for this URL:

```

function load_src_as_filter(img)
{
  //no associated PID
  img.pid = null;

  //make the EVG texture a named texture
  img.set_named("map");
  //no need to recompute shaders yet
  img.recompute_shaders = false;

  //load a source filter
  img._src_filter = filter.add_source(img.src);
  if (!img._src_filter) return;

  //indicate we want our filter to connect to PIDs coming from the source
  filter.set_source(img._src_filter);

  //remember our EVG texture and notify the load callback
  sources.push(img);
  if (img.on_load)
    img.on_load({});
}
```

The first important thing here is that we make our EVG texture a named texture, so that pixel conversion to RGBA is done in the shader. As with WebGL, this means that the shader will have to be recompiled once the pixel format and frame size of the source is known.  
The name `map` chosen is the name used by the sampler2D in most material shaders of Three.js. 

_Note_
You don't have to use named textures if you know that the input is in RGB/RGBA format (or a format requiring a single texture in openGL), but named texture will always work whether the source is in YUV or RGB format.

The second important thing is that we call right away the load callback to trick Three.js into believing the texture is OK. This means that we need a valid texture at this point, so in the texture construction we will create the texture a a dummy 2x2 RGB one:

```
  let img = new evg.Texture(2, 2, 'rgb', new ArrayBuffer(2*2*3));
```

If we call the Three.js callback after updating the texture, we will likely have complaints about "texture too big" for Three.js.


We now need to grab frames from the source. We first need to catch PID connections:

```
function get_source_by_pid(pid)
{
  let res = null;
  sources.forEach( img => { 
    if (pid.is_filter_in_parents(img._src_filter)) {
      res = img;
      return;
    }
  } );
  return res;
}


filter.configure_pid = function(pid)
{
  if (!sources.length) return GF_FILTER_NOT_SUPPORTED;
  let img = get_source_by_pid(pid);
  if (!img) return GF_BAD_PARAM;

  //first connection
  if (!img.pid) {
      img.pid = pid;
      print('PID connected');
      //start playback at 60 sec into content
      let evt = new FilterEvent(GF_FEVT_PLAY);
      evt.start_range = 60.0;
      pid.send_event(evt);
  }
  //we need to recompute shaders after the first upload - a clean code should check if width/height/pixformat have changed, if not no need to reconfigure
  img.recompute_shaders = true;
}
```

Now the input PID is associated to the EVG texture, we just need to update the texture in the filter `process` function:

```
  //browse all sources, and update packets 
  let pids=[];
  if (sources.length) {
    let img = sources[0];
    if (img.pid) {
      let pck = img.pid.get_packet();
      if (pck) {
        //update texture
        img.update(pck);
        //remember to release packet once drawn
        //we cannot release right now as the packet may be using openGL textures, which could then be discarded before render()
        pids.push(img.pid);
        //first packet seen, recompute our shaders - here we just create a new material on our only textured object, the cube
        if (img.recompute_shaders) {
          img.recompute_shaders = false;
          cube.material = new THREE.MeshBasicMaterial({ map: texture });
        }
      }
    }
  }
```

And that's it. You will also need to cleanup your packets once no longer used, e.g. after `render()`:

```
  pids.forEach( pid => { pid.drop_packet(); });
```

In this example,  we assume the source is 25fps just like our filter, but you may decide otherwise and not trash a packet at each generated frame.


The complete code for this example is [here](examples/three/ex4.js).


# Using Controls

Let's now add some mouse/keyboard interaction, in this example using OrbitControler. You will need to import this module:

```
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
```

Before creating the controller, we need to setup the DOM element used by the renderer:
```
  renderer.domElement.ownerDocument = document;
  renderer.domElement.clientWidth = width;
  renderer.domElement.clientHeight = height;
```

We need to provide DOM event interface to Three.js. First we do this on the document object, and provide info for UI event (client width and height):

```
document.on_mouse_move = null;
document.on_mouse_up = null;
document.on_key_down = null;
document.addEventListener = function(evt_name, callback, use_capture) { 
  if (evt_name==='pointerup') this.on_mouse_up = callback;
  else if (evt_name==='pointermove') this.on_mouse_move = callback;
  else if (evt_name==='keydown') this.on_key_down = callback;
  else print('document.addEventListener unhandled event ' + evt_name); 
};
document.removeEventListener = function(evt_name, callback, use_capture) {
  if (evt_name==='pointerup') this.on_mouse_up = null;
  else if (evt_name==='pointermove') this.on_mouse_move = null;
  else if (evt_name==='keydown') this.on_key_down = null;
};
document.clientWidth = width;
document.clientHeight = height;

```

Then we provide DOM event interface on our canvas element, since Three.js registers listener to both document and canvas:

```
  canvas.on_mouse_move=null;
  canvas.on_mouse_down=null;
  canvas.on_mouse_up=null;
  canvas.on_mouse_wheel=null;
  canvas.addEventListener = function(evt_name, callback, use_capture)
  {
    if (evt_name==='pointerdown') this.on_mouse_down = callback;
    else if (evt_name==='pointercancel') this.on_mouse_up = callback;
    else if (evt_name==='wheel') this.on_mouse_wheel = callback;
    else print('Canvas.addEventListener unhandled event ' + evt_name); 
  };

  canvas.removeEventListener = function(evt_name, callback, use_capture)
  {
    print('Canvas.removeEventListener: ' + evt_name); 
    if (evt_name==='pointerdown') this.on_mouse_down = null;
    else if (evt_name==='pointercancel') this.on_mouse_up = null;
    else if (evt_name==='wheel') this.on_mouse_wheel = null;
  };

```

We can now create our controls:
```
  controls = new OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.listenToKeyEvents(document); 
```

Since we enable inertia, you will need to call `controls.update();` before rendering the scene.


We will also some utility functions to translate GPAC events into DOM API:

```

let dom_evt = {};
dom_evt.button = 0;
dom_evt.clientX = 0;
dom_evt.clientY = 0;
dom_evt.pageX = 0;
dom_evt.pageY = 0;
dom_evt.code = 0;
dom_evt.preventDefault = function() {};

function make_dom_mouse_event(evt, is_down)
{
  if (is_down)
      dom_evt.button = evt.button;
  dom_evt.clientX = evt.mouse_x;
  dom_evt.clientY = evt.mouse_y;
  dom_evt.pageX = dom_evt.clientX;
  dom_evt.pageY = dom_evt.clientY;

  return dom_evt;
}

function make_dom_key_event(evt, is_down)
{
  let mods = evt.keymods;

  dom_evt.ctrlKey = (mods & GF_KEY_MOD_CTRL) ? true : false;
  dom_evt.metaKey = (mods & GF_KEY_MOD_ALT) ? true : false;
  dom_evt.shiftKey = (mods & GF_KEY_MOD_SHIFT) ? true : false;

  if (evt.keyname=="Left")  dom_evt.code = "ArrowLeft";
  else if (evt.keyname=="Right")  dom_evt.code = "ArrowRight";
  else if (evt.keyname=="Up")  dom_evt.code = "ArrowUp";
  else if (evt.keyname=="Down")  dom_evt.code = "ArrowDown";
  else dom_evt.code = evt.keyname;

  return dom_evt;
}
```

The final step is to catch GPAC events and forward them to the registered listeners. We use the `process_event` filter callback for this:

```
filter.process_event = function(pid, evt)
{
  if (evt.type != GF_FEVT_USER) {
    return;
  } 
  if (!canvas) return;

  if ((evt.ui_type == GF_EVENT_MOUSEDOWN) && canvas.on_mouse_down) {
      canvas.on_mouse_down( make_dom_mouse_event(evt, true)  );
  }
  if ((evt.ui_type == GF_EVENT_MOUSEUP)) {
      if (document.on_mouse_up)
        document.on_mouse_up( make_dom_mouse_event(evt, false)  );
      if (canvas.on_mouse_up)
        canvas.on_mouse_up( make_dom_mouse_event(evt, false)  );
  }

  if ((evt.ui_type == GF_EVENT_MOUSEMOVE) && document.on_mouse_move) {
    document.on_mouse_move( make_dom_mouse_event(evt, false)  );
  }

  if ((evt.ui_type == GF_EVENT_KEYDOWN) && document.on_key_down) {
    document.on_key_down( make_dom_key_event(evt, true) );
  }
  if (evt.ui_type == GF_EVENT_KEYUP) {
    dom_evt.ctrlKey = false;
    dom_evt.metaKey = false;
    dom_evt.shiftKey = false;
  }
}
```


You can now pan/rotate your models !

The complete code for this example is [here](examples/three/ex5.js).
