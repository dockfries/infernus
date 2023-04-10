# @infernus/core

[![npm](https://img.shields.io/npm/v/@infernus/core)](https://www.npmjs.com/package/@infernus/core) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/core)

NodeJS library for Scripting [Open Multiplayer](https://open.mp), in conjunction with [omp-node-starter](https://github.com/dockfries/omp-node-starter) template.

## Composition

| /   | Layer                   | Example                             |
| --- | ----------------------- | ----------------------------------- |
| 1   | Application Development | GameMode such as freeroam, roleplay |
| 2   | Class Wrapper           | Call functional wrappers by classes |
| 3   | Functional Wrapper      | Such as samp/omp/streamer wrapper   |
| 4   | Samp Node               | SDK builds a bridge to the base     |
| 5   | Omp Server              | Base                                |

## Notice

- It is strongly recommended not to mix functional wrapper with class wrapper.
- Please wait for the [Omp Node](https://github.com/AmyrAhmady) to support component plugins, such as [Pawn.RakNet](https://github.com/katursis/Pawn.RakNet)

## License

[MIT](./LICENSE)
