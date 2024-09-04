# Overview {:data-level="all"}

We discuss here how to use the AVMix filter to do offline or live video editing.
This filter is a [JS filter](jsf) and can be modified fairly simply.
The [AVMix scripts](https://github.com/gpac/testsuite/tree/master/media/avmix) in the gpac test suite are also a good source of examples.

Before reading any further, read the filter [documentation](avmix) !

The filter is playlist based, using a JSON format. We assume the name of your playlist is `avmix.json`, which is the default name expected by the filter.


The filter outputs raw (uncompressed) audio and video, which can be later used in a filter chain. 

To play the result:
```
#audio only
gpac avmix aout
#video only
gpac avmix vout
#audio-video
gpac -play avmix
gpac avmix aout vout
```

To encode the result:

`gpac avmix enc:c=avc:b=1m enc:c=aac:b=128k record.mp4`

By default, the filter will run in live mode, and will never stop. You can run in offline using [live=0](avmix#live) option, or using a `config` object in the playlist:
```
{"type": "config", "live": false}
```


# General concepts {:data-level="beginner"}
## Declaring media

To declare media for the mixer, you need to use a sequence object along with your media source. Typically:
```
[
{"seq":
 [
  { "src": [{"in": "media.mp4"}]}
 ]
}
]
```

Your media can be any URL supported by GPAC, not simply local files.

The default behavior is to play once the media, from its beginning to its end.  To play a given time range:

```
[
{ "id": "seq1", "seq":
 [
  { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5}
 ]
}
]
```

_Note: Media cannot play in loop, only sequences can._

This basic playlist can now be played, it will result in a possible resizing of the video and/or resampling of the audio.

In case your media comes from several sources (e.g., video in one file, audio in the other), you will have to specify as many inputs as needed:

```
[
{ "id": "seq1", "seq":
 [
  { "src": [
	{"in": "media_video.mp4"}
	{"in": "media_audio.mp3"}
  ], "start": 1, "stop": 5}
 ]
}
]
```

The formats and protocols used by the different inputs do not have to be the same.
The synchronization is done by assuming that the first media frame received corresponds to the desired start time, this might be further improved in the future.

## Declaring a scene

In the previous example, a default scene was created when loading the playlist. We will now create our own scene to draw the video in a rounded rectangle, over a blue background:


```
[
{ "id": "seq1", "seq":
 [
  { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5}
 ]
},
{"id": "scene0", "js": "clear", "color": "cyan"}, 
{"id": "scene1", "sources": ["seq1"], "x": 0, "y": 0, "width": 60, "height": 60, "rx":10, "ry":"x"} 
]
```

Dimensions and coordinates are given in percent of the output size, the origin `{x=0,y=0}` of the scene being the center of the output frame. 

_Note_
A sequence not attached with a scene will not be visible nor played, even if active.

Now let's add :

- a logo
- a bottom rectangle with a gradient
- some text

```
[
{ "id": "seq1", "seq":
 [
  { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5}
 ]
},
{"js": "clear", "color": "cyan"}, 
{"sources": ["seq1"], "x": -5, "y": 5, "width": 90, "height": 90, "rx":10, "ry":"x"},
{"x": 45, "y": 40, "width": 10, "height": "width", "img":"logo.png", "alpha":0.5},
{"x": 0, "y": -45, "width": 100, "height": 10, "fill":"linear", "grad_p": [0, 0.5, 1], "grad_c": ["none", "white", "red"]},
{"x": 0, "y": -45, "width": 100, "height": 10, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"}
]
```

For more information on the default `shape` scene and its multiple capabilities, see [gpac -h avmix:shape](avmix#scene-shape).
 
In the following examples, we always use [relative coordinates system](avmix#coordinate-system), but you can also specify coordinates and dimensions in pixels using [`units` property](avmix#common-properties-for-group-and-scene-objects).

## Animating a scene

Scenes can be animated through timer objects providing value interpolation instructions. A timer provides:

- a start time, stop time and a loop count
- a duration for the interpolation period
- a set of animation values and their targets

In order to use a timer with a scene, we need a scene ID.

Let's move our logo and blink our text !

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ]},
{"js": "clear", "color": "cyan"},
{"sources": ["seq1"], "x": -5, "y": 5, "width": 90, "height": 90, "rx":10, "ry":"x"},
{"id": "logo", "x": 45, "y": 40, "width": 10, "height": "width", "img":"logo.png", "alpha":0.5},
{"x": 0, "y": -45, "width": 100, "height": 10, "fill":"linear", "grad_p": [0, 0.5, 1], "grad_c": ["none", "white", "red"]},
{"id": "text", "x": 0, "y": -45, "width": 100, "height": 10, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"},

{"start": 0, "loop": true, "dur": 2, "keys": [0, 0.5, 1], "anims": [
    {"values": [true, false, true], "targets": ["text@active"], "mode": "discrete"},
    {"values": [40, -30, 40], "targets": ["logo@y"], "mode": "interp = interp*interp*interp;"}
 ]
}
]
```

We blink the text by simply activating or deactivating the associated scene, using discrete interpolation. This avoids invalidating the underlying vector graphics data.
We also use here a pre-interpolation custom function to modify the interpolation factor rather than the simpler `linear` mode. 
If you need to animate multiple targets with the same value, simply add more targets, e.g. `"targets": ["logo@x", "logo@y"]`.
 
## Grouping scenes

### Transforming multiple scenes
It can be tedious to apply the same transformation (matrix, active, ...) on a subset of the scenes, as you will need to update many parameters in a timer for example.
The simplest way to do this is to group scenes together, and transform the group.

The following animates:

- the video from 90% to 100% , sticking it to the top-left corner and animated the rounded rectangle effect
- the overlay group position from visible to hidden past the bottom-right corner


```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{"js": "clear", "color": "cyan"},
{"id":"v1", "sources": ["seq1"], "x": -5, "y": 5, "width": 90, "height": 90, "rx":10, "ry":"x"},

{"id": "gr1", "scenes": [
{"id": "logo", "x": 45, "y": 40, "width": 10, "height": "width", "img":"logo.png", "alpha":0.5},
{"x": 0, "y": -45, "width": 100, "height": 10, "fill":"linear", "grad_p": [0, 0.5, 1], "grad_c": ["none", "white", "red"]},
{"id": "text", "x": 0, "y": -45, "width": 100, "height": 10, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"}
]},

{"start": 0, "loop": true, "dur": 2, "keys": [0, 0.5, 1], "anims": [
    {"values": [10, 0, 10], "targets": ["v1@rx"]},
    {"values": [-5, 0, -5], "targets": ["v1@x"]},
    {"values": [5, 0, 5], "targets": ["v1@y"]},
    {"values": [90, 100, 90], "targets": ["v1@width", "v1@height"]},

    {"values": [0, 20, 0], "targets": ["gr1@x"]},
    {"values": [0, -20, 0], "targets": ["gr1@y"]}
 ]
}
```

### Group opacity

Grouping is also needed when you define an overlay composed of several shapes and want a global transparency on this overlay; in such cases, setting alpha on each scene will not achieve the same result, as objects will blend over the previously drawn canvas.

A group with `opacity` less than 1 will be rendered offscreen and drawn with the desired alpha value: 

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{"id":"v1", "sources": ["seq1"]},

{"id": "gr1", "y": -45, "opacity": 0.5, "scenes": [
{"width": 100, "height": 10, "fill":"green"},
{"y": -3, "width": 90, "height": 2, "fill":"white"},
{"width": 100, "height": 10, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"}
]}
]
```

You can also use the `scaler` property to change the offscreen resolution of the group, to create a pixelated effect, here combined with opacity changing: 

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{"id":"v1", "sources": ["seq1"]},

{"id": "gr1", "y": -45, "opacity": 0.5, "scenes": [
{"width": 100, "height": 10, "fill":"green"},
{"y": -3, "width": 90, "height": 2, "fill":"white"},
{"width": 100, "height": 10, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"}
]},

{ "start": 0, "loop": true, "dur":2, "keys": [0, 0.5, 1], "anims": [
	{"values": [1, 20, 1], "targets": ["gr1@scaler"] },
	{"values": [1, 0, 1], "targets": ["gr1@opacity"] }
] }
]
```

### Group or scene re-use

A group object can act as a re-use of an existing scene or group in a different transformation hierarchy, through the `use` property. In case this reuse result in a recursive draw, the `use_depth` property allows you to control how many recursions shall be drawn.
 
The following example shows a simple fractal pattern with 20 recursions:

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{"id":"v1", "sources": ["seq1"]},

{"id": "gr1", "scenes": [
{"width": 20, "height": "width", "fill":"none", "line_color": "red", "line_width": 2},
{"use": "gr1", "vscale":0.85, "hscale":0.85, "rotation":10, "use_depth": 20}
]}
]
```

This works with video scenes too:

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{"id": "gr1", "scenes": [
{"id":"v1", "sources": ["seq1"]},
{"use": "gr1", "vscale":0.85, "hscale":0.85, "rotation":10, "use_depth": 20}
]}
]
```


 
## Media Sequences
### Transitions

You will at some point need to chain some videos. AVMix handles this through `sequence` objects describing how sources are to be chained.
Sequences are designed to:

- take care of media prefetching to reduce loading times
- perform transitions between sources, activating / prefetching based on the desired transition duration

For example, to create a sequence repeated twice with two source and a cross-fade transition:

```
[
{ "id": "seq1", "loop": 1, "seq":
 [
  { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5},
  { "src": [{"in": "media2.mp4"}], "start": 600, "stop": 660}
 ],
 "transition": { "type": "mix", "dur": 2}
},
{"id": "scene0", "js": "clear", "color": "cyan"}, 
{"id": "scene1", "sources": ["seq1"], "width": 80, "height": 80, "rx":10, "ry":"x"} 
]
```

### Mixing

There are many cases where one needs to mix videos running in parallel with a given amount of mix effect.
AVMix handles this by allowing scenes to use more than one sequence as input, and mix the videos from these sequences.

_Note: Currently, defined scenes only support 0, 1 or 2 input sequences_

This is done at scene declaration through:

- a `mix` object, describing a transition
- a `mix_ratio` property, describing the transition ratio

The `mix_ratio` property can of course be animated:  
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "seq2", "seq": [ { "src": [{"in": "s2.mp4"}], "start": 220, "stop": 230} ] },

{"id": "scene0", "js": "clear", "color": "cyan"}, 
{"id": "scene1", "sources": ["seq1", "seq2"], "width": 80, "height": 80, "rx":10, "ry":"x",
	"mix": { "type": "mix", "dur": 2}, 
	"mix_ratio": 0.5
},

{"start": 0, "loop": true, "dur": 2, "keys": [0, 0.5, 1], "anims":
 [
  {"values": [0, 1, 0], "targets": ["scene1@mix_ratio"]}
 ]
}
]
```

## Playlist updates

The playlist file will be updated whenever modified. This is mostly used for live mode, but can be used in offline mode.

When updating a playlist, you must assign IDs to root elements of the playlist in order to identify them across reloads.
For example, load:

```
[
{"seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] }
]
```

then load (updating `loop` parameter):
```
[
{"seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] , "loop": "x"}
]
```

Upon reloading, the initial sequence won't be find in the new playlist, so associated sources will be stopped and new sequence will be evaluated.
Specifying an identifier on the sequence avoids that.


 
## Live mode

Live mode works like offline mode, with the following additions:

- detection and display of signal lost or no input sequences
- `sequence` and `timer` start and stop time can be expressed as UTC dates (absolute) or current UTC offset

Let's load the following

```
[
{ "id": "seq1", "start": -1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "scene1", "sources": ["seq1"]}
]
```

You should now see "no input" message when playing. Without closing the player, reload playlist by modifying `start` to `"now"`:

```
[
{ "id": "seq1", "start": "now", "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "scene1", "sources": ["seq1"]}
]
```

And the video sequence will start ! You can use for start and stop time values:

- "now": will resolve to current UTC time
- integer: will resolve to current UTC time plus the number of seconds specified by the integer
- date: will use the date as the start/stop time

 
# Some examples {:data-level="beginner"}
## Transparent Logo insertion

Simplified version of above example, with a single source and logo

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}] } ] },
{"sources": ["seq1"]},
{"x": 45, "y": 40, "width": 10, "height": "width", "img":"logo.png", "alpha":0.5}
]
```

## Text insertion

Here we insert a text at the top of the video, with black fill color and white outline 
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}] } ] },
{"sources": ["seq1"]},
{"x": 0, "y": 45, "width": 100, "height": 10, "text": ["Some nice text !"], "size": 60, "fill": "black", "line_width": -2, "line_color": "white"}
]
```


