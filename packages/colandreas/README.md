# @infernus/colandreas

[![npm](https://img.shields.io/npm/v/@infernus/colandreas)](https://www.npmjs.com/package/@infernus/colandreas) ![npm](https://img.shields.io/npm/dy/@infernus/colandreas) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/colandreas)

A wrapper of the popular [SA-MP ColAndreas plugin](https://github.com/Pottus/ColAndreas) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/colandreas
```

## Example

```ts
import { GameMode, PlayerEvent } from "@infernus/core";
import { init, isPlayerInWater } from "@infernus/colandreas";

GameMode.onInit(({ next }) => {
  init();
  return next();
});

PlayerEvent.onCommandText("water", ({ player, next }) => {
  const info = isPlayerInWater(player);
  if (info)
    player.sendClientMessage(
      "#f00",
      `you are in water, ${JSON.stringify(info)}`
    );
  else {
    player.sendClientMessage("#0f0", "you are not in water");
  }
  return next();
});
```
