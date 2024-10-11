---
tags:
- pid
- data
- codec
- pipe
- multiplexer
- session
- pipeline
- compression
- encode
- dump
- media
- isobmff
- property
- box
- h264
- option
- mp4
- source
- chain
- input
- isomedia
- output
- mpeg
- sink
- encoder
---



# Overview {: data-level="all" }

We discuss here how to use pipes in GPAC.  

GPAC supports data piping on Linux, OSX and Windows. The pipe is unidirectional, and can be used as source or as destination.
 
# Input pipe {: data-level="beginner" }

## Simple reception of data

Assume you have a source that dispatches AVC|H264 in Annex B format. If you direct this source to a pipe `myavcpipe`, you can read from it using:
 
```gpac -i pipe://myavcpipe:ext=avc -o test.mp4```

The above command will open the pipe  `myavcpipe`, read AVC|H264 Annex B data from it and use it to mux MP4 data. Obviously you can use whatever output and processing:
```gpac -i pipe://myavcpipe:ext=avc ffsws:osize=640x360 -o test.yuv```

This will grab the source, resize it and dump it to file.


__Discussion__  
The  `ext` option is used to indicate the input format of the data carried on the pipe. If not set, the first received block of data will be used to probe for media format. Most mux format used by GPAC can be used on input pipes; a notable exception is ISOBMFF which is not supported, even in fragmented mode (this should be patched soon). 

## Advanced reception of data
Assume you want gpac to grab from a pipe some  AVC|H264 content which could be sent sequentially by sender(s). typically, an encoder processing a playlist and sending each result to a pipe. Having the encoder create the pipe will result in closing the pipe at each file, which is not the goal. We need to
- create the pipe, either manually or by asking the [pipe](pin) input to create it for us using [mkp](pin) option
- tell the pipe input to keep the session alive even when broken pipe messages are received, using [ka](pin) option


```gpac -i pipe://myavcpipe:ext=avc:mkp:ka -o test.mp4```

This will open the pipe, creating it if not found, and we can now start sending data on the pipe. 

__Discussion__
The above command will run forever, since broken pipe messages are ignored. You can abort the session using `ctr+c` and ask to flush pending data to disk. If you have enabled prompt interactivity in gpac [-k](gpac_general), simply press `q`.
There is currently no way to signal from the sender that the session should be closed, we might add this feature in the near future.


# Output pipe 


Assume you have an app that consumes AVC|H264 in Annex B format from a pipe `myavcpipe`. You can direct GPAC output to this pipe:
 
```gpac -i source.mp4 -o pipe://myavcpipe:ext=avc```

The above command will open the file `source.mp4`, open the pipe  `myavcpipe` and send ([potentially transcoding](encoding)) the AVC|H264 data to this pipe. Obviously you can use whatever input and processing:
```gpac -i source.yuv ffsws:osize=640x360 -o pipe://myavcpipe:ext=avc```

This will grab the source, resize it, encode it and write it to the pipe.


__Discussion__  
The  `ext` option is used to indicate the output format of the data carried on the pipe. If SHALL be set. Any mux format used by GPAC can be used on output [pipes](pout). 

You should however be very careful using containers (e.g. ISOBMFF) as a format, since some containers format will require the entire file to be produced to make it valid. For example, using ISOBMFF (`mp4`) as a data format will fail, since we need to patch either the `moov` or `mdat` box at the end of the multiplexing. However, if using fragmented ISOBMFF, it will be possible to push the mux result to a pipe.
This problematic of patching previous blocks of data in a file is signalled by the property `DisableProgressive` on the `file` PID. At the current time, only the [file output](fout) filter can support PIDs with this property set.
