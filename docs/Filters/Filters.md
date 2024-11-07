
# Overview {:data-level="all"}

This part of the wiki describes general concepts of the GPAC filter architecture, available starting from GPAC 0.9.0.

The new architecture allows describing media pipelines as a sequence of processing blocks called *filters*. Filters in GPAC can be pretty much anything: file/pipe/network access objects, (de-)multiplexers, de/encoders, media segmenters (for HTTP Adaptive Streaming), RTSP server, playlist manager and of course raw domain effects.

For more information on this rearchitecture, [look here](Rearchitecture).

Historical applications of GPAC (MP4Box, players) typically provide a fixed media pipeline (import or playback) based on a subset of GPAC filters; these pipelines may optionally be extended with custom filters, as [illustrated for MP4Box](mp4box-filters).

These applications cannot however create other media pipelines than their built-in ones; a new application, called [gpac](gpac_general), has been added to GPAC to allow building completely custom media pipelines, as described [here](filters_general).
 
In this section of the website, you will find the documentation of all options of libgpac, the gpac application and all filters currently built-in. As of 0.9.0, this documentation is automatically generated from the source tree at each new commit.
