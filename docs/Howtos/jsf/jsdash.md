# Overview {:data-level="all"}

We discuss here how to implement your custom DASH rate adaptation logic in JS.

A custom logic can be defined using a standalone script, or by attaching a JS object to the dashin filter in a JS session.

It is recommended to read the [associated documentation](https://doxygen.gpac.io/group__dash__grp.html).


# Standalone script

The standalone mode works by specifying a JS file to the dashin filter using its [-algo](dashin#algo) option:

```
gpac -i source.mpd --algo=mydash.js ...
```

The JS script is loaded with a global object called `dashin` with 4 callback functions:

-  period_reset: indicates start or end of a period (optional)
-  new_group: indicates setup of a new adaptation group (optional), i.e. DASH AdaptationSet or HLS Variant Stream. For HEVC tiling, each tile will be declared as a group, as well as the base tile track
-  rate_adaptation: performs rate adaptation for a group (mandatory). Return value is the new quality index, or -1 to keep as current, -2 to discard (debug, segments won't be fetched/decoded)
-  download_monitor: performs download monitoring, potentially resulting in download abort request (optional)

The following is a basic JS example performing dummy adaptation (always play lowest quality) :

```
import { Sys as sys } from 'gpaccore'

print("Hello DASH custom algo !");

let groups = [];

dashin.period_reset = function (reset_type)
{
	print("Period reset type " + reset_type);
	if (!reset_type)
		groups = [];
}

dashin.new_group = function (group)
{
	print("New group: " + JSON.stringify(group));
	//remember the group (adaptation set in dash)
	groups.push(group);
}

dashin.rate_adaptation = function (group_idx, base_group_idx, force_lower_complexity, stats)
{
	print(`Getting called in custom algo ! group ${group_idx} base_group ${base_group_idx} force_lower_complexity ${force_lower_complexity}`);
	print('Stats: ' + JSON.stringify(stats));

	//always use lowest quality
	//you could check group.SRD to perform spatial adaptation
	return 0;
}

dashin.download_monitor = function (group_idx, stats)
{
	print("Download info " + JSON.stringify(stats));
	return -1;
}

```

# Attaching algo from a JS session

The first step in your JS is to create a DASH object implementing the callbacks previously indicated:


```
//custom rate adaptation object
let dashalgo = {};
dashalgo.groups = [];

dashalgo.rate_adaptation = function (group, base_group, force_lower_complexity, stats)
{
	return 0;
}

dashalgo.new_group = function (group)
{
	this.groups.push(group);
}

dashalgo.period_reset = function (type)
{
	if (!type)
		this.groups = [];
}

```


You will then need to setup a JS session monitoring filter creation process:

```
session.set_new_filter_fun( (f) => {
		print("new filter " + f.name);

		//bind our custom rate adaptation logic
		if (f.name == "dashin") {
			f.bind(dashalgo);
		}
} ); 

```

And you're good to try new rate adaptation algorithm !

