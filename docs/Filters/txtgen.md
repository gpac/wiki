<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Text Generator  
  
Register name used to load filter: __txtgen__  
This is a JavaScript filter. It is not checked during graph resolution and needs explicit loading.  
Author: GPAC Team  
  
This filter generates text streams based on the provided [src](#src) file. By default, the filter uses a lorem ipsum text file  
The [type](#type) parameter sets the text generation mode. If set to 'txt', the filter will generate text based on the source file  
If set to 'utc', the filter will generate text based on the current UTC time. If set to 'ntp', the filter will generate text based on the current NTP time  
When the [unit](#unit) is set to 'w', the filter will generate text based on words. When set to 'l', the filter will generate text based on lines  
The [fdur](#fdur) parameter sets the frame duration of the text stream. Total duration of the text stream is set by the [dur](#dur) parameter. If set to 0/0, the text stream will be infinite  
The [rollup](#rollup) parameter enables roll-up mode up to the specified number of lines. In roll-up mode, the filter will accumulate text until the specified number of lines is reached.  
When the number of lines is reached, the filter will remove the first line and continue accumulating text  
You would use [rollup](#rollup) in combination with [unit](#unit) set to 'l' to create a roll-up subtitle effect. Or set [unit](#unit) to 'w' to create a roll-up text effect.  
The [lmax](#lmax) parameter sets the maximum number of characters in a line. If the line in the source file is longer than this, the excess text will be wrapped. 0 means no limit  
When [rt](#rt) is set to true, the filter will generate text in real-time. If set to false, the filter will generate text as fast as possible  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (str, default: _/usr/share/gpac/scripts/jsf/txtgen/lipsum.txt_): source of text. If not set, the filter will use lorem ipsum text  
</div>  
<div markdown class="option">  
<a id="type" data-level="basic">__type__</a> (enum, default: _txt_): type of text to generate  

- txt: plain text (uses src option)  
- utc: UTC time  
- ntp: NTP time  
</div>  
  
<div markdown class="option">  
<a id="unit" data-level="basic">__unit__</a> (enum, default: _l_): minimum unit of text from the source  

- w: word  
- l: line  
</div>  
  
<div markdown class="option">  
<a id="fdur" data-level="basic">__fdur__</a> (frac, default: _1/1_): duration of each frame  
</div>  
<div markdown class="option">  
<a id="lmax" data-level="basic">__lmax__</a> (uint, default: _32_): maximum number of characters in a line. If the line in the source file is longer than this, the excess text will be wrapped. 0 means no limit  
</div>  
<div markdown class="option">  
<a id="dur" data-level="basic">__dur__</a> (frac, default: _0/0_): duration of the text stream  
</div>  
<div markdown class="option">  
<a id="rollup" data-level="basic">__rollup__</a> (uint, default: _0_): enable roll-up mode up to the specified number of lines  
</div>  
<div markdown class="option">  
<a id="lock" data-level="basic">__lock__</a> (bool, default: _false_): lock timing to text generation  
</div>  
<div markdown class="option">  
<a id="rt" data-level="basic">__rt__</a> (bool, default: _true_): real-time mode  
</div>  
  
