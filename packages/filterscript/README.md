# @infernus/fs

[![npm](https://img.shields.io/npm/v/@infernus/fs)](https://www.npmjs.com/package/@infernus/fs) ![npm](https://img.shields.io/npm/dy/@infernus/fs) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/fs)

A collection of all built-in filterscripts, implemented with [@infernus/core](https://github.com/dockfries/infernus).

## Getting started

```sh
pnpm add @infernus/core @infernus/fs
```

## Example

```ts
import { GameMode } from "@infernus/core";
import { useA51BaseFS, Base, AntiFlood } from "@infernus/fs";

GameMode.use(useA51BaseFS({ debug: true }));
GameMode.use(Base);
GameMode.use(AntiFlood);
```
