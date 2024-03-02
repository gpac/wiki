_Preliminary notes: the following instructions will be based on Ubuntu and Debian. It should be easily applicable to other distributions, the only changes should be name of the packages to be installed, and the package manager used._

GPAC is a modular piece of software which depends on third-party libraries. During the build process it will try to detect and leverage the installed third-party libraries on your system. Here are the instructions to:
 * build GPAC easily (recommended for most users) from what's available on your system,
 * build a minimal 'MP4Box' and 'gpac' (only contains GPAC core features like muxing and streaming),
 * build a complete GPAC by rebuilding all the dependencies manually.

# General case for all builds

## Development tools

We first need to install some building tools: 

```bash
sudo apt install build-essential pkg-config g++ git cmake yasm
```

## Get the code

```bash
git clone https://github.com/gpac/gpac.git
cd gpac
```

## Build 

```bash
./configure
make
```

_To parallelize the build you can use the ```-j``` option of Make._

## Upgrade

```bash
git pull
make
```

If this fails, do ```make clean```.

If this fails again, reconfigure your GPAC with the same option as you previously did: ```./configure --xxx ...```. You can find these options at the top of your config.mak or config.h files (located in the folder where you call the ```configure``` script from).

_If you are upgrading from a previous version (especially going from below 1.0.0 to 1.0.0+) you should run `make uninstall ; make distclean` before running `./configure`._

## Use

You can either:
 -  `sudo make install` to install the binaries,
 - or use the `MP4Box` or `gpac` binary in `gpac_public/bin/gcc/` directly, 
 - or move/copy it somewhere manually.

# GPAC easy build (recommended for most users)

Install the development packages for the third-party libraries GPAC is able to leverage: 

```bash
sudo apt install zlib1g-dev libfreetype6-dev libjpeg62-dev libpng-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libavdevice-dev libnghttp2-dev libopenjp2-7-dev libcaca-dev libxv-dev x11proto-video-dev libgl1-mesa-dev libglu1-mesa-dev x11proto-gl-dev libxvidcore-dev libssl-dev libjack-jackd2-dev libasound2-dev libpulse-dev libsdl2-dev dvb-apps mesa-utils
```

This list should work on Ubuntu from 14.04 (`trusty`) to at least 22.04 (`jammy`). 

If you use Debian instead of Ubuntu, replace `libjpeg62-dev` with `libjpeg62-turbo-dev`. It should work at least from Debian 9 (`stretch`) to 12 (`bookworm`).

_[Also tested on **archlinux-2022.02.01-x86_64** with the following: `pacman -S zlib freetype2 libjpeg-turbo libpng libmad faad2 libogg libvorbis libtheora a52dec ffmpeg libxv mesa glu xvidcore openssl jack2 alsa-lib libpulse sdl2`]_

Once the packages are installed, you can follow the general build instructions from the previous section. 

# MP4Box & gpac only (minimal static build)

_This build is intended if you only need GPAC core features such as demuxing, muxing and streaming or if you need a static build._

To build only the MP4Box and gpac command line utilities, you need to: 

0. Install build tools

```bash
sudo apt install build-essential pkg-config git
```

1. Install zlib

```bash
sudo apt install zlib1g-dev
```

2. Get the code

```bash
git clone https://github.com/gpac/gpac.git gpac_public
cd gpac_public
```

3. Build

_If you are upgrading from a previous version (especially going from below 1.0.0 to 1.0.0+) you should run `make uninstall ; make distclean` before running `./configure`._

```bash
./configure --static-bin
make
```

4. Use

You can either:
 -  `sudo make install` to install the binaries,
 - or use the `MP4Box` or `gpac` binary in `gpac_public/bin/gcc/` directly, 
 - or move/copy it somewhere manually.


# Full GPAC build (advanced users)

In order to do a full build, we'll first have to handle the dependencies. On Linux, we try to rely on system dependencies (i.e. installable packages) as much as possible and only build the rest manually. 

## Building other dependencies

From now on, we'll call the base working directory `<GPAC_ROOT_DIR>`.

