We have added to GPAC some sample applications demonstrating how to use GPAC to demux MP4 files. 

They are not full applications, just examples taking some MP4 files as input and displaying some information about the media samples contained in the file. 

So far, we have added 3 sample applications:

*   a basic demultiplexer called ['bmp4demux'](https://github.com/gpac/gpac/tree/master/applications/testapps/bmp4demux/main.c) capable of reading and dispatching media access units from fragmented or non-fragmented MP4 files, progressively (i.e. while the file is being written);

*   a segment based demux called '[segmp4demuxer](https://github.com/gpac/gpac/tree/master/applications/testapps/segmp4demux/main.c)' capable of dispatching media units from media segments, where the input data is framed.  This is what is used for the DASH support;
*   and a more advanced demultiplexer, called ['fmp4demux'](https://github.com/gpac/gpac/tree/master/applications/testapps/fmp4demux/main.c) capable of dispatching media units in streaming mode (i.e. reclaiming resources once media units have been dispatched), where the input data comes from fragmented mp4 but is not framed, i.e. the data in the buffer passed to the demultiplexer does not start or end at segment or fragment boundaries.

These sample applications can be compiled with a very limited set of files from the GPAC project.

Have a look at the Visual Studio solutions or configure with the options `--disable-all --enable-isoff`. Some additional notes on GPAC's demuxers.

*   All of GPAC's demuxers can do progressive parsing, i.e. if an ISO box is not complete, they will stop parsing (indicating how many bytes are missing to continue parsing) and resume parsing at that point when more data is given.

*   GPAC's demuxers do not load media data (e.g. frames) until it's needed, because obviously loaded media data could use a lot of memory. GPAC's parsers just load the signaling information like frame sizes, timestamps, etc. (contained in 'moov', 'moof' boxes and others) and reads the actual media data (contained in 'mdat' boxes) upon request. The signaling information in ISO files uses byte offsets in the given input buffer, so 'mdat' positions and content in the buffer need to stay unmodified until the media units in the 'mdat' are fetched. However, the buffer may be increased at any time to provide more data. That is the behavior implemented in the 'fmp4demux' application with calls to 'realloc' and 'memmove' when new data is given and old data discarded.
