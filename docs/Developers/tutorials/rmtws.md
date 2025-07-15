# Overview

GPAC includes a websocket server (called RMTWS) that can be used to develop monitoring applications using the gpac bindings.

The basic architecture to acheive this contains 3 elements:

 - a running gpac instance that does some processing (and has RMTWS enabled)
 - a websocket controller written in one of the supported gpac bindings language (JS/Node/Python) that will send information to the websocket clients about the running session (filters list, pids, etc.)
 - a UI that connects to the websocket and displays this information


RMTWS is completly protocol-agnostic meaning that the nature and content of the messages exchanged between the UI and the controller are entirely up to the developers of the monitoring application (e.g. you can exchange a json object containing a list of filters info, or binary data representing a processed frame, or anything else).

Basic examples can be found in [share/rmtws](https://github.com/gpac/gpac/tree/master/share/rmtws) in the gpac repo.


# GPAC options

Using gpac with the [-rmt](core_options#rmt) parameter will enable the websocket server.

Other options are available to control things like the port used, tls usage, etc. see the `-rmt-*` options in the [gpac usage](core_options#rmt).


# Javascript

The first option for a RMTWS controller is to use the Javascript controller for GPAC defined via the [-js](gpac_general#js) option.

To do this you simply have to define the `sys.rmt_on_new_client` attribute.

e.g.:

```js
import { Sys as sys } from 'gpaccore'

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

When defined the `sys.rmt_on_new_client` function will be called everytime a client connects to the websocket. A `client` object will be passed as parameter.

This `client` object has several methods and callbacks that can be used:

 - `client.peer_address` is an identifier of the client in the form `ip:port`
 - `client.send(data)` sends data to the client on the websocket
 - `client.on_data(data)` is a callback called when the controller receives data from the client
 - `client.on_close()` is a callback called when the client disconnects

You can see the API documentation of these here: https://doxygen.gpac.io/interface_j_s___r_m_t_client.html

From there you can build more complex interaction between this controller and the UI.

For example in [share/rmtws](https://github.com/gpac/gpac/tree/master/share/rmtws) you have a JS controller called `jsrmt.js` that can be used with

```bash
gpac -rmt -js=jsrmt.js  #<rest of your gpac command>
#e.g.:
gpac -rmt -js=jsrmt.js avgen reframer:rt=on inspect:deep
```

with this command running you can open the basic UI at [share/rmtws/index.html](https://github.com/gpac/gpac/tree/master/share/rmtws/index.html) which should display a JSON of the filter in the session with live updates.


# NodeJS

Another way to run a RMTWS controller is to use the [NodeJS bindings](/Howtos/nodejs) of GPAC.

The code is very similar to the javascript example.

```js
const gpac = require('../nodejs');
gpac.enable_rmtws(true);

gpac.rmt_on_new_client = function(client) {

    console.log("[RMTWS] new client ", client.peer_address);

    client.on_data = (msg) =>  {
        console.log("[RMTWS] client", client.peer_address, "received", msg);

        client.send("ACK");
    }

    client.on_close = () => {
        console.log("[RMTWS] client", client.peer_address, "disconnected");
    }
}
```

The method are the same as the javascript example above. More info can be found in the [doxygen API documentation](https://doxygen.gpac.io/interface___r_m_t_client.html).

For example you can use the nodejs controller in [share/rmtws/nodermt.js](https://github.com/gpac/gpac/blob/master/share/rmtws/nodermt.js) with

```bash
node nodermt.js -f=avgen -f=reframer:rt=on -f=inspect:deep # or any other gpac filters
```

and open the UI in [share/rmtws/index.html](https://github.com/gpac/gpac/tree/master/share/rmtws/index.html) to get a live JSON of the filters in the session.


# Python

Finally, the same thing can be acheived using the [Python bindings](Howtos/python.md).

The basic code here is slightly different but the same methods can be found.

```python
import libgpac as gpac

gpac.enable_rmtws()

class MyRMTHandler(gpac.RMTHandler):

    def on_new_client(self, client):
        print(f"new client {client} {client.peer_address()}")

    def on_client_data(self, client, data):
        print(f"client {client.peer_address()} got data: {data}")

        client.send("ACK")


    def on_client_close(self, client):
        print(f"del client {client} {client.peer_address()}")


rmt_handler = MyRMTHandler()
gpac.set_rmt_handler(rmt_handler)
```

The API documentation is here: https://doxygen.gpac.io/group__pycore__grp.html with details about [clients](https://doxygen.gpac.io/classpython_1_1libgpac_1_1libgpac_1_1_r_m_t_client.html) and [events](https://doxygen.gpac.io/classpython_1_1libgpac_1_1libgpac_1_1_r_m_t_handler.html).

The example in [share/rmtws/pyrmt.py](https://github.com/gpac/gpac/blob/master/share/rmtws/pyrmt.py) can be run with

```sh
python pyrmt.py -f=avgen -f=reframer:rt=on -f=inspect:deep
```

and the UI in [share/rmtws/index.html](https://github.com/gpac/gpac/tree/master/share/rmtws/index.html) should display a live JSON of the filters in the session.
