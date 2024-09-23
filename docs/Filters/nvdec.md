<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# NVidia decoder  
  
Register name used to load filter: __nvdec__  
This filter may be automatically loaded during graph resolution.  
  
This filter decodes MPEG-2, MPEG-4 Part 2, AVC|H264 and HEVC streams through NVidia decoder. It allows GPU frame dispatch or direct frame copy.  
If the SDK is not available, the configuration key `nvdec@disabled` will be written in configuration file to avoid future load attempts.  
  
The absolute path to cuda lib can be set using the `cuda_lib` option in `core` or `temp` section of the config file, e.g. `-cfg=temp:cuda_lib=PATH_TO_CUDA`  
The absolute path to cuvid lib can be set using the `cuvid_lib` option in `core` or `temp` section of the config file, e.g. `-cfg=temp:cuvid_lib=PATH_TO_CUDA`  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="num_surfaces">__num_surfaces__</a> (uint, default: _20_): number of hardware surfaces to allocate  
</div>  
<div markdown class="option">  
<a id="unload">__unload__</a> (enum, default: _no_): decoder unload mode  

- no: keep inactive decoder alive  
- destroy: destroy inactive decoder  
- reuse: detach decoder from inactive PIDs and reattach to active ones  
</div>  
  
<div markdown class="option">  
<a id="vmode">__vmode__</a> (enum, default: _cuvid_): video decoder backend  

- cuvid: use dedicated video engines directly  
- cuda: use a CUDA-based decoder if faster than dedicated engines  
- dxva: go through DXVA internally if possible (requires D3D9)  
</div>  
  
<div markdown class="option">  
<a id="fmode" data-level="basic">__fmode__</a> (enum, default: _gl_): frame output mode  

- copy: each frame is copied and dispatched  
- single: frame data is only retrieved when used, single memory space for all frames (not safe if multiple consumers)  
- gl: frame data is mapped to an OpenGL texture  
</div>  
  
  
