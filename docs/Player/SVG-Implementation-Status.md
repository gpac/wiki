# Overview

This page describes the status of the implementation in the GPAC project of the Scalable Vector Graphics (SVG) language. It describes the features that are implemented and the roadmap for missing or new features.

The GPAC project includes support for the playback and rendering of SVG 1.2 content. The goal is not to provide yet another mixed HTML/SVG browser but to focus on the integration of multimedia description languages with audio/video data. The GPAC player will therefore remain in between a document browser and a traditional audio/video player with support for languages like BIFS, SVG, X3D ...

The implementation of the SVG support in GPAC is divided into 3 parts as follows:

- SVG Parsing

The GPAC framework reads SVG files (or streams) and builds the memory tree. It uses a (simple, limited, but functional) SAX parser. The parser can load, progressively or not, an SVG document into memory. If you are interested, the source code for this part is [here](https://github.com/gpac/gpac/blob/master/src/scene_manager/loader_svg.c).

- SVG Tree Management

This part of the SVG support is common in the GPAC implementation with the MPEG-4 BIFS tree management, and is called in general Scene Graph Management. The Scene Graph part is responsible for the creation of elements, the handling of attributes (parsing, dump, cloning ...). It also handles the animations and scripting features of SVG.
If you check out the source code, look for svg_nodes.h, scenegraph_svg.h, [src/scenegraph](https://github.com/gpac/gpac/tree/master/src/scenegraph)/svg_*.*.

- SVG Compositing and Rendering

The compositing and rendering operations consists in applying animations, triggering user interactions, rasterizing the vector graphics and producing the final image. If you check out the source code, look for [src/compositor](https://github.com/gpac/gpac/tree/master/src/compositor)/svg*.c.

# Status

GPAC currently supports SVG Tiny 1.2. Some elements, supported at parsing, are not yet implemented in the rendering. Scripting support using MicroDOM is provided by QuickJS engine. Detailed support for each element, attribute, property and script interfaces is available [here](http://gpac.sourceforge.net/gpac_svg_support.xml).

Results of the GPAC behavior on the SVG 1.2 Tiny Test Suite can be found [here](http://gpac.sourceforge.net/gpac_svg_testsuite_status.xml).
