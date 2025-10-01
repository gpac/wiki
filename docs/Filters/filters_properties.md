<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# GPAC Built-in properties  
  

## Built-in property types  
    
Name | Description    
--- | ---    
sint | signed 32 bit integer    
uint | unsigned 32 bit integer    
lsint | signed 64 bit integer    
luint | unsigned 32 bit integer    
bool | boolean    
frac | 32/32 bit fraction    
lfrac | 64/64 bit fraction    
flt | 32 bit float number    
dbl | 64 bit float number    
v2di | 2D 32-bit integer vector    
v2d | 2D 64-bit float vector    
v3di | 3D 32-bit integer vector    
v4di | 4D 32-bit integer vector    
str | UTF-8 string    
mem | data buffer    
cstr | const UTF-8 string    
cmem | const data buffer    
ptr | 32 or 64 bit pointer    
strl | UTF-8 string list    
uintl | unsigned 32 bit integer list    
sintl | signed 32 bit integer list    
v2il | 2D 32-bit integer vector list    
4cc | Four character code    
4ccl | four-character codes list    
pfmt | raw pixel format    
afmt | raw audio format    
cprm | color primaries, string or int value from ISO/IEC 23091-2    
ctfc | color transfer characteristics, string or int value from ISO/IEC 23091-2    
cmxc | color matrix coefficients, string or int value from ISO/IEC 23091-2    
alay | channel layout configuration, string or int value from ISO/IEC 23091-3    

## Built-in properties for PIDs and packets, pixel formats and audio formats  
    
Flags can be:  

