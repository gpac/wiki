
This page explains the basic continuous integration principles in GPAC, as well as the available features for contributors on Github.

# Build and tests in GPAC

The CI/CD in GPAC is orchestrated through a [buildbot](https://buildbot.net/) instance.

Each push to master branch triggers a full build on all supported platforms, a run of the testsuite, and a publication of the built installers.

**Note:** _The CI can be prevented from running by adding `[noCI]` anywhere in the commit message. If a push is composed of multiple commits, if any commit **doesn't** have the `[noCI]` tag, the build will trigger._

Build logs can be seen at https://buildbot.gpac.io

The testsuite is hosted at https://github.com/gpac/testsuite

Test results are available at https://tests.gpac.io

Published installers can be downloaded at https://gpac.io/downloads/gpac-nightly-builds/


# Github Pull Requests

## Building a PR with buildbot

### Triggering a build

By default, pull requests are not automatically built and tested by buildbot (for security reasons among others).

However there a two ways to trigger a buildbot build on a Github:

1. GPAC team members who have push access to the main repo can push to a branch of the form `buildbot-<mybranch>`. Any such branch will be automatically built and tested with buildbot

2. For external PRs, a team member can apply the label [`test with buildbot`](https://github.com/gpac/gpac/pulls?q=is%3Apr+is%3Aopen+label%3A%22test+with+buildbot%22). Any such labelled PRs will be built by buildbot, including its subsequent pushes.


### Results

When the buildbot is done, it will post a comment on the PR with links to the test result.

The first thing to check for a contributor is if this comment includes an obvious regression, i.e. a test that now fails on all tested platforms when it didn't fail on master.

If there are such regressions they need to be fixed before merging the PR.

Additionally contributors are encouraged to check the build and test results linked in the Github checks.

### Rebuild

There are two options to trigger a rebuild a PR with buildbot:

1. Push to the branch (even an empty commit)
2. GPAC team members can comment `/buildbot-rebuild` on the PR and it will trigger a rebuild


## Changes to the testsuite

By default, all buildbot builds are tested against **the HEAD of the master branch of testsuite repo** (ignoring the specific commit stored as the git submodule in the main repo, for historic reasons).

However, if there is a testsuite branch **of the same name as the built GPAC branch**, buildbot will test that build against that testsuite branch.

So if a PR needs to update the testsuite (add some tests, change a hash, etc.) it is possible, the workflow depends on the source of the branch

### Worflow for internal branches

If an internal branch needs changes to the testsuite, the simple workflow is to:

 - push a branch `buildbot-mybranch` to the testsuite **first**, open a PR on the testsuite repo
 - push a branch `buildbot-mybranch` to gpac, open a PR on the gpac repo if not already done

When merging, the order is:

 - merge the testsuite PR into master
 - merge the gpac PR into master


### Workflow for external PRs

For external PRs the workflow is a bit more involved, because the buildbot can't easily know if an external branch of the testsuite exists in a fork.

However if a local testsuite branch of the same name as the PR branch exists, it will still be used by buildbot.

The workflow usually looks like:

 - fork gpac, create my feature branch `myfeature`
 - open a PR on gpac (`PR1`)
 - a team member applies the label `test with buildbot`
 - the test results indicate that changes to the testsuite are needed
 - fork the testsuite, create a branch `myfeature`
 - open a PR on the testsuite repo (`PR2`)

This is where an intervention from a team member is needed (could be automated later):

 - a team member creates a local testsuite branch also called `myfeature`
 - they then change the base of `PR2` to be the local `myfeature` branch instead of master
 - merge `PR2` (i.e. merge `fork:myfeaure` into `testsuite:myfeature`)
 - open a testsuite PR for the local `myfeature` branch into master (`PR3`)

When triggering a rebuild on `PR1` now, the buildbot will find a local branch of the same name, and test against it.

If further changes to the testsuite are needed, the external user can now:
  - push to their testsuite fork `myfeature` branch
  - open a new PR with base `testsuite:myfeature` and target `fork:myfeaure`
  - once merged, rebuild the gpac PR

Finally when the gpac PR is deemed ready to merge, a team member can just:
  - merge `PR3` (`testsuite:myfeature` into `testsuite:master`)
  - merge `PR1` (`gpacfork:myfeature` into `gpac:master`)


It looks worse than it is in practice, it is usually simpler than this case.


### Adding binary files

Although text test files can be added directly in the `media/` directory of the testsuite repo, bigger and binary files should be added to the gpac binary storage that is mirrored by the test script.

Since only some members of the team can add files there, it is recommended to post them (directly or as a link) on github and someone will add them after checking their relevance.
