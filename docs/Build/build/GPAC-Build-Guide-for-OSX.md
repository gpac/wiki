Since the OSX build is essentially the same as the Linux build, this doc will be succinct. Please refer to the [Linux build guide](GPAC-Build-Guide-for-Linux) for further details. 


# MP4Box only

Same as Linux:

```bash
git clone https://github.com/gpac/gpac.git gpac_public
cd gpac_public
./configure --static-bin
make
sudo make install
```

# Full build

## Set up 

1. Install [Homebrew](https://brew.sh/)

2. Install tools

```bash
brew install cmake scons coreutils gettext yasm git wget pkg-config
```

3. Install dependencies

```bash
brew install freetype jpeg libpng openjpeg mad faad2 libogg libvorbis theora a52dec ffmpeg x264 aom xvid openssl@1.1 sdl2 libcaca kvazaar
```


<hr>

***For older MacOS versions***: if Homebrew is unavailable, the same can be achieved with [MacPorts](https://www.macports.org/) with the following packages

```bash
# install build tools
sudo port -N install cmake scons coreutils gtime gettext yasm wget pkgconfig

# install dependencies 
sudo port -N install freetype jpeg libpng openjpeg libmad faad2 libogg libvorbis libtheora a52dec ffmpeg6 x264 aom xvid openssl libsdl2
```

<hr>

**Note:** you can remove packages from this list if you don't need a particular feature, the `configure` script should pick-up what's available on your system and build accordingly. 

## Get code

```bash
git clone https://github.com/gpac/gpac.git gpac_public

git clone https://github.com/gpac/deps_unix
cd deps_unix
git submodule update --init --recursive --force --checkout
```

## Build dependencies

```bash
deps_unix$ ./build_all.sh osx
```

If all went well, you should see something like this in the main repository: 

```bash
mojave:deps_unix adavid$ ll ../gpac_public/extra_lib/lib/gcc/
total 42784
-rw-r--r--  1 adavid  staff   2.9M Apr  2 14:43 libNeptune.a
-rw-r--r--  1 adavid  staff   890K Apr  2 15:47 libOpenSVCDec.a
-rw-r--r--  1 adavid  staff   4.1M Apr  2 14:43 libPlatinum.a
-rw-r--r--  1 adavid  staff   383K Apr  2 14:43 libPltMediaConnect.a
-rw-r--r--  1 adavid  staff   530K Apr  2 14:43 libPltMediaRenderer.a
-rw-r--r--  1 adavid  staff   1.5M Apr  2 14:43 libPltMediaServer.a
-rw-r--r--  1 adavid  staff   192K Apr  2 14:43 libZlib.a
-rw-r--r--  1 adavid  staff   259K Apr  2 14:43 libaxTLS.a
-rw-r--r--  1 adavid  staff   3.3M Apr  2 15:15 libjs.a
-rw-r--r--  1 adavid  staff   4.3M Apr  2 15:50 libopenhevc.a
-rw-r--r--  1 adavid  staff   166K Apr  2 15:50 libopenjpeg.a
```

_(contents and versions may differ depending on updates and deprecated features)_

## Build gpac

```
cd ../gpac_public
./configure --extra-cflags=-Wno-deprecated
make
sudo make install
```

## Packaging

To make an installable package, use `make dmg`. 
