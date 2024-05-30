<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# NHML writer  
  
Register name used to load filter: __nhmlw__  
This filter may be automatically loaded during graph resolution.  
  
This filter converts a single stream to an NHML output file.  
NHML documentation is available at https://wiki.gpac.io/xmlformats/NHML-Format  
  

# Options    
  
<a id="exporter">__exporter__</a> (bool, default: _false_): compatibility with old exporter, displays export results  
<a id="dims">__dims__</a> (bool, default: _false_): use DIMS mode  
<a id="name">__name__</a> (str): set output name of media and info files produced  
<a id="nhmlonly">__nhmlonly__</a> (bool, default: _false_): only dump NHML info, not media  
<a id="pckp">__pckp__</a> (bool, default: _false_): full NHML dump  
<a id="chksum">__chksum__</a> (enum, default: _none_): insert frame checksum  
* none: no checksum  
* crc: CRC32 checksum  
* sha1: SHA1 checksum  
  
  
