---
tags:
- option
- mp4
- profile
- mpd
- block
- session
- media
- reframer
- isomedia
- segment
- data
- isobmff
- stream
- bitrate
- dash
- chunk
- latency
---



# Foreword
Please make sure you have read [DASH Low Latency](LL-DASH) and [HLS Generation](hls) before reading this. 

In this howto, we will study various setups for HLS live streaming in low latency mode (LL-HLS), using both [MP4Box](MP4Box) and [gpac](gpac_general).


# HLS Low Latency setup

The same setup for configuring segments and CMAF chunks is used as the [DASH low latency](LL-DASH#dash-low-latency-setup) setup.

When you have low-latency producing of your HLS media segments, you need to indicate to the client how to access LL-HLS `parts` (CMAF chunks) while they are produced. LL-HLS offers two possibilities to describe these parts in the manifest:

- file mode: advertise the chunks as dedicated files, i.e. each chunk will create its own file. This requires double storage for segments close to the live edge, increases disk IOs and might not be very practical if you setup a PUSH origin (twice the bandwidth is required)
- byte range mode: advertise the chunks as byte range of a media file. If that media file is the full segment being produced (usually the case), this does not induce bandwidth increase or extra disk IOs.
  
GPAC can work in both modes, and always use byte-range in the segment being produced for the second mode.
The mode is selected using the [llhls](dasher#llhls) option of the dasher.

In either mode, each variant playlist will be modified at each new LLHLS part ready.

In file mode, each part file is the full segment name appended with `.N`, with `N` the 1-based number of the part being generated, e.g. `file_1.mp4.1`,  `file_1.mp4.2`,  `file_1.mp4.3` ...  
  
```
MP4Box -frag-rt -dash-live 10000 -frag 1000 -profile live -out res/live.m3u8:llhls=br source1 source2
gpac -i source1 -i source2 reframer:rt=on -o res/live.m3u8:segdur=10:cdur=1:profile=live:dmode=dynamic:llhls=br
```

In the above example, we indicate the LLHLS parts are byte-ranges in the segment being produced. 

```
MP4Box -frag-rt -dash-live 10000 -frag 1000 -profile live -out res/live.m3u8:llhls=sf source1 source2
gpac -i source1 -i source2 reframer:rt=on -o res/live.m3u8:segdur=10:cdur=1:profile=live:dmode=dynamic:llhls=sf
```

In the above example, we indicate the LLHLS parts are independent files. 



# LLHLS Origin Server setup

The same setup for configuring the server is used as the [DASH low latency](LL-DASH#dash-origin-server-setup) setup.

The server will need a local directory where files are stored.


```
MP4Box -frag-rt -dash-live 10000 -frag 1000 -profile live 
	-out http://localhost:8080/live.mpd:gpac:rdirs=outdir:llhls=br source1 source2


gpac -i source1 -i source2 reframer:rt=on
	-o http://localhost:8080/live.mpd:gpac:segdur=10:cdur=1:profile=live:dmode=dynamic:rdirs=outdir:llhls=br
```

Note that since this example only uses a single DASH session, all options specified for the dasher can be set globally:
```
MP4Box -frag-rt -dash-live 10000 -frag 1000 -profile live
	-out http://localhost:8080/live.mpd --rdirs=outdir --llhls=br source1 source2

gpac -i source1 -i source2 reframer:rt=on -o http://localhost:8080/live.mpd
	--segdur=10 --cdur=1 --profile=live --dmode=dynamic --rdirs=outdir --llhls=br
```


# LLHLS Origin PUSH setup

You may want to use a regular HTTP server as your origin server, and have GPAC push segments to that server while they are being produced. Again, please read the documentation of the [HTTP Server](httpout).

In this case, the httpout filter does not work as a server but as an HTTP client issuing PUT or POST requests, and does not need any local directory.


```
MP4Box -frag-rt -dash-live 10000 -frag 1000 -profile live
	-out http://ORIG_SERVER_IP_PORT/live.mpd:gpac:hmode=push:llhls=br source1 source2

gpac -i source1 -i source2 reframer:rt=on
	-o http://ORIG_SERVER_IP_PORT/live.mpd:gpac:segdur=10:cdur=1:profile=live:dmode=dynamic:hmode=push:llhls=br
```


# Dual DASH and HLS Low Latency

You can generate at the same time DASH-LL and LL-HLS, by simply setting up both `availabilityStartOffset` and LL-HLS modes. 

It is recommended to only use byte-range mode for LL-HLS in that case for bandwidth efficiency reasons, but file mode is also working.


```
MP4Box -ast-offset 9000 -frag-rt -dash-live 10000 -frag 1000 -profile live
	-out http://ORIG_SERVER_IP_PORT/live.mpd:gpac:dual:llhls=br:rdirs=outdir source1 source2

gpac -i source1 -i source2 reframer:rt=on
	-o http://ORIG_SERVER_IP_PORT/live.mpd:gpac:dual:segdur=10:cdur=1:profile=live:dmode=dynamic:hmode=push:llhls=br:asto=9:rdirs=outdir
```


