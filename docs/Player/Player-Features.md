# Foreword

A true multimedia player is a complex system involving networking, media and user interactions management, rasterizing, etc. The following section is a more or less exhaustive list of supported features in the GPAC player.
Since the GPAC player is mostly a frontend to the filter engine in GPAC, most features from [Filters](Filters) are supported.

With the deprecation of NPAPI and browser plugins in general, GPAC player can no longer be embedded in web browsers. 

# VRML-Based Scene Graphs
- Complete scene graphs for MPEG-4/VRML and X3D, configurable through included scene graph generators.
- All common interactivity types (events and routes, interpolators, conditionals, MPEG-4 valuators and X3D event filters).
- ECMAScript 2020 support through [QuickJS](https://bellard.org/quickjs/) engine.
- Full-feature PROTO and EXTERNPROTO support.
- MPEG-4 InputSensor (KeySensor, Mouse and StringSensor), X3D KeySensor and StringSensor support.
- Loading from binary (TS or MP4), text (bt) and XML (XMT-A)
- SAX Progressive loading of XMT and X3D files (text and gziped).

The status of VRML/BIFS implementation in GPAC can be checked [here](BIFS-Implementation-Status).

The status of X3D implementation in GPAC can be checked [here](X3D-Implementation-Status).

## MPEG-4 Systems specific tools
- ObjectDescriptor decoding.
- ObjectContentInformation and IPMPX decoding (disabled in default builds).
- BIFS Command Decoder with quantization, proto, script and predictive MF Field decoding.
- LASeR Decoder with LASeRScript support.

## Hardcoded EXTERNPROTO nodes

GPAC extends VRML/BIFS node set through its hardcoded proto mechanism. These are protos with predefined URLs and interfaces, allowing BIFS compression without modifying the language syntax. These nodes are identified by a proto URN starting with `urn:inet:gpac:builtin:`.

The following hardcoded protos are available:
- PlanarExtrusion: extrude a 2D shape (except text) along a 2D path
- PathExtrusion: extrude a 2D shape, including text,  along a 2D path
- PlaneClipper: set a 3D plane clipper
- VRGeometry: portion of a sphere, used for 360 video tiling
- VRHud: build a simple head-up display in 360 videos showing various views of the sphere
- OffscreenGroup: draw all children (2D only) into offscreen memory 
- DepthGroup: assign depth to 2D children
- DepthViewPoint: configure depth position and scaling for 2D depth
- IndexedCurve2D: Curve2D reusing sub-paths through indexes 
- Untransform: reset current transformation to identity
- StyleGroup: force all children node to use the appearance given in the StyleGroup


# SVG-based Scene Graph
- SVG 1.2 Tiny scene graph - see [SVG implementation details](SVG-Implementation-Status)
- Complete LASeR scene graph (subset of SVG Tiny 1.2)
- Some SVG 1.1 Full extensions
- XML events and SMIL animation for SVG content
- uDOM (MicroDOM) ECMAScript support through  [QuickJS](https://bellard.org/quickjs/) engine
- SAX Progressive loading of SVG files (text and gzipped)



# Scene Renderer
The media stream composition (renderer) is performed by the [Compositor](compositor) filter interacting with the underlying filter session.

## Media Stream Management
 - Playback for audio, video, texts and scene codecs
 - Synchronization and media management, support for arbitrary number of timelines
 - Time control and segment descriptors (media control, media sensor)
 - Dynamic insertion/update/removal of objects and streams
 - Inline scene support (local or remote) with MediaControl/MediaSensor support

 ## Audio rendering
- Multichannel support
- Integer up/down sampling with mediaSpeed handling in 8, 16, 24, 32 bit or 32 floating point
- Multichannel to stereo mapper
- N-sources, M-channels software mixing
- Per-channel volume support
- Lip-sync management

## 2D Rendering
- Complete and differential rendering
- Full alpha support (including ColorTransform)
- Text drawing in vectorial mode or textured mode
- Texturing, gradients, user interaction (and user interaction on composite textures)
- Hardware accelerated blit if available in output plugin

## 3D Rendering
- Graphics backend: OpenGL and OpenGL-ES
- Alpha-blending (z-sorting), fast texturing when available (support for rectangular textures and non-power-of-2 textures), gradients, X3D RGBA colored meshes
- Frustum culling, ray-based node picking, decent collision detection through AABB tree, gravity
- Navigation in main screen and in 3D layers, viewpoint selection
- Text drawing in vectorial mode or textured mode (supports NICE text under OpenGL!)


# Media Decoders
Decoders included in default builds:
- PNG, JPEG (libJPEG) and JPEG-2000
- MPEG-4 AAC, MPEG-1/2 audio, Dolby AC-3
- MPEG-1/2/4, H264|AVC, SVC, HEVC, L-HEVC
- AMR speech codec using 3GPP fixed-point reference code
- All codecs supported by FFMPEG
- Xiph Media codecs: Vorbis, Theora (FLAC and Opus supported through FFMPEG)
- SRT / 3GPP timed text / MPEG-4 Streaming Text decoder /WebVTT (rendering done through GPAC)

# Networking
Any possible input from GPAC filter architecture is supported by the player. This includes:
- File access from local drive, HTTP download, pipes and sockets.
- MP4, 3GP, MP3/Shoutcast, JPEG, PNG, OGG/Icecast, AMR/EVRC/SMV, SAF, raw YUV and PCM
- AAC files and radio streams (icecast AAC-ADTS)
- Subtitles (SRT/SUB/TeXML/TTXT/WebVTT formats)
- MPEG-2 TS files and IP streams (and  experimental support for DVB for linux)
- MPEG-DASH, HLS and Smooth. This includes:
  - playback from an HTTP(s) server or from local storage for test purposes.
  - media segments based on TS and ISOBMF, with 3GPP timed text support
  - static (on demand) and dynamic (live) sessions
  - multiple period support
  - group selection support
  - independent component download (one adaptation set for audio, one for video)
  - most MPD syntax is supported
  - bitstream switching mode (single init segment) and non-bitstream switching mode
  - manual quality switching by using ctrl+h and ctrl+l
  - basic automatic quality switching when playing HTTP urls
  - tiling, gaze and decoding speed adaptation
 
- SDP input - RTP/RTSP streaming including RTP/UDP streaming, RTP over RTSP and HTTP tunneling of RTP traffic (QuickTime/Darwin Streaming Server). RTP Payload formats supported are:
  - RFC 3016 for MPEG-4 Simple Profile video and simple LATM AAC
  - RFC 3640 for any form of MPEG-4 streams (audio, video, systems)
  - RFC 3267 for AMR audio (narrow-band, octet-align format only)
  - RFC 2250 for MPEG-1/2 audio and video and MPEG-2 TS
  - RFC 2429 for H263 video used by 3GPP (no VRC, no extra Picture Header)
  - RFC 3984 for H264/AVC video (only STAP-A, FU-A and regular NAL units)
  - RFC 7798 for H265|HEVC video (AP, FU and regular NAL units)

 - Generic input using FFMPEG libavformat, supports most AV containers known (MPEG, VOB, AVI, MOV ...) and many protocols
 - Generic frame grabber FFMPEG libavdevice, supports many capture devices
 
# Available plugins
## Audio output
- Microsoft DirectSound (with multichannel support)
- Microsoft WaveOut
- ALSA
- PulseAudio
- Jack
- Linux OSS
- SDL (desktop and iOS)
- Android audio output

## Video output
- Microsoft DirectDraw (supports hardware YUV and RGB stretch)
- SDL (desktop and iOS)
- X11 with OpenGL and shared memory support
- Android OpenGL video output

## Font reading
- FreeType2 for TrueType font outline extraction

## Filters plugin
Filter plugins defined for GPAC can also be used by the player. It is however not yet possible to configure the input filter chain of the player.
