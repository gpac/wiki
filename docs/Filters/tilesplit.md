<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# HEVC Tile splitter  
  
Register name used to load filter: __tilesplit__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter splits an HEVC tiled stream into tiled HEVC streams (`hvt1` or `hvt2` in ISOBMFF).  
The filter will move to passthrough mode if the bitstream is not tiled.  
If the `Bitrate` property is set on the input PID, the output tile PIDs will have a bitrate set to `(Bitrate - 10k)/nb_opids`, 10 kbps being reserved for the base.  
  
Each tile PID will be assigned the following properties:  

- `ID`: equal to the base PID ID (same as input) plus the 1-based index of the tile in raster scan order.  
- `TileID`: equal to the 1-based index of the tile in raster scan order.  

  
__Warning: The filter does not check if tiles are independently-coded (MCTS) !__  
  
__Warning: Support for dynamic changes of tiling grid has not been tested !__  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="tiledrop" data-level="basic">__tiledrop__</a> (uintl, updatable): specify indexes of tiles to drop (0-based, in tile raster scan order)  
</div>  
  
