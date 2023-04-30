# @infernus/wrapper

[![npm](https://img.shields.io/npm/v/@infernus/wrapper)](https://www.npmjs.com/package/@infernus/wrapper) ![npm](https://img.shields.io/npm/dy/@infernus/wrapper) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/wrapper)

As the core helper, added some features(natives and callbacks) that were added during the omp beta that were not incorporated into the core due to historical issues.

## Getting started

```sh
pnpm add @infernus/wrapper
```

## Example

```ts
import { GetPlayerRawIp, GetPlayerRotationQuat } from "@infernus/wrapper";

// In an event

const ip = GetPlayerRawIp(playerid);
console.log(`${playerid} with raw ip ${ip} has connected to the server`);

const { w, x, y, z } = GetPlayerRotationQuat(p.playerid);
console.log(w, x, y, z);
```
