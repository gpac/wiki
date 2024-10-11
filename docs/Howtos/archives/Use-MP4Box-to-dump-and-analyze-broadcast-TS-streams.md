---
tags:
- option
- mp4
- input
- box
- broadcast
- dump
---



## Foreword

This feature is deprecated in MP4Box starting from GPAC 0.9.0. You can grab input streams using [gpac](gpac_general):
```
gpac -i udp://ip_adress:port -o dump.ts
```

```
gpac -i udp://ip_adress:port --ifce ip_address -o dump.ts
```


### Dump a broadcast TS in a file

MP4Box can manipulate MP4 files, but it has also capabilities regarding broadcast streams.

Command syntax:

```
MP4Box -grab-ts udp://ip_adress:port dump.ts
```

For example:

```
MP4Box -grab-ts udp://239.0.0.1:8000 dump.ts
```

### Dump from a specific network interface

MP4Box provides a '-ifce' option:

```
MP4Box -grab-ts udp://ip_adress:port -ifce ip_address dump.ts
```

Use 'ifconfig' (Unix) or 'ipconfig' (Windows) to retrieve your IP address on the interface of your choice. Example:

```
MP4Box -grab-ts udp://239.0.0.1:8000 -ifce 192.168.1.1 dump.ts
```

### Troubleshoot Windows: MP4Box (or any tool) cannot dump my multicast

1) Clicking the Start button and then click on Control Panel. In the search box, type firewall, and then click Windows Firewall.

2) On the left panel, click on "Allow a program or feature through the Windows Firewall".

3) Make sure all columns are checked for your MP4Box programs.

