<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->
# Syntax {:data-level="all"}

```
MP4Box [option] input [option] [other_dash_inputs]  
```    

# General Options  
  
MP4Box is a multimedia packager, with a vast number of functionalities: conversion, splitting, hinting, dumping, DASH-ing, encryption, transcoding and others.  
MP4Box provides a large set of options, classified by categories (see [-h](#h)). These options do not follow any particular ordering.  
    
By default, MP4Box rewrites the input file. You can change this behavior by using the [-out](#out) option.  
MP4Box stores by default the file with 0.5 second interleaving and meta-data (`moov` ...) at the beginning, making it suitable for HTTP download-and-play. This may however takes longer to store the file, use [-flat](#flat) to change this behavior.  
    
MP4Box usually generates a temporary file when creating a new IsoMedia file. The location of this temporary file is OS-dependent, and it may happen that the drive/partition the temporary file is created on has not enough space or no write access. In such a case, you can specify a temporary file location with [-tmp](#tmp).  
    
Track identifier for track-based operations (usually referred to as `tkID` in the help) use the following syntax:  

- INT: target is track with ID `INT`  
- n`INT`: target is track number `INT`  
- `audio`, `video`, `text`: target is first `audio`, `video` or `text` track  
- `audioN`, `videoN`, `textN`: target is the `N`th `audio`, `video` or `text` track, with `N=1` being the first track of desired type  

    
Option values:  
Unless specified otherwise, a track operation option of type `integer` expects a track identifier value following it.  
An option of type `boolean` expects no following value.  
    
<a id="mem-track">__-mem-track__</a>: enable memory tracker  
<a id="mem-track-stack">__-mem-track-stack__</a>: enable memory tracker with stack dumping  
<a id="p">__-p__</a> (string): use indicated profile for the global GPAC config. If not found, config file is created. If a file path is indicated, this will load profile from that file. Otherwise, this will create a directory of the specified name and store new config there. Reserved name `0` means a new profile, not stored to disk. Works using -p=NAME or -p NAME  
<a id="inter">__-inter__</a> (number, default: __0.5__): interleave file, producing track chunks with given duration in ms. A value of 0 disables interleaving   
<a id="old-inter">__-old-inter__</a> (number): same as [-inter](#inter) but without drift correction  
<a id="tight">__-tight__</a>:  tight interleaving (sample based) of the file. This reduces disk seek operations but increases file size  
<a id="flat">__-flat__</a>:    store file with all media data first, non-interleaved. This speeds up writing time when creating new files  
<a id="frag">__-frag__</a> (number): fragment file, producing track fragments of given duration in ms. This disables interleaving  
<a id="out">__-out__</a> (string): specify ISOBMFF output file name. By default input file is overwritten  
<a id="co64">__-co64__</a>:    force usage of 64-bit chunk offsets for ISOBMF files  
<a id="new">__-new__</a>:      force creation of a new destination file  
<a id="newfs">__-newfs__</a>:  force creation of a new destination file without temp file but interleaving support  
<a id="no-sys">__-no-sys__</a>,__-nosys__: remove all MPEG-4 Systems info except IOD, kept for profiles. This is the default when creating regular AV content  
<a id="no-iod">__-no-iod__</a>: remove MPEG-4 InitialObjectDescriptor from file  
<a id="mfra">__-mfra__</a>:    insert movie fragment random offset when fragmenting file (ignored in dash mode)  
<a id="isma">__-isma__</a>:    rewrite the file as an ISMA 1.0 file  
<a id="ismax">__-ismax__</a>:  same as [-isma](#isma) and remove all clock references  
<a id="3gp">__-3gp__</a>:      rewrite as 3GPP(2) file (no more MPEG-4 Systems Info), always enabled if destination file extension is `.3gp`, `.3g2` or `.3gpp`. Some tracks may be removed in the process  
<a id="ipod">__-ipod__</a>:    rewrite the file for iPod/old iTunes  
<a id="psp">__-psp__</a>:      rewrite the file for PSP devices  
<a id="brand">__-brand__</a> (string): set major brand of file (`ABCD`) or brand with optional version (`ABCD:v`)  
<a id="ab">__-ab__</a> (string): add given brand to file's alternate brand list  
<a id="rb">__-rb__</a> (string): remove given brand to file's alternate brand list  
<a id="cprt">__-cprt__</a> (string): add copyright string to file  
<a id="chap">__-chap__</a> (string): set chapter information from given file. The following formats are supported (but cannot be mixed) in the chapter text file:  

    - ZoomPlayer: `AddChapter(nb_frames,chapter name)`, `AddChapterBySeconds(nb_sec,chapter name)` and `AddChapterByTime(h,m,s,chapter name)` with 1 chapter per line  
    - Time codes: `h:m:s chapter_name`, `h:m:s:ms chapter_name` and `h:m:s.ms chapter_name` with 1 chapter per line  
    - SMPTE codes: `h:m:s;nb_f/fps chapter_name` and `h:m:s;nb_f chapter_name` with `nb_f` the number of frames and `fps` the framerate with 1 chapter per line  
    - Common syntax: `CHAPTERX=h:m:s[:ms or .ms]` on first line and `CHAPTERXNAME=name` on next line (reverse order accepted)  
  
<a id="chapqt">__-chapqt__</a> (string): set chapter information from given file, using QT signaling for text tracks  
<a id="set-track-id">__-set-track-id__</a> `tkID:id2`: change id of track to id2  
<a id="swap-track-id">__-swap-track-id__</a> `tkID1:tkID1`: swap the id between tracks with id1 to id2  
<a id="rem">__-rem__</a> (int): remove given track from file  
<a id="rap">__-rap__</a> (int): remove all non-RAP samples from given track  
<a id="refonly">__-refonly__</a> (int): remove all non-reference pictures from given track  
<a id="enable">__-enable__</a> (int): enable given track  
<a id="disable">__-disable__</a> (int): disable given track  
<a id="timescale">__-timescale__</a> (int, default: __600__): set movie timescale to given value (ticks per second)  
<a id="lang">__-lang__</a> `[tkID=]LAN`: set language. LAN is the BCP-47 code (eng, en-UK, ...). If no track ID is given, sets language to all tracks  
<a id="delay">__-delay__</a> `tkID=TIME`: set track start delay (>0) or initial skip (<0) in ms or in fractional seconds (`N/D`)  
<a id="par">__-par__</a> `tkID=PAR`: set visual track pixel aspect ratio. PAR is:  

    - N:D: set PAR to N:D in track, do not modify the bitstream  
    - wN:D: set PAR to N:D in track and try to modify the bitstream  
    - none: remove PAR info from track, do not modify the bitstream  
    - auto: retrieve PAR info from bitstream and set it in track  
    - force: force 1:1 PAR in track, do not modify the bitstream  
  
<a id="clap">__-clap__</a> `tkID=CLAP`: set visual track clean aperture. CLAP is `Wn,Wd,Hn,Hd,HOn,HOd,VOn,VOd` or `none`  

- n, d: numerator, denominator  
- W, H, HO, VO: clap width, clap height, clap horizontal offset, clap vertical offset  
  
  
<a id="mx">__-mx__</a> `tkID=MX`: set track matrix, with MX is M1:M2:M3:M4:M5:M6:M7:M8:M9 in 16.16 fixed point integers or hexa  
<a id="kind">__-kind__</a> `tkID=schemeURI=value`: set kind for the track or for all tracks using `all=schemeURI=value`  
<a id="kind-rem">__-kind-rem__</a> `tkID=schemeURI=value`: remove kind if given schemeID for the track or for all tracks with `all=schemeURI=value`  
<a id="name">__-name__</a> `tkID=NAME`: set track handler name to NAME (UTF-8 string)  
<a id="tags">__-tags__</a>,__-itags__ (string): set iTunes tags to file, see `-h tags`  
<a id="group-add">__-group-add__</a> (string): create a new grouping information in the file. Format is a colon-separated list of following options:  

- refTrack=ID: track used as a group reference. If not set, the track will belong to the same group as the previous trackID specified. If 0 or no previous track specified, a new alternate group will be created  
- switchID=ID: ID of the switch group to create. If 0, a new ID will be computed for you. If <0, disables SwitchGroup  
- criteria=string: list of space-separated 4CCs  
- trackID=ID: track to add to this group  

    

__Warning: Options modify state as they are parsed, `trackID=1:criteria=lang:trackID=2` is different from `criteria=lang:trackID=1:trackID=2`__  
  
  
  
<a id="group-rem-track">__-group-rem-track__</a> (int): remove given track from its group  
<a id="group-rem">__-group-rem__</a> (int): remove the track's group  
<a id="group-clean">__-group-clean__</a>: remove all group information from all tracks  
<a id="ref">__-ref__</a> `tkID:R4CC:refID`: add a reference of type R4CC from track ID to track refID (remove track reference if refID is 0)  
<a id="keep-utc">__-keep-utc__</a>: keep UTC timing in the file after edit  
<a id="udta">__-udta__</a> `tkID:[OPTS]`: set udta for given track or movie if tkID is 0. OPTS is a colon separated list of:  

- type=CODE: 4CC code of the UDTA (not needed for `box=` option)  
- box=FILE: location of the udta data, formatted as serialized boxes  
- box=base64,DATA: base64 encoded udta data, formatted as serialized boxes  
- src=FILE: location of the udta data (will be stored in a single box of type CODE)  
- src=base64,DATA: base64 encoded udta data (will be stored in a single box of type CODE)  
- str=STRING: use the given string as payload for the udta box  

_Note: If no source is set, UDTA of type CODE will be removed_  
  
  
<a id="patch">__-patch__</a> `[tkID=]FILE`: apply box patch described in FILE, for given trackID if set  
<a id="bo">__-bo__</a>:        freeze the order of boxes in input file  
<a id="init-seg">__-init-seg__</a> (string): use the given file as an init segment for dumping or for encryption  
<a id="zmov">__-zmov__</a>:    compress movie box according to ISOBMFF box compression or QT if mov extension  
<a id="xmov">__-xmov__</a>:    same as zmov and wraps ftyp in otyp  
<a id="edits">__-edits__</a> `tkID=EDITS`: set edit list. The following syntax is used (no separators between entries):  

    - `r`: removes all edits  
    - `eSTART`: add empty edit with given start time. START can be  

   - `VAL`: start time in seconds (int, double, fraction), media duration used as edit duration  
   - `VAL-DUR`: start time and duration in seconds (int, double, fraction)  

    - `eSTART,MEDIA[,RATE]`: add regular edit with given start, media start time in seconds (int, double, fraction) and rate (fraction or INT)  
    - Examples:   

   - `re0-5e5-3,4`: remove edits, add empty edit at 0s for 5s, then add regular edit at 5s for 3s starting at 4s in media track  
   - `re0-4,0,0.5`: remove edits, add single edit at 0s for 4s starting at 0s in media track and playing at speed 0.5  
  
  
<a id="moovpad">__-moovpad__</a> (int): specify amount of padding to keep after moov box for later inplace editing - if 0, moov padding is disabled  
  
<a id="no-inplace">__-no-inplace__</a>: disable inplace rewrite  
<a id="hdr">__-hdr__</a> (string): update HDR information based on given XML, 'none' removes HDR info  
<a id="time">__-time__</a> `[tkID=]DAY/MONTH/YEAR-H:M:S`: set movie or track creation time  
<a id="mtime">__-mtime__</a> `tkID=DAY/MONTH/YEAR-H:M:S`: set media creation time  

# Encryption/Decryption Options  
  
MP4Box supports encryption and decryption of ISMA, OMA and CENC content, see [encryption filter `gpac -h cecrypt`](cecrypt).  
It requires a specific XML file called `CryptFile`, whose syntax is available at https://wiki.gpac.io/xmlformats/Common-Encryption  
Image files (HEIF) can also be crypted / decrypted, using CENC only.  
    
Options:  
<a id="crypt">__-crypt__</a> (string): encrypt the input file using the given `CryptFile`  
<a id="decrypt">__-decrypt__</a> (string): decrypt the input file, potentially using the given `CryptFile`. If `CryptFile` is not given, will fail if the key management system is not supported  
<a id="set-kms">__-set-kms__</a> `tkID=kms_uri`: change ISMA/OMA KMS location for a given track or for all tracks if `all=` is used  
# Help Options
<a id="h">__-h__</a> (string): print help  

- general: general options help  
- hint: hinting options help  
- dash: DASH segmenter help  
- split: split options help  
- import: import options help  
- encode: scene description encoding options help  
- meta: meta (HEIF, MPEG-21) handling options help  
- extract: extraction options help  
- dump: dump options help  
- swf: Flash (SWF) options help  
- crypt: ISMA E&A options help  
- format: supported formats help  
- live: BIFS streamer help  
- core: libgpac core options  
- all: print all the above help screens  
- opts: print all options  
- tags: print supported iTunes tags  
- cicp: print various CICP code points  
- VAL: search for option named `VAL` (without `-` or `--`) in MP4Box, libgpac core and all filters  
  
  
<a id="hx">__-hx__</a> (string): look for given string in name and descriptions of all MP4Box and filters options  
<a id="nodes">__-nodes__</a>:  list supported MPEG4 nodes  
<a id="nodex">__-nodex__</a>:  list supported MPEG4 nodes and print nodes  
<a id="node">__-node__</a> (string): get given MPEG4 node syntax and QP infolist  
<a id="xnodes">__-xnodes__</a>: list supported X3D nodes  
<a id="xnodex">__-xnodex__</a>: list supported X3D nodes and print nodes  
<a id="xnode">__-xnode__</a> (string): get given X3D node syntax  
<a id="snodes">__-snodes__</a>: list supported SVG nodes  
<a id="languages">__-languages__</a>: list supported ISO 639 languages  
<a id="boxes">__-boxes__</a>:  list all supported ISOBMF boxes and their syntax  
<a id="stats">__-stats__</a>,__-fstat__: print filter session statistics (import/export/encrypt/decrypt/dashing)  
<a id="graph">__-graph__</a>,__-fgraph__: print filter session graph (import/export/encrypt/decrypt/dashing)  
<a id="v">__-v__</a>:          verbose mode  
<a id="version">__-version__</a>: get build version  
<a id="-">__--__</a> `INPUT`:  escape option if INPUT starts with `-` character  
