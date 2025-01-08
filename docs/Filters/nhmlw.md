<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# NHML writer  
  
Register name used to load filter: __nhmlw__  
This filter may be automatically loaded during graph resolution.  
  
This filter converts a single stream to an NHML output file.  
NHML documentation is available at https://wiki.gpac.io/xmlformats/NHML-Format  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="exporter">__exporter__</a> (bool, default: _false_): compatibility with old exporter, displays export results  
</div>  
<div markdown class="option">  
<a id="dims">__dims__</a> (bool, default: _false_): use DIMS mode  
</div>  
<div markdown class="option">  
<a id="name" data-level="basic">__name__</a> (str): set output name of media and info files produced  
</div>  
<div markdown class="option">  
<a id="nhmlonly">__nhmlonly__</a> (bool, default: _false_): only dump NHML info, not media  
</div>  
<div markdown class="option">  
<a id="pckp">__pckp__</a> (bool, default: _false_): full NHML dump  
</div>  
<div markdown class="option">  
<a id="payload">__payload__</a> (bool, default: _false_): dump payload (scte35 only at the moment), should be combined with ǹhmlonly``  
</div>  
<div markdown class="option">  
<a id="chksum">__chksum__</a> (enum, default: _none_): insert frame checksum  

- none: no checksum  
- crc: CRC32 checksum  
- sha1: SHA1 checksum  
</div>  
  
  
