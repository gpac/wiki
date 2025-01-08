<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# DASH Options  
  
Also see:  

- the [dasher `gpac -h dasher`](dasher) filter documentation  
- [[DASH wiki|DASH-intro]].  

  
# Specifying input files  
  
Input media files to dash can use the following modifiers  

- `#trackID=N`: only use the track ID N from the source file  
- `#N`: only use the track ID N from the source file (mapped to [-tkid](mp4dmx/#tkid))  
- `#video`: only use the first video track from the source file  
- `#audio`: only use the first audio track from the source file  
- `#Prop=Value`: add PID filtering using the same syntax as SID fragments (cf `gpac -h doc`)  
- :id=NAME: set the representation ID to NAME. Reserved value `NULL` disables representation ID for multiplexed inputs. If not set, a default value is computed and all selected tracks from the source will be in the same output multiplex.  
- :dur=VALUE: process VALUE seconds (fraction) from the media. If VALUE is longer than media duration, last sample duration is extended.  
- :period=NAME: set the representation's period to NAME. Multiple periods may be used. Periods appear in the MPD in the same order as specified with this option  
- :BaseURL=NAME: set the BaseURL. Set multiple times for multiple BaseURLs  


__Warning: This does not modify generated files location (see segment template).__  
  

- :bandwidth=VALUE: set the representation's bandwidth to a given value  
- :pdur=VALUE: sets the duration of the associated period to VALUE seconds (fraction) (alias for period_duration:VALUE). This is only used when no input media is specified (remote period insertion), e.g. `:period=X:xlink=Z:pdur=Y`  
- :ddur=VALUE: override target DASH segment duration to VALUE seconds (fraction) for this input (alias for duration:VALUE)  
- :xlink=VALUE: set the xlink value for the period containing this element. Only the xlink declared on the first rep of a period will be used  
- :asID=VALUE: set the AdaptationSet ID to VALUE (unsigned int)  
- :role=VALUE: set the role of this representation (cf DASH spec). Media with different roles belong to different adaptation sets.  
- :desc_p=VALUE: add a descriptor at the Period level.  
- :desc_as=VALUE: add a descriptor at the AdaptationSet level. Two input files with different values will be in different AdaptationSet elements.  
- :desc_as_c=VALUE: add a descriptor at the AdaptationSet level. Value is ignored while creating AdaptationSet elements.  
- :desc_rep=VALUE: add a descriptor at the Representation level. Value is ignored while creating AdaptationSet elements.  
- :sscale: force movie timescale to match media timescale of the first track in the segment.  
- :trackID=N: same as setting fragment `#trackID=`  
- @f1[:args][@fN:args][@@fK:args]: set a filter chain to insert between the source and the dasher. Each filter in the chain is formatted as a regular filter, see [filter doc `gpac -h doc`](filters_general). If several filters are set:  

    - they will be chained in the given order if separated by a single `@`  
    - a new filter chain will be created if separated by a double `@@`. In this case, no representation ID is assigned to the source.  

Example
```
source.mp4:@c=avc:b=1M@@c=avc:b=500k
```
  
This will load a filter chain with two encoders connected to the source and to the dasher.  
Example
```
source.mp4:@c=avc:b=1M@c=avc:b=500k
```
  
This will load a filter chain with the second encoder connected to the output of the first (!!).  
  
_Note: `@f` must be placed after all other options._  
  
_Note: Descriptors value must be a properly formatted XML element(s), value is not checked. Syntax can use `file@FILENAME` to load content from file._  

# Options  
  
<div markdown class="option">
<a id="dash" data-level="basic">__-dash__</a> (number): create DASH from input files with given segment (subsegment for onDemand profile) duration in ms  
</div>
<div markdown class="option">
<a id="dash-live" data-level="basic">__-dash-live__</a> (number): generate a live DASH session using the given segment duration in ms; using `-dash-live=F` will also write the live context to `F`. MP4Box will run the live session until `q` is pressed or a fatal error occurs  
</div>
<div markdown class="option">
<a id="ddbg-live" data-level="basic">__-ddbg-live__</a> (number): same as [-dash-live](#dash-live) without time regulation for debug purposes  
</div>
<div markdown class="option">
<a id="frag" data-level="basic">__-frag__</a> (number): specify the fragment duration in ms. If not set, this is the DASH duration (one fragment per segment)  
</div>
<div markdown class="option">
<a id="out" data-level="basic">__-out__</a> (string): specify the output MPD file name  
</div>
<div markdown class="option">
<a id="profile" data-level="basic">__-profile__</a>,__-dash-profile__ (string): specify the target DASH profile, and set default options to ensure conformance to the desired profile. Default profile is `full` in static mode, `live` in dynamic mode (old syntax using `:live` instead of `.live` as separator still possible). Defined values are onDemand, live, main, simple, full, hbbtv1.5.live, dashavc264.live, dashavc264.onDemand, dashif.ll  
</div>
<div markdown class="option">
<a id="profile-ext" data-level="basic">__-profile-ext__</a> (string): specify a list of profile extensions, as used by DASH-IF and DVB. The string will be colon-concatenated with the profile used  
</div>
<div markdown class="option">
<a id="rap" data-level="basic">__-rap__</a>: ensure that segments begin with random access points, segment durations might vary depending on the source encoding  
</div>
<div markdown class="option">
<a id="frag-rap" data-level="basic">__-frag-rap__</a>: ensure that all fragments begin with random access points (duration might vary depending on the source encoding)  
</div>
<div markdown class="option">
<a id="segment-name" data-level="basic">__-segment-name__</a> (string): set the segment name for generated segments. If not set (default), segments are concatenated in output file except in `live` profile where `dash_%%s`. Supported replacement strings are:  

- $Number[%%0Nd]$ is replaced by the segment number, possibly prefixed with 0  
- $RepresentationID$ is replaced by representation name  
- $Time$ is replaced by segment start time  
- $Bandwidth$ is replaced by representation bandwidth  
- $Init=NAME$ is replaced by NAME for init segment, ignored otherwise  
- $Index=NAME$ is replaced by NAME for index segments, ignored otherwise  
- $Path=PATH$ is replaced by PATH when creating segments, ignored otherwise  
- $SubNumber[%%0Nd]$ is replaced by the segment subnumber in segment sequences, possibly prefixed with 0  
- $Segment=NAME$ is replaced by NAME for media segments, ignored for init segments  
</div>
  
<div markdown class="option">
<a id="segment-ext" data-level="basic">__-segment-ext__</a> (string, default: __m4s__): set the segment extension, `null` means no extension  
</div>
<div markdown class="option">
<a id="init-segment-ext" data-level="basic">__-init-segment-ext__</a> (string, default: __mp4__): set the segment extension for init, index and bitstream switching segments, `null` means no extension  
  
</div>
<div markdown class="option">
<a id="segment-timeline" data-level="basic">__-segment-timeline__</a>: use `SegmentTimeline` when generating segments  
</div>
<div markdown class="option">
<a id="segment-marker" data-level="basic">__-segment-marker__</a> (string): add a box of given type (4CC) at the end of each DASH segment  
</div>
<div markdown class="option">
<a id="insert-utc" data-level="basic">__-insert-utc__</a>: insert UTC clock at the beginning of each ISOBMF segment  
</div>
<div markdown class="option">
<a id="base-url" data-level="basic">__-base-url__</a> (string): set Base url at MPD level. Can be used several times.    

__Warning: this does not  modify generated files location__  
  
</div>
<div markdown class="option">
<a id="mpd-title" data-level="basic">__-mpd-title__</a> (string): set MPD title  
</div>
<div markdown class="option">
<a id="mpd-source" data-level="basic">__-mpd-source__</a> (string): set MPD source  
</div>
<div markdown class="option">
<a id="mpd-info-url" data-level="basic">__-mpd-info-url__</a> (string): set MPD info url  
</div>
<div markdown class="option">
<a id="cprt">__-cprt__</a> (string): add copyright string to MPD  
</div>
<div markdown class="option">
<a id="dash-ctx" data-level="basic">__-dash-ctx__</a> (string): store/restore DASH timing from indicated file  
</div>
<div markdown class="option">
<a id="dynamic" data-level="basic">__-dynamic__</a>: use dynamic MPD type instead of static  
</div>
<div markdown class="option">
<a id="last-dynamic" data-level="basic">__-last-dynamic__</a>: same as [-dynamic](#dynamic) but close the period (insert lmsg brand if needed and update duration)  
</div>
<div markdown class="option">
<a id="mpd-duration" data-level="basic">__-mpd-duration__</a> (number): set the duration in second of a live session (if `0`, you must use [-mpd-refresh](#mpd-refresh))  
</div>
<div markdown class="option">
<a id="mpd-refresh" data-level="basic">__-mpd-refresh__</a> (number): specify MPD update time in seconds  
</div>
<div markdown class="option">
<a id="time-shift" data-level="basic">__-time-shift__</a> (int): specify MPD time shift buffer depth in seconds, `-1` to keep all files)  
</div>
<div markdown class="option">
<a id="subdur" data-level="basic">__-subdur__</a> (number): specify maximum duration in ms of the input file to be dashed in LIVE or context mode. This does not change the segment duration, but stops dashing once segments produced exceeded the duration. If there is not enough samples to finish a segment, data is looped unless [-no-loop](#no-loop) is used which triggers a period end  
</div>
<div markdown class="option">
<a id="run-for" data-level="basic">__-run-for__</a> (int): run for given ms  the dash-live session then exits  
</div>
<div markdown class="option">
<a id="min-buffer" data-level="basic">__-min-buffer__</a> (int): specify MPD min buffer time in ms  
</div>
<div markdown class="option">
<a id="ast-offset" data-level="basic">__-ast-offset__</a> (int): specify MPD AvailabilityStartTime offset in ms if positive, or availabilityTimeOffset of each representation if negative  
</div>
<div markdown class="option">
<a id="dash-scale" data-level="basic">__-dash-scale__</a> (int): specify that timing for [-dash](#dash),  [-dash-live](#dash-live), [-subdur](#subdur) and [-do_frag](#do_frag) are expressed in given timescale (units per seconds) rather than ms  
</div>
<div markdown class="option">
<a id="mem-frags" data-level="basic">__-mem-frags__</a>: fragmentation happens in memory rather than on disk before flushing to disk  
</div>
<div markdown class="option">
<a id="pssh" data-level="basic">__-pssh__</a> (int): set pssh store mode  

- v: initial movie  
- f: movie fragments  
- m: MPD  
- mv, vm: in initial movie and MPD  
- mf, fm: in movie fragments and MPD  
- n: remove PSSH from MPD, initial movie and movie fragments  
</div>
  
<div markdown class="option">
<a id="sample-groups-traf" data-level="basic">__-sample-groups-traf__</a>: store sample group descriptions in traf (duplicated for each traf). If not set, sample group descriptions are stored in the initial movie  
</div>
<div markdown class="option">
<a id="mvex-after-traks" data-level="basic">__-mvex-after-traks__</a>: store `mvex` box after `trak` boxes within the moov box. If not set, `mvex` is before  
</div>
<div markdown class="option">
<a id="sdtp-traf" data-level="basic">__-sdtp-traf__</a> (int): use `sdtp` box in `traf` (Smooth-like)  

- no: do not use sdtp  
- sdtp: use sdtp box to indicate sample dependencies and do not write info in trun sample flags  
- both: use sdtp box to indicate sample dependencies and also write info in trun sample flags  
  
</div>
  
<div markdown class="option">
<a id="no-cache" data-level="basic">__-no-cache__</a>: disable file cache for dash inputs  
</div>
<div markdown class="option">
<a id="no-loop" data-level="basic">__-no-loop__</a>: disable looping content in live mode and uses period switch instead  
</div>
<div markdown class="option">
<a id="hlsc" data-level="basic">__-hlsc__</a>: insert UTC in variant playlists for live HLS  
</div>
<div markdown class="option">
<a id="bound" data-level="basic">__-bound__</a>: segmentation will always try to split before or at, but never after, the segment boundary  
</div>
<div markdown class="option">
<a id="closest" data-level="basic">__-closest__</a>: segmentation will use the closest frame to the segment boundary (before or after)  
</div>
<div markdown class="option">
<a id="subsegs-per-sidx">__-subsegs-per-sidx__</a>,__-frags-per-sidx__ (int): set the number of subsegments to be written in each SIDX box  

- 0: a single SIDX box is used per segment  
- -1: no SIDX box is used  
</div>
  
<div markdown class="option">
<a id="ssix">__-ssix__</a>:    enable SubsegmentIndexBox describing 2 ranges, first one from moof to end of first I-frame, second one unmapped. This does not work with daisy chaining mode enabled  
</div>
<div markdown class="option">
<a id="url-template">__-url-template__</a>: use SegmentTemplate instead of explicit sources in segments. Ignored if segments are stored in the output file  
</div>
<div markdown class="option">
<a id="url-template-sim">__-url-template-sim__</a>: use SegmentTemplate simulation while converting HLS to MPD  
</div>
<div markdown class="option">
<a id="daisy-chain">__-daisy-chain__</a>: use daisy-chain SIDX instead of hierarchical. Ignored if frags/sidx is 0  
</div>
<div markdown class="option">
<a id="single-segment">__-single-segment__</a>: use a single segment for the whole file (OnDemand profile)  
</div>
<div markdown class="option">
<a id="single-file">__-single-file__</a>: use a single file for the whole file (default)  
</div>
<div markdown class="option">
<a id="bs-switching">__-bs-switching__</a> (string, default: __inband__, values: _inband|merge|multi|no|single_): set bitstream switching mode  

- inband: use inband param set and a single init segment  
- merge: try to merge param sets in a single sample description, fallback to `no`  
- multi: use several sample description, one per quality  
- no: use one init segment per quality  
- pps: use out of band VPS,SPS,DCI, inband for PPS,APS and a single init segment  
- single: to test with single input  
</div>
  
<div markdown class="option">
<a id="moof-sn">__-moof-sn__</a> (int): set sequence number of first moof to given value  
</div>
<div markdown class="option">
<a id="tfdt">__-tfdt__</a> (int): set TFDT of first traf to given value in SCALE units (cf -dash-scale)  
</div>
<div markdown class="option">
<a id="no-frags-default">__-no-frags-default__</a>: disable default fragments flags in trex (required by some dash-if profiles and CMAF/smooth streaming compatibility)  
</div>
<div markdown class="option">
<a id="single-traf">__-single-traf__</a>: use a single track fragment per moof (smooth streaming and derived specs may require this)  
</div>
<div markdown class="option">
<a id="tfdt-traf">__-tfdt-traf__</a>: use a tfdt per track fragment (when -single-traf is used)  
</div>
<div markdown class="option">
<a id="dash-ts-prog">__-dash-ts-prog__</a> (int): program_number to be considered in case of an MPTS input file  
</div>
<div markdown class="option">
<a id="frag-rt">__-frag-rt__</a>: when using fragments in live mode, flush fragments according to their timing  
</div>
<div markdown class="option">
<a id="cp-location">__-cp-location__</a> (string): set ContentProtection element location  

- as: sets ContentProtection in AdaptationSet element  
- rep: sets ContentProtection in Representation element  
- both: sets ContentProtection in both elements  
</div>
  
<div markdown class="option">
<a id="start-date">__-start-date__</a> (string): for live mode, set start date (as xs:date, e.g. YYYY-MM-DDTHH:MM:SSZ). Default is current UTC  

__Warning: Do not use with multiple periods, nor when DASH duration is not a multiple of GOP size__  
  
</div>
<div markdown class="option">
<a id="cues">__-cues__</a> (string): ignore dash duration and segment according to cue times in given XML file (tests/media/dash_cues for examples)  
</div>
<div markdown class="option">
<a id="strict-cues">__-strict-cues__</a>: throw error if something is wrong while parsing cues or applying cue-based segmentation  
</div>
<div markdown class="option">
<a id="merge-last-seg">__-merge-last-seg__</a>: merge last segment if shorter than half the target duration  
</div>
