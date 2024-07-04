<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Configuration file  
  
GPAC uses a configuration file to modify default options of libgpac and filters. This file is called `GPAC.cfg` and is located:  

- on Windows platforms, in `C:\Users\FOO\AppData\Roaming\GPAC` or in `C:\Program Files\GPAC`.  
- on iOS platforms, in a .gpac folder in the app storage directory.  
- on Android platforms, in `/sdcard/GPAC/` if this directory exists, otherwise in `/data/data/io.gpac.gpac/GPAC`.  
- on other platforms, in a `$HOME/.gpac/`.  

  
Applications in GPAC can also specify a different configuration file through the [-p](gpac_general/#p) profile option. EX gpac -p=foo []  
This will load configuration from $HOME/.gpac/foo/GPAC.cfg, creating it if needed.  
The reserved name `0` is used to disable configuration file writing.  
  
The configuration file is structured in sections, each made of one or more keys:  

- section `foo` is declared as `[foo]\n`  
- key `bar` with value `N` is declared as `bar=N\n`. The key value `N` is not interpreted and always handled as ASCII text.  

  
By default the configuration file only holds a few system specific options and directories. It is possible to serialize the entire set of options to the configuration file, using [-wc](gpac_general/#wc) [-wf](gpac_general/#wf).  
This should be avoided as the resulting configuration file size will be quite large, hence larger memory usage for the applications.  
The options specified in the configuration file may be overridden by the values in _restrict.cfg_ file located in GPAC share system directory (e.g. `/usr/share/gpac` or `C:\Program Files\GPAC`), if present; this allows enforcing system-wide configuration values.  
_Note: The methods describe in this section apply to any application in GPAC transferring their arguments to libgpac. This is the case for _gpac_ and _MP4Box_._  
  
# Core options  
  
The options from libgpac core can also be assigned though the config file from section _core_ using option name __without initial dash__ as key name.  
Example
```
[core]  
threads=2
```  
Setting this in the config file is equivalent to using `-threads=2`.  
The options specified at prompt overrides the value of the config file.  

# Filter options in configuration  
  
It is possible to alter the default value of a filter option by modifying the configuration file. Filter _foo_ options are stored in section `[filter@foo]`, using option name and value as key-value pair. Options specified through the configuration file do not take precedence over options specified at prompt or through alias.  
Example
```
[filter@rtpin]  
interleave=yes
```  
This will force the rtp input filter to always request RTP over RTSP by default.  
To generate a configuration file with all filters options serialized, use [-wf](gpac_general/#wf).  

# Global filter options  
  
It is possible to specify options global to multiple filters using `--OPTNAME=VAL`. Global options do not override filter options but take precedence over options loaded from configuration file.  
This will set option `OPTNAME`, when present, to `VAL` in any loaded filter.  
Example
```
--buffer=100 -i file vout aout
```  
This is equivalent to specifying `vout:buffer=100 aout:buffer=100`.  
Example
```
--buffer=100 -i file vout aout:buffer=10
```  
This is equivalent to specifying `vout:buffer=100 aout:buffer=10`.  

__Warning: This syntax only applies to regular filter options. It cannot be used with builtin shortcuts (gfreg, enc, ...).__  
  
Meta-filter options can be set in the same way using the syntax `--OPT_NAME=VAL`.  
Example
```
--profile=Baseline -i file.cmp -o dump.264
```  
This is equivalent to specifying `-o dump.264:profile=Baseline`.  
    
For both syntaxes, it is possible to specify the filter registry name of the option, using `--FNAME:OPTNAME=VAL` or `--FNAME@OPTNAME=VAL`.  
In this case the option will only be set for filters which are instances of registry FNAME. This is used when several registries use same option names.  
Example
```
--flist@timescale=100 -i plist1 -i plist2 -o live.mpd
```  
This will set the timescale option on the playlists filters but not on the dasher filter.  
