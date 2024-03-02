GPAC supports packaging and playback of Scalable Video Coding (SVC) and layered-HEVC (L-HEVC).


### Splitting SVC or L-HEVC layers into ISOBMF

Base syntax:

```
MP4Box -add inputfile:svcmode=MODE outputname.mp4
```

The `svcmode` option defines how the SVC or L-HEVC bitstream is imported. **`MODE`** is one of three values:

*   **merged** (default mode): the imported file has only one track containing the AVC base layer and all SVC enhancement layers.  
  
 [![](https://gpac.io/files/2012/11/merged5.png)](https://gpac.io/files/2012/11/merged5.png)

 
*   **splitbase**: the imported file has two track: the first track contains the AVC base layer and the second track contains all the SVC enhancement layers.
  
[![](https://gpac.io/files/2012/11/splitbase3.png)](https://gpac.io/files/2012/11/splitbase3.png)

*   **splitall**: each layer is imported into a separate track. 

[![](https://gpac.io/files/2012/11/splitall2.png)](https://gpac.io/files/2012/11/splitall2.png)

It is also possible to export the SVC tracks in raw format, using one of two base syntaxes:

*   **`MP4Box -raw trackID inputfile`**: all extractors in this track are rewritten; the resulting file will be a compliant decodable AVC/SVC bitstream.
*   **`MP4Box -raw-layer trackID inputfile`**: all extractors are skipped, only NALU data is kept; the resulting file will NOT be a compliant decodable AVC/SVC bitstream.



### MPEG-2 TS Encapsulation

SVC and L-HEVC can be imported in MPEG-2 TS one PID per layer, using ISOBMF files where each SVC or L-HEVC tracks are in different layers.


### RTP streaming and hinting Encapsulation

SVC files can be hinted or streamed over RTP according to the [IETF RFC](http://tools.ietf.org/html/rfc6190) using MP4Box, with one RTP stream PID per layer, using ISOBMF source files where each SVC tracks are in different layers. No specific option is required for the MP4Boxutility.

Support for L-HEVC over RTP is experimental and has not been tested with third-party implementations.

### SVC and L-HEVC Playback

The playback of SVC is done through the OpenSVC decoder, the playback of L-HEVC is done through the OpenHEVC decoder.

All these scalable transport modes are supported for playback in GPAC. Switching between layers is achieved using ctrl+h (for high) and ctrl+l (low). This switching will automatically shut down the associated network streams (stops multicast socket or PID filtering).
