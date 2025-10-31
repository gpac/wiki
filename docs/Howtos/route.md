---
tags:
- option
- mpd
- multicast
- session
- source
- input
- media
- data
- stream
- output
- filter
- dash
- dump
- broadcast
- latency
---



# Introduction {: data-level="all"}

GPAC supports both sending and receiving files over unidirectional transport using the following protocols:
- [ROUTE](https://www.rfc-editor.org/rfc/rfc9223) (Real-time Object delivery over Unidirectional Transport), and
- [FLUTE](https://tools.ietf.org/html/rfc6726) (File Delivery over Unidirectional Transport) (added in GPAC 2.5-DEV).

In the media field ROUTE and FLUTE are typically used for the broadcast/multicast delivery of OTT content. It is often referred as multicast ABR (Adaptive Bit Rate) or M-ABR.

GPAC offers a unified input/output interface for these protocols and their industry profiles to make your life easy:
- ```route://```
- ```mabr://```
- ```atsc://```

# Technical overview

These protocols allow to broadcast local file systems requiring live updates. They are useful to transport a [DASH](https://github.com/gpac/gpac/wiki/DASH-Introduction) session over any physical layers (e.g. broadcast (ATSC, DVB, ...), broadband (IP), or hybrid broadcast-broadband). Historically ROUTE inherits from FLUTE (which was updated since then to support missing features such as low latency).

## Client

Receiving ROUTE or FLUTE implies downloading the files described in the "session". This is done using the [GPAC cache](routein#gcache). GPAC allows processing this input like any input in GPAC. This includes (but is not limited to) downloading the files on disk or exposing them through the GPAC embedded HTTP server. See examples below.

## Server

Sending ROUTE means starting a ROUTE server. This server listens for input data that it will broadcast. The server exposes the data using the ROUTE or FLUTE protocol. See examples below.

## Gateway

The behaviour of re-exposing the data using another protocol is commonly named "Gateway". GPAC allows to create MABR to ABR gateways, for example exposing a DASH session embedded in FLUTE via HTTP. See examples below.

## Specifications

The GPAC ROUTE implementation has been tested with both DASH and HLS sessions. The versions of the protocols used for the implementation are [ATSC/A331 2017](https://www.atsc.org/wp-content/uploads/2017/12/A331-2017-Signaling-Deivery-Sync-FEC-3.pdf) and [2019](https://www.atsc.org/wp-content/uploads/2017/12/A331-2019-Signaling-Deivery-Sync-FEC-2.pdf). Both the Korean and US flavours of ATSC3 ROUTE are supported (both addressed with ```atsc://```), as well as a generic ROUTE implementation (addressed with ```route://```).

The GPAC FLUTE session has been tested in the scope of [DVB-MABR v1.2.1](https://dvb.org/?standard=adaptive-media-streaming-over-ip-multicast) with DASH only. The associated protocol is ```mabr://```.

As usual your [feedback](https://github.com/gpac/gpac/issues) is highly appreciated.

# Hands-on

## Setup a ROUTE server

### Parameters

First you need an input content. This can be any input supported by GPAC e.g. a file or a live URL, and you most likely want an adaptive streaming source (DASH, HLS).

Let's consider the ```https://akamaibroadcasteruseast.akamaized.net/cmaf/live/657078/akasource/out.mpd``` URL as an example.

PS: you can also use GPAC: ```gpac avgen c=aac c=avc -o http://localhost:9000/dash.mpd:dynamic:profile=live:rdirs=gmem:max_cache_segs=31```

You also need a pair of IP address and UDP port. Let's consider ```225.1.1.0:6000``` as an example.

### Starting the server

```
gpac -i https://akamaibroadcasteruseast.akamaized.net/cmaf/live/657078/akasource/out.mpd dashin:forward=file -o route://225.1.1.0:6000
```

_Note_
If your session is ATSC-compliant, replace ```route://``` by ```atsc://```. Additional options are available in this mode, in particular multiple services and US versus Korean flavour, as [described here](routeout#atsc-30-mode).

If your session if FLUTE/MABR, replace ```route://``` by ```mabr://```.


### Enabling low latency

Add the ```llmode``` option:
```
gpac -i https://akamaibroadcasteruseast.akamaized.net/cmaf/live/657078/akasource/out.mpd dashin:forward=file -o route://225.1.1.0:6000:llmode
```

Technical details are [available here](routeout#low-latency-mode).

### Technical documentation

See [the route_out filter documentation](route_out) for technical details.

## Setup playback and gateway

### Local playback

To play a ROUTE/FLUTE session back, simply do:

```
gpac -play route://225.1.1.0:6000
```

See the [playback](Playback) howto for more details on content playback with GPAC.


### ROUTE/FLUTE gateway

#### Using the GPAC HTTP server

You may want to re-expose a ROUTE or FLUTE session as HTTP (typically to be played back by a third-party player), having ```gpac``` act as a gateway.

Let's consider a HTTP local server address and port at 127.0.0.1:8080:

```
gpac -i route://225.1.1.0:6000/:max_segs=4 dashin:forward=file httpout:port=8080 --rdirs=temp --reqlog=* --cors=auto
```

__Discussion__
- The [dashin](dashin) filter is required here to indicate we process the ROUTE+DASH session in file mode (no demultiplexing of content). Pushing files using [gcache=false](routein#gcache) is possible but more complex and limited to full segments only for the time being (no low-latency push).  
- The  [max_segs](routein#max_segs) option limits the number of segments kept on disk, set it to 0 to store the entire session. The number of segments stored on disk is currently NOT derived from the timeshift buffer information of the session. 



You can also re-push to any output format supported by GPAC, not only DASH/HTTP. For example sending it as an MPEG-2 Transport Stream:

```
gpac -i route://225.1.1.0:6000/ -o udp://225.1.1.10:1234/:ext=ts
```


#### Pushing to any HTTP ingest/origin

```
gpac -i route://225.1.1.0:6000 dashin:forward=file -o http://127.0.0.1:8080/live.mpd --hmode=push
```

To test locally, you can start the GPAC HTTP server as standalone, in this example enabling CORS (e.g. for DASH.js access) and logging PUT requests:
```
gpac httpout:port=8080:rdirs=$TEMP_DIR:wdir=$TEMP_DIR:reqlog=PUT:cors=auto
```

### Dumping the multicast session

To dump a ROUTE/FLUTE session to the ```dump``` folder in standalone mode:

```
gpac -i route://225.1.1.0:6000:odir=dump

```

The results will be in folder `dump/serviceN` with `N` the service ID of the session: 1 for pure ROUTE or the ATSC service ID  for  ATSC 3.0  ([details here](routein#source-mode)):


You can also forward files to receiving filters and use file templating. The following command will forward received ROUTE files to [fout](fout), writing to `ATSCN_rec/` folders, with `N`the ATSC service ID:
```
gpac -i atsc://225.1.1.0:6000:gcache=false -o ATSC$ServiceID$_rec/$File$:dynext
```

### Technical documentation

See the [routein](routein)  filter documentation for technical details.

## Troubleshooting

As this is complex technology, small changes can make a big difference in how your system behaves:

- If your session is ATSC-compliant, replace ```route://``` by ```atsc://```. If your session is FLUTE, replace ```route://``` by ```mabr://```.
- If no data is seen on the network, your system may require some [multicast routing indications](routein#interface-setup).
- You can improve logging by adding ```-logs=dash:route@info``` (or even more verbose: ```-logs=dash:route@debug```) to your command-lines.
