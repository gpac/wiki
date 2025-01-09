---
tags:
- pid
- reframer
- data
- filter
- sample
- session
- packet
- pipeline
- connections
- frame
- raw
- stream
- dump
- media
- property
- graph
- source
- packets
- chain
- input
- output
- decoding
- sink
---



## Creating a custom GPAC filter

Custom filters are filters created by the app with no associated registry. Therefore there is no internal representation for the custom filter (No filter registry). So capabilities and different behaviors of the custom filter must be specified by the app with the helper callback functions (listed below).

The app is responsible for assigning capabilities to the filter, and setting callback functions. Each callback is optional, but a custom filter should at least have a process callback, and a configure_pid callback if not a source filter.

  

**Custom filter limitations:**

*  Custom filters do not have any arguments exposed.    
*  The filter cannot be used as source of filters loading a source filter graph dynamically, such as the dashin filter.
*  The filter cannot be used as destination of filters loading a destination filter graph dynamically, such as the dasher filter.
*  The filter cannot be cloned.
  

## Callback functions

### [gf_fs_new_filter()](https://doxygen.gpac.io/group__filters____cust__grp.html#ga45d6cd5535614e43d6ebb77d8cb1a4bc)

This function is responsible for loading a custom filter into the specified filter session. It allows the application to create filters without associated registries, providing the flexibility to assign capabilities and set callback functions. The function parameters include the filter session, the name of the filter (optional), flags for filter registry, and an optional error code parameter.

### [gf_filter_push_caps()](https://doxygen.gpac.io/group__filters____cust__grp.html#ga878516ab46d5bfc96692a91f3ba6b124)

This function facilitates the addition of new capabilities to a custom filter. Parameters such as capability code, value, name, flags, and priority are specified to define the capabilities. This function returns an error if any issues occur during the process.

An alternative way is to push the caps to a specific PID within the filter callbacks function, typically inside the process callback , or the configure callback for non source filters.

### [gf_filter_set_process_ckb()](https://doxygen.gpac.io/group__filters____cust__grp.html#gad1f20440c6de9b009a4fde85d429ad39)

This function is employed to set the process callback function for a custom filter. Typically callback defines the processing logic of the filter. The function takes the target filter and the process callback as parameters.

This one callback is mandatory in order to use the custom filter.

### [gf_filter_set_configure_ckb()](https://doxygen.gpac.io/group__filters____cust__grp.html#gab21f4169d1de1a0876f8b6856301ff28)

For custom filters that are not source filters, the **gf_filter_set_configure_ckb()** function is utilized to set the **PID** configuration callback. The assigned  function enables and manages the configuration of the PID(s) for the filter.

### [gf_filter_set_process_event_ckb()](https://doxygen.gpac.io/group__filters____cust__grp.html#gadefa24ff7508d8838334d381f7c9004c)

Set the process event callback for a custom filter. This callback handles events related to the filter. for example specifying what happens if a Play or a Stop event is received.  

### [gf_filter_set_reconfigure_output_ckb()](https://doxygen.gpac.io/group__filters____cust__grp.html#gae22ecc90654524434483f204713989fb)

The reconfigure_output callback may be needed to reconfigure the output PID(s) of a filter during the execution of a filters session. 

### [gf_filter_set_probe_data_cbk()](https://doxygen.gpac.io/group__filters____cust__grp.html#ga3b067ec9d2067d683ea5d3fdb4d32833%29)

Set the data prober function for a custom filter. 
  
  
## Pushing application data to a GPAC filter session using a custom filter

We saw previously that source filters generaly are file (or pipe/sockets/memory files) access objects.

But sometimes when integrating gpac with other pieces of software, the data may be available directly in the memory. so it can be beneficial to access data from memory within a gpac filters session.

The following is an example of a custom filter named “**mem_in**”  which is  source filter that provides a way to create a PID where the raw data is located in memory (ex audio/video frames located in memory). Allowing for the creation of a filter chain to process this data ( feeding the PID to other filters).


### Defining the process callback function

We start by defining a process callback, which the main logic will execute whenever our custom filter is called for a process execution by the the filters session:

