import {WebGLContext} from 'webgl'
import * as THREE from 'three/src/Three.js'

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


}

let scene=null;
let camera=null;
let cube=null;

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


  cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({
                color: 0xFF0000
            }))

  scene.add(cube);
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

	gl.activate(true);
  cube.rotation.y = Math.PI * 2 * (cts%50)/50;  

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