## Dynamic text insertion

Here we insert a text read from file "input.txt". The text file can be modified while the filter runs to update the text. We only use the last 2 lines of the text file
```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4"}] } ] },
{"sources": ["seq1"], "x": 0, "y": 0, "width": 100, "height": 100},
{"x": 0, "y": 45, "width": 100, "height": 10, "text": ["input.txt", 2], "size": 60, "fill": "black", "line_width": -2, "line_color": "white"}
]
```

## Dynamic path

Here we use a dynamic path construction in JS, creating an ellipse with size varying from {0,0} to {2*width,2*height} based on the source timing, reloaded at each frame (assuming 25 fps).
```
[
{ "id": "seq1", "seq": [ { "id": "s1", "src": [{"in": "media.mp4"}] } ] },
{"id": "scene0", "js": "clear", "color": "cyan"}, 
{"sources": ["seq1"], "shape":"let time_sec = 2*((100*get_media_time('s1')) % 100) / 100; this.path.ellipse(0, 0, this.width*time_sec, this.height*time_sec); this.reload=40;"}
]
```

## Mosaic

Here we construct a mosaic of 4 videos, all muted

```
[
{ "id": "seq1", "seq": [ {"src": [{"in": "media1.mp4"}] } ] },
{ "id": "seq2", "seq": [ {"src": [{"in": "media2.mp4"}] } ] },
{ "id": "seq3", "seq": [ {"src": [{"in": "media3.mp4"}] } ] },
{ "id": "seq4", "seq": [ {"src": [{"in": "media4.mp4"}] } ] },

{"sources": ["seq1"], "x": -25, "y": 25, "width": 50, "height": 50, "volume":0},
{"sources": ["seq2"], "x": 25, "y": 25, "width": 50, "height": 50, "volume":0},
{"sources": ["seq3"], "x": -25, "y": -25, "width": 50, "height": 50, "volume":0},
{"sources": ["seq4"], "x": 25, "y": -25, "width": 50, "height": 50, "volume":0}
]
```


