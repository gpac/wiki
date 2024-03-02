<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MPEG-2 TS multiplexer  
  
Register name used to load filter: __m2tsmx__  
This filter may be automatically loaded during graph resolution.  
  
This filter multiplexes one or more input PIDs into a MPEG-2 Transport Stream multiplex.  
  
# PID selection  
  
The MPEG-2 TS multiplexer assigns M2TS PID for media streams using the PID of the PMT plus the stream index.  
For example, the default config creates the first program with a PMT PID 100, the first stream will have a PID of 101.  
Streams are grouped in programs based on input PID property ServiceID if present. If absent, stream will go in the program with service ID as indicated by [sid](#sid) option.  
- [name](#name) option is overridden by input PID property `ServiceName`.  
- [provider](#provider) option is overridden by input PID property `ServiceProvider`.  
- [pcr_offset](#pcr_offset) option is overridden by input PID property `"tsmux:pcr_offset"`  
- [first_pts](#first_pts) option is overridden by input PID property `"tsmux:force_pts"`  
- [temi](#temi) option is overridden by input PID property `"tsmux:temi"`  
  
# Time and External Media Information (TEMI)  
  
The [temi](#temi) option allows specifying a list of URLs or timeline IDs to insert in streams of a program.  
One or more TEMI timeline can be specified per PID.  
The syntax is a comma-separated list of one or more TEMI description.  
Each TEMI description is formatted as ID_OR_URL or #OPT1[#OPT2]#ID_OR_URL. Options are:  
* S`N`: indicate the target service with ID `N`  
* T`N`: set timescale to use (default: PID timescale)  
* D`N`: set delay in ms between two TEMI url descriptors (default 1000)  
* O`N`: set offset (max 64 bits) to add to TEMI timecodes (default 0). If timescale is not specified, offset value is in ms, otherwise in timescale units.  
* I`N`: set initial value (max 64 bits) of TEMI timecodes. If not set, initial value will match first packet CTS. If timescale is not specified, value is in PID timescale units, otherwise in specified timescale units.  
* P`N`: indicate target PID in program. Possible values are  
  * `V`: only insert for video streams.  
  * `A`: only insert for audio streams.  
  * `T`: only insert for text streams.  
  * N: only insert for stream with index `N` (0-based) in the program.  
* L`C`: set 64bit timecode signaling. Possible values for `C` are:  
  * `A`: automatic switch between 32 and 64 bit depending on timecode value (default if not specified).  
  * `Y`: use 64 bit signaling only.  
  * `N`: use 32 bit signaling only and wrap around timecode value.  
* N: insert NTP timestamp in TEMI timeline descriptor  
* ID_OR_URL: If number, indicate the TEMI ID to use for external timeline. Otherwise, give the URL to insert  
    
Example
```
temi="url"
```  
Inserts a TEMI URL+timecode in the each stream of each program.  
Example
```
temi="#P0#url,#P1#4"
```  
Inserts a TEMI URL+timecode in the first stream of all programs and an external TEMI with ID 4 in the second stream of all programs.  
Example
```
temi="#P0#2,#P0#url,#P1#4"
```  
Inserts a TEMI with ID 2 and a TEMI URL+timecode in the first stream of all programs, and an external TEMI with ID 4 in the second stream of all programs.  
Example
```
temi="#S20#4,#S10#URL"
```  
Inserts an external TEMI with ID 4 in the each stream of program with ServiceID 20 and a TEMI URL in each stream of program with ServiceID 10.  
Example
```
temi="#N#D500#PV#T30000#4"
```  
Inserts an external TEMI with ID 4 and timescale 30000, NTP injection and carousel of 500 ms in the video stream of all programs.  
  
__Warning: multipliers (k,m,g) are not supported in TEMI options.__  
  
# Adaptive Streaming  
  
In DASH and HLS mode:  
- the PCR is always initialized at 0, and [flush_rap](#flush_rap) is automatically set.  
- unless `nb_pack` is specified, 200 TS packets will be used as pack output in DASH mode.  
- `pes_pack=none` is forced since some demultiplexers have issues with non-aligned ADTS PES.  
  
The filter watches the property `FileNumber` on incoming packets to create new files, or new segments in DASH mode.  
The filter will look for property `M2TSRA` set on the input stream.  
The value can either be a 4CC or a string, indicating the MP2G-2 TS Registration tag for unknown media types.  
  
# Notes  
  
In LATM mux mode, the decoder configuration is inserted at the given [repeat_rate](#repeat_rate) or `CarouselRate` PID property if defined.  
  

# Options    
  
<a id="breq">__breq__</a> (uint, default: _100_): buffer requirements in ms for input PIDs  
<a id="pmt_id">__pmt_id__</a> (uint, default: _100_): define the ID of the first PMT to use in the mux  
<a id="rate">__rate__</a> (uint, default: _0_): target rate in bps of the multiplex. If not set, variable rate is used  
<a id="pmt_rate">__pmt_rate__</a> (uint, default: _200_): interval between PMT in ms  
<a id="pat_rate">__pat_rate__</a> (uint, default: _200_): interval between PAT in ms  
<a id="first_pts">__first_pts__</a> (luint, default: _0_): force PTS value of first packet, in 90kHz  
<a id="pcr_offset">__pcr_offset__</a> (luint, default: _-1_): offset all timestamps from PCR by V, in 90kHz (default value is computed based on input media)  
<a id="mpeg4">__mpeg4__</a> (enum, default: _none_): force usage of MPEG-4 signaling (IOD and SL Config)  
* none: disables 4on2  
* full: sends AUs as SL packets over section for OD, section/pes for scene (cf bifs_pes)  
* scene: sends only scene streams as 4on2 but uses regular PES without SL for audio and video  
  
<a id="pmt_version">__pmt_version__</a> (uint, default: _200_): set version number of the PMT  
<a id="disc">__disc__</a> (bool, default: _false_): set the discontinuity marker for the first packet of each stream  
<a id="repeat_rate">__repeat_rate__</a> (uint, default: _0_): interval in ms between two carousel send for MPEG-4 systems (overridden by `CarouselRate` PID property if defined)  
<a id="repeat_img">__repeat_img__</a> (uint, default: _0_): interval in ms between re-sending (as PES) of single-image streams (if 0, image data is sent once only)  
<a id="max_pcr">__max_pcr__</a> (uint, default: _100_): set max interval in ms between 2 PCR  
<a id="nb_pack">__nb_pack__</a> (uint, default: _4_): pack N TS packets in output packets  
<a id="pes_pack">__pes_pack__</a> (enum, default: _audio_): set AU to PES packing mode  
* audio: will pack only multiple audio AUs in a PES  
* none: make exactly one AU per PES  
* all: will pack multiple AUs per PES for all streams  
  
<a id="realtime">__realtime__</a> (bool, default: _false_): use real-time output  
<a id="bifs_pes">__bifs_pes__</a> (enum, default: _off_): select BIFS streams packetization (PES vs sections)  
* on: uses BIFS PES  
* off: uses BIFS sections  
* copy: uses BIFS PES but removes timestamps in BIFS SL and only carries PES timestamps  
  
<a id="flush_rap">__flush_rap__</a> (bool, default: _false_): force flushing mux program when RAP is found on video, and injects PAT and PMT before the next video PES begin  
<a id="pcr_only">__pcr_only__</a> (bool, default: _false_): enable PCR-only TS packets  
<a id="pcr_init">__pcr_init__</a> (lsint, default: _-1_): set initial PCR value for the programs. A negative value means random value is picked  
<a id="sid">__sid__</a> (uint, default: _0_): set service ID for the program  
<a id="name">__name__</a> (str): set service name for the program  
<a id="provider">__provider__</a> (str): set service provider name for the program  
<a id="sdt_rate">__sdt_rate__</a> (uint, default: _0_): interval in ms between two DVB SDT tables (if 0, SDT is disabled)  
<a id="temi">__temi__</a> (str): insert TEMI time codes in adaptation field  
<a id="log_freq">__log_freq__</a> (uint, default: _500_): delay between logs for realtime mux  
<a id="latm">__latm__</a> (bool, default: _false_): use LATM AAC encapsulation instead of regular ADTS  
<a id="subs_sidx">__subs_sidx__</a> (sint, default: _-1_): number of subsegments per sidx (negative value disables sidx)  
<a id="keepts">__keepts__</a> (bool, default: _false_): keep cts/dts untouched and adjust PCR accordingly, used to keep TS unmodified when dashing  
  
