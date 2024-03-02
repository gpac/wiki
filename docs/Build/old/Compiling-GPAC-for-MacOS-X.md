This page describes how to setup a complete build environment for GPAC using Macports (update: Brew command-line below tested on Mac OS 10.11) in order to generate DMG installer images for both 10.5 and 10.6 versions of MacOS X.

# Getting GPAC source code

Using a git client, checkout GPAC from the repository:

```
git clone https://github.com/gpac/gpac.git
``` 

# Configuring macports

## (Re-)Installing

If macports is installed, [uninstall it](http://guide.macports.org/chunked/installing.macports.uninstalling.html):

 ```
 sudo port -f uninstall installed
sudo rm -rf /opt/local /Applications/DarwinPorts /Applications/MacPorts /Library/LaunchDaemons/org.macports.* /Library/Receipts/DarwinPorts*.pkg /Library/Receipts/MacPorts*.pkg Library/StartupItems/DarwinPortsStartup /Library/Tcl/darwinports1.0 /Library/Tcl/macports1.0 ~/.macports
```
 
[Install macport](http://distfiles.macports.org/MacPorts/). You MUST install a version >=1.9.x

## Custom flags for OSX 10.5 and 10.6 compatibility

If you plan to generate GPAC binaries compatible with 10.5, add the following lines at the end of `/opt/local/etc/macports/macports.conf`:

```
macosx_deployment_target 10.4
sdkroot /Developer/SDKs/MacOSX10.5.sdk
```
 
This allows compiling a 10.5 binary with a 10.4 compatible dyld (dyn. loader). Furthermore, you will need to install the 10.5 development SDK. Such binaries should work on any 32 bits x86 versions of OS X.

## Custom flags for OSX 10.6 32 bits only

If you are on a 10.6 platform with default targeting to x86\_64 (i.e. x86\_64 compatible cpu, whatever is your kernel configuration), you still may want to generate i386 binaries. Uncomment the `build_arch i386` line of `/opt/local/etc/macports/macports.conf`. Also comment the `universal_archs` feature as MacPorts may end up in an unpredictable state and you won't be able to compile GPAC with most features:

```
build_arch i386
# CPU architectures to use for Universal Binaries (+universal variant)
#universal_archs i386 
```

# Installing GPAC extra libs

## MacPorts packages

To install a package, type:

```
sudo port install my_package_name
```
 
The command-line to install all the packages (compulsory and optional) can be found below in this chapter.

The zlib package is required to build GPAC.

To install all required packages, type:

```
sudo port install pkgconfig freetype libpng jpeg spidermonkey185 libsdl-devel ffmpeg faad2 libmad xvid libogg libvorbis libtheora a52dec openjpeg
``` 

**WARNING:** it is possible that some ports are not working for your system. In this case, you should get  the latest version of the source code of the package, and recompile it locally.

If you have configured macports to generate binaries compatible with 10.5, you must edit `/opt/local/bin/sdl-config` and replace the line below ` --cflags` with the following:
 `echo -I${prefix}/include/SDL -D_THREAD_SAFE -arch i386` 
If you want to cross-compile from a 64 bits environment to a 32 bits target, you may encounter [this bug](https://trac.macports.org/ticket/28935) with the ffmpeg package (old versions), or [this bug](https://trac.macports.org/ticket/30137) with newer ffmpeg versions.

## Brew packages

Alternately to Ports, you may want to use Brew:

```
brew install jpeg libpng faad2 sdl pkgconfig freetype libvorbis theora openjpeg libmad xvid libogg spidermonkey ffmpeg
```

## _Deprecated_ Setting up UPnP (Optional)

Install [Java developer package](http://developer.apple.com/java/download/) if your OSX version is > 10.6.3.

Install the Scons build system:
 `sudo port install scons` 

Get the platinum source code patched for gpac here: gpac.sourceforge.net/downloads/platinum\_sdk\_0.4.5.zip, and extract it.
Edit file `Platinum/Platinum/Build/Targets/universal-apple-macosx/Config.scons` as follows:

If building for 10.6 64bits, keep the following flags:

```
universal_flags = [('-arch', 'x86_64'), ('-isysroot', '/Developer/SDKs/MacOSX10.6.sdk'), '-mmacosx-version-min=10.6']
``` 

Otherwise, set the flags to:

```
universal_flags = [('-arch', 'i386'), ('-isysroot', '/Developer/SDKs/MacOSX10.5.sdk'), '-mmacosx-version-min=10.5']
``` 
 
Depending on your GCC version, you may need to edit the file `Platinum/Platinum/Build/Boot.scons` and replace the line

```
BoolVariable?('stop_on_warning', 'Stop the build on warnings', True),
```
 
with the following:

```
BoolVariable?('stop_on_warning', 'Stop the build on warnings', False),
``` 
then go to `Platinum/Platinum` and type:

```
scons
cp Build/Targets/universal-apple-macosx/Debug/*.a gpac/extra_lib/lib/gcc
```


## Setting up OpenSVCDecoder (Optional)

Get the latest GPAC [extra libs package](http://gpac.svn.sourceforge.net/viewvc/gpac/trunk/gpac_extra_libs/gpac_extra_libs.zip).

Unzip and go to `./opensvcdecoder`. Build using

```
cmake .
```

then copy the library to `/opt/local/lib` (or any place included in your link settings):
```
sudo cp ./CommonFiles/src/libOpenSVCDec.dylib /opt/local/lib
```

The OpenSVCDecoder in gpac\_extra\_libs package is version 1.11 (latest) patched for MSVC and OS X compilation.

# Building gpac

## Configure gpac

If you plan to generate GPAC binaries compatible with 10.5, type the following configure:

```
./configure --extra-cflags="-arch i386 -isysroot /Developer/SDKs/MacOSX10.5.sdk" --extra-ldflags="-mmacosx-version-min=10.4 -arch i386 -isysroot /Developer/SDKs/MacOSX10.5.sdk"
```
 
This allows compiling a 10.5 binary with a 10.4 compatible dyld (dynamic loader).

If you don't plan to generate GPAC binaries compatible with 10.5, type the following configure:
 `./configure` 

Build GPAC by typing
 `make` 

If you have setup UPnP, type
 `make -C modules/platinum` 

If you have setup OpenSVC decoder, type
 `make -C modules/opensvc_dec` 

## Installing gpac

If you want to generate a DMG package for GPAC, regardless of 10.5 compatibility, type
 `./mkdmg` 
or
 `make dmg` 

This will produce a file called `GPAC-$VERSION-r$REVISION.dmg`

If you want to install GPAC directly on your system, type
 `sudo make install` 

**NOTE: DO NOT RUN ./mkdmg AFTER make install, THE BINARIES WON'T BE USEABLE THROUGH THE DMG ARCHIVE. INSTEAD USE make dmg**

Now you deserve a coffee, enjoy it :)
