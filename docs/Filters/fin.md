<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# File input  {:data-level="all"}  
  
Register name used to load filter: __fin__  
This filter may be automatically loaded during graph resolution.  
  
This filter dispatch raw blocks from input file into a filter chain.  
Block size can be adjusted using [block_size](#block_size).  
Content format can be forced through [mime](#mime) and file extension can be changed through [ext](#ext).  
_Note: Unless disabled at session level (see [-no-probe](core_options/#no-probe) ), file extensions are usually ignored and format probing is done on the first data block._  
The special file name `null` is used for creating a file with no data, needed by some filters such as [dasher](dasher).  
The special file name `rand` is used to generate random data.  
The special file name `randsc` is used to generate random data with `0x000001` start-code prefix.  
  
The filter handles both files and GF_FileIO objects as input URL.  
  
## Packet Injecting  
The filter can be used to inject a single packet instead of a file using (-pck)[] option.  
No specific properties are attached, except a timescale if (-ptime)[] is set.  
Example
```
gpac fin:pck=str@"My Sample Text":ptime=2500/100:#CodecID=stxt:#StreamType=text
```  
This will declare the PID as WebVTT and send a single packet with payload `My Sample Text` and a timestamp value of 25 second.  
  

# Options    
  
<a id="src">__src__</a> (cstr): location of source file  
<a id="block_size">__block_size__</a> (uint, default: _0_): block size used to read file. 0 means 5000 if file less than 500m, 1M otherwise  
<a id="range">__range__</a> (lfrac, default: _0-0_): byte range  
<a id="ext">__ext__</a> (cstr): override file extension  
<a id="mime">__mime__</a> (cstr): set file mime type  
<a id="pck">__pck__</a> (mem): data to use instead of file  
<a id="ptime">__ptime__</a> (frac, default: _0/0_): timing for data packet, ignored if den is 0  
  
