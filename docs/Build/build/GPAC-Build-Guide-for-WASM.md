[**HOME**](Home) » [**Build**](Build-Introduction) » WASM

This page describes how to build GPAC for WASM/Emscripten. 

A live can be seen at https://wasm.gpac.io


# Install Emscripten SDK

Follow the instructions [from the emscripten docs](https://emscripten.org/docs/getting_started/downloads.html#installation-instructions-using-the-emsdk-recommended)

As a summary:

```bash

# Get the emsdk repo
git clone https://github.com/emscripten-core/emsdk.git

# Enter that directory
cd emsdk

# Fetch the latest version of the emsdk (not needed the first time you clone)
git pull

# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh

```


# Build GPAC dependencies 

If you already installed the emscripten SDK, it is still important to run the last two commands from the previous section to activate the SDK environment.

Then you can build the dependencies for GPAC.

```bash

# Get the code
git clone https://github.com/gpac/deps_wasm.git
cd deps_wasm
git submodule update --init --recursive


bash wasm_extra_libs.sh [--enable-threading]

```

The `--enable-threading` option is optional and is used to build the multi-threaded version of WASM GPAC. 


# Build GPAC

First make sure you have `pkg-config` installed (`sudo apt install pkg-config`).

Then we must point pkg-config to the dependencies we built in the previous section by defining an environment variable: 

```bash

# if you built the unthreaded version of the deps
export PKG_CONFIG_PATH=/path/to/deps_wasm/wasm/lib/pkgconfig

# if you built the threaded version of the deps
export PKG_CONFIG_PATH=/path/to/deps_wasm/wasm_thread/lib/pkgconfig

```

Then we can build GPAC with emscripten: 

```bash
git clone https://github.com/gpac/gpac.git
cd gpac

./configure --emscripten --extra-cflags='-Wno-pointer-sign -Wno-implicit-const-int-float-conversion'

make -j4
```

You can then find the built files in the `bin/gcc/` folder. 


# Serving

To use WASM GPAC, you need to serve the built `bin/gcc/gpac.*` files through a web server (it can't be accessed as a file:// resource). 

You also need to add some settings for the webserver, either in a `.htaccess` file, or in the apache config: 

```
    DirectoryIndex gpac.html
    Options FollowSymLinks Indexes
    AllowOverride All

    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Expose-Headers "*"
    Header set Cross-Origin-Embedder-Policy "require-corp"
    Header set Cross-Origin-Opener-Policy "same-origin"

    AddType application/wasm wasm
    AddType application/javascript js
```

You can then access the gpac.html through the web server to use GPAC WASM. 


# Resources

For more info, you can check how the official gpac wasm builder runs at https://buildbot.gpac.io/#/builders/27

And you can check the official live gpac wasm build at https://wasm.gpac.io

For issues and support, go to https://github.com/gpac/gpac/labels/wasm
