<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Audio Video Mixer  
  
Register name used to load filter: __avmix__  
This is a JavaScript filter. It is not checked during graph resolution and needs explicit loading.  
Author: GPAC team  
  
AVMix is an audio video mixer controlled by an updatable JSON playlist format. The filter can be used to:  

- schedule video sequence(s) over time  
- mix videos together  
- layout of multiple videos  
- overlay images, text and graphics over source videos  

  
All input streams are decoded prior to entering the mixer.  

- audio streams are mixed in software  
- video streams are composed according to the `gpu` option  
- other stream types are not yet supported  

  
OpenGL hardware acceleration can be used, but the supported feature set is currently not the same with or without GPU.  
  
In software mode, the mixer will detect whether any of the currently active video sources can be used as a base canvas for the output to save processing time.  
The default behavior is to do this detection only at the first generated frame, use `dynpfmt` to modify this.  
  
The filter can be extended through JavaScript modules. Currently only scenes and transition effects use this feature.  
  
# Live vs offline  
  
When operating offline, the mixer will wait for video frames to be ready for 10 times `lwait`. After this timeout, the filter will abort if no input is available.  
This implies that there shall always be a media to compose, i.e. no "holes" in the timeline.  
_Note: The playlist is still refreshed in offline mode._  
  
When operating live, the mixer will initially wait for video frames to be ready for `lwait` seconds. After this initial timeout, the output frames will indicate:  

- 'No signal' if no input is available (no source frames) or no scene is defined  
- 'Signal lost' if no new input data has been received for `lwait` on a source  

  
# Playlist Format  
  
## Overview  
The main components in a playlist are:  

- Media sources and sequences: each source is described by one or more URL to the media data, and each sequence is a set of sources to be played continuously   
- Transitions: sources in a sequence can be combined using transitions  
- Scenes: a scene describes one graphical object to put on screen and if and how input video are mapped on objects  
- Groups: a group is a hierarchy of scenes and groups with positioning properties, and can also be used to create offscreen images reused by other elements  
- Timers: a timer can be used to animate scene parameters in various fashions  

  
The playlist content shall be either a single JSON object or an array of JSON objects, hereafter called root objects.  
Root objects types can be indicated through a `type` property:  

- seq: a `sequence` object  
- url: a `source` object (if used as root, a default `sequence` object will be created)  
- scene: a `scene` object  
- group: a `group` object  
- timer: a `timer` object  
- script: a `script` object  
- config: a `config` object  
- watch: a `watcher` object  
- style: a `style` object  

  
Except for `style`, the `type` property of root objects is usually not needed as the parser guesses the object types from its properties.  
  
A root object with a property `skip` set to anything but `0` or `false` is ignored.  
Within a `group` hierarchy, any `scene` or `group` object with a property `skip` set to anything but `0` or `false` is ignored.  
  
Any unrecognized property not starting with `_` will be reported as warning.  
  
## Colors  
Colors are handled as strings, formatted as:  

- the DOM color name (see `gpac -h colors`)  
- HTML codes `$RRGGBB` or `#RRGGBB`  
- RGB hex vales `0xRRGGBB`  
- RGBA hex values `0xAARRGGBB`  
- the color `none` is `0x00000000`, its signification depends on the object using it.  

  
If JS code needs to manipulate colors, use sys.color_lerp and sys.color_component functions.  
  
## JS Hooks  
  
Some object types allow for custom JS code to be executed.   
The script code can either be the value of the property, or located in a file indicated in the property.   
The code is turned into a function (i.e. `new Function(args, js_code)`) upon initial playlist parsing or reload, hereafter called `JSFun`.  
The `JSFun` arguments and return value are dependent on the parent object type.  
The parent object is exposed as `this` in `JSFun` and can be used to store context information for the JS code.  
  
The code can use the global functions and modules defined, especially:  

- sys: GPAC system module  
- evg: GPAC EVG module  
- os: QuickJS OS module   
- video_playing: video playing state  
- audio_playing: audio playing state  
- video_time: output video time  
- video_timescale: output video timescale  
- video_width: output video width  
- video_height: output video height  
- audio_time: output audio time  
- audio_timescale: output audio timescale  
- samplerate: output audio samplerate  
- channels: output audio channels  
- current_utc_clock: current UTC clock in ms  
- get_media_time: gets media time of output (no argument) or of source with id matching the first argument. Return  

    - -4: not found  
    - -3: not playing  
    - -2: in prefetch  
    - -1: timing not yet known  
    - value: media time in seconds (float)  

- resolve_url: resolves URL given in first argument against media playlist URL and returns the resolved url (string)  
- get_scene(id): gets scene with given ID  
- get_group(id): gets group with given ID  
- mouse_over(evt): returns scene under mouse described by a GPAC event, or null if no scene (picking for scenes with perspective projection is not supported)  
- mouse_over(x, y): returns scene under coordinates {x, y} in pixels, {0,0} representing the center of the frame, x axis oriented towards the right and y axis oriented towards the top  

  
Scene and group options must be accessed through getters and setters:  

- scene.get(prop_name): gets the scene option  
- scene.set(prop_name, value): sets the scene option  
- group.get(prop_name): gets the group option  
- group.set(prop_name, value): sets the group option  

  
__Warning: Results are undefined if JS code modifies the scene/group objects in any other way.__  
  
Other playlist objects (as well as scene and group objects) can be queried using `query_element(ID, propName)` or modified using `update_element(ID, propName, value)` (see playlist update below).     
  
__Warning: There is no protection of global variables and state, write your script carefully!__  
  
Additionally, scripts executed within scene modules can modify the internal playlist using:  

