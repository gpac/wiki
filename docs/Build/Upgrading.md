# In source tree building {: data-level="all" }
If you build GPAC directly in the source tree (i.e., running `./configure && make` in the same directory as the configure script), the following steps must be done when upgrading your code base to a new version of GPAC, or when switching branches:

- uninstall any previous version of GPAC (optional, the build system as of 1.0 is independent from the presence of any other version of libgpac headers on the system)

`make uninstall`
 
- clean all dependencies and obj files - this will remove any local build files (dep, obj) and configuration file (config.mak, config.log ...) 

`make distclean`

- reconfigure 

`./configure`

- build

`make -j`

# Out of source tree building

To avoid the issue of cleaning dependencies, it is safer to have one dedicated build directory for each branch you test:

-  `mkdir bin/master && cd bin/master && ../../configure && make -j`
-  `mkdir bin/somebranch && cd bin/master && git checkout somebranch && ../../configure && make -j`

By doing so, you don't need to cleanup or reconfigure when changing branches:

```
cd bin/master && git checkout master && git pull && make -j
cd bin/somebranch && git checkout somebranch && git pull && make -j
```

You may however need to re-run the configure script in case the build system was modified after a git pull, but this is not very frequent (and usually the build will fail in that case).
