<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MPEG-DASH and HLS client  {:data-level="all"}  
  
Register name used to load filter: __dashin__  
This filter may be automatically loaded during graph resolution.  
This filter requires the graph resolver to be activated.  
  
This filter reads MPEG-DASH, HLS and MS Smooth manifests.  
  
# Regular mode  
  
This is the default mode, in which the filter produces media PIDs and frames from sources indicated in the manifest.  
The default behavior is to perform adaptation according to [algo](#algo), but the filter can:  

- run with no adaptation, to grab maximum quality.  

Example
```
gpac -i MANIFEST_URL:algo=none:start_with=max_bw -o dest.mp4
```  

- run with no adaptation, fetching all qualities.  

Example
```
gpac -i MANIFEST_URL:split_as -o dst=$File$.mp4
```  
  
# File mode  
  
When [forward](#forward) is set to `file`, the client forwards media files without demultiplexing them.  
This is mostly used to expose the DASH session to a file server such as ROUTE or HTTP.  
In this mode, the manifest is forwarded as an output PID.  

__Warning: This mode cannot be set through inheritance as it changes the link capabilities of the filter. The filter MUST be explicitly declared.__  
  
To expose a live DASH session to route:  
Example
```
gpac -i MANIFEST_URL dashin:forward=file -o route://225.0.0.1:8000/
```  
  
If the source has dependent media streams (scalability) and all qualities and initialization segments need to be forwarded, add [split_as](#split_as).  
  
# Segment bound modes  
  
When [forward](#forward) is set to `segb` or `mani`, the client forwards media frames (after demultiplexing) together with segment and fragment boundaries of source files.  
  
This mode can be used to process media data and regenerate the same manifest/segmentation.  
  
Example
```
gpac -i MANIFEST_URL:forward=mani cecrypt:cfile=DRM.xml -o encrypted/live.mpd:pssh=mv
```  
This will encrypt an existing DASH session, inject PSSH in manifest and segments.  
  
Example
```
gpac -i MANIFEST_URL:forward=segb cecrypt:cfile=DRM.xml -o encrypted/live.m3u8
```  
This will encrypt an existing DASH session and republish it as HLS, using same segment names and boundaries.  
  
This mode will force [noseek](#noseek)=`true` to ensure the first segment fetched is complete, and [split_as](#split_as)=`true` to fetch all qualities.  
  
Each first packet of a segment will have the following properties attached:  

- `CueStart`: indicate this is a segment start  
- `FileNumber`: current segment number  
- `FileName`: current segment file name without manifest (MPD or master HLS) base url  
- `DFPStart`: set with value `0` if this is the first packet in the period, absent otherwise  

  
If [forward](#forward) is set to `mani`, the first packet of a segment dispatched after a manifest update will also carry the manifest payload as a property:  

- `DFManifest`: contains main manifest (MPD, M3U8 master)  
- `DFVariant`: contains list of HLS child playlists as strings for the given quality  
- `DFVariantName`: contains list of associated HLS child playlists name, in same order as manifests in `DFVariant`  

  
Each output PID will have the following properties assigned:  

- `DFMode`: set to 1 for `segb` or 2 for `mani`  
- `DCue`: set to `inband`  
- `DFPStart`: set to current period start value  
- `FileName`: set to associated init segment if any  
- `Representation`: set to the associated representation ID in the manifest  
- `DashDur`: set to the average segment duration as indicated in the manifest  
- `source_template`: set to true to indicate the source template is known  
- `stl_timescale`: timescale used by SegmentTimeline, or 0 if no SegmentTimeline  
- `init_url`: unresolved intialization URL (as it appears in the MPD or in the variant playlist)  
- `manifest_url`: manifest URL  
- `hls_variant_name`: HLS variant playlist name (as it appears in the HLS master playlist)  

  
When the [dasher](dasher) is used together with this mode, this will force all generated segments to have the same name, duration and fragmentation properties as the input ones. It is therefore not recommended for sessions stored/generated on local storage to generate the output in the same directory.  
  

# Options    
  
<a id="auto_switch">__auto_switch__</a> (sint, default: _0_): switch quality every N segments  

- positive: go to higher quality or loop to lowest  
- negative: go to lower quality or loop to highest  
- 0: disabled  
  
<a id="segstore">__segstore__</a> (enum, default: _mem_): enable file caching  

- mem: all files are stored in memory, no disk IO  
- disk: files are stored to disk but discarded once played  
- cache: all files are stored to disk and kept  
  
<a id="algo">__algo__</a> (str, default: _gbuf_, Enum: none|grate|gbuf|bba0|bolaf|bolab|bolau|bolao|JS): adaptation algorithm to use  

- none: no adaptation logic  
- grate: GPAC legacy algo based on available rate  
- gbuf: GPAC legacy algo based on buffer occupancy  
- bba0: BBA-0  
- bolaf: BOLA Finite  
- bolab: BOLA Basic  
- bolau: BOLA-U  
- bolao: BOLA-O  
- JS: use file JS (either with specified path or in $GSHARE/scripts/) for algo (.js extension may be omitted)  
  
<a id="start_with">__start_with__</a> (enum, default: _max_bw_): initial selection criteria  

- min_q: start with lowest quality  
- max_q: start with highest quality  
- min_bw: start with lowest bitrate  
- max_bw: start with highest bitrate; if tiles are used, all low priority tiles will have the lower (below max) bandwidth selected  
- max_bw_tiles: start with highest bitrate; if tiles are used, all low priority tiles will have their lowest bandwidth selected  
  
<a id="max_res">__max_res__</a> (bool, default: _true_): use max media resolution to configure display  
<a id="abort">__abort__</a> (bool, default: _false_): allow abort during a segment download  
<a id="use_bmin">__use_bmin__</a> (enum, default: _auto_): playout buffer handling  

- no: use default player settings  
- auto: notify player of segment duration if not low latency  
- mpd: use the indicated min buffer time of the MPD  
  
<a id="shift_utc">__shift_utc__</a> (sint, default: _0_): shift DASH UTC clock in ms  
<a id="spd">__spd__</a> (sint, default: _-I_): suggested presentation delay in ms  
<a id="mcast_shift">__mcast_shift__</a> (sint, default: _0_): shift requests time by given ms for multicast sources  
<a id="server_utc">__server_utc__</a> (bool, default: _yes_): use `ServerUTC` or `Date` HTTP headers instead of local UTC  
<a id="screen_res">__screen_res__</a> (bool, default: _yes_): use screen resolution in selection phase  
<a id="init_timeshift">__init_timeshift__</a> (sint, default: _0_): set initial timeshift in ms (if >0) or in per-cent of timeshift buffer (if <0)  
<a id="tile_mode">__tile_mode__</a> (enum, default: _none_): tile adaptation mode  

- none: bitrate is shared equally across all tiles  
- rows: bitrate decreases for each row of tiles starting from the top, same rate for each tile on the row  
- rrows: bitrate decreases for each row of tiles starting from the bottom, same rate for each tile on the row  
- mrows: bitrate decreased for top and bottom rows only, same rate for each tile on the row  
- cols: bitrate decreases for each columns of tiles starting from the left, same rate for each tile on the columns  
- rcols: bitrate decreases for each columns of tiles starting from the right, same rate for each tile on the columns  
- mcols: bitrate decreased for left and right columns only, same rate for each tile on the columns  
- center: bitrate decreased for all tiles on the edge of the picture  
- edges: bitrate decreased for all tiles on the center of the picture  
  
<a id="tiles_rate">__tiles_rate__</a> (uint, default: _100_): indicate the amount of bandwidth to use at each quality level. The rate is recursively applied at each level, e.g. if 50%, Level1 gets 50%, level2 gets 25%, ... If 100, automatic rate allocation will be done by maximizing the quality in order of priority. If 0, bitstream will not be smoothed across tiles/qualities, and concurrency may happen between different media  
<a id="delay40X">__delay40X__</a> (uint, default: _500_): delay in milliseconds to wait between two 40X on the same segment  
<a id="exp_threshold">__exp_threshold__</a> (uint, default: _100_): delay in milliseconds to wait after the segment AvailabilityEndDate before considering the segment lost  
<a id="switch_count">__switch_count__</a> (uint, default: _1_): indicate how many segments the client shall wait before switching up bandwidth. If 0, switch will happen as soon as the bandwidth is enough, but this is more prone to network variations  
<a id="aggressive">__aggressive__</a> (bool, default: _no_): if enabled, switching algo targets the closest bandwidth fitting the available download rate. If no, switching algo targets the lowest bitrate representation that is above the currently played (e.g. does not try to switch to max bandwidth)  
<a id="debug_as">__debug_as__</a> (uintl): play only the adaptation sets indicated by their indices (0-based) in the MPD  
<a id="speedadapt">__speedadapt__</a> (bool, default: _no_): enable adaptation based on playback speed  
<a id="noxlink">__noxlink__</a> (bool, default: _no_): disable xlink if period has both xlink and adaptation sets  
<a id="query">__query__</a> (str): set query string (without initial '?') to append to xlink of periods  
<a id="split_as">__split_as__</a> (bool, default: _no_): separate all qualities into different adaptation sets and stream all qualities. Dependent representations (scalable) are treated as independent  
<a id="noseek">__noseek__</a> (bool, default: _no_): disable seeking of initial segment(s) in dynamic mode (useful when UTC clocks do not match)  
<a id="bwcheck">__bwcheck__</a> (uint, default: _5_): minimum time in milliseconds between two bandwidth checks when allowing segment download abort  
<a id="lowlat">__lowlat__</a> (enum, default: _early_): segment scheduling policy in low latency mode  

- no: disable low latency  
- strict: strict respect of AST offset in low latency  
- early: allow fetching segments earlier than their AST in low latency when input PID is empty  
  
<a id="forward">__forward__</a> (enum, default: _none_): segment forwarding mode  

- none: regular DASH read  
- file: do not demultiplex files and forward them as file PIDs (imply `segstore=mem`)  
- segb: turn on [split_as](#split_as), segment and fragment bounds signaling (`sigfrag`) in sources and DASH cue insertion  
- mani: same as `segb` and also forward manifests  
  
<a id="fmodefwd">__fmodefwd__</a> (bool, default: _yes_): forward packet rather than copy them in `file` forward mode. Packet copy might improve performances in low latency mode  
<a id="skip_lqt">__skip_lqt__</a> (bool, default: _no_): disable decoding of tiles with highest degradation hints (not visible, not gazed at) for debug purposes  
<a id="llhls_merge">__llhls_merge__</a> (bool, default: _yes_): merge LL-HLS byte range parts into a single open byte range request  
<a id="groupsel">__groupsel__</a> (bool, default: _no_): select groups based on language (by default all playable groups are exposed)  
<a id="chain_mode">__chain_mode__</a> (enum, default: _on_): MPD chaining mode  

- off: do not use MPD chaining  
- on: use MPD chaining once over, fallback if MPD load failure  
- error: use MPD chaining once over or if error (MPD or segment download)  
  
<a id="asloop">__asloop__</a> (bool, default: _false_): when auto switch is enabled, iterates back and forth from highest to lowest qualities  
<a id="bsmerge">__bsmerge__</a> (bool, default: _true_): allow merging of video bitstreams (only HEVC for now)  
  