- remove_element(ID):  removes a scene, group, sequence, timer, script or watcher with given ID from playlist  
- parse_element(JSON): parses a root playlist element and add it to the current playlist  
- parse_scene(JSON, parent): parses a scene and add it to `parent` group if not null or root otherwise  
- parse_group(JSON, parent): parses a group and add it to `parent` group if not null or root otherwise  
- reload_playlist(JSON): parses a new playlist (an empty JSON array will reset the playlist). If the calling scene is no longer in the resulting scene tree, it will be added to the root of the scene tree.  

  
All these playlist-related functions must be called within the update() callback of the scene module.  
  
## Sequences  
### Properties for `sequence` objects:  
  

    - id (null): sequence identifier  
    - loop (0): number of loops for the sequence (0 means no loop, -1 will loop forever)  
    - start (0): sequence start time (see notes). If negative, the sequence is not active  
    - stop (0): sequence stop time (see notes). If less than `start`, the sequence will stop only when over  
    - transition (null): a `transition` object to apply between sources of the sequence  
    - seq ([]): array of one or more `source` objects  

  
### Notes  
  
Media source timing does not depend on the media being used by a scene or not, it is only governed by the `sequence` parameters.  
This means that a `sequence` not used by any active scene will not be rendered (video nor audio).  
  
The syntax for `start` and  `stop` fields is:  

- `now`: resolves to current UTC clock in `live` mode, and to 0 for non-live mode  
- date: converted to UTC date in `live` mode, and to 0 for non-live mode  
- N: converted to current utc clock (or 0 for non-live mode) plus N seconds UTC  
- "N": converted to current utc clock (or 0 for non-live mode) plus N seconds UTC  

  
In 'live' mode, if `start` is set using a UTC date, the sequence will have a start range equal to `MAX(current_UTC - start_in_UTC, 0)`. Some sources may be skipped to fulfill this condition.  
This allows different instances of the filter using the same playlist to initialize media time in the same fashion.  
  
When reloading the playlist:  

- if the sequence is active, `start` value is ignored   
- if the sequence was not started, `start` value is updated   
- if the sequence was over, `start` value is updated only of greater than previous resolved UTC start time.   

  
## Sources  
### Properties for `source` objects  
  

- id (null): source identifier, used when reloading the playlist  
- src ([]): list of `sourceURL` describing the URLs to play. Multiple sources will be played in parallel  
- start (0.0): media start time in source  
- stop (0.0): media stop time in source, ignored if less than or equal to `start`  
- mix (true): if true, apply sequence transition or mix effect ratio as audio volume. Otherwise volume is not modified by transitions.  
- fade ('inout'): indicate how audio should be faded at stream start/end:  

    - in: audio fade-in when playing first frame  
    - out: audio fade-out when playing last frame  
    - inout: both fade-in and fade-out are enabled  
    - other: no audio fade  

- keep_alive (false): if using a dedicated gpac process for one or more input, relaunch process(es) at source end if exit code is greater than 2 or if not responding after `rtimeout`  
- seek (false): if true and `keep_alive` is active, adjust `start` according to the time elapsed since source start when relaunching process(es)  
- prefetch (500): prefetch duration in ms (play before start time of source), 0 for no prefetch  
- hold (false): if media duration is known and media stop time is greater than media duration, activate no signal mode until desired stop time is reached (disable transition), otherwise move to next source at end of stream  

  
## Source Locations  
### Properties for `sourceURL` objects  
  

- id (null): source URL identifier, used when reloading the playlist  
- in (null): input URL or filter chain to load as string. Words starting with `-` are ignored. The first entry must specify a source URL, and additional filters and links can be specified using `@N[#LINKOPT]` and `@@N[#LINKOPT]` syntax, as in gpac  
- port (null): input port for source. Possible values are:  

    - pipe: launch a gpac process to play the source using GSF format over pipe  
    - tcp, tcpu: launch a gpac process to play the source using GSF format over TCP socket (`tcp`) or unix domain TCP socket (`tcpu`)  
    - not specified or empty string: loads source using the current process  
    - other: use value as input filter declaration and launch `in` as a dedicated process (e.g. `in="ffmpeg ..." port="pipe://..."`)  

- opts (null): options for the gpac process instance when using a dedicated gpac process, ignored otherwise  
- media ('all'): filter input media by type, `a` for audio, `v` for video, `t` for text (several characters allowed, e.g. `av` or `va`), `all` accept all input media  
- raw (true): indicate if input port is decoded AV (true) or compressed AV (false) when using a dedicated gpac process, ignored otherwise  

  
### Notes  
  
The special URL scheme `ipid://` can be used to locate an input pid by link directives.  
Example
```
in=ipid://#foo=bar
```  

This will use pids having property `foo` with value `bar`, regardless of source filter ID.  
  
Example
```
in=ipid://TEST#foo=bar
```  

This will use pids having property `foo` with value `bar` coming from filter with ID `TEST`.  
  
When using the `ipid://` scheme, filter chains cannot be specified (in accepts a single argument) and `port` is ignored.  
The syntax for link directive is the same as in gpac. However, if a listed property is not found on the input pid, the matching will fail.  
  
When launching a child process, the input filter is created first and the child process launched afterwards.  
  
__Warning: When launching a child process directly (e.g. `in="ffmpeg ..."`), any relative URL used in `in` must be relative to the current working directory.__  
  
## 2D and 3D transformation  
### Common properties for `group` and `scene` objects  
  

- active (true): indicate if the object is active or not. An inactive object will not be refreshed nor rendered  
- x (0): horizontal translation  
- y (0): vertical translation  
- cx (0): horizontal coordinate of rotation center  
- cy (0): vertical coordinate of rotation center  
- units ('rel'): unit type for `x`, `y`, `cx`, `cy`, `width` and `height`. Possible values are:  

    - rel: units are expressed in percent of current reference (see below)  
    - pix: units are expressed in pixels  

