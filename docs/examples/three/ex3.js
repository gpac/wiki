import {WebGLContext} from 'webgl'
import * as evg from 'evg'
import { XMLHttpRequest } from 'xhr'

import * as THREE from 'three/src/Three.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


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
console.info = function() { this.loglevel = 1; this._do_log.apply(this, arguments); };
console.debug = function() { this.loglevel = 0; this._do_log.apply(this, arguments); };
globalThis.console=console;

//XHR
globalThis.XMLHttpRequest = XMLHttpRequest;

//document
let document = {};
document.createElementNS = function(ns, tag)
{
  if (tag != 'img') return null;
  //create empty texture
  let img = new evg.Texture();
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
globalThis.document=document;
globalThis.self={};

}

let scene=null;
let camera=null;
let cube=null;
let texture_loader = null;
let gltf_loader=null;
let scene_root=null;

function init_gl_and_three()
{
  //init WebGL
  gl = new WebGLContext(width, height, {depth: false, primary: false});
  print('GL init done !');

  //init Three
  let fake_canvas={};
  fake_canvas.style={};
  fake_canvas.addEventListener = function(evt_name, callback, use_capture) { print('CanvasAddEventListener: ' + evt_name); };

  renderer = new THREE.WebGLRenderer( {canvas: fake_canvas, context: gl, width: width, height: height } );
  renderer.setSize(width, height);
  print('Three.js init !');

  //Create simple scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, .5, 1000);
  camera.position.set(3, 3, 3);
  camera.lookAt(0, 0, 0);

  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(5, 10, 2);
  scene.add(light);
  scene.add(light.target);


  texture_loader = new THREE.TextureLoader();

  gltf_loader = new GLTFLoader();

  gltf_loader.load('Cube.gltf', (gltf) => {
    scene_root = gltf.scene;
    scene.add(scene_root);
    print('GLTF loaded');
  });
}


init_globals_for_three();

init_gl_and_three();


filter.initialize = function()
{
  this.set_cap({id: "StreamType", value: "Video", output: true} );
  this.set_cap({id: "CodecID", value: "raw", output: true} );

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


filter.process = function()
{
	if (filter.frame_pending) return GF_OK;

  process_pending_images();

	gl.activate(true);
  if (scene_root)
      scene_root.rotation.y = Math.PI * 2 * (cts%50)/50;  

  renderer.state.reset();
  renderer.render(scene, camera);

	gl.flush();
	gl.activate(false);

	let opck = pid.new_packet(gl, () => { filter.frame_pending=false; } );
	this.frame_pending = true;
	opck.cts = cts;
	cts += 1;
	opck.send();
	return GF_OK;
}


function process_pending_images()
{

  for (let i=0; i<pending_images.length; i++) {
    let img = pending_images[i];
    if (typeof img.src !== 'string') continue;
    pending_images.splice(i, 1);
    i--;

    print('Image URL is ' + img.src);
    img.load(img.src, true);
    if (img.on_load != null) {
      img.on_load({});
    } else {
      print('Error loading ' + img.src);
    }
  }
}

