# Overview {:data-level="all"}

We discuss here how to use encryption in a filter chain in GPAC.  

We assume that you are familiar with encrypting ISOBMFF files with MP4Box. If not, please read the [Encryption](Encryption-Introduction) wiki first. 

MP4Box encryption is a direct wrapper around a filter chain using the source ISOBMFF file as input and the destination (new file or temp file) ISOBMFF as output. MP4Box is limited to ISOBMFF input, but this process can also be applied to any filter chain.

# Encryption filter 
## Loading the filter

The encryption filter in GPAC is described [here](cecrypt). It takes a single parameter locating the [DRM config file](Common-Encryption) used by the filter. This filter must be explicitly loaded in your graph, it is ignored during the graph link resolution.

 ```
 gpac -i source.mp4 cecrypt:cfile=drm.xml -o dest.mp4
 ```

This is strictly equivalent to:
```
MP4Box -crypt drm.xml source.mp4 -out dest.mp4
```

__Discussion__
As discussed [here](realtime#foreword) ( and [here](encoding) ), you need to specify a link directive to make sure that the input PIDs of your destination are indeed the output of the encryption filter.



## Changing destination format

With your filter chain in place, you can now modify the output to the desired format.

The following example performs CENC encryption and dashing in a single pass:

```
gpac -i source.mp4 cecrypt:cfile=drm.xml -o dest.mpd:profile=live

```

The following example performs ISMA encryption and RTP streaming in a single pass:

```
gpac -i source.mp4 cecrypt:cfile=isma.xml -o session.sdp

```

## Changing source format

You can also change your source format.
The following example performs encryption and live dashing from a live MPEG-2 TS source over udp:

```
gpac -i udp://localhost:1234 cecrypt:cfile=drm.xml -o dest.mpd:profile=live:dmode=dynamic

```

You will however need to setup the track IDs in your DRM config file to the right value, or to 0 to use a single DRM config for each PID.

If you do not know the stream IDs of your source mux and want to use different configurations for each PID, you will need to specify several encryption filters. In the following example, we apply different encryption to audio and video, using DRM config files with no assigned track IDs.

```
gpac -i udp://localhost:1234/:FID=in cecrypt:cfile=drm_audio.xml:SID=in#audio:FID=ae cecrypt:cfile=drm_video.xml:SID=in#video:FID=ve -o dest.mpd:profile=live:dmode=dynamic:SID=ae,ve
```

Another possibility is to define the `CryptInfo` PID property rather than using a global DRM config file. Combining this with conditional PID property assignment you get:
```
gpac -i udp://localhost:1234/:#CrypTrack=(audio)drm_audio.xml,(video)drm_video.xml cecrypt -o dest.mpd:profile=live:dmode=dynamic
```

This example assigns:

- a `CryptInfo` property to `drm_audio.xml` for PIDs of type audio
- a `CryptInfo` property to `drm_video.xml` for PIDs of type video
- no `CryptInfo` property for other PIDs