- rotation (0): rotation angle of the scene in degrees  
- hscale (1): horizontal scaling factor to apply to the group  
- vscale (1): vertical skewing factor to apply to the scene  
- hskew (0): horizontal skewing factor to apply to the scene  
- vskew (0): vertical skewing factor to apply to the scene  
- zorder (0): display order of the scene or of the offscreen group (ignored for regular groups)  
- untransform (false): if true, reset parent tree matrix to identity before computing matrix  
- mxjs (null): JS code for matrix evaluation  
- z (0): depth translation  
- cz (0): depth coordinate of rotation center  
- zscale (1): depth scaling factor to apply to the group  
- orientation ([0, 0, 1, 0]): scale along the given orientation axis [x, y, z, angle] - see VRML `scaleOrientation`  
- axis ([0, 0, 1]): rotation axis  
- position ([0, 0, auto]): camera location  
- target ([0, 0, 0]): point where the camera is looking  
- up ([0, 1, 0]): camera up vector  
- viewport ([0, 0, 100, 100]): viewport for camera  
- fov (45): field of view in degrees  
- ar (0): camera aspect ratio, 0 means default  
- znear (0): near Z plane distance, 0 means default  
- zfar (0): far Z plane distance, 0 means default  

  
### Coordinate System  
  
Each group or scene is specified in a local coordinate system for which:  

- {0,0} represents the center  
- X values increase to the right  
- Y values increase to the top  
- Z values increase  towards the eye of a viewer (Z=X^Y)  

  
The 2D local transformation matrix is computed as `rotate(cx, cy, rotation)` * `hskew` * `vskew` * `scale(hscale, vscale)` * `translate(x, y)`.  
The 3D local transformation matrix is computed as `translate(x, y, z)` * `rotate(cx, cy, cz, rotation)` * `scale(hscale, vscale, zscale)`. Skewing is not supported for 3D.  
  
The default unit system (`rel`) is relative to the current established reference space:  

- by default, the reference space is `{output_width, output_height}`, the origin {0,0} being the center of the output frame   
- any group with `reference=true`, `width>0` and `height>0` establishes a new reference space `{group.width, group.height}`  

  
Inside a reference space `R`, relative coordinates are interpreted as follows:  

- For horizontal coordinates, 0 means center, -50 means left edge (`-R.width/2`), 50 means right edge (`+R.width/2`).  
- For vertical coordinates, 0 means center, -50 means bottom edge (`-R.height/2`), 50 means top edge (`+R.height/2`).  
- For `width`, 100 means `R.width`.  
- For `height`, 100 means `R.height`.  
- For depth (z and cz) coordinates, the value is a percent of the reference height (`+R.height`).  

  
If `width=height`, the width is set to the computed height of the object.  
If `height=width`, the height is set to the computed width of the object.  
For `x` property, the following special values are defined:  

- `y` will set the value to the computed `y`  of the object.  
- `-y` will set the value to the computed `-y` of the object.  

For `y` property, the following special values are defined:  

- `x` will set the value to the computed `x` of the object.  
- `-x` will set the value to the computed `-x` of the object.  

  
Changing reference is typically needed when creating offscreen groups, so that children relative coordinates are resolved against the offscreen canvas size.  
  
The selection between 2D and 3D is done automatically based on `z`, `cz`, `axis` and `orientation` values.  
The default projection is:  

- viewport is the entire output frame  
- field of view is PI/4 and aspect ratio is output width/height  
- zNear is 0.1 and zFar is 10 times maximum(output width, output height)  
- camera up direction is Y axis and camera distance is so that a rectangle facing the camera with `z=0` and size equal to output size covers exactly the output frame.  
- depth buffer is disabled  

  
The default projection can be changed by setting camera properties at group or scene level. When set on a group, all children of the group will use the given camera properties (camera parameters on children are ignored).  
The `viewport` parameter is specified as an array `[x, y, w, h]`, where:  

- x: horizontal coordinate of the viewport center, in group or scene units, or 'y' to use `y` value, or '-y' to use -`y` value.  
- y: vertical coordinate of the viewport center, in group or scene units, or 'x' to use `x` value, or '-x' to use -`x` value.  
- w: width of the viewport, in group or scene units, or 'height' to use `h` value.  
- h: height of the viewport, in group or scene units, or 'width' to use `w` value.  

  
### z-ordering  
  
`zorder` specifies the display order of the element in the offscreen canvas of the enclosing offscreen group, or on the output frame if no offscreen group in parent tree.  
This order is independent of the parent group z-ordering. This allows moving objects of a group up and down the display stack without modifying the groups.  
  
### Coordinate modifications through JS  
  
The `JSFun` specified in `mxjs` has a single parameter `tr`.  
  
The `tr` parameter is an object containing the following variables that the code can modify:  

- x, y, z, cx, cy, cz, hscale, vscale, zscale, hskew, vskew, rotation, untransform, axis, orientation: these values are initialized to the current group values in local coordinate system units  
- update: if set to true, the object matrix will be recomputed at each frame even if no change in the group or scene parameters (always enforced to true if `use` is set)  
- depth: for groups with `use`, indicates the recursion level of the used element. A value of 0 indicates this is a direct render of the element, otherwise it is a render through `use`  

  
The `JSFun` may return false to indicate that the scene should be considered as inactive. Any other return value (undefined or not false) will mark the scene as active.  
  
Example
```
"mxjs": "tr.rotation = (get_media_time() % 8) * 360 / 8; tr.update=true;"
```  
  
## Grouping  
### Properties for `group` objects  
  

- id (null): group identifier  
- scenes ([]): zero or more `group` or `scene` objects, cannot be animated or updated  
- opacity (1): group opacity  
- offscreen ('none'): set group in offscreen mode, cannot be animated or updated. An offscreen mode is not directly visible but can be used in some texture operations. Possible values are:  

    - none: regular group  
    - mask: offscreen surface is alpha+grey  
    - color: offscreen surface is alpha+colors or colors if `back_color` is set  
    - dual: same as `color` but allows group to be displayed  

