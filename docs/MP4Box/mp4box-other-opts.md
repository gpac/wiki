<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# Hinting Options  
  
IsoMedia hinting consists in creating special tracks in the file that contain transport protocol specific information and optionally multiplexing information. These tracks are then used by the server to create the actual packets being sent over the network, in other words they provide the server with hints on how to build packets, hence their names `hint tracks`.  
MP4Box supports creation of hint tracks for RTSP servers supporting these such as QuickTime Streaming Server, DarwinStreaming Server or 3GPP-compliant RTSP servers.  
_Note: GPAC streaming tools [rtp output](rtpout) and [rtsp server](rtspout) do not use hint tracks, they use on-the-fly packetization from any media sources, not just MP4_  
    
Options:  
<div markdown class="option">
<a id="hint" data-level="basic">__-hint__</a>: hint the file for RTP/RTSP  
</div>
<div markdown class="option">
<a id="mtu" data-level="basic">__-mtu__</a> (int, default: __1450__): specify RTP MTU (max size) in bytes (this includes 12 bytes RTP header)  
</div>
<div markdown class="option">
<a id="copy" data-level="basic">__-copy__</a>: copy media data to hint track rather than reference (speeds up server but takes much more space)  
</div>
<div markdown class="option">
<a id="multi" data-level="basic">__-multi__</a> `[maxptime]`: enable frame concatenation in RTP packets if possible (with max duration 100 ms or `maxptime` ms if given)  
</div>
<div markdown class="option">
<a id="rate" data-level="basic">__-rate__</a> (int, default: __90000__): specify rtp rate in Hz when no default for payload  
</div>
<div markdown class="option">
<a id="mpeg4" data-level="basic">__-mpeg4__</a>: force MPEG-4 generic payload whenever possible  
</div>
<div markdown class="option">
<a id="latm" data-level="basic">__-latm__</a>: force MPG4-LATM transport for AAC streams  
</div>
<div markdown class="option">
<a id="static" data-level="basic">__-static__</a>: enable static RTP payload IDs whenever possible (by default, dynamic payloads are always used)  
</div>
<div markdown class="option">
<a id="add-sdp" data-level="basic">__-add-sdp__</a> (string): add given SDP string to movie (`string`) or track (`tkID:string`), `tkID` being the track ID or the hint track ID  
</div>
<div markdown class="option">
<a id="no-offset" data-level="basic">__-no-offset__</a>: signal no random offset for sequence number and timestamp (support will depend on server)  
</div>
<div markdown class="option">
<a id="unhint" data-level="basic">__-unhint__</a>: remove all hinting information from file  
</div>
<div markdown class="option">
<a id="group-single" data-level="basic">__-group-single__</a>: put all tracks in a single hint group  
</div>
<div markdown class="option">
<a id="ocr" data-level="basic">__-ocr__</a>: force all MPEG-4 streams to be synchronized (MPEG-4 Systems only)  
</div>
<div markdown class="option">
<a id="rap" data-level="basic">__-rap__</a>: signal random access points in RTP packets (MPEG-4 Systems)  
</div>
<div markdown class="option">
<a id="ts" data-level="basic">__-ts__</a>: signal AU Time Stamps in RTP packets (MPEG-4 Systems)  
</div>
<div markdown class="option">
<a id="size" data-level="basic">__-size__</a>: signal AU size in RTP packets (MPEG-4 Systems)  
</div>
<div markdown class="option">
<a id="idx" data-level="basic">__-idx__</a>: signal AU sequence numbers in RTP packets (MPEG-4 Systems)  
</div>
<div markdown class="option">
<a id="iod" data-level="basic">__-iod__</a>: prevent systems tracks embedding in IOD (MPEG-4 Systems), not compatible with [-isma](#isma)  
</div>

# Tagging support  
  
Tags are specified as a colon-separated list `tag_name=tag_value[:tag2=val2]`  
Setting a tag with no value or value `NULL` removes the tag.  
Special tag value `clear` (or `reset`) removes all tags.  
Unsupported tags can be added using their four character code as a tag name, and string value will be assumed.  
If the tag name length is 3, the prefix 0xA9 is used to create the four character code.  
    
Tags can also be loaded from a text file using `-itags filename`. The file must be in UTF8 with:  

- lines starting with `tag_name=value` specify the start of a tag  
- other lines specify the remainder of the last declared tag  

    
If tag name starts with `WM/`, the tag is added to `Xtra` box (WMA tag, string only).  
    

## QT metadata key  
The tag is added as a QT metadata key if:  

- `tag_name` starts with `QT/`  
- or `tag_name` is not recognized and longer than 4 characters  

    
The `tag_name` can optionally be prefixed with `HDLR@`, indicating the tag namespace 4CC, the default namespace being `mdta`.  
The `tag_value` can be prefixed with:  

- S: force string encoding (must be placed first) instead of parsing the tag value  
- b: use 8-bit encoding for signed or unsigned int  
- s: use 16-bit encoding for signed or unsigned int  
- l: use 32-bit encoding for signed or unsigned int  
- L: use 64-bit encoding for signed or unsigned int  
- f: force float encoding for numbers  

Numbers are converted by default and stored in variable-size mode.  
To force a positive integer to use signed storage, add `+` in front of the number.  
Example
```
-tags io.gpac.some_tag=s+32
```
  
This will force storing value `32` in signed 16 bit format.  
The `tag_value` can also be formatted as:  

- XxY@WxH: a rectangle type  
- XxY: a point type  
- W@H: a size type  
- A,B,C,D,E,F,G,H,I: a 3x3 matrix  
- FNAME: data is loaded from `FNAME`, type set to jpeg or png if needed  

    

## Supported tag names (name, value, type, aliases)  
__title__ (A9nam) string (`alias` name)  
__artist__ (A9ART) string  
__album_artist__ (aART) string (`alias` albumArtist)  
__album__ (A9alb) string  
__group__ (A9grp) string (`alias` grouping)  
__composer__ (A9com) string  
__writer__ (A9wrt) string  
__conductor__ (A9con) string  
__comment__ (A9cmt) string (`alias` comments)  
__genre__ (gnre) string (ID3 genre tag)  
__created__ (A9day) string (`alias` releaseDate)  
__track__ (A9trk) string  
__tracknum__ (trkn) fraction (syntax: `A/B` or `A`, B will be 0)  
__disk__ (disk) fraction (syntax: `A/B` or `A`, B will be 0)  
__tempo__ (tmpo) integer  
__compilation__ (cpil) bool (`yes` or `no`)  
__show__ (tvsh) string (`alias` tvShow)  
__episode_id__ (tven) string (`alias` tvEpisodeID)  
__season__ (tvsn) integer (`alias` tvSeason)  
__episode__ (tves) integer (`alias` tvEPisode)  
__network__ (tvnn) string (`alias` tvNetwork)  
__sdesc__ (desc) string (`alias` description)  
__ldesc__ (ldes) string (`alias` longDescription)  
__lyrics__ (A9lyr) string  
__sort_name__ (sonm) string (`alias` sortName)  
__sort_artist__ (soar) string (`alias` sortArtist)  
__sort_album_artist__ (soaa) string (`alias` sortAlbumArtist)  
__sort_album__ (soal) string (`alias` sortAlbum)  
__sort_composer__ (soco) string (`alias` sortComposer)  
__sort_show__ (sosn) string (`alias` sortShow)  
__cover__ (covr) file path (`alias` artwork)  
__copyright__ (cprt) string  
__tool__ (A9too) string (`alias` encodingTool)  
__encoder__ (A9enc) string (`alias` encodedBy)  
__pdate__ (purd) string (`alias` purchaseDate)  
__podcast__ (pcst) bool (`yes` or `no`)  
__url__ (purl) string (`alias` podcastURL)  
__keywords__ (kyyw) string  
__category__ (catg) string  
__hdvideo__ (hdvd) integer  
__media__ (stik) integer (`alias` mediaType)  
__rating__ (rtng) integer (`alias` contentRating)  
__gapless__ (pgap) bool (`yes` or `no`)  
__art_director__ (A9ard) string  
__arranger__ (A9arg) string  
__lyricist__ (A9aut) string  
__acknowledgement__ (A9cak) string  
__song_description__ (A9des) string  
__director__ (A9dir) string  
__equalizer__ (A9equ) string  
__liner__ (A9lnt) string  
__record_company__ (A9mak) string  
__original_artist__ (A9ope) string  
__phono_rights__ (A9phg) string  
__producer__ (A9prd) string  
__performer__ (A9prf) string  
__publisher__ (A9pub) string  
__sound_engineer__ (A9sne) string  
__soloist__ (A9sol) string  
__credits__ (A9src) string  
__thanks__ (A9thx) string  
__online_info__ (A9url) string  
__exec_producer__ (A9xpd) string  
__genre__ (A9gen) string (ID3 genre tag)  
__location__ (A9xyz) string  
