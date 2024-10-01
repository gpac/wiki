<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Sources concatenator  
  
Register name used to load filter: __flist__  
This filter may be automatically loaded during graph resolution.  
This filter requires the graph resolver to be activated.  
  
This filter can be used to play playlist files or a list of sources.  
  
The filter loads any source supported by GPAC: remote or local files or streaming sessions (TS, RTP, DASH or other).  
The filter demultiplexes inputs and recomputes input timestamps into a continuous timeline.  
At each new source, the filter tries to remap input PIDs to already declared output PIDs of the same type, if any, or declares new output PIDs otherwise. If no input PID matches the type of an output, no packets are send for that PID.  
  
# Source list mode  
  
The source list mode is activated by using `flist:srcs=f1[,f2]`, where f1 can be a file or a directory to enumerate.  
The syntax for directory enumeration is:  

- dir, dir/ or dir/*: enumerates everything in directory `dir`  
- foo/*.png: enumerates all files with extension png in directory `foo`  
- foo/*.png;*.jpg: enumerates all files with extension png or jpg in directory `foo`  

  
The resulting file list can be sorted using [fsort](#fsort).  
If the sort mode is `datex` and source files are images or single frame files, the following applies:  

- options [floop](#floop), [revert](#revert) and [fdur](#fdur) are ignored  
- the files are sorted by modification time  
- the first frame is assigned a timestamp of 0  
- each frame (coming from each file) is assigned a duration equal to the difference of modification time between the file and the next file  
- the last frame is assigned the same duration as the previous one  

  
When sorting by names:  

- shorter filenames are inserted before longer filenames  
- alphabetical sorting is used if same filename length  

  
# Playlist mode  
  
The playlist mode is activated when opening a playlist file (m3u format, utf-8 encoding, no BOM, default extensions `m3u`, `txt` or `pl`).  
In this mode, directives can be given in a comment line, i.e. a line starting with `#` before the line with the file name.  
Lines stating with `##` are ignored.  
  
The playlist file is refreshed whenever the next source has to be reloaded in order to allow for dynamic pushing of sources in the playlist.  
If the last URL played cannot be found in the playlist, the first URL in the playlist file will be loaded.  
  
When [ka](#ka) is used to keep refreshing the playlist on regular basis, the playlist must end with a new line.  
Playlist refreshing will abort:  

- if the input playlist has a line not ending with a LF `(\n)` character, in order to avoid asynchronous issues when reading the playlist.  
- if the input playlist has not been modified for the [timeout](#timeout) option value (infinite by default).  


## Playlist directives  
A playlist directive line can contain zero or more directives, separated with space. The following directives are supported:  

- repeat=N: repeats `N` times the content (hence played N+1).  
- start=T: tries to play the file from start time `T` seconds (double format only). This may not work with some files/formats not supporting seeking.  
- stop=T: stops source playback after `T` seconds (double format only). This works on any source (implemented independently from seek support).  
- cat: specifies that the following entry should be concatenated to the previous source rather than opening a new source. This can optionally specify a byte range if desired, otherwise the full file is concatenated.  

_Note: When sources are ISOBMFF files or segments on local storage or GF_FileIO objects, the concatenation will be automatically detected._  

- srange=T: when cat is set, indicates the start `T` (64 bit decimal, default 0) of the byte range from the next entry to concatenate.  
- send=T: when cat is set, indicates the end `T` (64 bit decimal, default 0) of the byte range from the next entry to concatenate.  
- props=STR: assigns properties described in `STR` to all PIDs coming from the listed sources on next line. `STR` is formatted according to `gpac -h doc` using the default parameter set.  
- del: specifies that the source file(s) must be deleted once processed, true by default if [fdel](#fdel) is set.  
- out=V: specifies splicing start time (cf below).  
- in=V: specifies splicing end time (cf below).  
- nosync: prevents timestamp adjustments when joining sources (implied if `cat` is set).  
- keep: keeps spliced period in output (cf below).  
- mark: only inject marker for the splice period and do not load any replacement content (cf below).  
- sprops=STR: assigns properties described in `STR` to all PIDs of the main content during a splice (cf below). `STR` is formatted according to `gpac -h doc` using the default parameter set.  
- chap=NAME: assigns chapter name at the start of next URL (filter always removes source chapter names).  

  
The following global options (applying to the filter, not the sources) may also be set in the playlist:  

- ka=N: force [ka](#ka) option to `N` millisecond refresh.  
- floop=N: set [floop](#floop) option from within playlist.  
- raw: set [raw](#raw) option from within playlist.  

  
The default behavior when joining sources is to realign the timeline origin of the new source to the maximum time in all PIDs of the previous sources.  
This may create gaps in the timeline in case previous source PIDs are not of equal duration (quite common with most audio codecs).  
Using `nosync` directive will disable this realignment and provide a continuous timeline but may introduce synchronization errors depending in the source encoding (use with caution).  

## Source syntax  
The source lines follow the usual source syntax, see `gpac -h`.  
Additional PID properties can be added per source (see `gpac -h doc`), but are valid only for the current source, and reset at next source.  
The loaded sources do not inherit arguments from the parent playlist filter.  
  
The URL given can either be a single URL, or a list of URLs separated by " && " to load several sources for the active entry.  

__Warning: There shall not be any other space/tab characters between sources.__  
  
Example
```
audio.mp4 && video.mp4
```
  

## Source with filter chains  
Each URL can be followed by a chain of one or more filters, using the `@` link directive as used in gpac (see `gpac -h doc`).  
A negative link index (e.g. `@-1`) can be used to setup a new filter chain starting from the last specified source in the line.  

__Warning: There shall be a single character, with value space (' '), before and after each link directive.__  
  
Example
```
src.mp4 @ reframer:rt=on
```
  
This will inject a reframer with real-time regulation between source and `flist` filter.  
Example
```
src.mp4 @ reframer:saps=1 @1 reframer:saps=0,2,3  
src.mp4 @ reframer:saps=1 @-1 reframer:saps=0,2,3
```
  
This will inject a reframer filtering only SAP1 frames and a reframer filtering only non-SAP1 frames between source and `flist` filter  
  
Link options can be specified (see `gpac -h doc`).  
Example
```
src.mp4 @#video reframer:rt=on
```
  
This will inject a reframer with real-time regulation between video PID of source and `flist` filter.  
  
When using filter chains, the `flist` filter will only accept PIDs from the last declared filter in the chain.  
In order to accept other PIDs from the source, you must specify a final link directive with no following filter.  
Example
```
src.mp4 @#video reframer:rt=on @-1#audio
```
  
This will inject a reframer with real-time regulation between video PID of source and `flist` filter, and will also allow audio PIDs from source to connect to `flist` filter.  
  
The empty link directive can also be used on the last declared filter  
Example
```
src.mp4 @ reframer:rt=on @#audio
```
  
This will inject a reframer with real-time regulation between source and `flist` filter and only connect audio PIDs to `flist` filter.  

## Splicing  
The playlist can be used to splice content with other content following a media in the playlist.  
A source item is declared as main media in a splice operation if and only if it has an `out` directive set (possibly empty).  
Directive can be used for the main media except concatenation directives.  
  
The splicing operations do not alter media frames and do not perform uncompressed domain operations such as cross-fade or mixing.  
  
The `out` (resp. `in`) directive specifies the media splice start (resp. end) time. The value can be formatted as follows:  

- empty: the time is not yet assigned  
- `now`: the time is resolved to the next SAP point in the media  
- integer, float or fraction: set time in seconds  
- `+VAL`: used for `in` only, specify the end point as delta in seconds from the start point (`VAL` can be integer, float or fraction)  
- DATE: set splice time according to wall clock `DATE`, formatted as an `XSD dateTime`  

The splice times (except wall clock) are expressed in the source (main media) timing, not the reconstructed output timeline.  
  
When a splice begins (`out` time reached), the source items following the main media are played until the end of the splice or the end of the main media.  
Sources used during the splice period can use directives such as `start`, `dur` or `repeat`.  
  
Once a splice is done (`in` time reached), the main media `out` splice time is reset to undefined.  
  
When the main media has undefined `out` or `in` splice times, the playlist is reloaded at each new main media packet to check for resolved values.  

- `out` can only be modified when no splice is active, otherwise it is ignored. If modified, it resets the next source to play to be the one following the modified main media.  
- `in` can only be modified when a splice is active with an undefined end time, otherwise it is ignored.  

  
When the main media is over:  

- if `repeat` directive is set, the main media is repeated, `in` and `out` set to their initial values and the next splicing content is the one following the main content,  
- otherwise, the next source queued is the one following the last source played during the last splice period.  

  
It is allowed to defined several main media in the playlist, but a main media is not allowed as media for a splice period.  
  
The filter will look for the property `Period` on the output PIDs of the main media for multi-period DASH.  
If found, `_N` is appended to the period ID, with `N` starting from 1 and increased at each main media resume.  
If no `Period` property is set on main or spliced media, period switch can still be forced using [-pswitch](dasher/#pswitch) DASH option.  
  
If `mark` directive is set for a main media, no content replacement is done and the splice boundaries will be signaled in the main media.  
If `keep` directive is set for a main media, the main media is forwarded along with the replacement content.  
When `mark` or `keep` directives are set, it is possible to alter the PID properties of the main media using `sprops` directive.  
  
Example
```
#out=2 in=4 mark sprops=#xlink=http://foo.bar/  
src:#Period=main
```
  
This will inject property xlink on the output PIDs in the splice zone (corresponding to period `main_2`) but not in the rest of the main media.  
  
Directives `mark`, `keep` and `sprops` are reset at the end of the splice period.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="floop" data-level="basic">__floop__</a> (sint, default: _0_): loop playlist/list of files, `0` for one time, `n` for n+1 times, `-1` for indefinitely  
</div>  
<div markdown class="option">  
<a id="srcs" data-level="basic">__srcs__</a> (strl): list of files to play  
</div>  
<div markdown class="option">  
<a id="fdur" data-level="basic">__fdur__</a> (frac, default: _1/25_): frame duration for source files with a single frame (0/NaN fraction means reuse source timing which is usually not set!)  
</div>  
<div markdown class="option">  
<a id="revert">__revert__</a> (bool, default: _false_): revert list of files ([srcs](#srcs), not playlist)  
</div>  
<div markdown class="option">  
<a id="timescale">__timescale__</a> (uint, default: _0_): force output timescale on all PIDs (0 uses the timescale of the first PID found)  
</div>  
<div markdown class="option">  
<a id="ka">__ka__</a> (uint, default: _0_): keep playlist alive (disable loop), waiting for a new input to be added or `#end` directive to end playlist. The value specifies the refresh rate in ms  
</div>  
<div markdown class="option">  
<a id="timeout">__timeout__</a> (luint, default: _-1_): timeout in ms after which the playlist is considered dead (`-1` means indefinitely)  
</div>  
<div markdown class="option">  
<a id="fsort" data-level="basic">__fsort__</a> (enum, default: _no_): sort list of files  

- no: no sorting, use default directory enumeration of OS  
- name: sort by alphabetical name  
- size: sort by increasing size  
- date: sort by increasing modification time  
- datex: sort by increasing modification time  
</div>  
  
<div markdown class="option">  
<a id="sigcues">__sigcues__</a> (bool, default: _false_): inject `CueStart` property at each source begin (new or repeated) for DASHing  
</div>  
<div markdown class="option">  
<a id="fdel">__fdel__</a> (bool, default: _false_): delete source files after processing in playlist mode (does not delete the playlist)  
</div>  
<div markdown class="option">  
<a id="keepts">__keepts__</a> (bool, default: _false_): keep initial timestamps unmodified (no reset to 0)  
</div>  
<div markdown class="option">  
<a id="raw" data-level="basic">__raw__</a> (enum, default: _no_): force input AV streams to be in raw format  

- no: do not force decoding of inputs  
- av: force decoding of audio and video inputs  
- a: force decoding of audio inputs  
- v: force decoding of video inputs  
</div>  
  
<div markdown class="option">  
<a id="flush" data-level="basic">__flush__</a> (bool, default: _false_): send a flush signal once playlist is done before entering keepalive  
</div>  
  
