We were at [MMSys 2016](https://mmsys2016.itec.aau.at/) talking about new nice features in GPAC: support for MPEG-DASH Spatial Relation Description and HEVC motion-constrained tiling!
We had a [quick poster](https://gpac.io/files/2016/05/ACM-MMSys16-Poster-v1.pdf) presenting our two demos

## Tile-based adaptation using independent video encoded in H264

In this demo, a 4K tears of steel is split in 9 tiles, each of them encoded in various bitrates and resolutions. The resulting composition of tiles is played in GPAC with frame-level accuracy to rebuild the complete video. Of course, all of this is 100% DASH compliant and produced with MP4Box. MP4Box has the ability to add any MPD descriptor at period, adaptation set or representation level. For SRD, we use adaptation set descriptors as specified in MPEG DASH; for example:

`MP4Box -dash 1000 [other dash params]  source.mp4:desc_as=<SupplementalProperty schemeIdUri=\"urn:mpeg:dash:srd:2014\" value=\"0,0,1,1,1,2,2\"/>`

indicates that `source.mp4` is placed at X=0, Y=1 with width 1 and height 1 on a tiling grid of size 2x2. This information needs to be manually specified at command line for independent videos, but  is automatically inserted if the source file contains an HEVC tile track (see second demo).

The full content of the demo can be [browsed here](http://download.tsi.telecom-paristech.fr/gpac/SRD/tears_of_steal/), and you can have fun with the [HD version](http://download.tsi.telecom-paristech.fr/gpac/SRD/tears_of_steal/tos_srd_hd.mpd) or the [4K version](http://download.tsi.telecom-paristech.fr/gpac/SRD/tears_of_steal/tos_srd_all.mpd) of the DASH session.

You can use GPAC player with gui to watch the different tiles quality and stats:

[![ToS_Tile_Screenshot](https://gpac.io/files/2016/05/ToS_Tile_Screenshot-300x180.png)](https://gpac.io/files/2016/05/ToS_Tile_Screenshot.png)

## HEVC Motion-constrained Tile-based adaptation

In this demo, we use HEVC tiling tools with constrained motion to allow replacing a tile of an HEVC bitstream with a tile from another HEVC bitstream with same configuration but different quality. In this use case the different HEVC bitstream represent the same content in order to perform bitrate adaptation at the tile level. The nice thing about this is that the reconstructed bitstream is HEVC compliant and requires only a single decoder for the playback!

The full content of the demo can be [browsed here](http://download.tsi.telecom-paristech.fr/gpac/SRD/srd_hevc/multi_rate_p60/), and you can have fun with the [HD version](http://download.tsi.telecom-paristech.fr/gpac/SRD/srd_hevc/multi_rate_p60/hevc_srd.mpd) of the DASH session.

You can use GPAC player with gui to watch the different tiles quality and stats:

[![gpac_dash_hevc_tile](https://gpac.io/files/2016/05/gpac_dash_hevc_tile-300x188.png)](https://gpac.io/files/2016/05/gpac_dash_hevc_tile.png)

A complete tutorial for HEVC and tiling is available [[here|HEVC Tile-based adaptation guide]].

