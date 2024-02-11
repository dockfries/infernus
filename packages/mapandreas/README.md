# @infernus/mapandreas

[![npm](https://img.shields.io/npm/v/@infernus/mapandreas)](https://www.npmjs.com/package/@infernus/mapandreas) ![npm](https://img.shields.io/npm/dy/@infernus/mapandreas) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/mapandreas)

A wrapper of the popular [SA-MP MapAndreas plugin](https://github.com/philip1337/samp-plugin-mapandreas) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/mapandreas
```

## Example

```ts
import { GameMode } from "@infernus/core";
import { MapAndreas, MapAndreasMode } from "@infernus/mapandreas";

GameMode.onInit(({ next }) => {
  MapAndreas.init(MapAndreasMode.Full, "scriptfiles/SAFull.hmap");

  let pos = MapAndreas.findAverageZ(20.001, 25.006);

  if (pos) {
    // Found position - position saved in 'pos'
  }
  return next();
});
```
