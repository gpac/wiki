---
tags:
- pid
- heif
- reframer
- data
- filter
- connection
- session
- pipeline
- connections
- frame
- stream
- dump
- link
- media
- graph
- source
- chain
- input
- output
- sink
---



## About the gpac filters API  

The API enables you to use GPAC capabilities in your own personal code. By calling any filter in gpac’s set of built-in filters, or even create your own personalized custom filters to interact within the media pipelines. This can be useful to interface with other pieces of software or create faster ways of executing some media processing workflows.

To learn more about general concepts refer to the general wiki page of [gpac](/Filters/filters_general). 


## Build and install the gpac library

Refer to the gpac [build documentation](/Build/Build-Introduction) provides detailed instructions for compiling GPAC on all supported platforms.

For linux systems, following the general build, you can use
 `$ make install-lib` to install the necessary libraries and header files. It will also install a gpac.pc file for pkg-config. With it you can easily build projects that use the gpac library with something like:
 `$ gcc -o example $(pkg-config --cflags gpac) example.c $(pkg-config --libs gpac)`

**_NOTE:_**: pkg-config needs to be installed on your machine.

## Creating a filter session

The GPAC filter session object allows building media pipelines using multiple sources and destinations and arbitrary filter chains.

The simplest way to create a session object is to use the gf_fs_new_defaults() function.


=== "C"

    ```c
    GF_FilterSession *session = gf_fs_new_defaults(0u);  
    if (session == NULL) {  
        fprintf(stderr, "Failed to create GPAC session\n");  
    }
    ```

=== "NodeJS"

    ```javascript
    const gpac = require('path/to/gpac/share/nodejs');

    try {

    let session = new gpac.FilterSession();
   
    } catch (e) {
        console.error("Failed to create GPAC session :", e);
    }
    ```
=== "Python"

    ```python
    import sys
    sys.path.append('/usr/share/gpac/python')   
    import libgpac as gpac                      

    fs = gpac.FilterSession()  

    if not fs:
        print("Failed to create GPAC session")
    ```
  


This function will create a new filter session, loading parameters from [gpac config](/Filters/core_config). This will also load all available filter registers not blacklisted.

