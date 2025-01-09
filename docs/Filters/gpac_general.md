<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->
# General Usage of gpac
Usage: gpac [options] FILTER [LINK] FILTER [...]   
gpac is GPAC's command line tool for setting up and running filter chains.  
  
_FILTER_: a single filter declaration (e.g., `-i file`, `-o dump`, `inspect`, ...), see [gpac -h doc](filters_general#filter-declaration-filter).  
_[LINK]_: a link instruction (e.g., `@`, `@2`, `@2#StreamType=Visual`, ...), see [gpac -h doc](filters_general#filter-linking-link).  
_[options]_: one or more option strings, each starting with a `-` character.  

    - an option using a single `-` indicates an option of gpac (see [gpac -hx](gpac_general#h)) or of libgpac (see [gpac -hx core](core_options))  
    - an option using `--` indicates a global filter or meta-filter (e.g. FFmpeg) option, e.g. `--block_size=1000` or `--profile=Baseline` (see [gpac -h doc](core_config#global-filter-options))  

    
Filter declaration order may impact the link resolver which will try linking in declaration order. Most of the time for simple graphs, this has no impact. However, for complex graphs with no link declarations, this can lead to different results.    
Options do not require any specific order, and may be present anywhere, including between link statements or filter declarations.    
Boolean values do not need any value specified. Other types shall be formatted as `opt=val`, except [-i](#i), `-src`, [-o](#o), `-dst` and [-h](#h) options.  
  
The session can be interrupted at any time using `ctrl+c`, which can also be used to toggle global reporting.  
  
The possible options for gpac are:  
  
<div markdown class="option">
<a id="mem-track">__-mem-track__</a>: enable memory tracker  
</div>
<div markdown class="option">
<a id="mem-track-stack">__-mem-track-stack__</a>: enable memory tracker with stack dumping  
</div>
<div markdown class="option">
<a id="ltf">__-ltf__</a>:      load test-unit filters (used for for unit tests only)  
</div>
<div markdown class="option">
<a id="sloop">__-sloop__</a> (int): loop execution of session, creating a session at each loop, mainly used for testing, breaking at first error. If no value is given, loops forever  
</div>
<div markdown class="option">
<a id="runfor">__-runfor__</a> (int): run for the given amount of milliseconds, exit with full session flush  
</div>
<div markdown class="option">
<a id="runforf">__-runforf__</a> (int): run for the given amount of milliseconds, exit with fast session flush  
</div>
<div markdown class="option">
<a id="runforx">__-runforx__</a> (int): run for the given amount of milliseconds and exit with no cleanup  
</div>
<div markdown class="option">
<a id="runfors">__-runfors__</a> (int): run for the given amount of milliseconds and exit with segfault (tests)  
</div>
<div markdown class="option">
<a id="runforl">__-runforl__</a> (int): run for the given amount of milliseconds and wait forever at end (tests)  
</div>
<div markdown class="option">
<a id="stats" data-level="basic">__-stats__</a>: print stats after execution  
</div>
<div markdown class="option">
<a id="graph" data-level="basic">__-graph__</a>: print graph after execution  
</div>
<div markdown class="option">
<a id="qe">__-qe__</a>:        enable quick exit (no mem cleanup)  
</div>
<div markdown class="option">
<a id="k">__-k__</a>:          enable keyboard interaction from command line  
</div>
<div markdown class="option">
<a id="r" data-level="basic">__-r__</a> (string): enable reporting  

- r: runtime reporting  
- r=FA[,FB]: runtime reporting but only print given filters, e.g. `r=mp4mx` for ISOBMFF multiplexer only  
- r=: only print final report  
</div>
  
<div markdown class="option">
<a id="seps">__-seps__</a> (string, default: __:=#,!@__): set the default character sets used to separate various arguments  

- the first char is used to separate argument names  
- the second char, if present, is used to separate names and values  
- the third char, if present, is used to separate fragments for PID sources  
- the fourth char, if present, is used for list separators (_sourceIDs_, _gfreg_, ...)  
- the fifth char, if present, is used for boolean negation  
- the sixth char, if present, is used for LINK directives (see [filters help (-h doc)](filters_general))  
</div>
  
<div markdown class="option">
<a id="i" data-level="basic">__-i__</a>,__-src__ (string): specify an input file - see [filters help (-h doc)](filters_general)  
</div>
  
<div markdown class="option">
<a id="o" data-level="basic">__-o__</a>,__-dst__ (string): specify an output file - see [filters help (-h doc)](filters_general)  
</div>
  
<div markdown class="option">
<a id="ib">__-ib__</a> (string): specify an input file to wrap as GF_FileIO object (testing of GF_FileIO)  
</div>
<div markdown class="option">
<a id="ibx">__-ibx__</a> (string): specify an input file to wrap as GF_FileIO object without caching (testing of GF_FileIO)  
</div>
<div markdown class="option">
<a id="ob">__-ob__</a> (string): specify an output file to wrap as GF_FileIO object (testing of GF_FileIO)  
</div>
<div markdown class="option">
<a id="cl">__-cl__</a>:        force complete mode when no link directive are set - see [filters help (-h doc)](filters_general)  
</div>
  
<div markdown class="option">
<a id="sid">__-sid__</a>:      force source IDs to be present when attempting to link - see [filters help (-h doc)](filters_general)  
</div>
  
<div markdown class="option">
<a id="step">__-step__</a>:    test step mode in non-blocking session  
</div>
<div markdown class="option">
<a id="h" data-level="basic">__-h__</a>,__-help,-ha,-hx,-hh__ (string): print help. Use `-help` or `-h` for basic options, `-ha` for advanced options, `-hx` for expert options and `-hh` for all.    
_Note: The `@` character can be used in place of the `*` character. String parameter can be:_  

- empty: print command line options help  
- doc: print the general filter info  
- alias: print the gpac alias syntax  
- log: print the log system help  
- core: print the supported libgpac core options. Use -ha/-hx/-hh for advanced/expert options  
- cfg: print the GPAC configuration help  
- net: print network interfaces  
- prompt: print the GPAC prompt help when running in interactive mode (see [-k](gpac_general/#k) )  
- modules: print available modules  
- module NAME: print info and options of module `NAME`  
- creds: print credential help  
- filters: print name of all available filters  
- filters:*: print name of all available filters, including meta filters  
- codecs: print the supported builtin codecs - use `-hx` to include unmapped codecs (ffmpeg, ...)  
- formats: print the supported formats (`-ha`: print filter names, `-hx`: include meta filters (ffmpeg,...), `-hh`: print mime types)  
- protocols: print the supported protocol schemes (`-ha`: print filter names, `-hx`: include meta filters (ffmpeg,...), `-hh`: print all)  
- props: print the supported builtin PID and packet properties  
- props PNAME: print the supported builtin PID and packet properties mentioning `PNAME`  
- colors: print the builtin color names and their values  
- layouts: print the builtin CICP audio channel layout names and their values  
- links: print possible connections between each supported filters (use -hx to view src->dst cap bundle detail)  
- links FNAME: print sources and sinks for filter `FNAME` (either builtin or JS filter)  
- defer: print defer mode help  
- FNAME: print filter `FNAME` info (multiple FNAME can be given)  

    - For meta-filters, use `FNAME:INST`, e.g. `ffavin:avfoundation`  
    - Use `*` to print info on all filters (_big output!_), `*:*` to print info on all filters including meta filter instances (_really big output!_)  
    - By default only basic filter options and description are shown. Use `-ha` to show advanced options capabilities, `-hx` for expert options, `-hh` for all options and filter capabilities including on filters disabled in this build  

- FNAME.OPT: print option `OPT` in filter `FNAME`  
- OPT: look in filter names and options for `OPT` and suggest possible matches if none found. Use `-hx` to look for keyword in all option descriptions  
  
</div>
  
<div markdown class="option">
<a id="p">__-p__</a> (string): use indicated profile for the global GPAC config. If not found, config file is created. If a file path is indicated, this will load profile from that file. Otherwise, this will create a directory of the specified name and store new config there. The following reserved names create a temporary profile (not stored on disk):  

- 0: full profile  
- n: null profile disabling shared modules/filters and system paths in config (may break GUI and other filters)  

Appending `:reload` to the profile name will force recreating a new configuration file  
</div>
  
<div markdown class="option">
<a id="alias">__-alias__</a> (string): assign a new alias or remove an alias. Can be specified several times. See [alias usage (-h alias)](#using-aliases)  
</div>
<div markdown class="option">
<a id="aliasdoc">__-aliasdoc__</a> (string): assign documentation for a given alias (optional). Can be specified several times  
</div>
<div markdown class="option">
<a id="cache-info">__-cache-info__</a>: show cache info. Argument can be:  

- absent: the entire cache is inspected  
- B: filter entries created after `B`, with `B` a number of seconds prior to now or a date (0 means now)  
- B;C: filter entries created after `B` but before `C`, with `B` and `C` either a number of seconds prior to now or a date  

    - If `B` is 0, min time is UTC=0  
    - If `C` is 0, max time is now  

The argument syntax is the same for all cache options  
</div>
  
<div markdown class="option">
<a id="cache-unflat">__-cache-unflat__</a>: revert all items in GPAC cache directory to their original name and server path  
</div>
<div markdown class="option">
<a id="cache-list">__-cache-list__</a>: list entries in cache  
</div>
<div markdown class="option">
<a id="cache-clean">__-cache-clean__</a> (int): clean cache  
</div>
<div markdown class="option">
<a id="js">__-js__</a> (string): specify javascript file to use as controller of filter session  
</div>
<div markdown class="option">
<a id="wc">__-wc__</a>:        write all core options in the config file unless already set  
</div>
<div markdown class="option">
<a id="we">__-we__</a>:        write all file extensions in the config file unless already set (useful to change some default file extensions)  
</div>
<div markdown class="option">
<a id="wf">__-wf__</a>:        write all filter options in the config file unless already set  
</div>
<div markdown class="option">
<a id="wfx">__-wfx__</a>:      write all filter options and all meta filter arguments in the config file unless already set (_large config file !_)  
</div>
<div markdown class="option">
<a id="xopt">__-xopt__</a>:    unrecognized options and filters declaration following this option are ignored - used to pass arguments to GUI  
</div>
  
<div markdown class="option">
<a id="creds">__-creds__</a> (string): setup credentials as used by servers  
</div>
<div markdown class="option">
<a id="rv">__-rv__</a>:        return absolute value of GPAC internal error instead of 1 when error  
</div>
  
    
The following libgpac core options allow customizing the filter session:  
    
<div markdown class="option">
<a id="dbg-edges">__-dbg-edges__</a>: log edges status in filter graph before dijkstra resolution (for debug). Edges are logged as edge_source(status(disable_depth), weight, src_cap_idx -> dst_cap_idx)  
</div>
<div markdown class="option">
<a id="full-link">__-full-link__</a>: throw error if any PID in the filter graph cannot be linked  
</div>
<div markdown class="option">
<a id="no-dynf">__-no-dynf__</a>: disable dynamically loaded filters  
</div>
<div markdown class="option">
<a id="no-block">__-no-block__</a> (Enum, default: __no__): disable blocking mode of filters  

- no: enable blocking mode  
- fanout: disable blocking on fan-out, unblocking the PID as soon as one of its destinations requires a packet  
- all: disable blocking  
</div>
  
<div markdown class="option">
<a id="no-reg">__-no-reg__</a>: disable regulation (no sleep) in session  
</div>
<div markdown class="option">
<a id="no-reassign">__-no-reassign__</a>: disable source filter reassignment in PID graph resolution  
</div>
<div markdown class="option">
<a id="sched">__-sched__</a> (Enum, default: __free__): set scheduler mode  

- free: lock-free queues except for task list (default)  
- lock: mutexes for queues when several threads  
- freex: lock-free queues including for task lists (experimental)  
- flock: mutexes for queues even when no thread (debug mode)  
- direct: no threads and direct dispatch of tasks whenever possible (debug mode)  
</div>
  
<div markdown class="option">
<a id="max-chain">__-max-chain__</a> (int, default: __6__): set maximum chain length when resolving filter links. Default value covers for _[ in -> ] dmx -> reframe -> decode -> encode -> reframe -> mx [ -> out]_. Filter chains loaded for adaptation (e.g. pixel format change) are loaded after the link resolution. Setting the value to 0 disables dynamic link resolution. You will have to specify the entire chain manually  
</div>
<div markdown class="option">
<a id="max-sleep">__-max-sleep__</a> (int, default: __50__): set maximum sleep time slot in milliseconds when regulation is enabled  
</div>
<div markdown class="option">
<a id="step-link">__-step-link__</a>: load filters one by one when solvink a link instead of loading all filters for the solved path  
</div>
<div markdown class="option">
<a id="threads">__-threads__</a> (int): set N extra thread for the session. -1 means use all available cores  
</div>
<div markdown class="option">
<a id="no-probe">__-no-probe__</a>: disable data probing on sources and relies on extension (faster load but more error-prone)  
</div>
<div markdown class="option">
<a id="no-argchk">__-no-argchk__</a>: disable tracking of argument usage (all arguments will be considered as used)  
</div>
<div markdown class="option">
<a id="blacklist">__-blacklist__</a> (string): blacklist the filters listed in the given string (comma-separated list). If first character is '-', this is a whitelist, i.e. only filters listed in the given string will be allowed  
</div>
<div markdown class="option">
<a id="no-graph-cache">__-no-graph-cache__</a>: disable internal caching of filter graph connections. If disabled, the graph will be recomputed at each link resolution (lower memory usage but slower)  
</div>
<div markdown class="option">
<a id="no-reservoir">__-no-reservoir__</a>: disable memory recycling for packets and properties. This uses much less memory but stresses the system memory allocator much more  
</div>
<div markdown class="option">
<a id="buffer-gen">__-buffer-gen__</a> (int, default: __1000__): default buffer size in microseconds for generic pids  
</div>
<div markdown class="option">
<a id="buffer-dec">__-buffer-dec__</a> (int, default: __1000000__): default buffer size in microseconds for decoder input pids  
</div>
<div markdown class="option">
<a id="buffer-units">__-buffer-units__</a> (int, default: __1__): default buffer size in frames when timing is not available  
</div>
<div markdown class="option">
<a id="check-props">__-check-props__</a>: check known property types upon assignment and PID vs packet types upon fetch (in test mode, exit with error code 5 if mismatch)  
</div>
# Using Aliases
The gpac command line can become quite complex when many sources or filters are used. In order to simplify this, an alias system is provided.  
  
To assign an alias, use the syntax `gpac -alias="NAME VALUE"`.  

- `NAME`: shall be a single string, with no space.  
- `VALUE`: the list of argument this alias replaces. If not set, the alias is destroyed  

  
When parsing arguments, the alias will be replace by its value.  
Example
```
gpac -alias="output aout vout"
```
  
This allows later audio and video playback using `gpac -i src.mp4 output`  
  
Aliases can use arguments from the command line. The allowed syntaxes are:  

- `@{a}`: replaced by the value of the argument with index `a` after the alias  
- `@{a,b}`: replaced by the value of the arguments with index `a` and `b`  
- `@{a:b}`: replaced by the value of the arguments between index `a` and `b`  
- `@{-a,b}`: replaced by the value of the arguments with index `a` and `b`, inserting a list separator (comma by default) between them  
- `@{-a:b}`: replaced by the value of the arguments between index `a` and `b`, inserting a list separator (comma by default) between them  
- `@{+a,b}`: clones the parent word in the alias for `a` and `b`, replacing this pattern in each clone by the corresponding argument  
- `@{+a:b}`: clones the parent word in the alias for each argument between index `a` and `b`, replacing this pattern in each clone by the corresponding argument  

  
The specified index can be:  

- forward index: a strictly positive integer, 1 being the first argument after the alias  
- backward index: the value 'n' (or 'N') to indicate the last argument on the command line. This can be followed by `-x` to rewind arguments (e.g. `@{n-1}` is the before last argument)  

  
Before solving aliases, all option arguments are moved at the beginning of the command line. This implies that alias arguments cannot be options.  
Arguments not used by any aliases are kept on the command line, other ones are removed  
  
Example
```
-alias="foo src=@{N} dst=test.mp4"
```
  
The command `gpac foo f1 f2` expands to `gpac src=f2 dst=test.mp4 f1`  
Example
```
-alias="list: inspect src=@{+:N}"
```
  
The command `gpac list f1 f2 f3` expands to `gpac inspect src=f1 src=f2 src=f3`  
Example
```
-alias="list inspect src=@{+2:N}"
```
  
The command `gpac list f1 f2 f3` expands to `gpac inspect src=f2 src=f3 f1`  
Example
```
-alias="plist aout vout flist:srcs=@{-,N}"
```
  
The command `gpac plist f1 f2 f3` expands to `gpac aout vout flist:srcs="f1,f2,f3"`    
  
Alias documentation can be set using `gpac -aliasdoc="NAME VALUE"`, with `NAME` the alias name and `VALUE` the documentation.  
Alias documentation will then appear in gpac help.  
  

# User Credentials  
  
Some servers in GPAC can use user-based and group-based authentication.  
The information is stored by default in the file `users.cfg` located in the GPAC profile directory.  
The file can be overwritten using the [-users](core_options/#users) option.  
  
By default, this file does not exist until at least one user has been configured.  
  
The [creds](#creds) option allows inspecting or modifying the users and groups information. The syntax for the option value is:  

- `show` or no value: prints the `users.cfg` file  
- `reset`: deletes the `users.cfg` file (i.e. deletes all users and groups)  
- `NAME`: show information of user `NAME`  
- `+NAME`: adds user `NAME`  
- `+NAME:I1=V1[,I2=V2]`: sets info `I1` with value `V1` to user `NAME`. The info name `password` resets password without prompt.  
- `-NAME`: removes user `NAME`  
- `_NAME`: force password change of user `NAME`  
- `@NAME`: show information of group `NAME`  
- `@+NAME[:u1[,u2]]`: adds group `NAME` if not existing and adds specified users to group  
- `@-NAME:u1[,u2]`: removes specified users from group `NAME`  
- `@-NAME`: removes group `NAME`  

  
By default all added users are members of the group `users`.  
Passwords are not stored, only a SHA256 hash is stored.  
  
Servers using authentication rules can use a configuration file instead of a directory name.  
This configuration file is organized in sections, each section name describing a directory.  
Example
```
[somedir]  
ru=foo  
rg=bar
```
  
  
The following keys are defined per directory, but may be ignored by the server depending on its operation mode:  

- ru: comma-separated list of user names with read access to the directory  
- rg: comma-separated list of group names with read access to the directory  
- wu: comma-separated list of user names with write access to the directory  
- wg: comma-separated list of group names with write access to the directory  
- mcast: comma-separated list of user names with multicast creation rights (RTSP server only)  
- filters: comma-separated list of filter names for which the directory is valid. If not found or `all`, applies to all filters  

  
Rights can be configured on sub-directories by adding sections for the desired directories.  
Example
```
[d1]  
rg=bar  
[d1/d2]  
ru=foo
```
  
With this configuration:  

- the directory `d1` will be readable by all members of group `bar`  
- the directory `d1/d2` will be readable by user `foo` only  

  
Servers in GPAC currently only support the `Basic` HTTP authentication scheme, and should preferably be run over TLS.  

# Defer test mode  
  
This mode can be used to test loading filters one by one and asking for link resolution explicitly.  
This is mostly used to reproduce how sessions are build in more complex applications.  
  
The options `rl`, `pi`, `pl` and `pd` allow addressing a filter by index `F` in a list.  

- if the option is suffixed with an `x` (e.g. `rlx=`), `F=0` means the last filter in the list of filters in the session  
- otherwise, `F=0` means the last filter declared before the option  

  
The relink options `-rl` and `-rlx` always flush the session (run until no more tasks are scheduled).  
The last run can be omitted.  
  
Example
```
gpac -dl -np -i SRC reframer -g -rl -g inspect -g -rl
```
  
This will load SRC and reframer, print the graph (no connection), relink SRC, print the graph (connection to reframer), insert inspect, print the graph (no connection), relink reframer and run. No play event is sent here.  
Example
```
gpac -dl -np -i SRC reframer inspect:deep -g -rl=2 -g -rl -se
```
  
This will load SRC, reframer and inspect, print the graph (no connection), relink SRC, print the graph (connection to reframer), print the graph (no connection), relink reframer, send play and run.  
  
Linking can be done once filters are loaded, using the syntax `@F@SRC` or `@@F@SRC`:  

- `@F` indicates the destination filter using a 0-based index `F` starting from the last laoded filter, e.g. `@0` indicates the last loaded filter.  
- `@@F` indicates the target filter using a 0-based index `F` starting from the first laoded filter, e.g. `@@1` indicates the second loaded filter.  
- `@SRC`or `@@SRC`: same syntax as link directives  

Sources MUST be set before relinking outputs using (-rl)[].  
Example
```
gpac -dl -i SRC F1 F2 [...] @1@2 @0@2
```
  
This will set SRC as source to F1 and SRC as source to F2 after loading all filters.  
  
The following options are used in defer mode:  
  
<div markdown class="option">
<a id="dl">__-dl__</a>:        enable defer linking mode for step-by-step graph building tests  
</div>
<div markdown class="option">
<a id="np">__-np__</a>:        prevent play event from sinks  
</div>
<div markdown class="option">
<a id="rl[=F]">__-rl[=F]__</a> (string): relink outputs of filter `F` (default 1)  
</div>
<div markdown class="option">
<a id="wl[=F]">__-wl[=F]__</a> (string): same as `-rl` but does not flush session)  
</div>
<div markdown class="option">
<a id="pi=[+|-][F[:i]]">__-pi=[+|-][F[:i]]__</a> (string): print PID properties (all or of index `i`) of filter `F` (default 0)  

- if prefixed with `-`: only list PIDs  
- if prefixed with `+`: also print PID info  
</div>
  
<div markdown class="option">
<a id="pl=[+][F[:i]]@NAME">__-pl=[+][F[:i]]@NAME__</a> (string): probe filter chain from filter `F` (default 0) to the given filter `NAME`:  

- if prefixed with `+`: print all known chains and their priorities  
</div>
  
<div markdown class="option">
<a id="pd=[F[:i]]">__-pd=[F[:i]]__</a> (string): print possible PID destinations (all or of index `i`) of filter `F` (default 0)  
</div>
<div markdown class="option">
<a id="f">__-f__</a>:          flush session until no more tasks  
</div>
<div markdown class="option">
<a id="g">__-g__</a>:          print graph  
</div>
<div markdown class="option">
<a id="s">__-s__</a>:          print stats  
</div>
<div markdown class="option">
<a id="se">__-se__</a>:        send PLAY event from sinks (only done once)  
</div>
<div markdown class="option">
<a id="m">__-m__</a> (string): print message  
</div>