# Advanced topics
## Source monitoring

If your sources are unreliable and lead to crashes or failures in the demultiplexing or decoding pipeline, this usually result to gpac exiting with failure.
This is problematic if you use AVMix to generate a live feed supposed to be up 24/7.

To prevent this, the filter allows launching the sources as dedicated child processes. When the child process exits unexpectedly, or when source data is no longer received, the filter can then kill and relaunch the child process.

There are three supported methods for this:

- running a gpac instance over a pipe
- running a gpac instance over TCP
- running any other process capable of communicating with gpac

The declaration is done at the `sourceURL` level through the port option.

For each of these mode, the `keep_alive` option is used to decide if the child process shall be restarted:

- if no more data is received after `rtimeout`.
- stream is in end of stream but child process exited with an error code greater than 2.

The default behavior for pipe and TCP modes is to use raw (uncompressed) data exchange, as usually unexpected issues come from a mix of demultiplexing/decoding.

### Pipe example

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4", "port": "pipe"} ] } ] }
]
```

### TCP example
We use keep-alive and force the child gpac process to crash after 1s. We specify `seek` here to try to restart the source at the estimated elapsed time since our source is on demand.

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "media.mp4", "port": "tcp", "opts": "-runfors=1000"} ], "keep_alive":true, "seek":true } ] }
]
```

