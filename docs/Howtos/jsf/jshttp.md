# Overview

We discuss here how to implement your custom HTTP server logic in JS.

A custom logic can be defined using a standalone script, or by attaching a JS object to the httpout filter in a JS session.


# Standalone script

The standalone mode works by specifying a JS file to the httpin filter using its [-js](httpout#js) option:

```
gpac httpout:port=8080:js=myserver.js ...
```

The JS script is loaded with a global object called `httpout` with one callback function, called at each new request.


The following is a basic JS example performing header injection :

```
import { Sys as sys } from 'gpaccore'

httpout.on_request = function (request)
{
	print("Got request " + JSON.stringify(request));
	request.headers_out.push({name: "x-gpac", value: "foo"});
	//let gpac handle the request
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
}

```

# Attaching from a JS session

The first step in your JS is to create an object implementing the callback previously indicated:


```
//custom rate adaptation object
let req_handler = {
	on_request: function(request) {
		//same code as above
	}
};
```


You will then need to setup a JS session monitoring filter creation process:

```
session.set_new_filter_fun( (f) => {
		print("new filter " + f.name);

		//bind our custom rate adaptation logic
		if (f.name == "httpout") {
			f.bind(req_handler);
		}
} ); 

```

And you're good to go !


# Handling requests in JS 

You can handle the GET request in your own code rather han using GPAC httpout logic. You will need to use the read callback for GET and the write callback for PUT/POST:


```
import { Sys as sys } from 'gpaccore'

httpout.on_request = function (request)
{
	print("Got request " + JSON.stringify(request));
	//handle the request ourselves
	request.reply=200;
	//decide what to to - here we always open the same file
	request.src = new File('av1.mp4', 'rb');

	//our reader callback for GET
	request.read = function(buf) {
		if (request.src.eof) return 0;
		let nb = request.src.read(ab);
		return nb;
	}

	//our write callback for PUT/POST
	request.read = function(buf) {
		print('Got new bytes: ' + ab.byteLength);
		return 0;
	}

	//check end of request
	request.close = function(error) {
		print('closed with code ' + error_string(error));
		request.src.close();
	}
	//send the request - this can also be done later on, e.g. in a callback task
	request.send();
}

```


