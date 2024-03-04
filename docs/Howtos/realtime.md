# Overview

We discuss here how to simulate real-time sources in GPAC.  


# Introduction

Assume you have one or several sources dispatching data in a non real-time fashion, such as a local file, an HTTP download or a pipe input. You may want to produce data in real-time, for DASH, HLS, MPEG-2 TS or HTTP delivery. 
GPAC comes with the [reframer](reframer) filter, in charge of forcing a de-multiplexing of input data. This filter supports several features including:

- discarding frames based on their SAP type (e.g. build a stream containing only I-frames of the input stream)
- force decoding of media data
- and real-time regulation

## Foreword

The reframer usually produces output PIDs with the same configuration as input PIDs. This means that you must take care of graph connection when setting up your filter chain.
This is true for GPAC prior to 2.0 or when using complete mode linking [-cl](gpac_general#cl), see [linking documentation](filters_general#filter-linking-link).
```
gpac [-cl] -i source.mp4 reframer -o dest.mp4 -graph
```
In this example, the `source.mp4` input will produce a PID of type `FILE`, which will be directly connected to the `dest.mp4` output, and the reframer will simply not be connected:

```
Filters connected:
fin (src=source.mp4) (0x7f87e640c360)
-(PID source.mp4) fout (dst=dest.mp4) (0x7f87e640cc20)
Filters not connected:
reframer (0x7f87e640c640)
```

Before GPAC 2.0 you needed to specify a link between reframer and output, so that the output does not accept PIDs coming directly from the source:

```
gpac [-cl] -i source.mp4 reframer @ -o dest.mp4 -graph
gpac [-cl] -i source.mp4 reframer:FID=1 -o dest.mp4:SID=1 -graph
```


This is no longer needed for implicit linking mode (default one) of GPAC 2.0:
```
gpac -i source.mp4 reframer -o dest.mp4 -graph
```

The graph is now properly loaded:
```
Filters connected:
fin (src=source.mp4) (0x7f9662509340)
-(PID source.mp4) mp4dmx (0x7f966250ac00)
--(PID PID1) reframer (_0x7f9662509620_)
---(PID PID1) mp4mx (0x7f9662406860)
----(PID PID1) fout (dst=dest.mp4) (0x7f9662509bd0)
```


The reframer real-time mode is enabled by the [rt](reframer#rt) option.

## Simple regulation
In this example, we regulate the session with independent real-time clocks for each of the PIDs handled by the reframer:

```
gpac -i source.mp4 reframer:rt=on -o dest.mp4
```

The PIDs do not share any time base: the first frame of each PID will be dispatched as soon as received, and the subsequent ones after the previous frame duration.

## Sync regulation
In this example, we regulate the session with a single real-time clock for all PIDs handled by the reframer:

```
gpac -i source.mp4 reframer:rt=sync -o dest.mp4
```

The PIDs share a single time base: the first frame of each PID will be first be probed, the first frame with the earliest time will be dispatched as soon as received, and all other frames will be delivered according to their timestamp and the system clock at first dispatched frame.

# Use Cases

## DASH Low Latency example
In this example, we use a local source to generate a low-latency DASH session. Since in low-latency mode, a segment is divided in several subsegments (e.g. CMAF chunks), not using a real-time regulation would produce all these subsegments way too early. Injecting the reframer allows the subsegments to be dispatched only when the last frame of the subsegment is produced.

```
gpac -i source.mp4 reframer:rt=sync -o live.mpd:dur=2:cdur=0.1:dmode=dynamic:profile=live
```

If we now want to simulate a forever running session, we just need to change the source to use the [file list](flist) filter:

```
gpac flist:srcs=source.mp4:floop=-1 reframer:rt=sync -o live.mpd:dur=2:cdur=0.1:dmode=dynamic:profile=live
```

## Icecast-like server
In this example, we use a local playlist to generate an icecast server. If we don't inject a real-time regulation, the server will:

- drop all packets way too fast when no client is connected
- send all packets way too fast when clients are connected

```
gpac -i playlist.m3u:floop=-1 reframer:rt=on -o http://localhost:8080/
```

Note that in this example we loop the playlist, but as discussed [here](flist#playlist-mode), we could also override the playlist with new content on regular basis.


# When Real-time reframer is NOT needed

Some output formats may perform their own real-time regulation, without needing the [reframer](reframer) filter: 
- [RTP](rtpout) and [RTSP](rtspout) always stream in real-time.
- [MPEG-2 TS multiplexer](m2tsmx) will perform real-time regulation when invoked with [realtime](m2tsmx#realtime) option.
- [DASHing](dasher) in [dynamic mode](dasher#dmode) [sreg](dasher#sreg) option set will perform regulation of segments, so no reframer is needed if you don't want low latency DASH.
- [socket](sockout) output may regulate its throughput using the [rate](sockout#rate) option.

