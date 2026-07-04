# @infernus/mapandreas

[![npm](https://img.shields.io/npm/v/@infernus/mapandreas)](https://www.npmx.dev/package/@infernus/mapandreas) ![npm](https://img.shields.io/npm/dw/@infernus/mapandreas) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/mapandreas)

A pure TypeScript heightmap query implementation for SA-MP / open.mp. No native plugin required.

## Getting started

```sh
pnpm add @infernus/core @infernus/mapandreas
```

Place [height maps](https://github.com/philip1337/samp-plugin-mapandreas/tree/master/heightmaps) (e.g. `SAFull.hmap`) in your server's `scriptfiles/` directory.

## Example

```ts
import { GameMode } from "@infernus/core";
import { MapAndreas, MapAndreasMode } from "@infernus/mapandreas";

GameMode.onInit(async ({ next }) => {
  await MapAndreas.init(MapAndreasMode.Full, "scriptfiles/SAFull.hmap");

  const { z } = MapAndreas.findAverageZ(20.001, 25.006);
  console.log(`Ground height: ${z}`);

  return next();
});

GameMode.onExit(({ next }) => {
  MapAndreas.unload();
  return next();
});
```
