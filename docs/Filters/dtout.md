<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# DekTec SDI output  
  
Register name used to load filter: __dtout__  
This filter may be automatically loaded during graph resolution.  
  
This filter provides SDI output to be used with _DTA 2174_ or _DTA 2154_ cards.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="bus">__bus__</a> (sint, default: _-1_): PCI bus number. If not set, device discovery is used  
</div>  
<div markdown class="option">  
<a id="slot">__slot__</a> (sint, default: _-1_): PCI bus number. If not set, device discovery is used  
</div>  
<div markdown class="option">  
<a id="fps">__fps__</a> (frac, default: _30/1_): default FPS to use if input stream fps cannot be detected  
</div>  
<div markdown class="option">  
<a id="clip">__clip__</a> (bool, default: _false_): clip YUV data to valid SDI range, slower  
</div>  
<div markdown class="option">  
<a id="port">__port__</a> (uint, default: _1_): set sdi output port of card  
</div>  
<div markdown class="option">  
<a id="start" data-level="basic">__start__</a> (dbl, default: _0.0_): set playback start offset, [-1, 0] means percent of media dur, e.g. -1 == dur  
</div>  
  
