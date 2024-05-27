<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Probe source  
  
Register name used to load filter: __probe__  
This filter is not checked during graph resolution and needs explicit loading.  
  
The Probe filter is used by applications (typically `MP4Box`) to query demultiplexed PIDs (audio, video, ...) available in a source chain.  
  
The filter outputs the number of input PIDs in the file specified by [log](#log).  
It is up to the app developer to query input PIDs of the prober and take appropriated decisions.  
  

# Options    
  
<a id="log">__log__</a> (str, default: _stdout_, Enum: _any|stderr|stdout|GLOG|null): set probe log filename to print number of streams  
* _any: target file path and name  
* stderr: dump to stderr  
* stdout: dump to stdout  
* GLOG: use GPAC logs `app@info`  
* null: silent mode  
  
  
