GPAC allows adding or removing boxes in an ISOBMFF file through patches, in order to customize files. This box patching uses an XML description of where the box should be added or removed, and what the new box content is in case of box addition.

The XML syntax used is:

- a root `GPACBOXES` element with no specified attributes
- Any number of `Box` elements, where the payload is described using XML Binary [BS](XML-Binary) elements. 


### Box Element Syntax

```xml
<Box path="..." trackID="..." essential="..." itemID="...">
<BS .../>
</Box>
```

A `Box` element with no children implies a box removal, and the `path` attribute gives the path to the box to remove. Otherwise this specifies a box insertion, and the path attribute gives the path to the parent box or previous box.

The path is formatted as a series of 4CC separated by a `.` indicating target child. When inserting a new box, a final character may be appended to the path:

- no character: the last 4CC shall identify a container box, and this specifies that the new box shall be inserted at the end of this container, e.g. `trak.mdia` means insert box as the last child of the media box
- `+`: specifies that the new box shall be inserted after the indicated box, e.g. `trak.tkhd+` means insert box after track header
- `-`: specifies that the new box shall be inserted before the indicated box, e.g. `trak.tkhd-` means insert box before track header

To insert a box at the root level, simply indicate after or before which root box you want to insert the file, e.g. `moov-`or `moov+`.

 The trackID may be:
 
 - set in the Box patch
 - specified using the command line
 - derived from the PID attached to this box patch
- otherwise defaults to the trackID of the first track


Box patching only supports 32 bit box sizes. The first 4 bytes of the payload will represent the 4CC of the new box, and the size will be dynamically computed.
  
### Semantics

*   `trackID` : integer specifying the ID of the track to which the box patch applies; this is ignored if a trackID was set through command lines or if the box patch is attached to a PID.
*   `path` : path to the box to add
*   `essential` : boolean value (`yes`, `true`, `no`, `false`) used when the box parent is an item property container box (`ipco`).
*   `itemID` : integer value giving the ID of the item, used when the box parent is an item property container box (`ipco`). This will automatically insert an item property association entry (`ipma`). If not set, no association will be added.  