- D: droppable property, see [GSF multiplexer](gsfmx) filter help for more info  
- P: property applying to packet  

    
Name | type | Flags | Description | 4CC    
--- | --- | --- | --- | ---    
ID | uint |  | Stream ID | PIDI    
ESID | uint | D | MPEG-4 ESID of PID | ESID    
ItemID | uint |  | ID of image item in HEIF, same value as ID | ITID    
ItemNumber | uint |  | Number (1-based) of image item in HEIF, in order of declaration in file | ITIX    
TrackNumber | uint |  | Number (1-based) of track in order of declaration in file | PIDX    
ServiceID | uint | D | ID of parent service | PSID    
ClockID | uint | D | ID of clock reference PID | CKID    
DependencyID | uint |  | ID of layer depended on | DPID    
SubLayer | bool |  | PID is a sublayer of the stream depended on rather than an enhancement layer | DPSL    
PlaybackMode | uint | D | Playback mode supported:  <br/>
- 0: no time control  <br/>- 1: play/pause/seek,speed=1  <br/>- 2: play/pause/seek,speed>=0  <br/>- 3: play/pause/seek, reverse playback | PBKM    
Scalable | bool |  | Scalable stream | SCAL    
TileBase | bool |  | Tile base stream | SABT    
TileID | uint |  | ID of the tile for hvt1/hvt2 PIDs | PTID    
Language | cstr |  | Language code: ISO639 2/3 character code or RFC 4646 | LANG    
ServiceName | str | D | Name of parent service, signled as PID info | SNAM    
ServiceProvider | str | D | Provider of parent service, signled as PID info | SPRO    
StreamType | uint |  | Media stream type | PMST    
StreamSubtype | 4cc | D | Media subtype 4CC (auxiliary, pic sequence, etc ..), matches ISOM handler type | PSST    
ISOMSubtype | 4cc | D | ISOM media subtype 4CC (avc1 avc2...) | PIST    
OrigStreamType | uint |  | Original stream type before encryption | POST    
CodecID | uint |  | Codec ID (MPEG-4 OTI or ISOBMFF 4CC) | POTI    
InitialObjectDescriptor | bool |  | PID is declared in the IOD for MPEG-4 | PIOD    
Unframed | bool |  | The media data is not framed, i.e. each packet is not a complete AU/frame or is not in internal format (e.g. annexB for avc/hevc, adts for aac) | PFRM    
UnframedAU | bool |  | The unframed media still has correct AU boundaries: one packet is one full AU, but the packet format might not be the internal one (e.g. annexB for avc/hevc, adts for aac) | PFRF    
LATM | bool |  | Media is unframed AAC in LATM format | LATM    
USRT | bool |  | Media is unframed SRT, header is in payload with 0 start time | USRT    
Duration | lfrac |  | Media duration | PDUR    
EstimatedDuration | bool |  | Media duration is an estimated duration based on rate | EDUR    
NumFrames | uint | D | Number of frames in the stream | NFRM    
FrameOffset | uint | D | Index of first frame in the stream (used for reporting) | FRMO    
ConstantFrameSize | uint |  | Size of the frames for constant frame size streams | CFRS    
TimeshiftDepth | frac | D | Depth of the timeshift buffer | PTSD    
TimeshiftTime | dbl | D | Time in the timeshift buffer in seconds - changes are signaled through PID info (no reconfigure) | PTST    
TimeshiftState | uint | D | State of timeshift buffer: 0 is OK, 1 is underflow, 2 is overflow - changes are signaled through PID info (no reconfigure) | PTSS    
Timescale | uint |  | Media timescale (a timestamp delta of N is N/timescale seconds) | TIMS    
ProfileLevel | uint | D | Profile and level indication | PRPL    
DecoderConfig | mem |  | Decoder configuration data | DCFG    
DecoderConfigEnhancement | mem |  | Decoder configuration data of the enhancement layer(s). Also used by 3GPP/Apple text streams to give the full sample description table used in SDP. | ECFG    
DSISuperset | bool |  | Decoder config is a superset of previous decoder config | DCFS    
DecoderConfigIndex | uint |  | 1-based index of decoder config for ISO base media files | ICFG    
SampleRate | uint |  | Audio sample rate | AUSR    
SamplesPerFrame | uint |  | Number of audio sample in one coded frame | FRMS    
NumChannels | uint |  | Number of audio channels | CHNB    
BPS | uint |  | Number of bits per sample in compressed source | ABPS    
ChannelLayout | luint |  | Channel Layout mask | CHLO    
AudioFormat | afmt |  | Audio sample format | AFMT    
AudioPlaybackSpeed | dbl | D | Audio playback speed, only used for audio output reconfiguration | ASPD    
Delay | lsint |  | Delay of presentation compared to composition timestamps, in media timescale. Positive value imply holding (delaying) the stream. Negative value imply skipping the beginning of stream | MDLY    
CTSShift | uint |  | CTS offset to apply in case of negative ctts | MDTS    
SkipPriming | bool |  | Audio priming shall not to be removed when initializing decoding | ASKP    
Width | uint |  | Visual Width (video / text / graphics) | WIDT    
Height | uint |  | Visual Height (video / text / graphics) | HEIG    
PixelFormat | pfmt |  | Pixel format | PFMT    
PixelFormatWrapped | pfmt |  | Underlying pixel format of video stream if pixel format is external GL texture | PFMW    
Stride | uint |  | Image or Y/alpha plane stride | VSTY    
StrideUV | uint |  | UV plane or U/V planes stride | VSTC    
BitDepthLuma | uint |  | Bit depth for luma components | YBPS    
BitDepthChroma | uint |  | Bit depth for chroma components | CBPS    
FPS | frac |  | Video framerate | VFPF    
Interlaced | bool |  | Video is interlaced | VILC    
SAR | frac |  | Sample (i.e. pixel) aspect ratio (negative values mean no SAR and removal of info in containers) | PSAR    
MaxWidth | uint |  | Maximum width (video / text / graphics) of all enhancement layers | MWID    
MaxHeight | uint |  | Maximum height (video / text / graphics) of all enhancement layers | MHEI    
ZOrder | sint |  | Z-order of the video, from 0 (first) to max int (last) | VZIX    
TransX | sint |  | Horizontal translation of the video (positive towards right) | VTRX    
TransY | sint |  | Vertical translation of the video (positive towards up) | VTRY    
TransXRight | sint |  | Horizontal offset of the video from right (positive towards right), for cases where reference width is unknown | VTRx    
TransYTop | sint |  | Vertical translation of the video (0 is top, positive towards down), for cases where reference height is unknown | VTRy    
Hidden | bool |  | PID is hidden in visual/audio rendering | HIDE    
CropOrigin | v2di |  | Position in source window, X,Y indicate coordinates in source (0,0 for top-left) | VCXY    
OriginalSize | v2di |  | Original resolution of video | VOWH    
SRD | v4di |  | Position and size of the video in the referential given by SRDRef | SRDI    
SRDRef | v2di |  | Width and Height of the SRD referential | SRDR    
SRDMap | uintl |  | Mapping of input videos in reconstructed video, expressed as {Ox,Oy,Ow,Oh,Dx,Dy,Dw,Dh} per input, with:  <br/>
- Ox,Oy,Ow,Oh: position and size of the input video (usually matching its `SRD` property), expressed in the output referential given by `SRDRef`  <br/>- Dx,Dy,Dw,Dh: Position and Size of the input video in the reconstructed output, expressed in the output referential given by `SRDRef` | SRDM    
Alpha | bool |  | Video in this PID is an alpha map | VALP    
Mirror | uint |  | Mirror mode (as bit mask with flags 0: no mirror, 1: along Y-axis, 2: along X-axis) | VMIR    
Rotate | uint |  | Video rotation as value*90 degree anti-clockwise | VROT    
ClapW | frac |  | Width of clean aperture in luma pixels | CLPW    
ClapH | frac |  | Height of clean aperture in luma pixels | CLPH    
ClapX | frac |  | Horizontal offset of clean aperture center in luma pixels, 0 at image center | CLPX    
ClapY | frac |  | Vertical offset of clean aperture center in luma pixels, 0 at image center | CLPY    
NumViews | uint |  | Number of views packed in a frame (top-to-bottom only) | PNBV    
Bitrate | uint |  | Bitrate in bps | RATE    
Maxrate | uint |  | Max bitrate in bps | MRAT    
TargetRate | uint |  | Target bitrate in bps, used to setup encoders | TBRT    
DBSize | uint |  | Decode buffer size in bytes | DBSZ    
MediaDataSize | luint | D | Size in bytes of media data | MDSZ    
DataRef | bool | D | Data referencing is possible (each compressed frame is a continuous set of bytes in source, with no transformation) | DREF    
URL | str | D | URL of source | FURL    
RemoteURL | str | D | Remote URL of source - used for MPEG-4 systems | RURL    
RedirectURL | str | D | Redirection URL of source | RELO    
SourcePath | str | D | Path of source file on file system | FSRC    
FileAlias | str | D | Alias name for source file, replace $URL$ and $File$ in templates | FALI    
MIMEType | str | D | MIME type of source | MIME    
Extension | str | D | File extension of source | FEXT    
Cached | bool | D | File is completely cached | CACH    
DownloadRate | uint | D | Download rate of resource in bits per second - changes are signaled through PID info (no reconfigure) | DLBW    
DownloadSize | luint | D | Size of resource in bytes | DLSZ    
DownBytes | luint | D | Number of bytes downloaded - changes are signaled through PID info (no reconfigure) | DLBD    
ByteRange | lfrac | D | Byte range of resource | FBRA    
DisableProgressive | uint |  | Some blocks in file need patching (replace or insertion) upon closing, potentially disabling progressive upload | NPRG    
IsoAltBrands | 4ccl | D | ISOBMFF brands associated with PID/file | ABRD    
IsoBrand | 4cc | D | ISOBMFF major brand associated with PID/file | MBRD    
MovieTime | lfrac | D | ISOBMFF movie header duration and timescale | MHTS    
HasSync | bool | D | PID has sync points | PSYN    
ServiceWidth | uint | D | Display width of service | DWDT    
ServiceHeight | uint | D | Display height of service | DHGT    
IsDefault | bool | D | Default PID for this stream type | PDEF    
CarouselRate | uint | D | Repeat rate in ms for systems carousel data | CARA    
AudioVolume | uint | D | Volume of audio | AVOL    
AudioPan | uint | D | Balance/Pan of audio | APAN    
AudioPriority | uint | D | Audio thread priority | APRI    
ProtectionScheme | 4cc |  | Protection scheme type (4CC) used | SCHT    
SchemeVersion | uint |  | Protection scheme version used | SCHV    
SchemeURI | str |  | Protection scheme URI | SCHU    
KMS_URI | str |  | URI for key management system | KMSU    
SelectiveEncryption | bool |  | ISMA/OMA selective encryption is used | ISSE    
IVLength | uint |  | ISMA IV size | ISIV    
KILength | uint |  | ISMA KeyIndication size | ISKI    
CryptType | uint |  | OMA encryption type | OMCT    
ContentID | str |  | OMA Content ID | OMID    
TextualHeaders | str |  | OMA textual headers | OMTH    
PlaintextLen | luint |  | OMA size of plaintext data | OMPT    
CryptInfo | str | D | URL (local file only) of crypt info file for this PID, use `clear` to force passthrough | ECRI    
DecryptInfo | str | D | URL (local file only) of crypt info file for this PID - see decrypter help | EDRI    
SenderNTP | luint | DP | NTP 64 bits timestamp at sender side or grabber side | NTPS    
ReceiverNTP | luint | DP | Receiver NTP (64 bits timestamp) usually associated with the sender NTP property | NTPR    
UTC | luint | DP | UTC timestamp (in milliseconds) of parent packet | UTCD    
Encrypted | bool |  | Packets for the stream are by default encrypted (however the encryption state is carried in packet crypt flags) - changes are signaled through PID info change (no reconfigure) | EPCK    
OMAPreview | luint |  | OMA Preview range  | ODPR    
CENC_PSSH | mem |  | PSSH blob for CENC, formatted as (u32)NbSystems [ (bin128)SystemID(u32)version(u32)KID_count[ (bin128)keyID ] (u32)priv_size(char*priv_size)priv_data] | PSSH    
CENC_SAI | mem | P | CENC SAI for the packet, formatted as (char(IV_Size))IV(u16)NbSubSamples [(u16)ClearBytes(u32)CryptedBytes] | SAIS    
KeyInfo | mem |  | Multi key info formatted as:  <br/> `is_mkey(u8);`  <br/>nb_keys(u16);  <br/>[  <br/>	IV_size(u8);  <br/>	KID(bin128);  <br/>	if (!IV_size) {;  <br/>		const_IV_size(u8);  <br/>		constIV(const_IV_size);  <br/>}  <br/>]  <br/>` | CBIV  `  
CENCPattern | frac |  | CENC crypt pattern, CENC pattern, skip as frac.num crypt as frac.den | CPTR    
CENCStore | 4cc |  | Storage location 4CC of SAI data | CSTR    
CENCstsdMode | uint |  | Mode for CENC sample description when using clear samples:  <br/>
- 0: single sample description is used  <br/>- 1: a clear clone of the sample description is created, inserted before the CENC sample description  <br/>- 2: a clear clone of the sample description is created, inserted after the CENC sample description | CSTM    
AMRModeSet | uint |  | ModeSet for AMR and AMR-WideBand | AMST    
SubSampleInfo | mem | P | Binary blob describing N subsamples of the sample, formatted as N [(u32)flags(u32)size(u32)codec_param(u8)priority(u8) discardable]. Subsamples for a given flag MUST appear in order, however flags can be interleaved | SUBS    
NALUMaxSize | uint |  | Max size of NAL units in stream - changes are signaled through PID info change (no reconfigure) | NALS    
FileNumber | uint | P | Index of file when dumping to files | FNUM    
FileName | str | P | Name of output file when dumping / dashing. Must be set on first packet belonging to new file | FNAM    
IDXName | str | P | Name of index file when dashing MPEG-2 TS. Must be set on first packet belonging to new file | INAM    
FileSuffix | str | P | File suffix name, replacement for $FS$ in tile templates | FSUF    
EODS | bool | P | End of DASH segment | EODS    
CueStart | bool | P | Set on packets marking the beginning of a DASH/HLS segment for cue-driven segmentation - see dasher help | PCUS    
MediaTime | dbl | DP | Corresponding media time of the parent packet (0 being the origin) | MTIM    
MaxFrameSize | uint | D | Max size of frame in stream - changes are signaled through PID info change (no reconfigure) | MFRS    
AvgFrameSize | uint | D | Average size of frame in stream (ISOBMFF only, static property) | AFRS    
MaxTSDelta | uint | D | Maximum DTS delta between frames (ISOBMFF only, static property) | MTSD    
MaxCTSOffset | uint | D | Maximum absolute CTS offset (ISOBMFF only, static property) | MCTO    
ConstantDuration | uint | D | Constant duration of samples, 0 means variable duration (ISOBMFF only, static property) | SCTD    
TrackTemplate | mem | D | ISOBMFF serialized track box for this PID, without any sample info (empty stbl and empty dref) | ITKT    
TrexTemplate | mem | D | ISOBMFF serialized trex box for this PID | ITXT    
STSDTemplate | mem | D | ISOBMFF serialized sample description entry for this PID | ISTD    
MovieUserData | mem | D | ISOBMFF serialized moov UDTA and other moov-level boxes (list) for this PID | IMUD    
HandlerName | str | D | ISOBMFF track handler name | IHDL    
TrackFlags | uint | D | ISOBMFF track header flags | ITKF    
TrackMatrix | sintl | D | ISOBMFF track header matrix | ITKM    
AltGroup | uint | D | ISOBMFF alt group ID | IALG    
ForceNCTTS | bool | D | ISOBMFF force negative CTS offsets | IFNC    
Disable | bool | D | ISOBMFF disable flag | ITKD    
Period | str | D | ID of DASH period | PEID    
PStart | lfrac | D | DASH Period start - cf dasher help | PEST    
PDur | lfrac | D | DASH Period duration - cf dasher help | PEDU    
Representation | str | D | ID of DASH representation | DRID    
ASID | uint | D | ID of parent DASH Adaptation Set | DAID    
SSR | sint | D | ID of Adaptation Set:  <br/>
- same value as ASID: regular SSR not used for cross-AS switching  <br/>- ID of another AdaptationSet: enable cross-AS switching between this AS and the referenced one  <br/>- negative value: LL-HLS compatability mode | SSRR    
MuxSrc | str | D | Name of mux source(s), set by dasher to direct its outputs | MSRC    
DashMode | uint | D | DASH mode to be used by multiplexer if any, set by dasher. 0 is no DASH, 1 is regular DASH, 2 is VoD | DMOD    
SegSync | bool | D | Indicate segment must be completely flushed before sending segment/fragment size events | DFSS    
DashDur | frac | D | DASH target segment duration in seconds | DDUR    
FragDur | frac | D | DASH target fragment duration in seconds | FDUR    
DashMultiPid | ptr | D | Pointer to the GF_List of input PIDs for multi-stsd entries segments, set by dasher | DMSD    
DashMultiPidIdx | uint | D | 1-based index of PID in the multi PID list, set by dasher | DMSI    
DashMultiTrack | ptr | D | Pointer to the GF_List of input PIDs for multi-tracks segments, set by dasher | DMTK    
Role | strl | D | List of roles for this PID, where each role string can be a DASH role, a `URN:role-value` or any other string (this will throw a warning and use a custom URI for the role) | ROLE    
PDesc | strl | D | List of descriptors for the DASH period containing this PID | PDES    
ASDesc | strl | D | List of conditional descriptors for the DASH AdaptationSet containing this PID. If a PID with the same property type but different value is found, the PIDs will be in different AdaptationSets | ACDS    
ASCDesc | strl | D | List of common descriptors for the DASH AdaptationSet containing this PID | AADS    
RDesc | strl | D | List of descriptors for the DASH Representation containing this PID | RDES    
BUrl | strl | D | List of base URLs for this PID | BURL    
Template | str |  | Template to use for DASH generation for this PID | DTPL    
StartNumber | uint |  | Start number to use for this PID - cf dasher help | DRSN    
xlink | str | D | Remote period URL for DASH - cf dasher help | XLNK    
ClampDur | lfrac | D | Max media duration to process from PID in DASH mode | DCMD    
HLSPL | str | D | Name of the HLS variant playlist for this media | HLVP    
HLSGroup | str | D | Name of HLS Group of a stream | HLGI    
HLSRend | strl | D | List of HLS group allowed in group rendition - when not set, all groups are allowed | HLGR    
HLSForce | str | D | Force writing EXT-X-STREAM-INF if stream is in a rendition group, value is the name of associated groups (can be empty) | HLFI    
HLSMExt | strl | D | List of extensions to add to the master playlist for this PID | HLMX    
HLSVExt | strl | D | List of extensions to add to the variant playlist for this PID | HLVX    
DCue | str | D | Name of a cue list file for this PID - see dasher help | DCUE    
DSegs | uint | D | Number of DASH segments defined by the DASH cue info | DCNS    
Codec | str | D | codec parameter string to force. If starting with '.', appended to ISOBMFF code point; otherwise replace the codec string | CODS    
SingleScale | bool | D | Movie header should use the media timescale of the first track added | DSTS    
RequireReorder | bool | D | PID packets come from source with losses and reordering happening (UDP) | PUDP    
Primary | bool | D | Primary item in ISOBMFF | PITM    
DFMode | uint | D | DASH forward mode is used for this PID. If 2, the manifest is also carried in packet propery | DFWD    
DFManifest | str | DP | Value of manifest in forward mode | DMPD    
DFVariant | strl | DP | Value of variant playlist in forward mode | DHLV    
DFVariantName | strl | DP | Value of variant playlist name in forward mode | DHLN    
DFPStart | luint | D | Value of active period start time in ms in forward mode | DPST    
DFPckPStart | bool | DP | Indicate new period start (only set on first packets of non-first periods) | PDPS    
HLSKey | str |  | URI, KEYFORMAT and KEYFORMATVERSIONS for HLS full segment encryption creation, Key URI otherwise ( decoding and sample-AES) | HLSK    
HLSIV | mem |  | Init Vector for HLS decode | HLSI    
CKUrl | str |  | URL for ClearKey licence server | CCKU    
ColorPrimaries | cprm | D | Color primaries | CPRM    
ColorTransfer | ctfc | D | Color transfer characteristics | CTRC    
ColorTransferAlternative | ctfc | D | Alternative Color transfer characteristics | CATC    
ColorMatrix | cmxc | D | Color matrix coefficient | CMXC    
FullRange | bool | D | Color full range flag | CFRA    
Chroma | uint | D | Chroma format (see ISO/IEC 23001-8 / 23091-2) | CFMT    
ChromaLoc | uint | D | Chroma location (see ISO/IEC 23001-8 / 23091-2) | CLOC    
ContentLightLevel | mem | D | Content light level, payload of clli box (see ISO/IEC 14496-12), can be set as a list of 2 integers in fragment declaration (e.g. "=max_cll,max_pic_avg_ll") | CLLI    
MasterDisplayColour | mem | D | Master display colour info, payload of mdcv box (see ISO/IEC 14496-12), can be set as a list of 10 integers in fragment declaration (e.g. "=dpx0,dpy0,dpx1,dpy1,dpx2,dpy2,wpx,wpy,max,min") | MDCV    
ICC | mem | D | ICC profile (see ISO 15076-1 or ICC.1) | ICCP    
SrcMagic | luint | D | Magic number to store in the track, only used by importers | PSMG    
MuxIndex | uint | D | Target track index in destination file, stored by lowest value first (not set by demultiplexers) | TIDX    
NoTSLoop | bool |  | Timestamps on this PID are adjusted in case of loops (used by TS multiplexer output) | NTSL    
MHAProfiles | uintl | D | List of compatible profiles for this MPEG-H Audio object | MHCP    
FragStart | uint | DP | Packet is a fragment start (value 1) or a segment start (value 2) | PFRB    
FragRange | lfrac | DP | Start and end position in bytes of fragment if packet is a fragment or segment start | PFRR    
FragTFDT | luint | DP | Decode time of first packet in fragment | PFRT    
SIDXRange | lfrac | DP | Start and end position in bytes of sidx in segment if any | PFSR    
VODSIDXRange | lfrac | D | Start and end position in bytes of root sidx | PRSR    
MoofTemplate | mem | DP | Serialized moof box corresponding to the start of a movie fragment or segment (with styp and optionally sidx) | MFTP    
InitSeg | bool | P | Set to true if packet is a complete DASH init segment file | PCKI    
RawGrab | uint | D | PID is a raw media grabber (webcam, microphone, etc...). Value 2 is used for front camera | PGRB    
KeepAfterEOS | bool | D | PID must be kept alive after EOS (LASeR and BIFS) | PKAE    
CoverArt | mem | D | PID cover art image data. If associated data is NULL, the data is carried in the PID | PCOV    
BufferLength | uint | D | Playout buffer in ms | PBPL    
MaxBuffer | uint | D | Maximum buffer occupancy in ms | PBMX    
ReBuffer | uint | D | Rebuffer threshold in ms, 0 disable rebuffering | PBRE    
ViewIdx | uint | D | View index for multiview (1 being left) | VIDX    
FragURL | str | D | Fragment URL (without '#') of original URL (used by some filters to set the property on media PIDs) | OFRA    
MCASTIP | str | D | session Multicast IP address for ROUTE/MABR | MSIP    
MCASTPort | uint | D | session port number for ROUTE/MABR | MSPN    
MCASTName | str | D | Name (location) of raw file to advertise in ROUTE/MABR session | MSFN    
MCASTCarousel | frac | D | Carousel period in seconds of raw file or low-latency manifest/init segments for ROUTE/MABR sessions | MSCR    
MCASTUpload | frac | D | Upload time in seconds of raw files for ROUTE/MABR sessions | MSST    
Stereo | uint | D | Stereo type of video | PSTT    
Projection | uint | D | Projection type of video | PPJT    
InitialPose | v3di | D | Initial pose for 360 video, in degrees expressed as 16.16 bits (x is yaw, y is pitch, z is roll) | PPOS    
CMPad | uint | D | Number of pixels to pad from edge of each face in cube map | PCMP    
EQRClamp | v4di | D | Clamping of frame for EQR as 0.32 fixed point (x is top, y is bottom, z is left and w is right) | PEQC    
SceneNode | bool |  | PID is a scene node decoder (AFX BitWrapper in BIFS) | PSND    
OrigCryptoScheme | 4cc |  | Original crypto scheme on a decrypted PID | POCS    
TSBSegs | uint | D | Time shift in number of segments for HAS streams, only set by dashin and dasher filters | PTSN    
IsManifest | uint | D | PID is a HAS manifest (bit 9 set to 1 if live), lower 8 bits value can be  <br/>
- 0: not a manifest  <br/>- 1: DASH manifest  <br/>- 2: HLS manifest  <br/>- 3: GHI(X) manifest | PHSM    
Sparse | bool | D | PID has potentially empty times between packets | PSPA    
CharSet | str | D | Character set for input text PID | PCHS    
ForcedSub | uint | D | PID forced sub  <br/>
- 0: not forced  <br/>- 1: some frames are forced  <br/>- 2: all frames are forced | PFCS    
ChapTimes | uintl | D | Chapter start times | CHPT    
ChapNames | strl | D | Chapter names | CHPN    
IsChap | bool | D | Subtitle PID is chapter (for QT-like chapters) | PCHP    
SkipBegin | uint | P | Amount of media to skip from beginning of packet in PID timescale (when set o PID, indicate packets with skip will be present) | PCKS    
SkipPres | bool | P | Packet and any following with CTS greater than this packet shall not be presented (used by reframer to create edit lists) | PCKD    
OriginalDuration | frac | P | Elapsed time (.num) and original duration (.den, 0 if last copy of packet) for redundant packets | PCOD    
HasSkipBegin | bool |  | Indicate if PID will carry packets with `SkipBegin` properties | PSBP    
HLSRef | luint | D | HLS playlist reference, gives a unique ID identifying media mux, and indicated in packets carrying child playlists | PHLR    
PckHLSRef | luint | DP | Same as `HLSRef` but carried on packets for ROUTE/MABR file transfer | HPLR    
LLHAS | uint | D | DASH/HLS low latency mode | HLHS    
LLHASFragNum | uint | DP | DASH-SSR/LLHLS fragment number | HLSN    
DownloadSession | ptr | D | Pointer to download session | GHTT    
HasTemi | bool | D | TEMI present flag | PTEM    
XPSMask | uint | DP | Parameter set mask | PXPM    
RangeEnd | bool | P | Signal packet is the last in the desired play range | PCER    
RefID | sint | P | packet identifier for dependency (usually POC for video) | PKID    
Refs | sintl | P | list of packet identifier this packet depends on | PRFS    
UDTA | ptr | DP | User data for the packet | PUDT    
Timecode | mem | P | First timecode extracted from SEI (if present) | TCOD    
DOVI | mem |  | DolbyVision configuration | DOVI    
OutPath | str |  | Output file name of PID used by some filters creating additional raw PIDs | FDST    
ACrypMeta | mem |  | Meta-data for Adobe encryption | AMET    
HasCRoll | bool |  | Indicates if key roll is used in CENC | CROL    
STSDAllTemplates | mem | D | ISOBMFF serialized sample description box for this PID | ISTA    
STSDTemplateIdx | uint | D | Index of corresponding `STSDAllTemplates` | ISTI    
PremuxType | uint |  | Main streamtype of the PID before mux, only used for ROUTE/MABR setup | PPST    
CodecMerge | uint | D | Indicate the PID can be merged with other streams with same value for single decoding  (HEVC only for now) | PCMB    
RelativePath | bool | DP | Indicate the packet file name uses relative path | FNRL    
ClearKeyID | mem | D | Key ID for ClearKey scheme | CCKI    
DashSparse | bool | D | indicate DASH segments are generated in sparse mode (from context) | DSSG    
DashDepGroup | uint | D | indicate DASH dependency group ID | DGDI    
SC35Ref | uint | D | PID has SCTE35 information carried on indicated PID number | SC35    
NoInit | bool | D | PID does not use any init segment in DASH (file forward mode of dasher, only used for ROUTE/MABR) | PNIN    
ForceUnframe | bool | D | force creation of rewriter filter (only used for forcing reparse of NALU-based codecs) | PFUF    
MetaCodecID | uint | D | identifier for meta codecs (FFmpeg, ...) | MDCI    
MetaCodecName | str | D | Name used by for meta codecs (FFmpeg, ...) | MDCN    
MetaCodecOpaque | uint | D | Internal property used for meta demuxers ( FFmpeg, ...) codec opaque data | MDOP    
HASSegStart | lfrac | DP | Start time of segment for ROUTE/MABR scheduling | FMSS    
SplitStart | uint | DP | split start time of packet in PID timescale, for index-based dashing | PSPS    
SplitEnd | uint | DP | split end time of packet in PID timescale, for index-based dashing | PSPE    
InitName | str | D | Name of init segment when dashing, used for ROUTE/MABR | PINM    
SegURL | str | DP | URL of source segment (when forwarding fragment boundaries) | SURL    
DynPSSH | mem | P | PSSH blob for CENC, same format as `CENC_PSSH`, used when using master key and roll keys, signaled on first packet of segment where the PSSH changes | PSHP    
LLHASTemplate | str | P | Template for DASH-SSR and LLHLS sub-segments | PSRT    
PartialRepair | bool | P | indicate the mux data in the associated data is parsable but contains errors (only set on corrupted packets) | PCPR    
SEILoaded | bool | D | indicate that PID is extracting SEI/inband data from packets | PSEI    
Fake | bool | D | Indicate a stream present in the source but not delivered as a PID | PFAK    
ContentLightLevel | mem | DP | Content light level, payload of clli box (see ISO/IEC 14496-12), can be set as a list of 2 integers in fragment declaration (e.g. "=max_cll,max_pic_avg_ll") | CLLP    
MasterDisplayColour | mem | DP | Master display colour info, payload of mdcv box (see ISO/IEC 14496-12), can be set as a list of 10 integers in fragment declaration (e.g. "=dpx0,dpy0,dpx1,dpy1,dpx2,dpy2,wpx,wpy,max,min") | MDCP    
SEILoaded | bool | DP | indicate that packet has SEI/inband data in its properties | SEIP    
OriginalPTS | luint | DP | indicate original PTS or PCR when remapping M2TS PCR | OPTS    
OriginalDTS | luint | DP | indicate original DTS when remapping M2TS PCR | ODTS    
MABRBaseURLs | strl | D | optionnal URLs for MABR - if first is `none`source server is not declared as repair server | MABU    
Forced | bool | DP | indicate packet is a forced subtitle | PCFS    

