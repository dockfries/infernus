# @infernus/qrcode

[![npm](https://img.shields.io/npm/v/@infernus/qrcode)](https://www.npmjs.com/package/@infernus/qrcode) ![npm](https://img.shields.io/npm/dy/@infernus/qrcode) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/qrcode)

Generate simple qrcode objects for infernus.

## Getting started

```sh
pnpm add @infernus/core @infernus/qrcode
```

## Example

```ts
import {
  generateQRText,
  createQRObject,
  setObjectQRMaterial,
} from "@infernus/qrcode";
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandText("qr", ({ player, subcommand, next }) => {
  const { x, y, z } = player.getPos();

  const qrText = generateQRText("lmao");
  const obj = createQRObject(
    qrText,
    {
      x: x + 1,
      y: y + 1,
      z: z + 1,
      rx: 0,
      ry: 0,
      rz: 0,
      playerId: player.id,
      drawDistance: 300,
    },
    {
      backColor: 0xff000000,
    },
  );

  Streamer.update(player, StreamerItemTypes.OBJECT);
  player.sendClientMessage(-1, `qrcode: created id: ${obj.id}`);

  console.log(qrText);

  setTimeout(() => {
    const qrText2 = generateQRText("oaml");
    setObjectQRMaterial(obj, qrText2, {
      backColor: 0xffffff00,
    });
    player.sendClientMessage(-1, `qrcode: updated id: ${obj.id}`);
  }, 10 * 1000);

  setTimeout(() => {
    player.sendClientMessage(-1, `qrcode: destroyed id: ${obj.id}`);
    obj.destroy();
  }, 20 * 1000);

  return next();
});
```