- scaler (1): when opacity or offscreen rendering is used, offscreen canvas size is divided by this factor (>=1)  
- back_color ('none'): when opacity or offscreen rendering is used, fill offscreen canvas with the given color.  
- width (-1): when opacity or offscreen rendering is used, limit offscreen width to given value (see below)  
- height (-1): when opacity or offscreen rendering is used, limit offscreen height to given value (see below)  
- use (null): id of group or scene to re-use  
- use_depth (-1): number of recursion allowed for the used element, negative means global max branch depth as indicated by `maxdepth`  
- reverse (false): reverse scenes order before draw  
- reference (false): group is a reference space for relative coordinate of children nodes   

  
### Notes  
  
The maximum depth of a branch in the scene graph is `maxdepth` (traversing aborts after this limit).  
  
In offscreen mode, the bounds of the enclosed objects are computed to allocate the offscreen surface, unless `width` and `height` are both greater or equal to 0.  
Enforcing offscreen size is useful when generating textures for later effects.  
  
Offscreen rendering is always done in software.  
  
When enforcing `scaler>1` on a group with `opacity==1`, offscreen rendering will be used and the scaler applied.  
  
When enforcing `width` and `height` on a group with `opacity<1`, the display may be truncated if children objects are out of the offscreen canvas bounds.  
  
## Scenes  
### Properties for `scene` objects  
  

- id (null): scene identifier  
- js ('shape'): scene type, either builtin (see below) or path to a JS module, cannot be animated or updated  
- sources ([]): list of identifiers of sequences or offscreen groups used by this scene  
- width (-1): width of the scene, -1 means reference space width  
- height (-1): height of the scene, -1 means reference space height  
- mix (null): a `transition` object to apply if more than one source is set, ignored otherwise  
- mix_ratio (-1): mix ratio for transition effect, <=0 means first source only, >=1 means second source only  
- volume (1.0): audio volume (0: silence, 1: input volume), this value is not clamped by the mixer.  
- fade ('inout'): indicate how audio should be faded at scene activate/deactivate:  

    - in: audio fade-in when playing first frame after scene activation  
    - out: audio fade-out when playing last frame at scene activation  
    - inout: both fade-in and fade-out are enabled  
    - other: no audio fade  

- autoshow (true): automatically deactivate scene when sequences set in `sources` are not active  
- nosig ('lost'): enable no-signal message for scenes using sequences:  

    - no: disable message  
    - lost: display message when signal is lost  
    - before: display message if source is not yet active  
    - all: always display message if source is inactive  

- styles ([]): list of style IDs to use  
- any other property exposed by the underlying scene JS module.  

  
### Notes  
  
Inputs to a scene, whether `sequence` or offscreen `group`, must be declared prior to the scene itself.  
  
A default scene will be injected if none is found when initially loading the playlist. If you need to start with an empty output, use a scene with no sequence associated.  
  
If a scene uses one or more sequences and `autoshow` is not set, the scene will be drawn with no sequence attached if all sequences are inactive (not yet started or over).  
  
## Transitions and Mixing effects  
### JSON syntax  
  
Properties for `transition` objects:  

- id (null): transition identifier  
- type: transition type, either builtin (see below) or path to a JS module  
- dur: transition duration (transitions always end at source stop time). Ignored if transition is specified for a scene `mix`.  
- fun (null): JS code modifying the ratio effect  
- any other property exposed by the underlying transition module.  

  
### Notes  
  
A `sequence` of two media with playback duration (as indicated in `source`) of D1 and D2 using a transition of duration DT will result in a sequence lasting `D1 + D2 - DT`.  
  
The `JSFun` specified by `fun` takes one argument `ratio` and must return the recomputed ratio.  
  
Example
```
"fun": "return ratio*ratio;"
```  
  
## Timers and animations  
### Properties for `timer` objects  
  

- id (null): id of the timer  
- dur (0): duration of the timer in seconds  
- loop (false): loops timer when `stop` is not set  
- pause (false): pause timer  
- start (-1): start time (see notes), negative value means inactive  
- stop (-1): stop time (see notes), ignored if less than `start`  
- keys ([]): list of keys used for interpolation, ordered list between 0.0 and 1.0  
- anims ([]): list of `animation` objects  

  
### Properties for `animation` objects  
  

- values ([]): list of values to interpolate, there must be as many values as there are keys  
- color (false): indicate the values are color (as strings)  
- angle (false): indicate the interpolation factor is an angle in degree, to convert to radians (interpolation ratio multiplied by PI and divided by 180) before interpolation  
- mode ('linear') : interpolation mode:  

    - linear: linear interpolation between the values  
    - discrete: do not interpolate  
    - other: JS code modifying the interpolation ratio  

- postfun (null): JS code modifying the interpolation result  
- end ('freeze'): behavior at end of animation:  

    - freeze: keep last animated values  
    - restore: restore targets to their initial values  

- targets ([]): list of strings indicating targets properties to modify. Syntax is:  

    - ID@option: modifies property `option` of object with given ID  
    - ID@option[IDX]: modifies value at index `IDX` of array property `option` of object with given ID  

  
### Notes  
  
Currently, only `scene`, `group`, `transition` and `script` objects can be modified through timers (see playlist updates).  
  
The syntax for `start` and  `stop` fields is:  

- `now`: resolves to current UTC clock in `live` mode, and to 0 for non-live mode  
- date: converted to UTC date in `live` mode, and to 0 for non-live mode  
- N: converted to UTC clock at init plus N seconds for `timer` objects (absolute offset from timeline init)  
- "N": converted to current UTC clock plus N seconds (relative offset from current time) with N a positive or negative number  

  
The `JSFun` specified by `mode` has one input parameter `interp` equal to the interpolation factor and must return the new interpolation factor.  
Example
```
"mode":"return interp*interp;" 
```  
  
