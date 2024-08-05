# Foreword
Please make sure you are familiar with [DASH terminology](DASH-basics) before reading. 

In this howto, we will study various setups for DASH live streaming in low latency mode, using both [MP4Box](MP4Box) and [gpac](gpac_general). This approach follows standards. It is compatible with any low-latency aware DASH implementation such as [dash.js](https://dashif.org/tools/dashjs/)

As a reminder, you can always get more info on option `foo in GPAC by using:
```
gpac -h foo
MP4Box -h foo
```

You can also check the filter graph used by your session:
```
gpac -graph REST_OF_COMMAND
MP4Box -fgraph REST_OF_COMMAND 
```

And when using gpac, you can enable real-time reporting of filters activities using `gpac -r`.


The `gpac` application can be used for dashing whenever `MP4Box` is used, but the opposite is not true. Especially MP4Box cannot:

- use complex custom filter chains while dashing, such as transcoding in several qualities
- produce two DASH sessions at the same time


The basic syntax for MP4Box dashing is:  
```MP4Box -dash SEGMENT_DUR -profile live -out file.mpd source1 ... sourceN```

The equivalent syntax for gpac dashing is:  
```gpac -i source1 ... -i sourceN -o file.mpd:profile=live:segdur=2```

MP4Box can accept filter options in each of the source URLs as well as in the destination URL.  
```MP4Box -dash SEGMENT_DUR -profile live -out file.mpd:OPT1=VAL1[...] source1:OPT2=VAL2 ... sourceN:OPTN=VALN```

The equivalent syntax for gpac dashing is:  
```gpac -i source1:OPT2=VAL2 ... -i sourceN:OPTN=VALN -o file.mpd:profile=live:segdur=2:OPT1=VAL1```
 
Options specified on a source or destination filter are inherited by any filter needed to link the source to the destination, as [explained here](filters_general#arguments-inheriting). When dashing, options specified on the destination manifest (file.mpd) are also specified on the target segmented outputs.

MP4Box can accept filter chains for each source URLs.  
```MP4Box -dash SEGMENT_DUR -profile live -out file.mpd source1:@@cecrypt:cfile=drm1.xml ... sourceN:@@cecrypt:cfile=drmN.xml```

The equivalent syntax for gpac dashing requires setting up filter IDs (FID) and source filtering (SID) on your filters as explained in the [encryption howto](encryption-filters):  
```gpac -i source1:FID=S1 cecrypt:cfile=drm1.xml:FID=C1:SID=S1 ... -i sourceN:FID=SN cecrypt:cfile=drm1.xml:FID=CN:SID=SN -o file.mpd:SID=C1,CN:profile=live:segdur=2```



__Note__  
_MP4Box dashing is a simple wrapper around a filter session running the [dasher](dasher) filter, with all MP4Box DASH options remapped to the filter. For backward compatibility reasons, the old options of GPAC 0.8 or below were  kept, but the syntax can also be migrated to GPAC filters:_

```MP4Box -dash 1000 -ast-offset 9000 -profile live [...]```

_is equivalent to_

```MP4Box --segdur=1000 --asto=9000 --profile=live [...]```


# DASH Low Latency setup

In DASH low latency, you must decide the duration of your segment (produced file) and the duration of your fragment or `CMAF chunk` (sub-part of the produced segment).
In GPAC, the dashing process only cares about segments and is unaware of the fragmentation of the segment, as this is a property of the underlying multiplexing format. For example, low latency DASH using MPEG-2 TS mux or raw elementary stream do not need to worry about fragment duration since packets of the mux are generated as soon as input packets are received.

For  ISOBMFF (fmp4), each segment can be divided in one or more fragments. This is described by the [cdur](mp4mx#cdur) option, which in case of DASH will be set by default to the segment duration (hence one fragment per DASH segment).

```
MP4Box -dash 10000 -frag 1000 -profile live -out DST_URL source1 ... source2
gpac -i source1 -i source2 -o DST_URL:segdur=10:cdur=1:profile=live
```

This will DASH your content trying to use 10s segments, each made of 10 fragments of 1s. 

__Note__   
_The fragments duration will vary depending on the duration of input frames, but in any case a new fragment will be created as soon as the current fragment duration is equal to or greater than the desired duration._


You can now do a live (dynamic) DASH session:

```
MP4Box -dash-live 10000 -subdur 10000 -frag 1000 -profile live -out DST_URL source1 ... source2
```

This will generate a live session, dashing 10s (`-subdur`) of content into 10s (`-dash-live`) segments, each containing 10 fragments of 1s (`-frag`). If your sources are live, you don't need to specify the `-subdur`option since real-time regulation of source is not needed. 

or

```
gpac -i source1 -i source2 -o DST_URL:segdur=10:cdur=1:profile=live:dmode=dynamic:sreg
```

This will generate a live session, dashing content into 10s (`segdur`) segments, each containing 10 fragments of 1s (`cdur`), performing real-time regulation after each segment generation (`sreg`). If your sources are live, you don't need to specify the `sreg`option since real-time regulation of source is not needed. 


The above commands do not perform fragment regulation, which means that the content of each segment will be written at once by the file multiplexer (if your sources are live, this will not be the case and you can skip this next step) :   

```
MP4Box -frag-rt -dash-live 10000 -frag 1000 -profile live -out res/live.mpd source1 source2
gpac -i source1 -i source2 reframer:rt=on -o res/live.mpd:segdur=10:cdur=1:profile=live:dmode=dynamic
```

The `-frag-rt` simply injects a [reframer](reframer) in the filter graph performing real-time regulation on media frames. This will ensure that both segments and fragments are written to disk in real-time.


If you dash a live TS source for example, the commands will be, without regulation:
```
MP4Box -dash-live 10000 -frag 1000 -profile live -out res/live.mpd udp://IP:PORT
gpac -i udp://IP:PORT -o res/live.mpd:segdur=10:cdur=1:profile=live:dmode=dynamic
```

You now have low-latency producing of your DASH session, however in terms of DASH you may want to indicate to the client that if it is low-latency enabled, it may fetch segments earlier than advertised in the manifest. This is indicated by the `availabilityStartOffset` attribute which gives the amount of seconds a request can be sent ahead of time:

```
MP4Box -ast-offset 9000 -dash-live 10000 -frag 1000 -profile live -out res/live.mpd udp://IP:PORT
gpac -i udp://IP:PORT -o res/live.mpd:segdur=10:cdur=1:profile=live:dmode=dynamic:asto=9
```

In the above example, we indicate the requests can be issued 9s (`asto` or `-ast-offset`) before the segment is fully produced. Your typical setup should have `cdur + asto = segdur`. 
If `asto` is greater than `segdur + cdur`, this will results in 404; if is is less, this will increase the client delay to the live edge.


# DASH Origin Server setup

You now will want to distribute your DASH Low Latency over HTTP(S). The difficulty is that regular HTTP severs will usually not understand how to deliver a file while it is being produced without a great deal of tricks - for example, see our experimental node.js [low latency server](https://github.com/gpac/node-gpac-dash).

To simplify this process, GPAC features a simple HTTP server that understands DASH low latency and is able to push segments while they are being produced, without any file system monitoring. Please read the documentation of the [HTTP Server](httpout) for more details.

The server will need a local directory where files are stored and can be delivered to clients behind the live edge. This is done by indicating to the server a read directory.


```
MP4Box -ast-offset 9000 -frag-rt -dash-live 10000 -frag 1000 -profile live 
	-out http://localhost:8080/live.mpd:gpac:rdirs=outdir source1 source2


gpac -i source1 -i source2 reframer:rt=on -o http://localhost:8080/live.mpd:gpac:segdur=10:cdur=1:profile=live:dmode=dynamic:rdirs=outdir:asto=9
```

Note that since this example only uses a single DASH session, all options specified for the dasher can be set globally:
```
MP4Box -ast-offset 9000 -frag-rt -dash-live 10000 -frag 1000 -profile live
	-out http://localhost:8080/live.mpd --rdirs=outdir --wdir=outdir source1 source2

gpac -i source1 -i source2 reframer:rt=on -o http://localhost:8080/live.mpd
	--segdur=10 --cdur=1 --profile=live --dmode=dynamic --asto=9  --rdirs=outdir
```


# DASH Origin PUSH setup

You may rather want to use a regular HTTP server as your origin server, and have GPAC push segments to that server while they are being produced. Again, please read the documentation of the [HTTP Server](httpout).

In this case, the httpout filter does not work as a server but as an HTTP client issuing PUT or POST requests, and does not need any local directory.


```
MP4Box -ast-offset 9000 -frag-rt -dash-live 10000 -frag 1000 -profile live
	-out http://ORIG_SERVER_IP_PORT/live.mpd:gpac:hmode=push source1 source2

gpac -i source1 -i source2 reframer:rt=on
	-o http://ORIG_SERVER_IP_PORT/live.mpd:gpac:segdur=10:cdur=1:asto=9:profile=live:dmode=dynamic:hmode=push
```

Note that since this example only uses a single DASH session, all options specified for the dasher can be set globally:
```
MP4Box -ast-offset 9000 -frag-rt -dash-live 10000 -frag 1000 -profile live
	-out http://ORIG_SERVER_IP_PORT/live.mpd --hmode=push source1 source2

gpac -i source1 -i source2 reframer:rt=on -o http://ORIG_SERVER_IP_PORT/live.mpd 
	--segdur=10 --cdur=1 --profile=live --dmode=dynamic --asto=9 --hmode=push
```


# DASH Low Latency live encoding

We will now use a live source (webcam), encode it in two qualities, DASH the result and push it to a remote server. Please check the [encoding howto](encoding) first.
Compared to what we have seen previously, we only need to modify the input part of the graph:

- take as a live source the default audio video grabbed by the [libavdevice](ffavin) filter
- rescale the video  as 1080p and 720p 
- encode the rescaled videos at 6 and 3 mbps 
- encode the audio in aac at 128 kbps
- feed the encoders outputs to the dasher

```
gpac 
	#specify the source
	-i av://:FID=1

	#specify first rescaler and encoder for 1080p
	ffsws:osize=1920x1080:SID=1 @ enc:c=avc:fintra=1:FID=EV1:b=6m

	#specify second rescaler and encoder for 720p
	ffsws:osize=1280x720:SID=1 @ enc:c=avc:fintra=1:FID=EV2:b=3m

	#specify AAC encoding	
	enc:c=aac:SID=1:FID=EA:b=128k

	#specify http push output in DASH, using only sources from video and audio encoders 
	-o http://ORIG_SERVER_IP_PORT/live.mpd:gpac:SID=EV1,EV2,EA

	#http and dash options specified globally
	 --hmode=push --profile=live --segdur=1 --cdur=0.1 --asto=0.9

```

The `fintra`  parameter is used to force the encoders to generate an intra / IDR frame every one second, thus ensuring a proper segmentation of the result.

In the above command, we have a  ultra-low latency setup where fragments are only 100ms for 1s segments. Note that this assumes that the encoders are able to always encode 100ms of data in less than 100ms, which can be problematic (intra / IDR are heavier to code). To avoid potential 404s, you can either increase the fragment duration or just only reduce the `asto, which will slightly increase the latency but keep pushing at the same rate. 

__Note__  
_The [rescaler](ffsws) filter will automatically move to pass-through mode if the input size and pixel format match the output ones (desired by the encoder)._