```C
GF_Err  mem_in_process_ckb(GF_Filter  *filter) {
  GF_Err  gf_err  =  GF_OK;
  GF_FilterPid  *opid  =  NULL;

  opid  =  gf_filter_get_opid(filter, 0);
  if (!opid) {
    opid  =  gf_filter_pid_new(filter);
    Properties  properties[]  = {
          {.prop_4cc  =  GF_PROP_PID_CODECID,
        .val  = {.type  =  GF_PROP_UINT, .value.uint  =  GF_CODECID_AVC},
          .flags  =  GF_CAPS_INPUT},
    {0},
    };
    push_props(opid, properties);    
  }
  
  const  u8  *data  =  NULL;
  u32  data_size  =  0;
  u64  dts  =  0, pts  =  0;
  MemInCtx  *ctx  = (MemInCtx  *)gf_filter_get_rt_udta(filter);
  if (!ctx)
    return  GF_BAD_PARAM;

  ctx->parent  = (void  *)ctx;
  ctx->getData  =  &inputGetData;
  if (!ctx->getData(ctx->parent, &data, &data_size, &dts, &pts)){
    gf_filter_pid_set_eos(opid);
    return  GF_EOS;
  } 
  
  if (!data) {
     gf_filter_ask_rt_reschedule(filter, 1);
     return  GF_OK;
  }
  
  GF_FilterPacket  *pck  =gf_filter_pck_new_shared(opid, data, data_size, mem_in_pck_destructor);
  if (!pck) {
    gf_err  =  GF_OUT_OF_MEM;
    goto  exit;
  }
  
  gf_filter_pck_set_dts(pck, dts);
  gf_filter_pck_set_cts(pck, pts);
  gf_filter_pck_set_duration(pck, 1);
  gf_filter_pck_set_sap(pck, GF_FILTER_SAP_1);
  gf_filter_pck_set_framing(pck, GF_TRUE, GF_TRUE);
  gf_filter_pck_send(pck);
  
  exit:
  return  gf_err;
}
```

**Code explanation**

First thing we declare a PID that will serve us as an output PID, than we add the properties to this PID. Here for example we are adding the property  **GF_PROP_PID_CODECID**  with the value **GF_CODECID_AVC** to indicate that w are sending an AVC frame through this PID.

```C
opid  =  gf_filter_get_opid(filter, 0);
if (!opid) {
  opid  =  gf_filter_pid_new(filter);
  Properties  properties[]  = {
      {.prop_4cc  =  GF_PROP_PID_CODECID,
     .val  = {.type  =  GF_PROP_UINT, .value.uint  =  GF_CODECID_AVC},
       .flags  =  GF_CAPS_INPUT},
 {0},
};

  push_props(opid, properties);    
}
```

The push props function is defined below:

```C
static GF_Err push_props(GF_FilterPid *PID, Properties pid_props[])  
{  
GF_Err gf_err = GF_OK;  
int i = 0;  
while(pid_props[i].prop_4cc) {  
 if(pid_props[i].flags == GF_CAPS_INPUT) {  
   gf_filter_pid_set_property(PID, pid_props[i].prop_4cc, &pid_props[i].val);  
   }  
  i++;  
}}  
```

