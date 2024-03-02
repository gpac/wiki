<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Compressed layered bitstream aggregator  
  
Register name used to load filter: __bsagg__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter aggregates layers and sublayers into a single output PID.  
  
The filter supports AVC|H264, HEVC and VVC stream reconstruction, and is passthrough for other codec types.  
  
Aggregation is based on temporalID value (start from 1) and layerID value (start from 0).  
For AVC|H264, layerID is the dependency value, or quality value if `svcqid` is set.  
  
The filter can also be used on AVC and HEVC DolbyVision dual-streams to aggregate base stream and DV RPU/EL.  
  
The filter does not forward aggregator or extractor NAL units.  
  

# Options    
  
<a id="svcqid">__svcqid__</a> (bool, default: _false_): use qualityID instead of dependencyID for SVC splitting  
  
