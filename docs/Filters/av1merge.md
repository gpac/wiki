<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AV1 Tile merger  
  
Register name used to load filter: __av1merge__  
This filter may be automatically loaded during graph resolution.  
  
This filter merges a set of AV1 PIDs into a single AV1 PID.  
The filter creates a rectangular tiling grid with one input per populated cell, without overlaps or subdivision of input tiles.  
Positioning of tiles can be automatic (implicit) or explicit.  
Each input must contain one tile per frame, with matching frame headers, tile boundaries aligned to superblocks and same coding parameters.  
All tiles of a merged frame must have the same `base_q_idx`; mismatches are rejected, not adjusted. The common base quantizer index may change between frames.  
The filter assumes that all input PIDs are synchronized (frames share the same timestamp) and will reassemble frames with the same decode time. If PIDs are of unequal duration, the filter will drop frames as soon as one PID is over.  

## Implicit Positioning  
In implicit positioning, results may vary based on the order of input PIDs declaration. Equal-size inputs retain connection order in raster order.  
In this mode, no input shall have `CropOrigin`. Inputs are grouped by width into columns and by height into common rows, with partial superblock sizes at the final edges.  
The filter tries complete grids starting with the square root of the input count rounded up, then nearby row counts (fewer rows first on ties).  
[rows](#rows) and [cols](#cols) constrain implicit packing. If no complete grid satisfies the dimensions and constraints, merging is refused; use explicit positions to select another valid arrangement.  
Example
```
gpac -i top.obu -i bottom.obu av1merge:cols=1 @ -o merged.mp4
```
  

## Explicit Positioning  
In explicit positioning, the `CropOrigin` property on input PIDs is used to setup the tile grid. If `CropOrigin` is used, it shall be set on all input sources.  
If nonnegative coordinates are used, they specify absolute positioning in pixels of the tiles. Coordinates must align to superblocks and are not rounded.  
Absolute positioning allows gaps: input rectangle boundaries define the rows and columns, including empty cells. Only populated contiguous tile ranges are emitted, using separate frame-header and tile-group OBUs. No filler is encoded.  
While the bitstream syntax can represent omitted tiles, decoders may refuse such streams: libaom and dav1d reject discontinuous tile groups. Successful decoding and gap rendering are not guaranteed.  
If negative coordinates are used, they specify relative column and row indices: `-1x0` places an input to the right of `0x0`, and `0x-1` places it below.  
Both axes must be zero or negative in relative positioning; mixing relative and absolute positions is not supported. Relative grids must be complete with contiguous indices; pixel offsets are computed from the column widths and row heights.  
Rows, columns and input order are derived from these positions. [rows](#rows) and [cols](#cols), when set, must match the layout; they do not rearrange explicitly positioned inputs.  
Widths must match within each column and heights within each row; columns and rows may have different sizes. Only the final column and row may have non-superblock-aligned sizes. Frame dimensions must match the input PID dimensions; superresolution is not supported.  
Render widths must also match within columns and render heights within rows. Empty columns or rows use their coded size; custom render scaling on the corresponding axis is rejected when an empty axis size cannot be inferred.  
The minimum horizontal and vertical positions become the output origin. Inputs are ordered left-right, top-down; `TileID` is not used for placement.  

- Gaps are supported only with absolute positioning.  
- Overlaps and input tiles spanning multiple grid cells are not supported.  

Example
```
gpac -i top.mp4:#CropOrigin=0x0 -i bottom.mp4:#CropOrigin=0x384 av1merge @ -o merged.mp4  
gpac -i bs_0x0.mp4:#CropOrigin=0x0 -i bs_640x0.mp4:#CropOrigin=1280x0 av1merge @ -o merge.mp4  
gpac -i top.obu:#CropOrigin=0x0 -i bottom.obu:#CropOrigin=0x-1 av1merge @ -o merged.mp4
```
  
   

## Spatial Relationship Description (SRD)  
  
The filter will create an `SRDMap` property in the output PID if every input has `SRD` and `SRDRef` or an absolute `CropOrigin`.  
The `SRDMap` allows forwarding the logical sources `SRD` in the merged PID. Relative indices and implicit positions alone do not describe source locations.  
The output PID `SRDRef` is set to the output video size. Any input `SRD` or `SRDMap` is removed.  
The input `SRDRef` and `SRD` can be manually assigned to inputs.  

- `SRDRef` gives the width and height of the referential used for the input `SRD`.  
- `SRD` gives the position and size of the input in the original video, expressed in the input `SRDRef` referential.  

The inputs do not need to have matching `SRDRef`. SRD source coordinates must be nonnegative, SRD sizes and SRDRef dimensions must be positive, and scaled coordinates must fit unsigned 32-bit fields.  
  
Each merged input is described by 8 integers in the output `SRDMap`: `{Ox,Oy,Ow,Oh,Dx,Dy,Dw,Dh}`.  

- `Ox,Oy,Ow,Oh`: the source `SRD` rescaled to the output `SRDRef` referential (i.e. _where was the input ?_).  
- `Dx,Dy,Dw,Dh`: the position and size of the input in the reconstructed output (i.e. _where are the input pixels in the output ?_).  

_Note: merged inputs are always listed in `SRDMap` in their tile order in the output bitstream; empty cells have no entry._  
  
Alternatively to using `SRD` and `SRDRef`, it is possible to specify absolute `CropOrigin` on the inputs, in which case:  

- `CropOrigin` gives the location in the source.  
- The input dimensions give the size in the source, and no rescaling of referential is done.  

  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="rows" data-level="basic">__rows__</a> (uint, default: _0_): required number of rows, constraining explicit or implicit positioning (0: automatic)  
</div>  
