<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# CENC decryptor  
  
Register name used to load filter: __cdcrypt__  
This filter may be automatically loaded during graph resolution.  
  
The CENC decryptor supports decrypting CENC, ISMA, HLS Sample-AES (MPEG2 ts) and Adobe streams.  
  
For HLS, key is retrieved according to the key URI in the manifest.  
Otherwise, the filter uses a configuration file.  
The syntax is available at https://wiki.gpac.io/xmlformats/Common-Encryption  
The DRM config file can be set per PID using the property `DecryptInfo` (highest priority), `CryptInfo` (lower priority) or set at the filter level using [cfile](#cfile) (lowest priority).  
When the file is set per PID, the first `CryptInfo` with the same ID is used, otherwise the first `CryptInfo` is used.When the file is set globally (not per PID), the first `CrypTrack` in the DRM config file with the same ID is used, otherwise the first `CrypTrack` with ID 0 or not set is used.  
  

# Options    
  
<a id="cfile">__cfile__</a> (str): crypt file location  
<a id="decrypt">__decrypt__</a> (enum, default: _full_): decrypt mode (CENC only)  

- full: decrypt everything, throwing error if keys are not found  
- nokey: decrypt everything for which a key is found, skip decryption otherwise  
- skip: decrypt nothing  
- pad0: decrypt nothing and replace all crypted bits with 0  
- pad1: decrypt nothing and replace all crypted bits with 1  
- padsc: decrypt nothing and replace all crypted bytes with start codes  
  
<a id="drop_keys">__drop_keys__</a> (uintl): consider keys with given 1-based indexes as not available (multi-key debug)  
<a id="kids">__kids__</a> (strl): define KIDs. If `keys` is empty, consider keys with given KID (as hex string) as not available (debug)  
<a id="keys">__keys__</a> (strl): define key values for each of the specified KID  
<a id="hls_cenc_patch_iv">__hls_cenc_patch_iv__</a> (bool, default: _false_): ignore IV updates in some broken HLS+CENC streams  
  
