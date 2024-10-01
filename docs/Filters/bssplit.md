<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Compressed layered bitstream splitter  
  
Register name used to load filter: __bssplit__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter splits input stream by layers and sublayers  
  
The filter supports AVC|H264, HEVC and VVC stream splitting and is pass-through for other codec types.  
  
Splitting is based on temporalID value (start from 1) and layerID value (start from 0).  
For AVC|H264, layerID is the dependency value, or quality value if `svcqid` is set.  
  
Each input stream is filtered according to the `ltid` option as follows:  

- no value set: input stream is split by layerID, i.e. each layer creates an output  
- `all`: input stream is split by layerID and temporalID, i.e. each {layerID,temporalID} creates an output  
- `lID`: input stream is split according to layer `lID` value, and temporalID is ignored  
- `.tID`: input stream is split according to temporal sub-layer `tID` value and layerID is ignored  
- `lID.tID`: input stream is split according to layer `lID` and sub-layer `tID` values  

  
_Note: A tID value of 0 in `ltid` is equivalent to value 1._  
  
Multiple values can be given in `ltid`, in which case each value gives the maximum {layerID,temporalID} values for the current layer.  
A few examples on an input with 2 layers each with 2 temporal sublayers:  

- `ltid=0.2`: this will split the stream in:  

    - one stream with {lID=0,tID=1} and {lID=0,tID=2} NAL units  
    - one stream with all other layers/substreams  

- `ltid=0.1,1.1`: this will split the stream in:  

    - one stream with {lID=0,tID=1} NAL units  
    - one stream with {lID=0,tID=2}, {lID=1,tID=1} NAL units  
    - one stream with the rest {lID=0,tID=2}, {lID=1,tID=2} NAL units  

- `ltid=0.1,0.2`: this will split the stream in:  

    - one stream with {lID=0,tID=1} NAL units  
    - one stream with {lID=0,tID=2} NAL units  
    - one stream with the rest {lID=1,tID=1}, {lID=1,tID=2} NAL units  

  
The filter can also be used on AVC and HEVC DolbyVision streams to split base stream and DV RPU/EL.  
  
The filter does not create aggregator or extractor NAL units.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="ltid" data-level="basic">__ltid__</a> (strl): temporal and layer ID of output streams  
</div>  
<div markdown class="option">  
<a id="svcqid" data-level="basic">__svcqid__</a> (bool, default: _false_): use qualityID instead of dependencyID for SVC splitting  
</div>  
<div markdown class="option">  
<a id="sig_ltid" data-level="basic">__sig_ltid__</a> (bool, default: _false_): signal maximum temporal (`max_temporal_id`) and layer ID (`max_layer_id`) of output streams (mostly used for debug)  
</div>  
  
