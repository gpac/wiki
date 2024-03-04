# Overview

We discuss here how to use the [inspect](inspect) filter to get information on sources in GPAC.  


# Media Streams inspection
 
```
gpac -i source.mp4 inspect
```

The above command will open the given `source.mp4` file and print information for each PID found in the source to stdout. Once all PIDs are found (that is, once a packet is delivered on each PID), inspection will stop.

```
gpac -i source.mp4 inspect:full
```

This is the same as previous command but with complete PID properties report.

```gpac -i source.ts inspect:log=stderr:allp```

The above command will open the given `source.ts` file and print properties of each PID found in the source to stderr. It will analyse the entire file, so that if a PID configuration change happens in the source, it will be reported.


__Discussion__  
As usual with ```gpac```, any source can be used, and any number of sources can also be used with the inspect filter.

```
gpac -i source1.h264 -i source2.aac inspect
```

And any filter chain can be inspected. For example, the following inspects the decoded output of a source: 
```
gpac -i source1.h264 reframer:raw inspect
```


# Packet inspection

```
gpac -i source.mp4 inspect:deep
```

The above command will open the given `source.mp4` file and print properties of each PID found in the source and properties of each packet of each PID. There is no guarantee of the order of packets, depending on source type, scheduling modes, etc.   

To force separate reporting per PID, use

```
gpac -i source.mp4 inspect:deep:interleave=false
```


The start and duration of the inspection can be modified:

```
gpac -i source.mp4 inspect:deep:start=10:dur=1
```
This will force inspecting from start time 10 second (or previous access point) for 1 second.

# Filtering the inspection

There are many cases where all the information of each packet is not really useful to understand a file. You can filter the packet properties you want to dump using the [fmt](inspect#fmt) option. 
```
gpac -i source.mp4 inspect:interleave=false:fmt=%num%-%dts%-%cts%-%sap%-%size%%lf%:log=dump.txt
```

The above command will open the given `source.mp4` file and print properties of each PID found in the source and for each packet, will report its number, dts, cts, RAP/SAP type and size, one packet per line:
```
1-0-0-1-200
2-1-1-0-10
...
```

The full list of options for the packet information log is given in the [inspect](inspect) filter help.

```
gpac -i source.mp4 inspect:interleave=false:fmt="PCK%num% DTS=%dts% CTS=%cts% SAP=%sap% size=%size%%lf%":log=dump.txt
```
This is the same as above with some nicer formatting of the output:
```
PCK1 DTS=0 CTS=0 SAP=1 size=200
PCK2 DTS=1 CTS=1 SAP=0 size=10
...
```


# Analysing a source

It is possible to use the filter to produce a detailed trace of the media frames, in XML:
```
gpac -i source.mp4 inspect:interleave=false:analyze=on
gpac -i source.mp4 inspect:interleave=false:deep:analyze=on
```

The above command will open the given `source.mp4` file and create an XML dump of all PID media-specific info and all packets media-specific info if [deep](inspect#deep) is set. 

The analyze mode will check the payload of the decoder configuration (parameter sets)  and the payload of each packet. Supported bitstream formats for analysis are:

- AVC, HEVC, VVC video
- AV1
- VP8,VP9
- MPEG1/2/4 video
- ProRes video
- MPEG1/2 audio
- AC3 / EAC3 audio
- MPEG4 AAC and USAC audio: configuration only
- Timecodes tracks and some subtitles (XML, text)


Using the mode `analyse=bs` will give, for supported media types, the fields read from the bitstream, and  `analyse=full` will also give the number of bits for each field.

This is still a work in progress, more media types need to be added and deeper analysis of the packets should be done (for now only the slice headers are parsed).

This should however help you check consistency of systems layer information (timing, SAP, dependency information) with frame properties.