### Generic process example
In this example, the generic process is gpac, delivering over a pipe an MPEG-2 TS stream.

```
[
{ "id": "seq1", "seq": [ { "src": [{"in": "gpac -i media.mp4 -o pipe://gpipe:ext=ts", "port": "pipe://gpipe:mkp"} ] } ] }
]
```

## Playlist updates

A playlist can be modified through updates, in order to avoid reloading a complete playlist for simple modifications.

To simplify the workflow, the playlist update is done through a dedicated file, so that you only update the playlist for consequent changes such as adding/removing media, scene and groups.

Updates file is specified by the `updates` option of the filter, and reloaded whenever modified.

To update a scene position:  
```
[
{ "replace": "scene1@x", "with": 100},
{ "replace": "scene1@y", "with": 100}
]
```

To start an inactive sequence and a timer 4s after
```
[
{ "replace": "seq1@start", "with": "now"},
{ "replace": "timer1@start", "with": 4}
]
```

To update a transition on a sequence:  
```
[
{ "replace": "seq1@transition", "with": {"type": "fade", "color": "white"}}
]
```

## Scripting
### Simple scripting

It is possible to embed scripts to be executed, either at each frame or on a script-driven timeout.


```
[
{ "id": "seq1", "start": -1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "s1", "sources": ["seq1"]}

{ "script": "file.js"}
]
```

