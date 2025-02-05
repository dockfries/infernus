# @infernus/fcnpc

[![npm](https://img.shields.io/npm/v/@infernus/fcnpc)](https://www.npmjs.com/package/@infernus/fcnpc) ![npm](https://img.shields.io/npm/dy/@infernus/fcnpc) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/fcnpc)

A wrapper of the popular [SA-MP FCNPC plugin](https://github.com/ziggi/FCNPC) for samp-node.

> ⚠ Not applicable to [open.mp NPC Component](https://github.com/openmultiplayer/open.mp/pull/916).
> If you are interested in using it, it may work with legacy sa-mp server.

## Getting started

```sh
pnpm add @infernus/core @infernus/fcnpc
```

## Example

```ts
import { FCNPC, FCNPCEvent } from "@infernus/fcnpc";

FCNPCEvent.onInit(({ next }) => {
  const fcnpc = new FCNPC("npc_name").create();
  fcnpc.spawn(0, 1697.7418, -1600.1525, 13.5469);
  return next();
});
```
