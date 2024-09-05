# Overview {: data-level="all"}

Windows users often ask about how to compile GPAC and generate an installer. The main problem on platforms, like Windows, that don't rely on a modern package system is to get your dependencies with the correct version. Fortunately, we release a package containing most of the extra-libs we use.

The first reaction of unix users when compiling GPAC is to use an existing gnu/gcc compilation chain (Cygwin, MinGW...). However another free solution exists using Microsoft Visual Studio Express Edition. This article gives you some strong clues about the tools you need to recompile binaries and generate an installer using the latter.

**This article was made using a clean install within a virtualized Windows XP. It focuses on command-lines but converting and compiling projects from the GUI works.**

# Getting the tools

*   [Download Visual C++ Express](http://www.microsoft.com/express/Downloads/) on the web (2010 has been used for this article).
*   Ensure you have access to msbuild.exe which is provided with [the .NET framework 3.5](http://www.microsoft.com/downloads/en/details.aspx?FamilyId=333325fd-ae52-4e35-b531-508d977d32a6&displaylang=en) (it should be installed on any up-to-date Windows): `%WINDIR%\Microsoft.NET\Framework\v3.5\MSBuild.exe`
From now, I'll assume it is in your path and therefore refer it as MSBuild.exe
*   You'll need to compile assembly code using [NASM](http://www.nasm.us/). Add the binaries' directory to your PATH.
*   SDL (alternative audio/video output for the player) and Gecko (to have the GPAC player as a Firefox plugin) installs need `wget.exe` to download resources from web servers.
*   SDL install needs to unzip a file. Therefore put `unzip.exe` within your PATH to have SDL support.
*   OpenHEVC support requires that you have `git.exe` in your PATH.

*   If you have MFC/AFX support (i.e. Visual C++ with a non-free edition) and wish to have native audio/video outputs using DirectX on your player, you shall install the DirectX SDK from the Microsoft website.
Rem: some users told us June 2010 DirectX SDK got rid of some needed components. February 2010 SDK should work.

Note: if you don't have the MFC/AFX headers, GPAC still provides you with SDL as an audio/video output.

# Getting the source code (or organizing it)

Make sure you have git and [subversion installed on your system](http://subversion.apache.org/), and **add the subversion binaries to your path**.

Create a directory that I'll call "root directory" in this article. **All the commands are executed from your root directory.** Open a prompt and then type the following command:

```
> git clone https://github.com/gpac/gpac.git
```

Download the file at <https://download.tsi.telecom-paristech.fr/gpac/gpac_extra_libs.zip>.

Unzip `gpac_extra_libs.zip` so that you have a gpac\_extra\_libs directory containing the files.

# Compiling GPAC dependencies (extra libs)

The GPAC extra\_libs package is provided with a Visual Studio 2005 solution, we need to upgrade it (note: if you use the graphical interface, Visual C++ will try to convert it automatically) :

*   If you have a commercial edition of Visual C++:

1.  Find `devenv` within your Visual C++ install directory (should be `%VS90COMNTOOLS%\\..\\IDE\\devenv.exe`)
2.  
```
> msbuild.exe gpac_extra_libs/build/msvc/BuildAll_vc10.sln /t:Build  /p:Configuration=Release /p:Platform=Win32
```
    
For recent versions of Visual Studio (2015+), add `/p:PlatformToolset=v140` to the previous command.

*   If you have a free edition of Visual C++:

1.  Find vcbuild.exe within your Visual C++ install directory (should be `%PROGRAMFILES%\Microsoft Visual Studio 10.0\VC\vcpackages\vcbuild.exe`)
2.  
```
> vcbuild.exe gpac_extra_libs\build\msvc\BuildAll_vc10.sln
  /msbuild:Configuration=Release
  /msbuild:Platform=Win32
```
    

VCbuild actually compiles the solution as it converts it. Sometimes VCbuild tries to build configurations that will fail ("RELEASE|SMARTPHONE 2003 (ARMV4)" for instance) : ignore them.

Check the compilation has succeeded by listing the directory containing the binaries:

```
> dir gpac_extra_libs\lib\win32\release
```
    
You're expected to see .lib and .dll files relative to the extra libs you're interested in (compulsory zlib, then optional js, png, jpeg, faad, mad, freetype, etc.).

Copy the binaries to the right GPAC directories. Execute:


```
> gpac_extra_libs\CopyLibs2Public.bat x86
```
    

# Compiling GPAC


```
> gpac_public\version.bat
> msbuild.exe gpac_public/build/msvc10/gpac.sln /t:Build /p:Configuration=Release /p:Platform=Win32
```
    

If you get a pre-generation error, please check subversion binaries (and especially `svnversion`) are in your PATH.

All projects won't compile on your desktop using this configuration. For instance `Platinum` (UPnP) support is not covered by this article.

If you want to have some audio/video support, make sure you installed the optional packages at the "Getting the tools" step.

# Making an installer

GPAC uses [NSIS](http://nsis.sourceforge.net) to generate an installer. The NSIS script is located at `bin\Win32\release\nsis_install\gpac_installer.nsi`.

**The current script won't succeed unless you have successfully compiled everything.**

Therefore you need to modify the script (remove lines relative to the missing binaries). Depending on what you have done, you have two possibilities:

*   launch the script from the `bin\Win32\release\nsis_install` directory to generate an unversionned installer;
*   if you have no local modification on the repository, launch the batch from the GPAC root directory (`gpac_public\generate_installer.bat)` to generate a clean versionned installer of GPAC.

