import {WebGLContext} from 'webgl'
import * as evg from 'evg'

import * as THREE from 'three/src/Three.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

let pending_images=[];

//metadata
filter.set_name("Three.js Test");

let width = 600;
let height = 600;
let osize=0;
let cts=0;
let pid = null;
let renderer = null;
let gl = null;
//keep document global
let document = null;

function init_globals_for_three()
{
//console
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
console.info = function() { this.loglevel = 2; this._do_log.apply(this, arguments); };
console.debug = function() { this.loglevel = 0; this._do_log.apply(this, arguments); };
globalThis.console=console;

//document
document = {};
document.createElementNS = function(ns, tag)
{
  if (tag != 'img') return null;
  //create empty texture
  let img = new evg.Texture(2, 2, 'rgb', new ArrayBuffer(2*2*3));
  img.addEventListener = function(evt_name, callback, use_capture) { 
      if (evt_name == "load") {
        img.on_load = callback;
      } 
      else if (evt_name == "error") {
        img.on_error = callback;
      } 
  };
  img.removeEventListener = function(evt_name, callback, use_capture) {};

  img.on_load = function() {};
  img.on_error = function() {};
  pending_images.push(img);
  return img;
}

//setup DOM events API - we consider here that only one listener will ever be added for a given event
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
globalThis.document=document;


}

let scene=null;
let camera=null;
let cube=null;
let texture_loader = null;
let texture = null;
let controls = null;
let canvas = null;

function init_gl_and_three()
{
  //init WebGL
  gl = new WebGLContext(width, height, {depth: false, primary: false});
  print('GL init done !');

  //setup DOM events API on canvas - we consider here that only one listener will ever be added for a given event
  canvas={};
  canvas.style={};
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

  //init Three.js
  renderer = new THREE.WebGLRenderer( {canvas: canvas, context: gl, width: width, height: height } );
  renderer.setSize(width, height);
  print('Three.js init !');

  //Create simple scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, .5, 1000);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(5, 10, 2);
  scene.add(light);
  scene.add(light.target);

  const light2 = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 1);
  scene.add(light2);


  texture_loader = new THREE.TextureLoader();

  texture = texture_loader.load('logo.jpg');

  cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({ map: texture }));

  scene.add(cube);

  //DOM setup of renderer elements
  renderer.domElement.ownerDocument = document;
  renderer.domElement.clientWidth = width;
  renderer.domElement.clientHeight = height;

  //create controls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.listenToKeyEvents(document); 
}


init_globals_for_three();

init_gl_and_three();



filter.initialize = function()
{
  this.set_cap({id: "StreamType", value: "Video", inout: true} );
  this.set_cap({id: "CodecID", value: "raw", inout: true} );

  pid = this.new_pid();
  pid.set_prop('StreamType', 'Visual');
  pid.set_prop('CodecID', 'raw');
  pid.set_prop('Width', width);
  pid.set_prop('Height', height);
  pid.set_prop('FPS', {n:25, d:1} );
  pid.set_prop('Timescale', 25);
  pid.set_prop('PixelFormat', 'rgba');
  cts=0;
  filter.frame_pending=false;
}

let sources=[];

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

  if (!img.pid) {
      img.pid = pid;
      //start
      let evt = new FilterEvent(GF_FEVT_PLAY);
      evt.start_range = 0.0;
      pid.send_event(evt);
  }
  //we need to recompute shaders after the first upload - a clean code should check if width/height/pixformat have changed, if not no need to reconfigure
  img.recompute_shaders = true;
}


filter.process = function()
{
	if (filter.frame_pending) return GF_OK;

  process_pending_images();

	gl.activate(true);


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
        //we cannot release after the push as the packet may be using openGL textures which could then be discarded before used
        pids.push(img.pid);
        if (img.recompute_shaders) {
          img.recompute_shaders = false;
          //in our example only the cube uses this image
          print('request shader recompile');
          cube.material = new THREE.MeshBasicMaterial({ map: texture });
        }
      }
    }
  }

  cube.rotation.y = Math.PI * 2 * (cts%100)/100;  
  //we use inertia, update controls
  controls.update();
  renderer.state.reset();
  renderer.render(scene, camera);

	gl.flush();
	gl.activate(false);

  //cleanup our packets - we assume the sources are 25fps just like our filter
  pids.forEach( pid => { pid.drop_packet(); });

	let opck = pid.new_packet(gl, () => { filter.frame_pending=false; filter.reschedule(0); } );
	this.frame_pending = true;
	opck.cts = cts;
	cts += 1;
	opck.send();

	return GF_OK;
}



function load_src_as_filter(img)
{

  img.pid = null;
  img.set_named("map");
  img.recompute_shaders = false;

  filter.require_source_id = true;
  img._src_filter = filter.add_source(img.src);
  if (!img._src_filter) return;

  filter.set_source(img._src_filter);

  sources.push(img);
  if (img.on_load)
    img.on_load({});
}

function process_pending_images()
{

  for (let i=0; i<pending_images.length; i++) {
    let img = pending_images[i];
    if (typeof img.src !== 'string') continue;
    pending_images.splice(i, 1);

    try {
      img.load(img.src, true);
      if (img.on_load != null)
        img.on_load({});
    } catch (e) {
      print('Loading as filter ' + img.src);
      load_src_as_filter(img);
    }
  }
}


//GPAC to DOM tools
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

//catch our events
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
    return;
  }

  //cancel event
  return true;
}


