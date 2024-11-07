---
tags:
- mpd
- pid
- reframer
- data
- tile
- codec
- filter
- connection
- pipe
- session
- packet
- pipeline
- remux
- stream
- bitstream
- sequence
- dump
- block
- link
- media
- segment
- isobmff
- property
- group
- libgpac
- chunk
- track
- option
- profile
- mp4
- source
- packets
- chain
- input
- isomedia
- output
- sink
- dash
---



# Overview {: data-level="all" }

We discuss here how to use [GPAC Filters](Filters) in NodeJS. 

This GPAC node-API provides bindings to GPAC filter session. The design is almost identical to the [Python](python) bindings, closely inspired from the [JS FilterSession](jssession) API used in GPAC.

The GPAC Node API is [documented here](https://doxygen.gpac.io/group__nodejs__grp.html).

You can also have a look at the  [test script](https://github.com/gpac/gpac/tree/master/share/nodejs/) in the GPAC repository.


__Warning GPAC NodeJS bindings are only available starting from GPAC 2.0.__

# Before you begin {: data-level="beginner" }
   
The GPAC NodeJS bindings are using [n-api](https://nodejs.org/api/n-api.html) for interfacing with libgpac filter session, while providing an object-oriented wrapper hiding all GPAC C design.

The binding is called gpac_napi.c, and is hosted in GPAC [source tree](https://github.com/gpac/gpac/blob/master/share/nodejs/). It is NOT installed during default install step.

You will need to build the module using `node-gyp`, potentially editing `share/nodejs/binding.gyp` as required for your system.
The `binding.gyp` provided is for GPAC:

- built in regular shared library mode for libgpac (i.e. NodeJS module is not compatible with mp4box-only build)
- installed on your system (gpac headers available in a standard include directory, libgpac in standard lib directory), typically done with `sudo make install` after building gpac


You can then build using:
```
% cd gpac/share/nodejs
% node-gyp configure
% node-gyp build
```

If you don't want to install on your system, you will need to modify the `binding.gyp` file to set the include dir to the root of gpac source tree:

```
"include_dirs": ["<(module_root_dir)/../../include"]
```

- If built using configure and make, you will likely have a custom config.h file, and the build tree root must also be indicated together with the `GPAC_HAVE_CONFIG_H` macro.

- If you build gpac at the top of the gpac source tree (using e.g. `./configure && make`),  the build tree root for node will be `<(module_root_dir)/../..`.

- If you build gpac in gpac/bin/mytest, (using e.g. `mkdir bin/mytest && cd bin/mytest && ../../configure && make`),  the build tree root for node will be `<(module_root_dir)/../../bin/mytest`.

You will also likely need to update the `libraries` property to add the path to your libgpac shared library (typically in bin/gcc of the build tree root).

```
{
    "targets": [{
        "target_name": "gpac",
        "sources": [ "./src/gpac_napi.c"],
        "include_dirs": ["<(module_root_dir)/../../include", "<(module_root_dir)/../.."],
        "libraries": [ '-lgpac',"-L<(module_root_dir)/../../bin/gcc"],
        "defines":["GPAC_HAVE_CONFIG_H"]
    }]
}

```

The build is usually located in `$GPAC_SRC/share/node/build/Release` so you will need to specify the full path to the module in your JS file:

```
const gpac = require('./build/Release/gpac');
```

or if you want to use the provided `index.js`, simply use:
```
const gpac = require(path/to/gpac/share/nodejs);
```

Check everything is in place running the following JS:


```
const gpac = require('./build/Release/gpac');

console.log("Welcome to GPAC NodeJS !\nVersion: " + gpac.version);
```

Running this should print your current GPAC version. 

A test program [gpac.js](https://github.com/gpac/gpac/blob/master/share/nodejs/test/gpac.js) exercising most of the NodeJS GPAC bindings is available in  `gpac/share/nodejs/test`

# Tuning up GPAC {: data-level="beginner" }


The first thing to do is to initialize libgpac. This is done by default while importing the bindings with the following settings:

- no memory tracking
- default GPAC profile used

If you want to change these, you need to re-init libgpac right after import:

```
gpac.init(1, "customprofile");
```

Any call other than `init`  to GPAC will prevent any subsequent call to `init` to be executed.

Before starting any filter session, you may also need to pass some global configuration options (libgpac core or filter options) to GPAC:

```
//For example, blacklist some filters, run quiet and set vsync option (for vout)
gpac.set_args(["gpacnode", "-blacklist=filters_you_do_not_want", "-quiet", "--vsync=0"]);
```

You can also pass the command line arguments so that you can specify GPAC options at prompt:
```
gpac.set_args(process.argv);
```

__WARNING: the arguments must all be set together, only the first call to set_args() will be taken into account__
 
You may want to adjust the log tools and levels of GPAC:
```
gpac.set_logs("dash@info");
```


# Setting up filter sessions {: data-level="beginner" }
## Simple sessions

To create a filter session, the simplest way is to use all defaults value, creating a single-threaded blocking session:

```
fs = new gpac.FilterSession();
```

You can then add your filters as usual. 

Playback example:

```
f1 = fs.load_src("file.mp4");
f2 = fs.load("vout");
fs.run();
```

Remux example:

```
f1 = fs.load_src("file.mp4");
f2 = fs.load_dst("test.ts");
fs.run();
```

Since the session is blocking, you won't be able to run any other JS code until the end of the session.

## Non-blocking sessions

A non-blocking session will need to be called on regular basis to process pending filter tasks. It is useful if you need to do other tasks while the session is running and do not want to use callbacks from GPAC for that.

```
fs = gpac.FilterSession(gpac.GF_FS_FLAG_NON_BLOCKING);
f1 = fs.load_src("file.mp4");
f2 = fs.load("vout");
while (1) {
	//do things

	//call session
	fs.run();

	//if last task, GPAC session is done
	if (fs.last_task) break;
}
```

This allows you to do _some_ JS work on the side, however any JS call involving promises will not work here, as promises are resolved inside NodeJS main event loop and we don't go there until the end of the session.

## Async non-blocking sessions

To run the session in non-blocking mode while still allowing NodeJS to run its main event loop and resolve other promises, you will need to run the session as a promise. The following example is creating a promise recursively calling itself until the end of the session:

```
//create session in non-blocking mode:
let fs = new gpac.FilterSession(gpac.GF_FS_FLAG_NON_BLOCKING);

//setup your filters

//Run session as Promise
const FilterSessionPromise = (fs_run_task) => {
  var fsrun_promise = () => {
    return (fs.last_task==false) ? fs_run_task().then(fsrun_promise) : Promise.resolve();
  }
  return fsrun_promise();
};

const run_task = () => {
	return new Promise((resolve, reject) => {
	  resolve( fs.run_step() );
	});
}
FilterSessionPromise(run_task).then( ).finally( ()=> { console.log('session is done'); } ) );

console.log('Entering NodeJS EventLoop');
```


## Callbacks in sessions

Regardless of the way you run the session, you can request for being called back once or on regular basis. This is achieved by posting tasks to the GPAC session scheduler. A task object shall provide an `execute` method to be called. This function may return:

-  `false` to cancel the task, 
- `true` to reschedule the task asap
- a positive integer giving the time of next task callback in milliseconds

The callback function is called with `this` set to the task object.

```
//create a custom task
task = {};
task.execute = () => {
	console.log('in task'); 
	return 1000;
};
fs.post(task);

//run as usual
```
  
Tasks can be created at any time, either at the beginning or in a callback function (e.g., another task).

_NOTE When running the session in multi-thread mode, callback tasks are always executed by the main thread (NodeJS main)._

## Linking filters

In order to link filters when desired, you must explicitly do this using `set_source` of the destination filter. For example, when inserting a [reframer](reframer) in a chain:

```
f_src = fs.load_src('source.mp4');
f_dst = fs.load_dst('remux.mp4');
f_reframe = fs.load('reframer');
f_dst.set_source(reframer);
```

You can specify the usual link filtering as an optional argument to `set_source`:
```
f_dst.set_source(reframer, "#PID=1");
```

This will instruct that the destination only accepts PIDs coming from the reframer filter, and with ID 1.


## Inspecting filters

You can query the number of input and output PIDs of a filter, the source filter of an input PID, the destination filters of an output PID, their possible options, update options, send events, ...

Please check the  [API documentation](https://doxygen.gpac.io/group__nodejs__grp.html) and refer to the [NodeJS example](https://github.com/gpac/gpac/blob/master/share/nodejs/test/gpac.js).

Note that  (as in GPAC JS or Python) properties referring to constant values are not exposed as their native types but as strings. This is the case for these important types:

- StreamType: string containing the stream type name (e.g. 'Visual', 'Audio', ...)
- CodecID: string containing the codec name
- PixelFormat: string containing the pixel format name
- AudioFormat: string containing the audio format name


# Custom Filters {: data-level="expert" }

You can define your own filter(s) to interact with the media pipeline. As usual in GPAC filters, a custom filter can be a source, a sink or any other filter. It can consume packets from input PIDs and produce packets on output PIDs. 

Custom filters are created through the `new_filter` function of the filter session object. The custom filter can then assign its callbacks functions:

- `GF_Err process()` method called whenever the filter has some data to process.
- `GF_Err configure_pid(pid, is_remove)` method called whenever a new PID must be configured, re-configured or removed in the custom filter
- `Bool process_event(evt)` method called whenever an event is passing through the filter or one of its PIDs
- `GF_Err reconfigure_output(pid)` method called whenever an output PID should be reconfigured

These callbacks are all optional, but `process` should be set if you want your filter to perform any action.

Filters accepting input PIDs and/or producing output PIDs must configure their capabilities using `push_cap` function.

_NOTE When running the session in multi-thread mode, custom filter callbacks are always executed by the main thread (NodeJS main)._

## Custom Sink example

The following defines a custom filter doing simple inspection of the pipeline (sink filter) 
```

let cust = fs.new_filter('MyFilterJS');
cust.ipids=[];

//indicate what we accept and produce - this can be done ether in the constructor or after, but before running the session
//here we only accept video streams as input, and do not produce any output
cust.push_cap("StreamType", "Visual", gpac.GF_CAPS_INPUT);

//we accept one or more input video PID, we must configure them
cust.configure_pid = (pid, is_remove) => {
	if (is_remove) {
		console.log('PID removed !');
		return gpac.GF_OK;
	}
	//PID is already registered with our filter, this is a reconfiguration
	if (this.ipids.indexOf(pid) < 0) {
		this.ipids.push(pid);
		console.log('PID initial configure !');
	} else {
		console.log('PID reconfigure !');
	}

	//enumerate all props 
	pid.enum_props( (type, val) => {
			console.log('\t' + type + ': ' + val);
	});
	
	//we are a sink, we MUST fire a play event
	evt = new gpac.FilterEvent(gpac.GF_FEVT_PLAY);
	pid.send_event(evt);
	return gpac.GF_OK;
};

cust.process() = () => {
	this.ipids.forEach(pid => {
		pck = pid.get_packet();
		if (!pck) break;
		console.log('Got Packet DTS ' + str(pck.dts) + ' CTS ' + str(pck.cts) + ' SAP ' + str(pck.sap) + ' dur ' + str(pck.dur) + ' size ' + str(pck.size) );
		pid.drop_packet();
	}
	return gpac.GF_OK;
};

//load a source
let my_src = fs.load_src("source.mp4");

//if needed, setup links between filters (in this example, only 2 filters explicitly loaded, no need for links)

//run the session
fs.run();

```

## Custom Forwarding example

The following defines a custom filter doing packet forwarding for input AV streams in the middle of the pipeline, exercising all possible packet creation modes (new, clone, copy, forward by ref, forward data by ref).
```


let cust_f = fs.new_filter("NodeJS_Test");
//we accept any number of input PIDs
cust_f.set_max_pids(-1);
cust_f.pids = [];
cust_f.push_cap('StreamType', 'Visual', gpac.GF_CAPS_INPUT_OUTPUT);
cust_f.push_cap('StreamType', 'Audio', gpac.GF_CAPS_INPUT_OUTPUT);

cust_f.configure_pid = function(pid, is_remove)
{
	if (this.pids.indexOf(pid) < 0) {
		this.pids.push(pid);

		//create output PID
		pid.opid = this.new_pid();
		pid.opid.copy_props(pid);
	} else if (is_remove) {
		console.log('PID remove !');
	} else {
		console.log('PID reconfigure !');
		pid.opid.copy_props(pid);
	}
	return gpac.GF_OK;
}

cust_f.pck_clone_cache = null;

cust_f.process = function() {
	let nb_eos=0;

	this.pids.forEach(pid =>{
	if (pid.eos) {
		nb_eos++;
		return;
	}
	let pck = pid.get_packet();
	if (!pck) return;

	//send by reference
	if (this.fwd_mode==1) {
		let dst = pid.opid.new_pck_ref(pck);
		dst.copy_props(pck);
		dst.send();
	}
	//full copy mode
	else if (this.fwd_mode==2) {
		let dst = pid.opid.new_pck(pck.size);
		dst.copy_props(pck);
		new Uint8Array(dst.data).set(new Uint8Array(pck.data));
		dst.send();
	}
	//keep ref to packet and send new packet using shared data
	else if (this.fwd_mode==3) {
		let ab = new ArrayBuffer(pck.size);
		new Uint8Array(ab).set(new Uint8Array(pck.data));
		//keep ref
		pck.ref();
		let dst = pid.opid.new_pck_shared(ab, () => { pck.unref();});
		dst.copy_props(pck);
		dst.send();
	}
	//pck_clone
	else if (this.fwd_mode==4) {
		let dst = pid.opid.new_pck_clone(pck);
		dst.send();
	}
	//pck_copy
	else if (this.fwd_mode==5) {
		let dst = pid.opid.new_pck_copy(pck);
		dst.send();
	}
	//else (0) direct packet forward
	else {
		pid.opid.forward(pck);
	}

	this.fwd_mode++;
	if (this.fwd_mode==6) this.fwd_mode=0;

	pid.drop_packet();
	});

	if (nb_eos == this.pids.length)
	return gpac.GF_EOS;

	return gpac.GF_OK;
}

//load a source filter
let src=fs.load_src("source.mp4");

//load a destination filter
let dst=fs.load("vout");

//we need to indicate that our destination only gets its input from our custom filter !
dst.set_source(cust_f);

# and run
fs.run();
```




# Custom GPAC callbacks {: data-level="expert" }
Some callbacks from libgpac are made available in NodeJS

## Remotery interaction

GPAC is by default compiled with [Remotery](https://github.com/Celtoys/Remotery) support for remote profiling. 
You can interact with Remotery websocket server by sending messages to the remote browser, or receiving messages from it:

```
gpac.set_rmt_fun( text => {
	console.log('Remotery got message ' + text);
	gpac.rmt_send('Some response text');
});

```

You will need to enable Remotery in GPAC by setting the option `-rmt`, as this cannot be enabled or disabled at run time.

You can however enable or disable Remotery profiler using `gpac.rmt_enable(true)`.


## DASH Client

You can override the default algorithm used by the DASH client with your own algorithm. See [the documentation](https://doxygen.gpac.io/classlibgpac_1_1_filter.html#a05de5bc6b3cb9a3573e00d9f4ccfc056) for further details.

The principle is as follows:

- the script can get notification when a period start/end to reset your stats and setup live vs on demand cases
- the script can get notified of each created group (AdaptationSet in DASH, Variant Stream in HLS) with its various qualities. For HEVC tiling, each tile will be declared as a group, as well as the base tile track
- the script is notified after each segment download on which quality to pickup next
- the script can get notified while downloading a segment to decide if the download should be aborted
 
```

let dash_algo = {};
dash_algo.on_period_reset = (type) => {
	console.log('period reset type ' + type);
};
dash_algo.on_new_group = (group) => {
	console.log('Got new group ' + JSON.stringify(group) );
};

dash_algo.on_rate_adaptation = (group, base_group, force_lower_complexity, stats) =>
{
	console.log('Rate adaptation on group ' + group.idx + ' - stats ' + JSON.stringify(stats) );
	//always use lowest quality in this example
	return 0;
};

dash_algo.on_download_monitor = (group, stats) =>
{
	console.log('Download monitor on group ' + group.idx + ' - stats ' + JSON.stringify(stats) );
	return -1;

};

let fs = new gpac.FilterSession();

fs.on_filter_new = (f) => {
	if (f.name == "dashin")
		f.bind(dash_algo);
};

//load a source, here to TelecomParis DASH test sequences
let f1 = fs.load_src("https://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-1s/mp4-live-1s-mpd-AV-BS.mpd");

//load a sink, here video out
let f2 = fs.load("vout");

//run the session in blocking mode
fs.run();


```


## HTTP Server

You can override the default behaviour of the httpout filter. See [the documentation](https://doxygen.gpac.io/group__nodehttp__grp.html) for further details.

The principle is as follows:

- the script can get notification of each new request being received
- the script can decide to let GPAC handle the request as usual (typically used for injecting http headers, throttling and monitoring)
- the script can feed the data to GPAC (GET) or receive the data from GPAC (PUT/POST)

 
```

let http_req = {
	on_request = (request) => {
		console.log('got request ' + JSON.stringify(request) );
		request.reply=0;
		//throttle the connection, always delaying by 100 us
		request.throttle = function(done, total) {
			return 100;
		}
		//check end of request
		request.close = function(error) {
			print('closed with code ' + error_string(error));
		}
		request.send();
	};
};

let fs = new gpac.FilterSession();

fs.on_filter_new = (f) => {
	if (f.name == "httpout")
		f.bind(http_req);
};

//load the server
let f2 = fs.load("httpout:port=8080:rdirs=.");

//run the session in blocking mode
fs.run();

```

The following script always serves the same file content using nodejs instead of GPAC for GET, and monitor bytes received for PUT/POST:

```
let http_req = {
	on_request = (request) => {
		console.log('got request ' + JSON.stringify(request) );
		request.reply=200;
		this.file = filesys.openSync("source.mp4", "r");
		request.read = function(ab) {
			let nb_bytes = 0;
			try {
				nb_bytes = filesys.readSync(this.file, ab, 0, ab.length);
			} catch (e) {
				console.log('read error: ' + e);
				return 0;
			}
			return nb_bytes;
		}
		request.write = function(ab) {
			console.log("got " + ab.length + " bytes");
		}
		//check end of request
		request.close = function(error) {
			print('closed with code ' + error_string(error));
		}
		//send reply - this can also be done later on, e.g. in a user tasjk
		request.send();
	};
};
```


## FileIO Wrapping

GPAC allows usage of wrappers for file operations (open, close, read, write, seek...), and such wrappers can be constructed from NodeJS.

A FileIO wrapper is constructed using:

- the URL you want to wrap
- a 'factory' object providing the callbacks for GPAC.
- an optional boolean indicating if direct memory should be used (default), or if array buffers are copied between GPAC and NodeJS.
 
Let's define a factory that simply calls NodeJS file system calls:

```
const filesys = require('fs');

let fio_factory = {
	open: function(url, mode) {

		this.file = null;
		this.size = 0;
		this.position = 0;
		this.read_mode = false;
		this.is_eof = false;
		this.url = url;
		//NodeJS does not accept 't' or 'b' indicators, always assumes binary
		mode = mode.replace('b', '');
		mode = mode.replace('t', '');

		try {
			this.file = filesys.openSync(url, mode);
		} catch (e) {
			console.log('Fail to open ' + url + ' in mode ' + mode + ': ' + e);
			return false;
		}
		//file is read or append, get the file size
		if (mode.indexOf('w')<0) {
			let stats = filesys.fstatSync(this.file);
			this.size = stats.size;
			if (mode.indexOf('a+')>=0) {
				this.position = this.size;
			}
			this.read_mode = true;
		}
		return true;
	},
	close: function() {
		filesys.closeSync(this.file);
	},
	read: function(buf) {
		let nb_bytes = 0;
		try {
			nb_bytes = filesys.readSync(this.file, buf, 0, buf.length, this.position);
		} catch (e) {
			console.log('read error: ' + e);
			return 0;
		}
		if (!nb_bytes) this.is_eof = true;
		this.position += nb_bytes;
		return nb_bytes;
	},
	write: function(buf) {
		let nb_bytes = filesys.writeSync(this.file, buf, 0, buf.length, this.position);
		if (this.position == this.size) {
			this.size += nb_bytes;
		}
		this.position += nb_bytes;
		return nb_bytes;
	},
	seek: function(pos, whence) {
		this.is_eof = false;
		if (pos<0) return -1;
		//seek set
		if (whence==0) {
			this.position = pos;
		}
		//seek cur
		else if (whence==1) {
			this.position += pos;
		}
		//seek end
		else if (whence==2) {
			if (this.size < pos) return -1;
			this.position = this.size - pos;
		} else {
			return -1;
		}
		return 0;
	},
	tell: function() {
		return this.position;
	},
	eof: function() {
		return this.is_eof;
	},
	exists: function(url) {
		try {
			filesys.accessSync(url);
		} catch (err) {
			return false;
		}
		return true;
	}
};
```

You can then wrap an input url using:

```
src_wrap = new gpac.FileIO("mysource.hvc", fio_factory);
dst_wrap = new gpac.FileIO("mydest.mp4", fio_factory);
f1 = fs.load_src(src_wrap.url);
f2 = fs.load_dst(dst_wrap.url+':option');

```

The wrapping can be useful when you don't want to do any IO with the produced content, or if your source content is not a file.

When opening a file, a new empty object is created and the 'open' callback is called with this new object as `this`.

This allows handling, with a single wrapper, cases where a URL resolves in multiple URLs when processing, for example DASH or HLS with manifest file(s) and media segments.

Note that all FileIO methods must be synchronous.

_NOTE When running the session in multi-thread mode, file IO callbacks are always executed by the main thread (NodeJS main)._



# Multithread support {: data-level="expert" }

Multithreaded filter sessions can be used with NodeJS, however the binding currently only supports executing callbacks into NodeJS from the main thread (main NodeJS or worker). 

A multithreaded session is created by specifying the `-threads=N` option to libgpac:

```
gpac.set_args(['libgpac', '-threads=2']);

```
 
This implies a few limitations detailed below.

## Remotery handling

Remotery executes in its own thread, therefore remotery messages are always queued and flushed while running a session.

If no filter session is active, remotery messages will not be dispatched.

If you want to flush these messages independently from your media sessions, the simplest way is to create a non-blocking session with a user task running until the end of your program.

```
gpac.set_args(['libgpac', '-rmt']);

gpac.set_rmt_fun( (msg) => {
	console.log('RMT got message ' + msg);
	gpac.rmt_send('ACK for ' + msg);
}); 

let fs_rmt = new gpac.FilterSession(gpac.GF_FS_FLAG_NON_BLOCKING);
//create a simple task running forever every 100 ms - you can return false once you are done
let rmt_task = {
	execute: function() { return 100; }
};
fs_rmt.post_task(rmt_task);
//run as promise
```


## Custom filters

In multi-threaded mode, custom filters are always scheduled on the main thread. 

If your custom filter is sending packets requiring callbacks into NodeJS, typically shared data with JS packet finalizer, these packets will force all consuming filters to be scheduled on the main thread.

You should therefore avoid using shared JS data in your custom filter whenever possible to ensure more efficient thread usage.


## Custom bindings

In multi-threaded mode, custom filter bindings (`dashin` filter for now) must be called on the main thread. 

This implies that the filter bound will be forced to run on the main thread. Packets dispatched by a JS-bound filter may still be processed by other threads, unless they are JS shared data packets.
