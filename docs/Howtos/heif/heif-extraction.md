---
tags:
- transcode
- pid
- heif
- data
- codec
- compression
- frame
- stream
- hevc
- dump
- media
- decoder
- box
- track
- option
- mp4
- source
- input
- output
- mpeg
- encoder
---



# Overview {:data-level="all"}

We discuss here how to extract items from HEIF file collections. For track extraction, use the regular tools from GPAC.

A HEIF image collection will contain several items packed in a single `meta` box in ISOBMFF. These items will usually share the same coding type, although this is not a requirement. 
We only discuss here HEIF version 1 files, for which each item is an intra picture. We assume the image collection is made of HEVC items.

# Extracting images {:data-level="beginner"}

You can use MP4Box to manually extract each item, see [MP4Box -h meta](mp4box-meta-opts): 

```
MP4Box -dump-item 1:path=dump.hvc source.heic
```

This will dump item 2 into `dump.hvc`.

This however requires the item ID, hence an inspection of the file prior to extracting the item.

To avoid this, you can use gpac as follows:
```
gpac -i source.heic -o dump_$ItemID$.hvc
```

This will dump each item in `dump_$ItemID$.hvc`, with `$ItemID$` being replaced by the item ID.



# Transcoding as images {:data-level="beginner"}

Transcoding is not possible using MP4Box. Using gpac, it is a fairly simple process:

```
gpac -i source.heic -o dump_$ItemID$.jpg
```

This will transcode each item to JPEG  in `dump_$ItemID$.jpg`, with `$ItemID$` being replaced by the item ID. Changing the output extension to `png` will transcode to PNG.

Each item will be declared as a media PID. This implies that there will be one decoder instance and one encoder instance created for each media PID.

# Transcoding as a sequence of images {:data-level="beginner"}

One way to optimize the previous drawback of high resource usage is by declaring all items as a single track using [-itt](mp4dmx#itt) option of the MP4 demultiplexer:

```
gpac -i source.heic:itt -o dump_$ItemID$.jpg
gpac -i source.heic:itt -o dump_$num$.jpg
```

In this case, a single HEVC PID will be declared, hence a single HEVC decoder and a single JPEG encoder.  

Note: Using `$num$` templating allows producing filenames independent from the item ID. 


The same approach can be used to quickly view all items declared in a file:

```
gpac -i source.heic:itt vout
```
