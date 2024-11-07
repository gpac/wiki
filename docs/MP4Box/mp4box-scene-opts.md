<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# MPEG-4 Scene Encoding Options  
  
## General considerations  
MP4Box supports encoding and decoding of of BT, XMT, VRML and (partially) X3D formats int MPEG-4 BIFS, and encoding and decoding of XSR and SVG into MPEG-4 LASeR  
Any media track specified through a `MuxInfo` element will be imported in the resulting MP4 file.  
See https://wiki.gpac.io/Howtos/scenecoding/MPEG-4-BIFS-Textual-Format and related pages.  

## Scene Random Access  
MP4Box can encode BIFS or LASeR streams and insert random access points at a given frequency. This is useful when packaging content for broadcast, where users will not turn in the scene at the same time. In MPEG-4 terminology, this is called the _scene carousel_.## BIFS Chunk Processing  
The BIFS chunk encoding mode allows encoding single BIFS access units from an initial context and a set of commands.  
The generated AUs are raw BIFS (not SL-packetized), in files called FILE-ESID-AUIDX.bifs, with FILE the basename of the input file.  
Commands with a timing of 0 in the input will modify the carousel version only (i.e. output context).  
Commands with a timing different from 0 in the input will generate new AUs.  
    
Options:  
<div markdown class="option">
<a id="mp4" data-level="basic">__-mp4__</a>: specify input file is for BIFS/LASeR encoding  
</div>
<div markdown class="option">
<a id="def" data-level="basic">__-def__</a>: encode DEF names in BIFS  
</div>
<div markdown class="option">
<a id="sync" data-level="basic">__-sync__</a> (int): force BIFS sync sample generation every given time in ms (cannot be used with [-shadow](#shadow) or [-carousel](#carousel) )  
</div>
<div markdown class="option">
<a id="shadow" data-level="basic">__-shadow__</a> (int): force BIFS sync shadow sample generation every given time in ms (cannot be used with [-sync](#sync) or [-carousel](#carousel) )  
</div>
<div markdown class="option">
<a id="carousel" data-level="basic">__-carousel__</a> (int): use BIFS carousel (cannot be used with [-sync](#sync) or [-shadow](#shadow) )  
</div>
<div markdown class="option">
<a id="sclog" data-level="basic">__-sclog__</a>: generate scene codec log file if available  
</div>
<div markdown class="option">
<a id="ms" data-level="basic">__-ms__</a> (string): import tracks from the given file  
</div>
<div markdown class="option">
<a id="ctx-in" data-level="basic">__-ctx-in__</a> (string): specify initial context (MP4/BT/XMT) file for chunk processing. Input file must be a commands-only file  
</div>
<div markdown class="option">
<a id="ctx-out" data-level="basic">__-ctx-out__</a> (string): specify storage of updated context (MP4/BT/XMT) file for chunk processing, optional  
</div>
<div markdown class="option">
<a id="resolution" data-level="basic">__-resolution__</a> (int): resolution factor (-8 to 7, default 0) for LASeR encoding, and all coordinates are multiplied by `2^res` before truncation (LASeR encoding)  
</div>
<div markdown class="option">
<a id="coord-bits" data-level="basic">__-coord-bits__</a> (int): number of bits used for encoding truncated coordinates (0 to 31, default 12) (LASeR encoding)  
</div>
<div markdown class="option">
<a id="scale-bits" data-level="basic">__-scale-bits__</a> (int): extra bits used for encoding truncated scales (0 to 4, default 0) (LASeR encoding)  
</div>
<div markdown class="option">
<a id="auto-quant" data-level="basic">__-auto-quant__</a> (int): resolution is given as if using [-resolution](#resolution) but coord-bits and scale-bits are inferred (LASeR encoding)  
</div>
<div markdown class="option">
<a id="global-quant" data-level="basic">__-global-quant__</a> (int): resolution is given as if using [-resolution](#resolution) but the res is inferred (BIFS encoding)  
</div>

# Live Scene Encoder Options  
  
The options shall be specified as `opt_name=opt_val.`  
Options:  
  
<div markdown class="option">
<a id="live" data-level="basic">__-live__</a>: enable live BIFS/LASeR encoder  
</div>
<div markdown class="option">
<a id="dst" data-level="basic">__-dst__</a> (string): destination IP  
</div>
<div markdown class="option">
<a id="port" data-level="basic">__-port__</a> (int, default: __7000__): destination port  
</div>
<div markdown class="option">
<a id="mtu" data-level="basic">__-mtu__</a> (int, default: __1450__): path MTU for RTP packets  
</div>
<div markdown class="option">
<a id="ifce" data-level="basic">__-ifce__</a> (string): IP address of the physical interface to use  
</div>
<div markdown class="option">
<a id="ttl" data-level="basic">__-ttl__</a> (int, default: __1__): time to live for multicast packets  
</div>
<div markdown class="option">
<a id="sdp" data-level="basic">__-sdp__</a> (string, default: __session.sdp__): output SDP file  
</div>
<div markdown class="option">
<a id="dims" data-level="basic">__-dims__</a>: turn on DIMS mode for SVG input  
</div>
<div markdown class="option">
<a id="no-rap" data-level="basic">__-no-rap__</a>: disable RAP sending and carousel generation  
</div>
<div markdown class="option">
<a id="src" data-level="basic">__-src__</a> (string): source of scene updates  
</div>
<div markdown class="option">
<a id="rap" data-level="basic">__-rap__</a> (int): duration in ms of base carousel; you can specify the RAP period of a single ESID (not in DIMS) using `ESID=X:time`  
</div>
    
Runtime options:  

- q: quits  
- u: inputs some commands to be sent  
- U: same as u but signals the updates as critical  
- e: inputs some commands to be sent without being aggregated  
- E: same as e but signals the updates as critical  
- f: forces RAP sending  
- F: forces RAP regeneration and sending  
- p: dumps current scene  

# SWF Importer Options  
  
MP4Box can import simple Macromedia Flash files (".SWF")  
You can specify a SWF input file with '-bt', '-xmt' and '-mp4' options  
    
Options:  
<div markdown class="option">
<a id="global" data-level="basic">__-global__</a>: all SWF defines are placed in first scene replace rather than when needed  
</div>
<div markdown class="option">
<a id="no-ctrl" data-level="basic">__-no-ctrl__</a>: use a single stream for movie control and dictionary (this will disable ActionScript)  
</div>
<div markdown class="option">
<a id="no-text" data-level="basic">__-no-text__</a>: remove all SWF text  
</div>
<div markdown class="option">
<a id="no-font" data-level="basic">__-no-font__</a>: remove all embedded SWF Fonts (local playback host fonts used)  
</div>
<div markdown class="option">
<a id="no-line" data-level="basic">__-no-line__</a>: remove all lines from SWF shapes  
</div>
<div markdown class="option">
<a id="no-grad" data-level="basic">__-no-grad__</a>: remove all gradients from swf shapes  
</div>
<div markdown class="option">
<a id="quad" data-level="basic">__-quad__</a>: use quadratic bezier curves instead of cubic ones  
</div>
<div markdown class="option">
<a id="xlp" data-level="basic">__-xlp__</a>: support for lines transparency and scalability  
</div>
<div markdown class="option">
<a id="ic2d" data-level="basic">__-ic2d__</a>: use indexed curve 2D hardcoded proto  
</div>
<div markdown class="option">
<a id="same-app" data-level="basic">__-same-app__</a>: appearance nodes are reused  
</div>
<div markdown class="option">
<a id="flatten" data-level="basic">__-flatten__</a> (number): complementary angle below which 2 lines are merged, value `0` means no flattening  
</div>
