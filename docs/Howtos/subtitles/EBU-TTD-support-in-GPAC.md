---
tags:
- profile
- mp4
- sample
- ttml
- isomedia
- isobmff
- stream
- xml
- dash
- track
---



EBU released two specifications recently:

*   [TECH 3380](https://tech.ebu.ch/docs/tech/tech3380.pdf) v1.0: EBU-TT-D SUBTITLING DISTRIBUTION FORMAT. This document aims to define a distribution subtitling format base on TTML. This is both a restriction (i.e. a profile) and an extension of TTML. The extensions are very limited. The restrictions allow to mitigate most of the TTML criticisms (especially an ability to express things in several ways, which led to a difficult generic parsing process).
*   [TECH 3381](https://tech.ebu.ch/docs/tech/tech3381.pdf) v0.9: CARRIAGE OF EBU-TT-D IN ISOBMFF. This document explains how to store some EBU-TTD content in ISOBMF. Basically it follows the MPEG-4 part 30 standard.

Useful command-lines for import:

```
MP4Box -add sample.ttml sample.mp4
```

EBU-TTD is recognized automatically:

```
MP4Box -add ebu-ttd_sample.xml:ext=ttml -new tmp.mp4
TTML Import Note: TTML import - EBU-TTD detected
```

To extract the TTML samples from the MP4 (generates one TTML per MP4 sample) (note: replace track 1 from this example with your track id) :

```
MP4Box -raws 1 sample.mp4
```

Just a few remarks about this implementation:

*   It is made on top of TTML existing support. So it has the same limitations (no images support, etc.).
*   DASH segmentation is fully supported.
*   There are still a few open questions which are on their way to standardization. You can expect a few minor improvements in the future.

  **EBU-TTD current limitations** /!\\ These limitations don't exist if you [use NHML](https://concolato.wp.imt.fr/2014/01/27/first-attempt-at-storing-ttml-in-mp4/) /!\\

*   Overlapping times are not supported.
*   Multiple <region> elements may trigger errors.

/!\\ Fixed limitations /\\

*   The expected default namespace of the EBU-TT-D document is 'http://www.w3.org/ns/ttml'. Documents where this namespace is bound to prefix are supported [starting at 08/30/2015](https://github.com/gpac/gpac/commit/7d5a0bc5cbb6148d78f87f51f8dc78d32125b643) (but no other namespace checks are performed).

  This development has been made possible thanks to [EBU](http://www.ebu.ch) through [GPAC Licensing](http://www.gpac-licensing.com).
