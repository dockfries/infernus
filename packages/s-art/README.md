# @infernus/s-art

[![npm](https://img.shields.io/npm/v/@infernus/s-art)](https://www.npmx.dev/package/@infernus/s-art) ![npm](https://img.shields.io/npm/dw/@infernus/s-art) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/s-art)

A wrapper of the popular [s-art library](https://sampforum.blast.hk/showthread.php?tid=554042) for samp-node.

place any picture on the map! (Render pixel images in-game using dynamic objects with material text.)

## Getting started

```sh
pnpm add @infernus/core @infernus/s-art
```

## Notice

- Mandatory use streamer
- Dimensions preferably divisible by **15** — each object renders a 15×15 pixel block
- Object count = `ceil(width / 15) × ceil(height / 15)`
  - e.g. 225×120 → 120 objects
  - e.g. 300×300 → 400 objects
- Use smaller images to reduce server load; resize via the `resize` option
- Objects aren't perfectly square, so resize original pictures for better results

## Art types

| Type | ModelId | Relative size  | Description     |
| ---- | ------- | -------------- | --------------- |
| 0    | 19464   | ~12× (largest) |                 |
| 1    | 19372   | ~6×            | (default)       |
| 2    | 2814    | ~3×            |                 |
| 3    | 18887   | ~1× (smallest) | rotated variant |

## Example

```ts
import { GameMode } from "@infernus/core";
import { SArt } from "@infernus/s-art";

GameMode.onInit(async ({ next }) => {
  const art = new SArt({
    image: "my-image-path-or-buffer",
    artType: 1,
    pos: [3, 3, 3],
    rot: [0, 0, 0],
    // worldId: -1,
    // interiorId: -1,
    // playerId: -1,
    // drawDistance: 300,
    // streamDistance: 300,
    resize: { width: 300, height: 300 },
  });

  await art.create();

  // SArt.getType(1);
  // SArt.setType(1, { modelId: 19372, ws: 3.18, hs: 3.48 });

  // const objects = art.getObjects();
  // objects.forEach((obj) => {});

  // art.destroy();
  return next();
});
```

## Reference

- [sharp](https://npmx.dev/package/sharp)
