---
tags:
- input
- data
- source
- link
---



!!! note
    The Android build is a bit complicated. The method described here is the one used for the official Android builds. It is fairly rigid, with some hard-coded paths and versions. It should not be too hard to adapt it to one's own setup, but there is no guarantee that it will work as is on (for example) more recent versions of the ndk/sdk. 

    It was tested on Ubuntu 14 to 18. 

    The process has three main steps: set up the build environment, cross-compile the dependencies, build the GPAC apk.

    In the following, we'll call the main working directory `<GPAC_ROOT_DIR>`.


# Set up the build toolchain {: data-level="all"}

## JVM and tools

We first install the JAVA runtime and development environment, and some useful libs for later: 

```bash
sudo apt-get install openjdk-8-jdk openjdk-8-jre-headless ant libncurses5 libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386 autoconf automake libtool 
```

## Android SDK

We start by downloading the latest Android Tools from https://developer.android.com/studio#downloads. 

We then use the `sdkmanager` included to install the right version of the SDK. 

Then we create a symbolic link to `/opt/android-sdk` for ease of use later. 

```bash
<GPAC_ROOT_DIR>$ mkdir sdk
<GPAC_ROOT_DIR>$ cd sdk
<GPAC_ROOT_DIR>/sdk$ wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
<GPAC_ROOT_DIR>/sdk$ unzip sdk-tools-linux-4333796.zip
<GPAC_ROOT_DIR>/sdk$ cd tools
<GPAC_ROOT_DIR>/sdk/tools$ bin/sdkmanager "platforms;android-23"
<GPAC_ROOT_DIR>/sdk/tools$ bin/sdkmanager "build-tools;23.0.3"
<GPAC_ROOT_DIR>/sdk/tools$ bin/sdkmanager "extras;android;m2repository"
<GPAC_ROOT_DIR>/sdk/tools$ cd ../..
<GPAC_ROOT_DIR>$ sudo ln -sf $(readlink -f ./sdk) /opt/android-sdk
```

## Android NDK

The version here is important. 

```bash
<GPAC_ROOT_DIR>$ mkdir ndk
<GPAC_ROOT_DIR>$ cd ndk
<GPAC_ROOT_DIR>/ndk$ wget https://dl.google.com/android/repository/android-ndk-r22b-linux-x86_64.zip
<GPAC_ROOT_DIR>/ndk$ unzip android-ndk-r22b-linux-x86_64.zip
<GPAC_ROOT_DIR>/ndk$ sudo ln -sf $(readlink -f ./android-ndk-r22b) /opt/android-ndk
```

We should now have something like this in `/opt`:

```bash
adavid@ubuntu1810:~/gpac-android$ ll /opt/
total 8
lrwxrwxrwx  1 root root   41 avril  1 16:14 android-ndk -> /home/adavid/gpac-android/ndk/android-ndk-r13b/
lrwxrwxrwx  1 root root   24 avril  1 16:15 android-sdk -> /home/adavid/gpac-android/sdk/
```


# Build the dependencies

## Get the source

```bash
##get src
<GPAC_ROOT_DIR>$ git clone https://github.com/gpac/gpac.git gpac_public

##get deps
<GPAC_ROOT_DIR>$ git clone https://github.com/gpac/deps_android
<GPAC_ROOT_DIR>$ cd deps_android
<GPAC_ROOT_DIR>/deps_android$ git submodule update --init --recursive --force --checkout
```

Note that keeping the name `gpac_public` for the main source repository is important for scripts to run smoothly. 

## Build deps

```bash
<GPAC_ROOT_DIR>/deps_android$ cd build/android/
<GPAC_ROOT_DIR>/deps_android/build/android$ ./gpac_build_all_extra_libs /opt/android-ndk
```

## Copy deps

```bash
<GPAC_ROOT_DIR>/deps_android$ ./CopyLibs2Public4Android.sh
```

If all went well up to this point, you should see the extra_lib directory of the main repository looking like this: 

