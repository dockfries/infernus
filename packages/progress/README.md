# @infernus/progress

[![npm](https://img.shields.io/npm/v/@infernus/progress)](https://www.npmjs.com/package/@infernus/progress) ![npm](https://img.shields.io/npm/dw/@infernus/progress) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/progress)

A wrapper of the popular [SA-MP TextDraw progress2 library](https://github.com/Southclaws/progress2) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/progress
```

## Example

```ts
import { GameMode, PlayerEvent } from "@infernus/core";
import { ProgressBar, ProgressBarDirectionEnum } from "@infernus/progress";

const gBar: ProgressBar[] = [];
const gBarValue: number[] = [2.0, 5.0, 7.0, 3.344];
const gInc: number[] = [1.0, 1.0, 1.0, 1.0];

let timer: NodeJS.Timeout | null = null;

PlayerEvent.onConnect(({ player, next }) => {
  player.charset = "iso-8859-1";

  if (player.id !== 0) return next();

  gBar[0] = new ProgressBar({
    player,
    x: 310.0,
    y: 200.0,
    width: 50.0,
    height: 10.0,
    color: 0x11acffff,
    max: 10.0,
    direction: ProgressBarDirectionEnum.left,
    value: 0.0001,
    show: true,
  }).create();
  gBar[1] = new ProgressBar({
    player,
    x: 320.0,
    y: 200.0,
    width: 10.0,
    height: 50.0,
    color: 0xcfcf11ff,
    max: 10.0,
    direction: ProgressBarDirectionEnum.up,
    value: 5.0,
    show: true,
  }).create();
  gBar[2] = new ProgressBar({
    player,
    x: 320.0,
    y: 215.0,
    width: 10.0,
    height: 50.0,
    color: 0xac11ffff,
    max: 10.0,
    direction: ProgressBarDirectionEnum.down,
    value: 0.0001,
    show: true,
  }).create();
  gBar[3] = new ProgressBar({
    player,
    x: 320.0,
    y: 200.0,
    width: 50.0,
    height: 10.0,
    color: 0xcfcaf1ff,
    max: 10.0,
    direction: ProgressBarDirectionEnum.right,
    value: 5.0,
    show: true,
  }).create();

  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(updateBar, 100);

  return next();
});

GameMode.onExit(({ next }) => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  if (player.id !== 0) return next();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  gBar.length = 0;
  return next();
});

function updateBar() {
  for (let i = 0; i < 4; i++) {
    if (gBarValue[i] >= gBar[i].getMaxValue()) {
      gInc[i] = -1.0;
    }

    if (gBarValue[i] <= 0.0) {
      gInc[i] = 1.0;
    }

    gBar[i].setValue(gBarValue[i]);
    gBarValue[i] += gInc[i];
  }
}

PlayerEvent.onCommandText("showbar", ({ next }) => {
  gBar[0].show();
  return next();
});

PlayerEvent.onCommandText("hidebar", ({ next }) => {
  gBar[0].hide();
  return next();
});

PlayerEvent.onCommandText("delbar", ({ next }) => {
  gBar[0].destroy();
  return next();
});

PlayerEvent.onCommandText("barv", ({ player, subcommand, next }) => {
  const value = +subcommand[0] || 0;
  gBar[0].setValue(value);
  player.sendClientMessage(-1, `Value: ${gBar[0].getValue()}`);
  return next();
});

PlayerEvent.onCommandText("barm", ({ player, subcommand, next }) => {
  const value = +subcommand[0] || 0;
  gBar[0].setMaxValue(value);
  player.sendClientMessage(-1, `MaxValue: ${gBar[0].getMaxValue()}`);
  return next();
});

PlayerEvent.onCommandText("barc", ({ subcommand, next }) => {
  const value = +subcommand[0] || 0;
  gBar[0].setColor(value);
  return next();
});

PlayerEvent.onCommandText("barp", ({ player, subcommand, next }) => {
  if (subcommand.length !== 4) {
    player.sendClientMessage(-1, "Usage: /barp x y width height");
    return next();
  }
  const [w, y, x, h] = subcommand.map((v) => +v || 0);
  gBar[0].setPos(x, y);
  gBar[0].setWidth(w);
  gBar[0].setHeight(h);
  return next();
});
```
