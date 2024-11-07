---
tags:
- option
- source
- heif
- data
- frame
---



[**HOME**](Home) » [**Build**](Build-Introduction) » WASM

_This page describes how to build GPAC for WASM/Emscripten._

!!! note
    You can check a live demo at [https://wasm.gpac.io](https://wasm.gpac.io).


# (Recommended) Use Docker {: data-level="all"}

The easiest way to build GPAC for WASM is to use the provided Dockerfile at `build/docker/wasm.Dockerfile` in the GPAC repository.

You just need to build the docker image and copy the built files from the container.

```bash

# Get the pre-built docker image
docker pull gpac/wasm

# OR build the docker image yourself
docker build -t gpac/wasm -f build/docker/wasm.Dockerfile .

# Create a container from the image
docker create --name gpac-wasm gpac/wasm

# Copy the built files from the container
docker cp gpac-wasm:/gpac_public/bin/gcc/. /path/to/destination

# Remove the container
docker rm gpac-wasm

# Launch the HTTP server
gpac httpout:port=8080:rdirs=/path/to/destination:cors=on
```

After that, you can access the GPAC WASM build at [http://localhost:8080/gpac.html](http://localhost:8080/gpac.html).

For more details about serving the files, see [the serving section](#serving)

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

#for gpac unthreaded
./configure --emscripten --disable-threads --extra-cflags='-Wno-pointer-sign -Wno-implicit-const-int-float-conversion'

#for gpac threaded
./configure --emscripten --extra-cflags='-Wno-pointer-sign -Wno-implicit-const-int-float-conversion'

make -j4
```

You can then find the built files in the `bin/gcc/` folder.

# Serving

To use WASM GPAC, you need to serve the built `bin/gcc/gpac.*` files through a web server (it can't be accessed as a file:// resource).

## GPAC example

If you have GPAC installed, you can use the included HTTP server:

```bash
gpac httpout:port=8080:rdirs=bin/gcc
```

For threaded version you need to enable CORS on the server and serve through https:

```bash
# you can use an existing cert, or generate one with letsencrypt, or here we generate a self-signed certificate:
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"

# serve the files with cors and https enabled
gpac httpout:port=8080:rdirs=bin/gcc:cors=on:cert=cert.pem:pkey=key.pem
```

## Apache example

For Apache, you need to add some settings for the webserver, either in a `.htaccess` file, or in the apache config:

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

For the threaded version you'll have to serve through https for it to work properly.


# Resources

For more info, you can check how the official gpac wasm builder runs at [https://buildbot.gpac.io/#/builders/27](https://buildbot.gpac.io/#/builders/27)

And you can check the official live gpac wasm build at [https://wasm.gpac.io](https://wasm.gpac.io)

For issues and support, go to [https://github.com/gpac/gpac/labels/wasm](https://github.com/gpac/gpac/labels/wasm)
