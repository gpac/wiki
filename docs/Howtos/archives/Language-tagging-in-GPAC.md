---
tags:
- profile
- mp4
- mpd
- media
- isomedia
- isobmff
- data
- stream
- xml
- mpeg
- box
- dash
- track
---



MP4 files (and GPAC) have been using a 3-character-code to indicate the language of a track, following the standard [ISO 639-2:1998](http://en.wikipedia.org/wiki/List_of_ISO_639-2_codes). This way of language tagging has since then been superseded and the current practice is to use an IETF standard called [BCP-47](http://tools.ietf.org/html/bcp47) (Best Current Practice) a.k.a. RFC 5646.

This new language tagging approach is a bit more complex. It uses mainly 2, 3 or 4 characters, possibly followed by extensions separated with "-" for instance for regional or script variations of a language. Examples of tags are: "en", "fr-FR" (French French) vs. "fr-CA" (Canadian French), ... see more examples [here](http://tools.ietf.org/html/rfc5646#appendix-A).

BCP-47 tagging is standard in MPEG-DASH for language tagging and has been recently enabled in the ISO Base Media File Format, through a new box called "ExtendedLanguageBox" (code "elng").

In GPAC, it can be used for audio tracks, subtitle tracks or any other track. Here are some examples of MP4Box command lines where BCP-47 tags can be used:

```
MP4Box -lang en-US file.mp4
```

This will set the language of file.mp4 to "English US". The MP4 file will still indicate the old language tagging "eng" but will additionally contain a "elng" box with the code "en-US".

```
MP4Box -info file.mp4
```

This command will display the new language information:

```
Media Info: Language "English (en-US)"
```

Note that it is of course still possible to set the language track by track as follows (here 1 is the track id):

```
MP4Box -lang 1=en-US file.mp4
```

or to set it during the import of a track:

```
MP4Box -add file.avi#audio:lang=fr-FR -new file.mp4
```

It is also possible to generate DASH sequences with these language information, for instance using:

```
MP4Box -dash 1000 -profile onDemand audio.mp4
```

The MPD will look as follows:

```xml
<AdaptationSet lang="en-US">
 <Representation id="1" mimeType="audio/mp4" codecs="mp4a.40.2" audioSamplingRate="44100" startWithSAP="1" bandwidth="18952">
  <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="1"/>
  <BaseURL>lang_elng_dashinit.mp4</BaseURL>
  <SegmentBase indexRangeExact="true" indexRange="793-8036">
   <Initialization range="0-792"/>
  </SegmentBase>
 </Representation>
</AdaptationSet>
```

The DASH clients of GPAC have also been extended to support selection of BCP-47 tagged representations.