This will load the content of `file.js` and execute it. The `script` objects are designed for very simple scripts, with no possible function definitions and module import.

Now let's code the script. Globals used for most scripts are explained in [gpac -h avmix:playlist](avmix#scripts).
Our script changes a scene rotation every 2.5 seconds.

```
//get a scene
let s = get_scene("s1");
//get current rotation value
let rot = s.get("rotation");
rot += 10;
if (rot>360) rot=0;
//set new rotation value
s.set("rotation", rot);
//ask to be updated in 2.5 seconds
return 2.5;
```

### Complex scripting

If your script requires external modules and performs quite complex things, you will need to use a JS scene module not drawing anything.

```
[
{ "id": "seq1", "start": -1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "s1", "sources": ["seq1"]}

{ "js": "mymodule.js"}
]
```

The `mymodule.js` script will need to export a `load` function returning an object implementing a `update` function. All other callbacks are not needed if you don't draw.
 
```
//content of mymodule.js
import {XMLHttpRequest} from 'xhr'

export function load() { return {

rot: 0,
next: 0,

update: function()
{
//manage how often you want to perform our tasks, here only once every 2 seconds
if (this.next>video_time) return 0;
this.next += 2*video_timescale;

print('In callback !');
//do your logic here, XHR and co - here we force rotation on scene 's1'

this.rot += 10;
if (rot>360) rot=0;
//set new rotation value
let s = get_scene("s1").set("rotation", rot);

//always return 0 meaning "don't draw scene"
return 0;
}


}; }

```
 
Your module can also control the playlist through several functions:

- remove_element(id_or_elem): removes a scene, group or sequence from playlist
- parse_element(JSON_obj): parses a root JSON object and add to the playlist
- parse_scene(JSON_obj, parent_group): parses a scene from its JSON object and add it to parent_group, or to root if parent_group is null
- parse_group(JSON_obj, parent_group): parses a group from its JSON object and add it to parent_group, or to root if parent_group is null
- reload_playlist(JSON_obj): parses a new playlist from its JSON object. If the calling scene is no longer in the resulting scene tree, it will be added to the root of the scene tree.

__Warning All these functions MUST be called from within the `update()` function.__


```
//resets a playlist to empty, but our module update() function will still be called after that
reload_playlist([]);

//reloads a playlist to something different
reload_playlist(
[
	//new sequence
	{"id": "seq2", "start": 0, "loop": -1, "seq": [ {"src": [{"in": "media2.mp4", "media":"v"}] } ]},
	//new scene
	{"id": "s1", "sources": ["seq2"], "width": 60, "height": 60, "shape": "ellipse"}
]);

//remove a sequence: the associated scene will no longer display the video
remove_element("seq1");

//insert a sequence with same ID as removed one: the associated scene will now display the new sequence
let seq = {"id": "seq1", "start": 0, "loop": -1, "seq": [ {"src": [{"in": "media2.mp4", "media":"v"}]} ]};
parse_playlist_element(seq);


//removes a scene
remove_element("s1");

//insert a scene in a given group, using an already running sequence
let scene_json = {"id": "s1", "sources": ["seq1"], "width": 60, "height": 60, "shape": "ellipse"};
let g = get_group("g1");
let new_scene = parse_scene(scene_json, g);
//if needed, move new_scene at desired location in g.scenes
```

