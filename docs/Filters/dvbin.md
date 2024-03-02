<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# DVB for Linux  
  
Register name used to load filter: __dvbin__  
This filter may be automatically loaded during graph resolution.  
  
Experimental DVB support for linux, requires a channel config file through [chcfg](#chcfg)  
    
The URL syntax is `dvb://CHANNAME[@FRONTEND]`, with:  
 * CHANNAME: the channel name as listed in the channel config file  
 * frontend: the index of the DVB adapter to use (optional, default is 0)  
  

# Options    
  
<a id="src">__src__</a> (cstr): URL of source content  
<a id="block_size">__block_size__</a> (uint, default: _65536_): block size used to read file  
<a id="chcfg">__chcfg__</a> (cstr): path to channels.conf file  
  
