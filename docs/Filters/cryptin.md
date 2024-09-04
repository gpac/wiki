<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# CryptFile input  {:data-level="all"}  
  
Register name used to load filter: __cryptin__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter dispatch raw blocks from encrypted files with AES 128 CBC in PKCS7 to clear input files  
  
The filter is automatically loaded by the DASH/HLS demultiplexer and should not be explicitly loaded by your application.  
  
The filter accepts URL with scheme `gcryp://URL`, where `URL` is the URL to decrypt.  
  
The filter can process http(s) and local file key URLs (setup through HLS manifest), and expects a full key (16 bytes) as result of resource fetching.  
  

# Options    
  
<a id="src">__src__</a> (cstr): location of source file  
<a id="fullfile">__fullfile__</a> (bool, default: _false_): reassemble full file before decryption  
  
