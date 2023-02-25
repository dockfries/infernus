# omp-wrapper

[![npm](https://img.shields.io/npm/v/omp-wrapper)](https://www.npmjs.com/package/omp-wrapper) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/omp-wrapper)

A functional wrapper of the omp new scripting api (natives and callbacks) for samp-node.

## Getting started

```sh
pnpm add omp-wrapper
```

## Example

```ts
import { GetPlayerRawIp, GetPlayerRotationQuat } from "omp-wrapper";

// In an event

const ip = GetPlayerRawIp(playerid);
console.log(`${playerid} with raw ip ${ip} has connected to the server`);

const { w, x, y, z } = GetPlayerRotationQuat(p.playerid);
console.log(w, x, y, z);
```
