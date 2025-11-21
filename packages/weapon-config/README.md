# @infernus/weapon-config

[![npm](https://img.shields.io/npm/v/@infernus/weapon-config)](https://www.npmjs.com/package/@infernus/weapon-config) ![npm](https://img.shields.io/npm/dw/@infernus/weapon-config) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/weapon-config)

A wrapper of the popular [SA-MP weapon-config library](https://github.com/oscar-broman/samp-weapon-config) for samp-node.

## Notice

- Mandatory use raknet and streamer
- Removed SKY

## Getting started

```sh
pnpm add @infernus/core @infernus/raknet @infernus/weapon-config
```

## Example

```ts
// if you using nex-ac, import it before weapon-config

import { GameMode } from "@infernus/core";
import {
  defineWeaponConfig,
  setVehiclePassengerDamage,
  setKnifeSync,
} from "@infernus/weapon-config";

// other imports and code

defineWeaponConfig(() => {
  return {
    DEBUG: true,
  };
});

GameMode.onInit(({ next }) => {
  setVehiclePassengerDamage(true);
  setKnifeSync(true);
  return next();
});
```
