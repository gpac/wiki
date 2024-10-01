<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Stream unframer  
  
Register name used to load filter: __unframer__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter is used to force reframing of input sources using the same internal framing as GPAC (e.g. ISOBMFF) but with broken framing or signaling.  
Example
```
gpac -i src.mp4 unframer -o dst.mp4
```
  
This will:  

- force input PIDs of unframer to be in serialized form (AnnexB, ADTS, ...)  
- trigger reframers to be instanciated after the `unframer` filter.  

Using the unframer filter avoids doing a dump to disk then re-import or other complex data piping.  
  
No options  
  
