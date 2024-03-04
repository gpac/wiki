# Overview

As of GPAC 2.0, MP4Box supports in-place editing of MP4 files.

In-place editing is used whenever the following conditions are true:

- the media data has not been modified during the edit operations
- no storage mode is specified
- no output file name is specified
- no movie fragments are present

This implies that import, removal or concatenation of tracks or items will disable inplace editing.

_Note_ In-place storage is enabled by default but can be disabled using `-no-inplace` option.

When in-place editing is used, MP4Box will display the following message:
```
Saving FILE: In-place rewrite
```

In-place editing is useful when you need to modify very large media files without modifying the media data.
In-place editing works by shifting media data in the file and updating file offsets in the structure info, therefore the speed of the edition depends on the original storage mode and file structure, as discussed below.   

In-place editing is supported for both movies and image (HEIF) non-fragmented files. Fragmented files are always de-fragmented when doing edits on the file.

For example, adding a brand and itunes tags to your `movie.mp4` file:

```
MP4Box -ab TEST -itags artist=GPAC movie.mp4
```

Tests for in-place storage are available [here](https://github.com/gpac/testsuite/blob/master/scripts/mp4box-inplace.sh).


# Flat storage files

In files stored with flat storage (`-flat` in MP4Box), the media data is placed before the structured data (`moov` and `meta`  box) and usually does not need any shifting. There is one exception to this: when adding brands, since they must be located first in the file, it is necessary to shift the media data. There is currently no way to reserve space for future brand edition in MP4Box, and any brand add operation will result in media data shift. 

We therefore recommend using interleaved storage (`moov`/ `meta`  first).


# Interleaved files

In files stored with interleaved storage (`-inter` in MP4Box), the media data is placed after the structured data (`moov` and `meta`  box) and may need shifting whenever the size of {ftyp, moov, meta} boxes changes. In order to avoid shifting when this size decreases, a `free` box is inserted before the media data.
When this size increases, the media data is shifted if writing the structured data will overwrite the start of the media data. Otherwise, a `free` box is written between the `moov+meta` boxes and  the media data.

You can control how much free space you want to reserve for future editions by using `-moovpad` option.
   
```
MP4Box -add SRC -new movie.mp4 -moovpad 1000
```

This will create a new file from `SRC`, leaving 1000 bytes of free space before the start of the media data, thereby allowing for roughly 1000 bytes size increase of the structured data without having to shift the media data. If the structured size increases over this reservoir, the media data will be shifted.

You can use `-moovpad` option in your in-place edit operations, to force moving the media data (reserving more space):
 
```
MP4Box -ab GPAC movie.mp4 -moovpad 5000
```
This will perform in-place edit if the previously created file, but shift the media data to have 5000 bytes reserved for future edition; if more than 5000 free bytes are available, the media data is not shifted (i.e. `moovpad` is ignored in this case).


_WARNING_ When using in-place editing with `moov/meta` stored first,  MP4Box reclaims all possible empty space in `moov/meta`  boxes by recursively purging all child boxes with type `free` or `skip`.
 