The `JSFun` specified by `postfun` has two input parameters `res` (the current interplation result) and `interp` (the interpolation factor), and must return the new interpolated value.  
Example
```
"postfun": "if (interp<0.5) return res*res; return res;" 
```  
  
## Scripts  
### Properties for `script` objects  
  

- id (null): id of the script  
- script (null): JavaScript code or path to JavaScript file to execute, cannot be animated or updated  
- active (true): indicate if script is active or not  

  
### Notes  
  
Script objects allow read and write access to the playlist from script. They currently can only be used to modify scenes and groups and to activate/deactivate other scripts.  
  
The `JSFun` function specified by `fun` has no input parameter. The return value (default 0) is the number of seconds (float) to wait until next evaluation of the script.  
  
Example
```
{ "script": "let s=get_scene('s1'); let rot = s.get('rotation'); rot += 10; s.set('rotation', rot); return 2;" }
```  

This will change scene `s1` rotation every 2 seconds   
  
## Watchers  
### Properties for `watcher` objects  
  

- id (null): ID of the watcher  
- active (true): indicate if watcher is active or not  
- watch (""): element watched, formatted as `ID@prop`, with `ID` the element ID and `prop` the property name to watch  
- target (""): action for watcher. Allowed syntaxes are:  

    - `ID@prop`, `ID@prop[idx]`: copy value to property `prop` of the element `ID` (potentially at index `idx` if specified for arrays)  
    - `ID.fun_name`: call function `fun_name` exported from scene module `ID`, using three arguments ['value', 'watchID', 'watchPropName'], no return value check  
    - otherwise: action must be JS code, and the resulting `JSFun` has one argument `value` containing the watched value, and no return value check  

- with (undefined): for targets in the form `ID@prop`, use this value instead of the watched value  

  
### Notes  
  
A watcher can be used to monitor changes in an object in the playlist.  
Any object property that can be animated or updated can be monitored by a watcher.  
  
In addition, the following virtual properties (cannot be read or write) can be watched:  

- sequence.active: value is set to true when sequence is activated, and false when deactivated  
- source.active: value is set to true when source playback starts, and false when source playback stops  
- timer.active: value is set to true when timer starts, and false when timer stops  

  
Only the `active` property can be animated or updated in a watcher.  
  
Example
```
{'watch': 's1@rotation', 'target': 's2@rotation'}
```  

This will copy s1.rotation to s2.rotation.  
  
Example
```
{'watch': 's1@rotation', 'target': 'get_scene('s2').set('rotation', -value); }
``` 

This will copy the -1*s1.rotation to s2.rotation.  
  
### Watching UI events  
  
Watchers can also be used to monitor GPAC user events by setting `watch` to:  

- an event name to monitor, one of `keydown`, `keyup`, `mousemove`, `mouseup`, `mousedown`, `wheel`, `textInput`  
- `events` to monitor all events (including internal events).  

  
For `keyup` and `keydown` events, the key code to watch may additionally be given in parenthesis, e.g. `'watch': 'keyup(T)'`.  
  
_Note: User events are only sent if the output of the filter is consumed by the [vout](vout) filter._  
  
When event monitoring is used, the `target` must be a javascript callback (i.e. it cannot be `ID@prop`).  
The javascript function will be called with a single argument `evt` containing the GPAC event.  
  
Example
```
{'watch': 'mousemove', 'target': 'let s = mouse_over(evt); get_scene('s2').set('fill', (s && (s.id=='s1') ? 'white' : 'black' );'}
```  

This will set s1 fill color to white of mouse is over s2 and to black otherwise.  
  
## Styles  
### Properties for `style` objects  
  

- id (null): ID of the style  
- forced (false): always apply style even when no modifications  
- other: any property to share between scene  

  
### Notes  
  
A style object allows scenes to share the same values for a given set of properties.  
  
If a scene property has the same name as a style property, the scene property is replaced by the style property.  
Styles only apply to scene properties as follows:  

- volume, fade, mix_ratio can use style  
- all options defined by the scene module can use style  
- transformation or other scene properties cannot use style  

  
Properties of a style object can be animated or updated, but a style object cannot be watched.  
  
Styles are applied to each associated scene in order of declaration, e.g. `['st1', 'st2']` and `['st2', 'st1']` will likely give different results.  
  
If `force` is not set for a style, the style is only applied after being modified (load, animation, update); if a scene uses `['st1', 'st2']` and only `st1` is  
modified (animation, update), `st2` will only be applied once.  
  
## Filter configuration  
The playlist may specify configuration options of the filter, using a root object of type 'config':  

- property names are the same as the filter options  
- property values are given in the native type, or as strings for fractions (format `N/D`), vectors (format `WxH`) or enums  
- each declared property overrides the filter option of the same name (whether default or set at filter creation)  

  
A configuration object in the playlist is only parsed when initially loading the playlist, and ignored when reloading it.  
  
The following additional properties are defined for testing:  

- reload_tests([]): list of playlists to reload  
- reload_timeout(1.0): timeout in seconds before playlist reload  
- reload_loop (0): number of times to repeat the reload tests (not including original playlist which is not reloaded)  

  
## Playlist modification  
The playlist file can be modified at any time.  
Objects are identified across playlist reloads through their `id` property.  
Objects that are not present after reloading a playlist are removed from the mixer. This implies that reloading a playlist will recreate most objects with no ID associated.  
  
A `sequence` object modified between two reloads is refreshed, except for its `start` field if sequence active.  
  
A `source` object shall have the same parent sequence between two reloads. Any modification on the object will only be taken into consideration when (re)loading the source.  
  
A `sourceURL` object is not tracked for modification, only evaluated when activating the parent `source` object.  
  
A `scene` or `group` object modified between two reloads is notified of each changed value.  
  
A `timer` object modified between two reloads is shut down and restarted. Consequently, `animation` objects are not tracked between reloads.  
  
A `transition` object may change between two reloads, but any modification on the object will only be taken into consideration when restarting the effect.  
  
