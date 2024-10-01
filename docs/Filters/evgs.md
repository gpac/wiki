<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# EVG video rescaler  
  
Register name used to load filter: __evgs__  
This filter may be automatically loaded during graph resolution.  
Filters of this class can connect to each-other.  
  
This filter rescales raw video data using GPAC's EVG library to the specified size and pixel format.  

## Output size assignment  
If [osize](#osize) is {0,0}, the output dimensions will be set to the input size, and input aspect ratio will be ignored.  
  
If [osize](#osize) is {0,H} (resp. {W,0}), the output width (resp. height) will be set to respect input aspect ratio. If [keepar=nosrc](#keepar=nosrc), input sample aspect ratio is ignored.  

## Aspect Ratio and Sample Aspect Ratio  
When output sample aspect ratio is set, the output dimensions are divided by the output sample aspect ratio.  
Example
```
evgs:osize=288x240:osar=3/2
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

  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="osize" data-level="basic">__osize__</a> (v2di): osize of output video  
</div>  
<div markdown class="option">  
<a id="ofmt" data-level="basic">__ofmt__</a> (pfmt, default: _none_): pixel format for output video. When not set, input format is used  
</div>  
<div markdown class="option">  
<a id="ofr">__ofr__</a> (bool, default: _false_): force output full range  
</div>  
<div markdown class="option">  
<a id="keepar">__keepar__</a> (enum, default: _off_): keep aspect ratio  

- off: ignore aspect ratio  
- full: respect aspect ratio, applying input sample aspect ratio info  
- nosrc: respect aspect ratio but ignore input sample aspect ratio  
</div>  
  
<div markdown class="option">  
<a id="padclr">__padclr__</a> (str, default: _black_): clear color when aspect ration preservation is used  
</div>  
<div markdown class="option">  
<a id="osar">__osar__</a> (frac, default: _0/1_): force output pixel aspect ratio  
</div>  
<div markdown class="option">  
<a id="nbth">__nbth__</a> (sint, default: _-1_): number of threads to use, -1 means all cores  
</div>  
<div markdown class="option">  
<a id="hq">__hq__</a> (bool, default: _false_): use bilinear interpolation instead of closest pixel  
</div>  
  
