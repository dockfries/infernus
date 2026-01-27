# @infernus/streamer

[![npm](https://img.shields.io/npm/v/@infernus/streamer)](https://www.npmx.dev/package/@infernus/streamer) ![npm](https://img.shields.io/npm/dw/@infernus/streamer) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/streamer)

A functional wrapper of the popular [SA-MP streamer plugin](https://github.com/samp-incognito/samp-streamer-plugin) (v2.9.6) for samp-node.

## Notice

If you are using `@infernus/core` you should not use this package alone as core is already integrated internally.

## Getting started

```sh
pnpm add @infernus/streamer
```

## Example

```ts
import { CreateDynamicObject, GetDynamicObjectPos } from "@infernus/streamer";

// In a callback event, such as OnGameModeInit
samp.on("OnGameModeInit", () => {
  const exampleObj = CreateDynamicObject(
    2587,
    2001.195679,
    1547.113892,
    14.2834,
    0.0,
    0.0,
    96.0
  );
  const { x, y, z } = GetDynamicObjectPos(exampleObj);
  console.log(x, y, z);
});
```
