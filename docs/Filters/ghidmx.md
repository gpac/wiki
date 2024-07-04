<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# GHI demultiplexer  
  
Register name used to load filter: __ghidmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter handles pre-indexed content for just-in-time processing of HAS manifest, init segment and segments  
  
__Warning: This is work in progress, the format of indexes (binary or XML) may change until finalization of this filter.__  
  
# Generating indexes  
  
Indexes are constructed using the dasher filter and a given segment duration.  
Example
```
gpac -i SRC [... -i SRCn] -o index.ghi:segdur=2
```  
This constructs a binary index for the DASH session.  
Example
```
gpac -i SRC -o index.ghix:segdur=2
```  
This constructs an XML index for the DASH session.  
  
__Warning: XML indexes should only be used for debug purposes as they can take a significant amount of time to be parsed.__  
  
When indexing, the default template used is `$Representation$_$Number$`. The template is stored in the index and shouldn't be re-specified when generating content.  
  
# Using indexes  
  
The index can be used to generate manifest, child variants for HLS, init segments and segments.  
Example
```
gpac -i index.ghi:gm=all -o dash/vod.mpd
```  
This generates manifest(s) and init segment(s).  
  
Example
```
gpac -i index.ghi:rep=FOO:sn=10 -o dash/vod.mpd
```  
This generates the 10th segment of representation with ID `FOO`.  
  
_Note: The manifest file(s) and init segment(s) are not written when generating a segment. The manifest target (mpd or m3u8) is only used to setup the filter chain and target output path._  
  
Example
```
gpac -i index.ghi:gm=main -o dash/vod.m3u8
```  
This generates main manifest only (MPD or master HLS playlist).  
  
Example
```
gpac -i index.ghi:gm=child:rep=FOO:out=BAR -o dash/vod.m3u8
```  
This generates child manifest for representation `FOO` in file `BAR`.  
  
Example
```
gpac -i index.ghi:gm=init:rep=FOO:out=BAR2 -o dash/vod.m3u8
```  
This generates init segment for representation `FOO` in file `BAR2`.  
  
The filter outputs are PIDs using framed packets marked with segment boundaries and can be chained to other filters before entering the dasher (e.g. for encryption, transcode...).  
  
If representation IDs are not assigned during index creation, they default to the 1-based index of the source. You can check them using:  
Example
```
gpac -i src.ghi inspect:full
```  
  
# Muxed Representations  
  
The filter can be used to generate muxed representations, either at manifest generation time or when generating a segment.  
Example
```
gpac -i index.ghi:mux=A@V1@V2 -o dash/vod.mpd
```  
This will generate a manifest muxing representations `A` with representations `V1` and `V2`.  
  
Example
```
gpac -i index.ghi:mux=A@V1@V2,T@V1@V2 -o dash/vod.mpd
```  
This will generate a manifest muxing representations `A` and `T` with representations `V1` and `V2`.  
  
Example
```
gpac -i index.ghi:rep=V2:sn=5:mux=A@V2 -o dash/vod.mpd
```  
This will generate the 5th segment containing representations `A` and `V2`.  
  
The filter does not store any state, it is the user responsibility to use consistent information across calls:  

- do not change segment templates  
- do not change muxed representations to configurations not advertised in the generated manifests  

  
# Recommendations  
  
Indexing supports fragmented and non-fragmented MP4, MPEG-2 TS and seekable inputs.  

- It is recommended to use fragmented MP4 as input format since this greatly reduces file loading times.  
- If non-fragmented MP4 are used, it is recommended to use single-track files to decrease the movie box size and speedup parsing.  
- MPEG-2 TS sources will be slower since they require PES reframing and AU reformating, resulting in more IOs than with mp4.  
- other seekable sources will likely be slower (seeking, reframing) and are not recommended.  

  

# Options    
  
<a id="gm">__gm__</a> (enum, default: _main_): manifest generation mode  

- none: no manifest generation (implied if sn is not 0)  
- all: generate all manifests and init segments  
- main: generate main manifest (MPD or master M3U8)  
- child: generate child playlist for HLS  
- init: generate init segment  
  
<a id="force">__force__</a> (bool, default: _false_): force loading sources in manifest generation for debug  
<a id="rep">__rep__</a> (str): representation to generate  
<a id="sn">__sn__</a> (uint):  segment number to generate, 0 means init segment  
<a id="mux">__mux__</a> (strl): representation to mux - cf filter help  
<a id="out">__out__</a> (str): output filename to generate  
  