A `script` object modified between two reloads has its code re-evaluated  
  
A `watcher` object modified between two reloads has its watch source and code re-evaluated  
  
A `style` object is not tracked (all styles are reloaded when reloading a playlist).  
  
## Playlist example  
  
The following is an example playlist using a sequence of two videos with a mix transition and an animated video area:  
  
Example
```
[  
 {"id": "seq1", "loop": -1, "start": 0,  "seq":  
  [  
   { "id": "V1", "src": [{"in": "s1.mp4"}], "start": 60, "stop": 80},  
   { "id": "V2", "src": [{"in": "s2.mp4"}], "stop": 100}  
  ],  
  "transition": { "dur": 1, "type": "mix"}  
 },  
 {"id": "scene1", "sources": ["seq1"]},  
 {"start": 0, "dur": 10, "keys": [0, 1], "anims":  
  [  
   {"values": [50, 0],  "targets": ["scene1@x", "scene1@y"]},  
   {"values": [0, 100],  "targets": ["scene1@width", "scene1@height"]}  
  ]  
 }  
]
```  
  
# Updates Format  
  
Updates can be sent to modify the playlist, rather than reloading the entire playlist.  
Updates are read from a separate file specified in `updates`, inactive by default.  
  
__Warning: The `updates` file is only read when modified _AFTER_ the initialization of the filter.__  
  
The `updates` file content shall be either a single JSON object or an array of JSON objects.  
The properties of these objects are:  

- skip: if true or 1, ignores the update, otherwise apply it  
- replace: string identifying the target replacement. Syntax is:  

    - ID@name: indicate property name of element with given ID to replace  
    - ID@name[idx]: indicate the index in the property name of element with given ID to replace  

- with: replacement value, must be of the same type as the target value.  

  
An `id` property cannot be updated.  
  
The following playlist elements of a playlist can be updated:  

- scene: all properties except `js` and read-only module properties  
- group: all properties except `scenes` and  `offscreen`  
- sequence: `start`, `stop`, `loop` and `transition` properties  
- timer: `start`, `stop`, `loop`, `pause` and `dur` properties  
- transition: all properties  

    - for sequence transitions: most of these properties will only be updated at next reload  
    - for active scene transitions: whether these changes are applied right away depend on the transition module  

  
Example
```
[  
 {"replace": "scene1@x", "with": 20},  
 {"replace": "seq1@start", "with": "now"}  
]
```  
  
# Scene modules  
  
## Scene `mask`  
This scene sets the canvas alpha mask mode.  
  
The canvas alpha mask is always full screen.  
  
In software mode, combining mask effect in record mode and reverse group drawing allows drawing front to back while writing pixels only once.  
  
Options:  

- mode ('off'): if set, reset clipper otherwise set it to scene position and size  

    - off: mask is disabled  
    - on: mask is enabled and cleared, further draw operations will take place on mask  
    - onkeep: mask is enabled but not cleared, further draw operations will take place on mask  
    - use: mask is enabled, further draw operations will be filtered by mask  
    - use_inv: mask is enabled, further draw operations will be filtered by 1-mask  
    - rec: mask is in record mode, further draw operations will be drawn on output and will set mask value to 0   

   

## Scene `clear`  
This scene clears the canvas area covered by the scene with a given color.   
  
The default clear color of the mixer is `black`.  
  
The clear area is always axis-aligned in output frame, so when skew/rotation are present, the axis-aligned bounding box of the transformed scene area will be cleared.  
  
Options:  

- color ('none'): clear color  


## Scene `clip`  
This scene resets the canvas clipper or sets the canvas clipper to the scene area.  
  
The clipper is always axis-aligned in output frame, so when skew/rotation are present, the axis-aligned bounding box of the transformed clipper will be used.  
  
Clippers are handled through a stack, resetting the clipper pops the stack and restores previous clipper.  
If a clipper is already defined when setting the clipper, the clipper set is the intersection of the two clippers.  
  
Options:  

- reset (false): if set, reset clipper otherwise set it to scene position and size  
- stack (true): if false, clipper is set/reset independently of the clipper stack (no intersection, no push/pop of the stack)  


## Scene `shape`  
This scene can be used to setup a shape, its outline and specify the fill and strike modes.  
Supported shapes include:  

- a variety of rectangles, ellipse and other polygons  
- custom paths specified from JS  
- text  

  
The color modes for shapes and outlines include:  

- texturing using data from input media streams (shape fill only)  
- texturing using local JPEG and PNG files (shape fill only)  
- solid color  
- linear and radial gradients  

  
The default scene is optimized to fallback to fast blit when no transformations are used on a straight rectangle shape.  
  
All options can be updated at run time.  
  
The module accepts 0, 1 or 2 sequences as input.  
  
Color replacement operations can be specified for base scenes using source videos by specifying the `replace` option. The replacement source is:  

- the image data if `img` is set, potentially altered using `*_rep` options  
- otherwise a linear gradient if `fill=linear` or a radial gradient if `fill=radial` (NOT supported in GPU mode, use an offscreen group for this).  

  
__Warning: Color replacement operations cannot be used with transition or mix effects.__  
  
## Text options   
  
Text can be loaded from file if `text[0]` is an existing local file.  
By default all lines are loaded. The number of loaded lines can be specified using `text[1]` as follows:  

- 0 or not present: all lines are loaded  
- N > 0: only keep the last N lines  
- N < 0: only keep the first N lines  

  
Text loaded from file will be refreshed whenever the file is modified.  
  
Predefined keywords can be used in input text, identified as `$KEYWORD$`. The following keywords (case insensitive) are defined:  

