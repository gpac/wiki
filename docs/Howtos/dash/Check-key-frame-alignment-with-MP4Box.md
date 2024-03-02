When packaging encoded content for DASH, a lot of issues come from misalignment of key-frames across the different encoded qualities. This page describes how to check key-frame alignment. 

**A packager like MP4Box doesn't re-encode your content** 

MP4Box does two things for you:

1.  Import: It understands your media to import it to the MP4 container.   
 For example: `MP4Box -add video.h264 -add audio.aac av.mp4`   
 When MP4Box doesn't understand the format, you may want to specify manually this step with [[NHML|NHML Format]].
 
2.  Manipulates: MP4Box manipulates the MP4 container (e.g. edit, fragment, cut, dash, encrypt, etc.).  
 One key feature of the MP4 container is the ability to manipulate content without any knowledge about the content format. Theoretically it means that MP4Box can package some MPEG-DASH content even for a codec it would not know.

**But in any case MP4Box does not re-encode the content.** For that, please use an encoder (such as FFmpeg - see references at the end of the article). It is your responsibility, as the content editor, to feed MP4Box with some appropriate content at the encoder level. If your content is not prepared correctly, MP4Box works on a best-effort basis and may (or may not) do its job. MP4Box may or may not print warnings. But some players (like [dash.js](https://github.com/Dash-Industry-Forum/dash.js) for MPEG-DASH) may [silently fail with the packaged content](https://github.com/gpac/gpac/issues/215). 

###Command-line to get quick summary of key-frames intervals

```
MP4Box -info TRACK_ID source1.mp4 2>&1 | grep GOP
```

You will get the average key-frame interval computed for the track with ID `TRACK_ID`:

```
Average GOP length: 25 samples
```

Having different numbers for the average GOP length on different files mean that your GOP size differ and key-frames won't be aligned across various qualities: you will have to re-encode. However there may be cases where the average GOP length is the same, but slight variations may occur resulting in misalignment when DASHing. 

###Command-line to get complete key-frames list and indexes to check alignment

```
MP4Box -std -diso source1.mp4 2>&1 | grep SyncSampleEntry > 1.txt
```

You'll get:

```xml
<SyncSampleEntry sampleNumber="1"/>
<SyncSampleEntry sampleNumber="121"/>
<SyncSampleEntry sampleNumber="241"/>
<SyncSampleEntry sampleNumber="361"/>
<SyncSampleEntry sampleNumber="481"/>
<SyncSampleEntry sampleNumber="601"/>
<SyncSampleEntry sampleNumber="721"/>
...
```

Then do it with another source file, and compare:

```
MP4Box -std -diso source1.mp4 2>&1 | grep SyncSampleEntry > sync1
MP4Box -std -diso source2.mp4 2>&1 | grep SyncSampleEntry > sync2
diff sync1 sync2
```

**Additional resources for encoding properly** Some tutorials are available at:

*   Using FFmpeg: [http://blog.streamroot.io/encode-multi-bitrate-videos-mpeg-dash-mse-based-media-players/](http://blog.streamroot.io/encode-multi-bitrate-videos-mpeg-dash-mse-based-media-players/)
*   Using x264: [http://www.dash-player.com/blog/2014/11/mpeg-dash-content-generation-using-mp4box-and-x264/](http://www.gpac-licensing.com/2014/11/03/bitmovin-leverage-mp4box-package-contents-bitdash-player/)
*   [many others](https://www.google.fr/?q=dash%20encoding%20mp4box#safe=off&q=dash+encoding+mp4box)
