



# Foreword {: data-level="all" }


This page contains one-liners illustrating the many possibilities of GPAC filters architecture. For a more detailed information, it is highly recommended that you read:

- the [general concepts](filters_general) page 
- the [gpac application](gpac_general)  help

To get a better understanding of each command illustrated in this case, it is recommended to:

- run the same command with `-graph` specified to see the filter graph associated
- read the help of the different filters in this graph using `gpac -h filter_name`

Whenever an option is specified, e.g. `dest.mp4:foo`, you can get more info and locate the parent filter of this option  using `gpac -h foo`.

The filter session is by default quiet, except for warnings and error reporting. To get information on the session while running, use [-r](gpac_general#r) option. To get more runtime information, use the [log system](core_logs).
sectionLevel === null || 
Given the configurable nature of the filter architecture, most examples given in one context can be reused in another context. For example:

- from the dump examples:
```
gpac -i source reframer:saps=1 -o dump/$num$.png
```

- from the encode examples:
```
gpac -i source ffsws:osize=320x240 enc:c=avc:b=1m -o dst.mp4
```

This can be recombine as dump key frames to png while rescaling:
```
gpac -i source reframer:saps=1 ffsws:osize=128x72 -o dump/$num$.png
```

_NOTE The command lines given here are usually using a local file for source or destination URLs, but they can work with remote URLs as well._


_Reminder_
Most filters are never specified at the prompt, they are dynamically loaded during the graph resolution.
GPAC filters can use either:

- global options, e.g. `--foo`, applying to each instance of any filter defining the `foo` option,
- local options to a given filter and any filters dynamically loaded, e.g. `:foo`. This is called [argument inheriting](filters_general#arguments-inheriting).  



_NOTE This page is under permanent construction, feel free to contribute !_

# Source Inspection {: data-level="beginner" }

Check if a source is supported and get quick information on the media streams - _see [filter](inspect), [howto](inspecting)_  
```
gpac -i source inspect
gpac -info source
```

Check if a source is supported and get verbose information on the media streams - _see [filter](inspect), [howto](inspecting)_  
```
gpac -i source inspect:full
```


Check if a source is supported and get all possible media stream states in the media streams (codec change & co)  - _see [filter](inspect), [howto](inspecting)_  
```
gpac -i source inspect:allp
```


Dump all packets info of a source from 60 to 80 seconds, listing one stream after the other  - _see  [filter](inspect)_  
```
gpac -i source inspect:deep:start=60:dur=20:interleave=false
```


Dump CTS, DTS, random access and size of packets of a source to a log file - _see [filter](inspect), [howto](inspecting)_  
```
gpac -i source inspect:deep:fmt="%dts% %dts% %sap% %size%%lf":log=mylogs.txt
```


Analyze packets of a source - _see [filter](inspect), [howto](inspecting)_  
```
gpac -i source.264 inspect:deep:analyze=on
```


_Note_ This is similar to (but more complete than) MP4Box [-dnal](mp4box-dump-opts#dnal) option

Count all streams in a source - _see [filter](probe),  [doc](filters_general#complex-links)_  
 ```
res = `gpac -i source probe`
```

Count all AC3 audio streams in a source - _see [filter](probe),  [doc](filters_general#complex-links)_  
 ```
res = `gpac -i source @#CodecID=ac3 probe`
```

# Dumping and decoding 

Extract AVC track, potentially transcoding - _see [filter](writegen)_  
```
gpac -i source -o dst.264
```

Extract AVC track if any - _see [filter](writegen)_  
```
gpac -i source @#CodecID=avc -o dst.264
```

Extract AAC track - _see [filter](writegen)_  
```
gpac -i source -o dst.aac
```

Decode audio track to 16 bit pcm - _see [filter](writegen)_  
```
gpac -i source -o dst.wav
```

Decode video track to YUV 420 - _see [filter](writegen)_  
```
gpac -i source -o dst_$Width_$Height$.yuv
```

Decode video track starting from frame 2s for 1s to YUV 420 - _see [filter](writegen)_  
```
gpac -i source -o dst_$Width_$Height$.yuv:start=2:dur=1
```

Dump video track key frames to PNG _see [filter](reframer)_  
```
gpac -i source reframer:saps=1 -o dump/$num$.png
```

Extract all tracks - _see [filter](writegen)_  
```
gpac -i source reframer -o dump_$ID$:dynext
```

Extract all audio tracks - _see [doc](filters_general#complex-links)_  
```
gpac -i source reframer @#audio -o dump_$ID$:dynext
```

Extract all AAC audio tracks - _see [doc](filters_general#complex-links)_  
```
gpac -i source reframer @#CodecID=aac -o dump_$ID$:dynext
```

# Multiplexing {: data-level="beginner" }

Mux sources to MP4 - _see [filter](mp4mx)_  
```
gpac -i source -i source2 -o dst.mp4
```

Mux sources to MP4 specifying language - _see [doc](filters_general#assigning-pid-properties)_  
```
gpac -i source -i source2:#Language=fr -o dst.mp4
```

Mux sources to fMP4 - _see [filter](mp4mx)_  
```
gpac -i source -i source2 -o dst.mp4:frag
```

Force remultiplexing an MP4 (all syntaxes are equivalent) - _see [filter](mp4mx)_  
```
gpac -i source.mp4 reframer -o dst.mp4
gpac -i source.mp4 -o dst.mp4:remux
gpac -i source.mp4 -o dst.mp4:store=inter
gpac -i source.mp4 -o dst.mp4:inter
```

Mux sources to single program MPEG-2 TS - _see [filter](m2tsmx)_  
```
gpac -i source -i source2 -o dst.ts
```

Mux sources to MPEG-2 TS, specifying service ID - _see [filter](m2tsmx)_  
```
gpac -i source:#ServiceID=1 -i source2:#ServiceID=2 -o dst.ts
```

Mux sources to MPEG-2 TS with a target mux rate - _see [filter](m2tsmx)_  
```
gpac -i source:#ServiceID=1 -i source2:#ServiceID=2 -o dst.ts:rate=10m
```

Mux sources to MKV (for builds with FFmpeg support) - _see [filter](ffmx)_  
```
gpac -i source -o dst.mkv
```

# Remultiplexing {: data-level="beginner" }

Remux sources to MP4 forcing bitstream reparsing (all syntaxes are equivalent)  
```
gpac -i source unframer -o dst.mp4
MP4Box -add source:unframer -new dst.mp4
```


# Encoding {: data-level="beginner" }

Encode an MP3 to an AAC file at 100 kbps - _see [filter](ffenc)_  
```
gpac -i source.mp3 -o dst.aac:b=100k
```

Encode an MP3 to AAC in MP4 file at 100 kbps - _see [filter](ffenc)_  
```
gpac -i source.mp3 enc:c=aac:b=100k -o dst.mp4
```

Transcode to AAC at 100 kbps and AVC at 1m, intra every 2s - _see [filter](ffenc)_  
```
gpac -i source enc:c=aac:b=100k:FID=1 enc:c=avc:b=1m:fintra=2:FID=2 -o dst.mp4:SID=1,2
```

Rescale video and encode to AVC at 1m, leaving other streams if any unmodified - _see [filter](ffenc)_  
```
gpac -i source ffsws:osize=320x240 enc:c=avc:b=1m -o dst.mp4
```

Rescale YUV video and encode to AVC at 1m - _see [filter](ffenc)_  
```
gpac -i source.yuv:size=1280x720 ffsws:osize=320x240 enc:c=avc:b=1m -o dst.mp4
```

Resample audio to 48khz - _see [filter](ffenc)_  
```
gpac -i source resample:sr=48k -o dump.pcm
gpac -i source.pcm:sr=44100:ch=1 resample:sr=48k -o dump.pcm
```

Setting FFmpeg and x264 options - _see [filter](ffenc)_  
```
gpac -i vid.mp4 enc:c=avc:b=2m:fintra=2:vprofile=baseline:preset=ultrafast:tune=zerolatency::x264-params=no-mbtree:sliced-threads:sync-lookahead=0 -o dst.mp4
```

Transcode to AVC 1mbps and aac 128k while monitoring video output and filter stats- _see [filter](ffenc)_  
```
gpac -i source enc:c=avc:b=1m enc:c=aac:b=128k -o dst.mp4 vout:vsync=0 -r
```

Downscale and transcode to AVC 1mbps and aac 128k while monitoring video output - _see [filter](ffenc)_  
```
gpac -i source ffsws:osize=256x144 enc:c=avc:b=1m enc:c=aac:b=128k -o dst.mp4 vout:vsync=0
```

Use two-pass encoding with FFmpeg (libx264 only for GPAC 2.0, all codecs for higher versions) - _see [filter](ffenc)_  
```
#first pass
gpac -i source enc:c=avc:b=3m:pass1 -o null
#second pass
gpac -i source enc:c=avc:b=3m:pass2 -o dst.mp4
```


# Rescaling 

rescale without respecting aspect ratio
```
gpac -i source1.mp4 ffsws:osize=512x512 vout
```

rescale respecting aspect ratio and pad color to red
```
gpac -i source1.mp4 ffsws:osize=512x512:keepar=full:padclr=red vout
```

rescale without respecting aspect ratio nut set output aspect ratio, output video will be 340x512 (`340=510*2/3` )
```
gpac -i source1.mp4 ffsws:osize=510x512:osr=3/2 vout
```


# Encryption 

Encrypt and dash several sources using a single drm configuration - _see [filter](cecrypt)_  
```
gpac -i source1.mp4 -i source2.aac cecrypt:cfile=drm.xml -o live.mpd
```

Encrypt and dash several sources using one drm configuration per source - _see [filter](cecrypt)_  
```
gpac -i source1.mp4:#CryptInfo=drm1.xml -i source2.aac:#CryptInfo=drm1.xml cecrypt -o live.mpd
```

perform pre-dashing before encryption for key roll at segment boundaries - _see [filter](cecrypt)_  
```
gpac -i source.mp4 dasher:gencues cecrypt:cfile=roll_seg.xml -o live.mpd
```


# Piping and sockets 

Grab a  compressed stream (e.g. AVC|H264) from stdin, remove all non I-frames and non-video PIDs and output as raw 264 over stdout - _see  [filter](fout)   [howto](pipes)_  
```
gpac -i - @#video reframer:saps=1 -o stdout:ext=264
```

Grab a raw stream (e.g. YUV420) from stdin  and output as raw 264 over stdout - _see  [filter](fout)   [howto](pipes)_  
```
gpac -i stdin:ext=yuv:size=1280x720 -o stdout:ext=264
```


Grab a TS UDP stream and remux as fragmented mp4 over a named pipe - _see  [filter](pout)   [howto](pipes)_   
```
gpac -i udp://234.0.0.1:1234 -o pipe://mypipe:ext=mp4:mkp:frag
```

Mux source to real-time M2TS UDP multicast stream - _see  [filter](m2tsmx)   [howto](sockets)_   
```
gpac -i source.mp4 -o udp://234.0.0.1:1234/:ext=ts:realtime
```


# DASH and HLS generation
See Howtos [DASH](DASH-intro),  [DASH Low Latency](LL-DASH) and [dasher](dasher) filter.

Generating a live profile, static MPD  
```
gpac -i source.mp4 -i source2.mp4  -o dash/live.mpd
```

Generating a onDemand profile, static MPD from a source  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.mpd:profile=onDemand
```

Generating a HLS with one file per segment  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.m3u8
```
 
Generating a HLS with single file from a source  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.m3u8:sfile
```

Generating a HLS and MPD with one file per segment  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.mpd:dual
```
 
Generating a HLS with single file and MPD from a source  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.mpd:dual:profile=onDemand
```

Generating a live profile, dynamic offering  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.mpd:dmode=dynamic
```

Generating a live profile, dynamic offering with time regulation at each segment  
```
gpac -i source.mp4 -i source2.mp4 -o dash/live.mpd:dmode=dynamic:sreg
```

Generating a live profile, low-latency, dynamic offering with time regulation at each frame  
```
gpac -i source.mp4 -i source2.mp4 reframer:rt=on -o dash/live.mpd:dmode=dynamic:segdur=1:cdur=0.1
```

Generating a live profile, low-latency, dynamic offering with time regulation at each frame and offering it as HTTP, with 1h timeshift  
```
gpac -i source.mp4 -i source2.mp4 reframer:rt=on -o http://127.0.0.1:8080/live.mpd:gpac:dmode=dynamic:segdur=1:cdur=0.1:rdirs=/tmp:tsb=3600
```

Looping two sources to simulate a live over http  
```
gpac --floop=-1 flist:srcs=source.mp4 flist:srcs=source2.mp4 reframer:rt=on -o http://127.0.0.1:8080/live.mpd:gpac:dmode=dynamic:segdur=1:cdur=0.1:rdirs=/tmp:tsb=3600
```

Live UTC counter single resolution over  HTTP in low latency  
```
gpac avgen enc:c=aac:b=100k:FID=1 enc:c=avc:b=2m:fintra=1:FID=2 -o http://127.0.0.1:8080/live.mpd:gpac:SID=1,2:dmode=dynamic:segdur=1:cdur=0.1:rdirs=/tmp
```

Live UTC counter 2 resolutions over  HTTP in low latency  
```
gpac avgen:sizes=1280x720,1920x1080:rates=2M,5M enc:c=aac:b=100k:FID=1 enc:c=avc:fintra=1:FID=2 -o http://127.0.0.1:8080/live.mpd:gpac:SID=1,2:dmode=dynamic:segdur=1:cdur=0.1:rdirs=/tmp
```

Generate trick mode from source1 and use both source1 A+V, source2 V and trick mode in dash:
```
gpac -i source1.mp4 @#video reframer:saps=1 -i source2.mp4 @#video @1 @@ -o dash/live.mpd
```

Insert custom DASH tags in manifest:
```
gpac -i source:#RDesc=<rep_desc>bar</rep_desc>:#ASCDesc=<as_desc>bar</as_desc>:#PDesc=<p_desc>bar</p_desc> -o manifest.mpd
```

Insert custom HLS tags in manifest (global tags use `hlsx` option and per-PID tags use `HLSMExt` property) and variant playlists (`HLSVExt` PID property):
```
gpac -i source::#HLSMExt=vfoo,vbar=video::#HLSVExt=#fooVideo,#bar1=optVideo -i source2::#HLSMExt=afoo,abar=audio-en::#HLSVExt=#fooAudio,#bar1=optAudio -o manifest.m3u8::hlsx=#SomeExt,#SomeOtherExt=true
```


# Time modification 

_Note: If the source is an MP4 file, it is much simpler/faster to perform these operations using MP4Box_

Add 200 ms delay to audio (audio later than other streams)  - _see [filter](restamp)_  
```
gpac -i source restamp:delay_a=2/10 -o dst
```

Add -1s delay to audio (audio earlier than other streams)  - _see [filter](restamp)_  
```
gpac -i source restamp:delay_a=-1 -o dst
```

Speedup all tracks except audio by 10% (speed 1.1) - _see [filter](restamp)_  
```
gpac -i source restamp:fps=-11/10 -o dst
```

Change video FPS to 29.97 with frame cloning - _see [filter](restamp)_  
```
gpac -i source restamp:fps=30000/1001:rawv=force -o dst
```


# Source splitting {: data-level="beginner" }

Extract from 1min to 2min30s - _see [filter](restamp)_  
```
gpac -i source reframer:xs=T00:01:00:xe=T00:02:30 -o dst
```


Extract from 1min to 2min30s after decoding (sample-accurate audio) - _see [filter](restamp)_  
```
gpac -i source reframer:raw=av::xs=T00:01:00:xe=T00:02:30 -o dst
```


Extract from 1min to 2min30s and 5min20s to 6min - _see [filter](restamp)_  
```
gpac -i source reframer:xs=T00:01:00,T00:05:20:xe=T00:02:30,T00:06:00 -o dst
```

Extract from 5min20s to end - _see [filter](restamp)_  
```
gpac -i source reframer:xs=T00:05:20 -o dst
```

Extract from 1min to 2min30s and 5min20s to end - _see [filter](restamp)_  
```
gpac -i source reframer:xs=T00:01:00,T00:05:20:xe=T00:02:30 -o dst
```


# Playlists and source concatenation {: data-level="beginner" }

Loop file forever playback  - _see [filter](flist)_  
```
gpac flist:srcs=source.mp4:floop=-1 aout vout
```

Read all PNGs from a directory, sorting by creation date  - _see [filter](flist)_  
```
gpac flist:srcs=src/*.png:fsort=date vout
```

Resize a set of videos with aspect ratio respected  - _see [filter](ffsws)_  
```
gpac flist:srcs=1.mp4,2.mp4,3.mp4 ffsws:osize=1280x720:keepar=full c=avc -o dst.mp4
```

Concatenate all MP4 from directory `dir`:
```
gpac flist:srcs=*.mp4 vout

#same as above but through a playlist
ls *.mp4 > pl.m3u
gpac -i pl.m3u vout
```

# Playback { : data-level="beginner" }

Basic playback  - _see [howto](filters-playback)_  
```
gpac -play source
```

Video only playback  - _see [howto](filters-playback)_  
```
gpac -i source vout
```

Video only playback, no sync  - _see [howto](filters-playback)_  
```
gpac -i source vout:sync=0
```

Audio only playback  - _see [howto](filters-playback)_  
```
gpac -i source aout
```

Single-threaded GUI playback  - _see [howto](filters-playback)_  
```
gpac compositor:player=gui:src=source
gpac -threads=0 -gui source
```

Single-threaded compositor playback (available as alias `-mp4c`)  - _see [howto](filters-playback)_  
```
gpac compositor:player=base:src=source
gpac -threads=0 -mp4c source
```

__NOTE__ The `-mp4c` and `-gui` aliases will by default set `-threads=2`.

# Thumbnails

Create thumbnails based on key frames in source, with at least 30 seconds between frames and dynamic thumbnail height
```
gpac -i src reframer:saps=1 thumbs:snap=30 -o dump_$num$.png
```

Create thumbnails based on key frames in source, with at least 30 seconds between frames in a 6x6 layout with 5x downscale and json generation
```
gpac -i src reframer:saps=1 thumbs:snap=30:grid=6x6:list=thumbs.json:scale=5 -o dump_$num$.png
```

Create thumbnails of scene cuts based on key frames in source
```
gpac -i src reframer:saps=1 thumbs:snap=0:mae=15 -o dump_$num$.png
```

Use thumbnailer to overlay frame time over video
```
gpac -i src thumbs:grid=1x1:txt='$time$' vout
```


# Filter Blacklist

Decode source disabling hardware decoders:
```
gpac -blacklist=vtbdec,nvdec source vout
```

Decode source MP4 enabling only the minimum filters:
```
gpac -blacklist=-fin,mp4dmx,ffdec,vout source.mp4 vout
```

# FFmpeg support 

Set gpac as RTMP output server  
```
gpac -i src.mp4 -o rtmp://127.0.0.1:8888/live:gpac:ffmt=flv:rtmp_listen=1
```

Read from RTMP server  
```
gpac -i rtmp://127.0.0.1:8888/live vout aout
```

Set gpac as RTMP input server, and use another instance to push 
```
gpac -i rtmp://127.0.0.1:8888/live:gpac:rtmp_listen=1 vout aout
gpac -i src.mp4 -o rtmp://127.0.0.1:8888/live:gpac:ffmt=flv
```


Read audio and video from device  
```
gpac -i av:// vout aout
```

Read video from device  
```
gpac -i video:// vout
```

Read audio from device  
```
gpac -i audio:// aout
```

read from screen on OSX  
```
gpac -i video://:fmt=avfoundation:dev=screen0 vout
```

read from screen on Linux
```
gpac -i video://:fmt=x11grab:dev=:0.0 vout
```

Read audio after filter from libavfilter (compressor here)  
```
gpac -i audio.mp4 ffavf:afmt=s16:sr=44100::f=acompressor aout
```

Read video after filter from libavfilter (negate here)  
```
gpac -i video.mp4 ffavf::f=negate vout
```

Use audio to video filter from libavfilter (showspectrum here)  
```
gpac -i audio.mp4 ffavf:pfmt=yuv::f=showspectrum=size=320x320 aout vout
```

Use 2 video to video filter from libavfilter (overlay here)
```
gpac -i video1.mp4:#ffid=a -i video2.mp4:#ffid=b ffavf:pfmt=yuv::f=[a][b]overlay=main_w-overlay_w-10:main_h-overlay_h-10 vout
```

Compute PSNR
```
gpac -i video.mp4:#ffid=dist -i ref.mp4:#ffid=ref ffavf::'f=[dist][ref]psnr=f=psnr.log' -o null
```

Compute SSIM
```
gpac -i video.mp4:#ffid=dist -i ref.mp4:#ffid=ref ffavf::'f=[dist][ref]ssim=f=ssim.log' -o null
```


Compute PSNR and SSIM
```
gpac -i video.mp4:#ffid=dist -i ref.mp4:#ffid=ref \
	@@ @@1 ffavf::'f=[dist][ref]psnr=f=psnr2.log' @ -o null \
	@@ @@1 ffavf::f='[dist][ref]ssim=f=ssim2.log' @ -o null
```

SRT session from local file (requires FFmpeg with SRT support)
```
#player listening for SRT handshake
gpac -play srt://127.0.0.1:1234:gpac:mode=listener
#streamer with real-time regulation
gpac -i video.mp4 reframer:rt=on -o srt://127.0.0.1:1234:gpac:ffmt=mpegts
```

SRT session from avgen filter (requires FFmpeg with SRT support)
```
#player listening for SRT handshake
gpac -play srt://127.0.0.1:1234:gpac:mode=listener
#streamer with real-time regulation
gpac avgen reframer:rt=on c=avc c=aac -o srt://127.0.0.1:1234:gpac:ffmt=mpegts
```



# Graphics

All examples give the content of the JSON playlist (named `mix.json` here) - _see [filter](avmix), [howto](avmix_tuto)_  
The result can be viewed using `gpac avmix:pl=mix.json vout` (live mode) or `gpac avmix:live=0:pl=mix.json vout` (offline mode).

Insert text over video:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source.mp4"}] } ] },
{"sources": ["seq1"]},
{"x": 0, "y": -45, "width": 100, "height": 10, "text": ["Some nice text !"], "size": 60, "fill": "black", "line_width": -2, "line_color": "white"}
]
```

Insert last two lines of `text.txt` over video:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source.mp4"}] } ] },
{"sources": ["seq1"]},
{"x": 0, "y": -40, "width": 100, "height": 10, "text": ["text.txt", 2], "size": 60, "fill": "black", "line_width": -2, "line_color": "white"}
]
```


Mix two videos with blending:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{"sources": ["seq1", "seq2"], "mix": { "type": "mix"}, "mix_ratio": 0.5 }
]
```

Side by side videos:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source1.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{"sources": ["seq1"], "x": -25, "y": 0, "width": 50, "height": 100, "volume":0},
{"sources": ["seq2"], "x": 25, "y": 0, "width": 50, "height": 100, "volume":0}
]
```


Picture in picture video with alpha (source2 can be a video or an image) :
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source1.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{"sources": ["seq1"]},
{"sources": ["seq2"], "x": 35, "y": 35, "width": 20, "height": 20, "alpha":0.5}
]
```

Picture in picture video with shape and alpha:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source1.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{"sources": ["seq1"]},
{"sources": ["seq2"], "x": 35, "y": 35, "width": 20, "height": 20, "alpha":0.5, "shape": "ellipse", "line_width":2, "line_color":"cyan"}
]
```

Picture in picture video with alpha and rotation along Y axis (perspective texture mapping):
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source1.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{"sources": ["seq1"]},
{"sources": ["seq2"], "x": 35, "y": 35, "width": 20, "height": 20, "alpha":0.5, "rotation": "-30", "axis":[0,1,0]}
]
```

Moving picture in picture video with animated alpha:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source1.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{"sources": ["seq1"]},
{"id": "pip" "sources": ["seq2"], "x": 35, "y": 35, "width": 20, "height": 20, "alpha":0.5},
{"start": 0, "loop": true, "dur": 8, "keys": [0, 0.25, 0.5, 0.75, 1], "anims": [
    {"values": [35, -35, -35, 35, 35], "targets": ["pip@x"]},
    {"values": [35, 35, -35, -35, 35], "targets": ["pip@y"]},
    {"values": [1, 0, 1, 0, 1], "targets": ["logo@alpha"]}
 ]
}
]
```

Mix two videos with animated slide effect:
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source.mp4"}] } ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "source2.mp4"}] } ] },
{ "id": "scene", "sources": ["seq1", "seq2"], "mix": { "type": "swipe"}, "mix_ratio": 0.5 },
{"start": 0, "loop": true, "dur": 4, "keys": [0, 0.5, 1], "anims": [
    {"values": [1, 0, 1], "targets": ["scene@mix_ratio"]}
 ]
}
]
```

Fractal-like animated video reuse
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "source.mp4"}] } ] },
{ "id": "gr1", "scenes": [
	{"sources": ["seq1"]},
    {"id":"use", "use": "gr1", "rotation": 10, "hscale": 0.9, "vscale": 0.9, "use_depth": 10}
]
},
{ "start": 0, "loop": true, "dur": 2, "keys": [0, 0.5, 1], "anims": [
    {"values": [0, 20, 0], "targets": ["use@use_depth"]}
 ]
}
]
```