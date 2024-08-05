# MP4Box vs gpac {: data-level="all" }

Following the introduction of the filter architecture and the gpac application, you may have a hard time choosing between MP4Box and gpac.
 
Before going any further, we assume:

-  you are familiar with [MP4Box](MP4Box)
-  you understand the principles of GPAC [filters](filters_general) and are somehow familiar with using the [gpac](gpac_general) application

We recommend that you quickly read the article on GPAC [re-architecture](Rearchitecture).

## MP4Box, not gpac

There are many features of libgpac available in MP4Box only, and most of them will probably never be ported to the general filter architecture.

The things you can do with both MP4Box and gpac are:

- adding media tracks or image items to a __new__ ISOBMFF file
- extracting media track to raw formats
- fragmenting and DASHing a set of sources (ISOBMFF or not)
- encrypting or decrypting an ISOBMFF file
- splitting an ISOBMF file
- some XML dump operations (-dnal option of MP4Box)

File concatenation can also be done using MP4Box as well as with gpac, but they do not use the same code base:

- MP4Box only concatenates ISOBMFF files, potentially requiring temporary ISOBMFF import
- gpac can concatenate any source  (live or not) using the [flist](flist) filter.


All the rest is MP4Box-specific and unaware of the filter architecture.
Many operations in MP4Box, such as tagging, track info and timing modifications, are moreover optimized to reduce rewrite time, whereas gpac always completely rewrites the output.

## MP4Box general processing

To have a better understanding of which one to choose for a given scenario, we first need to have a quick overview of both apps:

The gpac application is only in charge of calling a filter session based on the filters passed as arguments, regardless of their numbers/types/etc. 

MP4Box works in a completely different way to allow for ISOBMFF file edition. These are the logical steps in MP4Box processing, in their order of execution:

If `-add` / `-cat`, then:

- run a filter session for each import (-add) operation. This may be optimized when creating a new file using [-newfs](mp4box-gen-opts#newfs), in which case a single session is used for all import operations.
- store the result in a temporary file (unless `-flat` is set )

The input file is now either the source file (read-only or edit operations) or the edited file, potentially with new tracks

If `-split`, then:

- run a filter session on the input file for file splitting using the [reframer](reframer) filter

If `-raw`, then:

- run a filter session on the input file for each track to dump (usually involving the [writegen](writegen) filter)

If `-add-image`, then:

- run a filter session with the target source adding the track to the input file, convert desired samples to items and remove added track

If `-dash`, then:

- run a filter session on each input file names using the [dasher](dasher) filter
- exit

If `-crypt` or `-decrypt` , then:

- run a filter session for file encryption/decryption (potentially using fragmented mode)
- exit

If `-frag`, then:

- run a filter session for fragmentation
- exit


These sessions are separated, hence combining them will result in a longer processing time than doing the same operation with gpac.


Let's take the following example: add one video, two audios and encrypt the result. Using MP4Box:
```
MP4Box -add video.264:options -add audio_en.264:options -add audio_fr.264:options -crypt DRM.xml -new result.mp4
```

This will use 3 filter sessions for the import operations (one if you use `-newfs` instead of `-new`), creating a temporary edition file containing all media data, then use a filter session for the encryption.
The intermediate file is only deleted once the encryption session is done.

This can be slightly faster with less IOs and no temporary edit file using gpac:
```
gpac -i video.264:options -i audio_en.264:options -i audio_fr.264:options cecrypt:cfile=DRM.xml -o result.mp4
```

In both cases, we still use temporary storage for the final file interleaving. So let's add fragmentation to avoid this:

```
MP4Box -add video.264:options -add audio_en.264:options -add audio_fr.264:options -frag 100 -crypt DRM.xml -new result.mp4
```
We got rid of the temporary storage due do file interleaving, but we still need an intermediate file to store the import result.

```
gpac -i video.264:options -i audio_en.264:options -i audio_fr.264:options cecrypt:cfile=DRM.xml -o result.mp4:frag:cdur=100
```
We use no longer use temporary storage.



Note that these two are strictly equivalent in terms of processing:
```
MP4Box -add video.264:options -add audio_en.264:options -add audio_fr.264:options -newfs result.mp4
gpac -i video.264:options -i audio_en.264:options -i audio_fr.264:options -o result.mp4
```


## MP4Box and filters

The track import syntax and the dashing syntax may be combined with filter declarations, as discussed [here](mp4box-filters).
They are however restricted as follows:

- for importing, the destination format is always ISOBMFF
- the filter chain described is fairly simple, going from source to destination ([mp4mx](mp4mx) or [dasher](dasher) filters) without any possible branch in-between.

For example:
```
source_vid -> rescale -> encode1 \
                      -> encode2 -> dasher
                      -> encode3 /
```
This cannot be described using MP4Box, this must be converted into something like:
```
source_vid -> rescale -> encode1 -> dasher
source_vid -> rescale -> encode2 /
source_vid -> rescale -> encode3 /
```

The syntax will be:
```
MP4Box -dash 2000 video.264:@ffsws:osize=1280x720:@enc:c=avc:fintra=2:b=4m:@@ffsws:osize=1280x720:@enc:c=avc:fintra=2:b=2m:@@ffsws:osize=1280x720:@enc:c=avc:fintra=2:b=1m -out result.mp4
```

This will work as expected, but with three rescaler filters doing all the same thing (and a heavy syntax).

Using gpac, this is much simpler
```
gpac -i video.264 ffsws:osize=1280x720 --fintra=2 enc:c=avc:b=4m @@1 enc:c=avc:b=2m @@1 enc:c=avc:b=1m -o result.mp4
```


## MP4Box and live sources

MP4Box is not designed to deal with live sources and its processing cannot be interrupted.

On the other hand, gpac can be interrupted using `ctrl+c` and the current session flushed to save the results of what has been done so far.

## Subtle differences in gpac

There are some subtle differences between MP4Box and gpac that may result in different behavior. Some of these are:

- Default interleaving in MP4Box is 500ms, while it is 1000ms in gpac
- `deps` option is set by default on mp4mx, you must set in on sources in gpac
- Handler name is not set by `-for-test` in gpac, for that you need to set `#HandlerName=...` property on the source


# gpac, not MP4Box

You should use gpac rather than MP4Box in the following cases:

- sources are either live or simulate live (running forever)
- outputs are not local files: HTTP output, RTSP server, ROUTE output, etc...
- there are many filters manually specified in the pipeline
- monitoring of the filter session (`gpac -r`)
- the MP4Box pipeline combines several filter-session related aspects (`-dash`, `-split`, `-crypt`, `-add`, `-frag`)
- need for complex filter graph connections, reusing non-source filters in the graph
- the pipeline has multiple outputs (e.g. dash/hls and live TS multicast)
- the pipeline processes an unknown number of streams that must be redirected to different outputs, requiring URL templating.
- pipeline involves playback or composition, using [vout](vout), [aout](aout) or [compositor](compositor) filters
- input (live or not) inspection before ISOBMFF packaging
- remux input(s) without ISOBMFF conversion (e.g. audio + video to MPEG2 TS)
- distributed processing (using GSF or other formats through pipes, sockets or other means)
- any other complex use case we never thought of :)


Another good reason to use gpac to test a pipeline is when you plan on using GPAC bindings in [Python](python) or [NodeJS](nodejs) scripts.
- these bindings are indeed very close to gpac logic, and moving from a gpac command line to the bindings is trivial
- rewriting an MP4Box pipeline to the bindings will first require rewriting the MP4Box command line as a gpac one.


Check the [gpac one-liner](filters-oneliners) page for more examples !
