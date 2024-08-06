# Multimedia scene description {:data-level="all" }

A scene description is a language describing animations, interactivity, 2D and 3D shapes, audio and video relationship in a presentation. 
GPAC supports a variety of scene description languages:

- MPEG-4 BIFS, in its binary form, [text](MPEG-4-BIFS-Textual-Format) form and [XML](MPEG-4-XMT-Format) form
- Web3D VRML97 and X3D
- SVG 1.2 Tiny profile
- MPEG-4 LASeR
- A subset of SWF (Adobe Flash)

MP4Box supports encoding of BIFS and LASeR, as well as various conversions operations. A detailed list of supported operations is provided [here](mp4box-scene-opts).

Rendering is supported in GPAC through the [Compositor](compositor) filter.

For MPEG-4 Systems scene coding and media packaging, GPAC relies on standard MPEG-4 descriptions but defines its own extensions for media multiplexing, as well as for some [BIFS commands](MPEG-4-Scene-Commands). You may also have a look at the [tips and tricks](MP4Box-tips-and-tricks-with-BT-and-XMT) page.
