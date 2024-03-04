## Foreword

GPAC has extended support for MPEG-DASH and HLS content generation and playback. 

Basics concepts and terminology of MPEG-DASH are explained [here](DASH-basics) and, and the same terms are usually used in GPAC for both DASH and HLS.

For more information on content generation:

- read MP4Box [DASH options](mp4box-dash-opts)
- read the [dasher](dasher) filter help
- check the dash and HLS scripts in the GPAC [test suite](https://github.com/gpac/testsuite/tree/filters/scripts)

For more information on content playback:

- read the  [dashin](dashin) filter help, used whenever a DASH or HLS session is read.
- check the dash and HLS scripts in the GPAC [test suite](https://github.com/gpac/testsuite/tree/filters/scripts)


## Content Generation
If you generate your content with an third-party application such as ffmpeg, make sure all your video qualities use closed GOP and have the same positions for their IDR frames.
When using GPAC, this is usually ensure by using the `fintra` option.

GPAC can be used to generate both static and live DASH/HLS content. For live cases, GPAC can expose the created files:

- directly through disk
- through its own HTTP server
- by pushing them to a remote HTTP server

We recommend reading the [HTTP server](httpout) filter help, and looking at the [DASH](LL-DASH) and [HLS](LL-HLS) low latency HowTos.


## Content Playback
GPAC comes with a various set of adaptation algorithms:

- BBA0, BOLA, basic throughput (called `conventional` in the literature)
- Custom throughput-based (`gbuf`) and buffer-based (`grate`) algorithms

The algorithm can be replaced by your own algo in [JS](/jsdash) or [Python](python#custom-gpac-callbacks).
 
[Low-Latency DASH](LL-DASH) streaming is supported, and [HLS](LL-HLS) is supported starting from GPAC 2.0. 

As usual in GPAC, accessing a DASH/HLS session is not reserved for playback, it can be used to feed a media pipeline for other tasks such as transcoding, encryption, recording, etc... See [this howto](HAS-advanced) for more information.


