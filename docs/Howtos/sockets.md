---
tags:
- pid
- data
- codec
- filter
- connection
- multiplexer
- session
- compression
- encode
- dump
- link
- media
- isobmff
- property
- box
- h264
- option
- mp4
- source
- input
- isomedia
- output
- mpeg
- sink
- encoder
---



# Overview {: data-level="all" }

We discuss here how to use sockets in GPAC for generic IO.  

GPAC supports UDP and TCP sockets on all platforms, and unix domain sockets on Linux and OSX . The socket is currently unidirectional, and can be used as source or as destination.
 
# Input socket

## Simple reception of data

Assume you have a source that dispatches AVC|H264 over TCP or UDP at `127.0.0.1:1234`. You can read from this socket using:
 
```
gpac -i udp://127.0.0.1:1234/:ext=avc -o test.mp4
gpac -i tcp://127.0.0.1:1234/:ext=avc -o test.mp4
```

The above command will open the given socket read AVC|H264 Annex B data from it and use it to mux MP4 data. Obviously you can use whatever output and processing:
```gpac -i tcp://127.0.0.1:1234/:ext=avc ffsws:osize=640x360 -o test.yuv```

This will grab the source, resize it and dump it to file.


__Discussion__  
The  `ext` option is used to indicate the input format of the data carried on the socket. If not set, the first received block of data will be used to probe for media format. Most mux format used by GPAC can be used on input sockets; a notable exception is ISOBMFF which is not supported, even in fragmented mode (this should be patched soon). 

Notice the final `/` after the port number. If you omit it, you will need to [escape the filter arguments](filters_general#generic-declaration):
```
gpac -i udp://127.0.0.1:1234:gpac:ext=avc -o test.mp4
```

 
## Advanced reception of data
Assume you want gpac to grab from a TCP socket some  AVC|H264 content which could be sent sequentially by sender(s). typically, an encoder processing a playlist and sending each result to a socket. Having the encoder create the socket will result in closing the socket at each file, hence closing gpac after the first file, which is not the goal. We need to
- create the socket by asking the [socket](sockin) input to create it for us using [listen](sockin) option
- tell the socket input to keep the session alive even when socket connection close messages are received, using [ka](sockin) option


```gpac -i tcp://127.0.0.1:1234/:ext=avc:listen:ka -o test.mp4```

This will open the socket, creating it if not found, and we can now start sending data on the socket. 

__Discussion__
The above command will run forever, since socket connection close messages are ignored. You can abort the session using `ctr+c` and ask to flush pending data to disk. If you have enabled prompt interactivity in gpac [-k](gpac_general), simply press `q`.
There is currently no way to signal from the sender that the session should be closed, we might add this feature in the near future.


# Output socket


Assume you have an application which consumes AVC|H264 in Annex B format from a UDP or TCP socket  `localhost:1234`. You can direct GPAC output to this socket:
 
```
gpac -i source.mp4 -o udp://127.0.0.1:1234/:ext=avc
gpac -i source.mp4 -o tcp://127.0.0.1:1234/:ext=avc
```

The above command will open the file `source.mp4`, open/connect the socket  `127.0.0.1:1234` and send ([potentially transcoding](encoding)) the AVC|H264 data to this socket. Obviously you can use whatever input and processing:

```gpac -i source.yuv ffsws:osize=640x360 -o tcp://127.0.0.1:1234/:ext=avc```

This will grab the source, resize it, encode it and write it to the socket.


__Discussion__  
The  `ext` option is used to indicate the output format of the data carried on the socket. If SHALL be set. Any mux format used by GPAC can be used on output [sockets](sockout). 

You should however be very careful using containers (e.g. ISOBMFF) as a format, since some containers format will require the entire file to be produced to make it valid. For example, using ISOBMFF (`mp4`) as a data format will fail, since we need to patch either the `moov` or `mdat` box at the end of the multiplexing. However, if using fragmented ISOBMFF, it will be possible to push the mux result to a socket.
This problematic of patching previous blocks of data in a file is signaled by the property `DisableProgressive` on the `file` PID. At the current time, only the [file output](fout) filter can support PIDs with this property set.

Contrary to [output pipes](pout), output socket can work in server mode and use a keep-alive mode to keep the connection open until new clients come in - see the [socket output](sockout) filter help.


