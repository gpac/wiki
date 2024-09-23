<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# ROUTE input  
  
Register name used to load filter: __routein__  
This filter may be automatically loaded during graph resolution.  
  
This filter is a receiver for file delivery over multicast. It currently supports ATSC 3.0, generic ROUTE and DVB-MABR flute.  

- ATSC 3.0 mode is identified by the URL `atsc://`.  
- Generic ROUTE mode is identified by the URL `route://IP:PORT`.  
- DVB-MABR mode is identified by the URL `mabr://IP:PORT` pointing to the bootstrap FLUTE channel carrying the multicast gateway configuration.  

  
The filter can work in cached mode, source mode or standalone mode.  

# Cached mode  
  
The cached mode is the default filter behavior. It populates GPAC HTTP Cache with the received files, using `http://gmcast/serviceN/` as service root, `N being the multicast service ID.`  
In cached mode, repeated files are always pushed to cache.  
The maximum number of media segment objects in cache per service is defined by [nbcached](#nbcached); this is a safety used to force object removal in case DASH client timing is wrong and some files are never requested at cache level.  
    
The cached MPD is assigned the following headers:  

- `x-mcast`: boolean value, if `yes` indicates the file comes from a multicast.  
- `x-mcast-first-seg`: string value, indicates the name of the first segment (completely or currently being) retrieved from the broadcast.  
- `x-mcast-ll`: boolean value, if yes indicates that the indicated first segment is currently being received (low latency signaling).  
- `x-mcast-loop`: boolean value, if yes indicates a loop (e.g. pcap replay) in the service has been detected - only checked if [cloop](#cloop) is set.  

    
The cached files are assigned the following headers:  

- `x-mcast`: boolean value, if `yes` indicates the file comes from a multicast.  

  
If [max_segs](#max_segs) is set, file deletion event will be triggered in the filter chain.  
  
# Source mode  
  
In source mode, the filter outputs files on a single output PID of type `file`. The files are dispatched once fully received, the output PID carries a sequence of complete files. Repeated files are not sent unless requested.  
If needed, one PID per TSI can be used rather than a single PID. This avoids mixing files of different mime types on the same PID (e.g. HAS manifest and ISOBMFF).  
Example
```
gpac -i atsc://gcache=false -o $ServiceID$/$File$:dynext
```
  
This will grab the files and forward them as output PIDs, consumed by the [fout](fout) filter.  
  
If [max_segs](#max_segs) is set, file deletion event will be triggered in the filter chain.  
  
# Standalone mode  
  
In standalone mode, the filter does not produce any output PID and writes received files to the [odir](#odir) directory.  
Example
```
gpac -i atsc://:odir=output
```
  
This will grab the files and write them to `output` directory.  
  
If [max_segs](#max_segs) is set, old files will be deleted.  
  
# File Repair  
  
In case of losses or incomplete segment reception (during tune-in), the files are patched as follows:  

- MPEG-2 TS: all lost ranges are adjusted to 188-bytes boundaries, and transformed into NULL TS packets.  
- ISOBMFF: all top-level boxes are scanned, and incomplete boxes are transformed in `free` boxes, except mdat kept as is if [repair](#repair) is set to simple.  

  
If [kc](#kc) option is set, corrupted files will be kept. If [fullseg](#fullseg) is not set and files are only partially received, they will be kept.  
  
# Interface setup  
  
On some systems (OSX), when using VM packet replay, you may need to force multicast routing on your local interface.  
For ATSC, you will have to do this for the base signaling multicast (224.0.23.60):  
Example
```
route add -net 224.0.23.60/32 -interface vboxnet0
```
  
Then for each multicast service in the multicast:  
Example
```
route add -net 239.255.1.4/32 -interface vboxnet0
```
  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="src" data-level="basic">__src__</a> (cstr): URL of source content  
</div>  
<div markdown class="option">  
<a id="ifce">__ifce__</a> (str): default interface to use for multicast. If NULL, the default system interface will be used  
</div>  
<div markdown class="option">  
<a id="gcache">__gcache__</a> (bool, default: _true_): indicate the files should populate GPAC HTTP cache  
</div>  
<div markdown class="option">  
<a id="tunein" data-level="basic">__tunein__</a> (sint, default: _-2_): service ID to bootstrap on for ATSC 3.0 mode (0 means tune to no service, -1 tune all services -2 means tune on first service found)  
</div>  
<div markdown class="option">  
<a id="buffer">__buffer__</a> (uint, default: _0x80000_): receive buffer size to use in bytes  
</div>  
<div markdown class="option">  
<a id="timeout" data-level="basic">__timeout__</a> (uint, default: _5000_): timeout in ms after which tunein fails  
</div>  
<div markdown class="option">  
<a id="nbcached">__nbcached__</a> (uint, default: _8_): number of segments to keep in cache per service  
</div>  
<div markdown class="option">  
<a id="kc">__kc__</a> (bool, default: _false_): keep corrupted file  
</div>  
<div markdown class="option">  
<a id="skipr">__skipr__</a> (bool, default: _true_): skip repeated files (ignored in cache mode)  
</div>  
<div markdown class="option">  
<a id="stsi">__stsi__</a> (bool, default: _false_): define one output PID per tsi/serviceID (ignored in cache mode)  
</div>  
<div markdown class="option">  
<a id="stats">__stats__</a> (uint, default: _1000_): log statistics at the given rate in ms (0 disables stats)  
</div>  
<div markdown class="option">  
<a id="tsidbg">__tsidbg__</a> (uint, default: _0_): gather only objects with given TSI (debug)  
</div>  
<div markdown class="option">  
<a id="max_segs">__max_segs__</a> (uint, default: _0_): maximum number of segments to keep on disk  
</div>  
<div markdown class="option">  
<a id="odir">__odir__</a> (str): output directory for standalone mode  
</div>  
<div markdown class="option">  
<a id="reorder">__reorder__</a> (bool, default: _true_): consider packets are not always in order - if false, this will evaluate an LCT object as done when TOI changes  
</div>  
<div markdown class="option">  
<a id="cloop" data-level="basic">__cloop__</a> (bool, default: _false_): check for loops based on TOI (used for capture replay)  
</div>  
<div markdown class="option">  
<a id="rtimeout">__rtimeout__</a> (uint, default: _100000_): default timeout in us to wait when gathering out-of-order packets  
</div>  
<div markdown class="option">  
<a id="fullseg">__fullseg__</a> (bool, default: _false_): only dispatch full segments in cache mode (always true for other modes)  
</div>  
<div markdown class="option">  
<a id="repair">__repair__</a> (enum, default: _simple_): repair mode for corrupted files  

- no: no repair is performed  
- simple: simple repair is performed (incomplete `mdat` boxes will be kept)  
- strict: incomplete mdat boxes will be lost as well as preceding `moof` boxes  
- full: HTTP-based repair of all lost packets  
</div>  
  
<div markdown class="option">  
<a id="repair_url" data-level="basic">__repair_url__</a> (cstr): repair url  
</div>  
<div markdown class="option">  
<a id="max_sess" data-level="basic">__max_sess__</a> (uint, default: _1_): max number of concurrent HTTP repair sessions  
</div>  
<div markdown class="option">  
<a id="llmode" data-level="basic">__llmode__</a> (bool, default: _true_): enable low-latency access  
</div>  
<div markdown class="option">  
<a id="dynsel" data-level="basic">__dynsel__</a> (bool, default: _true_): dynamically enable and disable multicast groups based on their selection state  
</div>  
  
