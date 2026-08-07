# @infernus/mapfix

[![npm](https://img.shields.io/npm/v/@infernus/mapfix)](https://www.npmx.dev/package/@infernus/mapfix) ![npm](https://img.shields.io/npm/dw/@infernus/mapfix) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/mapfix)

A wrapper of the popular [MapFix include](https://github.com/NexiusTailer/MapFix) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/mapfix
```

## Example

```ts
// default all places
import "@infernus/mapfix";

// or you can disable a place
import { toggleMapFixPlace } from "@infernus/mapfix";
toggleMapFixPlace(1, false);
```
