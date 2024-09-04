# Overview {:data-level="all"}  

For version 0.9.0, GPAC has undergone a major re-architecture of its core, the first one in 15 years!
The re-architecture was done with the following goals:

- keep [MP4Client](#mp4client-deprecated-as-of-gpac-22) and [MP4Box](MP4Box-Introduction) unchanged: old command lines will behave the same.
- keep MP4Box outputs unchanged: old command line will provide the same binary output (provided that `-old-arch` option is set).
- get rid of all duplicated functionalities in MP4Box and MP4Client (code duplication of most MP4Box importers / MP4Client input plugin).
- be generic enough so that new applications can be build directly from command line rather than developing new applications using libgpac.
- better handling of the documentation, which was not unified between MP4Client and MP4Box.

Our long history of interacting with MP4Box users has shown us that they always find unexpected ways to use MP4Box, and sometimes cannot achieve their goal only because of some hardcoded code path in GPAC.

From this observation, we decided to move to a filter-based architecture and give users the possibility to build filter chains using _any of the filters_ in GPAC: we no longer want to provide you with out-of-the box applications for a given set of tasks, but rather give you all the tools to assemble your own application.

This was a long process (almost 2 years) resulting in:

- addition of a filter-based architecture, used by MP4Client and MP4Box.
- moving all decoders and demultiplexer plugins of MP4Client and most of MP4Box import/export code as filters for this new architecture, 
- moving DASH/HLS segmenter to a filter
- moving MP4Client compositor and most of the GF_Terminal internals to a filter
- addition of a new application [gpac](gpac_general), whose only purpose is to create and run filter chains
- additions of a bunch of filters, including:
    -  __encoders__ through [FFmpeg](https://ffmpeg.org/)
    - generic pipe and socket input and output
    - raw audio and video reframers
    - HEVC tile splitting and merging filters
    
- removal of MP42TS and DashCast applications since these functionalities are provided by [gpac](gpac_general)
- deprecation of some features (widget management, MSE draft implementation for SVG media, UPnP). Some of these features might find their way back in one day. 
- profile system allowing to override through a static file default options of all filters and libgpac core
- an ad-hoc stream format called [GSF](gsfmx) to allow serialization to file, pipe or socket of a session. This allows building distributed filter chains.
- unified documentation system for MP4Client, MP4Box and gpac allowing generation from source.

The following lists the core principles of the re-architecture. Read the [general filter documentation](filters_general) for a deeper understanding of how all of this connects together. You can also have a look at the [doxygen for filters](https://doxygen.gpac.io/group__filters__grp.html#details).

# Filter Design Principles 
A filter object obeys the following principles:

- may accept (consume) any number of data stream (named `PID` in this architecture)
- may produce any number of PIDs
- can have its input PIDs reconfigured at run time or even removed
- decide when to drop input packets and create new ones, and which source packet properties to transfer to output packets
- only executed by a single thread at any time, although executing threads may change
- can be configured through options, some of which may be changed at runtime. Options are typed, using the same types as PID properties (see below) 
- carries its documentation (general help and options)
- describes possible input and output connections, using property values (see below)
- can load input filters (e.g. DASH/HLS source or playlist filters) and can load output filters (e.g. dash segmenter)
- can send and receive events up/down the filter chain

All filters in GPAC follow the same design, and there is no conceptual difference between a source, a sink, a raw audio/video filter, a demultiplexer or a multiplexer. What differs is the set of possible input(s) and/or output(s) a filter can handle.

A filter may process anything, be it a media stream, a file, a binary blob, etc. For example, GPAC unit test filters have no notion of what is a file or what is a media stream.

# Filter Session Design Principles 
The filter session main features are: 
- provide automatic link resolution between filters (based on Dijkstra)
- execute filters whenever input packets are available for a filter
- run in mono or multi-threaded mode
- use as few locks as possible, all packets exchanged being done using lock-free queues by default
- handle data packets and properties (see below) through reference counting
- recycle memory as much as possible
- real-time scheduling of filters requiring it (audio/video input/output, network input/output)
- manage blocking mode of the chain to avoid having a filter dispatching too many packets
- reconfigure filters whenever required, potentially replacing a sub-chain with another one
- handle filters capability negotiation, usually inserting a filter chain to match the desired format

The filter session operates in a semi-blocking mode:

- it prevents filters in blocking mode (output PIDs buffers full) to operate
- it will not prevent a running filter to dispatch a packet; this greatly simplifies demultiplexers writing

# PID description

A PID object (in charge of transmitting data) such as a media stream usually has a bunch of information associated such as width, height, ... Since these properties will likely differ from one media type to another, and since the PID itself might carry anything but our usual media type, this information is expressed as a set of dynamic properties assigned to a PID by the filter in charge of emitting the packets, rather than struct/class members.  

Common properties for media streams are built-in within [libgpac](filters_properties), but filters can also use custom properties, without having to modify the filter core engine.  

These properties can be used to restrict the set of possible connections, or used to generate file names based on templating mechanisms. 

These properties may also be overloaded by the user, e.g. to assign a ServiceID for MPEG-2 TS or an AdaptationSet ID for MPEG-DASH.
 

# Media Streams internal representation

In order to be able to exchange media stream data between filters, a unified data format had to be set, as follows:

- a frame is defined as a single-time block of data (Access Unit in MPEG terminology), but can be transferred in multiple packets
- frames or fragments of frames are always transferred in processing order (e.g. decoding order for MPEG video) 
- multiplexed media data is identified as `file` data, where a frame is a complete file.
- un-multiplexed media data is identified as `audio`, `video`, ... data, with a given codec identifier (including uncompressed media). 
 - if the frame payload follows the default internal format for that codec, the media stream is implicitly marked as `framed`
 - if the frame payload does not follow the default internal format for that codec, the media stream is explicitly marked as `unframed`

Consequently:
  - if `unframed` data has to be processed by a filter accepting only `framed` data (e.g. a decoder), this will require an intermediate filter to move from `unframed` to `framed`; such a filter is usually called a _reframer_ filter. Example of `unframed` data are AVC|H264 or HEVC in Annex B format (using start codes), AAC encapsulated in ADTS or LATM.  
  - if `framed` data has to be processed by a filter accepting only `unframed` data (e.g. a multiplexer or a raw stream writer), this will require an intermediate filter to move from `framed` to `unframed`; such a filter is usually called a _rewriter_ filter.

The default internal format used for frame payload usually follows the format defined for the storage of this media type in ISOBMFF, if any. Otherwise it is internally defined.  

The payload of a compressed frame __never__ contains any decoder configuration data such as AVC|H264 or HEVC parameter sets. This configuration data shall be set as a property of the PID, and will trigger reconfiguration of the filter whenever a packet with the new configuration is processed.

Packets carrying frames come with a set of built-in variables to express timing, random access, frame fragmentation, but they can also have associated properties just like PIDs. For example, NTP sampling clock of a frame or CENC subsample information are carried as properties since in many applications they will never be present.

# MP4Box
Media importers and exporters in MP4Box have been replaced by a filter session used to import to ISOBMFF multiplexer or export to a given file.  

```MP4Box -add source.avc -new test.mp4```
  
This is equivalent to  
  
```gpac -i source.avc -o test.mp4```

However, adding to an existing file will require using MP4Box.

DASH segmentation has been replaced by a filter session used to segment a given set of files.  

```MP4Box -dash 1000 -out test.mpd source1.mp4 source2.mp4```  

This is equivalent to  

```gpac -i source1.mp4 -i source2.mp4 -o test.mpd```  

Setting the dash duration to something else than the default 1 second can be done by passing it as an option of the [dasher](dasher) filter, usually passed through arguments inheriting (see [general filter documentation](filters_general)): 

```gpac -i source1.mp4 -i source2.mp4 -o test.mpd:segdur=2.5```  

__WARNING__
The dasher filter is quite different from the old segmenter and the default algorithm will likely lead to different segmentation bounds. To have the same segmentation results, use [-bound](mp4box-dash-opts#bound) or [-closest](mp4box-dash-opts#closest) options.

Encryption and decryption have been replaced by a filter session used to en/de-crypt a single file.

```
MP4Box -crypt DRM.xml source.mp4 -out protected.mp4
MP4Box -decrypt DRM.xml protected.mp4 -out unprotected.mp4
```  

This is equivalent to  

```
gpac -i source.mp4 cecrypt:cfile=DRM.xml -o protected.mp4:xps_inband=auto
gpac -i protected.mp4 cdcrypt:cfile=DRM.xml -o unprotected.mp4:xps_inband=auto
```  

File splitting has been replaced by a filter session used to split source file.

```
MP4Box -splitx 2:4 source.mp4 -out dest.mp4
```  

This is equivalent to  

```
gpac -i source.mp4 reframer:xround=closest:splitrange:xs=2:xe=4 -o dest.mp4
```  


All other functionalities of MP4Box are not available through a filter session. Some might make it one day (BIFS encoding for example), but most of them are not good candidates for filter-based processing and will only be available through MP4Box (track add/remove to existing file, image item add/remove to existing file, file hinting, ...).

__Note__ For operations using a filter session in MP4Box, it is possible to view some information about the filter session:

- -fstat: this will print the statistics per filter and per PID of the session
- -fgraph: this will print the connections between the filters in the session


# MP4Client [DEPRECATED as of GPAC 2.2]
MP4Client (and consequently the _GF_Terminal_ API) is now a wrapper to a filter session running in multi-threaded mode by default, and using the [compositor](compositor) filter as a sink filter for video. 

All avi/raw extraction functions from MP4Client have been deprecated, as they are provided by the generic filter management [gpac](gpac_general) application. e.g.:

```MP4Client -avi test.bt```

no longer works, but is now achieved using

```gpac -i test.bt compositor -o test.avi```

See [compositor filter](compositor) for options such as fps, duration, etc.

The player mode of MP4Client is still here obviously and cannot be completely emulated by the gpac application due to its handling of user events (navigation/hyperlinks, command-line interactivity etc).

# MP42TS

MP42TS has been deprecated, replaced by the generic filter management gpac application. 

For file production:

```MP42TS -src source.mp4 -dst-file test.ts```

This is now achieved using  

```gpac -i source1.mp4 -o test.ts```  


For live production:

```MP42TS -src source.mp4 -dst-udp 127.0.0.1:1234```

This is now achieved using  

```gpac -i source1.mp4 -o udp://127.0.0.1:1234/:ext=ts```  

MP42TS was limited to RTP and MP4 input. This is no longer the case with gpac, you can use any source you want to build your TS (e.g. pipes, MPD session, ...).

# DashCast

[DashCast](https://gpac.io/dashcast/) has been deprecated, replaced by the generic filter management gpac application.

For example, this will produce a dash session using a single source and two qualities/rates encoding  

```gpac -i source.avc:FID=1 ffsws:osize=512x512:SID=1 @ ffenc:c=avc:fintra=1:FID=EV1 ffsws:osize=256x256:SID=1 @ ffenc:c=avc:fintra=1:FID=EV2 -o file.mpd:profile=live:SID=EV1,EV2```

or using GPAC 2.0 implicit linking:

```gpac -i source ffsws:osize=512x512 c=avc:fintra=1 @@ ffsws:osize=256x256 c=avc:fintra=1 -o dash/file.mpd -graph```
  
You can also use a live audio/video grabber using the filter [ffavin](ffavin), or any other filter you want!

 
