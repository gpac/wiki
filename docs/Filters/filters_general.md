<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Overview  
  
Filters are configurable processing units consuming and producing data packets. These packets are carried between filters through a data channel called _PID_. A PID is in charge of allocating/tracking data packets, and passing the packets to the destination filter(s). A filter output PID may be connected to zero or more filters. This fan-out is handled internally by GPAC (no such thing as a tee filter in GPAC).  
_Note: When a PID cannot be connected to any filter, a warning is thrown and all packets dispatched on this PID will be destroyed. The session may however still run, unless [-full-link](core_options/#full-link) is set._  
    
Each output PID carries a set of properties describing the data it delivers (e.g. _width_, _height_, _codec_, ...). Properties can be built-in (see [gpac -h props](filters_properties) ), or user-defined. Each PID tracks its properties changes and triggers filter reconfiguration during packet processing. This allows the filter chain to be reconfigured at run time, potentially reloading part of the chain (e.g. unload a video decoder when switching from compressed to uncompressed sources).  
    
Each filter exposes a set of argument to configure itself, using property types and values described as strings formatted with separators. This help is given with default separator sets `:=#,@` to specify filters, properties and options. Use [-seps](gpac_general/#seps) to change them.  

# Property and filter option format  
  

- boolean: formatted as `yes`,`true`,`1` or `no`,`false`,`0`  
- enumeration (for filter arguments only): must use the syntax given in the argument description, otherwise value `0` (first in enum) is assumed.  
- 1-dimension (numbers, floats, ints...): formatted as `value[unit]`, where `unit` can be `k`,`K` (x 1000) or `m`,`M` (x 1000000) or `g`,`G` (x 1000000000) or `sec` (x 1000) or `min` (x 60000). `+I` means max float/int/uint value, `-I` min float/int/uint value.  
- fraction: formatted as `num/den` or `num-den` or `num`, in which case the denominator is 1 if `num` is an integer, or 1000000 if `num` is a floating-point value.  
- unsigned 32 bit integer: formatted as number or hexadecimal using the format `0xAABBCCDD`.  
- N-dimension (vectors): formatted as `DIM1xDIM2[xDIM3[xDIM4]]` values, without unit multiplier.  

    - For 2D integer vectors, the following resolution names can be used: `360`, `480`, `576`, `720`, `1080`, `hd`, `2k`, `2160`, `4k`, `4320`, `8k`  

- string: formatted as:  

    - `value`: copies value to string.  
    - `file@FILE`: load string from local `FILE` (opened in binary mode).  
    - `bxml@FILE`: binarize XML from local `FILE` and set property type to data - see https://wiki.gpac.io/xmlformats/NHML-Format.  

- data: formatted as:  

    - `size@address`: constant data block, not internally copied; `size` gives the size of the block, `address` the data pointer.  
    - `0xBYTESTRING`: data block specified in hexadecimal, internally copied.  
    - `file@FILE`: load data from local `FILE` (opened in binary mode).  
    - `bxml@FILE`: binarize XML from local `FILE` - see https://wiki.gpac.io/xmlformats/NHML-Format.  
    - `b64@DATA`: load data from base-64 encoded `DATA`.  
    - `FMT@val`: load values from val (comma-separated list) with `FMT` being `u8`, `s8`, `u16`, `s16`, `u32`, `s32`, `u64`, `s64`, `flt`, `dbl`, `hex` or `str`.  

- pointer: pointer address as formatted by `%p` in C.  
- string lists: formatted as `val1,val2[,...]`. Each value can also use `file@FILE` syntax.  
- integer lists: formatted as `val1,val2[,...]`  

  
_Note: The special characters in property formats (0x,/,-,+I,-I,x) cannot be configured._  
  
Numbers and fraction can be expressed as `THH:MM:SS.ms`, `TMM:SS.ms`, `THH:MM:SS` or `TMM:SS`, translated into milliseconds.  

# Filter declaration [_FILTER_]  
  
## Generic declaration  
Each filter is declared by its name, with optional filter arguments appended as a list of colon-separated `name=value` pairs. Additional syntax is provided for:  

- boolean: `value` can be omitted, defaulting to `true` (e.g. `:allt`). Using `!` before the name negates the result (e.g. `:!moof_first`)  
- enumerations: name can be omitted, e.g. `:disp=pbo` is equivalent to `:pbo`.  

  
    
When string parameters are used (e.g. URLs), it is recommended to escape the string using the keyword `gpac`.    
Example
```
filter:ARG=http://foo/bar?yes:gpac:opt=VAL
```  
This will properly extract the URL.  
Example
```
filter:ARG=http://foo/bar?yes:opt=VAL
```  
This will fail to extract it and keep `:opt=VAL` as part of the URL.  
The escape mechanism is not needed for local source, for which file existence is probed during argument parsing. It is also not needed for builtin protocol handlers (`avin://`, `video://`, `audio://`, `pipe://`)  
For schemes not using a server path, e.g. `tcp://` and `udp://`, the escape is not needed if a trailing `/` is appended after the port number.  
Example
```
-i tcp://127.0.0.1:1234:OPT
```  
This will fail to extract the URL and options.  
Example
```
-i tcp://127.0.0.1:1234/:OPT
```  
This will extract the URL and options.  
_Note: one trick to avoid the escape sequence is to declare the URLs option at the end, e.g. `f1:opt1=foo:url=http://bar`, provided you have only one URL parameter to specify on the filter._  
  
It is possible to locally disable option parsing (usefull for string options) by duplicating the separator.  
Example
```
filter::opt1=UDP://IP:PORT/:someopt=VAL::opt2=VAL2
```  
This will pass `UDP://IP:PORT/:someopt=VAL` to `opt1` without inspecting it, and `VAL2` to `opt2`.  
    

## Source and Sink filters  
Source and sink filters do not need to be addressed by the filter name, specifying `src=` or `dst=` instead is enough. You can also use the syntax `-src URL` or `-i URL` for sources and `-dst URL` or `-o URL` for destination, this allows prompt completion in shells.  
Example
```
"src=file.mp4" or "-src file.mp4" or  "-i file.mp4"
```  
This will find a filter (for example `fin`) able to load `file.mp4`. The same result can be achieved by using `fin:src=file.mp4`.  
Example
```
"dst=dump.yuv" or "-dst dump.yuv" or "-o dump.yuv"
```  
This will dump the video content in `dump.yuv`. The same result can be achieved by using `fout:dst=dump.yuv`.  
  
Specific source or sink filters may also be specified using `filterName:src=URL` or `filterName:dst=URL`.  
  
The `src=` and `dst=` syntaxes can also be used in alias for dynamic argument cloning (see `gpac -hx alias`).  
  
## Forcing specific filters  
There is a special option called `gfreg` which allows specifying preferred filters to use when handling URLs.  
Example
```
src=file.mp4:gfreg=ffdmx,ffdec
```  
This will use _ffdmx_ to read `file.mp4` and _ffdec_ to decode it.  
This can be used to test a specific filter when alternate filter chains are possible.  

## Specifying encoders and decoders  
By default filters chain will be resolved without any decoding/encoding if the destination accepts the desired format. Otherwise, decoders/encoders will be dynamically loaded to perform the conversion, unless dynamic resolution is disabled. There is a special shortcut filter name for encoders `enc` allowing to match a filter providing the desired encoding. The parameters for `enc` are:  

- c=NAME: identifies the desired codec. `NAME` can be the GPAC codec name or the encoder instance for ffmpeg/others  
- b=UINT, rate=UINT, bitrate=UINT: indicates the bitrate in bits per second  
- g=UINT, gop=UINT: indicates the GOP size in frames  
- pfmt=NAME: indicates the target pixel format name (see [properties (-h props)](filters_properties) ) of the source, if supported by codec  
- all_intra=BOOL: indicates all frames should be intra frames, if supported by codec  

  
Other options will be passed to the filter if it accepts generic argument parsing (as is the case for ffmpeg).  
The shortcut syntax `c=TYPE` (e.g. `c=aac:opts`) is also supported.  
  
Example
```
gpac -i dump.yuv:size=320x240:fps=25 enc:c=avc:b=150000:g=50:cgop=true:fast=true -o raw.264
```  
This creates a 25 fps AVC at 175kbps with a gop duration of 2 seconds, using closed gop and fast encoding settings for ffmpeg.  
  
The inverse operation (forcing a decode to happen) is possible using the _reframer_ filter.  
Example
```
gpac -i file.mp4 reframer:raw=av -o null
```  
This will force decoding media from `file.mp4` and trash (send to `null`) the result (doing a decoder benchmark for example).  

## Escaping option separators  
When a filter uses an option defined as a string using the same separator character as gpac, you can either modify the set of separators, or escape the separator by duplicating it. The options enclosed by duplicated separator are not parsed. This is mostly used for meta filters, such as ffmpeg, to pass options to sub-filters such as libx264 (cf `x264opts` parameter).  
Example
```
f:a=foo:b=bar
```  
This will set option `a` to `foo` and option `b` to `bar` on the filter.  
Example
```
f::a=foo:b=bar
```  
This will set option `a` to `foo:b=bar` on the filter.  
Example
```
f:a=foo::b=bar:c::d=fun
```  
This will set option `a` to `foo`, `b` to `bar:c` and the option `d` to `fun` on the filter.  
  
# Filter linking [_LINK_]  
  
Each filter exposes one or more sets of capabilities, called _capability bundle_, which are property type and values that must be matched or excluded by connecting PIDs.  
To check the possible sources and destination for a filter `FNAME`, use `gpac -h links FNAME`  
  
The filter graph resolver uses this information together with the PID properties to link the different filters.  
  
Link directives, when provided, specify which source a filter can accept connections from.  
_They do not specify which destination a filter can connect to._  
  
## Default filter linking  
When no link instructions are given (see below), the default linking strategy used is either _implicit mode_ (default in `gpac`) or _complete mode_ (if [-cl](gpac_general/#cl) is set).  
Each PID is checked for possible connection to all defined filters, in their declaration order.  
For each filter `DST` accepting a connection from the PID, directly or with intermediate filters:  

- if `DST` filter has link directives, use them to allow or reject PID connection.  
- otherwise, if _complete mode_ is enabled, allow connection..  
- otherwise (_implicit mode_):  

    - if `DST` is not a sink and is the first matching filter with no link directive, allow connection.  
    - otherwise, if `DST` is not a sink and is not the first matching filter with no link directive, reject connection.  
    - otherwise (`DST` is a sink) and no previous connections to a non-sink filter, allow connection.  

  
In all linking modes, a filter can prevent being linked to a filter with no link directives by setting `RSID` option on the filter.  
This is typically needed when dynamically inserting/removing filters in an existing session where some filters have no ID defined and are not desired for the inserted chain.  
A filter with `RSID` set is not clonable.  
  
Example
```
gpac -i file.mp4 c=avc -o output
```  
With this setup in _implicit mode_:  

- if the file has a video PID, it will connect to `enc` but not to `output`. The output PID of `enc` will connect to `output`.  
- if the file has other PIDs than video, they will connect to `output`, since this `enc` filter accepts only video.  

  
Example
```
gpac -cl -i file.mp4 c=avc -o output
```  
With this setup in _complete mode_:  

- if the file has a video PID, it will connect both to `enc` and to `output`, and the output PID of `enc` will connect to `output`.  
- if the file has other PIDs than video, they will connect to `output`.  

  
Furthermore in _implicit mode_, filter connections are restricted to filters defined between the last source and the sink(s).  
Example
```
gpac -i video1 reframer:saps=1 -i video2 ffsws:osize=128x72 -o output
```  
This will connect:  

- `video1` to `reframer` then `reframer` to `output` but will prevent `reframer` to `ffsws` connection.  
- `video2` to `ffsws` then `ffsws` to `output` but will prevent `video2` to `reframer` connection.  

  
Example
```
gpac -i video1 -i video2 reframer:saps=1 ffsws:osize=128x72 -o output
```  
This will connect `video1` AND `video2` to `reframer->ffsws->output`  
  
The _implicit mode_ allows specifying linear processing chains (no PID fan-out except for final output(s)) without link directives, simplifying command lines for common cases.  

__Warning: Argument order really matters in implicit mode!__  
  
Example
```
gpac -i file.mp4 c=avc c=aac -o output
```  
If the file has a video PID, it will connect to `c=avc` but not to `output`. The output PID of `c=avc` will connect to `output`.  
If the file has an audio PID, it will connect to `c=aac` but not to `output`. The output PID of `c=aac` will connect to `output`.  
If the file has other PIDs than audio or video, they will connect to `output`.  
  
Example
```
gpac -i file.mp4 ffswf=osize:128x72 c=avc resample=osr=48k c=aac -o output
```  
This will force:  

- `SRC(video)->ffsws->enc(video)->output` and prevent `SRC(video)->output`, `SRC(video)->enc(video)` and `ffsws->output` connections which would happen in _complete mode_.  
- `SRC(audio)->resample->enc(audio)->output` and prevent `SRC(audio)->output`, `SRC(audio)->enc(audio)` and `resample->output` connections which would happen in _complete mode_.  

  
## Quick links  
Link between filters may be manually specified. The syntax is an `@` character optionally followed by an integer (0 if omitted).  
This indicates that the following filter specified at prompt should be linked only to a previous listed filter.  
The optional integer is a 0-based index to the previous filter declarations, 0 indicating the previous filter declaration, 1 the one before the previous declaration, ...).  
If `@@` is used instead of `@`, the optional integer gives the filter index starting from the first filter (index 0) specified in command line.  
Several link directives can be given for a filter.  
Example
```
fA fB @1 fC
```  
This indicates that `fC` only accepts inputs from `fA`.  
Example
```
fA fB fC @1 @0 fD
```  
This indicates that `fD` only accepts inputs from `fB` and `fC`.  
Example
```
fA fB fC ... @@1 fZ
```  
This indicates that `fZ` only accepts inputs from `fB`.  
  
## Complex links  
The `@` link directive is just a quick shortcut to set the following filter arguments:  

- FID=name: assigns an identifier to the filter  
- SID=name1[,name2...]: sets a list of filter identifiers, or _sourceIDs_, restricting the list of possible inputs for a filter.  

  
Example
```
fA fB @1 fC
```  
This is equivalent to `fA:FID=1 fB fC:SID=1`.  
Example
```
fA:FID=1 fB fC:SID=1
```  
This indicates that `fC` only accepts input from `fA`, but `fB` might accept inputs from `fA`.  
Example
```
fA:FID=1 fB:FID=2 fC:SID=1 fD:SID=1,2
```  
This indicates that `fD` only accepts input from `fA` and `fB` and `fC` only from `fA`  
_Note: A filter with sourceID set cannot get input from filters with no IDs._  
  
A sourceID name can be further extended using fragment identifier (`#` by default):  

- name#PIDNAME: accepts only PID(s) with name `PIDNAME`  
- name#TYPE: accepts only PIDs of matching media type. TYPE can be `audio`, `video`, `scene`, `text`, `font`, `meta`  
- name#TYPEN: accepts only `N` (1-based index) PID of matching type from source (e.g. `video2` to only accept second video PID)  
- name#TAG=VAL: accepts the PID if its parent filter has no tag or a tag matching `VAL`  
- name#ITAG=VAL: accepts the PID if its parent filter has no inherited tag or an inherited tag matching `VAL`  
- name#P4CC=VAL: accepts only PIDs with builtin property of type `P4CC` and value `VAL`.  
- name#PName=VAL: same as above, using the builtin name corresponding to the property.  
- name#AnyName=VAL: same as above, using the name of a non built-in property.  
- name#Name=OtherPropName: compares the value with the value of another property of the PID. The matching will fail if the value to compare to is not present or different from the value to check. The property to compare with shall be a built-in property.  

If the property is not defined on the PID, the property is matched. Otherwise, its value is checked against the given value.  
  
The following modifiers for comparisons are allowed (for any fragment format using `=`):  

- name#P4CC=!VAL: accepts only PIDs with property NOT matching `VAL`.  
- name#P4CC-VAL: accepts only PIDs with property strictly less than `VAL` (only for 1-dimension number properties).  
- name#P4CC+VAL: accepts only PIDs with property strictly greater than `VAL` (only for 1-dimension number properties).  

  
A sourceID name can also use wildcard or be empty to match a property regardless of the source filter.  
Example
```
fA fB:SID=*#ServiceID=2  
fA fB:SID=#ServiceID=2
```  
This indicates to match connection between `fA` and `fB` only for PIDs with a `ServiceID` property of `2`.  
These extensions also work with the _LINK_ `@` shortcut.  
Example
```
fA fB @1#video fC
```  
This indicates that `fC` only accepts inputs from `fA`, and of type video.  
Example
```
gpac -i img.heif @#ItemID=200 vout
```  
This indicates to connect to `vout` only PIDs with `ItemID` property equal to `200`.  
Example
```
gpac -i vid.mp4 @#PID=1 vout
```  
This indicates to connect to `vout` only PIDs with `ID` property equal to `1`.  
Example
```
gpac -i vid.mp4 @#Width=640 vout
```  
This indicates to connect to `vout` only PIDs with `Width` property equal to `640`.  
Example
```
gpac -i vid.mp4 @#Width-640 vout
```  
This indicates to connect to `vout` only PIDs with `Width` property less than `640`  
Example
```
gpac -i vid.mp4 @#ID=ItemID#ItemNumber=1 vout
```  
This will connect to `vout` only PID with an ID property equal to ItemID property (keep items, discard tracks) and an Item number of 1 (first item).  
  
Multiple fragment can be specified to check for multiple PID properties.  
Example
```
gpac -i vid.mp4 @#Width=640#Height+380 vout
```  
This indicates to connect to `vout` only PIDs with `Width` property equal to `640` and `Height` greater than `380`.  
  
__Warning: If a PID directly connects to one or more explicitly loaded filters, no further dynamic link resolution will be done to connect it to other filters with no sourceID set. Link directives should be carefully setup.__  
  
Example
```
fA @ reframer fB
```  
If `fB` accepts inputs provided by `fA` but `reframer` does not, this will link `fA` PID to `fB` filter since `fB` has no sourceID.  
Since the PID is connected, the filter engine will not try to solve a link between `fA` and `reframer`.  
  
An exception is made for local files: by default, a local file destination will force a remultiplex of input PIDs from a local file.  
Example
```
gpac -i file.mp4 -o dump.mp4
```  
This will prevent direct connection of PID of type `file` to dst `file.mp4`, remultiplexing the file.  
  
The special option `nomux` is used to allow direct connections (ignored for non-sink filters).  
Example
```
gpac -i file.mp4 -o dump.mp4:nomux
```  
This will result in a direct file copy.  
  
This only applies to local files destination. For pipes, sockets or other file outputs (HTTP, ROUTE):  

- direct copy is enabled by default  
- `nomux=0` can be used to force remultiplex  

  
## Sub-session tagging  
Filters may be assigned to a sub-session using `:FS=N`, with `N` a positive integer.  
Filters belonging to different sub-sessions may only link to each-other:  

- if explicitly allowed through sourceID directives (`@` or `SID`)  
- or if they have the same sub-session identifier  

  
This is mostly used for _implicit mode_ in `gpac`: each first source filter specified after a sink filter will trigger a new sub-session.  
Example
```
gpac -i in1.mp4 -i in2.mp4 -o out1.mp4 -o out2.mp4
```  
This will result in both inputs multiplexed in both outputs.  
Example
```
gpac -i in1.mp4 -o out1.mp4 -i in2.mp4 -o out2.mp4
```  
This will result in in1 mixed to out1 and in2 mixed to out2, these last two filters belonging to a different sub-session.  
  
# Arguments inheriting  
  
Unless explicitly disabled (see [-max-chain](core_options/#max-chain)), the filter engine will resolve implicit or explicit (_LINK_) connections between filters and will allocate any filter chain required to connect the filters. In doing so, it loads new filters with arguments inherited from both the source and the destination.  
Example
```
gpac -i file.mp4:OPT -o file.aac -o file.264
```  
This will pass the `:OPT` to all filters loaded between the source and the two destinations.  
Example
```
gpac -i file.mp4 -o file.aac:OPT -o file.264
```  
This will pass the `:OPT` to all filters loaded between the source and the file.aac destination.  
_Note: the destination arguments inherited are the arguments placed __AFTER__ the `dst=` option._  
Example
```
gpac -i file.mp4 fout:OPTFOO:dst=file.aac:OPTBAR
```  
This will pass the `:OPTBAR` to all filters loaded between `file.mp4` source and `file.aac` destination, but not `OPTFOO`.  
Arguments inheriting can be stopped by using the keyword `gfloc`: arguments after the keyword will not be inherited.  
Example
```
gpac -i file.mp4 -o file.aac:OPTFOO:gfloc:OPTBAR -o file.264
```  
This will pass `:OPTFOO` to all filters loaded between `file.mp4` source and `file.aac` destination, but not `OPTBAR`  
Arguments are by default tracked to check if they were used by the filter chain, and a warning is thrown if this is not the case.  
It may be useful to specify arguments which may not be consumed depending on the graph resolution; the specific keyword `gfopt` indicates that arguments after the keyword will not be tracked.  
Example
```
gpac -i file.mp4 -o file.aac:OPTFOO:gfopt:OPTBAR -o file.264
```  
This will warn if `OPTFOO` is not consumed, but will not track `OPTBAR`.  
    
A filter may be assigned a name (for inspection purposes, not inherited) using `:N=name` option. This name is not used in link resolution and may be changed at runtime by the filter instance.  
    
A filter may be assigned a tag (any string) using `:TAG=name` option. This tag does not need to be unique, and can be used to exclude filter in link resolution. Tags are not inherited, therefore dynamically loaded filters never have a tag.  
    
A filter may also be assigned an inherited tag (any string) using `:ITAG=name` option. Such tags are inherited, and are typically used to track dynamically loaded filters.  
    

# URL templating  
  
Destination URLs can be dynamically constructed using templates. Pattern `$KEYWORD$` is replaced in the template with the resolved value and `$KEYWORD%%0Nd$` is replaced in the template with the resolved integer, padded with up to N zeros if needed.  
`KEYWORD` is __case sensitive__, and may be present multiple times in the string. Supported `KEYWORD`:  

- num: replaced by file number if defined, 0 otherwise  
- PID: ID of the source PID  
- URL: URL of source file  
- File: path on disk for source file; if not found, use URL if set, or PID name otherwise  
- Type: name of stream type of PID (`video`, `audio` ...)  
- OType: same as `Type` but uses original type when stream is encrypted (e.g. move from `crypt` to `video`)  
- p4cc=ABCD: uses PID property with 4CC value `ABCD`  
- pname=VAL: uses PID property with name `VAL`  
- cts, dts, dur, sap: uses properties of first packet in PID at template resolution time  
- OTHER: locates property 4CC for the given name, or property name if no 4CC matches.  

    
`$$` is an escape for $  
  
Templating can be useful when encoding several qualities in one pass.  
Example
```
gpac -i dump.yuv:size=640x360 vcrop:wnd=0x0x320x180 c=avc:b=1M @2 c=avc:b=750k -o dump_$CropOrigin$x$Width$x$Height$.264
```  
This will create a cropped version of the source, encoded in AVC at 1M, and a full version of the content in AVC at 750k. Outputs will be `dump_0x0x320x180.264` for the cropped version and `dump_0x0x640x360.264` for the non-cropped one.  

# Cloning filters  
  
When a filter accepts a single connection and has a connected input, it is no longer available for dynamic resolution. There may be cases where this behavior is undesired. Take a HEIF file with N items and do:  
Example
```
gpac -i img.heif -o dump_$ItemID$.jpg
```  
In this case, only one item (likely the first declared in the file) will connect to the destination.  
Other items will not be connected since the destination only accepts one input PID.  
Example
```
gpac -i img.heif -o dump_$ItemID$.jpg
```  
In this case, the destination will be cloned for each item, and all will be exported to different JPEGs thanks to URL templating.  
Example
```
gpac -i vid.mpd c=avc:FID=1 -o transcode.mpd:SID=1
```  
In this case, the encoder will be cloned for each video PIDs in the source, and the destination will only use PIDs coming from the encoders.  
  
When implicit linking is enabled, all filters are by default clonable. This allows duplicating the processing for each PIDs of the same type.  
Example
```
gpac -i dual_audio resample:osr=48k c=aac -o dst
```  
The `resampler` filter will be cloned for each audio PID, and the encoder will be cloned for each resampler output.  
You can explicitly deactivate the cloning instructions:  
Example
```
gpac -i dual_audio resample:osr=48k:clone=0 c=aac -o dst
```  
The first audio will connect to the `resample` filter, the second to the `enc` filter and the `resample` output will connect to a clone of the `enc` filter.  
  
# Templating filter chains  
  
There can be cases where the number of desired outputs depends on the source content, for example dumping a multiplex of N services into N files. When the destination involves multiplexing the input PIDs, the `:clone` option is not enough since the multiplexer will always accept the input PIDs.  
To handle this, it is possible to use a PID property name in the sourceID of a filter with the value `*` or an empty value. In this case, whenever a new PID with a new value for the property is found, the filter with such sourceID will be dynamically cloned.  

__Warning: This feature should only be called with a single property set to `*` (or empty) per source ID, results are undefined otherwise.__  
  
Example
```
gpac -i source.ts -o file_$ServiceID$.mp4:SID=*#ServiceID=*  
gpac -i source.ts -o file_$ServiceID$.mp4:SID=#ServiceID=
```  
In this case, each new `ServiceID` value found when connecting PIDs to the destination will create a new destination file.  
  
Cloning in implicit linking mode applies to output as well:  
Example
```
gpac -i dual_audio -o dst_$PID$.aac
```  
Each audio track will be dumped to aac (potentially reencoding if needed).  
  
# Assigning PID properties  
  
It is possible to define properties on output PIDs that will be declared by a filter. This allows tagging parts of the graph with different properties than other parts (for example `ServiceID`). The syntax is the same as filter option, and uses the fragment separator to identify properties, e.g. `#Name=Value`.  
This sets output PIDs property (4cc, built-in name or any name) to the given value. Value can be omitted for boolean (defaults to true, e.g. `:#Alpha`).  
Non built-in properties are parsed as follows:  

- `file@FOO` will be declared as string with a value set to the content of `FOO`.  
- `bxml@FOO` will be declared as data with a value set to the binarized content of `FOO`.  
- `FOO` will be declared as string with a value set to `FOO`.  
- `TYPE@FOO` will be parsed according to `TYPE`. If the type is not recognized, the entire value is copied as string. See `gpac -h props` for defined types.  

  
User-assigned PID properties on filter `fA` will be inherited by all filters dynamically loaded to solve `fA -> fB` connection.  
If `fB` also has user-assigned PID properties, these only apply starting from `fB` in the chain and are not inherited by filters between `fA` and `fB`.  
  
__Warning: Properties are not filtered and override the properties of the filter's output PIDs, be careful not to break the session by overriding core properties such as width/height/samplerate/... !__  
  
Example
```
gpac -i v1.mp4:#ServiceID=4 -i v2.mp4:#ServiceID=2 -o dump.ts
```  
This will multiplex the streams in `dump.ts`, using `ServiceID` 4 for PIDs from `v1.mp4` and `ServiceID` 2 for PIDs from `v2.mp4`.  
  
PID properties may be conditionally assigned by checking other PID properties. The syntax uses parenthesis (not configurable) after the property assignment sign:  
`#Prop=(CP=CV)VAL`  
This will assign PID property `Prop` to `VAL` for PIDs with property `CP` equal to `CV`.  
`#Prop=(CP=CV)VAL,(CP2=CV2)VAL2`  
This will assign PID property `Prop` to `VAL` for PIDs with property `CP` equal to `CV`, and to `VAL2` for PIDs with property `CP2` equal to `CV2`.  
`#Prop=(CP=CV)(CP2=CV2)VAL`  
This will assign PID property `Prop` to `VAL` for PIDs with property `CP` equal to `CV` and property `CP2` equal to `CV2`.  
`#Prop=(CP=CV)VAL,()DEFAULT`  
This will assign PID property `Prop` to `VAL` for PIDs with property `CP` equal to `CV`, or to `DEFAULT` for other PIDs.  
The condition syntax is the same as source ID fragment syntax.  
_Note: When set, the default value (empty condition) always matches the PID, therefore it should be placed last in the list of conditions._  
Example
```
gpac -i source.mp4:#MyProp=(audio)"Super Audio",(video)"Super Video"
```  
This will assign property `MyProp` to `Super Audio` for audio PIDs and to `Super Video` for video PIDs.  
Example
```
gpac -i source.mp4:#MyProp=(audio1)"Super Audio"
```  
This will assign property `MyProp` to `Super Audio` for first audio PID declared.  
Example
```
gpac -i source.mp4:#MyProp=(Width+1280)HD
```  
This will assign property `MyProp` to `HD` for PIDs with property `Width` greater than 1280.  
  
The property value can use templates with the following keywords:  

- $GINC(init[,inc]) or @GINC(...): replaced by integer for each new output PID of the filter (see specific filter options for details on syntax)  
- PROP (enclosed between `$` or `@`): replaced by serialized value of property `PROP` (name or 4CC) of the PID or with empty string if no such property  

Example
```
gpac -i source.ts:#ASID=$PID$
```  
This will assign DASH AdaptationSet ID to the PID ID value.  
Example
```
gpac -i source.ts:#RepresentationID=$ServiceID$
```  
This will assign DASH Representation ID to the PID ServiceID value.  
  
A property can also be removed by not specifying any value. Conditional removal is possible using the above syntax.  
Example
```
gpac -i source.ts:#FOO=
```  
This will remove the `FOO` property on the output PID.  
  
# Using option files  
  
It is possible to use a file to define options of a filter, by specifying the target file name as an option without value, i.e. `:myopts.txt`.  

__Warning: Only local files are allowed.__  
  
An option file is a simple text file containing one or more options or PID properties on one or more lines.  

- A line beginning with "//" is a comment and is ignored (not configurable).  
- A line beginning with ":" indicates an escaped option (the entire line is parsed as a single option).  

Options in an option file may point to other option files, with a maximum redirection level of 5.  
An option file declaration (`filter:myopts.txt`) follows the same inheritance rules as regular options.  
Example
```
gpac -i source.mp4:myopts.txt:foo=bar -o dst
```  
Any filter loaded between `source.mp4` and `dst` will inherit both `myopts.txt` and `foo` options and will resolve options and PID properties given in `myopts.txt`.  
  
# Ignoring filters at run-time  
  
The special option `ccp` can be used to replace filters with an identity filter at run-time based on the input codec ID.  
The option is a list of codec IDs to check. For encoder filters, an empty list reuses the encoder codec type.  
When the PID codec ID matches one of the specified codec, the filter is replaced with a reframer filter with single PID input and same name and ID.  
Example
```
-i src c=avc:b=1m:ccp -o mux
```  
This will replace the encoder filter with a reframer if the input PID is in AVC|H264 format, or uses the encoder for other visual PIDs.  
Example
```
-i src c=avc:b=1m:ccp=avc,hevc -o mux
```  
This will replace the encoder filter with a reframer if the input PID is in AVC|H264 or HEVC format, or uses the encoder for other visual PIDs.  
Example
```
-i src cecrypt:cfile=drm.xml:ccp=aac -o mux
```  
This will replace the encryptor filter with a reframer if the input PID is in AAC format, or uses the encryptor for other PIDs.  
  
# Specific filter options  
  
Some specific keywords are replaced when processing filter options.  

__Warning: These keywords do not apply to PID properties. Multiple keywords cannot be defined for a single option.__  
  
Defined keywords:  

- $GSHARE: replaced by system path to GPAC shared directory (e.g. /usr/share/gpac)  
- $GJS: replaced by the first path from global share directory and paths set through [-js-dirs](core_options/#js-dirs) that contains the file name following the macro, e.g. $GJS/source.js  
- $GDOCS: replaced by system path to:  

    - application document directory for iOS  
    - `EXTERNAL_STORAGE` environment variable if present or `/sdcard` otherwise for Android  
    - user home directory for other platforms  

- $GLANG: replaced by the global config language option [-lang](core_options/#lang)  
- $GUA: replaced by the global config user agent option [-user-agent](core_options/#user-agent)  
- $GINC(init_val[,inc]): replaced by `init_val` and increment `init_val` by `inc` (positive or negative number, 1 if not specified) each time a new filter using this string is created.  

  
The `$GINC` construct can be used to dynamically assign numbers in filter chains:  
Example
```
gpac -i source.ts tssplit @#ServiceID= -o dump_$GINC(10,2).ts
```  
This will dump first service in dump_10.ts, second service in dump_12.ts, etc...  
  
As seen previously, the following options may be set on any filter, but are not visible in individual filter help:  

- FID: filter identifier  
- SID: filter source(s) (string value)  
- N=NAME: filter name (string value)  
- FS: sub-session identifier (unsigned int value)  
- RSID: require sourceID to be present on target filters (no value)  
- TAG: filter tag (string value)  
- ITAG: filter inherited tag (string value)  
- FBT: buffer time in microseconds (unsigned int value)  
- FBU: buffer units (unsigned int value)  
- FBD: decode buffer time in microseconds (unsigned int value)  
- clone: explicitly enable/disable filter cloning flag (no value)  
- nomux: enable/disable direct file copy (no value)  
- gfreg: preferred filter registry names for link solving (string value)  
- gfloc: following options are local to filter declaration, not inherited (no value)  
- gfopt: following options are not tracked (no value)  
- gpac: argument separator for URLs (no value)  
- ccp: filter replacement control (string list value)  
- NCID: ID of netcap configuration to use (string)  
- LT: set additionnal log tools and levels for the filter usin same syntax as -logs, e.g. `:LT=filter@debug` (string value)  
- DBG: debug missing input PID property (`=pid`), missing input packet property (`=pck`) or both (`=all`)  

  
The buffer control options are used to change the default buffering of PIDs of a filter:  

- `FBT` controls the maximum buffer time of output PIDs of a filter  
- `FBU` controls the maximum number of packets in buffer of output PIDs of a filter when timing is not available  
- `FBD` controls the maximum buffer time of input PIDs of a decoder filter, ignored for other filters  

  
If another filter sends a buffer requirement messages, the maximum value of `FBT` (resp. `FBD`) and the user requested buffer time will be used for output buffer time (resp. decoding buffer time).  
  
The options `FBT`, `FBU`, `FBD`  and `DBG` can be set:  

- per filter instance: `fA reframer:FBU=2`  
- per filter class for the run: `--reframer@FBU=2`  
- in the GPAC config file in a per-filter section: `[filter@reframer]FBU=2`  

  
The default values are defined by the session default parameters `-buffer-gen`, `buffer-units` and `-buffer-dec`.  
  
# External filters  
  
GPAC comes with a set of built-in filters in libgpac. It may also load external filters in dynamic libraries, located in default module folder or folders listed in [-mod-dirs](core_options/#mod-dirs) option. The files shall be named `gf_*` and shall export a single function `RegisterFilter` returning a filter register - see [libgpac documentation](https://doxygen.gpac.io/) for more details.  
  
