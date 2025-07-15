---
tags:
- option
- mp4
- source
- sample
- input
- heif
- media
- reframer
- isomedia
- data
- isobmff
- stream
- output
- frame
- track
---



# Overview {:data-level="all"}

We discuss here how to import items to create HEIF file collections. For track import, use the regular tools from GPAC.


# Importing images {:data-level="beginner"}

You can use MP4Box to manually import each item, see [MP4Box -h meta](mp4box-meta-opts).

When importing images, the first image imported will be set as primary item if the destination file has no primary item.


To import a single key frame `src.hvc` source:
```
MP4Box -add-image src.hvc:primary -new image.heic
```

To import a key frame at a given time from a source video:
```
MP4Box -add-image src.hvc:primary:time=11.5 -new image.heic
```

MP4Box can also import several images at once.
To import all key frames from a source video:
```
MP4Box -add-image src.hvc:time=-1 -new image.heic
```

To import all key frames start time 3 sec to end time 22.5 second in a source video:
```
MP4Box -add-image src.hvc:primary:time=3-22.5 -new image.heic
```

To import all key frames every 30 seconds in a source video:
```
MP4Box -add-image src.hvc:primary:time=-1/30 -new image.heic
```

To import all key frames every 30 seconds from start time 3 sec to end time 3min in a source video:
```
MP4Box -add-image src.hvc:primary:time=3-180/30 -new image.heic
```


# Filtering while importing {:data-level="beginner"}
MP4Box can be used together with filters in gpac, as discussed [here](mp4box-filters). This section illustrates how this feature can be used in various use cases.

## Importing a subset of frames

The following example import frames 1, 12 and 15 from a source sequence using the reframer filter:
```
MP4Box -add-image src.hvc:primary@@reframer:frames=1,12,15 -new image.heic
```

## Importing and transcoding
  
The following example imports a JPG image and transcodes it to HEVC at 5 mbps:
```
MP4Box -add-image src.jpg:primary@@enc:c=avc:b=5m -new image.heic
```

# Creating images in a file with video {:data-level="beginner"}

MP4Box can create images from a file with one or more video tracks and save the combined video+items.
The syntax used is the same as the examples above except the source file is not set.
The video track to import from can be set using `tkID` option, otherwise the first video track will be used.


To import a key frame at a given sample position as item:
```
MP4Box -add-image samp=26 source.heif
```

To import all key frames as items position (here renaming the output file from mp4 to heif):
```
MP4Box -add-image time=-1 source.mp4 -out images_vid.heic
```

In the above examples, the video data is copied to the new item, which increases the file size. 
You can change that by specifying that the item is a reference to the sample data using `ref`:

```
MP4Box -add-image ref:time=-1/30 image.heic
```

In this example, the first key frame of every 30s window of the source track will be added as an item sharing the data with the track sample.

# Creating derived image items

Derived image items such as grids and overlays can be created using `-add-derived-image`.

All options from `-add-image` are available, in addition to some options specific to derived image items
such as `image-grid-size`, `image-overlay-offsets`.

The `ref=dimg,id` option (where 'id' is an item ID number) is used to indicate the source items of the image derivation.

Example of a 2x2 grid:
```
MP4BOX -add-derived-image type=grid:id=1:image-pixi=8,8,8:image-size=4096x1716:image-grid-size=2x2:ref=dimg,2:ref=dimg,3:ref=dimg,4:ref=dimg,5:primary \
-add-image tile1.av1:id=2 -add-image tile2.av1:id=3 -add-image tile3.av1:id=4 -add-image tile4.av1:id=5 \
-ab avif -ab miaf -out 2x2grid.avif
```

Alternative entity groups (`group=altr,groupId`) can be used to add derived image items in a way that is backward compatible with readers that do not support them.

Example of a backward compatible overlay: readers that do not support overlays will show item 2 (layer1.av1, the primary item).
Readers that do support overlays will show item 1 since it's part of the same 'altr' group as the primary item but appears before it and is therefore preferred.
```
MP4BOX -add-derived-image type=iovl:id=1:image-pixi=8,8,8:image-size=2000x2000:image-overlay-offsets=100,100,50,500:image-overlay-color=65535,0,0,32125:ref=dimg,2:ref=dimg,3:group=altr,4 \
-add-image layer1.av1:id=2:primary:group=altr,4 -add-image layer2.av1:id=2 -ab avif -ab miaf -out overlay.avif
```

More examples are available in [these tests](https://github.com/gpac/testsuite/blob/master/scripts/iff-grid.sh).

# Automatic grids

Grids can be created using `add-derived-image` as explained above, but there is also a quick grid creation option called `agrid` which automatically computes a grid from the items present in the file.

It will hide all these items and make the grid a primary item, resulting in a thumbnail-like grid picture.
All images in the file must have the same width and height. If the number of images is not even, the last image will be ignored. 

```
MP4Box -add-image long_video.mp4:time=-1/30 -add-image agrid -new thumbnails.heif
```

This will create a new file containing the first key frame of every 30s window of `long_video.mp4` and add a grid representing all these items.
The grid aspect ratio can be hinted using `agrid=AR` , with `AR` the target aspect ratio. There is no guarantee that the AR will be respected since this depends on the image source sizes and number.


