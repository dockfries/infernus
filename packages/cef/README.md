# @infernus/cef

[![npm](https://img.shields.io/npm/v/@infernus/cef)](https://www.npmjs.com/package/@infernus/cef) ![npm](https://img.shields.io/npm/dy/@infernus/cef) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/cef)

A wrapper of the popular [samp-cef plugin](https://github.com/Pycckue-Bnepeg/samp-cef) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/cef
```

## Example

```ts
import { CefEvent } from "@infernus/cef";

CefEvent.onInitialize(({ player, success, next }) => {
  if (!player) return next();

  if (success) {
    new Cef({
      player,
      browserId: 1,
      url: "http://your-hosting.com",
      hidden: false,
      focused: false,
    });
  } else {
    player.sendClientMessage(
      -1,
      "Ahh to bad you cannot see our new cool interface ...",
    );
  }

  return next();
});
```
