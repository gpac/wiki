# Introduction {: data-level="all"}

Starting from a fresh Ubuntu 10.10, Ubuntu 12.04 or Debian testing 6 (Wheezy), the following steps will provide you with a fully working GPAC.

## Get the source code

```
sudo apt-get install git
git clone https://github.com/gpac/gpac.git
```


## Get the dependencies

The instructions differ depending on the linux distribution.

### Ubuntu 10.10

```
sudo apt-get install zlib1g-dev xulrunner-1.9.2-dev libfreetype6-dev libjpeg62-dev libpng12-dev libopenjpeg-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libxv-dev x11proto-video-dev libgl1-mesa-dev x11proto-gl-dev linux-sound-base libxvidcore-dev libwxbase2.8-dev libwxgtk2.8-dev wx2.8-headers libssl-dev libjack-dev libasound2-dev libpulse-dev libsdl1.2-dev dvb-apps libavcodec-extra-53 libavdevice-dev
```

Modify the file `/etc/ld.so.conf` (you must be in the sudoers list), to help GPAC find Mozilla JavaScript dynamic library, by adding the line at the beginning of the file:

```
/usr/lib/xulrunner-1.9.2.16/
```

**Note:** Inserting the line at the end of the file may result in broken libxul dependencies since firefox 11 and the introduction of libssl3 in mozilla's build. 

**Note:** Ubuntu may update the xulrunner packages. Replace 1.9.2.16 by whatever your xulrunner version is.

### Ubuntu 11.10

Compared to Ubuntu 10.10, the xulrunner-dev package must be replaced by firefox-dev. Modify the file `/etc/ld.so.conf` setting

```
/usr/lib/firefox-7.0.1
```

The firefox version must be the same as installed on your system (it is possible that no version is included in the path, e.g. only /usr/lib/firefox/ is present) and run ldconfig to update the libraries:

```
sudo ldconfig
```

### Ubuntu 12.04

```
sudo apt-get install make pkg-config g++ zlib1g-dev libfreetype6-dev libjpeg62-dev libpng12-dev libopenjpeg-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libxv-dev x11proto-video-dev libgl1-mesa-dev x11proto-gl-dev linux-sound-base libxvidcore-dev libssl-dev libjack-dev libasound2-dev libpulse-dev libsdl1.2-dev dvb-apps libavcodec-extra-53 libavdevice-dev libmozjs185-dev
```

### Ubuntu 14.04

```
sudo apt-get install subversion make pkg-config g++ zlib1g-dev libfreetype6-dev libjpeg62-dev libpng12-dev libopenjpeg-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libavresample-dev libxv-dev x11proto-video-dev libgl1-mesa-dev x11proto-gl-dev linux-sound-base libxvidcore-dev libssl-dev libjack-dev libasound2-dev libpulse-dev libsdl1.2-dev dvb-apps libavcodec-extra libavdevice-dev libmozjs185-dev
```

### Debian testing 6 (Wheezy)

```
apt-get install pkg-config g++ zlib1g-dev xulrunner-dev libfreetype6-dev libjpeg8-dev libpng12-dev libopenjpeg-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libxv-dev x11proto-video-dev libgl1-mesa-dev x11proto-gl-dev linux-sound-base libxvidcore-dev libssl-dev libjack-dev libasound2-dev libpulse-dev libsdl1.2-dev dvb-apps libavcodec-extra-53 libavdevice-dev
```

### Other Unix distributions

**Note:** we provide [[specific build instructions to build on MacOS X|Compiling GPAC for MacOS X]]. 

If the FFmpeg packages lead to errors, consider rebuilding with [Zenbuild](https://github.com/gpac/zenbuild) or [other scripts](https://gist.github.com/xdamman/e4f713c8cd1a389a5917#file-install_ffmpeg_ubuntu-sh). 

We provide the extra libs as an [zip package. Download it](https://sourceforge.net/p/gpac/code/HEAD/tree/trunk/gpac_extra_libs/gpac_extra_libs.zip) and run the `compile.sh` script. 

If you encounter an issue, [please report a bug](https://gpac.io/2013/07/16/how-to-file-a-bug-properly/ "How to file a bug properly").

## Compilation

```
cd gpac
./configure
make
sudo make install
```

Now you should be able to run `MP4Box` and `gpac`.

