# Infernus

[![npm](https://img.shields.io/npm/v/@infernus/core)](https://www.npmjs.com/package/@infernus/core) ![npm](https://img.shields.io/npm/dy/@infernus/core) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/core)

The name "Infernus" comes from the vehicle id 411 in the game.

NodeJS library for scripting [Open Multiplayer](https://open.mp). Highly recommended to get started with the [infernus-starter](https://github.com/dockfries/infernus-starter) template.

## Installation

```sh
pnpm add @infernus/core
```

## Composition

| /   | Layer                   | Example                             |
| --- | ----------------------- | ----------------------------------- |
| 1   | Application Development | GameMode such as freeroam, roleplay |
| 2   | Class Wrapper           | Call functional wrappers by classes |
| 3   | Functional Wrapper      | Such as samp/omp/streamer wrapper   |
| 4   | Samp Node               | SDK builds a bridge to the base     |
| 5   | Omp Server              | Base                                |

## License

[MIT](./LICENSE) License © 2022-PRESENT [Carl You](https://github.com/dockfries)
