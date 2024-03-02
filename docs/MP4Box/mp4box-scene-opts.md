<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# MPEG-4 Scene Encoding Options  
  
## General considerations  
MP4Box supports encoding and decoding of of BT, XMT, VRML and (partially) X3D formats int MPEG-4 BIFS, and encoding and decoding of XSR and SVG into MPEG-4 LASeR  
Any media track specified through a `MuxInfo` element will be imported in the resulting MP4 file.  
See https://wiki.gpac.io/MPEG-4-BIFS-Textual-Format and related pages.  

## Scene Random Access  
MP4Box can encode BIFS or LASeR streams and insert random access points at a given frequency. This is useful when packaging content for broadcast, where users will not turn in the scene at the same time. In MPEG-4 terminology, this is called the _scene carousel_.## BIFS Chunk Processing  
The BIFS chunk encoding mode allows encoding single BIFS access units from an initial context and a set of commands.  
The generated AUs are raw BIFS (not SL-packetized), in files called FILE-ESID-AUIDX.bifs, with FILE the basename of the input file.  
Commands with a timing of 0 in the input will modify the carousel version only (i.e. output context).  
Commands with a timing different from 0 in the input will generate new AUs.  
    
Options:  
<a id="mp4">__-mp4__</a>:      specify input file is for BIFS/LASeR encoding  
<a id="def">__-def__</a>:      encode DEF names in BIFS  
<a id="sync">__-sync__</a> (int): force BIFS sync sample generation every given time in ms (cannot be used with [-shadow](#shadow) or [-carousel](#carousel) )  
<a id="shadow">__-shadow__</a> (int): force BIFS sync shadow sample generation every given time in ms (cannot be used with [-sync](#sync) or [-carousel](#carousel) )  
<a id="carousel">__-carousel__</a> (int): use BIFS carousel (cannot be used with [-sync](#sync) or [-shadow](#shadow) )  
<a id="sclog">__-sclog__</a>:  generate scene codec log file if available  
<a id="ms">__-ms__</a> (string): import tracks from the given file  
<a id="ctx-in">__-ctx-in__</a> (string): specify initial context (MP4/BT/XMT) file for chunk processing. Input file must be a commands-only file  
<a id="ctx-out">__-ctx-out__</a> (string): specify storage of updated context (MP4/BT/XMT) file for chunk processing, optional  
<a id="resolution">__-resolution__</a> (int): resolution factor (-8 to 7, default 0) for LASeR encoding, and all coordinates are multiplied by `2^res` before truncation (LASeR encoding)  
<a id="coord-bits">__-coord-bits__</a> (int): number of bits used for encoding truncated coordinates (0 to 31, default 12) (LASeR encoding)  
<a id="scale-bits">__-scale-bits__</a> (int): extra bits used for encoding truncated scales (0 to 4, default 0) (LASeR encoding)  
<a id="auto-quant">__-auto-quant__</a> (int): resolution is given as if using [-resolution](#resolution) but coord-bits and scale-bits are inferred (LASeR encoding)  
<a id="global-quant">__-global-quant__</a> (int): resolution is given as if using [-resolution](#resolution) but the res is inferred (BIFS encoding)  

# Live Scene Encoder Options  
  
The options shall be specified as `opt_name=opt_val.`  
Options:  
  
<a id="live">__-live__</a>:    enable live BIFS/LASeR encoder  
<a id="dst">__-dst__</a> (string): destination IP  
<a id="port">__-port__</a> (int, default: __7000__): destination port  
<a id="mtu">__-mtu__</a> (int, default: __1450__): path MTU for RTP packets  
<a id="ifce">__-ifce__</a> (string): IP address of the physical interface to use  
<a id="ttl">__-ttl__</a> (int, default: __1__): time to live for multicast packets  
<a id="sdp">__-sdp__</a> (string, default: __session.sdp__): output SDP file  
<a id="dims">__-dims__</a>:    turn on DIMS mode for SVG input  
<a id="no-rap">__-no-rap__</a>: disable RAP sending and carousel generation  
<a id="src">__-src__</a> (string): source of scene updates  
<a id="rap">__-rap__</a> (int): duration in ms of base carousel; you can specify the RAP period of a single ESID (not in DIMS) using `ESID=X:time`  
    
Runtime options:  
* q: quits  
* u: inputs some commands to be sent  
* U: same as u but signals the updates as critical  
* e: inputs some commands to be sent without being aggregated  
* E: same as e but signals the updates as critical  
* f: forces RAP sending  
* F: forces RAP regeneration and sending  
* p: dumps current scene  

# SWF Importer Options  
  
MP4Box can import simple Macromedia Flash files (".SWF")  
You can specify a SWF input file with '-bt', '-xmt' and '-mp4' options  
    
Options:  
<a id="global">__-global__</a>: all SWF defines are placed in first scene replace rather than when needed  
<a id="no-ctrl">__-no-ctrl__</a>: use a single stream for movie control and dictionary (this will disable ActionScript)  
<a id="no-text">__-no-text__</a>: remove all SWF text  
<a id="no-font">__-no-font__</a>: remove all embedded SWF Fonts (local playback host fonts used)  
<a id="no-line">__-no-line__</a>: remove all lines from SWF shapes  
<a id="no-grad">__-no-grad__</a>: remove all gradients from swf shapes  
<a id="quad">__-quad__</a>:    use quadratic bezier curves instead of cubic ones  
<a id="xlp">__-xlp__</a>:      support for lines transparency and scalability  
<a id="ic2d">__-ic2d__</a>:    use indexed curve 2D hardcoded proto  
<a id="same-app">__-same-app__</a>: appearance nodes are reused  
<a id="flatten">__-flatten__</a> (number): complementary angle below which 2 lines are merged, value `0` means no flattening  