# Pixel formats  
  
Name | File extensions | QT 4CC | Description    
 --- | --- |  --- | ---    
yuv420 | yuv | j420 | Planar YUV 420 8 bit    
yvu420 | yvu |  | Planar YVU 420 8 bit    
yuv420_10 | yuvl |  | Planar YUV 420 10 bit    
yuv422 | yuv2 |  | Planar YUV 422 8 bit    
yuv422_10 | yp2l |  | Planar YUV 422 10 bit    
yuv444 | yuv4 |  | Planar YUV 444 8 bit    
yuv444_10 | yp4l |  | Planar YUV 444 10 bit    
uyvy | uyvy | 2vuy | Packed UYVY 422 8 bit    
vyuy | vyuy |  | Packed VYUV 422 8 bit    
yuyv | yuyv | yuv2 | Packed YUYV 422 8 bit    
yvyu | yvyu | YVYU | Packed YVYU 422 8 bit    
uyvl | uyvl | v216 | Packed UYVY 422 10->16 bit    
vyul | vyul |  | Packed VYUV 422 10->16 bit    
yuyl | yuyl |  | Packed YUYV 422 10->16 bit    
yvyl | yvyl |  | Packed YVYU 422 10->16 bit    
nv12 | nv12 |  | Semi-planar YUV 420 8 bit, Y plane and UV packed plane    
nv21 | nv21 |  | Semi-planar YVU 420 8 bit, Y plane and VU packed plane    
nv1l | nv1l |  | Semi-planar YUV 420 10 bit, Y plane and UV plane    
nv2l | nv2l |  | Semi-planar YVU 420 8 bit, Y plane and VU plane    
yuva | yuva |  | Planar YUV+alpha 420 8 bit    
yuvd | yuvd |  | Planar YUV+depth  420 8 bit    
yuv444a | yp4a |  | Planar YUV+alpha 444 8 bit    
yuv444p | yv4p |  | Packed YUV 444 8 bit    
v308 | v308 | v308 | Packed VYU 444 8 bit    
yuv444ap | y4ap |  | Packed YUV+alpha 444 8 bit    
v408 | v408 | v408 | Packed UYV+alpha 444 8 bit    
v410 | v410 | v410 | Packed UYV 444 10 bit LE    
v210 | v210 | v210 | Packed UYVY 422 10 bit LE    
grey | grey |  | Greyscale 8 bit    
algr | algr |  | Alpha+Grey 8 bit    
gral | gral |  | Grey+Alpha 8 bit    
rgb8 | rgb8 |  | RGB 332, 8 bits / pixel    
rgb4 | rgb4 |  | RGB 444, 12 bits (16 stored) / pixel    
rgb5 | rgb5 |  | RGB 555, 15 bits (16 stored) / pixel    
rgb6 | rgb6 |  | RGB 555, 16 bits / pixel    
rgba | rgba | RGBA | RGBA 32 bits (8 bits / component)    
argb | argb |  | ARGB 32 bits (8 bits / component)    
bgra | bgra |  | BGRA 32 bits (8 bits / component)    
abgr | abgr | ABGR | ABGR 32 bits (8 bits / component)    
rgb | rgb | raw  | RGB 24 bits (8 bits / component)    
bgr | bgr |  | BGR 24 bits (8 bits / component)    
xrgb | xrgb |  | xRGB 32 bits (8 bits / component)    
rgbx | rgbx |  | RGBx 32 bits (8 bits / component)    
xbgr | xbgr |  | xBGR 32 bits (8 bits / component)    
bgrx | bgrx |  | BGRx 32 bits (8 bits / component)    
rgbd | rgbd |  | RGB+depth 32 bits (8 bits / component)    
rgbds | rgbds |  | RGB+depth+bit shape (8 bits / RGB component, 7 bit depth (low bits) + 1 bit shape)    
extgl | extgl |  | External OpenGL texture of unknown format, to be used with samplerExternalOES  <br/>    
uncv | uncv |  | Generic uncompressed format ISO/IEC 23001-17    

