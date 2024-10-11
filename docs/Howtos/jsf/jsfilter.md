---
tags:
- pid
- data
- codec
- filter
- buffer
- packet
- pipeline
- connections
- frame
- raw
- stream
- hevc
- bitstream
- sequence
- dump
- media
- property
- rebuffer
- track
- option
- mp4
- graph
- source
- packets
- chain
- input
- output
- sink
---



# Overview {:data-level="all"} 

We discuss here how to use the [JavaScript Filter](jsf) to write JavaScript-based custom filters in GPAC.  
The [JS scripts](https://github.com/gpac/testsuite/tree/filters/media/jsf) in the gpac test suite are also a good source of examples.

The JS filter provides JS bindings to the GPAC filter architecture. JavaScript support in GPAC is powered by QuickJS. Check the documentation of the [JS APIs](https://doxygen.gpac.io/group__jsf__grp.html) for more details. 

# Principles {:data-level="beginner"}

In order to load, a JS filter requires a source JS, specified in the filter  [js](jsf#js) option. A short-cut syntax is to directly specify the js script. In other words, the following syntaxes are equivalent:
```
gpac -h jsf:js=script.js
gpac -h script.js
```



A JS filter behaves like any other filters in GPAC, and can be a source, sink, filter or server.

Your script will be called with the JS API already loaded with a global object called  `filter`  implementing the JSFilter API.
We will assume in the rest of this article that the script file is called `script.js` 


JS filter life cycle can be described as follows:

* creation of JS context
* loading of the JS file (load or setup phase)
* filter initializing, executed in the callback function `filter.initialize`
* if the filter accepts inputs, configuration of input PIDs in the callback function `filter.configure_pid`
* filter process task, executed in the callback function `filter.process`. This function should not block and typically consumes/produces one packet at a time.
* filter termination, executed in the callback function `filter.finalize`
* final destruction of JS context

While a filter is active, it can get the following notifications:

 * if the filter accepts inputs, (re)configuration of input PIDs in the callback function `filter.configure_pid`
 * if the filter accepts inputs, removal of input PIDs through the callback function `filter.remove_pid`
 * events sent by the pipeline through the callback function `filter.process_event`
 * update of arguments values through the callback function `filter.update_arg`

Callback functions defined for `filter` object do not use exception error handling, they shall either return nothing (success) or a GF_Err code. 
 
It is possible to use several JS filters in a given chain, but each JS filter will create its own JavaScript context, and JS objects cannot be shared between JS filters.
If you need to pass JS data across filters, you will have to serialize to JSON your data and either:

- send it as PID information on a PID of your choice
- send it as JSON-only packets through a dedicated JS PID
- send it as associated property on existing packets


# Declaring a filter (optional) {:data-level="beginner"}

The first thing to do when creating a filter is to setup a few things about your filter. 

Give a name to your filter (optional): 
 ```
 filter.set_name("MyFilter");
```
This name will be used when logging messages and inspecting the filter graph. If not set, the filter name will be the script name.

Give a description to your filter  (optional): 
 ```
 filter.set_desc("A demonstration JS filter");
 ```

 This description should provide a quick hint as to what the purpose of the filter is.  It will be shown by the command  `gpac -h script.js`.


You can also setup version and author information  (optional):
 ```
 filter.set_version("0.1beta");
 filter.set_author("GPAC team");
 ```

You should finally set some help for your filter (optional):
 ```
 filter.set_help("This filter provides a very simple javascript filter");
```

This will help other users understand what your filter does and how to use it. It will be shown by the command  `gpac -h script.js`.

You can specify arguments to your filter  (optional):
```
filter.set_arg({ name: "raw", desc: "if set, accept non-demultiplexed input PIDs", type: GF_PROP_BOOL, def: "false"} );
...
filter.set_arg({name: "str", desc: "string to send", type: GF_PROP_STRING, def: "GPAC JS Filter Packet"} );
```

Arguments simplify script configuration and usage, and will be shown by the command  `gpac -h script.js`.

Defined arguments  will be parsed from command line. Each defined argument results in a JS property in the `filter` object with the given value. 

For the above command:

`gpac script.js` will result in the `filter` object having `raw: false` and  `str: "GPAC JS Filter Packet"`  properties defined in the filter object.

`gpac script.js:raw=true` will result in the `filter` object having `raw: true` and  `str: "GPAC JS Filter Packet"`  properties defined in the filter object.


Filter arguments are parsed once the script is loaded. If you need to test the arguments during the initialization phase, do this in the `filter.initialize` callback: 
 
 ```
 filter.initialize = function() {
	if (this.raw) {
		//do something
	} else {
		//do something else
	}
 }
```

# Setting up filter capabilities

Each filter in GPAC uses a set of input and/or output capabilities in order to solve connections between filters, and JS filters are no exception. 

Capabilities shall be set during load or initialization phase, it is not possible to modify capabilities after initialization.

The following will add an output capability indicating the property `StreamType` with a value `Visual` is requested on input PIDs.
```
filter.set_cap({id: "StreamType", value: "Visual"});
```

The following will add an input capability indicating the property `StreamType` with a value `File` is excluded on input PIDs, forcing a demultiplexing of the source.
```
filter.set_cap({id: "StreamType", value: "File", excluded: true} );
```

The following will add an output capability indicating the property `StreamType` with a value `Visual` is always present on output PIDs.
```
filter.set_cap({id: "StreamType", value: "Visual", output: true});
```

The following will add an input and output capability indicating the property `CodecID` with a value  `raw` is required on input PIDs and present on output PIDs (typically, raw audio or video processing filter).
```
filter.set_cap({id: "CodecID", value: "raw", inout: true} );
```

__Discussion__  
GPAC uses a concept of capabilities bundles for complex filters, allowing to describe characteristics of different classes of input or output PIDs. This is also possible using JS filters, by adding an empty cap to your filter:

```

filter.set_cap({id: "StreamType", value: "Visual", inout: true});
filter.set_cap({id: "CodecID", value: "raw", inout: true} );
//video specific PID characteristics for input and output

...
//start a new capability bundle
filter.set_cap();

filter.set_cap({id: "StreamType", value: "Audio", inout: true});
filter.set_cap({id: "CodecID", value: "raw", inout: true} );
//audio specific PID characteristics for input and output
...
```

You can check your JS filter sources and sinks links by using `gpac -h links script.js`.

# Accepting input connections
Once your capabilities are setup, you can get notifications of new inputs through the `filter.configure_pid` callback. This allows you to keep track of PID re-configurations, for later processing.

```

...
filter.pids=[];
...

filter.configure_pid=function(pid)
{
	if (this.pids.indexOf(pid)<0) {
		//this is a new PID, do something
	}
	//check input properties
	let st = pid.get_props('StreamType');
	if (st=='Visual') {
		let width = pid.get_props('Width');
	} 
	else if (st=='Audio') {
		let sr = pid.get_props('SampleRate');
	} else {
		//return GF_Err is allowed
		return GF_NOT_SUPPORTED; 
	}
	//no return value means no error
}
```

The above code allows monitoring PID configuration and performs simple PID property check.

__Discussion__  

Filters properties are mapped to their native type, e.g. unsigned int, boolean, string, float and double, or to objects for vector, arrays, and fractions. There are however a few exceptions here:

- the `StreamType` property is converted to a string (see `gpac -h props` and [Properties](filters_properties))
- the `PixelFormat` property is converted to a string (see `gpac -h props` and [Properties](filters_properties))
- the `AudioFormat` property is converted to a string (see `gpac -h props` and [Properties](filters_properties))
- the `CodecID` property is converted to a string corresponding to the first short name of the codec (see `gpac -h codecs`  and [Properties](filters_properties))

# Packet Query

Once you have an input PID in place in your filter, you can start fetching packets from this PID in the `filter.process` callback. The packet access API follows the same principles as non-JS filters:

- packets are always delivered in processing order
- only the first packet of an input PID packet queue can be fetched, and must be explicitly removed
- packets can be reference counted for later reuse
- packets properties can be reference counted for later reuse, while still discarding the associated packet data, thereby unblocking the filter chain
- If you need access to the second packet in the PID queue, you need to reference the first packet and drop the input PID packet queue.
 
```
filter.process = function()
{
	let pck_in = filter.in_pid.get_packet();
	if (pck_in==null) return;
	//any further call to filter.in_pid.get_packet() will return the same pck_in object, until drop_packet is called
	print('Packet DTS is ' + pck_in.dts);
	let data = pck_in.data;
	//inspect data

	//drop the packet - at this stage, if the packet has not been referenced, its associated data is potentially destroyed and shall no longer be used
	filter.in_pid.drop_packet(); 
}
```

The above code will print the DTS of each packet in the input PID.

# A simple packet inspector

The following shows a simple packet inspector script

```
//prepare our input PID array
filter.pids=[];
//accept any stream types except files, forcing a demultiplexer
filter.set_cap({id: "StreamType", value: "File", excluded: true} );
//accept only framed inputs (no ADTS or TS packets or the like)
filter.set_cap({id: "Unframed", value: "true", excluded: true} );
//indicate we accept any number of input PIDs.
filter.max_pids=-1;

//configure callback
filter.configure_pid=function(pid)
{
	if (this.pids.indexOf(pid)<0) {
		print('New pid ' + pid.get_prop('ID'));
		//send a PLAY event on the PID (we are a sink filter)
		let evt = new FilterEvent(GF_FEVT_PLAY);
		evt.start_range = 0.0;
		pid.send_event(evt);
		//remember our PID
		this.pids.push(pid);
		//only fetch full coded frames (Access Units)
		pid.framing_mode=true;
		pid.nb_pck = 0;
	} else {
		print('Reconfigure pid ' + pid.get_prop('ID'));	
	}
	//print input properties
	print('Properties:');

	let i=0;
	while (1) {
		let prop = pid.enum_properties(i);
		if (!prop) break;
		i++;
		//print in GPAC JS can use a log level as first argument
		print(GF_LOG_INFO, "Prop " + prop.name + " (type " + prop.type + " ): " + JSON.stringify(prop.value) );
	}
	//no return value means no error
}

//process callback
filter.process=function()
{
	this.pids.forEach(function(pid) {
		//dump any packet ready on the PID
		while (1) {
			//get packet
			let pck = pid.get_packet();
			if (!pck) {
				if (pid.eos) print(GF_LOG_INFO, "pid is in end of stream");
				break;
			}
			//print packet info
			print(GF_LOG_INFO, "PID" + pid.name + " PCK" + pid.nb_pck + " DTS " + pck.dts + " CTS " + pck.cts + " SAP " + pck.sap + " size " + pck.size);
			//dump all packet properties (usually none)
			let i=0;
			while (1) {
				let prop = pck.enum_properties(i);
				if (!prop) break;
				i++;
				print(GF_LOG_INFO, "Prop " + prop.name + " (type " + prop.type + " ): " + prop.value);
			}
			//access packet data, and dump first 4 bytes
			let data = pck.data;
			if (data) {
				let view = new Uint8Array(data);
				print('data buffer, size ' + view.length + ' first 4 bytes ' + view[0].toString(16) + '' + view[1].toString(16) + '' + view[2].toString(16) + '' + view[3].toString(16));
			}

			//drop packet
			pid.drop_packet();
		}
	}
	);
}
```

To run the inspector script on a source, simply execute:
```
gpac -i source_file script.js
``` 


# Declaring output PIDs

In GPAC, output PIDs can be declared pretty much at any time in the life cycle of the filter, except upon destruction. You must however declare your output PIDs capabilities:

```
filter.set_cap({id: "StreamType", value: "Video", output: true});
filter.set_cap({id: "CodecID", value: "raw", output: true});
```

The above script will declare an output capability bundle of RAW (uncompressed) video. Note that we use here 'Video' instead of 'Visual', the two names are equivalent.

An output PID can only be created for the current filter. This will setup a new output PID dispatching raw video in rgb format:
```
filter.opid = filter.new_pid();
filter.opid.set_prop("StreamType", "Video");
filter.opid.set_prop("CodecID", "raw");
filter.opid.set_prop("PixelFormat", "rgb");
```

You can also assign user-defined properties to the PID as follows:
```
filter.opid.set_prop("MyTestProperty", "My Current State", true);
```

PID properties are automatically attached to packets sent on the PID. Any modification to the PID properties will mark the next packet sent as a reconfiguration point, which will trigger a `configure_pid` on consuming filters. If you wish to attach information on a PID without triggering reconfiguration (for example, PID state not related to packet processing, such as current download rate), you can use PID information. Any modification to the PID information set will mark the next packet sent as an info update point, which will trigger a call to `process_event`  on consuming filters.

 ```
 filter.opid.set_info("MyTestInfo", "My Current Info", true);
 ```
 
When a PID is used to forward (potentially after processing) packets from an input PID, it is recommended to copy properties of the source PID to the destination PID as follows:

```
filter.configure_pid = function(pid)
{
	if (typeof pid.opid == 'undefined') {
		pid.opid = filter.new_pid();
	}
	pid.opid.copy_props(pid);
	//then modify opid properties as desired
}
```

__Discussion__  
The property copy is recommended especially when SourceIDs, URL templating or filter chain templating are used, as explained in [general filter concepts](filters_general). In these cases, the graph resolution or a destination filter may use a property of the input PID, which would be lost if not copied.

As a general rule, you should always copy source PID properties to output PID, and then rewrite or remove any needed properties. Removing a property is done by using a `null`value:
```
pid.opid.set_props(pid, "MIMEType", null);
```


# Creating new packets

GPAC uses several types of packets:

- packets holding data allocated by the framework. 

Examples:
```
//create blank packet of 20 bytes
dst_pck = outpid.new_packet(20);

//create packet using the given string as a payload
dst_pck = outpid.new_packet("MyString");

//setup array buffer
ab = new ArrayBuffer();
//create packet containing a copy of the array buffer data
dst_pck = outpid.new_packet(ab);
```

- packets holding references to data allocated by a filter. These are usually tracked by the source filter using a callback function to detect packet destruction. An example of this feature is dispatching a video frame from a grabber, in order to avoid memory copy.

Examples:
```
//setup array buffer
ab = new ArrayBuffer();
//create packet containing a reference to the array buffer. The reference is released when the packet is destroyed
dst_pck = outpid.new_packet(ab, true);

//same as above, but also use a callback function to get notification when packet is consumed
dst_pck = outpid.new_packet(ab, true, () => {
						//do something upon destruction of packet
					});

```

- packets holding references to other packets, typically used to forward all or part of an input packet. An example of this feature is cropping an input video packet into one or more smaller frames without copying the packet data, by adjusting strides and data pointers.

Examples:
```
//get source packet
src_pck = in_pid.get_packet();

//create packet containing a reference to the array buffer. The reference is released when the packet is destroyed
dst_pck = outpid.new_packet(src_pck, true);

//same as above, but also use a callback function to get notification when packet is consumed
dst_pck = outpid.new_packet(src_pck, true, () => {
						//do something upon destruction of packet
					});

```

- packets cloning source packets - this special mode is used to perform in-place processing of packet whenever possible; if a source packet is only used by the calling filter and allows in-place processing, the input data is transferred to the output packet with no copy. 

Examples:
```
//get source packet
src_pck = in_pid.get_packet();

//create packet containing a clone of the input packet. If the input data cannot be cloned, a copy of the data is done, otherwise an error is thrown
dst_pck = outpid.new_packet(src_pck);

//create packet containing an explicit copy of the input packet. Even if the input data could have been cloned, a copy of the data is done if possible, otherwise an error is thrown
dst_pck = outpid.new_packet(src_pck, false, true);
```

- packets holding references to data accessors available in the filter, currently only use to access internal color planes of a filter or underlying OpenGL textures. 
This type of packets cannot be created from JS, but they can be used for other operations (packet forwarding, texture setup).
Their data can be accessed from JS by creating a clone packet (regular filter for in-place data editing) or a detached clone (sink filters) 

```
//prepare at global scope or other a cached packet to reduce memory allocations while cloning packets
filter.cached_pck = null;


//get source packet
src_pck = in_pid.get_packet();

let data = null;
if (src_pck.frame_ifce) {
	//we want to edit and send the result, clone the packet
	if (output_pid) {
		dst_pck = outpid.new_packet(src_pck);	
		data = dst_pck.data;
	}
	//we want to read only (either sink or we do not send the modified input as the output)
	//we must clone the packet
	else {
		filter.cached_pck = src_pck.clone(filter.cached_pck);
		data = filter.cached_pck;
	}
}
```



Once a packet is created, you can assign packet info as well as built-in and user properties as usual:
```
dst_pck.dts = 100;
dst_pck.cts = 101;
dst_pck.sap=GF_FILTER_SAP1;
dst_pck.duration = 1;
dst_pck.set_prop('SenderNTP', get_cur_ntp() );
dst_pck.set_prop('MyUserProp', 'My User Data', true);

```

If needed, you can copy packet information from a source packet. This will copy all built-in and user properties and all packet info 

```
dst_pck.copy_props(src_pck);
```

Note that this property copy is done by default when constructing an output packet from a source packet.


When you're ready, it's time to send your packet:

```
dst_pck.send();
```

Once send, the packet cannot be resent: it is in a detached state and has no longer any underlying native packet. As a general rule, you should consider a packet send as no longer accessible. 


# A simple packet generator

The following is a simple packet generator creating 100 packets of subtitles

```
//we produce one text stream, using codec "simple text" ('subs')
filter.set_cap({id: "StreamType", value: "Text", output: true});
filter.set_cap({id: "CodecID", value: "subs", output: true});
filter.nb_pck = 0;

filter.initialize = function() {
	this.opid = this.new_pid();
	this.opid.set_prop("StreamType", "Text");
	this.opid.set_prop("CodecID", "subs");
	this.opid.set_prop("Timescale", "1000");
	//you can set a decoder config for text streams, usually a file header - not that this is optional
	this.opid.set_prop("DecoderConfig", "My Super Config");
}

filter.process = function()
{
	if (!this.opid)
		return GF_EOS;

	if (this.nb_pck>=100) {
 		this.opid.eos = true;
 		return GF_EOS;
	}
	this.nb_pck++;
	
	pck = this.opid.new_packet("Packet number " + this.nb_pck);
	pck.cts = 1000*this.nb_pck;
	pck.dts = 1000*this.nb_pck;
	pck.dur = 1000;
	pck.sap = GF_FILTER_SAP_1;
	pck.send();
}
```



# Loading filters from a JS filter

JS filters can load other filters to create complex processing chain. This can be done in the following ways:

* load a source filter: this allows loading a demultiplexing chain loading data from a given URL
```
let src_f = filter.add_source("myfile.ts");
let src_f = filter.add_source("http://host/source.mp4");

```
Any URL supported by GPAC for source filter loading can be used.

* load a destination (sink) filter: this allows loading a multiplexing chain targeting a given URL
```
let src_f = filter.add_destination("myfile.ts");
let src_f = filter.add_destination("pipe://mymux.gsf");

```

Any URL supported by GPAC  for destination/sink filter loading can be used.

* load a generic filter: this allows loading any filter supported by GPAC
```
let vout_f = filter.add_filter("vout");

```

This will load the video output filter with no specific arguments. 

For each of these methods, the filter name or URL used  can specify filter options, as usual within GPAC filter chains. For example:
```
let vout_f = filter.add_filter("vout:vsync=no");

```

This will load the video output filter with vsync disabled. 


A filter loaded by a JS filter does not expose the JSFilter API, but the [FilterInstance API](https://doxygen.gpac.io/interface_filter_instance.html). In other words, you cannot manipulate the loaded filter by adding or removing PIDs or processing/sending packets in place of this filter. If you build a complex filter chain and need to indicate which of your filter outputs may connect to which loaded destination, you must set the FIDs and SourceID options of your filters, or use the `set_source()` function.

Example using filter IDs:
```
let a_filter = filter.add_filter("vflip:FID=MyFlip");
...
a_filter.set_source(filter);

let vout_f = filter.add_filter("vout:vsync=no");
//vout will only accept PID coming from the filter with ID "MyFlip"
vout_f.set_source(a_filter, "SourceID=MyFlip");
```


Example using PID properties:
```
let an_output = filter.new_pid();
...
an_output.set_prop("MuxSrc", "myPid");

let vout_f = filter.add_filter("vout:vsync=no");
//vout will only accept PID coming from this filter and with property "MuxSrc" set to "myPid" 
vout_f.set_source(filter, "MuxSrc=myPid");
```


# Including filters in your distribution {:data-level=beginner"}

JS files located in GPAC distribution or in the directories indicated using [-js-dirs](core_options#js-dirs) option can describe filters usable by the filter engine based on their name (file without extension or directory name).

Single file case:
```
myfilters/
myfilters/foo.js
```

The filter can be loaded using `foo`, e.g. `gpac -js-dirs=myfilters -i src foo`.

The JS sources for a given filter can also be gathered in a single folder; in that case, the main JS file shall be called `init.js`. For example:
```
myfilters/
myfilters/foojs/
myfilters/foojs/init.js
```

The filter can be loaded using `foojs`, e.g. `gpac -js-dirs=myfilters -i src foojs`.


