# @infernus/drift-detection

[![npm](https://img.shields.io/npm/v/@infernus/drift-detection)](https://www.npmx.dev/package/@infernus/drift-detection) ![npm](https://img.shields.io/npm/dw/@infernus/drift-detection) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/drift-detection)

A wrapper of the popular [SA-MP driftDetection library](https://github.com/karimoldacc/drift-detection) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/drift-detection
```

## Example

```ts
import { GameMode, Vehicle } from "@infernus/core";
import { Drift, DriftEvent } from "@infernus/drift-detection";

GameMode.onInit(({ next }) => {
  const veh = new Vehicle({
    modelId: 562,
    x: 3,
    y: 3,
    z: 3,
    color: [-1, -1],
    zAngle: 0,
  });
  veh.create();
  veh.addComponent(1010);
  Drift.enableDetection(-1);
  return next();
});

DriftEvent.onPlayerStart(({ player, next }) => {
  console.log(player.id);
  return next();
});

DriftEvent.onPlayerUpdate(({ player, driftAngle, speed, time, next }) => {
  console.log(player.id, driftAngle, speed, time);
  return next();
});

DriftEvent.onPlayerEnd(({ player, reason, distance, time, next }) => {
  console.log(player.id, reason, distance, time);
  return next();
});
```