More information on this function and alternatives can be found on the doxygen [libgpac documentation page](https://doxygen.gpac.io/group__fs__grp.html#gaa7570001b4d4c07ef8883b17d7ed12ca).

## Loading filters

### Loading a source filter

Filters can be processing block ex: (de-)multiplexers, de/encoders, media segmenters (for HTTP Adaptive Streaming), RTSP server. But also they can be file access objects either as a source filter or a destination filter, (eventually pipe and sockets too):

```C
GF_Err gf_err = GF_OK;
GF_Filter *src_filter = gf_fs_load_source(session, "logo.png", NULL, NULL, &gf_err);  
if (gf_err != GF_OK)  
{  
  fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));  
}
```

Alternatively to [gf_fs_load_source](https://doxygen.gpac.io/group__fs__grp.html#gafce8e6e28696bc68e863bd4153282f80) function we can use the more generic [gf_fs_load_filter](https://doxygen.gpac.io/group__fs__grp.html#ga962fa3063a69ef02e43f06abe14cfe65) and use the [Fin](/Filters/fin) filter (followed by its options with the syntax :opt=val) as follows:
=== "C"

    ```c
    GF_Filter *src_filter = gf_fs_load_filter(session, "fin:src=logo.png", &gf_err);
    ```

=== "NodeJS"

    ```javascript
      const src_filter = session.load_src("logo.png");
    ```



=== "Python"

    ```python
    src = fs.load_src("logo.png")
    ```

  



### Loading a filter

Filters are described through a [__gf_filter_register](https://doxygen.gpac.io/struct____gf__filter__register.html) structure. A set of built-in filters are available, and user-defined filters can be added or removed at runtime.

  

The filter session keeps an internal graph representation of all available filters and their possible input connections, which is used when resolving connections between filters.

  

The following code snippet provides an example to load the [reframer](/Filters/reframer) filter.

  
=== "C"

    ```c
    GF_Filter *reframer_filter = gf_fs_load_filter(session, "reframer", &gf_err);  
    if (gf_err != GF_OK) {  
        fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));  
    }
    ```

=== "NodeJS"

    ```javascript
   
    let refr = session.load("reframer");
    if (!refr) {
        throw new Error("Failed to load filter: reframer");
    }
    ```

=== "Python"

    ```python

    refr = fs.load("reframer")
    if not refr:
        print("Failed to load filter: reframer")
    ```



options can be specified the same way as in the CLI of gpac, as stated with ‘fin’ above. Here is another example:

=== "C"

    ```c
    GF_Filter *reframer_filter = gf_fs_load_filter(session, "reframer:rt=on", &gf_err);
    if (gf_err != GF_OK) {
        fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
    }
    ```

=== "NodeJS"

    ```javascript

    let refrRT = session.load("reframer:rt=on");
    if (!refrRT) {
        throw new Error("Failed to load filter: reframer:rt=on");
    }
    ```

=== "Python"

    ```python
    refr_rt = fs.load("reframer:rt=on")

    if not refr_rt:
        print("Failed to load filter: reframer:rt=on")
    ```


### Loading a destination filter

Loading a destination filter, exactly like loading a source filter mentioned above can be done in two different ways:

  

by using [gf_fs_load_destination()](https://doxygen.gpac.io/group__fs__grp.html#ga2fd8f1f59622bc781cc81aafee99ee7d) function :

=== "C"

    ```c
    GF_Err gf_err = GF_OK;
    GF_Filter *src_filter = gf_fs_load_destination(session, "logo_result.png", NULL, NULL, &gf_err);
    if (gf_err != GF_OK) {
        fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
    }
    ```

=== "NodeJS"

    ```javascript

    try {
        let dst_filter = session.load_dst("logo_result.png");
       
    } catch (e) {
        console.error("Error: " + e.message);
       
    }
    ```

=== "Python"

    ```python

    
        dst_filter = fs.load_dst("logo_result.png")

        if not dst_filter:
            print("Failed to load destination filter via load_dst")
   
        
    ```



Or by using the gf_fs_load_filter and use the Fout filter (or any alternative output destinations pipes, sockets.. ) as follows:
  
=== "C"

    ```c
    GF_Err gf_err = GF_OK;
    GF_Filter *dst_filter = gf_fs_load_filter(session, "fout:dst=logo_result.png", &gf_err);
    if (gf_err != GF_OK) {
        fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
    }
    ```

=== "NodeJS"

    ```javascript
   
    try {
        let  dst_filter = session.load("fout:dst=logo_result.png");
       
    } catch (e) {
        console.error("Error: " + e.message);  
    }
    ```

=== "Python"

    ```python
    
        dst_filter_fout = fs.load("fout:dst=logo_result.png")
       
    ```


## Connecting filters and creating a filter chain

The function [gf_filter_set_source()](https://doxygen.gpac.io/group__fs__filter.html#ga9d8a5da25284b1325d0210cc04a6a302) serves the purpose of explicitly assigning a source ID to a designated filter. Therefore it serves as an indicator for the graph resolver to link two filters. (it does not do the actual linking).  

It is crucial to invoke this function before establishing a connection from the specified source filter. If the linked filter lacks an assigned ID, the function automatically generates a dynamic one in the format %08X, utilizing the memory address of the filter.

It is important to note that in multithreaded sessions, proper session locking is essential before the filter creation step and must be unlocked after calling this function. Failure to do so may result in graph resolution occurring before the gf_filter_set_source() is invoked.

The function accepts three parameters, including the target filter, the filter to link from (source filter), and any link extensions allowed in link syntax, providing flexibility in defining link properties. ( Pid name, properties, types of properties…)

  
```C
gf_filter_set_source(destination_filter, source_filter, NULL);
```
  
  
## Disabling the graph resolver and connecting filters manually

The helper function [gf_fs_set_max_resolution_chain_length()](https://doxygen.gpac.io/group__fs__grp.html#gaef500f3cb6589e05c161d8a50ab20f12) sets the maximum length of a filter chain dynamically loaded to solve connection between two filters. Setting the value to 0 disables dynamic link resolution. You will have to specify the entire chain manually. ( using the above gf_filterset_source() function).

Note: this will not guarantee the linking, matching of capabilities between the two filters will still be evaluated. This can be very helpful in a testing/development scenario where one may need to disable the dynamic linking to solve compatibility issues between two filters.

```C
gf_fs_set_max_resolution_chain_length(session, 0);
```

## Running the session and displaying stats

By default, the gpac filters session operates in a semi-blocking state. meaning whenever output PID buffers on a filter are all full, the filter is marked as blocked and not scheduled for processing. And whenever one output PID buffer is not full, the filter unblocks.

The function [gf_fs_run](https://doxygen.gpac.io/group__fs__grp.html#gafdef85e209aef33193e02f83ff5fcbab)() allows for executing the filter session. When the session is non-blocking, it processes tasks of the oldest scheduled filter, manages pending PID connections, and then returns. In the case of a blocking session, gf_fs_run() continues to run until the session concludes or is aborted. The function returns an error if any issues arise during execution, and the last errors can be retrieved using [gf_fs_get_last_connect_error](https://doxygen.gpac.io/group__fs__grp.html#ga026f96a009dd073700b7339fb3ade492) and [gf_fs_get_last_process_error](https://doxygen.gpac.io/group__fs__grp.html#ga2a217d0b7f3f44050f9f78cab10e577d).

=== "C"

    ```c
    gf_err = gf_fs_run(session);  

    if (gf_err >= GF_OK) {  
        gf_err = gf_fs_get_last_connect_error(session);  
    if (gf_err >= GF_OK)  
        gf_err = gf_fs_get_last_process_error(session);  
    }  

    // Print connections  
    gf_fs_print_connections(session);  
    gf_fs_print_stats(session);  

    gf_fs_del(session);  
    session = NULL;  
    ```

=== "NodeJS"

    ```javascript

    const gpac = require('path/to/gpac/share/nodejs');

    let session = null; 

    try {
        session = new gpac.FilterSession();
        /*
            * ... Here, your code  ...
            */
        // Run the session in blocking mode
        const err = session.run();
        if (err < gpac.GF_OK) {
            console.error("Session execution failed with error: " + gpac.e2s(err));
        } else {
            session.print_graph(); 
            session.print_stats(); 
        }
        } catch (e) {
        console.error("A JavaScript exception was thrown: ", e);
        } finally {
        if (session) {
            session.abort();
            session = null;
        }
        }
    ```

=== "Python"

    ```python

    import sys
    sys.path.append('/usr/share/gpac/python')   
    import libgpac as gpac                      


    fs = gpac.FilterSession()
    // Here, your code ...

    fs.run()
    fs.print_graph()
    fs.print_stats()


    fs.delete()
    gpac.close()
    ```    
    
    




## Sample code

In the following example we reproduce a [testsuite example](https://github.com/gpac/testsuite/blob/master/scripts/reframers.sh) that takes a png image as input and calls the reframer filter on the png and writes a new image using writegen and fout filters.

[ (image file png) fin -> ] -> reframe -> writegen -> [ -> fout (image result file) ]

**_NOTE:_**: the reframer filter has no functionnnal use in this particular example. the example is just an illustartion of a filters chain.     

=== "C"

    ```c
    int main(int argc, char *argv[]) 
    {
        GF_Err gf_err = GF_OK;

        // session scheme for testing reframer with fin filter
        GF_FilterSession *session = gf_fs_new_defaults(0u);
        if (session == NULL) {
            fprintf(stderr, "Failed to create GPAC session\n");
            return EXIT_FAILURE;
        }

        // load source filter
        GF_Filter *src_filter = gf_fs_load_filter(session, "fin:src=logo.png", &gf_err);
        if (gf_err != GF_OK) {
            fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
        }

        // load reframer filter
        GF_Filter *reframer_filter = gf_fs_load_filter(session, "reframer", &gf_err);
        if (gf_err != GF_OK) {
            fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
        }

        // load writergen filter
        GF_Filter *writegen_filter = gf_fs_load_filter(session, "writegen", &gf_err);
        if (gf_err != GF_OK) {
            fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
        }

        // load destination filter
        GF_Filter *dst_filter = gf_fs_load_filter(session, "fout:dst=logo_result.png", &gf_err);
        if (gf_err != GF_OK) {
            fprintf(stderr, "Failed to load filter: %s", gf_error_to_string(gf_err));
        }

        gf_filter_set_source(reframer_filter, src_filter, NULL);
        gf_filter_set_source(writegen_filter, reframer_filter, NULL);
        gf_filter_set_source(dst_filter, writegen_filter, NULL);

        gf_err = gf_fs_run(session);
        if (gf_err >= GF_OK) {
            gf_err = gf_fs_get_last_connect_error(session);
            if (gf_err >= GF_OK)
                gf_err = gf_fs_get_last_process_error(session);
        }

        // print connections 
        gf_fs_print_connections(session);
        gf_fs_print_stats(session);

        gf_fs_del(session);
        session = NULL;
        return EXIT_SUCCESS;
    }
    ```

=== "NodeJS"

    ```javascript

    const gpac = require('path/to/gpac/share/nodejs');

    let session = null;

    try {
    session = new gpac.FilterSession();
        if (!session) {
            throw new Error("Failed to create GPAC session.");
        }
  
    const src_filter = session.load_src("logo.png");
    const reframer_filter = session.load("reframer");
    const writegen_filter = session.load("writegen");
    const dst_filter = session.load("fout:dst=logo_result.png");
    
        if (!dst_filter || !reframer_filter || !writegen_filter || !src_filter) {
            throw new Error("Failed to load one or more filters.");
        }
   
    reframer_filter.set_source(src_filter);
    writegen_filter.set_source(reframer_filter);
    dst_filter.set_source(writegen_filter);
 

    const err = session.run();

        if (err < gpac.GF_OK) {
            console.error("Session execution failed with error: " + gpac.e2s(err));
        } else {
            
            session.print_graph();
            session.print_stats();
        }

    } catch (e) {
    console.error("A JavaScript exception was thrown: ", e);
    } finally {

        if (session) {
            session.abort();
            session = null;

        }
    }
    ```
=== "Python"

    ```python
    import sys
    sys.path.append('/usr/share/gpac/python')   
    import libgpac as gpac   

    def main():
        
        fs = gpac.FilterSession()

        src = fs.load_src("logo.png")
        reframer = fs.load("reframer")
        writer = fs.load("writegen")
        dst = fs.load_dst("logo_result.png")

      
        reframer.set_source(src)
        writer.set_source(reframer)
        dst.set_source(writer)

      
        fs.run()

        fs.print_graph()
        fs.print_stats()

        fs.delete()
        gpac.close()

    if __name__ == "__main__":
        main()
    ```
