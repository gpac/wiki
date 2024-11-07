---
tags:
- input
- data
- source
---



_The following is the guide to build GPAC on Windows using MSYS2 and the MinGW gcc toolchain. It is a bit clunky and will probably only work on x64 and without cross-compilation._

# Setting up {: data-level="all"}

## MSYS

First install MSYS2 x86_64 version from https://www.msys2.org/.

After installation, launch the msys2 terminal and update the packages with 

```
pacman -Syuu
```

If it's a first install you will probably have to close the terminal, relaunch it and execute the pacman command again. 

## Toolchain

We need to install some development tools : 

```
pacman -S base-devel --needed
pacman -S vim git yasm mercurial subversion

pacman -S mingw-w64-x86_64-toolchain
pacman -R cmake
pacman -S mingw64/mingw-w64-x86_64-cmake
```

## Hacks

From this point on, every command needs to be run in the **`MSYS2 MinGW 64-bit`** terminal (and **not** in the `MSYS2 MSYS` terminal)

For the build scripts to run properly we need some small hacks for commands that don't have the correct name, etc.:

```
cp /mingw64/bin/ar /mingw64/bin/x86_64-w64-mingw32-ar
cp /mingw64/bin/ranlib /mingw64/bin/x86_64-w64-mingw32-ranlib

cat > /mingw64/bin/x86_64-w64-mingw32-windres << 'EOF'
#!/bin/sh
/mingw64/bin/windres "$@"
EOF
```

# Building GPAC

## Get the source

In a common directory, clone the two repositories:

```
git clone https://github.com/gpac/gpac.git
git clone https://github.com/gpac/deps_mingw.git
```

To reiterate, from this point on every command needs to be run in the **`MSYS2 MinGW 64-bit`** terminal (and **not** in the `MSYS2 MSYS` terminal)

## Build the dependencies

In the deps_mingw directory start by getting the submodule. 

```
deps_mingw $  git submodule update --init 
```

And then launch the dependencies build script, point the first argument to the gpac source dir cloned before: 

```
deps_mingw $  ./buildAndCopy.sh ../gpac
```

...now go grab a cup of coffee, and after a while, hopefully, all the dependencies should be built and copied in the right place in the gpac directory. 

In the gpac dir, it should look something like this: 

```
gpac $ ls extra_lib/lib/gcc/
avcodec-58.def       libfreetype.dll.a        libpng12.dll.a       libvorbis.dll.a
avdevice-58.def      libfreetype.la           libpng12.la          libvorbis.la
avfilter-7.def       libjpeg.a                libpostproc.dll.a    libvorbisenc.a
avformat-58.def      libjs.a                  libpthread.a         libvorbisenc.dll.a
avutil-56.def        libmad.a                 libpthread.dll.a     libvorbisenc.la
cmake                libmad.la                librtmp.a            libvorbisfile.a
engines-1_1          libNeptune.a             librtmp.dll.a        libvorbisfile.dll.a
fontconfig.def       libogg.a                 libSDL2.a            libvorbisfile.la
liba52.dll.a         libogg.dll.a             libSDL2.dll.a        libwinpthread.a
liba52.la            libogg.la                libSDL2.la           libwinpthread.dll.a
libaom.a             libopencore-amrnb.a      libSDL2_test.a       libwinpthread.la
libavcodec.dll.a     libopencore-amrnb.dll.a  libSDL2_test.la      libx264.a
libavdevice.dll.a    libopencore-amrnb.la     libSDL2main.a        libz.a
libavfilter.dll.a    libopencore-amrwb.a      libSDL2main.la       libz.so
libavformat.dll.a    libopencore-amrwb.dll.a  libssl.a             libz.so.1
libavutil.dll.a      libopencore-amrwb.la     libssl.dll.a         libz.so.1.2.11
libaxTLS.a           libopenhevc.a            libswresample.dll.a  libZlib.a
libcrypto.a          libopenjpeg.a            libswscale.dll.a     pkgconfig
libcrypto.dll.a      libOpenSVCDec.a          libtheora.dll.a      postproc-55.def
libexpat.dll.a       libPlatinum.a            libtheora.la         swresample-3.def
libexpat.la          libPltMediaConnect.a     libtheoradec.dll.a   swscale-5.def
libfaad.a            libPltMediaRenderer.a    libtheoradec.la      xvidcore.a
libfaad.la           libPltMediaServer.a      libtheoraenc.a       xvidcore.dll.a
libfontconfig.dll.a  libpng.dll.a             libtheoraenc.la
libfontconfig.la     libpng.la                libvorbis.a


gpac $ ls bin/gcc/
avcodec-58.dll         libfontconfig-1.dll      librtmp-1.dll        postproc-55.dll
avdevice-58.dll        libfreetype-6.dll        libssl-1_1-x64.dll   SDL2.dll
avfilter-7.dll         libogg-0.dll             libtheora-0.dll      swresample-3.dll
avformat-58.dll        libopencore-amrnb-0.dll  libtheoradec-1.dll   swscale-5.dll
avutil-56.dll          libopencore-amrwb-0.dll  libvorbis-0.dll      xvidcore.dll
liba52-0.dll           libpng12-0.dll           libvorbisenc-2.dll
libcrypto-1_1-x64.dll  libpng-3.dll             libvorbisfile-3.dll
libexpat-1.dll         librtmp.dll              libwinpthread-1.dll
```

_(contents and versions may differ depending on updates and deprecated features)_

You can pick and choose which dependency will be built by editing the file `deps_mingw/zenbuild/zen-gpacdeps.sh` and removing lines in the `gpacdeps_get_deps` function.

## Build GPAC

If the dependencies have built successfully, we can now build gpac. 

The following is a configure command that should work in this particular set up and tries to enable the most features, but you can tweak it to suit your needs and the dependencies you have actually built. 

```
gpac $ ./configure  --extra-ldflags=' -static-libstdc++ -static-libgcc ' --disable-lzma --use-zlib=local --sdl-cfg=../deps_mingw/zenbuild/build/release/x86_64-w64-mingw32/bin
```

and then finally: 

```
gpac $ make -j4
```

The binaries will be in `gpac/bin/gcc/`, you can either `make install`, or adjust your `PATH` and `LD_LIBRARY_PATH` variables to use them for there. 
