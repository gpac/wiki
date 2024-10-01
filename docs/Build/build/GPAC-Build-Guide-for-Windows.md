!!! note
    To build on Windows, you'll need: 
    * [Git](https://git-scm.com/download/win)
    * [Visual Studio](https://visualstudio.microsoft.com/vs/community/) (at least VS2015 is recommended)

    For a full build, other tools might be required, they will be mentioned at the time.


# NOTE FOR Windows XP Users {: data-level="all" }

Windows XP is no longer supported (by GPAC nor Microsoft) in our regular build system. See [this discussion](https://github.com/gpac/gpac/issues/1490#issuecomment-649519836) for further details.

# Build MP4Box only

To build only the MP4Box command line utility, you will need to:

1. Get the source

```batch
git clone https://github.com/gpac/gpac.git gpac_public
```

2. Open the "Developer Command Prompt for VS 2015" (or equivalent)

It might be called something else depending on your version of Visual Studio. The goal is to be able to run the `msbuild.exe` command.

3. Run 

```batch
> cd gpac_public\build\msvc14
> msbuild.exe gpac.sln /maxcpucount /t:Rebuild /p:Configuration="Release - MP4Box_only" /p:Platform=x64 /p:PlatformToolset=v140 /p:WindowsTargetPlatformVersion=8.1
```

<a name="toolset"></a>
You can adjust the parameters: 
 - `/p:Platform=x64`: Change to `/p:Platform=Win32` to get a 32 bits build
 - `/p:PlatformToolset=v140` and `/p:WindowsTargetPlatformVersion=8.1`: Change this depending on your Visual Studio version and the Windows SDK version you have installed.
 -  (e.g.: `/p:PlatformToolset=v143 /p:WindowsTargetPlatformVersion=10.0` for VS 2022 on Windows 10)
 
 You can find out what versions you have by opening the gpac.sln solution in Visual Studio, opening the property page of one the project, and checking the "Platform Toolset" and "Windows SDK Version" fields. 

 Alternatively, you can build with the Visual Studio GUI. If needed, use the "Retarget Solution" function (by right-clicking on the solution in the Solution Explorer) to adjust the Windows SDK version. 

4. The binary `MP4Box.exe` will be `bin\x64\Release - MP4Box_only`

You can add this directory to your `PATH` environment variable. Or move the binary to a destination in your `PATH`. Or just use it locally. 


# Full GPAC build

To get a full build of the whole GPAC project, you will first need to build some dependencies, copy them over to the main gpac repository, and build it. 

Let's take it step by step. To keep things clear, let's call your main working directory `<GPAC_ROOT_DIR>`

## Get the code

```batch
# get gpac source
<GPAC_ROOT_DIR> > git clone https://github.com/gpac/gpac.git gpac_public

# get dependencies
<GPAC_ROOT_DIR> > git clone https://github.com/gpac/deps_windows
<GPAC_ROOT_DIR> > cd deps_windows
<GPAC_ROOT_DIR>\deps_windows > git submodule update --init --recursive --force --checkout
```

Naming the main gpac source repository `gpac_public` is important because some subsequent scripts will have this name hard-coded. (If you don't want to do that, you can find instances of "gpac_public" in the deps_windows repository and replace them with whatever your set up is.)

## Building dependencies

If you plan on compiling the xvid dependency, make sure you have [NASM](https://nasm.us/) installed.

Open the "Developer Command Prompt for VS 2015" (or equivalent in your install). 

Run:

```batch
<GPAC_ROOT_DIR>\deps_windows > cd build\msvc
<GPAC_ROOT_DIR>\deps_windows\build\msvc > msbuild.exe BuildAll_vc10.sln /maxcpucount /t:Build /p:Configuration=Release /p:Platform=x64 /p:PlatformToolset=v140 /p:WindowsTargetPlatformVersion=8.1
```

See the [remarks above to adjust the parameters](#toolset).

## Copying dependencies

Simply run: 

```batch
<GPAC_ROOT_DIR>\deps_windows > CopyLibs2Public.bat all
```

## Building GPAC

Now that all dependencies have been set up, we can be build GPAC proper by simply running, inside a Developer Command Prompt:

```batch
<GPAC_ROOT_DIR>\gpac_public\build\msvc14 > msbuild.exe gpac.sln /maxcpucount /t:Rebuild /p:Configuration=Release /p:Platform=x64 /p:PlatformToolset=v140 /p:WindowsTargetPlatformVersion=8.1
```

See the [previous remarks about how to adjust the toolset options](#toolset).

Of course you can also open the `gpac.sln` solution in the Visual Studio GUI and build/debug from there. In Visual Studio you can use right-click on the gpac solution > "Retarget Solution" to adjust the SDK and toolset parameters according to your system. 

The binaries will be in 
```batch
<GPAC_ROOT_DIR>\gpac_public\bin\<PLATFORM>\<CONFIGURATION>
```

(e.g. `<GPAC_ROOT_DIR>\gpac_public\bin\x64\Release`)

You can add this to your `PATH` to run it from anywhere.


## Packaging GPAC (optional)

If you want to generate your own GPAC installer, you will first need to install [NSIS](https://nsis.sourceforge.io/Download).

You can then run:

```batch
<GPAC_ROOT_DIR>\gpac_public > generate_installer.bat x64
```

If you want to generate an installer from not committed/pushed changes, you might have to edit the script to remove this check. 


# Issues 

This method is how the official GPAC builds are made. It might not work on all configurations/systems as is. 

You can report building issues in the [github issue tracker for GPAC](https://github.com/gpac/gpac/issues). 
