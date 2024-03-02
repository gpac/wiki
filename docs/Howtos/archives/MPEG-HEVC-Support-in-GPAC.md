## Playback support

The playback support is powered by the open-source [OpenHEVC decoder](https://github.com/OpenHEVC/openHEVC). 



## Multiplexing HEVC bitstreams into ISOBMF

All profiles should be supported, interlace is not supported yet. The support is based on the study text of HEVC file format.


### HEVC Import


```
MP4Box -add file.hvc -new file.mp4
```

Adds file.hvc (Annex B format) to the given file.

The default import format uses `hvc1` storage.

```
MP4Box -add file.bin:FMT=HEVC -new file.mp4
```

`FMT` is used to indicate the format is HEVC, and can be omitted if the file extension is `hvc`, `hevc` or `265`

```
MP4Box -add file.hvc:fps=50 -new file.mp4
```

`FPS` is by default `25`, and should be specified most of the time as VUI timing is not yet parsed.


### HEVC File inspection

```
MP4Box -info file.mp4MP4Box -info ID file.mp4
```

Gives info on the file or on the track.


### HEVC Export

```
MP4Box –raw <trackId> file.mp4
```

Exports an HEVC file to annex B format.



## HEVC DASH

All DASH operations from GPAC (client and MP4Box) are supported on HEVC, including bitstream switching modes using hev1. For more information on DASH, see [[here|DASH-intro]].


## MPEG-2 TS support

All MPEG-2 TS operations from GPAC (client and MP42TS) are supported on HEVC. MP42TS can be used to generate TS files usable for DASH or for injection in modulation chains; it can also be used to send the TS over an UDP or RTP stream in unicast or multicast mode:

```
./mp42ts -prog=hevc.mp4 -dst-file=test.ts
```