We loop through the props that we want to add (defined here through a specific struct). And add them through the [gf_filter_pid_set_property](https://doxygen.gpac.io/group__fs__pid.html#gaa9d532d9ca4c10a19973bcbd5e8af4fd) function.

An alternative way is to use the [gf_filter_push_caps()](https://doxygen.gpac.io/group__filters____cust__grp.html#ga878516ab46d5bfc96692a91f3ba6b124) function.

Our output PID and its properties are now configured, Next order of business is  to fetch the data from memory. We keep a reference to the internal data of the filter through the following struct. This allows us to pass references to the getData() and freeData() functions from the main program to the filters session internals, we also keep some metadata like the current decoding / presentation timestamps and the number of max frames we will process.   
 
```C
typedef  struct {
   void  *parent;
   Bool (*getData)(void  *parent, const  u8  **data, u32  *data_size, u64  *dts,
   u64  *pts);
   void (*freeData)(void  *parent, const  u8  *data);
   int  max_frames;
   u64  dts;
   u64  pts;
} MemInCtx;
```
 
With that in mind , lets return to our mem_in process callback:  

```C
const u8 *data  =  NULL;
u32  data_size  =  0;
u64  dts  =  0, pts  =  0;
MemInCtx  *ctx  = (MemInCtx  *)gf_filter_get_rt_udta(filter);
if (!ctx)
  return  GF_BAD_PARAM;
ctx->parent  = (void  *)ctx;
ctx->getData  =  &inputGetData;
if (!ctx->getData(ctx->parent, &data, &data_size, &dts, &pts)){
  gf_filter_pid_set_eos(opid);
  return  GF_EOS;
} 
if (!data) {
   gf_filter_ask_rt_reschedule(filter, 1);
   return  GF_OK;
} 
```

After initialisation of local variables, we use the [gf_filter_get_rt_udta()](https://doxygen.gpac.io/group__fs__filter.html#ga47b46ae728e700f983f53fdc069032f3) function to retrieve the user data that we set from the main function(see code bellow). This function is typically used by bindings and custom filters to share runtime data. 
  
Now we can access the data in memory using the getData(), in case the function is not available we send an End Of Stream signal through our output pid.

If there is no data available  we ask for rescheduling with [gf_filter_ask_rt_reschedule()](https://doxygen.gpac.io/group__fs__filter.html#ga36bb988aa964b3c6220aae11773d7c9e). 


Otherwise, we create a new packet to be shared, we set some packets properties and we send the packet upstream. 
  
```C
GF_FilterPacket *pck = gf_filter_pck_new_shared(opid, data, data_size, mem_in_pck_destructor);
if(!pck) { gf_err = GF_OUT_OF_MEM; goto exit; }
gf_filter_pck_set_dts(pck, dts);
gf_filter_pck_set_cts(pck, pts); 
gf_filter_pck_set_duration(pck, 1);
gf_filter_pck_set_sap(pck, GF_FILTER_SAP_1); 
gf_filter_pck_set_framing(pck, GF_TRUE, GF_TRUE);
gf_filter_pck_send(pck);
```

### Instantiation of the process callback

Once we defined our process callback we need to instantiate it and  assign it to our filter. so the logic of the filter will be executed each time the filter process is called by the gpac filters session. 

```C
// create a new GF_filter pointer called src_filter 
GF_Filter *src_filter = gf_fs_new_filter(session, "mem_in", 0, &gf_err);
// declare the mem_in process callback function if not defined in the same file
GF_Err mem_in_process_ckb(GF_Filter * filter);
// assign the callback to the filter   
gf_filter_set_process_ckb(src_filter, mem_in_process_ckb);
```

Our source filter is ready to be used by the filter session.  
    

## Example 2 - Getting data from a custom filter to an application
  

Alternatively to using custom filters we can create a filter class and add it to the session using [gf_fs_add_filter_register()](https://doxygen.gpac.io/group__fs__grp.html#ga4ae302f59379de2544c17b374eae3516)  
The following is the definition of the mem_out filter register with simply two functions process() and configure_pid(). (This very minimalistic more options are possible )  

```C
  GF_FilterRegister  memOutRegister  = {
       .name  =  "mem_out",
       .private_size  =  sizeof(MemOutCtx),
       .process  =  mem_out_process,
       .configure_pid  =  mem_out_configure_pid,
      };
```
 
The mem_out_process logic is also straight forward.

```C
MemOutCtx *ctx = (MemOutCtx *)gf_filter_get_udta(filter);
static GF_Err mem_out_process(GF_Filter *filter) {
  if (!ctx)
    return GF_BAD_PARAM;
  ctx->pushData = &outputPushData;
  ctx->pushDsi = &outputPushMetadata;

  GF_FilterPid *ipid = gf_filter_get_ipid(filter, 0);

  const GF_PropertyValue *prop =
      gf_filter_pid_get_property(ipid, GF_PROP_PID_DECODER_CONFIG);

  if (prop && prop->value.data.ptr && prop->value.data.size) {
    ctx->pushDsi(ctx->parent, prop->value.data.ptr, prop->value.data.size);
  }

  GF_FilterPacket *pck = gf_filter_pid_get_packet(ipid);
  if (pck) {
    u32 data_size = 0;
    u64 dts = gf_filter_pck_get_dts(pck);
    u64 pts = gf_filter_pck_get_cts(pck);
    const u8 *data = gf_filter_pck_get_data(pck, &data_size);

    ctx->pushData(ctx->parent, data, data_size, dts, pts);
    gf_filter_pid_drop_packet(ipid);
  }

  return GF_OK;
}
```

we note here:

* The use of [gf_filter_get_ipid()](https://doxygen.gpac.io/group__fs__filter.html#ga03a9a73e8d044d7737b4dd9d74e23a79) to retrieve the input pid. 
* The use of [gf_filter_pid_get_property()](https://doxygen.gpac.io/group__fs__pid.html#ga1e28b43fba75976755ef3004edfe2a2a) to get the properties of the input pid.
* The use of [gf_filter_pid_get_packet()](https://doxygen.gpac.io/group__fs__pid.html#gaf373afc8a944b4a5b20952e8a3121d2f) to retrieve the packet from the input pid.
* The use of [gf_filter_pck_get_data()](https://doxygen.gpac.io/group__fs__pck.html#ga6727b4c6fa4a4366ccc23244c6191570) to retrieve the data from the packet of the input pid.


### Registry and loading of the filter to the session 

```C
// register and load destination filter
GF_Filter  *dst_filter  =  NULL;
const  GF_FilterRegister  *mem_out_register(GF_FilterSession  *);
gf_fs_add_filter_register(session, mem_out_register(session));
dst_filter  =  gf_fs_load_filter(session, "mem_out", &gf_err);
```

The memory output filter is now ready to be used inside the filters session.

## Building the filter session graph using the reframer filter  

Here is an example of a filters session using both filters examples provided before that we build using two different approaches ( custom filter & class filter). sandwiching  the reframer as an example of a filters chain.     

```C
int  main() {
    
  GF_Err gf_err = GF_OK;
  
  GF_FilterSession *session = gf_fs_new_defaults(0u);
  if (session == NULL) {
    fprintf(stderr, "Failed to create GPAC session\n");
    goto exit;
  }
        
  // adding custom input filter
  GF_Filter *src_filter = gf_fs_new_filter(session, "mem_in", 0, &gf_err);
  MemInCtx *ctxIn = gf_malloc(sizeof(MemInCtx));
  ctxIn->dts = 0;
  ctxIn->pts = 0;
  ctxIn->max_frames = 3;
  gf_err = gf_filter_set_rt_udta(src_filter, (void *)ctxIn);
  gf_err = gf_filter_set_process_ckb(src_filter, mem_in_process_ckb);
  GF_Filter *reframer_filter = gf_fs_load_filter(session, "reframer", &gf_err);
  if (gf_err != GF_OK) {
    fprintf(stderr, "Failed to load filter reframer: %s \n",
            gf_error_to_string(gf_err));
    goto exit;
  }
  gf_filter_set_source(reframer_filter, src_filter, NULL);
    
  // register and load destination filter
  GF_Filter *dst_filter = NULL;
  const GF_FilterRegister *mem_out_register(GF_FilterSession *);
  gf_fs_add_filter_register(session, mem_out_register(session));
  dst_filter = gf_fs_load_filter(session, "mem_out", &gf_err);
  if (gf_err != GF_OK) {
    fprintf(stderr, "Failed to load filter mem_out: %s \n",
            gf_error_to_string(gf_err));
    goto exit;
  }

  // finalize graph connections
  gf_filter_set_source(dst_filter, reframer_filter, NULL);

  // run
  gf_filter_post_process_task(src_filter);    
  gf_fs_run(session);

  // error handling
  if (gf_err >= GF_OK) {
    gf_err = gf_fs_get_last_connect_error(session);
    if (gf_err >= GF_OK)
      gf_err = gf_fs_get_last_process_error(session);
  }

  // print connections
  gf_fs_print_debug_info(session, 0);
  gf_fs_print_connections(session);
  gf_fs_print_stats(session);
  exit:
       gf_fs_del(session);
       session = NULL

  return gf_err == GF_OK ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

Here we note:

* The use of [gf_filter_set_rt_udta()](https://doxygen.gpac.io/group__fs__filter.html#gac2f040600796f000ac4189fda1c76bc0) to set our runtime data of the mem_in filter. 
* We post the mem_in process task to the session using the [gf_filter_post_process_task(src_filter)](https://doxygen.gpac.io/group__fs__filter.html#ga5806cdb70097f7d5d181884928870842) function.
 
## Execution report

If we define a static h264 frame to use it as a memory input 
 
```C
static const uint8_t h264_grey_frame_dsi[] = {
      0x01, 0x4d, 0x40, 0x0a, 0xff, 0xe1, 0x00, 0x15, 0x67, 0x4d,
      0x40, 0x0a, 0xe8, 0x8f, 0x42, 0x00, 0x00, 0x03, 0x00, 0x02,
      0x00, 0x00, 0x03, 0x00, 0x64, 0x1e, 0x24, 0x4a, 0x24, 0x01,
      0x00, 0x05, 0x68, 0xeb, 0xc3, 0xcb, 0x20 };
```
and we run our filters session that will result in the following filters graph being executed. 

![custom filter execution](images/T1_img0.png)
