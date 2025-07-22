# @infernus/map-loader

[![npm](https://img.shields.io/npm/v/@infernus/map-loader)](https://www.npmjs.com/package/@infernus/map-loader) ![npm](https://img.shields.io/npm/dy/@infernus/map-loader) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/map-loader)

## Getting started

A tool for obj conversion, parsing, and loading, which refers to [samp-map-parser](https://github.com/TommyB123/samp-map-parser).

```sh
pnpm add @infernus/core @infernus/map-loader
```

## Example

```ts
import { GameMode } from "@infernus/core";
import {
  getMapCount,
  getMapInfoFromID,
  loadMap,
  mapConverter,
} from "@infernus/map-loader";
import path from "node:path";

GameMode.onInit(async ({ next }) => {
  const start = Date.now();

  await mapConverter({
    input: path.resolve("./scriptfiles/us_mapas.pwn"),
    output: path.resolve("./scriptfiles/us_mapas.txt"),
    removeOutput: true,
  });

  const end = Date.now();

  console.log((end - start) / 1000 + "s");

  const mapId = await loadMap({
    source: path.resolve("./scriptfiles/us_mapas.txt"),
    onLoaded(objects, removedBuilding) {
      console.log(objects.length, removedBuilding.length);
    },
  });

  console.log(mapId);

  const info = getMapInfoFromID(mapId);

  console.log(info);

  console.log(getMapCount());

  return next();
});
```
