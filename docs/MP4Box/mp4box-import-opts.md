<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# Importing Options  
  
# File importing  
  
Syntax is [-add](#add) / [-cat](#cat) `URL[#FRAGMENT][:opt1...:optN=val]`  
This process will create the destination file if not existing, and add the track(s) to it. If you wish to always create a new destination file, add [-new](mp4box-gen-opts/#new).  
The supported input media types depend on your installation, check [filters documentation](Filters) for more info.  
    
To select a desired media track from a source, a fragment identifier '#' can be specified, before any other options. The following syntax is used:  

- ``#video``: adds the first video track found in source  
- ``#audio``: adds the first audio track found in source  
- ``#auxv``: adds the first auxiliary video track found in source  
- ``#pict``: adds the first picture track found in source  
- ``#trackID=ID` or `#ID``: adds the specified track. For IsoMedia files, ID is the track ID. For other media files, ID is the value indicated by `MP4Box -info inputFile`  
- ``#pid=ID``: number of desired PID for MPEG-2 TS sources  
- ``#prog_id=ID``: number of desired program for MPEG-2 TS sources  
- ``#program=NAME``: name of desired program for MPEG-2 TS sources  

    
By default all imports are performed sequentially, and final interleaving is done at the end; this however requires a temporary file holding original ISOBMF file (if any) and added files before creating the final output. Since this can become quite large, it is possible to add media to a new file without temporary storage, using [-flat](mp4box-gen-opts/#flat) option, but this disables media interleaving.  
    
If you wish to create an interleaved new file with no temporary storage, use the [-newfs](mp4box-gen-opts/#newfs) option. The interleaving might not be as precise as when using [-new](mp4box-gen-opts/#new) since it is dependent on multiplexer input scheduling (each execution might lead to a slightly different result). Additionally in this mode:   

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
    
When importing as an external track, only options marked as `E` can be used.  
    
Allowed per-file options:  
  
<div markdown class="option">
__dur__ (int):                 `XCE` import only the specified duration from the media. Value can be:  

    - positive float: specifies duration in seconds  
    - fraction: specifies duration as NUM/DEN fraction  
    - negative integer: specifies duration in number of coded frames  
</div>
  
<div markdown class="option">
__start__ (number):            `C` target start time in source media, may not be supported depending on the source  
</div>
<div markdown class="option">
__lang__ (string):             `SE` set imported media language code  
</div>
<div markdown class="option">
__delay__ (int):               `SE` set imported media initial delay (>0) or initial skip (<0) in ms or as fractional seconds (`N/D`)  
</div>
<div markdown class="option">
__par__ (string):              `S` set visual pixel aspect ratio (see [-par](mp4box-gen-opts/#par) )  
</div>
<div markdown class="option">
__clap__ (string):             `S` set visual clean aperture (see [-clap](mp4box-gen-opts/#clap) )  
</div>
<div markdown class="option">
__mx__ (string):               `SE` set track matrix (see [-mx](mp4box-gen-opts/#mx) )  
</div>
<div markdown class="option">
__name__ (string):             `S` set track handler name  
</div>
<div markdown class="option">
__ext__ (string):              override file extension when importing  
</div>
<div markdown class="option">
__hdlr__ (string):             `S` set track handler type to the given code point (4CC)  
</div>
<div markdown class="option">
__stype__ (string):            `S` force sample description type to given code point (4CC), may likely break the file  
</div>
<div markdown class="option">
__tkhd__ (int):                `SE` set track header flags has hex integer or as comma-separated list of `enable`, `movie`, `preview`, `size_ar` keywords (use `tkhd+=FLAGS` to add and `tkhd-=FLAGS` to remove)  
</div>
<div markdown class="option">
__disable__:                   `SE` disable imported track(s), use `disable=no` to force enabling a disabled track  
</div>
<div markdown class="option">
__group__ (int):               `SE` add the track as part of the G alternate group. If G is 0, the first available GroupID will be picked  
</div>
<div markdown class="option">
__fps__ (string):              `S` same as [-fps](#fps)  
</div>
<div markdown class="option">
__rap__:                       `DS` import only RAP samples  
</div>
<div markdown class="option">
__refs__:                      `DS` import only reference pictures  
</div>
<div markdown class="option">
__trailing__:                  keep trailing 0-bytes in AVC/HEVC samples  
</div>
<div markdown class="option">
__agg__ (int):                 `X` same as [-agg](#agg)  
</div>
<div markdown class="option">
__dref__:                      `XC` same as [-dref](#dref)  
</div>
<div markdown class="option">
__keep_refs__:                 `C` keep track reference when importing a single track  
</div>
<div markdown class="option">
__nodrop__:                    same as [-no-drop](#no-drop)  
</div>
<div markdown class="option">
__packed__:                    `X` same as [-packed](#packed)  
</div>
<div markdown class="option">
__sbr__:                       same as [-sbr](#sbr)  
</div>
<div markdown class="option">
__sbrx__:                      same as [-sbrx](#sbrx)  
</div>
<div markdown class="option">
__ovsbr__:                     same as [-ovsbr](#ovsbr)  
</div>
<div markdown class="option">
__ps__:                        same as [-ps](#ps)  
</div>
<div markdown class="option">
__psx__:                       same as [-psx](#psx)  
</div>
<div markdown class="option">
__asemode__ (string):          `XS` set the mode to create the AudioSampleEntry. Value can be:  

    - v0-bs: use MPEG AudioSampleEntry v0 and the channel count from the bitstream (even if greater than 2) - default  
    - v0-2: use MPEG AudioSampleEntry v0 and the channel count is forced to 2  
    - v1: use MPEG AudioSampleEntry v1 and the channel count from the bitstream  
    - v1-qt: use QuickTime Sound Sample Description Version 1 and the channel count from the bitstream (even if greater than 2). This will also trigger using alis data references instead of url, even for non-audio tracks  
</div>
  
<div markdown class="option">
__audio_roll__ (int):          `S` add a roll sample group with roll_distance `N` for audio tracks  
</div>
<div markdown class="option">
__roll__ (int):                `S` add a roll sample group with roll_distance `N`  
</div>
<div markdown class="option">
__proll__ (int):               `S` add a preroll sample group with roll_distance `N`  
</div>
<div markdown class="option">
__mpeg4__:                     `X` same as [-mpeg4](#mpeg4) option  
</div>
<div markdown class="option">
__nosei__:                     discard all SEI messages during import  
</div>
<div markdown class="option">
__svc__:                       import SVC/LHVC with explicit signaling (no AVC base compatibility)  
</div>
<div markdown class="option">
__nosvc__:                     discard SVC/LHVC data when importing  
</div>
<div markdown class="option">
__svcmode__ (string):          `DS` set SVC/LHVC import mode. Value can be:  

    - split: each layer is in its own track  
    - merge: all layers are merged in a single track  
    - splitbase: all layers are merged in a track, and the base in another  
    - splitnox: each layer is in its own track, and no extractors are written  
    - splitnoxib: each layer is in its own track, no extractors are written, using inband param set signaling  
</div>
  
<div markdown class="option">
__temporal__ (string):         `DS` set HEVC/LHVC temporal sublayer import mode. Value can be:  

    - split: each sublayer is in its own track  
    - splitbase: all sublayers are merged in a track, and the HEVC base in another  
    - splitnox: each layer is in its own track, and no extractors are written  
</div>
  
<div markdown class="option">
__subsamples__:                add SubSample information for AVC+SVC  
</div>
<div markdown class="option">
__deps__:                      import sample dependency information for AVC and HEVC  
</div>
<div markdown class="option">
__ccst__:                      `S` add default HEIF ccst box to visual sample entry  
</div>
<div markdown class="option">
__forcesync__:                 `SE` force non IDR samples with I slices (OpenGOP or GDR) to be marked as sync points  

__Warning: RESULTING FILE IS NOT COMPLIANT WITH THE SPEC but will fix seeking in most players__  
  
</div>
<div markdown class="option">
__xps_inband__:                `XC` set xPS inband for AVC/H264 and HEVC (for reverse operation, re-import from raw media)  
</div>
<div markdown class="option">
__xps_inbandx__:               `XC` same as xps_inband and also keep first xPS in sample description  
</div>
<div markdown class="option">
__au_delim__:                  keep AU delimiter NAL units in the imported file  
</div>
<div markdown class="option">
__max_lid__ (int):             set HEVC max layer ID to be imported to `N` (by default imports all layers)  
</div>
<div markdown class="option">
__max_tid__ (int):             set HEVC max temporal ID to be imported to `N` (by default imports all temporal sublayers)  
</div>
<div markdown class="option">
__tiles__:                     `S` add HEVC tiles signaling and NALU maps without splitting the tiles into different tile tracks  
</div>
<div markdown class="option">
__split_tiles__:               `DS` split HEVC tiles into different tile tracks, one tile (or all tiles of one slice) per track  
</div>
<div markdown class="option">
__negctts__:                   `S` use negative CTS-DTS offsets (ISO4 brand). Use `negctts=no` to force using positive offset on existing track  
</div>
<div markdown class="option">
__chap__:                      `SE` specify the track is a chapter track  
</div>
<div markdown class="option">
__chapter__ (string):          `SE` add a single chapter (old nero format) with given name lasting the entire file  
</div>
<div markdown class="option">
__chapfile__ (string):         `SE` add a chapter file (old nero format)  
</div>
<div markdown class="option">
__layout__ (string):           `SE` specify the track layout as `WxH[xXxY][xLAYER]`. If `W` (resp `H`) is 0, the max width (resp height) of the tracks in the file are used  
</div>
<div markdown class="option">
__rescale__ (int):             `S` force media timescale to TS  (int or fraction) and change the media duration  
</div>
<div markdown class="option">
__sampdur__ (int):             `S` force all samples duration (`D`) or sample durations and media timescale (`D/TS`), used to patch CFR files with broken timings  
</div>
<div markdown class="option">
__timescale__ (int):           `S` set imported media timescale to TS  
</div>
<div markdown class="option">
__moovts__ (int):              `SE` set movie timescale to TS. A negative value picks the media timescale of the first track imported  
</div>
<div markdown class="option">
__noedit__:                    `XS` do not set edit list when importing B-frames video tracks  
</div>
<div markdown class="option">
__rvc__ (string):              `S` set RVC configuration for the media  
</div>
<div markdown class="option">
__fmt__ (string):              override format detection with given format - disable data probing and force `ext` option on source  
</div>
  
<div markdown class="option">
__profile__ (int):             `S` override AVC profile. Integer value, or `high444`, `high`, `extended`, `main`, `baseline`  
</div>
<div markdown class="option">
__level__ (int):               `S` override AVC level, if value < 6, interpreted as decimal expression  
</div>
<div markdown class="option">
__compat__ (int):              `S` force the profile compatibility flags for the H.264 content  
</div>
<div markdown class="option">
__novpsext__:                  remove VPS extensions from HEVC VPS  
</div>
<div markdown class="option">
__keepav1t__:                  keep AV1 temporal delimiter OBU in samples, might help if source file had losses  
</div>
<div markdown class="option">
__dlba__ (string):             `S` force DolbyAtmos mode for EAC3. Value can be  

- no: disable Atmos signaling  
- auto: use Atmos signaling from first sample  
- N: force Atmos signaling using compatibility type index N  
</div>
  
<div markdown class="option">
__font__ (string):             specify font name for text import (default `Serif`)  
</div>
<div markdown class="option">
__size__ (int):                specify font size for text import (default `18`)  
</div>
<div markdown class="option">
__text_layout__ (string):      specify the track text layout as WxHxXxY  

    - if W (resp H) = 0: the max width (resp height) of the tracks in the file are used  
    - if Y=-1: the layout is moved to the bottom of the track area  
    - X and Y can be omitted: `:layout=WxH`  
</div>
  
<div markdown class="option">
__swf-global__:                all SWF defines are placed in first scene replace rather than when needed  
</div>
<div markdown class="option">
__swf-no-ctrl__:               use a single stream for movie control and dictionary (this will disable ActionScript)  
</div>
<div markdown class="option">
__swf-no-text__:               remove all SWF text  
</div>
<div markdown class="option">
__swf-no-font__:               remove all embedded SWF Fonts (local playback host fonts used)  
</div>
<div markdown class="option">
__swf-no-line__:               remove all lines from SWF shapes  
</div>
<div markdown class="option">
__swf-no-grad__:               remove all gradients from SWF shapes  
</div>
<div markdown class="option">
__swf-quad__:                  use quadratic bezier curves instead of cubic ones  
</div>
<div markdown class="option">
__swf-xlp__:                   support for lines transparency and scalability  
</div>
<div markdown class="option">
__swf-ic2d__:                  use indexed curve 2D hardcoded proto  
</div>
<div markdown class="option">
__swf-same-app__:              appearance nodes are reused  
</div>
<div markdown class="option">
__swf-flatten__ (number):      complementary angle below which 2 lines are merged, `0` means no flattening  
</div>
<div markdown class="option">
__kind__ (string):             `SE` set kind for the track as `schemeURI=value`  
</div>
<div markdown class="option">
__txtflags__ (int):            set display flags (hexa number) of text track. Use `txtflags+=FLAGS` to add flags and `txtflags-=FLAGS` to remove flags  
</div>
<div markdown class="option">
__rate__ (int):                force average rate and max rate to VAL (in bps) in btrt box. If 0, removes btrt box  
</div>
<div markdown class="option">
__stz2__:                      `S` use compact size table (for low-bitrates)  
</div>
<div markdown class="option">
__bitdepth__ (int):            set bit depth to VAL for imported video content (default is 24)  
</div>
<div markdown class="option">
__colr__ (string):             `S` set color profile for imported video content. Value is formatted as:  

    - nclc,p,t,m: with `p` colour primary (int or string), `t` transfer characteristics (int or string) and `m` matrix coef (int or string), cf `-h cicp`  
    - nclx,p,t,m,r: same as `nclx` with r full range flag (`yes`, `on` or `no`, `off`)  
    - prof,path: with path indicating the file containing the ICC color profile  
    - rICC,path: with path indicating the file containing the restricted ICC color profile  
    - 'none': removes color info  
</div>
  
<div markdown class="option">
__hdr__ (string):              `S` set HDR info on track (see [-hdr](mp4box-gen-opts/#hdr) ), 'none' removes HDR info  
</div>
<div markdown class="option">
__dvp__,__-dv-profile__ (string): `S` set the Dolby Vision profile on imported track  

- Profile is an integer, or `none` to remove DV signaling  
- Profile can be suffixed with compatibility ID, e.g. `5.hdr10`  
- Allowed compatibility ID are `none`, `hdr10`, `bt709`, `hlg709`, `hlg2100`, `bt2020`, `brd`, or integer value as per DV spec  
- Profile can be prefixed with 'f' to force DV codec type signaling, e.g. `f8.2`  
</div>
  
<div markdown class="option">
__fullrange__ (string):        `S` force the video fullrange type in VUI for the AVC|H264 content (value `yes`, `on` or `no`, `off`)  
</div>
<div markdown class="option">
__videofmt__ (string):         `S` force the video format in VUI for AVC|H264 and HEVC content, value can be `component`, `pal`, `ntsc`, `secam`, `mac`, `undef`  
</div>
<div markdown class="option">
__colorprim__ (string):        `S` force the colour primaries in VUI for AVC|H264 and HEVC (int or string, cf `-h cicp`)  
</div>
<div markdown class="option">
__colortfc__ (string):         `S` force transfer characteristics in VUI for AVC|H264 and HEVC (int or string, cf `-h cicp`)  
</div>
<div markdown class="option">
__colormx__ (string):          `S` force the matrix coefficients in VUI for the AVC|H264 and HEVC content (int or string, cf `-h cicp`)  
</div>
<div markdown class="option">
__tc__ (string):               `SE` inject a single QT timecode. Value is formatted as:  

    - [d]FPS[/FPS_den],h,m,s,f[,framespertick]: optional drop flag, framerate (integer or fractional), hours, minutes, seconds and frame number  
    - : `d` is an optional flag used to indicate that the counter is in drop-frame format  
    - : the `framespertick` is optional and defaults to round(framerate); it indicates the number of frames per counter tick  
</div>
  
<div markdown class="option">
__edits__ (string):            `SE` override edit list, same syntax as [-edits](mp4box-gen-opts/#edits)  
</div>
<div markdown class="option">
__lastsampdur__ (string):      `S` set duration of the last sample. Value is formatted as:  

    - no value: use the previous sample duration  
    - integer: indicate the duration in milliseconds  
    - N/D: indicate the duration as fractional second  
</div>
  
<div markdown class="option">
__ID__ (int):                  `SE` set target ID  

    - a value of 0 (default) will try to keep source track ID  
    - a value of -1 will ignore source track ID  
    - other value will try to set track ID to this value if no other track with same ID is present  
</div>
  
<div markdown class="option">
__tkgp__ (string):             `SE` assign track group to track. Value is formatted as `TYPE,N` with TYPE the track group type (4CC) and N the track group ID. A negative ID removes from track group ID -N  
</div>
<div markdown class="option">
__tkidx__ (string):            `SE` set track position in track list, 1 being first track in file  
</div>
<div markdown class="option">
__extk__:                      `CE` add track as external track  
</div>
<div markdown class="option">
__times__ (string):            `SE` modify timestamps using timestamp file specified in value. Timestamp file is formatted as:  

    - a line starting with `#` is a comment, in which `timescale=V` can be used to set timescale (1000 by default)  
    - empty lines are ignored  
    - one line per sample in decode order, formated as `cts` or `dts cts`  
</div>
  
<div markdown class="option">
__stats__,__-fstat__:          `C` print filter session stats after import  
</div>
<div markdown class="option">
__graph__,__-fgraph__:         `C` print filter session graph after import  
</div>
<div markdown class="option">
__sopt:[OPTS]__:               set `OPTS` as additional arguments to source filter. `OPTS` can be any usual filter argument, see [filter doc `gpac -h doc`](Filters)  
</div>
<div markdown class="option">
__dopt:[OPTS]__:               `X` set `OPTS` as additional arguments to [destination filter](mp4mx). OPTS can be any usual filter argument, see [filter doc `gpac -h doc`](Filters)  
</div>
<div markdown class="option">
__@f1[:args][@fN:args]__:      set a filter chain to insert before the multiplexer. Each filter in the chain is formatted as a regular filter, see [filter doc `gpac -h doc`](Filters). A `@@` separator starts a new chain (see DASH help). The last filter in each chain shall not have any ID specified  
</div>
  
_Note: `sopt`, `dopt` and `@f` must be placed after all other options._  

# Global import options  
  
<div markdown class="option">
<a id="add" data-level="basic">__-add__</a> (string): add given file tracks to file. Multiple inputs can be specified using `+`, e.g. `-add url1+url2`  
</div>
<div markdown class="option">
<a id="cat" data-level="basic">__-cat__</a> (string): concatenate given file samples to file, creating tracks if needed. Multiple inputs can be specified using `+`, e.g/ `-cat url1+url2`.    
_Note: This aligns initial timestamp of the file to be concatenated_  
</div>
<div markdown class="option">
<a id="catx" data-level="basic">__-catx__</a> (string): same as [-cat](#cat) but new tracks can be imported before concatenation by specifying `+ADD_COMMAND` where `ADD_COMMAND` is a regular [-add](#add) syntax  
</div>
<div markdown class="option">
<a id="catpl" data-level="basic">__-catpl__</a> (string): concatenate files listed in the given playlist file (one file per line, lines starting with # are comments).    
_Note: Each listed file is concatenated as if called with -cat_  
</div>
<div markdown class="option">
<a id="unalign-cat" data-level="basic">__-unalign-cat__</a>: do not attempt to align timestamps of samples in-between tracks  
</div>
<div markdown class="option">
<a id="force-cat" data-level="basic">__-force-cat__</a>: skip media configuration check when concatenating file.    

__Warning: THIS MAY BREAK THE CONCATENATED TRACK(S)__  
  
</div>
<div markdown class="option">
<a id="keep-sys" data-level="basic">__-keep-sys__</a>: keep all MPEG-4 Systems info when using [-add](#add) and [-cat](#cat) (only used when adding IsoMedia files)  
</div>
<div markdown class="option">
<a id="dref" data-level="basic">__-dref__</a>: keep media data in original file using `data referencing`. The resulting file only contains the meta-data of the presentation (frame sizes, timing, etc...) and references media data in the original file. This is extremely useful when developing content, since importing and storage of the MP4 file is much faster and the resulting file much smaller.    
_Note: Data referencing may fail on some files because it requires the framed data (e.g. an IsoMedia sample) to be continuous in the original file, which is not always the case depending on the original interleaving or bitstream format (_AVC_ or _HEVC_ cannot use this option)_  
</div>
<div markdown class="option">
<a id="no-drop" data-level="basic">__-no-drop__</a>,__-nodrop__: force constant FPS when importing AVI video  
</div>
<div markdown class="option">
<a id="packed" data-level="basic">__-packed__</a>: force packed bitstream when importing raw MPEG-4 part 2 Advanced Simple Profile  
</div>
<div markdown class="option">
<a id="sbr" data-level="basic">__-sbr__</a>: backward compatible signaling of AAC-SBR  
</div>
<div markdown class="option">
<a id="sbrx" data-level="basic">__-sbrx__</a>: non-backward compatible signaling of AAC-SBR  
</div>
<div markdown class="option">
<a id="ps" data-level="basic">__-ps__</a>: backward compatible signaling of AAC-PS  
</div>
<div markdown class="option">
<a id="psx" data-level="basic">__-psx__</a>: non-backward compatible signaling of AAC-PS  
</div>
<div markdown class="option">
<a id="ovsbr" data-level="basic">__-ovsbr__</a>: oversample SBR import (SBR AAC, PS AAC and oversampled SBR cannot be detected at import time)  
</div>
<div markdown class="option">
<a id="fps" data-level="basic">__-fps__</a> (string): force frame rate for video and SUB subtitles import to the given value, expressed as a number, as `TS-inc` or `TS/inc`.    
_Note: For raw H263 import, default FPS is `15`, otherwise `25`. This is accepted for ISOBMFF import but `:rescale` option should be preferred_  
</div>
<div markdown class="option">
<a id="mpeg4" data-level="basic">__-mpeg4__</a>: force MPEG-4 sample descriptions when possible. For AAC, forces MPEG-4 AAC signaling even if MPEG-2  
</div>
<div markdown class="option">
<a id="agg" data-level="basic">__-agg__</a> (int): aggregate N audio frames in 1 sample (3GP media only, maximum value is 15)  
</div>
