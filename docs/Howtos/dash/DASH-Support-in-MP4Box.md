---
tags:
- mpd
- data
- codec
- buffer
- sample
- session
- stream
- xml
- bitstream
- bitrate
- dump
- block
- media
- segment
- group
- box
- rebuffer
- chunk
- track
- option
- profile
- mp4
- source
- chain
- input
- binary
- output
- mpeg
- sink
- dash
---



_MP4Box can be used to generate content compliant to the MPEG-DASH specification, aka ISO/IEC 23009-1 available in [ISO Publicly Available Standards](http://standards.iso.org/ittf/PubliclyAvailableStandards/)._
!!! note
    For more details on what is DASH and HTTP streaming, please refer to [[this post|Fragmentation, segmentation, splitting and interleaving]]. For more help, type [MP4Box -h dash](mp4box-dash-opts)

**`-dash Duration`** : enables DASH segmentation of input files with the given segment duration. For onDemand profile, where each media presentation is a single segment, this option sets the duration of a subsegment.

**`-dash-live[=File] DUR`** generates a live DASH session using dur segment duration, optionally writing live context to F. MP4Box will run the live session until `q` is pressed or a fatal error occurs.

**`-ddbg-live[=File] DUR`** same as -dash-live without time regulation for debug purposes.

**`-frag dur_in_ms`** : specifies the duration of subsegments in ms. This duration is always less than the segment duration. By default (when not set), the subsegment duration is the DASH duration, i.e. there is only one subsegment per segment. For onDemand profile, where each media presentation is a single segment, this option sets the duration of a subsegment.

**`-out filename`** specifies output file name for MPD. May use relative path. All segments will be produced in the same directory as the MPD.

**`-tmp dirname`** specifies a directory for temporary file creation (the default temporary directory is OS-dependent).

**`-profile NAME`** specifies the target DASH profile: `onDemand`, `live`, `main`, `simple`, `full, and two profiles from the DASH-IF: dashavc264:live, dashavc264:onDemand`. This will set default option values to ensure conformance to the desired profile.

**`-rap`** forces segments to begin with random access points. Segment duration may not be exactly what asked by **`-dash`** switch since encoded video data is not modified.

**`-frag-rap`** All fragments will begin with a random access points. Fragment duration may not be exactly what is asked by **`-frag`** since encoded video data is not modified. `(ISOBMF only)`

**`-segment-name name`** sets the segment name for generated segments. If not set (default), the segments are concatenated in output file, except if live profile is requested, in which case the default template `dash_%s` is used. The segment names can furthermore be configured by using a subset of the SegmentTemplate identifiers: `$RepresentationID$, $Number$, $Bandwidth$` and `$Time`. Additional items are defined:

*   `$Init=VALUE$` is replaced by `VALUE` if the generated file is an initialization segment,
*   `$Index=VALUE$` is replaced by `VALUE` if the generated file is an index segment.
*   `$Path=VALUE$` is replaced by `VALUE` when creating the file, but ignored when writing the segment template in MPD.

**`-segment-ext name`** sets the segment extension. Default is m4s, **`null`** means no extension.

**`-segment-timeline`** uses SegmentTimeline when generating segments. NOT SUPPORTED BY LIVE/CTX MODE YET.

**`-segment-marker MARK`** adds a box of type \\'MARK\\' at the end of each DASH segment. MARK shall be a 4CC identifier.

**`-base-url string`**  sets the base url at MPD level. Can be used several times for multiple URLs.

**`-mpd-title string`** sets MPD title.

**`-mpd-source string`** sets MPD source

**`-mpd-info-url string`** sets MPD info url.

**`-cprt string`** adds copyright string to MPD

**`-dash-ctx FILE`** stores and restore DASH timing from FILE (created if not found). This option stores the current timing of the DASHed presentation, and for all segments except the first (initial call), shifts the timing according to this stored value. By calling MP4Box on a regular basis with new segment to append to the MPD, one can generate a live compatible MPD. All options from the regular mode are allowed in this mode, except the options related to the ISO `onDemand` profile.

**`-dynamic`** uses dynamic MPD type instead of static (always set for -dash-live)

**`-mpd-refresh`** specifies MPD update time in seconds

**`-time-shift`** specifies MPD time shift buffer depth in seconds (default 0). Specify -1 to keep all files

**`-subdur DUR`** specifies maximum duration in ms of the input file to be dashed in LIVE or context mode. NOTE: This does not change the segment duration: dashing stops once segments produced exceeded the duration.

**`-min-buffer TIME`** specifies MPD min buffer time in milliseconds.

**`-dash-scale SCALE`** specifies that timing for -dash and -frag are expressed in SCALE units per seconds.

**`-mem-frags`** fragments will be produced in memory rather than on disk before flushing to disk.

**`-pssh-moof`** stores PSSH boxes in first moof of each segments. By default PSSH are stored in movie box.

**`-sample-groups-traf`** stores sample group descriptions in traf (duplicated for each traf) rather than in moof. By default sample group descriptions are stored in movie box.

**`-subsegs-per-sidx N`**  sets the number of subsegments to be written in each SIDX box. If 0, a single SIDX box is used per segment. If -1, no SIDX box is used. Otherwise, the segmenter will pack N subsegments in the root SIDX of the segment, with DashDuration/N/fragDuration fragments per subsegments. ` (ISOBMF only)`

**`-url-template`** uses SegmentTemplate instead of explicit sources in segments. Ignored if segments are stored in a single file. Set by default for live profiles.

**`-daisy-chain`** uses daisy-chaining of SIDX (1->2->3->4) instead of hierarchical. Ignored if **`-subseg-per-sidx`** is 0. ` (ISOBMF only)`

**`-single-segment`** uses a single segment for each representation. Set by default for onDemand profile.

**`-single-file`** uses a single file for each representation.

**`-bs-switching`** **`MODE`** sets the bitstream switching mode to one of the following:

*   **`inband`** (default): generate initialization segments compatible with each representation in the adaptation set by using inband carriage of video parameter sets (avc3, hev1)
*   **`merge`**: generate initialization segments compatible with each representation in the adaptation set by merging video parameter sets in a single configuration, if possible. If not possible, defaults to **`no`**
*   **`multi`**: generate a single init segment with multiple sample description entries for each track ([cf HbbTV specification](http://www.etsi.org/deliver/etsi_ts/102700_102799/102796/01.02.01_60/ts_102796v010201p.pdf "HbbTv Specification")).
*   **`no:`** bitstream switching mode not used. Turned on by default if a single input is dashed
*   **`single`** forces **`inband`** mode when a single input is used.

This option is only used for ISOBMF inputs. The segmenter always assumes that MPEG-2 TS input use bitstream switching.

**`-moof-sn N`** sets sequence number of first moof to N

**`-tfdt N`** sets TFDT of first traf to N in SCALE units (cf -dash-scale)

**`-no-frags-default`** disables default flags in fragments

**`-single-traf`** uses a single track fragment per moof (smooth streaming and derived specs may require this).

**`-dash-ts-prog N`** `program_number` to be considered in case of an MPTS input file..

It is possible to feed MP4Box with a set of ISOBMF files containing different media: MP4Box will generate multiple adaptation sets at once for ISOBMF. The different input files are filtered based on their media type, PAR, language and codec, and gathered in different adaptation sets. Media streams of the same type but with different properties are tagged as belonging to the same group through the `@group` attribute.

The files may be assigned periods, descriptors and other options using the `[:OPT]` suffix. Specific tracks may be loaded as a single representation using fragments.The following fragments and options are defined:

**`#trackID=N`** only uses the track ID N from the source file  
**`#video`** only uses the first video track from the source file  
**`#audio`** only uses the first audio track from the source file  
**`:id=NAME`** sets the representation ID to NAME  
**`:period=NAME`** sets the representation's period to NAME. Multiple periods may be used. Periods appear in the MPD in the same order as specified with this option.  
**`:BaseURL=NAME`** sets the BaseURL. Set multiple times for multiple BaseURLs.  
**`:bandwidth=VALUE`** sets the representation's bandwidth to a given value.  
**`:xlink=VALUE`** sets the xlink value for the period containing this element. Only the xlink declared on the first rep of a period will be used.  
**`:duration=VALUE`** Increases the duration of this period by the given duration in seconds. Only used when no input media is specified (remote period insertion), e.g. when using   :period=X:xlink=Z:duration=Y as an input. If used on a regular input source, this overrides the target segment duration for this representation to VALUE, expressed in dash timescale (cf -dash-scale); this will potentially create non time aligned segments.  
**`:role=VALUE`** sets the role of this representation (cf DASH spec). Media with different roles belong to different adaptation sets.  
**`:desc_p=VALUE`** adds a descriptor at the Period level. Value must be a properly formatted XML element.  
**`:desc_as=VALUE`** adds a descriptor at the AdaptationSet level. Value must be a properly formatted XML element. Two input files with different values will be in different AdaptationSet elements.  
**`:desc_as_c=VALUE`** adds a descriptor at the AdaptationSet level. Value must be a properly formatted XML element. Value is ignored while creating AdaptationSet elements.  
**`:desc_rep=VALUE`** adds a descriptor at the Representation level. Value must be a properly formatted XML element. Value is ignored while creating AdaptationSet elements.  
