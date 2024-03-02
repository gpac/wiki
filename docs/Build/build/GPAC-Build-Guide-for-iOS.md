To build GPAC for iOS, we'll first need to cross-compile some dependencies, before building the project itself. 

For the following, we'll call the working directory `<GPAC_ROOT_DIR>`.


# Building dependencies

## Get the code

```bash
##get src
<GPAC_ROOT_DIR>$ git clone https://github.com/gpac/gpac.git gpac_public

##get deps
<GPAC_ROOT_DIR>$ git clone https://github.com/gpac/deps_ios
<GPAC_ROOT_DIR>$ cd deps_ios
<GPAC_ROOT_DIR>/deps_ios$ git submodule update --init --recursive --force --checkout
```

We need to keep the `gpac_public` for the main repository to have the scripts run smoothly.


## Build dependencies

```bash
<GPAC_ROOT_DIR>/deps_ios/SDL_iOS$ cd ../build/xcode_ios
<GPAC_ROOT_DIR>/deps_ios/build/xcode_ios$ ./generate_extra_libs.sh
```

## Copy dependencies

```bash
<GPAC_ROOT_DIR>/deps_ios/build/xcode_ios$ cd ../..
<GPAC_ROOT_DIR>/deps_ios$ ./CopyLibs2Public4iOS.sh
```

If all went well, the extra_lib directory of the main repository should now look something like this: 

```bash
mojave:deps_ios adavid$ ll ../gpac_public/extra_lib/lib/iOS/
total 358808
-rw-r--r--  1 adavid  staff   6.3M Apr  2 16:16 libSDL2.a
-rw-r--r--  1 adavid  staff    27M Apr  2 16:16 libaom.a
-rw-r--r--  1 adavid  staff    54M Apr  2 16:16 libavcodec.a
-rw-r--r--  1 adavid  staff   199K Apr  2 16:16 libavdevice.a
-rw-r--r--  1 adavid  staff    10M Apr  2 16:16 libavfilter.a
-rw-r--r--  1 adavid  staff    12M Apr  2 16:16 libavformat.a
-rw-r--r--  1 adavid  staff   1.8M Apr  2 16:16 libavutil.a
-rw-r--r--  1 adavid  staff    35M Apr  2 16:16 libcrypto.a
-rw-r--r--  1 adavid  staff   1.5M Apr  2 16:16 libfaad.a
-rw-r--r--  1 adavid  staff   4.6M Apr  2 16:16 libfreetype.a
-rw-r--r--  1 adavid  staff   596K Apr  2 16:16 libglues.a
-rw-r--r--  1 adavid  staff   1.8M Apr  2 16:16 libjpeg.a
-rw-r--r--  1 adavid  staff   8.1M Apr  2 16:16 libjs.a
-rw-r--r--  1 adavid  staff   428K Apr  2 16:16 libmad.a
-rw-r--r--  1 adavid  staff   1.1M Apr  2 16:16 libpng.a
-rw-r--r--  1 adavid  staff   7.3M Apr  2 16:16 libssl.a
-rw-r--r--  1 adavid  staff   526K Apr  2 16:16 libswresample.a
-rw-r--r--  1 adavid  staff   2.4M Apr  2 16:16 libswscale.a
```

# Build GPAC

First we need to set up the code signing process in Xcode. 

Open `<GPAC_ROOT_DIR>/gpac_public/build/xcode/gpac4ios.xcodeproj` in Xcode.

On the `osmo4ios` _General_ properties page, in the _Signing_ section, you'll need to assign a _Provisioning Profile_ and/or maybe change the _Bundle identifier_ in the identity section.

See the Xcode documentation about Provisioning Profiles and code signing. 

Close `gpac4ios.xcodeproj` project in Xcode.

Once this is done, you can run:

```bash
<GPAC_ROOT_DIR>/gpac_public/build/xcode$ ./generate_ios.sh
```

If successful, you should see an `.ipa` file in `<GPAC_ROOT_DIR>/gpac_public/bin/iOS`.

```bash
mojave:iOS adavid$ ll
total 42536
-rw-r--r--  1 adavid  staff    21M Apr  2 16:48 osmo4-0.7.2-DEV-rev1049-g51dadae6c-master-ios.ipa
```
