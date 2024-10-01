<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# HEVC Tile merger  
  
Register name used to load filter: __hevcmerge__  
This filter may be automatically loaded during graph resolution.  
  
This filter merges a set of HEVC PIDs into a single motion-constrained tiled HEVC PID.  
The filter creates a tiling grid with a single row and as many columns as needed.  
If [mrows](#mrows) is set and tiles properly align on the final grid, multiple rows will be declared in the PPS.  
Positioning of tiles can be automatic (implicit) or explicit.  
The filter will check the SPS and PPS configurations of input PID and warn if they are not aligned but will still process them unless [strict](#strict) is set.  
The filter assumes that all input PIDs are synchronized (frames share the same timestamp) and will reassemble frames with the same decode time. If PIDs are of unequal duration, the filter will drop frames as soon as one PID is over.  

## Implicit Positioning  
In implicit positioning, results may vary based on the order of input PIDs declaration.  
In this mode the filter will automatically allocate new columns for tiles with height not a multiple of max CU height.  

## Explicit Positioning  
In explicit positioning, the `CropOrigin` property on input PIDs is used to setup the tile grid. In this case, tiles shall not overlap in the final output.  
If `CropOrigin` is used, it shall be set on all input sources.  
If positive coordinates are used, they specify absolute positioning in pixels of the tiles. The coordinates are automatically adjusted to the next multiple of max CU width and height.  
If negative coordinates are used, they specify relative positioning (e.g. `0x-1` indicates to place the tile below the tile 0x0).  
In this mode, it is the caller responsibility to set coordinates so that all tiles in a column have the same width and only the last row/column uses non-multiple of max CU width/height values. The filter will complain and abort if this is not respected.  

- If an horizontal blank is detected in the layout, an empty column in the tiling grid will be inserted.  
- If a vertical blank is detected in the layout, it is ignored.  

    

## Spatial Relationship Description (SRD)  
  
The filter will create an `SRDMap` property in the output PID if `SRDRef` and `SRD` or `CropOrigin` are set on all input PIDs.  
The `SRDMap` allows forwarding the logical sources `SRD` in the merged PID.  
The output PID `SRDRef` is set to the output video size.  
The input `SRDRef` and `SRD` are usually specified in DASH MPD, but can be manually assigned to inputs.  

- `SRDRef` gives the size of the referential used for the input `SRD` (usually matches the original video size, but not always)  
- `SRD` gives the size and position of the input in the original video, expressed in `SRDRef` referential of the input.  

The inputs do not need to have matching `SRDRef`  
.EX src1:SRD=0x0x640x480:SRDRef=1280x720  
This indicates that `src1` contains a video located at 0,0, with a size of 640x480 pixels in a virtual source of 1280x720 pixels.  
Example
```
src2:SRD=640x0x640x480:SRDRef=1280x720
```
  
This indicates that `src1` contains a video located at 640,0, with a size of 640x480 pixels in a virtual source of 1280x720 pixels.  
   
Each merged input is described by 8 integers in the output `SRDMap`:  

- the source `SRD` is rescaled in the output `SRDRef` to form the first part (4 integers) of the `SRDMap` (i.e. _where was the input ?_)  
- the source location in the reconstructed video forms the second part (4 integers) of the `SRDMap` (i.e. _where are the input pixels in the output ?_)  

   
Assuming the two sources are encoded at 320x240 and merged as src2 above src1, the output will be a 320x480 video with a `SRDMap` of {0,160,160,240,0,0,320,240,0,0,160,240,0,240,320,240}  
_Note: merged inputs are always listed in `SRDMap` in their tile order in the output bitstream._  
  
Alternatively to using `SRD` and `SRDRef`, it is possible to specify `CropOrigin` property on the inputs, in which case:  

- the `CropOrigin` gives the location in the source  
- the input size gives the size in the source, and no rescaling of referential is done  

Example
```
src1:CropOrigin=0x0  src1:CropOrigin=640x0 
```
  
Assuming the two sources are encoded at 320x240 and merged as src1 above src2, the output will be a 320x480 video with a `SRDMap` of `{0,0,320,240,0,0,320,240,640,0,320,240,0,240,320,240}`  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="strict">__strict__</a> (bool, default: _false_): strict comparison of SPS and PPS of input PIDs  
</div>  
<div markdown class="option">  
<a id="mrows">__mrows__</a> (bool, default: _false_): signal multiple rows in tile grid when possible  
</div>  
  