- time: replaced by UTC date  
- ltime: replaced by locale date  
- date: replaced by date (Y/M/D)  
- ldate: replaced by locale date (Y/M/D)  
- mtime: replaced by output media time   
- mtime_SRC: replaced by media time of input source `SRC`   
- cpu: replaced by current CPU usage of process  
- mem: replaced by current memory usage of process  
- version: replaced by GPAC version  
- fversion: replaced by GPAC full version  
- P4CC, PropName: replaced by corresponding PID property  

  
## Custom paths  
  
Custom paths (shapes) can be created through JS code indicated in 'shape', either inline or through a file.  
The following GPAC JS modules are imported:  

    - `Sys` as `sys`  
    - All EVG as `evg`  
    - `os` form QuickJS  

  
See [https://doxygen.gpac.io]() for more information on EVG and Sys JS APIs.  
  
The code is exposed the scene as `this`. The variable `this.path` is created, representing an empty path.  
Example
```
"shape": "this.path.add_rectangle(0, 0, this.width, this.height); let el = new evg.Path().ellipse(0, 0, this.width, this.height/3); this.path.add_path(el);"
```  
  
The default behaviour is to use the shape width and height as reference size for texture mapping.  
If your custom path is textured, with bounding rectangle size different from the indicated shape size, set the variable `this.tx_adjust` to true.  
  
In the previous example, the texture mapping will not be impacted by the custom path size.  
  
Example
```
"shape": "this.path.add_rectangle(0, 0, this.width, this.height); let el = new evg.Path().ellipse(0, 0, this.width, this.height/3); this.path.add_path(el); this.tx_adjust = true;"
```  

In this example, the texture mapping will be adjusted to the desired size.  
  
The global variables and functions are available (c.f. `gpac -h avmix:global`):  

    - get_media_time(): return media time in seconds (float) of output  
    - get_media_time(SRC): get time of source with id `SRC`, return -4 if not found, -3 if not playing, -2 if in prefetch, -1 if timing not yet known, media time in seconds (float) otherwise  
    - current_utc_clock: current UTC time in ms  
    - video_time: output video time  
    - video_timescale: output video timescale  
    - video_width: output video width  
    - video_height: output video height  

  
If your path needs to be reevaluated on regular basis, set the value `this.reload` to the timeout to next reload, in milliseconds.  
  
Options:  

- rx (0): horizontal radius for rounded rect in percent of object width if positive, in absolute value if negative, value `y` means use `ry`  
- ry (0): vertical radius for rounded rect in percent of object height if positive, in absolute value if negative, value `x` means use `rx`  
- tl (1): top-left corner scaler (positive, 0 disables corner)  
- bl (1): bottom-left corner scaler (positive, 0 disables corner)  
- tr (1): top-right corner scaler (positive, 0 disables corner)  
- br (1): bottom-right corner scaler (positive, 0 disables corner)  
- rs (false): repeat texture horizontally  
- rt (false): repeat texture vertically  
- keep_ar (true): keep aspect ratio  
- pad_color ('0x00FFFFFF'): color to use for texture padding if `rs` or `rt` are false. Use `none` to use texture edge, `0x00FFFFFF` for transparent (always enforced if source is transparent)  
- txmx ([]): texture matrix - all 6 coefficients must be set, i.e. [xx xy tx yx yy ty]  
- cmx ([]): color transform - all 20 coefficients must be set in order, i.e. [Mrr, Mrg, Mrb, Mra, Tr, Mgr, Mgg ...]  
- line_width (0): line width in percent of width if positive, or absolute value if negative  
- line_color ('white'): line color, `linear` for linear gradient and `radial` for radial gradient  
- line_pos ('center'): line/shape positioning. Possible values are:  

    - center: line is centered around shape  
    - outside: line is outside the shape  
    - inside: line is inside the shape  

- line_dash ('plain'): line dashing mode. Possible values are:  

    - plain: no dash  
    - dash: predefined dash pattern is used  
    - dot:  predefined dot pattern is used  
    - dashdot:  predefined dash-dot pattern is used  
    - dashdashdot:  predefined dash-dash-dot pattern is used  
    - dashdotdot:  predefined dash-dot-dot pattern is used  

- dashes ([]): dash/dot pattern lengths for custom dashes (these will be multiplied by line size)  
- cap ('flat'): line end style. Possible values are:  

    - flat: flat end  
    - round: round end  
    - square: square end (extends limit compared to flat)  
    - triangle: triangle end  

- join ('miter'): line joint style. Possible values are:  

    - miter: miter join (straight lines)  
    - round: round join  
    - bevel: bevel join  
    - bevelmiter: bevel+miter join  

- miter_limit (2): miter limit for joint styles  
- dash_length (-1): length of path to outline, negative values mean full path  
- dash_offset (0): offset in path at which the outline starts  
- blit (true): use blit if possible, otherwise EVG texturing. If disabled, always use texturing  
- fill ('none'): fill color if used without sources, `linear` for linear gradient and `radial` for radial gradient  
- img (''): image for scene without sources or when `replace` is set. Accepts either a path to a local image (JPG or PNG), the ID of an offscreen group or the ID of a sequence  
- alpha (1): global texture transparency  
- replace (''): if `img` or `fill` is set and shape is using source, set multi texture option. Possible modes are:  

    - a, r, g or b: replace alpha source component by indicated component from `img` . If prefix `-` is set, replace by one minus the indicated component  
    - m: mix using `mix_ratio` the color components of source and `img` and set alpha to full opacity  
    - M: mix using `mix_ratio` all components of source and `img`, including alpha  
    - xC: mix source 1 and source 2 using `img` component `C` (`a`, `r`, `g` or `b`) and force alpha to full opacity  
    - XC: mix source 1 and source 2 using `img` component `C` (`a`, `r`, `g` or `b`), including alpha  

  

- shape ('rect'): shape type. Possible values are:  

    - rect: rounded rectangle  
    - square: square using smaller width/height value  
    - ellipse: ellipse  
    - circle: circle using smaller width/height value  
    - rhombus: axis-aligned rhombus  
    - text: force text mode even if text field is empty  
    - rects: same as rounded rectangle but use straight lines for corners  
    - other value: JS code for custom path creation, either string or local file name (dynamic reload possible)  

- grad_p ([]): gradient positions between 0 and 1  
- grad_c ([]): gradient colors for each position, as strings  
- grad_start ([]): start point for linear gradient or center point for radial gradient  
- grad_end ([]): end point for linear gradient or radius value for radial gradient  
- grad_focal ([]): focal point for radial gradient  
- grad_mode ('pad'): gradient mode. Possible values are:  

    - pad: color padding outside of gradient bounds  
    - spread: mirror gradient outside of bounds  
    - repeat: repeat gradient outside of bounds  

- text ([]): text lines (UTF-8 only). If not empty, force `shape=text`  
- font ([]): font name(s)  
- size (20): font size in percent of height (horizontal text) or width (vertical text), or absolute value if negative  
- baseline ('alphabetic'): baseline position. Possible values are:  

    - alphabetic: alphabetic position of baseline  
    - top: baseline at top of EM Box  
    - hanging: reserved, _not implemented_  
    - middle: baseline at middle of EM Box  
    - ideograph: reserved, _not implemented_  
    - bottom: baseline at bottom of EM Box  

- align ('center'): horizontal text alignment. Possible values are:  

    - center: center of shape  
    - start: start of shape (left or right depending on text direction)  
    - end: end of shape (right or left depending on text direction)  
    - left: left of shape  
    - right: right of shape  

- spacing (0): line spacing in percent of height (horizontal text) or width (vertical text), or absolute value if negative  
- bold (false): use bold version of font  
- italic (false): use italic version of font  
- underline (false): underline text  
- vertical (false): draw text vertically  
- flip (false): flip text vertically  
- extend (0): maximum text width in percent of width (for horizontal) or height (for vertical), or absolute value if negative  
- keep_ar_rep (true): same as `keep_ar` for local image in replace mode  
- txmx_rep ([]): same as `txmx` for  local image in replace mode  
- cmx_rep ([]): same as `cmx` for local image in replace mode  
- pad_color_rep ('none'): same as `pad_color` for local image in replace mode  
- rs_rep (false): same as `rs` for local image in replace mode  
- rt_rep (false): same as `rt` for local image in replace mode  


# Transition modules  
  
## Transition `gltrans` - GPU only  
This transition module wraps gl-transitions, see https://gl-transitions.com/ and `gpac -h avmix:gltrans` for builtin transitions  
Options:  

- fx (''): effect name for built-in effects, or path to gl-transition GLSL file  


## Transition `swipe` - software/GPU  
This transition performs simple 2D affine transformations for source videos transitions, with configurable effect origin  
Options:  

- from ('left'): direction of video 2 entry. Possible values are:  

    - left: from left to right edges  
    - right: from right to left edges  
    - top: from top to bottom edges  
    - bottom: from bottom to top edges  
    - topleft: from top-left to bottom-right corners  
    - topright: from top-right to bottom-left corners  
    - bottomleft: from bottom-left to top-right corners  
    - bottomright: from bottom-right to top-left corners  

  

- mode ('slide'): how video 2 entry impacts video 1. Possible values are:  

    - slide: video 1 position is not modified  
    - push: video 2 pushes video 1 away  
    - squeeze: video 2 squeezes video 1 along opposite edge  
    - grow: video 2 size increases, video 1 not modified  
    - swap: video 2 size increases, video 1 size decreases  

  
## Transition `mix` - software/GPU  
This transition performs cross-fade of source videos  

## Transition `fade` - software/GPU  
This transition performs fade to/from color of source videos  
Options:  

- color ('black'): fade color  

  

# Options    
  
<a id="pl">__pl__</a> (str, default: _avmix.json_): local playlist file to load  
<a id="live">__live__</a> (bool, default: _true_): live mode  
<a id="gpu">__gpu__</a> (enum, default: _off_): enable GPU usage  

- off: no GPU  
- mix: only render textured path to GPU, use software rasterizer for the outlines, solid fills and gradients  
- all: try to use GPU for everything  
  
<a id="thread">__thread__</a> (sint, default: _-1_): use threads for software rasterizer (-1 for all available cores)  
<a id="lwait">__lwait__</a> (uint, default: _1000_): timeout in ms before considering no signal is present  
<a id="ltimeout">__ltimeout__</a> (uint, default: _4000_): timeout in ms before restarting child processes  
<a id="maxdur">__maxdur__</a> (dbl, default: _0_): run for given seconds and exit, will not abort if 0 (used for live mode tests)  
<a id="updates">__updates__</a> (str): local JSON files for playlist updates  
<a id="maxdepth">__maxdepth__</a> (uint, default: _100_): maximum depth of a branch in the scene graph  
<a id="vsize">__vsize__</a> (v2d, default: _1920x1080_): output video size, 0 disable video output  
<a id="fps">__fps__</a> (frac, default: _25_): output video frame rate  
<a id="pfmt">__pfmt__</a> (pfmt, default: _yuv_): output pixel format. Use `rgba` in GPU mode to force alpha channel  
<a id="dynpfmt">__dynpfmt__</a> (enum, default: _init_): allow dynamic change of output pixel format in software mode  

- off: pixel format is forced to desired value  
- init: pixel format is forced to format of fullscreen input in first generated frame  
- all: pixel format changes each time a full-screen input PID at same resolution is used  
  
<a id="sr">__sr__</a> (uint, default: _44100_): output audio sample rate, 0 disable audio output  
<a id="ch">__ch__</a> (uint, default: _2_): number of output audio channels, 0 disable audio output  
<a id="afmt">__afmt__</a> (afmt, default: _s16_): output audio format (only s16, s32, flt and dbl are supported)  
<a id="alen">__alen__</a> (uint, default: _1024_): default number of samples per frame  
  
