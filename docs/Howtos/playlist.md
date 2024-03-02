# Overview

We discuss here how to use the [flist](flist) filter to deal with playlists in GPAC.  

The filter is designed to concatenate media streams coming from a sequence of sources into a continuous timeline.
It can operate in file list mode or as a processor for playlists files with extension `txt` or `m3u`.

In both modes, when switching sources, the filter will match streams (PIDs) based on their stream type values. If no PID exists, a new output PID is created. If the new source has less PIDs than the previous source, the extra PIDs are kept but marked as being in end of stream state.

The filter will move to the next item once all PIDs are done playing. It will then adjust the timeline of the following source by repositioning the new source smallest initial timestamp to the greatest time (timestamp+duration) of the last source. 


# File list mode
 
```
gpac flist:srcs=file.mp4:floop=-1 vout
```
The above command will play  `file.mp4`, looping it forever. The source may have any number of streams

```
gpac flist:srcs=f1.mp4,f2.mp4 vout
```
The above command will play  `f1.mp4` then `f2.mp4`. 

```
gpac flist:srcs=images/*.png:fdur=1/25 vout
```
The above command will play all files with extension `png` in directory `images`, each image lasting for 40 milliseconds.

```
gpac flist:srcs=images/*.png:fdur=1:fsort=date -o slide.mp4
```
The above command will gather all files with extension `png` in directory `images` ordered by their file creation date, each image lasting for 1 second, and output as a PNG track in MP4 format.

# Playlist mode

## General usage
The playlist mode allows you to build complex source sequences. Think of it as piping the output of several sequential `gpac` executions into a consuming `gpac` instance.

 
```
##begin pl.m3u
s1.mp4
s2.mp4
s3.mp4
s4.mp4
##end playlist

gpac -i pl.m3u -o dash/live.mpd
```

The above command will play sources in sequence and feed them to the [dasher](dasher) for DASH/HLS generation.

Each source specified is a regular GPAC source, and can be a local file, a remote http(s) resource, a broadcast session, a DASH session, a source generator filter, another `flist` instance, etc ...

If the sources are ISOBMFF fragments, concatenation will be done automatically at the input side (in terms of internal filters logic, we issue a source switch event rather than loading a new source).

The syntax is the same as the one used by `gpac`.
```
##begin mixed.m3u
http://somehost/vod.mpd
localfile.mp4
##end playlist
```

Playlist can specify options applying to the source(s) listed in the next line.
- Options are listed on a single line starting with `#`.
- A line starting with `##` is ignored.
- Each line in the playlist not starting with `#` is a source entry for the playlist. 

```
##begin mixed.m3u
#repeat=1
file.aac
file.mp3
##end playlist
```
This will play twice `file.aac` then once `file.mp3`. 


## Multi-sources entries
A source entry may contain more than one source, for example if you want to open in parallel audio, video and subtitles:

```
##begin mixed.m3u
vid.mp4 && audio.mp4 && audio_fr.mp4 && subs.mp4
vid2.mp4 && audio2.mp4 && audio2_fr.mp4 && subs2.mp4
##end playlist
```

In this case, the filter will move to the next item in the playlist only once all PIDs from all sources are done playing.

A source entry may also contain filter directives, just like `gpac` command line. These can be used to apply processing only for the current sources, such as transcoding if you know the source is not in the right format:

```
##begin mixed.m3u
file.aac
file.mp3 @ enc:c=aac:b=64k
file2.aac
##end playlist
```
This will only activate the AAC encoder for the `file.mp3` source. When `file2.aac` is queued for processing, the transcoding chain used for `file.mp3` will be unloaded. 

The following describes a sequence of sources to be used as input to a DASH multi-period session:  
```
##begin mixed.m3u
vid1.mp4:#Period=1

#props=#Period=2
vid2.mp4 && audio2.mp4:#Language=en && audio2_fr.mp4:#Language=fr

vid3.mp4:#Period=1
##end playlist
```
This will result in a DASH MPD with three periods, the first (resp. third) period containing media from `vid1.mp4` (resp. `vid3.mp4`) and the second period containing media from `vid2.mp4`, `audio2.mp4` and `audio2_fr.mp4`.
 
