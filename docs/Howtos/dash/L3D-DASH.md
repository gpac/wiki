---
tags:
  - dash
  - ssr
  - latency
  - cmaf
  - chunk
  - manifest
  - segment
  - encoder
  - filter
  - streaming
  - codec
  - buffer
  - broadcast
---

# Foreword

Please make sure you are familiar with [DASH terminology](DASH-basics) and [Low Latency DASH](LL-DASH) before reading.

In this HowTo, we will study various setups for L3D (Low Latency Live Delivery) MPEG-DASH streaming using [gpac](gpac_general). L3D is is the Segment Sequence Representation (SSR) extension defined in Annex G.28 of the DASH specification, which enables low latency, low delay streaming through partial segment delivery.

# L3D DASH Overview

The L3D DASH (Low Latency Live Delivery) approach extends the Low Latency DASH capabilities by implementing Segment Sequence Representation (SSR) as defined in MPEG-DASH Annex G.28. It provides two distinct modes for achieving ultra-low latency:

- **Low Delay Representation (G.28.1)**: Uses IDR frames at each partial segment boundary, requiring a dedicated tune-in adaptation set
- **Low Latency Segment Sequence Representation (G.28.2)**: Uses IDR frames at segment boundaries only, compatible with LL-HLS

Both modes use CMAF chunks (partial segments) to enable fast initial playback and reduced latency. The essential property `urn:mpeg:dash:ssr:2023` is signaled in the manifest to indicate SSR support.

## Encoding Requirements

The `#SSR` property controls manifest signaling and partial segment representation only. **Encoding is the user's responsibility.** You must configure your encoder with appropriate IDR frame periods using the `fintra=<period>` option to match your desired SSR mode:

- **For tune-in representations (G.28.1)**: Set `fintra=<cdur>` to place IDR frames at each partial segment boundary
- **For main representations (G.28.2)**: Set `fintra=<segdur>` to place IDR frames at segment boundaries only

Misaligned encoder IDR configuration will result in improper segmentation and manifest signaling, regardless of the `#SSR` setting.


# SSR Modes

L3D DASH supports two modes through the `#SSR` property containing an AdaptationSet ID:

## LL-HLS Compatibility Mode

```
#SSR=-1
```

This mode creates a segment sequence representation compatible with LL-HLS by generating partial segments (CMAF chunks) as separate files and signaling them through the manifest, similar to using the `llhls=sf` option in dasher. This is useful for cross-platform compatibility with LL-HLS workflows.

## Tune-In Adaptation Set Mode

```
#SSR=x
```

This mode creates a dedicated tune-in adaptation set for the adaptation set with ID `x`. The tune-in representation contains frequent IDR frames (one per partial segment) to enable faster channel changes and initial playback, while the main representation uses standard GOP structure with IDR frames only at segment boundaries.

**Note**  
_When using tune-in mode, it is recommended to explicitly signal the adaptation set ID using `#ASID=x` to ensure proper referencing._