# Audio formats  
  
 Name | File extensions | Description    
 --- | --- | ---    
u8 | pc8 | 8 bit PCM    
s16 | pcm | 16 bit PCM Little Endian    
s16b | pcmb | 16 bit PCM Big Endian    
s24 | s24 | 24 bit PCM    
s24b | s24b | 24 bit Big-Endian PCM    
s32 | s32 | 32 bit PCM Little Endian    
s32b | s32b | 32 bit PCM Big Endian    
flt | flt | 32-bit floating point PCM    
fltb | fltb | 32-bit floating point PCM Big Endian    
dbl | dbl | 64-bit floating point PCM    
dblb | dblb | 64-bit floating point PCM Big Endian    
u8p | pc8p | 8 bit PCM planar    
s16p | pcmp | 16 bit PCM Little Endian planar    
s24p | s24p | 24 bit PCM planar    
s32p | s32p | 32 bit PCM Little Endian planar    
fltp | fltp | 32-bit floating point PCM planar    
dblp | dblp | 64-bit floating point PCM planar    

# Stream types  
  
 Name | Description    
 --- | ---    
Visual | Video or Image stream    
Audio | Audio stream    
SceneDescription | Scene stream    
Text | Text or subtitle stream    
Metadata | Metadata stream    
File | Raw file stream    
Encrypted | Encrypted media stream    
ObjectDescriptor | MPEG-4 ObjectDescriptor stream    
ClockReference | MPEG-4 Clock Reference stream    
MPEG7 | MPEG-7 description stream    
IPMP | MPEG-4 IPMP/DRM stream    
OCI | MPEG-4 ObjectContentInformation stream    
MPEGJ | MPEG-4 JAVA stream    
Interaction | MPEG-4 Interaction Sensor stream    
Font | MPEG-4 Font stream    

