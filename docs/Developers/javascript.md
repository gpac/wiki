---
tags:
- frame
- source
- avmix
- filter
---




Javascript developers have two options to work with GPAC, the most appropriate solution depends on the project's goal:

## Javascript Filters

The JS filter API makes it easy to **extend gpac** using the internal QuickJS runtime, giving access to the Filter API for frame and packet processing, but also APIs for adaptative streaming, compositing, storage, ...

Some of the gpac built-in filters - eg. [avgen](/Filters/avgen), [avmix](/Filters/avmix) - are actualy implemented as custom javascript filters. Their source code can be found under the[`share/scripts/jsf`](https://github.com/gpac/gpac/tree/master/share/scripts/jsf) directory.

[JSF documentation](/Howtos/jsf/jsfilter){ .md-button }

## NodeJS

GPAC's NodeJS bindings allow **writing custom NodeJS applications**. It differs slightly from the Javascript Filters API available in the QuickJS runtime. 

[NodeJS documentation](/Howtos/nodejs){ .md-button }