Note that in this example:
- audio sources override their language definitions
- we use the `props` option for the second source entry to signal the DASH period ID of each source globally, rather than copying it for each source. 

__Warning The set of separators is the default one of gpac (cf [-seps](gpac_general#seps) ), and cannot be modified__


The playlist mode can also be used to generate DASH/HLS segmentation cues, instructing the dasher to generate segments matching the boundaries of the source files. This can be useful when your encoder performs some optimized scene cut and generates segments with variable duration.
 
```

##begin playlist.m3u
v1.264 && a1.aac
v2.264 && a2.aac
v3.264 && a3.aac
##end playlist

gpac -i playlist.m3u:sigcues -o dash.mpd
```
The DASH session will in that case only have 3 segments containing v1/a1,  v2/a2 and v3/a3 (obviously, make sure vX and aX have the same duration ...).


## Live playlists
The playlist can be reloaded at run time, waiting for new sources to be pushed. You need to specify the [ka](flist#ka) option to keep the playlist alive, or specify `ka` directive in the playlist. Until an `end` directive is seen, the filter session will be kept alive even when no new source is available.

  
`gpac -i pl.m3u:ka -o dash/live.mpd:dmode=dynamic`

Then after some time generate a new playlist:
```
##begin pl.m3u
s3.mp4
s4.mp4
s5.mp4
s6.mp4
##end playlist
```

The filter will look for its last active source in the new playlist and load the following sources at the end of the current source. If the last active source is not found, the filter will restart from the beginning of the playlist.

Finally use a terminating playlist:
```
##begin pl.m3u
s6.mp4
s7.mp4
s8.mp4
#end
##end playlist
```

You can use a playlist with only a single line containing the next file to play, but you must however ensure that you produce this playlist only once the incoming file is written to disk.

You can also instruct the filter to delete each source once processed, either for the entire playlist using [fdel](flist#fdel), or per source using `del` option:

```
##begin pl.m3u
#del
s1.mp4
#del
s2.mp4
s3.mp4
s4.mp4
##end playlist
```
In this example, only `s1.mp4` and `s2.mp4` will be deleted.


# Splicing playlists

The filter can be used to splice content, i.e. replace part of the content with some other content for a given time. This is typically used for ad insertion cases, but other use cases are possible as well.

**WARNING**
Splicing is a tricky topic, as the source and replacement content will likely have different characteristics such as coding format,  initial synchronization or misaligned duration. See discussion below
 
The filter does **NOT** operate on the media content payload and cannot perform operations such as cross-fade or other. If you wish to do this with GPAC, you will need to write your own filter (see [2D](evg) and [3D](webgl) examples).



## Static playlists

In this example, we will replace the content from `main` source in the range [4, 10] with the content from `ad1` . We need to indicate:
- an `out` cue: the point in the `main` timeline when the content replacement must begin
- an `in` cue: the point in the `main` timeline when the content replacement must end and the main content must resume.


```
##begin pl.m3u
#out=4 in=10
main
ad1
##end playlist
```


The filter is designed to split content at SAP (random access) boundaries, automatically resuming the main content on the next SAP at or after the `in` point. The replacement content is then removed, and the main content timeline restored without any re-alignment.

The replacement content can use playlist directives as usual. A typical usage is when the final splice duration is not known precisely and you want a fallback (here `filler`) for the rest of the splicing period:

```
##begin pl.m3u
#out=4 in=10
main
ad1
#repeat=-1
filler
##end playlist
```

In this example, if `ad1` is 6s, `filler` is 1s but the actual splice period is [4, 12.5], the `filler` will be played in loop for 2.5s. 

Once the splicing source (`main`) is over, the playlists continues after the last loaded URL.

## Advanced splicing


You can use the splicer to mark splicing periods boundaries but not replace the content, using the `mark` directive. In that case, the splice period does not consume any source entry.

A good use case is remote ad insertion in DASH, where the main content is always described in the manifest but ad periods also provide an XLINK to replacement content:

  
```
##begin pl.m3u
#out=4 in=10 mark sprops=#xlink=http://foo.bar/ad.mpd
main:#Period=Main
##end playlist

gpac -i pl.m3u -o dash/live.mpd
```

This will generate 3 DASH periods, the second period having an `xlink:href="http://foo.bar/ad.mpd"` set, but still describing the main content. 

The `sprops` directive gives a set of PID properties to apply to the output PIDs from the `main` content during the splicing period only. These PID properties are restored to their original state (i.e. input PID props + `props` directive if any) at the end of the splice period.


You can also use the splicer to add content to the main content during the splicing period, rather than replacing it, using the `keep` directive. The `sprops` directive can also be used in this mode.

For example, if one period of your DASH session offers more streams than the others:


```
##begin pl.m3u
#out=4 in=10 keep props=#Period=Main
main:#Language=us-US
ad:#Language=fr-FR:#Period=Ins
##end playlist

gpac -i pl.m3u -o dash/live.mpd
```

This will generate 3 DASH periods, the second period (`Ins`) having an additional content (one or more adaptation sets) with language `fr-FR`.

## Dynamic playlists

When doing splicing, the playlist is always dynamic and can be reloaded at any time. Once a splicing period is over for the main content, a new splicing period can be configured by modifying the playlist, overwriting the `in` and `out` values. 
 

```
##begin pl.m3u
#out= in=
main
ad
##end playlist

gpac -i pl.m3u -o dash/live.mpd
```

This will play `main`, waiting for the playlist to be modified.

Then edit the playlist as follows:
```
##update pl.m3u
#out=now in=+10
main
ad
##end playlist
```

This will resolve the splice start time to be the next SAP found on video stream, and the splice end time to be 10s after the splice start. You can use for `out` and `in`:
- a time in seconds. This time is expressed in the `main` media timeline
- a date in XSD dateTime format
- `now`, as explained previously
- an empty value to indicate the media is to be spliced but the start or end time of the splice is still unknown

You can also use for `in` a delta from the `out` value, expressed in seconds (as in the previous example).

_Note: The value `now` is equivalent to the empty value (i.e. undefined) for the first playlist load._


Once the end of the splice is reached, the next URL to load for a splice is reset to the next URL after the main content.

To load a new ad, simply update the playlist before the next target splice start:

```
##update pl.m3u
#out=now in=+15
main
ad2
##end playlist
```


# Timeline re-alignment during concatenation / splicing

When concatenating media streams (whether at the end of a previous media or at a splice point), the encoding characteristics of the source usually result in audio and video streams of different duration at the insertion point.

When concatenating, the filter will use the highest frame time on all streams, and realign the next timeline starting from that point. For example:
- video @25fps, duration 10.0s
- AAC 44100Hz, duration 10.03102s

The next source timeline origin will be the last audio time (10.03102s), which will result in:
- the next audio frame starting exactly after the last audio
- the next video frame starting at 31.02 ms after the last video frame, introducing a gap in video

The same logic applies when the audio is shorter than the video, in that case introducing a gap in the audio.

This logic is always applied by default, regardless of the new source to concatenate. This means that even if the next source has the proper time offset between audio and video streams, its timeline is still reset and a gap is introduced.
You can prevent this by assigning the directive `nosync` to the new source:

```
##start playlist
src1.mp4
#nosync
src2.mp4
##end playlist
```

In this example, the resulting timeline will have no gap, but may have synchronization slightly off for media of `src2`.

The timeline of the first media loaded in the playlist (whether splicing or not) is not realigned. 


When splicing, the same logic applies and the `nosync` directive can also be used for media to be inserted in the splice period.

Note however that the `nosync` cannot be specified for main content resume, so there could still be gaps in the timeline if encoding characteristics differ (different codecs, different frame rates or sample rates).