# Codecs  
  
The codec name identifies a codec within GPAC. There can be several names for a given codec. The first name is used as a default file extension when dumping a raw media stream.    
  
_NOTE: This table does not include meta filters (ffmpeg, ...). Use `gpac -hx codecs` to list them._    
    
 Name | Description    
 --- | ---    
bifs | MPEG-4 BIFS v1 Scene Description    
bifs2 | MPEG-4 BIFS v2 Scene Description    
bifsX | MPEG-4 BIFS Extended Scene Description    
od | MPEG-4 ObjectDescriptor v1    
od2 | MPEG-4 ObjectDescriptor v2    
interact | MPEG-4 Interaction Stream    
afx | MPEG-4 AFX Stream    
font | MPEG-4 Font Stream    
syntex | MPEG-4 Synthetized Texture    
m4txt | MPEG-4 Streaming Text    
laser | MPEG-4 LASeR    
saf | MPEG-4 Simple Aggregation Format    
cmp m4ve m4v | MPEG-4 Visual part 2    
264 avc h264 | MPEG-4 AVC|H264 Video    
avcps | MPEG-4 AVC|H264 Video Parameter Sets    
svc avc 264 h264 | MPEG-4 AVC|H264 Scalable Video Coding    
mvc | MPEG-4 AVC|H264 Multiview Video Coding    
hvc hevc h265 | HEVC Video    
lhvc shvc mhvc | HEVC Video Layered Extensions    
m2vs | MPEG-2 Visual Simple    
m2v | MPEG-2 Visual Main    
m2v m2vsnr | MPEG-2 Visual SNR    
m2v m2vspat | MPEG-2 Visual Spatial    
m2v m2vh | MPEG-2 Visual High    
m2v m2v4 | MPEG-2 Visual 422    
m1v | MPEG-1 Video    
jpg jpeg | JPEG Image    
png | PNG Image    
jp2 j2k | JPEG2000 Image    
aac | MPEG-4 AAC Audio    
aac aac2m | MPEG-2 AAC Audio Main    
aac aac2l | MPEG-2 AAC Audio Low Complexity    
aac aac2s | MPEG-2 AAC Audio Scalable Sampling Rate    
mp3 m1a | MPEG-1 Audio    
mp2 | MPEG-2 Audio    
mp1 | MPEG-1 Audio Layer 1    
h263 | H263 Video    
h263 | H263 Video    
hvt1 | HEVC tiles Video    
evc evrc | EVRC Voice    
smv | SMV Voice    
qcp qcelp | QCELP Voice    
amr | AMR Audio    
amr amrwb | AMR WideBand Audio    
qcp evrcpv | EVRC (PacketVideo MUX) Audio    
vc1 | SMPTE VC-1 Video    
dirac | Dirac Video    
ac3 | AC3 Audio    
eac3 | Enhanced AC3 Audio    
ac4 | AC4 Audio    
mlp | Dolby TrueHD    
dra | DRA Audio    
g719 | G719 Audio    
dtsc | DTS Coherent Acoustics and Digital Surround Audio    
dtsh | DTS-HD High Resolution Audio and DTS-Master Audio    
dtsl | DTS-HD Substream containing only XLLAudio    
dtse | DTS Express low bit rate Audio    
dtsx | DTS-X UHD Audio Profile 2    
dtsy | DTS-X UHD Audio Profile 3    
opus | Opus Audio    
eti | DVB Event Information    
svgr | SVG over RTP    
svgzr | SVG+gz over RTP    
dims | 3GPP DIMS Scene    
vtt | WebVTT Text    
txt | Simple Text Stream    
mtxt | Metadata Text Stream    
mxml | Metadata XML Stream    
subs | Subtitle text Stream    
subx | Subtitle XML Stream    
tx3g | Subtitle/text 3GPP/Apple Stream    
ssa | SSA /ASS Subtitles    
theo theora | Theora Video    
vorb vorbis | Vorbis Audio    
opus | Opus Audio    
iamf | AOM IAMF (Immersive Audio Model and Formats)    
flac | Flac Audio    
spx speex | Speex Audio    
vobsub | VobSub Subtitle    
vobsub | VobSub Subtitle    
adpcm | AD-PCM    
csvd | IBM CSVD    
alaw | ALAW    
mulaw | MULAW    
okiadpcm | OKI ADPCM    
dviadpcm | DVI ADPCM    
digistd | DIGISTD    
yamadpcm | YAMAHA ADPCM    
truespeech | DSP TrueSpeech    
g610 | GSM 610    
imulaw | IBM MULAW    
ialaw | IBM ALAW    
iadpcl | IBM ADPCL    
swf | Adobe Flash    
raw | Raw media    
uncv | Raw Video    
av1 ivf obu av1b | AOM AV1 Video    
vp8 ivf | VP8 Video    
vp9 ivf | VP9 Video    
vp10 ivf | VP10 Video    
mhas | MPEG-H Audio    
mhas | MPEG-H AudioMux    
prores apch | ProRes Video 422 HQ    
prores apco | ProRes Video 422 Proxy    
prores apcn | ProRes Video 422 STD    
prores apcs | ProRes Video 422 LT    
prores ap4x | ProRes Video 4444 XQ    
prores ap4h | ProRes Video 4444    
ffmpeg | FFmpeg unmapped codec    
tmcd | QT TimeCode    
sc35 | SCTE35    
evte | Event Messages    
vvc 266 h266 | VVC Video    
vvs1 | VVC Subpicture Video    
usac xheaac | xHEAAC / USAC Audio    
ffv1 | FFmpeg Video Codec 1    
dvbs | DVB Subtitles    
dvbs | DVB-TeleText    
div3 | MS-MPEG4 V3    
caf | Apple Lossless Audio    
dnx | AViD DNxHD    