1. Get the code

```bash
<GPAC_ROOT_DIR>$ git clone https://github.com/gpac/gpac.git gpac_public

<GPAC_ROOT_DIR>$ git clone https://github.com/gpac/deps_unix
<GPAC_ROOT_DIR>$ cd deps_unix
<GPAC_ROOT_DIR>/deps_unix$ git submodule update --init --recursive --force --checkout
```

The convention of calling the main gpac repository `gpac_public` here is quite important for some scripts. If you don't you'll have to adapt the scripts in `deps_unix`. 

2. Build the dependencies

```bash
<GPAC_ROOT_DIR>/deps_unix$ ./build_all.sh linux
```

If all went well, you should see some libs have been copied over to the gpac repository. It should look something like this: 

```bash
<GPAC_ROOT_DIR>/deps_unix$ ls -l ../gpac_public/extra_lib/lib/gcc/
total 11240
-rw-r--r-- 1 u g   11820 Aug 23 16:31 libArithCoding.a
-rw-r--r-- 1 u g   72260 Aug 23 16:31 libcaption.a
-rw-r--r-- 1 u g  108734 Aug 23 16:31 libDRCdec.a
-rw-r--r-- 1 u g  129430 Aug 23 16:31 libFDK.a
-rw-r--r-- 1 u g  119624 Aug 23 16:31 libFormatConverter.a
-rw-r--r-- 1 u g  298372 Aug 23 16:31 libgVBAPRenderer.a
-rw-r--r-- 1 u g   52192 Aug 23 16:31 libIGFdec.a
-rw-r--r-- 1 u g  230002 Aug 23 16:31 libilo.a
-rw-r--r-- 1 u g 5416016 Aug 23 16:32 libmmtisobmff.a
-rw-r--r-- 1 u g  218566 Aug 23 16:32 libmmtisobmff_c.a
-rw-r--r-- 1 u g  270460 Aug 23 16:31 libMpeghDec.a
-rw-r--r-- 1 u g   22388 Aug 23 16:31 libMpeghUIMan.a
-rw-r--r-- 1 u g   98452 Aug 23 16:31 libMpegTPDec.a
-rw-r--r-- 1 u g 3431798 Aug 23 16:31 libopenhevc.a
-rw-r--r-- 1 u g  888206 Aug 23 16:29 libOpenSVCDec.a
-rw-r--r-- 1 u g   10514 Aug 23 16:31 libPCMutils.a
-rw-r--r-- 1 u g   33888 Aug 23 16:31 libSYS.a
-rw-r--r-- 1 u g   60078 Aug 23 16:31 libUIManager.a
```

(contents and versions may differ depending on updates and deprecated features)

## Building GPAC

Now that all the set up is done, we can build gpac by simply doing: 

```bash
<GPAC_ROOT_DIR>/gpac_public$ ./configure
<GPAC_ROOT_DIR>/gpac_public$ make
<GPAC_ROOT_DIR>/gpac_public$ sudo make install
```

_[on Arch Linux, use `./configure --prefix=/usr` since Arch doesn't use /usr/local by default]_

### Upgrading from a previous version

If you already have a gpac version installed, or if you have already built gpac in the same directory, **especially going from a version below 1.0.0 to 1.0.0 and after**, you should run

```bash
<GPAC_ROOT_DIR>/gpac_public$ make uninstall
<GPAC_ROOT_DIR>/gpac_public$ make distclean
```
**before** running `./configure`. 

### Install for developers

If you want to use GPAC for development (in your own code for example), you can use `make install-lib`. 

It will install the necessary libraries and header files. It will also install a `gpac.pc` file for `pkg-config`. With it you can easily build projects that use the gpac library with something like:

```sh
$ gcc -o example $(pkg-config --cflags gpac) example.c $(pkg-config --libs gpac)
```

### Packaging

To generate a .deb package, you can use `make deb`. 

You will probably have to install some packaging tools to run it:

```bash
sudo apt install fakeroot dpkg-dev devscripts debhelper ccache
```
