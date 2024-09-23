<!-- automatically generated - do not edit, patch gpac/applications/mp4box/mp4box.c -->

# Meta and HEIF Options  
  
IsoMedia files can be used as generic meta-data containers, for examples storing XML information and sample images for a movie. The resulting file may not always contain a movie as is the case with some HEIF files or MPEG-21 files.  
    
These information can be stored at the file root level, as is the case for HEIF/IFF and MPEG-21 file formats, or at the movie or track level for a regular movie.    
    
<div markdown class="option">
<a id="set-meta" data-level="basic">__-set-meta__</a> `ABCD[:tk=tkID]`: set meta box type, with `ABCD` the four char meta type (NULL or 0 to remove meta)  

- tk not set: use root (file) meta  
- tkID == 0: use moov meta  
- tkID != 0: use meta of given track  
</div>
  
<div markdown class="option">
<a id="add-item" data-level="basic">__-add-item__</a> (string): add resource to meta, with parameter syntax `file_path[:opt1:optN]`  

- file_path `this` or `self`: item is the file itself  
- tk=tkID: meta location (file, moov, track)  
- name=str: item name, none if not set  
- type=itype: item 4cc type (not needed if mime is provided)  
- mime=mtype: item mime type, none if not set  
- encoding=enctype: item content-encoding type, none if not set  
- id=ID: item ID  
- ref=4cc,id: reference of type 4cc to an other item (can be set multiple times)  
- group=id,type: indicate the id and type of an alternate group for this item  
- replace: replace existing item by new item  
</div>
  
<div markdown class="option">
<a id="add-image" data-level="basic">__-add-image__</a> (string): add the given file as HEIF image item, with parameter syntax `file_path[:opt1:optN]`. If `filepath` is omitted, source is the input MP4 file  

- name, id, ref: see [-add-item](#add-item)  
- primary: indicate that this item should be the primary item  
- time=t[-e][/i]: use the next sync sample after time t (float, in sec, default 0). A negative time imports ALL intra frames as items  

    - If `e` is set (float, in sec), import all sync samples between `t` and `e`  
    - If `i` is set (float, in sec), sets time increment between samples to import  

- split_tiles: for an HEVC tiled image, each tile is stored as a separate item  
- image-size=wxh: force setting the image size and ignoring the bitstream info, used for grid, overlay and identity derived images also  
- rotation=a: set the rotation angle for this image to 90*a degrees anti-clockwise  
- mirror-axis=axis: set the mirror axis: vertical, horizontal  
- clap=Wn,Wd,Hn,Hd,HOn,HOd,VOn,VOd: see track clap  
- image-pasp=axb: force the aspect ratio of the image  
- image-pixi=(a|a,b,c): force the bit depth (1 or 3 channels)  
- hidden: indicate that this image item should be hidden  
- icc_path: path to icc data to add as color info  
- alpha: indicate that the image is an alpha image (should use ref=auxl also)  
- depth: indicate that the image is a depth image (should use ref=auxl also)  
- it=ID: indicate the item ID of the source item to import  
- itp=ID: same as `it=` but copy over all properties of the source item  
- tk=tkID: indicate the track ID of the source sample. If 0, uses the first video track in the file  
- samp=N: indicate the sample number of the source sample  
- ref: do not copy the data but refer to the final sample/item location, ignored if `filepath` is set  
- agrid[=AR]: creates an automatic grid from the image items present in the file, in their declaration order. The grid will __try to__ have `AR` aspect ratio if specified (float), or the aspect ratio of the source otherwise. The grid will be the primary item and all other images will be hidden  
- av1_op_index: select the AV1 operating point to use via a1op box  
- replace: replace existing image by new image, keeping props listed in `keep_props`  
- keep_props=4CCs: coma-separated list of properties types to keep when replacing the image, e.g. `keep_props=auxC`  
- auxt=URN: mark image as auxiliary using given `URN`  
- auxd=FILE: use data from `FILE` as auxiliary extensions (cf `auxC` box)  
- any other options will be passed as options to the media importer, see [-add](#add)  
</div>
  
<div markdown class="option">
<a id="add-derived-image" data-level="basic">__-add-derived-image__</a> (string): create an image grid, overlay or identity item, with parameter syntax `:type=(grid|iovl|iden)[:opt1:optN]`  

- image-grid-size=rxc: set the number of rows and columns of the grid  
- image-overlay-offsets=h,v[,h,v]*: set the horizontal and vertical offsets of the images in the overlay  
- image-overlay-color=r,g,b,a: set the canvas color of the overlay [0-65535]  
- any other options from [-add-image](#add-image) can be used  
  
</div>
  
<div markdown class="option">
<a id="rem-item" data-level="basic">__-rem-item__</a>,__-rem-image__ `item_ID[:tk=tkID]`: remove resource from meta  
</div>
<div markdown class="option">
<a id="set-primary" data-level="basic">__-set-primary__</a> `item_ID[:tk=tkID]`: set item as primary for meta  
</div>
<div markdown class="option">
<a id="set-xml" data-level="basic">__-set-xml__</a> `xml_file_path[:tk=tkID][:binary]`: set meta XML data  
</div>
<div markdown class="option">
<a id="rem-xml" data-level="basic">__-rem-xml__</a> `[tk=tkID]`: remove meta XML data  
</div>
<div markdown class="option">
<a id="dump-xml" data-level="basic">__-dump-xml__</a> `file_path[:tk=tkID]`: dump meta XML to file  
</div>
<div markdown class="option">
<a id="dump-item" data-level="basic">__-dump-item__</a> `item_ID[:tk=tkID][:path=fileName]`: dump item to file  
</div>
<div markdown class="option">
<a id="package" data-level="basic">__-package__</a> (string): package input XML file into an ISO container, all media referenced except hyperlinks are added to file  
</div>
<div markdown class="option">
<a id="mgt" data-level="basic">__-mgt__</a> (string): package input XML file into an MPEG-U widget with ISO container, all files contained in the current folder are added to the widget package  
</div>