A script can also modify elements of a playlist.
- Scene and group objects can be retrieved using `get_scene` and `get_group`, and properties can be accessed through `elt.get('propName')` and set through `elt.set('propName', value)`.
- Other elements cannot be directly access, but their properties can be queried and updated: 
  - use  `query_element(id, 'propName')` to query a property value on an element (returns property if success, undefined otherwise). The returned property shall not be modified.
  - use  `update_element(id, 'propName', value)` to modify a property (returns true if success, false otherwise).

Note that the `update_element` and  `query_element` functions can also be used on groups and scenes.

For example, to pause and resume a timer with ID `t1`, use
```
//pauses the timer
update_element('t1', 'pause', true);
//resumes the timer
update_element('t1', 'pause', false);
``` 


## Offscreen groups

Groups can be defined to be offscreen and reused later on. 
Offscreen groups are only redrawn whenever a change in the child scene happens.

There are two common places where an offscreen group can be used, as detailed below.
In both cases, the offscreen group is handled as a regular sequence for texturing and will follows parent coordinate system transformations.

### As input source to a scene
By listing the offscreen group ID in the `sources` array of a scene, you instruct the scene to use the offscreen group as if it was a sequence.
This allows applying transition effects between a video source and an offscreen source.

 

The following shows a cross-fade between the two:

```
[
{ "id": "seq1", "loop": 1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },

{"id": "gr1", "offscreen":"color", "width": 20, "height": 20, "reference": true, "scenes": [
{"width": 100, "height": 100, "fill":"white"},
{"y": -40, "width": 90, "height": 20, "fill":"red"},
{"width": 100, "height": 40, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"}
]},

{"id":"v1", "sources": ["seq1", "gr1"], "mix": {"type":"mix"}, "mix_ratio":0.5 },


{ "start": 0, "loop": true, "dur":2, "keys": [0, 0.5, 1], "anims": [
	{"values": [1, 0, 1], "targets": ["v1@mix_ratio"] }
] }

]
```

Note that we change the reference coordinate system in this example, so that scenes in the offscreen group are given in percent of the group offscreen size and not in percent of the output frame size. 

In this mode, the texturing parameters used by the offscreen group are the same as the ones applying to a regular sequence.

### As additional input to scene modules

