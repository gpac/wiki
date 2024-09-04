<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Packet timestamp rewriter  {:data-level="all"}  
  
Register name used to load filter: __restamp__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter rewrites timing (offsets and rate) of packets.  
  
The delays (global or per stream class) can be either positive (stream presented later) or negative (stream presented sooner).  
  
The specified [fps](#fps) can be either 0, positive or negative.  

- if 0 or if the stream is audio, stream rate is not modified.  
- otherwise if negative, stream rate is multiplied by `-fps.num/fps.den`.  
- otherwise if positive and the stream is not video, stream rate is not modified.  
- otherwise (video PID), constant frame rate is assumed and:  

    - if [rawv=no](#rawv=no), video frame rate is changed to the specified rate (speed-up or slow-down).  
    - if [rawv=force](#rawv=force), input video stream is decoded and video frames are dropped/copied to match the new rate.  
    - if [rawv=dyn](#rawv=dyn), input video stream is decoded if not all-intra and video frames are dropped/copied to match the new rate.  

  
_Note: frames are simply copied or dropped with no motion compensation._  
  
When [align](#align) is not 0, if the difference between two consecutive timestamps is greater than the specified threshold, the new timestamp   
is set to the last computed timestamp plus the minimum packet duration for the stream.  
  

# Options    
  
<a id="fps">__fps__</a> (frac, default: _0/1_): target fps  
<a id="delay">__delay__</a> (frac, default: _0/1_, updatable): delay to add to all streams  
<a id="delay_v">__delay_v__</a> (frac, default: _0/1_, updatable): delay to add to video streams  
<a id="delay_a">__delay_a__</a> (frac, default: _0/1_, updatable): delay to add to audio streams  
<a id="delay_t">__delay_t__</a> (frac, default: _0/1_, updatable): delay to add to text streams  
<a id="delay_o">__delay_o__</a> (frac, default: _0/1_, updatable): delay to add to other streams  
<a id="rawv">__rawv__</a> (enum, default: _no_): copy video frames  

- no: no raw frame copy/drop  
- force: force decoding all video streams  
- dyn: decoding video streams if not all intra  
  
<a id="tsinit">__tsinit__</a> (lfrac, default: _-1/1_): initial timestamp to resync to, negative values disables resync  
<a id="align">__align__</a> (uint, default: _0_): timestamp alignment threshold (0 disables alignment) - see filter help  
<a id="reorder">__reorder__</a> (bool, default: _false_): reorder input packets by CTS (resulting PID may fail decoding)  
  