**Note**  
_The user is responsible for encoding content with the appropriate IDR frame period using the `fintra=<period>` option in [ffenc](ffenc#fintra). The `#SSR` property only controls how partial segments are signaled in the manifest, not the encoder GOP structure._

# Basic Examples

## Low Delay Representation

Single bitrate with extra tune-in adaptation set:

```
gpac avgen:lock:v:fps=30:FID=AV \
    c=libx264:fintra=2:#ASID=1:SID=AV:FID=SM \
    c=libx264:fintra=0.1:#SSR=1:#ASID=2:SID=AV:FID=STI \
    -o http://localhost:8080/dash/live.mpd:gpac:profile=dashif.ll:asto=1.7:dmode=dynamic:stl:segdur=2:cdur=0.1:ntp=yes:cmf2:SID=SM,STI:sreg
```

In this example:

- `avgen` generates test audio/video content at 30fps with locked timing
- First encoder (`c=libx264`) creates the main adaptation set (`ASID=1`) with IDR frames every 2 seconds (`fintra=2`)
- Second encoder creates the tune-in adaptation set (`ASID=2`) with frequent IDR frames every 0.1 seconds (`fintra=0.1`)
- `#SSR=1` indicates this is a tune-in representation for adaptation set 1
- `segdur=2` sets segment duration to 2 seconds
- `cdur=0.1` sets CMAF chunk (ISOBMMF fragment) duration to 0.1 seconds
- `asto=1.7` tells the player that data is available 1.7s before the full segment availability (leaving a 3-chunk buffer)
- `stl` enables segment timeline
- `ntp=yes` enables NTP timing
- `cmf2` uses CMAF brand `cmf2`
- `sreg` performs real-time segment regulation

## Low Delay Representation with Audio

Single bitrate with extra tune-in adaptation set and audio adaptation set in LL-HLS compatibility mode:

```
gpac avgen:lock:fps=30:FID=AV \
    c=libx264:fintra=2:#ASID=1:SID=AV:FID=SMV \
    c=libx264:fintra=0.1:#SSR=1:#ASID=2:SID=AV:FID=STV \
    c=aac:#ASID=3:#SSR=-1:SID=AV:FID=SMA \
    -o http://localhost:8080/dash/live.mpd:gpac:profile=dashif.ll:asto=1.7:dmode=dynamic:stl:segdur=2:cdur=0.1:ntp=yes:cmf2:SID=SMV,STV,SMA:sreg
```

This example adds:

- Audio encoding with AAC (`c=aac`)
- Audio adaptation set (`ASID=3`) using LL-HLS compatibility mode (`#SSR=-1`)
- All three adaptation sets (main video, tune-in video, audio) are included via `SID=SMV,STV,SMA`

## Low Latency Segment Sequence Representation

Single bitrate with LL-HLS compatibility mode:

```
gpac avgen:lock:v:fps=30 \
    c=libx264:fintra=0.1:#SSR=-1 \
    -o http://localhost:8080/dash/live.mpd:gpac:profile=dashif.ll:asto=1.7:dmode=dynamic:stl:segdur=2:cdur=0.1:ntp=yes:cmf2:sreg
```

This simplified example:

- Creates a single video adaptation set with frequent IDR frames
- Uses LL-HLS compatibility mode (`#SSR=-1`)
- No separate tune-in adaptation set is needed
- Maintains the same low latency parameters

# Key Parameters Explained

## Encoder Options

- `fintra=X`: Sets IDR frame interval in seconds. Use `fintra=2` for segment-aligned IDRs, `fintra=0.1` for chunk-aligned IDRs
- `#ASID=X`: Explicitly sets the adaptation set ID
- `#SSR=X`: Configures SSR mode (-1 for LL-HLS compatibility, or adaptation set ID for tune-in mode)
- `SID=X`: Source ID for filter routing

## Dasher Options

- `segdur=X`: Segment duration in seconds
- `cdur=X`: CMAF chunk (partial segment) duration in seconds
- `asto=X`: Availability start offset in seconds for low latency client access
- `stl`: Enable segment timeline in the manifest
- `ntp=yes`: Enable NTP timing for synchronization
- `cmf2`: Use CMAF brand `cmf2` for packaging
- `dmode=dynamic`: Generate a live (dynamic) manifest
- `sreg`: Real-time segment regulation
- `profile=dashif.ll`: Use DASH-IF low latency profile

# Playback

The generated L3D DASH content can be played back using:

- The GPAC player: `gpac -play http://localhost:8080/dash/live.mpd`
- [dash.js](https://reference.dashif.org/dash.js/nightly/samples/dash-if-reference-player/index.html) reference player
- [Shaka Player](https://shaka-player-demo.appspot.com/demo/) with appropriate low latency settings

Make sure the player is configured for low latency mode to take advantage of the partial segment delivery.

# Important Notes

## Part Count Consistency

When not using segment timeline (`stl`), if partial segment (chunk) counts are inconsistent across segments, GPAC will warn you. This typically indicates that the input frame rate is not aligned with the configured chunk duration. Using segment timeline allows GPAC to properly signal varying chunk counts per segment.

## IDR Frame Placement

Ensure your encoder configuration matches the SSR mode:

- For G.28.1 tune-in representations: IDR at each partial segment (`fintra=cdur`)
- For G.28.2 or main representations: IDR at each segment (`fintra=segdur`)

Misaligned IDR frames may cause playback issues or prevent proper low latency operation.

## Essential Property Signaling

The essential property `urn:mpeg:dash:ssr:2023` is automatically signaled in the manifest when using the `#SSR` property. This indicates to DASH clients that Segment Sequence Representation is used.

# Advanced Usage

For more advanced L3D DASH configurations, you may want to:

- Combine with encryption using [cecrypt](cecrypt) filter
- Use multiple bitrates for ABR streaming
- Integrate with live sources instead of synthetic test content
- Configure custom buffer models and ABR algorithms

See the [dasher](dasher) filter documentation for complete parameter reference, and check [LL-DASH](LL-DASH) for additional low latency setup details.
