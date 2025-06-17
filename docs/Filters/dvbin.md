<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# DVB for Linux  
  
Register name used to load filter: __dvbin__  
This filter may be automatically loaded during graph resolution.  
  
This filter reads raw MPEG-2 TS from DVB-T/T2 and DVB-S/S2 cards on linux.  
  
The URL scheme used is `dvb://` with the following syntaxes:  

- `dvb://CHAN`: tunes to channel `CHAN` in the channel configuration file.  
- `dvb://+CHAN`: tunes to multiplex contaning channel `CHAN` and expose all programs.  
- `dvb://=N`: tunes to the `N-th` channel in the channel configuration file.  
- `dvb://@FREQ`: tunes to frequency `FREQ` and exposes all channels in multiplex.  
- `dvb://@=N`: tunes to `N-th` frequency and exposes all channels in multiplex.  
- `dvb://@chlist`: populates the [chans](#chans) option with available channels in the configuration file and do nothing else.  

  
When tuning by channel name `CHAN`, the first entry in the channel configuration file starting with `CHAN` will be used.  
  
The channel configuration file is set through [chcfg](#chcfg). The expected format is VDR as produced by `w_scan`, with a syntax extended for comment lines, starting with `#`.  
Within a comment line, the following keywords can be used to override defaults:  

    - `dev=N`: set the adapter index (`N` integer) or full path (`N` string).  
    - `idx=K`: set the frontend index `K`.  
    - `csidx=S`: set the committed switch index for DiSEqC.  

  
To view the default channels, use `gpac -hx dvbin`.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): URL of source content  
</div>  
<div markdown class="option">  
<a id="block_size">__block_size__</a> (uint, default: _65536_): block size used to read device  
</div>  
<div markdown class="option">  
<a id="chcfg" data-level="basic">__chcfg__</a> (cstr, default: _$GCFG/channels.conf_): path to channels configuration file  
</div>  
<div markdown class="option">  
<a id="dev" data-level="basic">__dev__</a> (str, default: _0_): path to DVB adapter - if first character is a number, this is the device index  
</div>  
<div markdown class="option">  
<a id="idx" data-level="basic">__idx__</a> (uint, default: _0_): frontend index  
</div>  
<div markdown class="option">  
<a id="timeout" data-level="basic">__timeout__</a> (uint, default: _5000_): timeout in ms before tune failure  
</div>  
<div markdown class="option">  
<a id="csleep" data-level="basic">__csleep__</a> (uint, default: _15_): config sleep in ms between DiSEqC commands  
</div>  
<div markdown class="option">  
<a id="csidx" data-level="basic">__csidx__</a> (uint, default: _0_): committed switch index for DiSEqC  
</div>  
<div markdown class="option">  
<a id="chans" data-level="basic">__chans__</a> (strl): list of all channels, only pupulated for dvb://@chlist URL  
</div>  
  
