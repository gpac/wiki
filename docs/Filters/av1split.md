<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# AV1 Tile extractor  
  
Register name used to load filter: __av1split__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter splits a tiled AV1 PID into independent AV1 PIDs, one per tile in row-major order.  
The input must contain independently coded tiles, typically produced by av1merge. Motion prediction, entropy adaptation and loop restoration coding must not depend on other tiles. Ordinary tiled AV1 encodes may not satisfy these constraints.  
Each output has a rewritten decoder configuration and frame headers, CropOrigin and OriginalSize properties. Packet timestamps and properties are preserved.  
CropOrigin and OriginalSize are preserved when split outputs are stored in MP4. av1merge uses CropOrigin to reconstruct their layout.  
Example: gpac -i merged.av1 av1split -o 'tile_$CropOrigin$.obu'  
  
No options  
  
