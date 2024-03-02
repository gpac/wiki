GPAC supports 10bit display and 10bit video decoding. 

The support requires a graphics card capable of driving a 10 bit display; this support is usually enabled via the control application of your GPU. Do not worry, 10-bit video will still show in 8 bit if your graphics card doesn't handle 10 bit output !

By default, GPAC always uses 8 bits per component in OpenGL setup. You will have to manually configure the player to use 10 bits per component in OpenGL. 


Edit the GPAC configuration file and set the following keys:

```ini
[core]
gl-bits-comp=10
```

You can also enable it from the command line using `-gl-bits-comp=10` option (core option, works for any application in GPAC).

