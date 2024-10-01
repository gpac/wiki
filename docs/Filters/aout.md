<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Audio output  
  
Register name used to load filter: __aout__  
This filter may be automatically loaded during graph resolution.  
  
This filter writes a single PCM (uncompressed) audio input PID to a sound card or other audio output device.  
  
The longer the audio buffering [bdur](#bdur) is, the longer the audio latency will be (pause/resume). The quality of fast forward audio playback will also be degraded when using large audio buffers.  
  
If [clock](#clock) is set, the filter will report system time (in us) and corresponding packet CTS for other filters to use for AV sync.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="drv" data-level="basic">__drv__</a> (cstr): audio driver name  
</div>  
<div markdown class="option">  
<a id="bnum" data-level="basic">__bnum__</a> (uint, default: _2_): number of audio buffers (0 for auto)  
</div>  
<div markdown class="option">  
<a id="bdur" data-level="basic">__bdur__</a> (uint, default: _100_): total duration of all buffers in ms (0 for auto)  
</div>  
<div markdown class="option">  
<a id="threaded">__threaded__</a> (bool, default: _true_): force dedicated thread creation if sound card driver is not threaded  
</div>  
<div markdown class="option">  
<a id="dur">__dur__</a> (frac, default: _0_): only play the specified duration  
</div>  
<div markdown class="option">  
<a id="clock">__clock__</a> (bool, default: _true_): hint audio clock for this stream  
</div>  
<div markdown class="option">  
<a id="speed" data-level="basic">__speed__</a> (dbl, default: _1.0_, updatable): set playback speed. If speed is negative and start is 0, start is set to -1  
</div>  
<div markdown class="option">  
<a id="start" data-level="basic">__start__</a> (dbl, default: _0.0_, updatable): set playback start offset. A negative value means percent of media duration with -1 equal to duration  
</div>  
<div markdown class="option">  
<a id="vol" data-level="basic">__vol__</a> (uint, default: _100_, minmax: 0-100, updatable): set default audio volume, as a percentage between 0 and 100  
</div>  
<div markdown class="option">  
<a id="pan" data-level="basic">__pan__</a> (uint, default: _50_, minmax: 0-100, updatable): set stereo pan, as a percentage between 0 and 100, 50 being centered  
</div>  
<div markdown class="option">  
<a id="buffer" data-level="basic">__buffer__</a> (uint, default: _200_): set playout buffer in ms  
</div>  
<div markdown class="option">  
<a id="mbuffer" data-level="basic">__mbuffer__</a> (uint, default: _0_): set max buffer occupancy in ms. If less than buffer, use buffer  
</div>  
<div markdown class="option">  
<a id="rbuffer" data-level="basic">__rbuffer__</a> (uint, default: _0_, updatable): rebuffer trigger in ms. If 0 or more than buffer, disable rebuffering  
</div>  
<div markdown class="option">  
<a id="adelay">__adelay__</a> (frac, default: _0_, updatable): set audio delay in sec  
</div>  
<div markdown class="option">  
<a id="buffer_done">__buffer_done__</a> (bool): buffer done indication (readonly, for user app)  
</div>  
<div markdown class="option">  
<a id="rebuffer">__rebuffer__</a> (luint): system time in us at which last rebuffer started, 0 if not rebuffering (readonly, for user app)  
</div>  
<div markdown class="option">  
<a id="media_offset">__media_offset__</a> (dbl, default: _0_): media offset (substract this value to CTS to get media time - readonly)  
</div>  
  
