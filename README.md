This is a demonstration of running a fork of the Vue SFC Sandbox with your own design system.

Approach B: We accessing the design system as a git dependency.

This approach does not require a a publically published NPM package.

In this demonstration, our design system is the package `sample-vue-library` maintained here: https://github.com/dwjohnston/sample-vue-library
See that repository for an outline of how to create a vue package.

## How it works

1. Follow the instructions here:

https://github.com/dwjohnston/vue-repl

except, install your package as a git dependency like `git://github.com....`

[link](https://github.com/vuejs/repl/commit/20218352d9ed1047e6db51ed1a681bcf1c3cf1c6#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R124)

At this point everything will work, _except_ you won't have typings.

2. Create a codemod to do create a ts file containing `declare module 'mylibrary'` [link](https://github.com/vuejs/repl/commit/eae036fadc37bcd49290fd617cf6597f6037c87b#diff-6c849ab8479e4c0853ffee7b6ed45c9fd798bf3d0fb3160061e203702c12a900R1-R133)

This codemod examines the .d.ts file that comes from the package, wraps it in `declare module 'mylibrary'` and removes the `declare` statements inside.

3. Make this file be opened as a template by default:

https://github.com/vuejs/repl/commit/dd4309685c37e3f77f81eab448ec6e8dc96bdf28#diff-2717c7fb31c2070dd96f07394997809bc9be7f3fff03ab638db696cc480f39b6R25-R347
