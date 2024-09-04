<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFmpeg video rescaler  {:data-level="all"}  
  
Register name used to load filter: __ffsws__  
This filter may be automatically loaded during graph resolution.  
Filters of this class can connect to each-other.  
  
This filter rescales raw video data using FFmpeg to the specified size and pixel format.  

## Output size assignment  
If [osize](#osize) is {0,0}, the output dimensions will be set to the input size, and input aspect ratio will be ignored.  
  
If [osize](#osize) is {0,H} (resp. {W,0}), the output width (resp. height) will be set to respect input aspect ratio. If [keepar=nosrc](#keepar=nosrc), input sample aspect ratio is ignored.  

## Aspect Ratio and Sample Aspect Ratio  
When output sample aspect ratio is set, the output dimensions are divided by the output sample aspect ratio.  
Example
```
ffsws:osize=288x240:osar=3/2
```  
The output dimensions will be 192x240.  
  
When aspect ratio is not kept ([keepar=off](#keepar=off)):  

- source is resampled to desired dimensions  
- if output aspect ratio is not set, output will use source sample aspect ratio  

  
When aspect ratio is partially kept ([keepar=nosrc](#keepar=nosrc)):  

- resampling is done on the input data without taking input sample aspect ratio into account  
- if output sample aspect ratio is not set ([osar=0/N](#osar=0/N)), source aspect ratio is forwarded to output.  

  
When aspect ratio is fully kept ([keepar=full](#keepar=full)), output aspect ratio is force to 1/1 if not set.  
  
When sample aspect ratio is kept, the filter will:  

- center the rescaled input frame on the output frame  
- fill extra pixels with [padclr](#padclr)  

  
## Algorithms options  

- for bicubic, to tune the shape of the basis function, [p1](#p1) tunes f(1) and [p2](#p2) f´(1)  
- for gauss [p1](#p1) tunes the exponent and thus cutoff frequency  
- for lanczos [p1](#p1) tunes the width of the window function  

  
See FFmpeg documentation (https://ffmpeg.org/documentation.html) for more details  
  

# Options    
  
<a id="osize">__osize__</a> (v2di): osize of output video  
<a id="ofmt">__ofmt__</a> (pfmt, default: _none_, Enum: none|yuv420|yvu420|yuv420_10|yuv422|yuv422_10|yuv444|yuv444_10|uyvy|vyuy|yuyv|yvyu|uyvl|vyul|yuyl|yvyl|nv12|nv21|nv1l|nv2l|yuva|yuvd|yuv444a|yuv444p|v308|yuv444ap|v408|v410|v210|grey|algr|gral|rgb4|rgb5|rgb6|rgba|argb|bgra|abgr|rgb|bgr|xrgb|rgbx|xbgr|bgrx|rgbd|rgbds|uncv): pixel format for output video. When not set, input format is used  
  
<a id="scale">__scale__</a> (enum, default: _bicubic_): scaling mode (see filter help) (fastbilinear|bilinear|bicubic|X|point|area|bicublin|gauss|sinc|lanzcos|spline)  
  
<a id="p1">__p1__</a> (dbl, default: _+I_): scaling algo param1  
<a id="p2">__p2__</a> (dbl, default: _+I_): scaling algo param2  
<a id="ofr">__ofr__</a> (bool, default: _false_): force output full range  
<a id="brightness">__brightness__</a> (bool, default: _0_): 16.16 fixed point brightness correction, 0 means use default  
<a id="contrast">__contrast__</a> (uint, default: _0_): 16.16 fixed point brightness correction, 0 means use default  
<a id="saturation">__saturation__</a> (uint, default: _0_): 16.16 fixed point brightness correction, 0 means use default  
<a id="otable">__otable__</a> (sintl): the yuv2rgb coefficients describing the output yuv space, normally ff_yuv2rgb_coeffs[x], use default if not set  
<a id="itable">__itable__</a> (sintl): the yuv2rgb coefficients describing the input yuv space, normally ff_yuv2rgb_coeffs[x], use default if not set  
<a id="keepar">__keepar__</a> (enum, default: _off_): keep aspect ratio  

- off: ignore aspect ratio  
- full: respect aspect ratio, applying input sample aspect ratio info  
- nosrc: respect aspect ratio but ignore input sample aspect ratio  
  
<a id="padclr">__padclr__</a> (str, default: _black_): clear color when aspect ration preservation is used  
<a id="osar">__osar__</a> (frac, default: _0/1_): force output pixel aspect ratio  
  
