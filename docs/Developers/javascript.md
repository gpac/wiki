
Javascript developers have several options to work with GPAC. 
The most appropriate solution depends on the project's goal.

## customize the gpac application with custom javascript filters

GPAC embeds the [QuickJS](https://bellard.org/quickjs/) runtime, making it easy to extend and customize gpac using custom *javascript filters*.

Some of the gpac application features are actualy implemented as custom javascript filters, for instance [avgen](Filters/avgen) which produces procedural content, or [avmix](Filters/avmix) which provides advanced audio/video mixing. 

These - and more - custom *javascript filters* can be found in the gpac's source code [under the `share/scripts/jsf` directory](https://github.com/gpac/gpac/tree/master/share/scripts/jsf).

- **[Javascript filters documentation](Howtos/jsf/jsfilter)**


## write applications with the NodeJS API

GPAC also offers NodeJS bindings to write custom applications using javascript.

The GPAC's NodeJS API differs slightly from the Javascript Filters API available in the QuickJS runtime, it is most suitable to custom application development.

- **[NodeJS documentation](Howtos/nodejs)**
