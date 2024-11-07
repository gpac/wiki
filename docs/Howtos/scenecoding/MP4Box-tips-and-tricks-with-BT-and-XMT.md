---
tags:
- scene
- media
- binary
- data
- stream
- xml
- bitstream
- sequence
- track
- macro
---



# Minimal Stream Descriptors for MP4Box (BT and XMT) {:data-level="all"}

When encoding a BIFS or OD ES\_Descriptor, MP4Box must find at least:

*   The decoderConfigDescriptor with the right streamType set

When encoding an interaction stream descriptor, MP4Box must find at least:

*   The decoderConfigDescriptor with the right streamType set
*   The UIConfig descriptor with the deviceName field. Note however that most of the time you will need to specify the ES\_ID and the OCR\_ES\_ID of this descriptor to make sure events are not tied to any timeline.

When encoding a regular ES\_Descriptor, MP4Box must find at least:

*   The MuxInfo descriptor with the fileName (StreamSource in XMT) set.

For systems streams, if the SLConfigDescriptor is not found, MP4Box uses a stream timescale of 1000, otherwise it uses `SLConfigDescriptor.timestampResolution` as stream timescale.

When the InitialObjectDescriptor is not found in the BT file, MP4Box will create one for you.

## Non-linear Parsing

MP4Box can perform non-linear parsing of text files (BT,XMT,VRML,X3D/XML), in other words it understands usage of a node before its definition. This greatly simplifies content authoring, in terms of complexity (for example, 2 conditionals referencing each-other) and readability (you don't have to declare things at specific places). When encoding, node declarations are put back before node referencing (thus the decoded file will not look the same as the original one).

## Multiple DEF handling

MP4Box can handle redefinition of nodes with the same DEF identifier (ex, "DEF AC AudioClip" and "DEF AC MovieTexture"). However when doing so, the nodes don't have the same binary IDs and only the first DEFed node can be safely used for field replacement. This feature should only be used with care to replace a whole node.

## Forcing binary IDs

You can make MP4Box use your own binary identifiers for nodes and routes by using the syntax NXX for nodes or RXX for routes, where XX is the desired binary identifier (>=0). In case a node in the scene already has the same binary ID, its ID is changed to a non-conflicting value and MP4Box will print a warning message indicating a node ID has been changed.

## HTML Color Codes (BT only)

MP4Box can use HTML color codes in BT instead of the regular 3 floats SFColor. Since '#' is a comment character in BT/WRL, HTML color codes are signaled by the '$' character, for example`emissiveColor $FFAAB4`.

## Simple Macro processor (BT only)

MP4Box can use simple macros in BT in order to help authoring. **A BT (or WRL) file with such macros cannot be understood by any other tools than MP4Box!**.

The macro must be defined on a single line as follows:

```c
#define MACRO_NAME REP LAC E MENT STR ING
```

The BT parser will simply replace any occurrence of the macro by its value.

Here is an example of a BT macro:

```c
#define MYAPP Appearance { material Material2D { emissiveColor 1 0 0 filled TRUE} }
#define MYCOORDS 200 20

Transform2D {

    translation MYCOORDS

    children [
        Shape {
            appearance MYAPP
            geometry Rectangle { size 20 20 }
        }
    ]
}
```
