
This page describes the usage of the testsuite, for gpac developers and contributors.

Tests should be run by devs before pushing in order to intercept errors earlier.

**Note:** _Some tests can be flaky, some random fails can occur because of io or network timings. Developers are encouraged to check https://tests.buildbot.io to see if their fails are unique or if they also happen on master._


# Pre-requisites

The testsuite is hosted at: https://github.com/gpac/testsuite

It is composed of bash scripts, so a bash environment is needed to run it.

For linux and macos this is built-in.

For windows, any good bash environment should do, including WSL, Cygwin, MSYS.

Some bash tools are needed to run the testsuite:

- `GNU time` and `GNU timeout` (aka `gtime` and `gtimeout` on macos)
- `readlink` (or `greadlink` on macos)
- `diff`, `sed`, `wget`

Additionally the script needs to be able to call `MP4Box` and `gpac` so these need to be in the `PATH`.


# Running the testsuite

In the vast majority of cases, the testsuite should be run simply with

```sh
./make_tests.sh -clean
./make_tests.sh -p=0 -precommit
```

The `-precommit` argument is a shortcut to the standard parameters used in CI.

The `-p=0` creates a "portable" instance of GPAC to avoid colliding with other instances (like an installed package) over shared config files and data. It is optional if you know you don't need it.


If you re-run the testsuite without the `-clean` first, it will only run tests that have failed previously, and the ones that haven't run yet.

If you want to test an isolated feature that you know only impacts one category of tests, you can use a syntax like

```sh
./make_tests.sh -p=0 -precommit scripts/evg.sh scripts/evgs.sh
```

This will only run the tests defined in the given scripts.


# Updating hashes

Test outputs are tested against reference hashes (to avoid storing whole reference files).

Sometimes a new feature will change some reference hashes, or new tests will need to generate their reference hashes.

Example workflow for changes to the `xmlin` tests hashes:

```bash
# if needed, remove existing hashes
./make_tests.sh -clean-hash scripts/xmlin.sh

# generate missing hashes
./make_tests.sh -p=0 -hash scripts/xmlin.sh

# check self-consistency by re-running the tests with the new hashes
./make_tests.sh -clean scripts/xmlin.sh
./make_tests.sh -p=0 -precommit scripts/xmlin.sh

# commit changes if all ok
git commit -am "updated xmlin tests and hashes"
```

**Note:** _Reference hashes need to be valid on all tested platforms, so the hashed files should not contain timestamps, absolute paths, local hostnames, etc.._

Before updating hashes, please make sure that the hashed file represent a successful test result.
