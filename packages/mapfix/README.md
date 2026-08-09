# @infernus/mapfix

[![npm](https://img.shields.io/npm/v/@infernus/mapfix)](https://www.npmx.dev/package/@infernus/mapfix) ![npm](https://img.shields.io/npm/dw/@infernus/mapfix) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/mapfix)

A wrapper of the popular [MapFix include](https://github.com/NexiusTailer/MapFix) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/mapfix
```

## Example

```ts
// default all places
import "@infernus/mapfix";

// or you can disable a place
import { toggleMapFixPlace } from "@infernus/mapfix";
toggleMapFixPlace(1, false);
```

## Note

All mapfix objects are created on `GameMode.onInit` (registered when the package is imported). To
disable a place you must call `toggleMapFixPlace(...)` at **module top level, before `GameMode.onInit`
fires** — calling it inside an event callback is too late for the current round, and it will only
apply on the next GMX restart (the next `OnGameModeInit`).
