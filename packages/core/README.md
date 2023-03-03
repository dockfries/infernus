# omp-node-lib

[![npm](https://img.shields.io/npm/v/omp-node-lib)](https://www.npmjs.com/package/omp-node-lib) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/omp-node-lib)

NodeJS library for Scripting [Open Multiplayer](https://open.mp), depends on [omp-node-ts](https://github.com/dockfries/omp-node-ts) template.

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
