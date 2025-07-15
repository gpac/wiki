---
tags:
- pid
- data
- filter
- multiplexer
- session
- pipeline
- connections
- dump
- media
- compositor
- isobmff
- property
- option
- mp4
- graph
- source
- packets
- chain
- input
- isomedia
- output
- sink
---



# Overview {:data-level="all"}

We discuss here how to use [gpac](gpac_general) or the [JavaScript Filter](jsf) to query and control from JavaScript the filter session in GPAC.
The [JS scripts](https://github.com/gpac/testsuite/tree/filters/media/jsf) in the gpac test suite are also a good source of examples.

The [JS FilterSession](https://doxygen.gpac.io/group__fsess__grp.html) provides JS bindings to the GPAC filter session object. It is recommended to also check the documentation of the [JS APIs](https://doxygen.gpac.io/group__jsf__grp.html) for more details.


The FilterSession JS bindings can be loaded in three different ways in GPAC.

- A global controller script can be specified as an argument to gpac using [-js](gpac_general#js) option:
```gpac -js=myscript.js` [OPTIONAL ARGS]```

- available by default in [JavaScript Filters](https://doxygen.gpac.io/group__jsf__grp.html) API

- available by default in [JavaScript Compositor](https://doxygen.gpac.io/group__scenejs__grp.html) API

The filter session object is exposed as a global variable named `session`.

__WARNING__
The filter session API can only be loaded once per session. The implies that using both `-js` and the compositor, or `-js` and a JSFilter using this API will fail.

__Discussion__
Since the session API is available in a JSFilter, you can load a script directly using `gpac script.js`. This will however create a JSFilter inside the session, but this filter will be automatically disabled (not used in the graph resolution, leaving it not connected) if the following conditions are met after initialization:

- filter did not assign any capabilities
- filter did not create any output PID
- filter did not post any task using filter.post_task

# Listing filters in a session


__WARNING__
The [filter object](https://doxygen.gpac.io/interface_j_s_f_s_filter.html) exposed by this API different from the [JavaScript Filter](https://doxygen.gpac.io/group__jsf__grp.html) one: it cannot be used to create packets, PIDs and so on on a given filter.


Due to the dynamic nature of a filter session (multi-threading, dynamic filter chain configuration), getting a listing of filters should be done in exclusive mode:
```
session.lock_filters(true);
let nb_filters = session.nb_filters;

for (let i=0; i<session.nb_filters; i++) {
	let filter = session.get_filter();
}
session.lock_filters(false);
```

Each filter JS object is valid for the lifetime of the underlying filter.

The filter session can be configured to check for filter creation and deletion through callbacks:

```
let all_filters = [];

session.set_new_filter_fun( (f) => {
	print("new filter " + f.name);
	f.iname = "JS"+f.name;
	all_filters.push(f);
} );

session.set_del_filter_fun( (f) => {
	print("delete filter " + f.iname);
	let idx = all_filters.indexOf(f);
	if (idx>=0)
		all_filters.splice (idx, 1);
});

```

You can also check if a filter has not been destroyed by using `is_destroyed()` function.


The specific property `iname` is a string identifier reserved for JS, and used to query a filter by name in the session:

```
let f = session.get_filter('my cool filter');
```

Note that in this case, there is no need to lock the session from javascript.
The property `iname` is also shared with the [JavaScript Filter](https://doxygen.gpac.io/group__jsf__grp.html).


# Getting notified during session execution

The filter session is running through an internal task scheduler. You can post tasks to this scheduler for your script:

```
session.post_task( ()=> {
	if (session.last_task) {
		print("we are done ");
		//the task will no longer be called
		return false;
	}
	all_filters.forEach( (f) => { print('Name: '+f.name)});
	//call back in 1sec
	return 1000;
});

```

# Creating filters

You can load any filter during the session, connecting it from any existing filter if needed.
- source filters must be loaded as `src=URL:opts`
- destination filters must be loaded as `dst=URL:opts`

__Note__
Injecting a filter in the middle of a connected chain (i.e. going from A->B to A->newF->B) is currently not supported.


```
//load a source
let src = session.add_filter("src=video.mp4");
//load an inspect filter, getting its input only from src
let f = session.add_filter("inspect", src);
```

All filter options valid in [GPAC](filters_general) can be used. This means that you can specify complex filter graphs using SID and FID syntax:

```
//load 3 sources
let src1 = session.add_filter("src=video.mp4:FID=1");
let src2 = session.add_filter("src=video.mp4:FID=2");
let src3 = session.add_filter("src=video.mp4:FID=1");
//load an inspect filter, getting its input only from src1 and src2
let f = session.add_filter("inspect:SID=1,2");

//load a ISOBMF mux filter, getting its input only from src2 and src3
let f = session.add_filter("dst=mux.mp4:SID=2,3");
```

To insert a filter before or after a specific filter:
```
let f = session.get_filter('my cool filter');
//insert a TS mux after a given filter
f.insert("dst=mux.ts");
```

To remove a given filter:
```
let f = session.get_filter('my cool filter');
f.remove();
```

To update a filter option:
```
let f = session.get_filter('my cool filter');
f.update("opt_name", "opt_val");
```

# Querying filters
All properties of a filter object are enumerable:

```
print("Filter properties:");
for(let propertyName in f) {
	print("f." + propertyName + " : " + f[propertyName]);
}
```

You can query the number of input and output PIDs of a filter, and enumerate their properties:

```
//input PID
print("Filter num input PIDs: " + f.nb_ipid);
for (i=0; i<f.nb_ipid; i++) {
	//enum props
	f.ipid_props(i, (name, type, val) => { print('input pid prop ' + name + ' type ' + type + ' val ' + val);})

	//or direct query
	let st = f.ipid_props(i, 'StreamType');
}

//output PID
print("Filter num output PIDs: " + f.nb_opid);
for (i=0; i<f.nb_opid; i++) {
	f.opid_props(i, (name, type, val) => { print('output pid prop ' + name + ' type ' + type + ' val ' + val);})
}
```

Reminder: The list of available properties is [`gpac -h props`](filters_properties).


You can query the source filter of a given input PID:

```
print("Filter sources: ");
for (i=0; i<f.nb_ipid; i++) {
	let s = f.ipid_source(i);
	print("PID"+i+" source: " + s.name);
}
```

You can query the filters connected to an output PID:

```
print("Filter destinations: ");
for (i=0; i<f.nb_opid; i++) {
	let sinks = f.opid_sinks(i);
	print("PID"+i+" destinations:");
	for (j=0; j<sinks.length; j++) {
		print(" "+sinks[i].name);
	}
}
```

You can query the arguments defined on a filter:

```
let args = f.all_args();
print("" + args.length + " arguments: " + JSON.stringify(args) );
```

# Handling events

The filter session can receive UI-related events global to the session.

```
session.set_event_fun( (evt) => {
print("evt " + evt.name);
if (evt.type != GF_FEVT_USER) return;

if (evt.ui_type == GF_EVENT_SIZE) {
	print('display size is ' + evt.width + 'x' + evt.height);
	return false;
}

});

```

The filter session can also be used to fire events events on filters accepting UI events.

```
let f_evt = new FilterEvent(GF_FEVT_USER);
f_evt.ui_type = GF_EVENT_SET_CAPTION;
f_evt.caption = "forced caption";
session.fire_event(f_evt);
```

The filter session can also be used to fire non-UI related events on filters. You must be extra careful when using this, as this might trigger unwanted behavior in the chain. Typically:

- upstream events (towards sink) should only be fired on source filters (nb_ipid = 0)
- downstream events (towards source) should only be fired on sink filters (nb_opid = 0)

```
let f_evt = new FilterEvent(GF_EVENT_STOP);
session.fire_event(f_evt, target_filter);
```


# Monitoring

GPAC provides a websocket server that can be used for live monitoring of a running filter session, or as an entry point for communication between an external tool (e.g. a UI) and a running gpac instance.

Quick example:

```js
import { Sys as sys } from 'gpaccore'

sys.enable_rmtws();

sys.rmt_on_new_client = function(client) {
	console.log("rmt new client", client.peer_address);

	client.on_data = (msg) =>  {

        console.log("Client ", client.peer_address, " got message: ", msg);

		client.send("ACK");
	}

	client.on_close = function() {
		console.log("ON_CLOSE on client ", client.peer_address);
	}
}
```

See [the RMTWS tutorial](/Developers/tutorials/rmtws) for more details.


# Creating custom filters

You can create your own custom filters in a JS session using `new_filter`. The returned object will be a  [JavaScript Filter](jsfilter) with the following limitations:

- no custom arguments for the filter can be set
- the `initialize` function is not called
- the filter cannot be cloned
- the filter cannot be used as source of filters loading a source filter graph dynamically, such as the dashin filter.
- the filter cannot be used as destination of filters loading a destination filter graph dynamically, such as the dasher filter.

```

let my_filter = session.new_filter("MyFilter");

//let the filter accept any input of type video
my_filter.set_cap({id: "StreamType", value: "Visual"});

//check input connections
my_filter.configure_pid = function(pid)
{
}

//process packets
my_filter.process = function()
{
}

```


# Other tools {: data-level ="beginner"}

Some GPAC core functions are made available through JS for prompt handling, bitstream parsing, file and directory IO, check [the documentation](https://doxygen.gpac.io/group__core__grp.html).