# Audio channel layout code points (ISO/IEC 23091-3)  
  
 Name | Integer value | ChannelMask    
 --- | ---  | ---    
mono | 1 | 0x0000000000000004    
stereo | 2 | 0x0000000000000003    
3/0.0 | 3 | 0x0000000000000007    
3/1.0 | 4 | 0x0000000000000407    
3/2.0 | 5 | 0x0000000000000037    
3/2.1 | 6 | 0x000000000000003f    
5/2.1 | 7 | 0x000000000000003f    
1+1 | 8 | 0x0000000000000003    
2/1.0 | 9 | 0x0000000000000403    
2/2.0 | 10 | 0x0000000000000033    
3/3.1 | 11 | 0x000000000000043f    
3/4.1 | 12 | 0x000000000000033f    
11/11.2 | 13 | 0x000000003ffe67cf    
5/2.1 | 14 | 0x000000000006003f    
5/5.2 | 15 | 0x000000000606603f    
5/4.1 | 16 | 0x000000000036003f    
6/5.1 | 17 | 0x00000000023e003f    
6/7.1 | 18 | 0x00000600023e003f    
5/6.1 | 19 | 0x000000000036630f    
7/6.1 | 20 | 0x000000600036630f    

# Color Primaries code points (ISO/IEC 23091-2)  
  
 Name | Integer value   
 --- | ---    
 reserved0 | 0   
 BT709 | 1   
 undef | 2   
 reserved3 | 3   
 BT470M | 4   
 BT470G | 5   
 SMPTE170 | 6   
 SMPTE240 | 7   
 FILM | 8   
 BT2020 | 9   
 SMPTE428 | 10   
 SMPTE431 | 11   
 SMPTE432 | 12   
 EBU3213 | 22   

# Transfer Characteristics code points (ISO/IEC 23091-2)  
  
 Name | Integer value   
 --- | ---    
 reserved0 | 0   
 BT709 | 1   
 undef | 2   
 reserved3 | 3   
 BT470M | 4   
 BT470BG | 5   
 SMPTE170 | 6   
 SMPTE249 | 7   
 Linear | 8   
 Log100 | 9   
 Log316 | 10   
 IEC61966 | 11   
 BT1361 | 12   
 sRGB | 13   
 BT2020_10 | 14   
 BT2020_12 | 15   
 SMPTE2084 | 16   
 SMPTE428 | 17   
 STDB67 | 18   

# Matrix Coefficients code points (ISO/IEC 23091-2)  
  
 Name | Integer value   
 --- | ---    
 GBR | 0   
 BT709 | 1   
 undef | 2   
 unknown | 3   
 FCC | 4   
 BT601 | 5   
 SMPTE170 | 6   
 SMPTE240 | 7   
 YCgCo | 8   
 BT2020 | 9   
 BT2020cl | 10   
 YDzDx | 11   

# Extensions and mime types  
  
