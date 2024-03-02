<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Uncompressed Video File Format Generator Utility  
  
Register name used to load filter: __uncvg__  
This is a JavaScript filter, not checked during graph resolution and needs explicit loading.  
Author: GPAC team - (c) Telecom ParisTech 2023 - license LGPL v2  
  
This filter provides generation of test images for ISO/IEC 23001-17  
Generated pixels can be:  
- a pattern of colors in columns, or in rectangles if [sq](#sq) is set, using the specified palette.  
- an image source if [img](#img) is used.  
  
Colors specified in the palette can be default GPAC colors (see gpac -h colors), 0xRRGGBB or 0xAARRGGBB  
  
When generating video, the pixels are shifted to the left at every frame  
  
Components are described as N[bpc][+k] with  
* N: component type, one of M(mono), Y, U, V, R, G, B, A, d(depth), disp, p(palette), f(filterArray), x (pad)  
* bpc: bits per component value, default is 8. Non-integer values must be one of  
  * sft: floating-point value on 16 bits  
  * flt: floating-point value on 32 bits  
  * dbl: floating-point value on 64 bits  
  * dblx: floating-point value on 128 bits  
  * cps: complex value as two floats on 16 bits each  
  * cpf: complex value as two floats on 32 bits each  
  * cpd: complex value as two floats on 64 bits each  
  * cpx: complex value as two floats on 128 bits each  
* k: force component alignment on k bytes, default is 0 (no alignment)  
  

# Options    
  
<a id="vsize">__vsize__</a> (v2d, default: _128x128_): width and height of output image  
<a id="c">__c__</a> (strl, default: _R8,G8,B8_): image components  
<a id="tiles">__tiles__</a> (v2d, default: _1x1_): number of horizontal and vertical tiles  
<a id="interleave">__interleave__</a> (enum, default: _pix_): interleave type  
* comp: component-based interleaving (planar modes)  
* pix: pixel-based interleaving (packed modes)  
* mix: pixel-based interleaving for UV (semi-planar modes)  
* row: row-based interleaving  
* tile: tile-component interleaving  
* multi: pixel-based interleaving (packed modes) for sub-sampled modes  
  
<a id="sampling">__sampling__</a> (enum, default: _none_): sampling types  
* none: no sub-sampling  
* 422: YUV 4:2:2 sub-sampling  
* 420: YUV 4:2:0 sub-sampling  
* 411: YUV 4:1:1 sub-sampling  
  
<a id="block_size">__block_size__</a> (uint, default: _0_): block size in bytes  
<a id="pad_lsb">__pad_lsb__</a> (bool, default: _false_): padded bits are at LSB in the block  
<a id="ble">__ble__</a> (bool, default: _false_): block is little endian  
<a id="br">__br__</a> (bool, default: _false_): block has reversed components  
<a id="pixel_size">__pixel_size__</a> (uint, default: _0_): size of pixel in bytes  
<a id="row_align">__row_align__</a> (uint, default: _0_): row alignment in bytes  
<a id="tile_align">__tile_align__</a> (uint, default: _0_): tile alignment in bytes  
<a id="cle">__cle__</a> (bool, default: _false_): byte-aligned components are little endian  
<a id="img">__img__</a> (str, default: __): use specified image as input instead of RGB generation  
<a id="asize">__asize__</a> (bool, default: _false_): use input image size  
<a id="pal">__pal__</a> (strl, default: _red,green,blue,white,black,yellow,cyan,grey,orange,violet_): default palette for color generation  
<a id="fa">__fa__</a> (strl, default: _B,G,G,R_): bayer-like filter - only 2x2 on R,G,B components is supported  
<a id="bpm">__bpm__</a> (strl, default: __): set sensor bad pixel map as a list of cN (broken column), rM (broken row) or NxM (single pixel)  
<a id="fps">__fps__</a> (frac, default: _25/1_): frame rate to generate - using 0 will trigger item muxing  
<a id="dur">__dur__</a> (frac, default: _1/1_): duration to generate - using 0 will trigger item muxing  
<a id="cloc">__cloc__</a> (uint, default: _-1_, minmax: -1,6): set chroma location type  
<a id="stereo">__stereo__</a> (bool, default: _false_): dump a stereo image  
<a id="sq">__sq__</a> (flt, default: _0_): generate square patterns instead of columns  
<a id="shade">__shade__</a> (bool, default: _false_): shade pixels from black at bottom to full intensity at top  
<a id="scpt">__scpt__</a> (bool, default: _false_): use single color per tile, first tile using the first color in palette  
  
