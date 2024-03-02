
## Build MP4Box with Visual Studio

We published a minimal solution to build MP4Box.exe only, with zero dependency. No DLL to distribute.

You need Visual Studio 2010 or more recent (a pop-up will ask you to upgrade your projects, just accept). Open [build/msvc10/gpac\_mp4box\_mini.sln](https://github.com/gpac/gpac/blob/master/build/msvc10/gpac_mp4box_mini.sln) and build (Debug or Release).

That's all!

## Build MP4Box with Make

On your system, you need the following tools installed on your system:

*   git
*   gcc
*   make
*   libpthread-dev (should be available on any development system)

In your favorite terminal, type:

```
git clone https://github.com/gpac/gpac.git
cd gpac
./configure --static-mp4box --use-zlib=no
make -j4
```

_Note_

`--use-zlib` is optional, specify it only if you don't want support for zlib (compressed boxes, compressed files, ...).

To execute MP4Box, assuming you are still in the same directory (i.e. the [root of the GPAC repository](https://github.com/gpac/gpac)), you will find the MP4Box executable at:

```
bin/gcc/MP4Box
```

To install MP4Box on your system:

```
sudo make install
```

### Check installation

now when you type

```
which MP4Box
```

you should see

```
/usr/local/bin/MP4Box
```

which is the default install folder for the version we have just built. You can tweak this with the `-prefix=` configure option.

If you see `/usr/bin/MP4Box` (no "local/" in here), uninstall GPAC from your local packager. On MacOS, go to Finder and unmount the app on the left panel, or uninstall it from your package manager ('port' or 'homebrew' or 'fink').

### Update to a newer revision

Of course you want to keep updated with the latest build without having to download the full repository again or re-execute the configuration when not necessary (it may be necessary sometimes, see below "Clean your build" if things go unexpectedly):

```
cd gpac
git pull
make -j4
sudo make install
```

That's all!

### Clean your build

If things go wrong and you suspect there is an issue in your configuration, the fastest way to restart a clean build is:

```
cd gpac
make distclean
./configure --static-mp4box --use-zlib=no
make -j4
```

### Cross-compilation

Cross-compiling GPAC is quite standard, and requires only a modification at the 'configure' step. Use `--extra-cflags=` and `--extra-ldflags=` to add your environment flags:

```
cd gpac
./configure --target-os=$OS --cross-prefix="$crossPrefix" --extra-cflags="-I$PREFIX/$host/include" --extra-ldflags="-L$PREFIX/$host/lib" --prefix=$PREFIX/$host --static-mp4box --use-zlib=no
make -j4
```

For example, to use the 'x86\_64-w64-mingw32' toolchain to cross-build from Linux to Windows:

```
cd gpac
./configure --target-os=mingw32 --cross-prefix=x86_64-w64-mingw32- --prefix=build/x86_64-w64-mingw32 --static-mp4box --use-zlib=no --extra-cflags="-Ibuild/x86_64-w64-mingw32/include" --extra-ldflags="-Lbuild/x86_64-w64-mingw32/lib"
make -j4
```

You can find more examples in [our TravisCI script](https://github.com/gpac/gpac/blob/master/.travis.yml).

## Next Step

We have started [a multimedia component-level build system called Zenbuild](https://github.com/gpac/zenbuild). Zenbuild builds FFmpeg/libav, VLC or GPAC with most of their features enabled (librtmp, jack, openHEVC, etc.). You can start using Zenbuild, it is fully operational!