Extension name can be used to force output formats using `ext=` option of sink filters.    
By default, GPAC does not rely on file extension for source processing unless `-no-probe` option is set, in which case `ext=` option may be set on source filter.    
_NOTE: This table does not include meta filters (ffmpeg, ...), use `gpac -hx formats` to list them._  
  
 Extension | Input Filter(s) | Output Filter(s) | Mime(s)   
 --- | --- | --- | ---    
mp4 | mp4dmx | mp4mx | video/mp4 audio/mp4 application/mp4   
mpg4 | mp4dmx | mp4mx | application/mp4   
m4a | mp4dmx | mp4mx | audio/mp4   
m4i | mp4dmx | mp4mx | application/mp4   
3gp | mp4dmx | mp4mx | video/3gpp audio/3gpp   
3gpp | mp4dmx | mp4mx | video/3gpp audio/3gpp   
3g2 | mp4dmx | mp4mx | video/3gp2 audio/3gp2   
3gp2 | mp4dmx | mp4mx | video/3gp2 audio/3gp2   
iso | mp4dmx | mp4mx | video/mp4 audio/mp4 application/mp4   
m4s | mp4dmx | mp4mx | video/iso.segment audio/iso.segment   
iff | mp4dmx | mp4mx | image/heif   
heif | mp4dmx | mp4mx | image/heif   
heic | mp4dmx | mp4mx | image/heic   
avif | mp4dmx | mp4mx | image/avci   
avci | mp4dmx | mp4mx | image/avci   
mj2 | mp4dmx | mp4mx | video/jp2   
ismv | mp4dmx | mp4mx | video/mp4 audio/mp4 application/mp4   
mov | mp4dmx | mp4mx | video/quicktime   
qt | mp4dmx | mp4mx | video/quicktime   
bt | btplay | n/a | application/x-bt   
btz | btplay | n/a | application/x-bt   
bt.gz | btplay | n/a | application/x-bt   
xmt | btplay | n/a | application/x-xmt   
xmt.gz | btplay | n/a | application/x-xmt   
xmtz | btplay | n/a | application/x-xmt   
wrl | btplay | n/a | model/vrml   
wrl.gz | btplay | n/a | model/vrml   
x3dv | btplay | n/a | model/x3d+vrml   
x3dv.gz | btplay | n/a | model/x3d+vrml   
x3dvz | btplay | n/a | model/x3d+vrml   
x3d | btplay | n/a | model/x3d+xml   
x3d.gz | btplay | n/a | model/x3d+xml   
x3dz | btplay | n/a | model/x3d+xml   
swf | btplay txtin | n/a | application/x-shockwave-flash   
xsr | btplay | n/a | application/x-LASeR+xml   
svg | svgplay | n/a | image/svg+xml   
svgz | svgplay | n/a | image/svg+xml   
svg.gz | svgplay | n/a | image/svg+xml   
jpg | rfimg | writegen | image/jpg   
jpeg | rfimg | writegen | image/jpg   
jp2 | rfimg | writegen | image/jp2   
j2k | rfimg | writegen | image/jp2   
bmp | rfimg | writegen | image/bmp   
png | rfimg | writegen | image/png   
aac | rfadts | writegen | audio/aac   
adts | rfadts | writegen | audio/aac   
latm | rflatm | writegen | audio/aac+latm   
usac | rflatm | writegen | audio/xheaac+latm   
xheaac | rflatm | writegen | audio/xheaac+latm   
mp3 | rfmp3 | writegen | audio/mp3 audio/x-mp3   
mp2 | rfmp3 | writegen | audio/mp3 audio/x-mp3   
mp1 | rfmp3 | writegen | audio/mp3 audio/x-mp3   
ac3 | rfac3 | writegen | audio/ac3   
eac3 | rfac3 | writegen | audio/eac3   
ec3 | rfac3 | n/a | audio/x-ac3 audio/ac3 audio/x-eac3 audio/eac3   
ac4 | rfac4 | writegen | audio/x-ac4 audio/ac4   
amr | rfamr | writegen | audio/amr   
awb | rfamr | writegen | audio/amr   
evc | rfamr | writegen | audio/x-evc   
smv | rfamr | writegen | audio/x-smv   
oga | oggdmx | oggmx | audio/ogg   
spx | oggdmx | writegen oggmx | audio/ogg   
ogg | oggdmx | oggmx | video/ogg   
ogv | oggdmx | oggmx | video/ogg   
oggm | oggdmx | oggmx | application/ogg   
opus | oggdmx | oggmx | audio/ogg   
ts | m2tsdmx | m2tsmx | video/mp2t   
m2t | m2tsdmx | m2tsmx | video/mp2t   
mts | m2tsdmx | m2tsmx | video/mp2t   
dmb | m2tsdmx | m2tsmx | video/mp2t   
trp | m2tsdmx | m2tsmx | video/mp2t   
saf | safdmx | n/a | application/x-saf application/saf   
lsr | safdmx | n/a | application/x-saf application/saf   
mpd | dashin | dasher | application/dash+xml   
m3u8 | dashin | dasher | application/vnd.apple.mpegurl   
3gm | dashin | dasher | application/vnd.3gpp.mpd   
ism | dashin | dasher | application/vnd.ms-sstr+xml   
qcp | rfqcp | writeqcp | audio/qcelp audio/evr-qcp audio/smv-qcp   
263 | rfh263 | writegen | video/h263   
h263 | rfh263 | writegen | video/h263   
s263 | rfh263 | writegen | video/h263   
cmp | rfmpgvid | writegen | video/mp4v-es video/mpgv-es   
m1v | rfmpgvid | writegen | video/mp4v-es video/mpgv-es   
m2v | rfmpgvid | writegen | video/mp4v-es video/mpgv-es   
m4v | rfmpgvid | writegen | video/mp4v-es video/mpgv-es   
nhnt | nhntr | nhntw | application/x-nhnt   
nhml | nhmlr | nhmlw | application/x-nhml application/dims   
dims | nhmlr | nhmlw | application/x-nhml application/dims   
dml | nhmlr | nhmlw | application/x-nhml application/dims   
264 | rfnalu | writegen | video/h264   
h264 | rfnalu | writegen | video/h264   
26l | rfnalu | writegen | video/h264   
h26l | rfnalu | writegen | video/h264   
avc | rfnalu | writegen | video/h264   
svc | rfnalu | writegen | video/svc   
mvc | rfnalu | writegen | video/mvc   
hevc | rfnalu | writegen | video/hevc   
hvc | rfnalu | writegen | video/hevc   
265 | rfnalu | writegen | video/hevc   
h265 | rfnalu | writegen | video/hevc   
lhvc | rfnalu | writegen | video/lhvc   
shvc | rfnalu | writegen | video/shvc   
mhvc | rfnalu | writegen | video/mhvc   
266 | rfnalu | writegen | video/vvc   
h266 | rfnalu | writegen | video/vvc   
vvc | rfnalu | writegen | video/vvc   
lvvc | rfnalu | writegen | video/vvc   
mpg | m2psdmx | n/a | video/mpeg audio/mpeg video/mpegps   
mpeg | m2psdmx | n/a | video/mpeg audio/mpeg video/mpegps   
vob | m2psdmx | n/a | video/mpeg audio/mpeg video/mpegps   
avi | avidmx | n/a | video/avi video/x-avi   
srt | txtin | writegen | subtitle/srt   
ttxt | txtin | writegen | subtitle/x-ttxt   
sub | txtin vobsubdmx | n/a | subtitle/sub   
vtt | txtin | writegen | subtitle/vtt   
txml | txtin | writegen | x-quicktime/text   
ttml | txtin | writegen | subtitle/ttml   
ssa | txtin | writegen | subtitle/ssa   
ass | txtin | writegen | subtitle/ssa   
sdp | rtpin | rtpout | application/sdp   
yuv | rfrawvid | writegen | video/x-raw   
yvu | rfrawvid | writegen | video/x-raw   
yuvl | rfrawvid | writegen | video/x-raw   
yuv2 | rfrawvid | writegen | video/x-raw   
yp2l | rfrawvid | writegen | video/x-raw   
yuv4 | rfrawvid | writegen | video/x-raw   
yp4l | rfrawvid | writegen | video/x-raw   
uyvy | rfrawvid | writegen | video/x-raw   
vyuy | rfrawvid | writegen | video/x-raw   
yuyv | rfrawvid | writegen | video/x-raw   
yvyu | rfrawvid | writegen | video/x-raw   
uyvl | rfrawvid | writegen | video/x-raw   
vyul | rfrawvid | writegen | video/x-raw   
yuyl | rfrawvid | writegen | video/x-raw   
yvyl | rfrawvid | writegen | video/x-raw   
nv12 | rfrawvid | writegen | video/x-raw   
nv21 | rfrawvid | writegen | video/x-raw   
nv1l | rfrawvid | writegen | video/x-raw   
nv2l | rfrawvid | writegen | video/x-raw   
yuva | rfrawvid | writegen | video/x-raw   
yuvd | rfrawvid | writegen | video/x-raw   
yp4a | rfrawvid | writegen | video/x-raw   
yv4p | rfrawvid | writegen | video/x-raw   
v308 | rfrawvid | writegen | video/x-raw   
y4ap | rfrawvid | writegen | video/x-raw   
v408 | rfrawvid | writegen | video/x-raw   
v410 | rfrawvid | writegen | video/x-raw   
v210 | rfrawvid | writegen | video/x-raw   
grey | rfrawvid | writegen | video/x-raw   
algr | rfrawvid | writegen | video/x-raw   
gral | rfrawvid | writegen | video/x-raw   
rgb8 | rfrawvid | writegen | video/x-raw   
rgb4 | rfrawvid | writegen | video/x-raw   
rgb5 | rfrawvid | writegen | video/x-raw   
rgb6 | rfrawvid | writegen | video/x-raw   
rgba | rfrawvid | writegen | video/x-raw   
argb | rfrawvid | writegen | video/x-raw   
bgra | rfrawvid | writegen | video/x-raw   
abgr | rfrawvid | writegen | video/x-raw   
rgb | rfrawvid | writegen | video/x-raw   
bgr | rfrawvid | writegen | video/x-raw   
xrgb | rfrawvid | writegen | video/x-raw   
rgbx | rfrawvid | writegen | video/x-raw   
xbgr | rfrawvid | writegen | video/x-raw   
bgrx | rfrawvid | writegen | video/x-raw   
rgbd | rfrawvid | writegen | video/x-raw   
rgbds | rfrawvid | writegen | video/x-raw   
uncv | rfrawvid | writegen | video/x-raw   
pc8 | rfpcm | writegen | audio/x-pcm   
pcm | rfpcm | writegen | audio/x-pcm   
pcmb | rfpcm | writegen | audio/x-pcm   
s24 | rfpcm | writegen | audio/x-pcm   
s24b | rfpcm | writegen | audio/x-pcm   
s32 | rfpcm | writegen | audio/x-pcm   
s32b | rfpcm | writegen | audio/x-pcm   
flt | rfpcm | writegen | audio/x-pcm   
fltb | rfpcm | writegen | audio/x-pcm   
dbl | rfpcm | writegen | audio/x-pcm   
dblb | rfpcm | writegen | audio/x-pcm   
pc8p | rfpcm | writegen | audio/x-pcm   
pcmp | rfpcm | writegen | audio/x-pcm   
s24p | rfpcm | writegen | audio/x-pcm   
s32p | rfpcm | writegen | audio/x-pcm   
fltp | rfpcm | writegen | audio/x-pcm   
dblp | rfpcm | writegen | audio/x-pcm   
wav | rfpcm | writegen | audio/wav audio/wave   
obu | rfav1 | writegen | video/x-ivf video/av1   
av1 | rfav1 | writegen | video/x-ivf video/av1   
av1b | rfav1 | writegen | video/x-ivf video/av1   
ivf | rfav1 | writegen | video/x-ivf video/av1   
prores | rfprores | writegen | video/prores   
txt | n/a | writegen | x-subtitle/srt subtitle/srt text/srt   
xml | n/a | writegen | subtitle/ttml text/ttml application/xml+ttml   
qcelp | n/a | writegen | audio/x-qcelp   
theo | n/a | writegen | video/x-theora   
vorb | n/a | writegen | audio/x-vorbis   
flac | rfflac | writegen | audio/flac   
mhas | rfmhas | writegen | audio/mpegh   
vc1 | ffdmx | writegen | video/vc1   
mlp | rftruehd | writegen | audio/truehd   
thd | rftruehd | writegen | audio/truehd   
truehd | rftruehd | writegen | audio/truehd   
ffv1 | n/a | writegen | video/x-ffv1   
y4m | rfrawvid | writegen | video/x-yuv4mpeg   
dts | ffdmx | writegen | audio/dts   
idx | vobsubdmx | n/a | text/vobsub   
m3u | flist | n/a | application/x-gpac-playlist   
pl | flist | n/a | application/x-gpac-playlist   
ghix | ghidmx | dasher | application/dash+xml video/vnd.3gpp.mpd audio/vnd.3gpp.mpd video/vnd.mpeg.dash.mpd audio/vnd.mpeg.dash.mpd audio/mpegurl video/mpegurl application/vnd.ms-sstr+xml application/x-gpac-ghi application/x-gpac-ghix   
ghi | n/a | dasher | application/dash+xml video/vnd.3gpp.mpd audio/vnd.3gpp.mpd video/vnd.mpeg.dash.mpd audio/vnd.mpeg.dash.mpd audio/mpegurl video/mpegurl application/vnd.ms-sstr+xml application/x-gpac-ghi application/x-gpac-ghix   
gsf | gsfdmx | gsfmx | application/x-gpac-sf   
iamf | rfav1 | n/a | audio/iamf   
`ignore | `n/a | writeuf | n/a   

