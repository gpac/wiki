<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# Importing Options  
  
# File importing  
  
Syntax is [-add](#add) / [-cat](#cat) `URL[#FRAGMENT][:opt1...:optN=val]`  
This process will create the destination file if not existing, and add the track(s) to it. If you wish to always create a new destination file, add [-new](mp4box-gen-opts/#new).  
The supported input media types depend on your installation, check [filters documentation](Filters) for more info.  
    
To select a desired media track from a source, a fragment identifier '#' can be specified, before any other options. The following syntax is used:  
* `#video`: adds the first video track found in source  
* `#audio`: adds the first audio track found in source  
* `#auxv`: adds the first auxiliary video track found in source  
* `#pict`: adds the first picture track found in source  
* `#trackID=ID` or `#ID`: adds the specified track. For IsoMedia files, ID is the track ID. For other media files, ID is the value indicated by `MP4Box -info inputFile`  
* `#pid=ID`: number of desired PID for MPEG-2 TS sources  
* `#prog_id=ID`: number of desired program for MPEG-2 TS sources  
* `#program=NAME`: name of desired program for MPEG-2 TS sources  
    
By default all imports are performed sequentially, and final interleaving is done at the end; this however requires a temporary file holding original ISOBMF file (if any) and added files before creating the final output. Since this can become quite large, it is possible to add media to a new file without temporary storage, using [-flat](mp4box-gen-opts/#flat) option, but this disables media interleaving.  
    
If you wish to create an interleaved new file with no temporary storage, use the [-newfs](mp4box-gen-opts/#newfs) option. The interleaving might not be as precise as when using [-new](#new) since it is dependent on multiplexer input scheduling (each execution might lead to a slightly different result). Additionally in this mode:   
 - Some multiplexing options (marked with `X` below) will be activated for all inputs (e.g. it is not possible to import one AVC track with `xps_inband` and another without).  
 - Some multiplexing options (marked as `D` below) cannot be used as they require temporary storage for file edition.  
 - Usage of [-cat](#cat) is possible, but concatenated sources will not be interleaved in the output. If you wish to perform more complex cat/add operations without temp file, use a [playlist](flist).  
    
Source URL can be any URL supported by GPAC, not limited to local files.  
    
_Note: When importing SRT or SUB files, MP4Box will choose default layout options to make the subtitle appear at the bottom of the video. You SHOULD NOT import such files before any video track is added to the destination file, otherwise the results will likely not be useful (default SRT/SUB importing uses default serif font, fontSize 18 and display size 400x60). For more details, check [TTXT doc](Subtitling-with-GPAC)._  
    
When importing several tracks/sources in one pass, all options will be applied if relevant to each source. These options are set for all imported streams. If you need to specify these options per stream, set per-file options using the syntax `-add stream[:opt1:...:optN]`.  
    
The import file name may be set to empty or `self`, indicating that the import options should be applied to the destination file track(s).  
Example
```
-add self:moovts=-1:noedit src.mp4
```  
This will apply `moovts` and `noedit` option to all tracks in src.mp4  
Example
```
-add self#2:moovts=-1:noedit src.mp4
```  
This will apply `moovts` and `noedit` option to track with `ID=2` in src.mp4  
Only per-file options marked with a `S` are possible in this mode.  
    
When importing an ISOBMFF/QT file, only options marked as `C` or `S` can be used.  
    
Allowed per-file options:  
  
__dur__ (int):                 `XC` import only the specified duration from the media. Value can be:  
  * positive float: specifies duration in seconds  
  * fraction: specifies duration as NUM/DEN fraction  
  * negative integer: specifies duration in number of coded frames  
  
__start__ (number):            `C` target start time in source media, may not be supported depending on the source  
__lang__ (string):             `S` set imported media language code  
__delay__ (int):               `S` set imported media initial delay (>0) or initial skip (<0) in ms or as fractional seconds (`N/D`)  
__par__ (string):              `S` set visual pixel aspect ratio (see [-par](mp4box-gen-opts/#par) )  
__clap__ (string):             `S` set visual clean aperture (see [-clap](mp4box-gen-opts/#clap) )  
__mx__ (string):               `S` set track matrix (see [-mx](mp4box-gen-opts/#mx) )  
__name__ (string):             `S` set track handler name  
__ext__ (string):              override file extension when importing  
__hdlr__ (string):             `S` set track handler type to the given code point (4CC)  
__stype__ (string):            `S` force sample description type to given code point (4CC), may likely break the file  
__tkhd__ (int):                `S` set track header flags has hex integer or as comma-separated list of `enable`, `movie`, `preview`, `size_ar` keywords (use `tkhd+=FLAGS` to add and `tkhd-=FLAGS` to remove)  
__disable__:                   `S` disable imported track(s), use `disable=no` to force enabling a disabled track  
__group__ (int):               `S` add the track as part of the G alternate group. If G is 0, the first available GroupID will be picked  
__fps__ (string):              `S` same as [-fps](#fps)  
__rap__:                       `DS` import only RAP samples  
__refs__:                      `DS` import only reference pictures  
__trailing__:                  keep trailing 0-bytes in AVC/HEVC samples  
__agg__ (int):                 `X` same as [-agg](#agg)  
__dref__:                      `XC` same as [-dref](#dref)  
__keep_refs__:                 `C` keep track reference when importing a single track  
__nodrop__:                    same as [-nodrop](#nodrop)  
__packed__:                    `X` same as [-packed](#packed)  
__sbr__:                       same as [-sbr](#sbr)  
__sbrx__:                      same as [-sbrx](#sbrx)  
__ovsbr__:                     same as [-ovsbr](#ovsbr)  
__ps__:                        same as [-ps](#ps)  
__psx__:                       same as [-psx](#psx)  
__asemode__ (string):          `XS` set the mode to create the AudioSampleEntry. Value can be:  
  * v0-bs: use MPEG AudioSampleEntry v0 and the channel count from the bitstream (even if greater than 2) - default  
  * v0-2: use MPEG AudioSampleEntry v0 and the channel count is forced to 2  
  * v1: use MPEG AudioSampleEntry v1 and the channel count from the bitstream  
  * v1-qt: use QuickTime Sound Sample Description Version 1 and the channel count from the bitstream (even if greater than 2). This will also trigger using alis data references instead of url, even for non-audio tracks  
  
__audio_roll__ (int):          `S` add a roll sample group with roll_distance `N` for audio tracks  
__roll__ (int):                `S` add a roll sample group with roll_distance `N`  
__proll__ (int):               `S` add a preroll sample group with roll_distance `N`  
__mpeg4__:                     `X` same as [-mpeg4](#mpeg4) option  
__nosei__:                     discard all SEI messages during import  
__svc__:                       import SVC/LHVC with explicit signaling (no AVC base compatibility)  
__nosvc__:                     discard SVC/LHVC data when importing  
__svcmode__ (string):          `DS` set SVC/LHVC import mode. Value can be:  
  * split: each layer is in its own track  
  * merge: all layers are merged in a single track  
  * splitbase: all layers are merged in a track, and the AVC base in another  
  * splitnox: each layer is in its own track, and no extractors are written  
  * splitnoxib: each layer is in its own track, no extractors are written, using inband param set signaling  
  
__temporal__ (string):         `DS` set HEVC/LHVC temporal sublayer import mode. Value can be:  
  * split: each sublayer is in its own track  
  * splitbase: all sublayers are merged in a track, and the HEVC base in another  
  * splitnox: each layer is in its own track, and no extractors are written  
  
__subsamples__:                add SubSample information for AVC+SVC  
__deps__:                      import sample dependency information for AVC and HEVC  
__ccst__:                      `S` add default HEIF ccst box to visual sample entry  
__forcesync__:                 force non IDR samples with I slices (OpenGOP or GDR) to be marked as sync points  

__Warning: RESULTING FILE IS NOT COMPLIANT WITH THE SPEC but will fix seeking in most players__  
  
__xps_inband__:                `XC` set xPS inband for AVC/H264 and HEVC (for reverse operation, re-import from raw media)  
__xps_inbandx__:               `XC` same as xps_inband and also keep first xPS in sample description  
__au_delim__:                  keep AU delimiter NAL units in the imported file  
__max_lid__ (int):             set HEVC max layer ID to be imported to `N` (by default imports all layers)  
__max_tid__ (int):             set HEVC max temporal ID to be imported to `N` (by default imports all temporal sublayers)  
__tiles__:                     `S` add HEVC tiles signaling and NALU maps without splitting the tiles into different tile tracks  
__split_tiles__:               `DS` split HEVC tiles into different tile tracks, one tile (or all tiles of one slice) per track  
__negctts__:                   `S` use negative CTS-DTS offsets (ISO4 brand). Use `negctts=no` to force using positive offset on existing track  
__chap__:                      `S` specify the track is a chapter track  
__chapter__ (string):          `S` add a single chapter (old nero format) with given name lasting the entire file  
__chapfile__ (string):         `S` add a chapter file (old nero format)  
__layout__ (string):           `S` specify the track layout as `WxH[xXxY][xLAYER]`. If `W` (resp `H`) is 0, the max width (resp height) of the tracks in the file are used  
__rescale__ (int):             `S` force media timescale to TS  (int or fraction) and change the media duration  
__sampdur__ (int):             `S` force all samples duration (`D`) or sample durations and media timescale (`D/TS`), used to patch CFR files with broken timings  
__timescale__ (int):           `S` set imported media timescale to TS  
__moovts__ (int):              `S` set movie timescale to TS. A negative value picks the media timescale of the first track imported  
__noedit__:                    `XS` do not set edit list when importing B-frames video tracks  
__rvc__ (string):              `S` set RVC configuration for the media  
__fmt__ (string):              override format detection with given format - disable data probing and force `ext` option on source  
  
__profile__ (int):             `S` override AVC profile. Integer value, or `high444`, `high`, `extended`, `main`, `baseline`  
__level__ (int):               `S` override AVC level, if value < 6, interpreted as decimal expression  
__compat__ (int):              `S` force the profile compatibility flags for the H.264 content  
__novpsext__:                  remove VPS extensions from HEVC VPS  
__keepav1t__:                  keep AV1 temporal delimiter OBU in samples, might help if source file had losses  
__dlba__ (string):             `S` force DolbyAtmos mode for EAC3. Value can be  
* no: disable Atmos signaling  
* auto: use Atmos signaling from first sample  
* N: force Atmos signaling using compatibility type index N  
  
__font__ (string):             specify font name for text import (default `Serif`)  
__size__ (int):                specify font size for text import (default `18`)  
__text_layout__ (string):      specify the track text layout as WxHxXxY  
  * if W (resp H) = 0: the max width (resp height) of the tracks in the file are used  
  * if Y=-1: the layout is moved to the bottom of the track area  
  * X and Y can be omitted: `:layout=WxH`  
  
__swf-global__:                all SWF defines are placed in first scene replace rather than when needed  
__swf-no-ctrl__:               use a single stream for movie control and dictionary (this will disable ActionScript)  
__swf-no-text__:               remove all SWF text  
__swf-no-font__:               remove all embedded SWF Fonts (local playback host fonts used)  
__swf-no-line__:               remove all lines from SWF shapes  
__swf-no-grad__:               remove all gradients from SWF shapes  
__swf-quad__:                  use quadratic bezier curves instead of cubic ones  
__swf-xlp__:                   support for lines transparency and scalability  
__swf-ic2d__:                  use indexed curve 2D hardcoded proto  
__swf-same-app__:              appearance nodes are reused  
__swf-flatten__ (number):      complementary angle below which 2 lines are merged, `0` means no flattening  
__kind__ (string):             `S` set kind for the track as `schemeURI=value`  
__txtflags__ (int):            set display flags (hexa number) of text track. Use `txtflags+=FLAGS` to add flags and `txtflags-=FLAGS` to remove flags  
__rate__ (int):                force average rate and max rate to VAL (in bps) in btrt box. If 0, removes btrt box  
__stz2__:                      `S` use compact size table (for low-bitrates)  
__bitdepth__ (int):            set bit depth to VAL for imported video content (default is 24)  
__colr__ (string):             `S` set color profile for imported video content. Value is formatted as:  
  * nclc,p,t,m: with `p` colour primary (int or string), `t` transfer characteristics (int or string) and `m` matrix coef (int or string), cf `-h cicp`  
  * nclx,p,t,m,r: same as `nclx` with r full range flag (`yes`, `on` or `no`, `off`)  
  * prof,path: with path indicating the file containing the ICC color profile  
  * rICC,path: with path indicating the file containing the restricted ICC color profile  
  * 'none': removes color info  
  
__hdr__ (string):              `S` set HDR info on track (see [-hdr](mp4box-gen-opts/#hdr) ), 'none' removes HDR info  
__dvp__,__-dv-profile__ (string): `S` set the Dolby Vision profile on imported track  
- Profile is an integer, or `none` to remove DV signaling  
- Profile can be suffixed with compatibility ID, e.g. `5.hdr10`  
- Allowed compatibility ID are `none`, `hdr10`, `bt709`, `hlg709`, `hlg2100`, `bt2020`, `brd`, or integer value as per DV spec  
- Profile can be prefixed with 'f' to force DV codec type signaling, e.g. `f8.2`  
  
__fullrange__ (string):        `S` force the video fullrange type in VUI for the AVC|H264 content (value `yes`, `on` or `no`, `off`)  
__videofmt__ (string):         `S` force the video format in VUI for AVC|H264 and HEVC content, value can be `component`, `pal`, `ntsc`, `secam`, `mac`, `undef`  
__colorprim__ (string):        `S` force the colour primaries in VUI for AVC|H264 and HEVC (int or string, cf `-h cicp`)  
__colortfc__ (string):         `S` force transfer characteristics in VUI for AVC|H264 and HEVC (int or string, cf `-h cicp`)  
__colormx__ (string):          `S` force the matrix coefficients in VUI for the AVC|H264 and HEVC content (int or string, cf `-h cicp`)  
__tc__ (string):               `S` inject a single QT timecode. Value is formatted as:  
  * [d]FPS[/FPS_den],h,m,s,f[,framespertick]: optional drop flag, framerate (integer or fractional), hours, minutes, seconds and frame number  
  * : `d` is an optional flag used to indicate that the counter is in drop-frame format  
  * : the `framespertick` is optional and defaults to round(framerate); it indicates the number of frames per counter tick  
  
__edits__ (string):            `S` override edit list, same syntax as [-edits](#edits)  
__lastsampdur__ (string):      `S` set duration of the last sample. Value is formatted as:  
  * no value: use the previous sample duration  
  * integer: indicate the duration in milliseconds  
  * N/D: indicate the duration as fractional second  
  
__ID__ (int):                  `S` set target ID  
  - a value of 0 (default) will try to keep source track ID  
  - a value of -1 will ignore source track ID  
  - other value will try to set track ID to this value if no other track with same ID is present  
  
__tkgp__ (string):             `S` assign track group to track. Value is formatted as `TYPE,N` with TYPE the track group type (4CC) and N the track group ID. A negative ID removes from track group ID -N  
__tkidx__ (string):            `S` set track position in track list, 1 being first track in file  
__stats__,__-fstat__:          `C` print filter session stats after import  
__graph__,__-fgraph__:         `C` print filter session graph after import  
__sopt:[OPTS]__:               set `OPTS` as additional arguments to source filter. `OPTS` can be any usual filter argument, see [filter doc `gpac -h doc`](Filters)  
__dopt:[OPTS]__:               `X` set `OPTS` as additional arguments to [destination filter](mp4mx). OPTS can be any usual filter argument, see [filter doc `gpac -h doc`](Filters)  
__@f1[:args][@fN:args]__:      set a filter chain to insert before the multiplexer. Each filter in the chain is formatted as a regular filter, see [filter doc `gpac -h doc`](Filters). A `@@` separator starts a new chain (see DASH help). The last filter in each chain shall not have any ID specified  
  
_Note: `sopt`, `dopt` and `@f` must be placed after all other options._  

# Global import options  
  
<a id="add">__-add__</a> (string): add given file tracks to file. Multiple inputs can be specified using `+`, e.g. `-add url1+url2`  
<a id="cat">__-cat__</a> (string): concatenate given file samples to file, creating tracks if needed. Multiple inputs can be specified using `+`, e.g/ `-cat url1+url2`.    
_Note: This aligns initial timestamp of the file to be concatenated_  
<a id="catx">__-catx__</a> (string): same as [-cat](#cat) but new tracks can be imported before concatenation by specifying `+ADD_COMMAND` where `ADD_COMMAND` is a regular [-add](#add) syntax  
<a id="catpl">__-catpl__</a> (string): concatenate files listed in the given playlist file (one file per line, lines starting with # are comments).    
_Note: Each listed file is concatenated as if called with -cat_  
<a id="unalign-cat">__-unalign-cat__</a>: do not attempt to align timestamps of samples in-between tracks  
<a id="force-cat">__-force-cat__</a>: skip media configuration check when concatenating file.    

__Warning: THIS MAY BREAK THE CONCATENATED TRACK(S)__  
  
<a id="keep-sys">__-keep-sys__</a>: keep all MPEG-4 Systems info when using [-add](#add) and [-cat](#cat) (only used when adding IsoMedia files)  
<a id="dref">__-dref__</a>:    keep media data in original file using `data referencing`. The resulting file only contains the meta-data of the presentation (frame sizes, timing, etc...) and references media data in the original file. This is extremely useful when developing content, since importing and storage of the MP4 file is much faster and the resulting file much smaller.    
_Note: Data referencing may fail on some files because it requires the framed data (e.g. an IsoMedia sample) to be continuous in the original file, which is not always the case depending on the original interleaving or bitstream format (_AVC_ or _HEVC_ cannot use this option)_  
<a id="no-drop">__-no-drop__</a>,__-nodrop__: force constant FPS when importing AVI video  
<a id="packed">__-packed__</a>: force packed bitstream when importing raw MPEG-4 part 2 Advanced Simple Profile  
<a id="sbr">__-sbr__</a>:      backward compatible signaling of AAC-SBR  
<a id="sbrx">__-sbrx__</a>:    non-backward compatible signaling of AAC-SBR  
<a id="ps">__-ps__</a>:        backward compatible signaling of AAC-PS  
<a id="psx">__-psx__</a>:      non-backward compatible signaling of AAC-PS  
<a id="ovsbr">__-ovsbr__</a>:  oversample SBR import (SBR AAC, PS AAC and oversampled SBR cannot be detected at import time)  
<a id="fps">__-fps__</a> (string): force frame rate for video and SUB subtitles import to the given value, expressed as a number, as `TS-inc` or `TS/inc`.    
_Note: For raw H263 import, default FPS is `15`, otherwise `25`. This is accepted for ISOBMFF import but `:rescale` option should be preferred_  
<a id="mpeg4">__-mpeg4__</a>:  force MPEG-4 sample descriptions when possible. For AAC, forces MPEG-4 AAC signaling even if MPEG-2  
<a id="agg">__-agg__</a> (int): aggregate N audio frames in 1 sample (3GP media only, maximum value is 15)  
