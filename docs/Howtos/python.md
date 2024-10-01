# Overview {:data-level="all"}

We discuss here how to use [GPAC Filters](Filters) in Python. 

The GPAC Python API provides Python bindings to GPAC filter session. The design is closely inspired from the [JS FilterSession](jssession) API used in GPAC.
The GPAC Python API is [documented here](https://doxygen.gpac.io/group__pyapi__grp.html).

You can also have a look at the  [python scripts](https://github.com/gpac/testsuite/tree/filters/media/python) in the GPAC test suite.


__Warning__

GPAC Python bindings are only available starting from GPAC 2.0.

# Before you begin {:data-level="all"}
   
The GPAC Python bindings use [ctypes](https://docs.python.org/3/library/ctypes.html) for interfacing with libgpac filter session, while providing an object-oriented wrapper hiding all ctypes internals and GPAC C design.

You __must__:

- use the bindings which come along with your GPAC installation, otherwise ABI/API might mismatch, resulting in crashes.
- use a regular GPAC build, not a static library version (so python bindings are not compatible with mp4box-only build).
- make sure the libgpac shared library is known to your dynamic library loader.


The binding is called libgpac.py, and is by default available in GPAC share folder, for example `/usr/share/gpac/python`. It is hosted in GPAC [source tree](https://github.com/gpac/gpac/blob/master/share/python/libgpac.py).

The Python module handler is furthermore very likely not configured to look at this directory, and you will have to indicate where to look:

```
import sys
sys.path.append('/usr/share/gpac/python')
import libgpac
```

The GPAC python bindings will try to import [numpy](https://numpy.org/) by default to allow easy packet data access, but can run without it. Check everything is in place by printing GPAC version :


```
import sys
sys.path.append('/usr/share/gpac/python')
import libgpac as gpac

print("Welcome to GPAC Python !\nVersion: " + gpac.version)
```

Running this should print your current GPAC version.

You can also install libgpac bindings using PIP, see [this post](https://github.com/gpac/gpac/issues/2161#issuecomment-1087281505).

 
# Tuning up GPAC 

The first thing to do is to initialize libgpac. This is done by default while importing the bindings with the following settings:

- no memory tracking
- default GPAC profile used

If you want to change these, you need to re-init libgpac right after import:

```
gpac.init(1, "customprofile")
```


Before starting any filter session, you may also need to pass some global configuration options to GPAC:
```
#first argument is ignored by libgpac
opts = ["myapp"];
#for example, blacklist some filters
opts.append("-blacklist=filters_you_do_not_want")
opts.append("-no-block"")
gpac.set_args(opts)
```

You can also pass the command line arguments so that you can specify GPAC core and global filter options at prompt:
```
gpac.set_args(sys.argv)
```

You may want to adjust the log tools and levels of GPAC:
```
gpac.set_logs("dash@info")
```


# Setting up filter sessions
## Simple sessions

To create a filter session, the simplest way is to use all defaults value, creating a single-threaded blocking session:

```
fs = gpac.FilterSession()
```

You can then add your filters as usual. 

Playback example:

```
f1 = fs.load_src("file.mp4")
f2 = fs.load("vout")
fs.run()
```

Remux example:

```
f1 = fs.load_src("file.mp4")
f2 = fs.load_dst("test.ts")
fs.run()
```

Once you are done, you must explicitly destroy the filter session and uninit libgpac to cleanup all resources. 

```
fs.delete()
gpac.close()
```

## Non-blocking sessions 

A non-blocking session will need to be called on regular basis to process pending filter tasks. It is useful if you need to do other tasks while the session is running and do not want to use callbacks from GPAC for that.

```
fs = gpac.FilterSession(gpac.GF_FS_FLAG_NON_BLOCKING)
f1 = fs.load_src("file.mp4")
f2 = fs.load("vout")
while True:
	#do things

	#call session
	fs.run()

	#if last task, GPAC session is done
	if fs.last_task:
		break
```


## Callbacks in blocking sessions

Alternatively, you may run the session in blocking mode, and ask for being called back once or on regular basis. This is achieved by posting tasks to the GPAC session scheduler. A task object shall provide an `execute` method to be called. The default `execute` method does nothing. You can either derive an object from the `FilterTask` class, or override the `execute` function of the created task:

```

#custom task callback 
#- returns -1: indicates the task is done, it will no longer get called and will be destroyed
#- returns >=0 (None handled as 0): indicates the task is still active and should be
#called again in the returned number of milliseconds
#
def my_exec(self):
	if (self.session.last_task):
		print("No more tasks, we are done")
		return -1
	print("In callback, nb filters: " + str(self.session.nb_filters))
	return 500

#create the custom task
task = gpac.FilterTask('testtask')
task.execute = types.MethodType(my_exec, task)
task.count=0
fs.post(task)

#run as usual
```
  
Tasks can be created at any time, either at the beginning or in a callback function (e.g., another task).

Tasks can be created in non-blocking sessions; in this case their execution timing will depend on the frequency at which your application calls `fs.run()`.

## Linking filters

In order to link filters when desired, you must explicitly do this using `set_source` of the destination filter. For example, when inserting a [reframer](reframer) in a chain:

```
f_src = fs.load_src('source.mp4')
f_dst = fs.load_dst('remux.mp4')
f_reframe = fs.load('reframer')
f_dst.set_source(reframer)
```

You can specify the usual link filtering as an optional argument to `set_source`:
```
f_dst.set_source(reframer, "#PID=1")
```

This will instruct that the destination only accepts PIDs coming from the reframer filter, and with ID 1.


## Inspecting filters

You can query the number of input and output PIDs of a filter, the source filter of an input PID, the destination filters of an output PID, their possible options, update options, send events, ...

Please check the  [API documentation](https://doxygen.gpac.io/classlibgpac_1_1_filter.html) and refer to the [python scripts](https://github.com/gpac/testsuite/tree/filters/media/python) in the GPAC test suite.

Note that some properties (as in GPAC JS) are not exposed as their native types but as string (see [here](https://doxygen.gpac.io/group__pyapi__grp.html#details)). This is the case for these important types:

- StreamType: string containing the streamtype name
- CodecID: string containing the codec name
- PixelFormat: string containing the pixel format name
- AudioFormat: string containing the audio format name


# Custom Filters

You can define your own filter(s) to interact with the media pipeline. As usual in GPAC filters, a custom filter can be a source, a sink or any other filter. It can consume packets from input PIDs and produce packets on output PIDs. It is recommended to have numpy support for manipulating your data.

Your filter must derive from the FilterCustom class, and must provide a `process` method.

## Custom Sink example

The following defines a custom filter doing simple inspection of the pipeline (sink filter) 
```
#define a custom filter
class MyFilter(gpac.FilterCustom):
	def __init__(self, session):
		gpac.FilterCustom.__init__(self, session, "PYnspect")
		#indicate what we accept and produce - this can be done either in the constructor or after, but before running the session
		#here we only accept video streams as input, and do not produce any output
		self.push_cap("StreamType", "Visual", gpac.GF_CAPS_INPUT)

	#callbacks must be defined before instantiating an object from this class

	#we accept one or more input video PID, we must configure them
	def configure_pid(self, pid, is_remove):
		if is_remove:
			return 0
		#PID is already registered with our filter, this is a reconfiguration
		if pid in self.ipids:
			print('PID reconfigured')
		#otherwise this is our first configure
		else:
			print('PID configured - props:')
			
			#enumerate all props using ourselves as the callback, getting called back in `on_prop_enum` below
			pid.enum_props(self)
			#we are a sink, we MUST fire a play event
			evt = gpac.FilterEvent(gpac.GF_FEVT_PLAY)
			pid.send_event(evt)
		return 0

	#process
	def process(self):
		for pid in self.ipids:
			pck = pid.get_packet()
			if pck==None:
				break


			print('Got Packet DTS ' + str(pck.dts) + ' CTS ' + str(pck.cts) + ' SAP ' + str(pck.sap) + ' dur ' + str(pck.dur) + ' size ' + str(pck.size))

			pid.drop_packet()
		return 0

	def on_prop_enum(self, pname, pval):
		print('Property ' + pname + ' value: ' + str(pval))

#load a source
my_src = fs.load_src("source.mp4")

#load a custom filter
my_filter = MyFilter(fs)

#if needed, setup links between filters (in this example, only 2 filters explicitly loaded, no need for links)

#run the session
fs.run()


```

## Custom Forwarding example

The following defines a custom filter doing packet forwarding in the middle of the pipeline, exercising all possible packet creation modes (new, clone, copy, forward by ref, forward data by ref).
```
#define a custom filter
class MyFilter(gpac.FilterCustom):
	def __init__(self, session):
		gpac.FilterCustom.__init__(self, session, "PYnspect")
		#indicate what we accept and produce - here, video in and out
		self.push_cap("StreamType", "Visual", gpac.GF_CAPS_INPUT_OUTPUT)
		self.nb_pck=0

	#configure input PIDs
	def configure_pid(self, pid, is_remove):
		if is_remove:
			return 0
		if pid in self.ipids:
			print('PID reconfigured')
		else:
			print('New PID !')
			#create associated output PID
			opid = self.new_pid()
			#copy properties - this should always be done unless you have a good reason not to
			opid.copy_props(pid)
			#and set a bitrate property
			opid.set_prop('Bitrate', 500000)
			pid.opid = opid
			opid.pck_ref = None
		return 0

	#process
	def process(self):
		for pid in self.ipids:
			#we still have our last send packet not fully processed by the pipeline, wait for its destruction - see case 4 below
			if pid.opid.pck_ref:
				continue

			pck = pid.get_packet()
			if pck==None:
				if pid.eos:
					pid.opid.eos = True
				break

			size = pck.size
			print('Got Packet DTS ' + str(pck.dts) + ' CTS ' + str(pck.cts) + ' SAP ' + str(pck.sap) + ' dur ' + str(pck.dur) + ' size ' + str(size))
			if pck.frame_ifce:
				print("packet data is in GPU/filter shared memory")
			else:
				data = pck.data
				#if numpy support, you can access the packet data as NPArray 
				if gpac.numpy_support:
					print("packet buffer class " + data.__class__.__name__ + " size " + str(len(data) ) )
				else:
					print("packet buffer class " + data.__class__.__name__ )

			#test forward
			self.nb_pck += 1

		if self.nb_pck==1:
				pid.opid.forward(pck)
			#test new ref
			elif self.nb_pck==2:
				opck = pid.opid.new_pck_ref(pck)
				opck.copy_props(pck)
				opck.send()
			#test new alloc
			elif self.nb_pck==3:
				opck = pid.opid.new_pck(size)
				opck.copy_props(pck)
				odata = opck.data
				#copy array
				if gpac.numpy_support:
					numpy.copyto(odata, data)
				opck.send()
			#test new packet using shared data (data owned by the filter) 
			#in this case our shared data is the data from the source packet, 
			#so we need to track when our new packet is consumed before
			#releasing the source packet, and keep a reference to the source
			#for as long as our new packet is alive
			#In this mode, the associated filter MUST have a `packet_release` callback function
			elif self.nb_pck==4:
				opck = pid.opid.new_pck_shared(data)
				opck.copy_props(pck)
				#keep a reference to our source, so that drop_packet() below does not destroy it
				pid.opid.pck_ref = pck
				pid.opid.pck_ref.ref()
				opck.send()
			#test packet copy
			elif self.nb_pck==5:
				opck = pid.opid.new_pck_copy(pck)
				opck.copy_props(pck)
				opck.send()
			#test packet clone
			elif self.nb_pck==6:
				opck = pid.opid.new_pck_clone(pck)
				opck.copy_props(pck)
				opck.send()
				self.nb_pck = 0

			#we can drop the input packet
			pid.drop_packet()
		return 0

	#a shared packet is destroyed, unreference the source packet we used for it
	def packet_release(self, opid, pck):
		if opid.pck_ref:
			opid.pck_ref.unref()
			opid.pck_ref = None

#load a source filter
src=fs.load_src("source.mp4")

#load a custom filter
my_filter = MyFilter(fs)

#load a destination filter
dst=fs.load("vout")

#we need to indicate that our destination only gets its input from our custom filter !
dst.set_source(my_filter)

# and run
fs.run()
```

## Custom Raw Video access example

The following defines a custom filter doing raw video write access (e.g. pixel modification) and forwarding the result in the middle of the pipeline.
We cover two methods here:

- inplace processing, where the input data is modified and sent
- read access, where the output data can be anything (in this example, its is a copy of the input with a line drawn on the luma plane)

We assume numpy is available.

```

#define a custom filter
class MyFilter(gpac.FilterCustom):
    def __init__(self, session):
        gpac.FilterCustom.__init__(self, session, "PYRawVid")
        #indicate what we accept and produce - here, raw video in and out
        self.push_cap("StreamType", "Visual", gpac.GF_CAPS_INPUT_OUTPUT)
        self.push_cap("CodecID", "raw", gpac.GF_CAPS_INPUT_OUTPUT)
        self.nb_pck=0
        #change this to test no inplace access
        self.inplace=True

    #configure input PIDs
    def configure_pid(self, pid, is_remove):
        if is_remove:
            return 0
        if pid in self.ipids:
            print('PID reconfigured')
        else:
            print('New PID !')
            #create associated output PID
            opid = self.new_pid()
            pid.opid = opid

        #copy properties - this should always be done unless you have a good reason not to
        #this example assumes we keep the same pixel format
        pid.opid.copy_props(pid)

        #get width, height, stride and pixel format - get_prop may return None if property is not yet known
        #but this should not happen for these properties with raw video, except StrideUV which is None for non (semi) planar YUV formats
        self.width = pid.get_prop('Width');
        self.height = pid.get_prop('Height');
        self.pixfmt = pid.get_prop('PixelFormat');
        self.stride = pid.get_prop('Stride');
        self.stride_uv = pid.get_prop('StrideUV');
        return 0

    #process
    def process(self):
        for pid in self.ipids:
            pck = pid.get_packet()
            if pck==None:
                if pid.eos:
                    pid.opid.eos = True
                break

            tmp_pck = None
            data = None
            size = 0
            #inplace processing, we use clone regardless of whether the packet is a frame interface or not
            if self.inplace:
                #clone will handle duplication of memory if needed, cf gf_filter_pck_new_clone
                opck = pid.opid.new_pck_clone(pck)
                if opck == None:
                    raise Exception("Packet clone failed")
                opck.copy_props(pck)
                odata = opck.data
            else:
                #no inplace processing (typically the output data size differs from input, i.e. resize/plane splitter/...)
                #we need to get read-only access to the frame data
                #if packet is a frame interface (GPU texture, codec internal mem), direct access to the data from python is not possible (see next example for GPU texture access)
                #we therefore clone the packet which will read back the private data into a read/write memory, and access the new packet data as NPArray
                #we will then discard this temp packet
                #another method for cloning is shown in the video sink example below
                if pck.frame_ifce:
                    tmp_pck = pid.opid.new_pck_clone(pck)
                    if tmp_pck == None:
                        raise Exception("Packet clone failed")
                    data = tmp_pck.data
                    size = tmp_pck.size
                else:
                    #data is read-only !
                    data = pck.data
                    size = pck.size

                #create new packet - in this example we use the same output characteristics as input and copy over the data
                opck = pid.opid.new_pck(size)
                if opck == None:
                    raise Exception("Packet alloc failed")
                opck.copy_props(pck)
                odata = opck.data
                #copy array
                numpy.copyto(odata, data)


            #modify data as needed; here, we draw a line at 50% luma intensity in the middle of the luma plane of the frame
            offset = int(self.height/2 * self.stride);
            for x in range(1, self.width):
                odata[x-1 + offset] = 125;

            opck.send()

            if tmp_pck:
                tmp_pck.discard()

            #we can drop the input packet
            pid.drop_packet()
        return 0


#load a source filter
src=fs.load_src("source.mp4")

#load a custom filter
my_filter = MyFilter(fs)

#load a destination filter
dst=fs.load("vout")

#we need to indicate that our destination only gets its input from our custom filter !
dst.set_source(my_filter)

# and run
fs.run()
```

## GPU Decoders and OpenGL

You can get access to the GPU textures (when present) of a packet for later reuse in OpenGL+Python.
When fetching a packet, usage of GPU textures is signaled by the `frame_ifce_gl` property of the packet.

First you must delegate all GL context management to your python app (must be done before loading any filter), otherwise some filter may create an alternate context:
```
    fs = gpac.FilterSession(gpac.GF_FS_FLAG_NON_BLOCKING, "")
    fs.external_opengl_provider()
```

If you run the session in multithreaded mode, you may need to override the filter session `on_gl_activate` to properly activate the GL context for the calling thread.

A typical packet processing will then be:

- if GPU texture
	- use `get_gl_texture` for each video plane, typically 3 for YUV, 2 for Y+packed YV (nv12), 1 for RGB/RGBA
	- set active texture units and uniforms using the textureID returned
- otherwise
	- if packet is a frame interface, clone packet to fetch data otherwise use source packet data
	- push data to GPU according to the format

The following illustrates how to get texture IDs
```
pck = pid.get_packet()
if pck.frame_ifce_gl:
	tx = pck.get_gl_texture(0)
	texture1 = tx.id
	#only needed at first frame fetch if same texture ID - there is no guarantee that the source (decoder) will always use the same texture IDs
	glBindTexture(GL_TEXTURE_2D, texture1)
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST)
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST)

	#YUV or NV12
	if nb_textures>1:
		tx = pck.get_gl_texture(1)
		texture2 = tx.id
		glBindTexture(GL_TEXTURE_2D, texture2)
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST)
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST)

		#YUV 
		if nb_textures>2:
			tx = pck.get_gl_texture(2)
			texture3 = tx.id
			if reset:
				glBindTexture(GL_TEXTURE_2D, texture3)
				glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST)
				glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST)
else:
	data=pck.data
	if pck.frame_ifce:
		#cf discussion in previous example
		clone=pck.clone()
		data = clone.data
	#push data or parts of data to appropriate textures using glTexImage2D & co
	
```

And let your OpenGL skills do the rest !

A simple example illustrating this is available [here](examples/python/pygl_gpac.py), using input file "video.mp4" and PyGame + OpenGL.


# Custom GPAC callbacks
Some callbacks from libgpac are made available in Python

## Remotery interaction

GPAC is by default compiled with [Remotery](https://github.com/Celtoys/Remotery) support for remote profiling. 
You can interact with Remotery websocket server by sending messages to the remote browser, or receiving messages from it:

```
class MyRemotery:
	def on_rmt_event(self, text):
		print('Remotery got message ' + text)
		gpac.rmt_send('Some response text')

my_rmt = MyRemotery()
gpac.set_rmt_fun(my_rmt)

```

You will need to enable Remotery in GPAC by setting the option `-rmt`, as this cannot be enabled or disabled at run time.

You can however enable or disable Remotery profiler using `gpac.rmt_enable(True/False)`.


## DASH Client

You can override the default algorithm used by the DASH client with your own algorithm. See [the documentation](https://doxygen.gpac.io/group__pydash__grp.html) for further details.

The principle is as follows:

- the script can get notification of period start/end to reset statistics, setup live vs on demand cases, etc.
- the script can get notification of each created group (AdaptationSet in DASH, Variant Stream in HLS) with its various qualities. For HEVC tiling, each tile will be declared as a group, as well as the base tile track
- the script is notified after each segment download on which quality to pickup next
- the script can be notified while downloading a segment to decide if the download should be aborted
 
```
class MyCustomDASHAlgo:
	#get notifications when a DASH period starts or ends 
	def on_period_reset(self, type):
		print('period reset type ' + str(type))

	#get notification when a new group (i.e., set of adaptable qualities, `AdaptationSet` in DASH) is created. Some groups may be left unexposed by the DASH client 
	#the qualities are sorted from min bandwidth/quality to max bandwidth/quality
	def on_new_group(self, group):
		print('new group ' + str(group.idx) + ' qualities ' + str(len(group.qualities)) + ' codec ' + group.qualities[0].codec);

	#perform adaptation logic - return value is the new quality index, or -1 to keep as current, -2 to discard  (debug, segments won't be fetched/decoded)
	def on_rate_adaptation(self, group, base_group, force_low_complexity, stats):
		print('We are adapting on group ' + str(group.idx) )
		print('' + str(stats))
		# perform adaptation, check group.SRD to perform spatial adaptation, ...
		# 
		#in this example we simply cycle through qualities
		newq = stats.active_quality_idx + 1
		if newq >= len(group.qualities):
			newq = 0
		return newq

	# this callback is optional, use it only if your algo may abort a running transfer (this can be very costly as it will require closing and reopening the HTTP connection for HTTP 1.1  )
	#	-1 to continue download
	#	or -2 to abort download but without retrying to download a segment at lower quality for the same media time
	#	or the index of the new quality to download for the same media time
	def on_download_monitor(self, group, stats):
		print('download monitor group ' + str(group.idx) + ' stats ' + str(stats) );
		return -1


#create an instance of the algo
mydash = MyCustomDASHAlgo()

#define a custom filter session monitoring the creation of new filters
class MyFilterSession(gpac.FilterSession):
	def __init__(self, flags=0, blacklist=None, nb_threads=0, sched_type=0):
		gpac.FilterSession.__init__(self, flags, blacklist, nb_threads, sched_type)

	def on_filter_new(self, f):
		print("new filter " + f.name);
		#bind the dashin filter to our algorithm object
		if f.name == "dashin":
			f.bind(mydash);

	def on_filter_del(self, f):
		print("del filter " + f.name);

#create a session
fs = MyFilterSession()

#create a source, here to TelecomParis DASH test sequences
f1 = fs.load_src("https://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-1s/mp4-live-1s-mpd-AV-BS.mpd")
if not f1:
    raise Exception('Failed to load source')

#load a sink, here video out
f2 = fs.load("vout")
if not f2:
    raise Exception('Failed to load sink')

#run the session in blocking mode
fs.run()

```

## FileIO Wrapping

GPAC allows using wrappers for file operations (open, close, read, write, seek...), and such wrappers can be constructed from Python.

A FileIO wrapper is constructed using:

- the URL you want to wrap
- a 'factory' object providing the callbacks for GPAC.

Let's define a factory that simply wraps python file system calls:

```
class MyFileIO:
	def __init__(self):
		self.file = None
		self.is_eof=False

	def open(self, url, mode):
		if mode.find('r')>=0 and not os.path.isfile(url):
			return False
		self.file = open(url, mode)
		self.url = url
		return True

	def close(self):
		self.file.close()
		self.file=None

	def write(self, np_arr, _size):
		self.file.write(np_arr)
		return np.size(np_arr)

	def read(self, np_array, _size):
		tmp = np.fromfile(self.file, dtype=np.ubyte, count=np.size(np_array))
		size = np.size(tmp)
		np_array[:size] = tmp
		if size==0:
			self.is_eof=True
		return size

	def seek(self, pos, whence):
		self.file.seek(pos, whence)
		self.is_eof=False
		return 0

	def tell(self):
		return self.file.tell()

	def eof(self):
		return self.is_eof

	def exists(self, url):
		if not os.path.isfile(url):
			return False
		return True
```

You can then wrap input or output URLs using:

```
fio_factory = MyFileIO()
src_wrap = gpac.FileIO("mysource.hvc", fio_factory)
dst_wrap = gpac.FileIO("mydest.mp4", fio_factory)
f1 = fs.load_src(src_wrap.url)
f2 = fs.load_dst(dst_wrap.url+':option')

```

File IO wrapping can be useful when you want to distribute produced content through other means that GPAC built-in sinks, or if your source content is not a file.

When opening a file, the factory object is cloned and the 'open' callback is called on the clone. 
This allows handling, with a single wrapper, cases where a URL resolves in multiple URLs when processing, for example DASH or HLS with manifest file(s) and media segments.


## HTTP Server

You can override the default behaviour of the httpout filter. See [the documentation](https://doxygen.gpac.io/group__pyhttpout__grp.html) for further details.

The principle is as follows:

- the script can get notification of each new request being received
- the script can decide to let GPAC handle the request as usual (typically used for injecting http headers, throttling and monitoring)
- the script can feed the data to GPAC (GET) or receive the data from GPAC (PUT/POST)


```
class MyHTTPOutRequest(gpac.HTTPOutRequest):
	def on_request(self, method, url, auth_code, headers):
		print('got request type ' + str(method) + ' URL ' + str(url) + ' headers ' + str(headers))
		self.headers_out.append("x-GPAC");
		self.headers_out.append("toto");
		//let GPAC handle the request processing
		self.reply=0
		self.send();

	def throttle(self, done, total):
		return 1

	def close(self, err):
		print("session closed: " + gpac.e2s(err))

#create request handler
myhandler = MyHTTPOutRequest()


#define a custom filter session monitoring the creation of new filters
class MyFilterSession(gpac.FilterSession):
	def __init__(self, flags=0, blacklist=None, nb_threads=0, sched_type=0):
		gpac.FilterSession.__init__(self, flags, blacklist, nb_threads, sched_type)

	def on_filter_new(self, f):
		#bind the httpout filter to our request handler object
		if f.name == "httpout":
			f.bind(myhandler);

#create a session
fs = MyFilterSession()

#load the server
f2 = fs.load("httpout:port=8080:rdirs=.")
if not f2:
    raise Exception('Failed to load htppout')

#run the session in blocking mode
fs.run()

```

The following script always serves the same file content using python instead of GPAC for GET, and monitor bytes received for PUT/POST:

```
class MyHTTPOutRequest(gpac.HTTPOutRequest):
	def on_request(self, method, url, auth_code, headers):
		print('got request type ' + str(method) + ' URL ' + str(url) + ' headers ' + str(headers))

		self.headers_out.append("x-GPAC");
		self.headers_out.append("toto");
		self.file = open("source.mp4", "r")

		#we will handle the request in python
		self.reply=200
		#send the request - this can also be done later on, e.g. in a callback task
		self.send();

	def throttle(self, done, total):
		return 1

	def close(self, err):
		print("session closed: " + gpac.e2s(err))
		self.file.close()

	def read(self, np_array, _size):
		tmp = np.fromfile(self.file, dtype=np.ubyte, count=np.size(np_array))
		size = np.size(tmp)
		np_array[:size] = tmp
		return size

	def write(self, np_array, _size):
		count=np.size(np_array)
		print('Got bytes: ' + str(count))
		return 0

```



# Advanced example

The following is an example showing:

- DASH custom logic
- Custom sink filter with buffering control
- Raw video access for both GPU-based or system-based decoders
- Using OpenCV to display the frames


```
import time
import sys
import cv2

import libgpac as gpac

#initialize gpac
gpac.init()
#indicate we want to start with min bw by using global parameters
gpac.set_args(["Ignored", "--start_with=min_bw"])

#Our custom DASH adaptation logic
class MyCustomDASHAlgo:
    # get notifications when a DASH period starts or ends
    def on_period_reset(self, type):
        print('period reset type ' + str(type))

    # get notification when a new group (i.e., set of adaptable qualities, `AdaptationSet`in DASH) is created. Some groups may be left unexposed by the DASH client
    # the qualities are sorted for min bandwidth/quality to max bandwidth/quality
    def on_new_group(self, group):
        print('new group ' + str(group.idx) + ' qualities ' + str(len(group.qualities)) + ' codec ' + group.qualities[
            0].codec)

    # perform adaptation logic - return value is the new quality index, or -1 to keep as current, -2 to discard  (debug, segments won't be fetched/decoded)
    def on_rate_adaptation(self, group, base_group, force_low_complexity, stats):
        print('We are adapting on group ' + str(group.idx) + ' quality ' + str(stats.active_quality_idx))
        print('' + str(stats))

        #loop through qualities
        res = 1 + stats.active_quality_idx;
        if (res == len(group.qualities)):
            res = 0
        return res

# create an instance of the algo (in this example a single dash client is used)
mydash = MyCustomDASHAlgo()


# define a custom filter session monitoring the creation of new filters
class MyFilterSession(gpac.FilterSession):
    def __init__(self, flags=0, blacklist=None, nb_threads=0, sched_type=0):
        gpac.FilterSession.__init__(self, flags, blacklist, nb_threads, sched_type)

    def on_filter_new(self, f):
        # bind the dashin filter to our algorithm object
        if f.name == "dashin":
            f.bind(mydash)


# define a custom filter
class MyFilter(gpac.FilterCustom):
    def __init__(self, session):
        gpac.FilterCustom.__init__(self, session, "PYRawVid")
        # indicate what we accept and produce - here, raw video input only (this is a sink)
        self.push_cap("StreamType", "Visual", gpac.GF_CAPS_INPUT)
        self.push_cap("CodecID", "Raw", gpac.GF_CAPS_INPUT)

        self.max_buffer = 10000000
        self.play_buffer = 3000000
        self.re_buffer = 100000
        self.buffering = True
        #cached packed for grabbing video for GPU decoders
        self.tmp_pck = None

    # configure input PIDs
    def configure_pid(self, pid, is_remove):
        if is_remove:
            return 0
        if pid in self.ipids:
            print('PID reconfigured')
        else:
            print('PID configured')

            #1- setup buffer levels - the max_playout_us and min_playout_us are only informative for the filter session
            #but are forwarded to the DASH algo
            evt = gpac.FilterEvent(gpac.GF_FEVT_BUFFER_REQ)
            evt.buffer_req.max_buffer_us = self.max_buffer
            evt.buffer_req.max_playout_us = self.play_buffer
            evt.buffer_req.min_playout_us = self.re_buffer
            pid.send_event(evt)

            #2-  we are a sink, we MUST send a play event
            evt = gpac.FilterEvent(gpac.GF_FEVT_PLAY)
            pid.send_event(evt)

        # get width, height, stride and pixel format - get_prop may return None if property is not yet known
        # but this should not happen for these properties with raw video, except StrideUV which is NULL for non (semi) planar YUV formats
        self.width = pid.get_prop('Width')
        self.height = pid.get_prop('Height')
        self.pixfmt = pid.get_prop('PixelFormat')
        self.stride = pid.get_prop('Stride')
        self.stride_uv = pid.get_prop('StrideUV')
        self.timescale = pid.get_prop('Timescale')
        return 0

    # process
    def process(self):
		#only one PID in this example
        for pid in self.ipids:

            title = 'GPAC cv2'
            if pid.eos:
                pass
            #not done, check buffer levels
            else:
                buffer = pid.buffer
                if self.buffering:
                    #playout buffer not yet filled
                    if buffer < self.play_buffer:
                        pc = 100 * buffer / self.play_buffer
                        title += " - buffering " + str(int(pc)) + ' %'
                        break

                    #playout buffer refilled
                    title += " - resuming"
                    self.buffering = False

                if self.re_buffer:
                    #playout buffer underflow 
                    if buffer < self.re_buffer:
                        title += " - low buffer, pausing"
                        self.buffering = True
                        break

                #show max buffer level 
                if self.max_buffer > self.play_buffer:
                        pc = buffer / self.max_buffer * 100
                        title += " - buffer " + str(int(buffer/1000000)) + 's ' + str(int(pc)) + ' %'

            pck = pid.get_packet()
            if pck is None:
                break

            #frame interface, data is in GPU memory or internal to decoder, try to grab it
            #we do so by creating a clone of the packet, reusing the same clone at each call to reduce memory allocations
            if pck.frame_ifce:
                self.tmp_pck = pck.clone(self.tmp_pck)
                if self.tmp_pck == None:
                    raise Exception("Packet clone failed")
                data = self.tmp_pck.data
            else:
                data = pck.data

            #convert to cv2 image for some well known formats
            #note that for YUV formats here, we assume stride luma is width and stride chroma is width/2
            if self.pixfmt == 'nv12':
                yuv = data.reshape((self.height * 3 // 2, self.width))
                rgb = cv2.cvtColor(yuv, cv2.COLOR_YUV2RGB_NV12)
            elif self.pixfmt == 'yuv':
                yuv = data.reshape((self.height * 3 // 2, self.width))
                rgb = cv2.cvtColor(yuv, cv2.COLOR_YUV2RGB_I420)
            elif self.pixfmt == 'rgba':
                rgb = data.reshape((self.height, self.width, 4))
            elif self.pixfmt == 'rgb':
                rgb = data.reshape((self.height, self.width, 3))
            else:
                print('Unsupported pixel format ' + self.pixfmt)
                quit()

            cv2.imshow('frame', cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))
            cv2.setWindowTitle('frame', title)

            #get packet duration for later sleep
            dur = pck.dur
            dur /= self.timescale
            
            pid.drop_packet()

            k = cv2.waitKey(1)
            #press 'esc' to abort
            if (k == 27):
                fs.abort()


            # dummy player, this does not take into account the time needed to draw the frame, so we will likely drift
            time.sleep(dur)

        return 0


if __name__ == '__main__':
    #create a custom filter session
    fs = MyFilterSession()

    # load a source filter
    #if a parameter is passed to the script, use this as source
    if len(sys.argv) > 1:
        src = fs.load_src(sys.argv[1])
    #otherwise load one of our DASH sequences
    else:
        src = fs.load_src("https://download.tsi.telecom-paristech.fr/gpac/DASH_CONFORMANCE/TelecomParisTech/mp4-live-1s/mp4-live-1s-mpd-AV-BS.mpd")

    # load our custom filter and assign its source
    my_filter = MyFilter(fs)
    my_filter.set_source(src)

    # and run
    fs.run()

    fs.print_graph()
    
    fs.delete()
    gpac.close()


```