# Protocol Schemes  
  
_NOTE: This table does not include meta filters (ffmpeg, ...), use `gpac -hx protocols` to list them._  
  
 Scheme | Input Filter(s) | Output Filter(s)  
 --- | --- | ---    
file | fin | fout  
isobmf | fin |  n/a  
gmem | fin httpin |  n/a  
gfio | fin | fout  
http | httpin | httpout  
https | httpin | httpout  
dict | httpin |  n/a  
ftp | httpin |  n/a  
ftps | httpin |  n/a  
gopher | httpin |  n/a  
gophers | httpin |  n/a  
imap | httpin |  n/a  
imaps | httpin |  n/a  
ldap | httpin |  n/a  
ldaps | httpin |  n/a  
mqtt | httpin |  n/a  
pop3 | httpin |  n/a  
pop3s | httpin |  n/a  
rtmp | httpin |  n/a  
rtmpe | httpin |  n/a  
rtmps | httpin |  n/a  
rtmpt | httpin |  n/a  
rtmpte | httpin |  n/a  
rtmpts | httpin |  n/a  
rtsp | httpin rtpin | rtspout  
scp | httpin |  n/a  
sftp | httpin |  n/a  
smb | httpin |  n/a  
smbs | httpin |  n/a  
smtp | httpin |  n/a  
smtps | httpin |  n/a  
telnet | httpin |  n/a  
tftp | httpin |  n/a  
tcp | sockin | sockout  
udp | sockin | sockout  
tcpu | sockin | sockout  
udpu | sockin | sockout  
dvb | dvbin |  n/a  
rtp | rtpin | rtpout  
rtspu | rtpin |  n/a  
rtsph | rtpin | rtspout  
satip | rtpin |  n/a  
rtsps | rtpin | rtspout  
pipe | pin | pout  
atsc | routein | routeout  
route | routein | routeout  
mabr | routein | routeout  
video | ffavin |  n/a  
audio | ffavin |  n/a  
av | ffavin |  n/a  
