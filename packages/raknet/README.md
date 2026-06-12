# @infernus/raknet

[![npm](https://img.shields.io/npm/v/@infernus/raknet)](https://www.npmx.dev/package/@infernus/raknet) ![npm](https://img.shields.io/npm/dw/@infernus/raknet) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/raknet)

A wrapper of the popular [open.mp raknet plugin](https://github.com/katursis/Pawn.RakNet) for samp-node.

## Polyfill-free edition (v0.14.0+)

Starting from `v0.14.0`, the `#include <polyfill/raknet>` directive is **no longer required**.

> Note: The `polyfill_raknet.pwn` gamemode must be recompiled. You **must** use our latest forked version of Pawn.RakNet:
> [dockfries/Pawn.RakNet](https://github.com/dockfries/Pawn.RakNet/releases)
>
> Additionally, download the latest samp-node build and overwrite your existing one:
> [dockfries/samp-node](https://github.com/dockfries/samp-node/releases)

> **⚠️ The polyfill-free edition is experimental** — bugs may be present.
> If you rely on the polyfill-based approach, please stay on `@infernus/raknet@0.13.x` with the original Pawn.RakNet.

## Getting started

```sh
pnpm add @infernus/core @infernus/raknet
```

## Example

```ts
import { Player } from "@infernus/core";
import { BitStream, IPacket, PacketIdList, OnFootSync, BulletSync } from "@infernus/raknet";
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
