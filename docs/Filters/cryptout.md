<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# CryptFile output  
  
Register name used to load filter: __cryptout__  
This filter is not checked during graph resolution and needs explicit loading.  
  
This filter dispatch raw blocks from clear input files to encrypted files with AES 128 CBC in PKCS7  
  
The filter is automatically loaded by the DASH/HLS multiplexer and should not be explicitly loaded by your application.  
  
The filter accepts URL with scheme `gcryp://URL`, where `URL` is the URL to encrypt.  
  

# Options    
  
<a id="dst">__dst__</a> (cstr): location of source file  
<a id="fullfile">__fullfile__</a> (bool, default: _false_): reassemble full file before decryption  
  
