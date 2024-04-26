<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# FFmpeg AVFilter  
  
Register name used to load filter: __ffavf__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter provides libavfilter raw audio and video tools.  
See FFmpeg documentation (https://ffmpeg.org/documentation.html) for more details  
To list all supported avfilters for your GPAC build, use `gpac -h ffavf:*`.  
  
# Declaring a filter  
  
The filter loads a filter or a filter chain description from the [f](#f) option.  
Example
```
ffavf:f=showspectrum
```  
  
Unlike other FFmpeg bindings in GPAC, this filter does not parse other libavfilter options, you must specify them directly in the filter chain, and the [f](#f) option will have to be escaped.  
Example
```
ffavf::f=showspectrum=size=320x320 or ffavf::f=showspectrum=size=320x320::pfmt=rgb  
ffavf::f=anullsrc=channel_layout=5.1:sample_rate=48000
```  
  
For complex filter graphs, it is possible to store options in a file (e.g. `opts.txt`):  
Example
```
:f=anullsrc=channel_layout=5.1:sample_rate=48000
```  
And load arguments from file:  
Example
```
ffavf:opts.txt aout
```  
  
The filter will automatically create `buffer` and `buffersink` AV filters for data exchange between GPAC and libavfilter.  
The builtin options ( [pfmt](#pfmt), [afmt](#afmt) ...) can be used to configure the `buffersink` filter to set the output format of the filter.  
  
# Naming of PIDs  
  
For simple filter graphs with only one input and one output, the input PID is assigned the avfilter name `in` and the output PID is assigned the avfilter name `out`  
  
When a graph has several inputs, input PID names shall be assigned by the user using the `ffid` property, and mapping must be done in the filter.  
Example
```
gpac -i video:#ffid=a -i logo:#ffid=b ffavf::f=[a][b]overlay=main_w-overlay_w-10:main_h-overlay_h-10 vout
```  
In this example:  
- the video source is identified as `a`  
- the logo source is identified as `b`  
- the filter declaration maps `a` to its first input (in this case, main video) and `b` to its second input (in this case the overlay)  
  
When a graph has several outputs, output PIDs will be identified using the `ffid` property set to the output avfilter name.  
Example
```
gpac -i source ffavf::f=split inspect:SID=#ffid=out0 vout#SID=out1
```  
In this example:  
- the splitter produces 2 video streams `out0` and `out1`  
- the inspector only process stream with ffid `out0`  
- the video output only displays stream with ffid `out1`  
  
The name(s) of the final output of the avfilter graph cannot be configured in GPAC. You can however name intermediate output(s) in a complex filter chain as usual.  
  
# Filter graph commands  
  
The filter handles option updates as commands passed to the AV filter graph. The syntax expected in the option name is:  
* com_name=value: sends command `com_name` with value `value` to all filters  
* name#com_name=value: sends command `com_name` with value `value` to filter named `name`  
  

# Options    
  
<a id="f">__f__</a> (str):     filter or filter chain description  
<a id="pfmt">__pfmt__</a> (pfmt, default: _none_): pixel format of output. If not set, let AVFilter decide  
<a id="afmt">__afmt__</a> (afmt, default: _none_): audio format of output. If not set, let AVFilter decide  
<a id="sr">__sr__</a> (uint, default: _0_): sample rate of output. If not set, let AVFilter decide  
<a id="ch">__ch__</a> (uint, default: _0_): number of channels of output. If not set, let AVFilter decide  
<a id="dump">__dump__</a> (bool, default: _false_, updatable): dump graph as log media@info or stderr if not set  
<a id="*">__*__</a> (str):     any possible options defined for AVFilter and sub-classes (see `gpac -hx ffavf` and `gpac -hx ffavf:*`)  
  
