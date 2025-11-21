# @infernus/raknet

[![npm](https://img.shields.io/npm/v/@infernus/raknet)](https://www.npmjs.com/package/@infernus/raknet) ![npm](https://img.shields.io/npm/dw/@infernus/raknet) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/raknet)

A wrapper of the popular [open.mp raknet plugin](https://github.com/katursis/Pawn.RakNet) for samp-node.

**You must use an existing [polyfill](https://github.com/dockfries/infernus-starter/blob/main/gamemodes/polyfill/raknet.inc) or compile the corresponding GameMode based on it before you can use it.**

## Getting started

```sh
pnpm add @infernus/core @infernus/raknet
```

## Example

```ts
import { Player } from "@infernus/core";
import {
  BitStream,
  IPacket,
  PacketIdList,
  OnFootSync,
  BulletSync,
} from "@infernus/raknet";
import type { IBulletSync } from "@infernus/raknet";

IPacket(PacketIdList.OnFootSync, ({ playerId, bs, next }) => {
  const sync = new OnFootSync(bs).readSync();
  console.log(playerId, sync);
  return next();
});

function sendBulletData(from: Player, to: Player | -1, data: IBulletSync) {
  const bs = new BulletSync(new BitStream());
  bs.writeSync(data);
  bs.sendPacket(to);
  bs.delete();
}
```
