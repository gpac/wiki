---
tags:
- option
- source
- media
- data
- stream
- output
- dash
---



GPAC comes with a testsuite hosted [here](https://github.com/gpac/testsuite) and present as a submodule of GPAC main repository.

The GPAC test suite is made of functional tests of MP4Box and gpac applications, and are a great source of examples for possible usage of GPAC.


If you did not clone GPAC using git `-recursive` option, you need to update the submodule:
```
git submodule update --init
```

It is suggested to sync external media not hosted on github:
```
cd testsuite
./make_tests.sh -sync-media -clean
```

You can then run the full test suite:
```
./make_tests.sh
```

or only a subset of the test suite for faster tests:
```
./make_tests.sh -quick
```

If you wish to run a particular test (e.g. hls generation) and check the output files:
```
./make_tests.sh -tmp scripts/hls-gen.sh
```

For more information on the test suite, check [testsuite/README.md](https://github.com/gpac/testsuite).
