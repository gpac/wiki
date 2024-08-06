# Overview {:data-level="all"}

We discuss here how to use ClearKey encryption in GPAC.  

We assume that you are familiar with encrypting ISOBMFF files with MP4Box. If not, please read the [Encryption](Encryption-Introduction) wiki first. 

ClearKey is a simple key distribution system for MPEG-DASH using plain text key exchange over https.
For more info, check https://github.com/Dash-Industry-Forum/ClearKey-Content-Protection

Fetching of keys through ClearKey is supported in GPAC decryptor and does not need to be configured.


# DRM config file {:data-level="beginner"}

ClearKey can be used with any scheme types defined in CENC, and does not need any specific info (e.g. PSSH). 

# Using MP4Box {:data-level="beginner"}

You first need to encrypt your source:

 ```
 MP4Box -crypt drm.xml source.mp4 -out cypted.mp4
 ```

You can then dash your source(s). If all streams share the same ClearKey licence server URL, specify `ckurl` option of dasher:

 ```
 MP4Box -dash 1000 cypted.mp4 -out dash/manifest.mpd:ckurl=https://ck.gpac.io/GetLicence
 ```


If each source has its own licence URL:
 ```
 MP4Box -dash 1000 cypted.mp4:#CKUrl=https://ck.gpac.io/GetLicence cypted2.mp4:#CKUrl=https://ck.gpac.io/GetLicence2  -out dash/manifest.mpd
 ```


# Using gpac for single-pass encrypt and dash 

If all streams share the same ClearKey licence server URL, specify `ckurl` option of dasher:

```
gpac -i src.mp4 cecrypt:cfile=drm.xml -o dash/manifest.mpd::ckurl=https://ck.gpac.io/GetLicence
```

Note that we use double colon separator, as the ClearKey URL also uses colons which will break parameter inheritance. One way to avoid this is to use:
```
gpac -i src.mp4 cecrypt:cfile=drm.xml  -o dash/manifest.mpd --ckurl=https://ck.gpac.io/GetLicence
```


If streams have different ClearKey licence server URL (we assume a single DRM.xml is needed here), specify `CKUrl` pid property on sources:

```
gpac -i src.mp4:#CKUrl=https://ck.gpac.io/GetLicence  -i src2.mp4:#CKUrl=https://ck.gpac.io/GetLicence2  cecrypt:cfile=drm.xml -o dash/manifest.mpd
```


