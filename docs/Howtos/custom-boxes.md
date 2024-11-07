---
tags:
- mpd
- pid
- data
- codec
- multiplexer
- stream
- encode
- xml
- media
- isobmff
- box
- track
- option
- mp4
- source
- chain
- input
- isomedia
- dash
- encoder
---



# Overview {:data-level="all"}

We discuss here how to customize ISOBMFF files using box patches.  Please first check the XML [Box Patch](BoxPatch) syntax before reading.

__Warning__: the box patch does not allow modifications of fields of a box, it can only be used to insert new boxes or  remove existing boxes. Box modifications must be done through available options of [MP4Box](MP4Box-Introduction) or the [ISOBMF multiplexer](mp4mx).


# Applying a box patch to a file

You can use MP4Box to patch boxes of an existing file.

__Warning__: the method in this section only works for non fragmented files, see [next section](#injecting-a-box-patch-in-your-workflow) for alternate ways.

## Injecting a box

Let's take the following patch:
```xml
<?xml version="1.0" encoding="UTF-8" />
<GPACBOXES>

<Box path="trak.tkhd+">
<BS fcc="GPAC"/>
<BS value="2" bits="32"/>
<BS value="1" bits="32"/>
</Box>

</GPACBOXES>
```

This patch describes insertion of a box after a track header box, with a 4CC value of `GPAC` and a payload of `0x0000000200000001`.

```
MP4Box -patch box.xml source.mp4
```

This will inject the new box after the track header of the first track in the file.

```
MP4Box -patch 4=box.xml source.mp4
```

This will inject the new box after the track header of the track with ID 4.


## Removing a box

Let's take the following patch:
```xml
<?xml version="1.0" encoding="UTF-8" />
<GPACBOXES>

<Box path="trak.GPAC">
</Box>

</GPACBOXES>
```

This patch describes removal of a box with a 4CC value `GPAC`located in the `trak` box.
```
MP4Box -patch box.xml source.mp4
```

This will remove the new box if present in the track header of the first track in the file.

```
MP4Box -patch 4=box.xml source.mp4
```

This will remove the new box if present in the track header of the track with ID 4.



# Injecting a box patch in your workflow {: data-level="beginner"}

You may also want to customize your ISOBMFF files while they are being produced in a filter chain. 

This can be done by specifying the [-boxpatch](mp4mx#boxpatch) option to the ISOBMFF multiplexer:

```
gpac -i source.264 -o test.mp4:boxpatch=patch.xml
```

This can  also be done on a per-PID basis; this is typically used to inject different boxes for different media types:

```
gpac -i source.264#boxpatch=patch.xml -i source.aac -o test.mp4
```

This will obviously also work in DASH mode:

```
gpac -i source.264#boxpatch=patch.xml -i source.aac -o test.mpd
```

You can also set globally the [-boxpatch](mp4mx#boxpatch) option to use with MP4Box dashing:
```
MP4Box -dash 1000 source.mp4 -out test.mpd --boxpatch=patch.xml
```

or when fragmenting a file with MP4Box:

```
MP4Box -frag 1000 source.mp4 --boxpatch=patch.xml
```
