<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFMPEG AV Capture  
  
Register name used to load filter: __ffavin__  
This filter may be automatically loaded during graph resolution.  
  
Reads from audio/video capture devices using FFMPEG.  
See FFMPEG documentation (https://ffmpeg.org/documentation.html) for more details.  
To list all supported grabbers for your GPAC build, use `gpac -h ffavin:*`.  
  
# Device identification  
  
Typical classes are `dshow` on windows, `avfoundation` on OSX, `video4linux2` or `x11grab` on linux  
  
Typical device name can be the webcam name:  
- `FaceTime HD Camera` on OSX, device name on windows, `/dev/video0` on linux  
- `screen-capture-recorder`, see http://screencapturer.sf.net/ on windows  
- `Capture screen 0` on OSX (0=first screen), or `screenN` for short  
- X display name (e.g. `:0.0`) on linux  
  
The general mapping from ffmpeg command line is:  
- ffmpeg `-f` maps to [fmt](#fmt) option  
- ffmpeg `-i` maps to [dev](#dev) option  
  
Example
```
ffmpeg -f libndi_newtek -i MY_NDI_TEST ...  
gpac -i av://:fmt=libndi_newtek:dev=MY_NDI_TEST ...
```  
  
You may need to escape the [dev](#dev) option if the format uses ':' as separator, as is the case for AVFoundation:  
Example
```
gpac -i av://::dev=0:1 ...
```  
  

# Options    
  
<a id="src">__src__</a> (str): url of device, `video://`, `audio://` or `av://`  
<a id="fmt">__fmt__</a> (str): name of device class. If not set, defaults to first device class  
<a id="dev">__dev__</a> (str, default: _0_): name of device or index of device  
<a id="copy">__copy__</a> (enum, default: _A_): set copy mode of raw frames  
* N: frames are only forwarded (shared memory, no copy)  
* A: audio frames are copied, video frames are forwarded  
* V: video frames are copied, audio frames are forwarded  
* AV: all frames are copied  
  
<a id="sclock">__sclock__</a> (bool, default: _false_): use system clock (us) instead of device timestamp (for buggy devices)  
<a id="probes">__probes__</a> (uint, default: _10_, minmax: 0-100): probe a given number of video frames before emitting (this usually helps with bad timing of the first frames)  
<a id="*">__*__</a> (str):     any possible options defined for AVInputFormat and AVFormatContext (see `gpac -hx ffavin` and `gpac -hx ffavin:*`)  
  
