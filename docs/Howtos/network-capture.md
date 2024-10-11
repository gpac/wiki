---
tags:
- mpd
- reframer
- data
- filter
- session
- packet
- dump
- media
- isobmff
- option
- mp4
- source
- packets
- chain
- input
- isomedia
- output
- sink
- dash
---



# Overview {: data-level="all" }

We discuss here how to use network captures with GPAC 2.3-DEV or above.



GPAC can:

- write packets to a custom file format called GPC (GPAC Packet Capture), and
- read packets from pcap, pcapng and gpc files.

GPAC uses a concept of network capture rules identified by ID. This allows having a set of filters in GPAC use one capture file while other filters will use either no capture file or another capture file.

Network capture rules are defined using the [-netcap](core_options#netcap) option. 


# Creating network captures

When creating a network capture with GPAC, output packets are NOT sent over the network, they are only written to file. 
Use Wireshark if you need to both send and record packets.


To record UDP output in TS format, use:
 
```
gpac -i source.mp4 reframer:rt=on -o udp://234.0.0.1:1234/:ext=ts -netcap=dst=cap_ts.gpc
```

To record RTP output, use:
 
```
gpac -i source.mp4 reframer:rt=on -o session.sdp -netcap=dst=cap_rtp.gpc
```

To record ROUTE output, use:
 
```
gpac -i source.mp4 reframer:rt=on -o route://234.1.1.1:1234/live.mpd:dynamic -netcap=dst=cap_route.gpc
```

You can also use Wireshark to capture packets.


# Playing network captures

To replay a capture file (from the above examples), use: 

```
gpac -i udp://234.0.0.1:1234/ inspect:deep -netcap=src=cap_ts.gpc

gpac -i session.sdp inspect:deep -netcap=src=cap_rtp.gpc

gpac -i route://234.1.1.1:1234/live.mpd inspect:deep -netcap=src=cap_route.gpc
```

By default, the packets from a capture file are made available to the app in real-time. You can disable this using `nrt` flag:

```
gpac -i session.sdp inspect:deep -netcap=src=cap_rtp.gpc,nrt

```

_NOTE_  Using `nrt` will likely require much more memory when consuming the data in real-time (e.g. playback).


# Assigning network captures to filters

If you need one filter to read from a capture file and others to not use a capture file, you will need to set an ID to the network capture rules and tag the filters to use this ID.

For example, playing a route capture and exposing the resulting files to a real HTTP server filter:

```
gpac -i route://234.1.1.1:1234/live.mpd:gcache=false:NCID=RTE -netcap=id=RTE,src=route.gpc httpout:port=8080:rdirs=./dash

```


# Stress-testing

You can also add rules for packet dropping or modifications, in order to simulate errors in the transmission chain or to test GPAC demux reliability.

This can be done using a capture file or using the device network interface(s). The assignment to filters using `NCID` also works when not using a capture file:


```
gpac -i session.sdp inspect:deep -netcap=src=cap_rtp.gpc,nrt[s=10]

```

This will drop the 10th UDP packet of the capture file, read in non-realtime mode:

```
gpac -i session.sdp inspect:deep -netcap=[f=100]

```

This will drop the first packet every 100 packets coming from the network interface.


