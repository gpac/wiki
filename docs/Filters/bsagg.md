<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Layered bitstream aggregator  
  
Register name used to load filter: __bsagg__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter aggregates layers and sublayers into a single output PID.  
  
The filter supports AVC|H264, HEVC, VVC and AV1 stream reconstruction, and is passthrough for other codec types.  
  
Aggregation is based on temporalID value (start from 1) and layerID value (start from 0).  
For AVC|H264, layerID is the dependency value, or quality value if `svcqid` is set.  
For AV1, inputs must be layers of the same coded sequence with a shared decoder configuration and signaled dependencies (`DependencyID` or `isom:scal` from MP4). OBUs are ordered by spatial ID within each temporal unit; layer IDs and coded frame data are forwarded.  
  
The filter can also be used on AVC and HEVC DolbyVision dual-streams to aggregate base stream and DV RPU/EL.  
  
The filter does not forward aggregator or extractor NAL units.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="svcqid" data-level="basic">__svcqid__</a> (bool, default: _false_): use qualityID instead of dependencyID for SVC splitting  
</div>  
  
