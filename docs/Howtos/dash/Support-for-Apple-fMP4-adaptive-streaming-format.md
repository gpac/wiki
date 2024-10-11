---
tags:
- profile
- mp4
- mpd
- source
- block
- input
- manifest
- media
- sequence
- segment
- stream
- bitstream
- dash
- chunk
- track
---



Apple has announced during WWDC2016 the support for fragmented MP4 files in HLS:

[https://developer.apple.com/videos/play/wwdc2016/504/](https://developer.apple.com/videos/play/wwdc2016/504/)

We have been adding support in GPAC for fmp4 HLS, both at the client side and at MP4Box side.
You can translate a fmp4 m3u8 manifest into a DASH manifest:

For DASH main profile (using segment lists):

```
MP4Box -mpd source.m3u8
```

For DASH live profile (using segment template):

```
MP4Box -use-template  -mpd source.m3u8
```

Here is GPAC playing the demo fmp4 stream for Apple (https://developer.apple.com/streaming/examples/advanced-stream-fmp4.html)

[![GPAC_HLS_FMP4](https://gpac.io/files/2016/06/GPAC_HLS_FMP4-300x188.png)](https://gpac.io/files/2016/06/GPAC_HLS_FMP4.png)

This is early stage work, feedback is of course welcome !
