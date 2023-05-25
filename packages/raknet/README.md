# @infernus/raknet

[![npm](https://img.shields.io/npm/v/@infernus/raknet)](https://www.npmjs.com/package/@infernus/raknet) ![npm](https://img.shields.io/npm/dy/@infernus/raknet) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/raknet)

A wrapper of the popular [SA-MP raknet plugin](https://github.com/katursis/Pawn.RakNet) for samp-node.

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

IPacket(PacketIdList.OnFootSync, (playerId, bs) => {
  const sync = new OnFootSync(bs).readSync();
  console.log(playerId, sync);
  return true;
});

function sendBulletData(from: Player, to: Player | -1, data: IBulletSync) {
  const bs = new BulletSync(new BitStream());
  bs.writeSync(data);

  if (to instanceof Player) {
    bs.sendPacket(to.id);
  } else {
    bs.sendPacket(to);
  }

  bs.delete();
}
```
