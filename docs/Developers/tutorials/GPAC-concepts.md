---
tags:
- packets
- session
- input
- media
- data
- stream
- output
- filter
---




## What is GPAC ?

The **GPAC Filter API** is at the core of the [MP4Box and GPAC](Howtos/gpac-mp4box) applications.

The `gpac` application allows building media pipelines by conveniently [combining and configuring Filters](Filters/filters_general) from the command line. 

Filters are configurable processing units consuming and producing data packets. 

GPAC provides a wide range of Filters supporting advanced media protocols, formats, codecs, for input, output and processing tasks. 

It defines the infrastructure and helper classes to develop applications with advanced media capabilities.


### Concepts

**Filter Session**

- [API documentation](https://doxygen.gpac.io/group__fs__grp.html#details)
- [tutorial](https://git.gpac-licensing.com/slarbi/API_FIlters_tutos/src/branch/master/T0_Filters_session/simple%20gpac%20session.md)

**Filter**
- [API documentation](https://doxygen.gpac.io/group__fs__filter.html#details)

**Filter Properties**
- [API documentation](https://doxygen.gpac.io/group__fs__props.html#details)
- [Built in Properties](https://wiki.gpac.io/Filters/filters_properties/?h=properties)

**Filter Events**
- [API documentation](https://doxygen.gpac.io/group__fs__evt.html#details)

**Filter PIDs & Capabilities**
- [API documentation](https://doxygen.gpac.io/group__fs__pid.html)

**Filter Packet**
- [API documentation](https://doxygen.gpac.io/group__fs__pck.html#details)

**Custom Filter**
- [doxygen](https://doxygen.gpac.io/group__filters____cust__grp.html#details)
- [writing a custom Filter]()
