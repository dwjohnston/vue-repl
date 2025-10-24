This is a demonstration of running a fork of the Vue SFC Sandbox with your own design system.

Approach B: We accessing the design system as a git dependency.

This approach does not require a a publically published NPM package.

In this demonstration, our design system is the package `sample-vue-library` maintained here: https://github.com/dwjohnston/sample-vue-library
See that repository for an outline of how to create a vue package.

## How it works

1. We declare `sample-vue-library` as a dependency using `git://github.com...` syntax. [link](https://github.com/vuejs/repl/commit/20218352d9ed1047e6db51ed1a681bcf1c3cf1c6#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R124)
2. We re-export everything from the library in a simple barrel file: [link](https://github.com/vuejs/repl/commit/20218352d9ed1047e6db51ed1a681bcf1c3cf1c6#diff-d0c67314b79fa81f28ccaed057229681b31c3cc913a00d96ebd010f2a71c9c4bR1)
3. We reference this barrel file in the import maps: [link](https://github.com/vuejs/repl/commit/20218352d9ed1047e6db51ed1a681bcf1c3cf1c6#diff-50b3264cd5c4b065ce292b3a12cd9877205cfc2f808ce77e2f7574b913706fb7R54)

4. Import the CSS as a string:

(See)

At this point your TypeScript will not be working, because it can not be retrieved from jsdeliver

So:

5. Create a codemod to do create a ts file containing `declare module 'mylibrary'` [link](https://github.com/vuejs/repl/commit/eae036fadc37bcd49290fd617cf6597f6037c87b#diff-6c849ab8479e4c0853ffee7b6ed45c9fd798bf3d0fb3160061e203702c12a900R1-R133)

This codemod examines the .d.ts file that comes from the package, wraps it in `declare module 'mylibrary'` and removes the `declare` statements inside.

6. Make this file be opened as a template by default:

https://github.com/vuejs/repl/commit/dd4309685c37e3f77f81eab448ec6e8dc96bdf28#diff-2717c7fb31c2070dd96f07394997809bc9be7f3fff03ab638db696cc480f39b6R25-R347
