<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# CENC encryptor  
  
Register name used to load filter: __cecrypt__  
This filter is not checked during graph resolution and needs explicit loading.  
  
The CENC encryptor supports CENC, ISMA and Adobe encryption. It uses a DRM config file for declaring keys.  
The syntax is available at https://wiki.gpac.io/xmlformats/Common-Encryption  
The DRM config file can be set per PID using the property `CryptInfo`, or set at the filter level using [cfile](#cfile).  
When the DRM config file is set per PID, the first `CrypTrack` in the DRM config file with the same ID is used, otherwise the first `CrypTrack` is used (regardless of the `CrypTrack` ID).  
When the DRM config file is set globally (not per PID), the first `CrypTrack` in the DRM config file with the same ID is used, otherwise the first `CrypTrack` with ID 0 or not set is used.  
If no DRM config file is defined for a given PID, this PID will not be encrypted, or an error will be thrown if [allc](#allc) is specified.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="cfile" data-level="basic">__cfile__</a> (str): crypt file location  
</div>  
<div markdown class="option">  
<a id="allc" data-level="basic">__allc__</a> (bool): throw error if no DRM config file is found for a PID  
</div>  
<div markdown class="option">  
<a id="bk_stats" data-level="basic">__bk_stats__</a> (bool): print number of encrypted blocks to stdout upon exit  
</div>  
<div markdown class="option">  
<a id="bk_skip">__bk_skip__</a> (bool): skip encryption but performs all other tasks (test mode)  
</div>  
  
