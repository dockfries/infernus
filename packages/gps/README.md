# @infernus/gps

[![npm](https://img.shields.io/npm/v/@infernus/gps)](https://www.npmjs.com/package/@infernus/gps) ![npm](https://img.shields.io/npm/dw/@infernus/gps) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/gps)

A wrapper of the popular [SA-MP GPS plugin](https://github.com/AmyrAhmady/samp-gps-plugin) for samp-node, built-in [WazeGPS](https://github.com/devbluen/WazeGPS-Samp).

**You must use an existing [polyfill](https://github.com/dockfries/infernus-starter/blob/main/gamemodes/polyfill/gps.inc) or compile the corresponding GameMode based on it before you can use it.**

## Getting started

```sh
pnpm add @infernus/core @infernus/gps
```

## Example

```ts
import { WazeEvent, isValidWazeGPS, setPlayerWaze, stopWazeGPS } from "@infernus/gps";
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onClickMap(({ player, fX, fY, fZ, next }) => {
  player.sendClientMessage(-1, "GPS set!");
  setPlayerWaze(player, fX, fY, fZ);
  return next();
});

PlayerEvent.onCommandText("stopgps", ({ player, next }) => {
  if (isValidWazeGPS(player)) {
    stopWazeGPS(player);
  }
  return next();
});

WazeEvent.onPlayerRouteFinish(({ player, finishedRoute, next }) => {
  player.sendClientMessage(
    -1,
    "Route finished!" + finishedRoute.tickPosition.toString(),
  );
  return next();
});
```