```bash
adavid@ubuntu1810:~/gpac-android/deps_android$ ll ../gpac_public/extra_lib/lib/android/*
../gpac_public/extra_lib/lib/android/armeabi:
total 13456
-rwxr-xr-x 1 adavid adavid 7585444 avril  2 14:12 libavcodec.so*
-rwxr-xr-x 1 adavid adavid   51108 avril  2 14:12 libavdevice.so*
-rwxr-xr-x 1 adavid adavid 1504740 avril  2 14:12 libavfilter.so*
-rwxr-xr-x 1 adavid adavid 1666644 avril  2 14:12 libavformat.so*
-rwxr-xr-x 1 adavid adavid  255452 avril  2 14:12 libavutil.so*
-rwxr-xr-x 1 adavid adavid   30544 avril  2 14:12 libeditline.so*
-rwxr-xr-x 1 adavid adavid  254480 avril  2 14:12 libfaad.so*
-rwxr-xr-x 1 adavid adavid  349692 avril  2 14:12 libft2.so*
-rwxr-xr-x 1 adavid adavid  165372 avril  2 14:12 libjpegdroid.so*
-rwxr-xr-x 1 adavid adavid  589184 avril  2 14:12 libjs_osmo.so*
-rwxr-xr-x 1 adavid adavid  103932 avril  2 14:12 libmad.so*
-rwxr-xr-x 1 adavid adavid  105672 avril  2 14:12 libopenjpeg.so*
-rwxr-xr-x 1 adavid adavid  144944 avril  2 14:12 libpng.so*
-rwxr-xr-x 1 adavid adavid  444584 avril  2 14:12 libstlport_shared.so*
-rwxr-xr-x 1 adavid adavid   75148 avril  2 14:12 libswresample.so*
-rwxr-xr-x 1 adavid adavid  320908 avril  2 14:12 libswscale.so*
-rwxr-xr-x 1 adavid adavid   87624 avril  2 14:12 libz.so*

../gpac_public/extra_lib/lib/android/armeabi-v7a:
total 17928
-rwxr-xr-x 1 adavid adavid 12362152 avril  2 14:12 libavcodec.so*
-rwxr-xr-x 1 adavid adavid    51108 avril  2 14:12 libavdevice.so*
-rwxr-xr-x 1 adavid adavid  1504740 avril  2 14:12 libavfilter.so*
-rwxr-xr-x 1 adavid adavid  1666644 avril  2 14:12 libavformat.so*
-rwxr-xr-x 1 adavid adavid   255452 avril  2 14:12 libavutil.so*
-rwxr-xr-x 1 adavid adavid    30552 avril  2 14:12 libeditline.so*
-rwxr-xr-x 1 adavid adavid   221720 avril  2 14:12 libfaad.so*
-rwxr-xr-x 1 adavid adavid   345604 avril  2 14:12 libft2.so*
-rwxr-xr-x 1 adavid adavid   157188 avril  2 14:12 libjpegdroid.so*
-rwxr-xr-x 1 adavid adavid   523656 avril  2 14:12 libjs_osmo.so*
-rwxr-xr-x 1 adavid adavid    99844 avril  2 14:12 libmad.so*
-rwxr-xr-x 1 adavid adavid    89296 avril  2 14:12 libopenjpeg.so*
-rwxr-xr-x 1 adavid adavid   120376 avril  2 14:12 libpng.so*
-rwxr-xr-x 1 adavid adavid   399384 avril  2 14:12 libstlport_shared.so*
-rwxr-xr-x 1 adavid adavid    75148 avril  2 14:12 libswresample.so*
-rwxr-xr-x 1 adavid adavid   320908 avril  2 14:12 libswscale.so*
-rwxr-xr-x 1 adavid adavid    87632 avril  2 14:12 libz.so*

../gpac_public/extra_lib/lib/android/x86:
total 24640
-rwxr-xr-x 1 adavid adavid 17571708 avril  2 14:12 libavcodec.so*
-rwxr-xr-x 1 adavid adavid    51200 avril  2 14:12 libavdevice.so*
-rwxr-xr-x 1 adavid adavid  1829656 avril  2 14:12 libavfilter.so*
-rwxr-xr-x 1 adavid adavid  2176896 avril  2 14:12 libavformat.so*
-rwxr-xr-x 1 adavid adavid   292208 avril  2 14:12 libavutil.so*
-rwxr-xr-x 1 adavid adavid    30444 avril  2 14:12 libeditline.so*
-rwxr-xr-x 1 adavid adavid   299436 avril  2 14:12 libfaad.so*
-rwxr-xr-x 1 adavid adavid   374168 avril  2 14:12 libft2.so*
-rwxr-xr-x 1 adavid adavid   169368 avril  2 14:12 libjpegdroid.so*
-rwxr-xr-x 1 adavid adavid   900380 avril  2 14:12 libjs_osmo.so*
-rwxr-xr-x 1 adavid adavid    99736 avril  2 14:12 libmad.so*
-rwxr-xr-x 1 adavid adavid   130148 avril  2 14:12 libopenjpeg.so*
-rwxr-xr-x 1 adavid adavid   169420 avril  2 14:12 libpng.so*
-rwxr-xr-x 1 adavid adavid   558296 avril  2 14:12 libstlport_shared.so*
-rwxr-xr-x 1 adavid adavid    83236 avril  2 14:12 libswresample.so*
-rwxr-xr-x 1 adavid adavid   365860 avril  2 14:12 libswscale.so*
-rwxr-xr-x 1 adavid adavid    83412 avril  2 14:12 libz.so*
```

_(contents and versions may differ depending on updates and deprecated features)_

# Build GPAC

We are now ready to build GPAC proper. 

```bash 
<GPAC_ROOT_DIR>/deps_android$ cd ../gpac_public/build/android/jni
<GPAC_ROOT_DIR>/gpac_public/build/android/jni$ ./gpac_build_android -ndk=/opt/android-ndk -sdk=/opt/android-sdk -jdk=/usr/lib/jvm/java-8-openjdk-amd64 -force_rebuild
```

If it succeeds, you should see the apk in `<GPAC_ROOT_DIR>/gpac_public`:

```
adavid@ubuntu1810:~/gpac-android/gpac_public$ ll *.apk
-rw-rw-r-- 1 adavid adavid 30745262 avril  2 14:53 osmo4-0.7.2-DEV-rev1048-g38ab344d4-master.apk
```

You can now install the apk on your device!


# Reporting issues

As mentioned in the introduction, chances are there will be some problems along the way. You can open issues about Android compilation in the [issues tracker](https://github.com/gpac/gpac/issues).
