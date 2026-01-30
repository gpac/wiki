<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# ISOBMFF/QT multiplexer  
  
Register name used to load filter: __mp4mx__  
This filter may be automatically loaded during graph resolution.  
  
This filter multiplexes streams to ISOBMFF (14496-12 and derived specifications) or QuickTime  
    

# Tracks and Items  
  
By default all input PIDs with ItemID property set are multiplexed as items, otherwise they are multiplexed as tracks.  
To prevent source items to be multiplexed as items, use [-itemid](mp4dmx/#itemid) option from ISOBMFF demultiplexer.  
Example
```
gpac -i source.mp4:itemid=false -o file.mp4
```
  
    
To force non-item streams to be multiplexed as items, use _#ItemID_ option on that PID:  
```
gpac -i source.jpg:#ItemID=1 -o file.mp4
```
  
    

# Storage  
  
The [store](#store) option allows controlling if the file is fragmented or not, and when not fragmented, how interleaving is done. For cases where disk requirements are tight and fragmentation cannot be used, it is recommended to use either `flat` or `fstart` modes.  
    
The [vodcache](#vodcache) option allows controlling how DASH onDemand segments are generated:  

- If set to `on`, file data is stored to a temporary file on disk and flushed upon completion, no padding is present.  
- If set to `insert`, SIDX/SSIX will be injected upon completion of the file by shifting bytes in file. In this case, no padding is required but this might not be compatible with all output sinks and will take longer to write the file.  
- If set to `replace`, SIDX/SSIX size will be estimated based on duration and DASH segment length, and padding will be used in the file _before_ the final SIDX. If input PIDs have the properties `DSegs` set, this will used be as the number of segments.  

The `on` and `insert` modes will produce exactly the same file, while the mode `replace` may inject a `free` box before the sidx.  
    

# Custom boxes  
  
Custom boxes can be specified as box patches:  
For movie-level patch, the [boxpatch](#boxpatch) option of the filter should be used.  
Per PID box patch can be specified through the PID property `boxpatch`.  
Example
```
gpac -i source:#boxpatch=myfile.xml -o mux.mp4
```
  
Per Item box patch can be specified through the PID property `boxpatch`.  
Example
```
gpac -i source:1ItemID=1:#boxpatch=myfile.xml -o mux.mp4
```
  
    
The box patch is applied before writing the initial `moov box in fragmented mode, or when writing the complete file otherwise.`  
The box patch can either be a filename or the full XML string.  
    

# Tagging  
  
When tagging is enabled, the filter will watch the property `CoverArt` and all custom properties on incoming PID.  
The built-in tag names are indicated by `MP4Box -h tags`.  
QT tags can be specified using `qtt_NAME` property names, and will be added using formatting specified in `MP4Box -h tags`.  
Other tag class may be specified using `tag_NAME` property names, and will be added if [itags](#itags) is set to `all` using:  

- `NAME` as a box 4CC if `NAME` is four characters long  
- `NAME` as a box 4CC if `NAME` is 3 characters long, and will be prefixed by 0xA9  
- the CRC32 of the `NAME` as a box 4CC if `NAME` is not four characters long  

    
Property names formatted as `cust_NAME@MEAN` are added as a custom tag with name `NAME` and mean `MEAN`. Both `NAME` and `MEAN` can be empty.  

# User data  
  
The filter will look for the following PID properties to create user data entries:  

- `udtab`: set the track user-data box to the property value which _must_ be a serialized box array blob  
- `mudtab`: set the movie user-data box to the property value which _must_ be a serialized box array blob  
- `udta_U4CC`: set track user-data box entry of type `U4CC` to property value  
- `mudta_U4CC`: set movie user-data box entry of type `U4CC` to property value  
- `tkgp_T4CC`: set/remove membership to track group with type `T4CC` and ID given by property value. A negative value N removes from track group with ID -N  

    
Example
```
gpac -i src.mp4:#udta_tagc='My Awesome Tag' -o tag.mp4  
gpac -i src.mp4:#mudtab=data@box.bin -o tag.mp4
```
  
    

# Custom sample group descriptions and sample auxiliary info  
  
The filter watches the following custom data properties on incoming packets:  

- `grp_A4CC`: maps packet to sample group description of type `A4CC` and entry set to property payload  
- `grp_A4CC_param`: same as above and sets sample to group `grouping_type_parameter` to `param`  
- `sai_A4CC`: adds property payload as sample auxiliary information of type `A4CC`  
- `sai_A4CC_param`: same as above and sets `aux_info_type_parameter`to `param`  

    
The property `grp_EMSG` consists in one or more `EventMessageBox` as defined in MPEG-DASH.  

- in fragmented mode, presence of this property in a packet will start a new fragment, with the boxes written before the `moof`  
- in regular mode, an internal sample group of type `EMSG` is currently used for `emsg` box storage  

    

# Notes  
  
The filter watches the property `FileNumber` on incoming packets to create new files (regular mode) or new segments (DASH mode).  
    
The filter watches the property `DSIWrap` (4CC as int or string) on incoming PID to wrap decoder configuration in a box of given type (unknown wrapping)  
Example
```
-i unkn.mkv:#ISOMSubtype=VIUK:#DSIWrap=cfgv -o t.mp4
```
  
This will wrap the unknown stream using `VIUK` code point in `stsd` and wrap any decoder configuration data in a `cfgv` box.  
  
If [pad_sparse](#pad_sparse) is set, the filter watches the property `Sparse` on incoming PID to decide whether empty packets should be injected to keep packet duration info.  
Such packets are only injected when a whole in the timeline is detected.  

- if `Sparse` is absent, empty packet is inserted for unknown text and metadata streams  
- if `Sparse` is true, empty packet is inserted for all stream types  
- if `Sparse` is false, empty packet is never injected  

    
The default media type used for a PID can be overridden using property `StreamSubtype`.   
Example
```
-i src.srt:#StreamSubtype=sbtl [-i ...]  -o test.mp4 
```
  
This will force the text stream to use `sbtl` handler type instead of default `text` one.  
Subtitle streams may be used as chapters by setting the property `IsChap` on the desired PID.  
Example
```
-i src.srt:#IsChap  [-i ...] -o test.mp4 
```
  
This will force the text stream to be used as a QT chapter track.    
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="m4sys">__m4sys__</a> (bool, default: _false_): force MPEG-4 Systems signaling of tracks  
</div>  
<div markdown class="option">  
<a id="dref">__dref__</a> (bool, default: _false_): only reference data from source file - not compatible with all media sources  
</div>  
<div markdown class="option">  
<a id="ctmode">__ctmode__</a> (enum, default: _auto_): set composition offset mode for video tracks  

- auto: if fragmenting an ISOBMFF source, use source settings otherwise resolve to `edit`  
- edit: uses edit lists to shift first frame to presentation time 0  
- noedit: ignore edit lists and does not shift timeline  
- negctts: uses ctts v1 with possibly negative offsets and no edit lists  
</div>  
  
<div markdown class="option">  
<a id="dur" data-level="basic">__dur__</a> (frac, default: _0_): only import the specified duration. If negative, specify the number of coded frames to import  
</div>  
<div markdown class="option">  
<a id="pack3gp">__pack3gp__</a> (uint, default: _1_): pack a given number of 3GPP audio frames in one sample  
</div>  
<div markdown class="option">  
<a id="importer">__importer__</a> (bool, default: _false_): compatibility with old importer, displays import progress  
</div>  
<div markdown class="option">  
<a id="pack_nal">__pack_nal__</a> (bool, default: _false_): repack NALU size length to minimum possible size for NALU-based video (AVC/HEVC/...)  
</div>  
<div markdown class="option">  
<a id="xps_inband" data-level="basic">__xps_inband__</a> (enum, default: _no_): use inband (in sample data) parameter set for NALU-based video (AVC/HEVC/...)  

- no: parameter sets are not inband, several sample descriptions might be created  
- pps: picture parameter sets are inband, all other parameter sets are in sample description  
- all: parameter sets are inband, no parameter sets in sample description  
- both: parameter sets are inband, signaled as inband, and also first set is kept in sample description  
- mix: creates non-standard files using single sample entry with first PSs found, and moves other PS inband  
- auto: keep source config, or defaults to no if source is not ISOBMFF  
</div>  
  
<div markdown class="option">  
<a id="store" data-level="basic">__store__</a> (enum, default: _inter_): file storage mode  

- inter: perform precise interleave of the file using [cdur](#cdur) (requires temporary storage of all media)  
- flat: write samples as they arrive and `moov` at end (fastest mode)  
- fstart: write samples as they arrive and `moov` before `mdat`  
- tight: uses per-sample interleaving of all tracks (requires temporary storage of all media)  
- frag: fragments the file using cdur duration  
- sfrag: fragments the file using cdur duration but adjusting to start with SAP1/3  
</div>  
  
<div markdown class="option">  
<a id="cdur" data-level="basic">__cdur__</a> (frac, default: _-1/1_): chunk duration for flat and interleaving modes or fragment duration for fragmentation modes  

- 0: no specific interleaving but moov first  
- negative: defaults to 1.0 unless overridden by storage profile  
</div>  
  
<div markdown class="option">  
<a id="moovts">__moovts__</a> (sint, default: _600_): timescale to use for movie. A negative value picks the media timescale of the first track added  
</div>  
<div markdown class="option">  
<a id="moof_first">__moof_first__</a> (bool, default: _true_): generate fragments starting with moof then mdat  
</div>  
<div markdown class="option">  
<a id="abs_offset">__abs_offset__</a> (bool, default: _false_): use absolute file offset in fragments rather than offsets from moof  
</div>  
<div markdown class="option">  
<a id="fsap">__fsap__</a> (bool, default: _true_): split truns in video fragments at SAPs to reduce file size  
</div>  
<div markdown class="option">  
<a id="subs_sidx">__subs_sidx__</a> (sint, default: _-1_): number of subsegments per sidx  

- 0: single sidx  
- >0: hierarchical or daisy-chained sidx  
- <0: disables sidx  
- -2: removes sidx if present in source PID  
</div>  
  
<div markdown class="option">  
<a id="m4cc">__m4cc__</a> (str): 4 character code of empty box to append at the end of a segment (DASH mode) or of a fragment (non-DASH mode)  
</div>  
<div markdown class="option">  
<a id="chain_sidx">__chain_sidx__</a> (bool, default: _false_): use daisy-chaining of SIDX  
</div>  
<div markdown class="option">  
<a id="msn" data-level="basic">__msn__</a> (uint, default: _1_): sequence number of first moof to N  
</div>  
<div markdown class="option">  
<a id="msninc" data-level="basic">__msninc__</a> (uint, default: _1_): sequence number increase between `moof` boxes  
</div>  
<div markdown class="option">  
<a id="tfdt" data-level="basic">__tfdt__</a> (lfrac, default: _0_): set initial decode time (`tfdt`) of first traf  
</div>  
<div markdown class="option">  
<a id="tfdt_traf" data-level="basic">__tfdt_traf__</a> (bool, default: _false_): force `tfdt` box in each traf  
</div>  
<div markdown class="option">  
<a id="nofragdef" data-level="basic">__nofragdef__</a> (bool, default: _false_): disable default fragment flags in initial `moov`  
</div>  
<div markdown class="option">  
<a id="straf">__straf__</a> (bool, default: _false_): use a single traf per moof (smooth streaming and co)  
</div>  
<div markdown class="option">  
<a id="strun">__strun__</a> (bool, default: _false_): use a single trun per traf (smooth streaming and co)  
</div>  
<div markdown class="option">  
<a id="prft">__prft__</a> (enum, default: _sender_): set `prft` box mode, disabled if not fragmented mode  

- off: disable `prft` box  
- sender: put ntp time before encoder  
- both: put sender time (if available) and ntp time when writing the moof  
</div>  
  
<div markdown class="option">  
<a id="psshs">__psshs__</a> (enum, default: _moov_): set `pssh` boxes store mode  

- moof: in first moof of each segments  
- moov: in movie box  
- both: in movie box and in first moof of each segment  
- none: pssh is discarded  
</div>  
  
<div markdown class="option">  
<a id="sgpd_traf">__sgpd_traf__</a> (bool, default: _false_): store sample group descriptions in traf (duplicated for each traf). If not used, sample group descriptions are stored in the movie box  
</div>  
<div markdown class="option">  
<a id="vodcache" data-level="basic">__vodcache__</a> (enum, default: _replace_): enable temp storage for VoD dash modes  

- on: use temp storage of complete file for sidx and ssix injection  
- insert: insert sidx and ssix by shifting bytes in output file  
- replace: precompute pace requirements for sidx and ssix and rewrite file range at end  
</div>  
  
<div markdown class="option">  
<a id="noinit">__noinit__</a> (bool, default: _false_): do not produce initial `moov`, used for DASH bitstream switching mode  
</div>  
<div markdown class="option">  
<a id="tktpl">__tktpl__</a> (enum, default: _yes_): use track box from input if any as a template to create new track  

- no: disables template  
- yes: clones the track (except edits and decoder config)  
- udta: only loads udta  
</div>  
  
<div markdown class="option">  
<a id="mudta">__mudta__</a> (enum, default: _yes_): use `udta` and other `moov` extension boxes from input if any  

- no: disables import  
- yes: clones all extension boxes  
- udta: only loads udta  
</div>  
  
<div markdown class="option">  
<a id="mvex">__mvex__</a> (bool, default: _false_): set `mvex` boxes after `trak` boxes  
</div>  
<div markdown class="option">  
<a id="sdtp_traf">__sdtp_traf__</a> (enum, default: _no_): use `sdtp` box in `traf` box rather than using flags in trun sample entries  

- no: do not use `sdtp`  
- sdtp: use `sdtp` box to indicate sample dependencies and do not write info in `trun` sample flags  
- both: use `sdtp` box to indicate sample dependencies and also write info in `trun` sample flags  
</div>  
  
<div markdown class="option">  
<a id="trackid">__trackid__</a> (uint, default: _0_): track ID of created track for single track. Default 0 uses next available trackID  
</div>  
<div markdown class="option">  
<a id="fragdur">__fragdur__</a> (bool, default: _false_): fragment based on fragment duration rather than CTS. Mostly used for `MP4Box -frag` option  
</div>  
<div markdown class="option">  
<a id="btrt" data-level="basic">__btrt__</a> (bool, default: _true_): set `btrt` box in sample description  
</div>  
<div markdown class="option">  
<a id="styp" data-level="basic">__styp__</a> (str): set segment `styp` major brand (and optionally version) to the given 4CC[.version]  
</div>  
<div markdown class="option">  
<a id="lmsg" data-level="basic">__lmsg__</a> (bool, default: _false_): set `lmsg` brand for the last segment or fragment  
</div>  
<div markdown class="option">  
<a id="mediats" data-level="basic">__mediats__</a> (sint, default: _0_): set media timescale. A value of 0 means inherit from PID, a value of -1 means derive from samplerate or frame rate  
</div>  
<div markdown class="option">  
<a id="ase" data-level="basic">__ase__</a> (enum, default: _v0_): set audio sample entry mode for more than stereo layouts  

- v0: use v0 signaling with channel count from stream (except for (e)AC3), recommended for backward compatibility  
- v0s: use v0 signaling and force channel count to 2 (stereo) if more than 2 channels  
- v0bs: use v0 signaling from bitstream only  
- v1: use v1 signaling, ISOBMFF style (will mux raw PCM as ISOBMFF style)  
- v1qt: use v1 signaling, QTFF style  
- v2qt: use v2 signaling, QTFF style (lpcm entry type)  
</div>  
  
<div markdown class="option">  
<a id="ssix">__ssix__</a> (bool, default: _false_): create `ssix` box when `sidx` box is present, level 1 mapping I-frames byte ranges, level 0xFF mapping the rest  
</div>  
<div markdown class="option">  
<a id="ccst">__ccst__</a> (bool, default: _false_): insert coding constraint box for video tracks  
</div>  
<div markdown class="option">  
<a id="maxchunk">__maxchunk__</a> (uint, default: _0_): set max chunk size in bytes for runs (only used in non-fragmented mode). 0 means no constraints  
</div>  
<div markdown class="option">  
<a id="noroll">__noroll__</a> (bool, default: _false_): disable roll sample grouping  
</div>  
<div markdown class="option">  
<a id="norap">__norap__</a> (bool, default: _false_): disable rap sample grouping  
</div>  
<div markdown class="option">  
<a id="saio32">__saio32__</a> (bool, default: _false_): use 32 bit offset for side data location instead of 64 bit offset  
</div>  
<div markdown class="option">  
<a id="tfdt64">__tfdt64__</a> (bool, default: _false_): use 64 bit tfdt and sidx even for 32 bits timestamps  
</div>  
<div markdown class="option">  
<a id="compress">__compress__</a> (enum, default: _no_): set top-level box compression mode  

- no: disable box compression  
- moov: compress only moov box (uses cmov for QT)  
- moof: compress only moof boxes  
- sidx: compress moof and sidx boxes  
- ssix: compress moof, sidx and ssix boxes  
- all: compress moov, moof, sidx and ssix boxes  
</div>  
  
<div markdown class="option">  
<a id="fcomp">__fcomp__</a> (bool, default: _false_): force using compress box even when compressed size is larger than uncompressed  
</div>  
<div markdown class="option">  
<a id="otyp">__otyp__</a> (bool, default: _false_): inject original file type when using compressed boxes  
</div>  
<div markdown class="option">  
<a id="trun_inter">__trun_inter__</a> (bool, default: _false_): interleave samples in `trun` based on the temporal level, the lowest level are stored first (this will create as many `trun` boxes as required)  
</div>  
<div markdown class="option">  
<a id="truns_first">__truns_first__</a> (bool, default: _false_): store track runs before sample group description and sample encryption information  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _10000_): target output block size, 0 for default internal value (10k)  
</div>  
<div markdown class="option">  
<a id="boxpatch">__boxpatch__</a> (str): apply box patch before writing  
</div>  
<div markdown class="option">  
<a id="deps">__deps__</a> (bool, default: _true_): add samples dependencies information  
</div>  
<div markdown class="option">  
<a id="mfra">__mfra__</a> (bool, default: _false_): enable movie fragment random access when fragmenting (ignored when dashing)  
</div>  
<div markdown class="option">  
<a id="forcesync">__forcesync__</a> (bool, default: _false_): force all SAP types to be considered sync samples (might produce non-compliant files)  
</div>  
<div markdown class="option">  
<a id="refrag">__refrag__</a> (bool, default: _false_): use track fragment defaults from initial file if any rather than computing them from PID properties (used when processing standalone segments/fragments)  
</div>  
<div markdown class="option">  
<a id="itags">__itags__</a> (enum, default: _strict_): tag injection mode  

- none: do not inject tags  
- strict: only inject recognized itunes tags  
- all: inject all possible tags  
</div>  
  
<div markdown class="option">  
<a id="keep_utc">__keep_utc__</a> (bool, default: _false_): force all new files and tracks to keep the source UTC creation and modification times  
</div>  
<div markdown class="option">  
<a id="pps_inband">__pps_inband__</a> (bool, default: _no_): when [xps_inband](#xps_inband) is set, inject PPS in each non SAP 1/2/3 sample  
</div>  
<div markdown class="option">  
<a id="moovpad">__moovpad__</a> (uint, default: _0_): insert `free` box of given size after `moov` for future in-place editing  
</div>  
<div markdown class="option">  
<a id="cmaf">__cmaf__</a> (enum, default: _no_): use CMAF guidelines (turns on `mvex`, `truns_first`, `strun`, `straf`, `tfdt_traf`, `chain_sidx` and restricts `subs_sidx` to -1 or 0)  

- no: CMAF not enforced  
- cmfc: use CMAF `cmfc` guidelines  
- cmf2: use CMAF `cmf2` guidelines (turns on `nofragdef`)  
</div>  
  
<div markdown class="option">  
<a id="pad_sparse">__pad_sparse__</a> (bool, default: _true_): inject sample with no data (size 0) to keep durations in unknown sparse text and metadata tracks  
</div>  
<div markdown class="option">  
<a id="force_dv">__force_dv__</a> (bool, default: _false_): force DV sample entry types even when AVC/HEVC compatibility is signaled  
</div>  
<div markdown class="option">  
<a id="dvsingle">__dvsingle__</a> (bool, default: _false_): ignore DolbyVision profile 8 in xps inband mode if profile 5 is already set  
</div>  
<div markdown class="option">  
<a id="tsalign">__tsalign__</a> (bool, default: _true_): enable timeline realignment to 0 for first sample - if false, this will keep original timing with empty edit (possibly long) at begin  
</div>  
<div markdown class="option">  
<a id="chapm">__chapm__</a> (enum, default: _both_): chapter storage mode  

- off: disable chapters  
- tk: use chapter track (QT-style)  
- udta: use user-data box chapters  
- both: use both chapter tracks and udta  
</div>  
  
<div markdown class="option">  
<a id="patch_dts">__patch_dts__</a> (bool, default: _false_): patch previous samples duration when dts do not increase monotonically  
</div>  
<div markdown class="option">  
<a id="uncv">__uncv__</a> (enum, default: _prof_): use uncv (ISO 23001-17) for raw video  

- off: disabled (always the case when muxing to QT)  
- gen: enabled, do not write profile  
- prof: enabled and write profile if known  
- tiny: enabled and write reduced version if profile known and compatible  
</div>  
  
<div markdown class="option">  
<a id="trunv1">__trunv1__</a> (bool, default: _false_): force using version 1 of trun regardless of media type or CMAF brand  
</div>  
<div markdown class="option">  
<a id="rsot">__rsot__</a> (bool, default: _false_): inject redundant sample timing information when present  
</div>  
  
