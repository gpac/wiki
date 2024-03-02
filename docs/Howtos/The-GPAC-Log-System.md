# Introduction

A log is a way of keeping record of what's happening when executing a software. The GPAC framework has log capabilities to analyze what is going on when running MP4Box, gpac or other libgpac based applications.

This article explains the features of the log system and how to use it. For more information on latest syntax and options, [check here](core_logs).

# Overview

The GPAC log system is based on two orthogonal concepts:

*   **tools**: the category of the log you want to listen to. For instance when playing a MPEG-TS file, you may want to hear about the container log; when player remote content, you may want to hear about the network log; when trying to find a deadlock (but there are obviously none in GPAC ;), you may want to hear about the mutex log. The complete list is provided [here](core_logs).

*   **levels**: the deepness of the log. You have to choose whether you want to know about errors only, or about any thing the developer thought right to signal for fellow developers.

> **/!\\ In GPAC, you can choose which tools you want to hear, and for each tool you can set a level.**

The general syntax is:

```
-logs log_args: sets log tools and levels, formatted as a ':'-separated list of toolX[:toolZ]@levelX
```

Concrete examples are given further in this article.

# Example of available Tools

- GF_LOG_CORE      (core)     : log message from the core library (init, threads, network calls, etc)
- GF_LOG_FILTERS    (filters) : log message from the filter session
- GF_LOG_CONTAINER (container): log message from a bitstream parser (IsoMedia, MPEG-2 TS, OGG, ...)
- GF_LOG_NETWORK   (network)  : log message from the network/service stack (messages & co)
- GF_LOG_RTP       (rtp)      : log message from the RTP/RTCP stack (TS info) and packet structure & hinting (debug)
- GF_LOG_AUTHOR    (author)   : log message from authoring subsystem (file manipulation, import/export)
- GF_LOG_CODEC     (codec)    : log message from a codec
- GF_LOG_PARSER    (parser)   : log message from any XML parser (context loading, etc)
- GF_LOG_COMPOSE   (compose)  : log message from compositor related to object drawing
- GF_LOG_MEDIA     (media)    : log message from the compositor related to media object playback
- GF_LOG_AUDIO     (audio)    : log message related to audio playback compositor
- GF_LOG_SCENE     (scene)    : log message from the scene graph/scene_manager (nodes and attribute modification, events)
- GF_LOG_MMIO      (mmio)     : log message from multimedia I/O devices (audio/video input/output, ...)
- GF_LOG_SCRIPT    (script)   : log message from the scripting engine bindings execution (not from scripts)
- GF_LOG_CONSOLE   (console)  : log for all messages coming from script alert() and print()
- GF_LOG_APP       (app)      : log message for apps (MP4Box, gpac)
- GF_LOG_ALL       (all)      : all available logs


# Available Levels

- GF_LOG_QUIET   (quiet)  : disable all Log message
- GF_LOG_ERROR   (error)  : log message describes an error
- GF_LOG_WARNING (warning): log message describes a warning
- GF_LOG_INFO    (info)   : log message is informational (state, etc..)
- GF_LOG_DEBUG   (debug)  : log message is a debug info


**/!\\ Note** that these levels apply to GPAC, not to the content being processed. For instance `GF_LOG_ERROR` is intended to signal GPAC has encountered a serious error. On the contrary, if you read an MPEG-TS files containing some errors that are correctly handled by GPAC, you should use the `GF_LOG_WARNING` channel.

# Setting the log

This section explains to the GPAC users the features of the default log implementation within the tools. If you're a developer you may also want to read the next section.

## Default values

**The default GPAC implementation sets all the messages on, to the "warning" level**. The only exception is the `GF_LOG_CONSOLE` being set to `info` so that messages output by the user can be seen (for example you asked to write a message from your script to help you debug it).

## Setting tools and levels in GPAC

Here is a screenshot of gpac playback executed with default logs:

![](https://gpac.io/files/2011/08/capture_log1.png)

In this example GPAC says a PID from the MPEG2-TS stream is not supported (and therefore won't be decoded).

GPAC apps features several options related to logging:

```
-logs=log_args: sets log tools and levels, formatted as a ':'-separated list of toolX[:toolZ]@levelX
```

Here is an example, which sets all messages to the `warning` level (default level for all tools) except `core`, `audio` and `mem` that are set to the `debug` level, and `container` and `sync` that are set to the `error` level:

```
-logs=core:audio:mem@debug:container:sync@error
```

Other log options are:

* `-strict-error`:  exit when the player reports its first error
* `-log-file=file`: sets output log file. Also works with -lf


## Choosing an output for logs

By default GPAC outputs its logs to stdout. However as you can see in the latest example from the previous section, GPAC applications feature a `-log-file` option:


* `-log-file=file`: sets output log file. Also works with `-lf`

This behavior is implemented by default in all applications in GPAC (MP4Box, gpac) and by any application forwarding their arguments to libgpac.

## Disabling color logs
By default logs are colorized when output on stdout. You can disable this by using the `ncl` log keyword, e.g. `-logs=ncl` or `-logs=ncl:container:sync@error`.

# How to use the log

This section gives some hints to the GPAC developers about ways to customize their log system.

## Calling the log

When you need to print a log message, call the `GF_LOG` macro as follows:

```c
GF_LOG(GF_LOG_LEVEL, GF_LOG_TOOL, (MESSAGE));
```

Where:

*   `GF_LOG_LEVEL` belongs to the level list above (`GF_LOG_QUIET`, ..., `GF_LOG_DEBUG`)
*   `GF_LOG_TOOL` belongs to the tool list above (`GF_LOG_CORE`, ..., `GF_LOG_CONSOLE`)
*   `(MESSAGE)`: a message contained between parentheses and with the same formatting as `printf`.

For example:

```c
GF_LOG(GF_LOG_INFO, GF_LOG_CONSOLE, ("%s %s\n", servName, evt->message.message));
```

## Implementation details

The code lies within the `src/utils/error.c` source file.

The log system used in the GPAC open-source framework outputs to stdout.

Check [libgpac doxygen](https://doxygen.gpac.io/group__log__grp.html) for available functions.

## Customizing your log

You simply need to call `gf_log_set_callback()` with your own log function. The type of the function is given as below:

```c
typedef void (*gf_log_cbk)(void *cbck, u32 log_level, u32 log_tool,
              const char* fmt, va_list vlist);
```

 

 