The [shape](avmix#scene-shape) module allows specifying a replacement image  `img`  along with some replacement operations  `replace`. The image can be a sequence or an offscreen group. 

 
The following shows a cross-fade of two inputs using an offscreen group in alphagrey color mode as the source for alpha blending value:

```
[
{ "id": "seq1", "loop": 1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "seq2", "loop": 1, "seq": [ { "src": [{"in": "media2.mp4"}], "start": 0, "stop": 10} ] },

{"id": "gr1", "offscreen":"mask", "width": 20, "height": 20, "reference": true, "scenes": [
	{"id": "b1", "width": 100, "height": 100, "fill":"white"},
	{"y": -40, "width": 90, "height": 20, "fill":"red"},
	{"width": 100, "height": 40, "text": ["Super Text"], "size": 50, "align": "center", "fill": "black"}
]},

{"id":"v1", "sources": ["seq1", "seq2"], "img": "gr1", "replace":"xa"},


{ "start": 0, "loop": true, "dur":2, "keys": [0, 0.5, 1], "anims": [
	{"values": [1, 0, 1], "targets": ["b1@alpha"] }
] }
]
```

In this mode, the texturing parameters used by the offscreen group can be modified using the properties `*_rep`of the shape object.


## Masking

AVMix can use a global alpha mask (covering the entire output frame) for draw operations, through the [mask](avmix#scene-mask) scene module.

This differs from using an offscreen group as an alpha operand input to [shape](avmix#scene-shape) as discussed above as follows:

- the mask is global and not subject to any transformation
- the mask is always cleared at the beginning of a frame
- the mask is only one alpha channel
- the mask operations can be accumulated between draws

The following example shows using a mask in regular mode:

- enable and clear mask
- draw a circle with alpha 0.4
- use mask and draw video, which will be blended only where the circle was drawn using alpha= 0.4
- enable mask without clearing
- draw the same circle at the same place with alpha 0.4, resulting in composite alpha of 0.8
- draw the same circle next to first one with alpha 0.4, resulting in composite alpha of 0.4
- use mask and draw second, which will be blended only where the circles were drawn with different alpha


```
[
{ "id": "seq1", "loop": 1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "seq2", "loop": 1, "seq": [ { "src": [{"in": "media2.mp4"}], "start": 0, "stop": 10} ] },

{"js":"mask", "mode":"on"},
{"id": "b1", "x": -25, "width": 50, "height": "width", "shape":"ellipse", "fill": "white", "alpha": 0.4},

{"js":"mask", "mode":"use"},
{"sources": ["seq1"]},

{"js":"mask", "mode":"onkeep"},
{"use": "b1"},
{"x": 50, "use": "b1"},

{"js":"mask", "mode":"use"},
{"sources": ["seq2"]}
]
```


The mask can also be updated while drawing using a record mode. In this mode, the mask acts as a binary filter, any pixel drawn to the mask will no longer get drawn.

The following draws:

- an ellipse with first video at half opacity, appearing blended on the background
- the entire second video at full opacity, which will only appear where mask was not set

```
[
{ "id": "seq1", "loop": 1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "seq2", "loop": 1, "seq": [ { "src": [{"in": "media2.mp4"}], "start": 0, "stop": 10} ] },

{"js":"clear", "color":"cyan"},

{"js":"mask", "mode":"rec"},
{"sources": ["seq1"], "x": -25, "width": 50, "height": 50, "shape":"ellipse", "alpha": 0.5},

{"js":"mask", "mode":"use"},
{"sources": ["seq2"]}
]
```


## Monitoring changes

AVMix allows for simple monitoring of changes in the scene tree. Any property that can be animated or updated can be monitored through object called `watchers`.

The simplest usage of a watcher is to forward a property to another object property, typically for translations and such

```
[
{ "id": "seq1", "loop": 1, "seq": [ { "src": [{"in": "media.mp4"}], "start": 1, "stop": 5} ] },
{ "id": "seq2", "loop": 1, "seq": [ { "src": [{"in": "media2.mp4"}], "start": 0, "stop": 10} ] },

{"js":"clear", "color":"cyan"},

{"id":"s1", "sources": ["seq1"], "x": -25, "width": 100, "height": 10, "shape":"ellipse", "alpha": 0.5},
{"id":"s2","sources": ["seq2"]},

{"watch": "s1@x", "target": "s2@x"},
{"watch": "s1@y", "target": "s2@y"}
]
```

In this example, any modification to `s1.x` (resp `s1.y`) through timers, playlist update or other JS code will automatically copy the values to  `s2.x` (resp `s2.y`) .

If you want to modify the value, simply use a script instead of a builtin target:

```
{"watch": "s1@x", "target": "get_scene('s2').set('x', value/2);"},
```

If you need to modify something other than group or scene:
```
{"watch": "s1@x", "target": "update_element('timer', 'loop',  (x<0) ? false : true);"},
```

This will pause the timer `timer` whenever the x coordinate of `s1` is greater than 0, and resume the timer otherwise.


As indicated in the scripting section, you can also add watcher redirecting to module functions, using `target=moduleID.function` syntax:

```
{"id": "mod", "js": "mymod.js"},
{"watch": "s1@x", "target": "mod.on_x"},
```

And in `mymod.js`:

```
export function load() { return {

update: function()
{
return 0;
},

//the function is called with uses 3 arguments: the first one is the value, the second is the ID of the watched object, the third the property name
on_x: function(value)
{
print('x changed to ' + x);
return 0;
}

}; }

```

