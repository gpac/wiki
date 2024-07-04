<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# ISOBMFF/QT demultiplexer  
  
Register name used to load filter: __mp4dmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter demultiplexes ISOBMF and QT files.  
Input ISOBMFF/QT can be regular or fragmented, and available as files or as raw bytestream.  

# Track Selection  
  
The filter can use fragment identifiers of source to select a single track for playback. The allowed fragments are:  

    - #audio: only use the first audio track  
    - #video: only use the first video track  
    - #auxv: only use the first auxiliary video track  
    - #pict: only use the first picture track  
    - #text: only use the first text track  
    - #trackID=VAL: only use the track with given ID  
    - #itemID=VAL: only use the item with given ID  
    - #ID=VAL: only use the track/item with given ID  
    - #VAL: only use the track/item with given ID  

  
# Scalable Tracks  
  
When scalable tracks are present in a file, the reader can operate in 3 modes using [smode](#smode) option:  

- smode=single: resolves all extractors to extract a single bitstream from a scalable set. The highest level is used  

In this mode, there is no enhancement decoder config, only a base one resulting from the merge of the layers configurations  

- smode=split: all extractors are removed and every track of the scalable set is declared. In this mode, each enhancement track has no base decoder config  

and an enhancement decoder config.  

- smode=splitx: extractors are kept in the bitstream, and every track of the scalable set is declared. In this mode, each enhancement track has a base decoder config  

 (copied from base) and an enhancement decoder config. This is mostly used for DASHing content.  

__Warning: smode=splitx will result in extractor NAL units still present in the output bitstream, which shall only be true if the output is ISOBMFF based__  
  

# Options    
  
<a id="src">__src__</a> (cstr): local file name of source content (only used when explicitly loading the filter)  
<a id="allt">__allt__</a> (bool, default: _false_): load all tracks even if unknown media type  
<a id="edits">__edits__</a> (enum, default: _auto_): do not use edit lists  

- auto: track delay and no edit list when possible  
- no: ignore edit list  
- strict: use edit list even if only signaling a delay  
  
<a id="itt">__itt__</a> (bool, default: _false_): convert all items of root meta into a single PID  
<a id="itemid">__itemid__</a> (bool, default: _true_): keep item IDs in PID properties  
<a id="smode">__smode__</a> (enum, default: _split_): load mode for scalable/tile tracks  

- split: each track is declared, extractors are removed  
- splitx: each track is declared, extractors are kept  
- single: a single track is declared (highest level for scalable, tile base for tiling)  
  
<a id="alltk">__alltk__</a> (bool, default: _false_): declare disabled tracks  
<a id="frame_size">__frame_size__</a> (uint, default: _1024_): frame size for raw audio samples (dispatches frame_size samples per packet)  
<a id="expart">__expart__</a> (bool, default: _false_): expose cover art as a dedicated video PID  
<a id="sigfrag">__sigfrag__</a> (bool, default: _false_): signal fragment and segment boundaries of source on output packets, fails if source is not fragmented  
<a id="tkid">__tkid__</a> (str): declare only track based on given param  

- integer value: declares track with the given ID  
- audio: declares first audio track  
- video: declares first video track  
- 4CC: declares first track with matching 4CC for handler type  
  
<a id="stsd">__stsd__</a> (uint, default: _0_): only extract sample mapped to the given sample description index (0 means extract all)  
<a id="nocrypt">__nocrypt__</a> (bool): signal encrypted tracks as non encrypted (mostly used for export)  
<a id="mstore_size">__mstore_size__</a> (uint, default: _1000000_): target buffer size in bytes when reading from memory stream (pipe etc...)  
<a id="mstore_purge">__mstore_purge__</a> (uint, default: _50000_): minimum size in bytes between memory purges when reading from memory stream, 0 means purge as soon as possible  
<a id="mstore_samples">__mstore_samples__</a> (uint, default: _50_): minimum number of samples to be present before purging sample tables when reading from memory stream (pipe etc...), 0 means purge as soon as possible  
<a id="strtxt">__strtxt__</a> (bool, default: _false_): load text tracks (apple/tx3g) as MPEG-4 streaming text tracks  
<a id="xps_check">__xps_check__</a> (enum, default: _auto_): parameter sets extraction mode from AVC/HEVC/VVC samples  

- keep: do not inspect sample (assumes input file is compliant when generating DASH/HLS/CMAF)  
- rem: removes all inband xPS and notify configuration changes accordingly  
- auto: resolves to `keep` for `smode=splitx` (dasher mode), `rem` otherwise  
  
<a id="nodata">__nodata__</a> (enum, default: _no_): control sample data loading  

- no: regular load  
- yes: skip data loading  
- fake: allocate sample but no data copy  
  
<a id="lightp">__lightp__</a> (bool, default: _false_): load minimal set of properties  
<a id="initseg">__initseg__</a> (str): local init segment name when input is a single ISOBMFF segment  
<a id="ctso">__ctso__</a> (sint): value to add to CTS offset for tracks using negative ctts  

- set to `-1` to use the `cslg` box info or the minimum cts offset present in the track  
- set to `-2` to use the minimum cts offset present in the track (`cslg` ignored)  
  
<a id="norw">__norw__</a> (bool, default: _false_): skip reformating of samples - should only be used when rewriting fragments  
<a id="keepc">__keepc__</a> (bool, default: _false_): keep corrupted samples - should only be used in multicast modes  
  
