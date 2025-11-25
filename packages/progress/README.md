# @infernus/progress

[![npm](https://img.shields.io/npm/v/@infernus/progress)](https://www.npmjs.com/package/@infernus/progress) ![npm](https://img.shields.io/npm/dw/@infernus/progress) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/progress)

A progress bar based on `LD_SPAC:white` for precise control for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/progress
```

## Example

```ts
import { GameMode, PlayerEvent } from "@infernus/core";
import { ProgressBar, ProgressBarDirectionEnum } from "@infernus/progress";

const gBar: ProgressBar[] = [];
const gBarValue: number[] = [5.0, 5.0, 5.0, 5.0];
const gInc: number[] = [1.0, 1.0, 1.0, 1.0];

let timer: NodeJS.Timeout | null = null;

PlayerEvent.onConnect(({ player, next }) => {
  player.charset = "iso-8859-1";

  if (player.id !== 0) return next();

  const centerX = 320.0;
  const centerY = 240.0;
  const barLength = 60.0;
  const barThickness = 6.0;
  const centerGap = 10.0;
  const halfThickness = barThickness / 2;
  const halfGap = centerGap / 2;

  gBar[0] = new ProgressBar({
    player,
    x: centerX - barLength - halfGap,
    y: centerY - halfThickness,
    width: barLength,
    height: barThickness,
    color: 0x11acffff,
    max: barLength,
    min: 0,
    direction: ProgressBarDirectionEnum.left,
    value: barLength / 2,
    show: true,
  }).create();

  gBar[1] = new ProgressBar({
    player,
    x: centerX - halfThickness,
    y: centerY - barLength - halfGap,
    width: barThickness,
    height: barLength,
    color: 0xcfcf11ff,
    max: barLength,
    min: 0,
    direction: ProgressBarDirectionEnum.down,
    value: barLength / 2,
    show: true,
  }).create();

  gBar[2] = new ProgressBar({
    player,
    x: centerX - halfThickness,
    y: centerY + halfGap,
    width: barThickness,
    height: barLength,
    color: 0xac11ffff,
    max: barLength,
    min: 0,
    direction: ProgressBarDirectionEnum.up,
    value: barLength / 2,
    show: true,
  }).create();

  gBar[3] = new ProgressBar({
    player,
    x: centerX + halfGap,
    y: centerY - halfThickness,
    width: barLength,
    height: barThickness,
    color: 0xcfcaf1ff,
    max: barLength,
    min: 0,
    direction: ProgressBarDirectionEnum.right,
    value: barLength / 2,
    show: true,
  }).create();

  if (timer) clearInterval(timer);
  timer = setInterval(updateBar, 100);

  return next();
});

GameMode.onExit(({ next }) => {
  if (timer) clearInterval(timer);
  timer = null;
  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  if (player.id !== 0) return next();
  if (timer) clearInterval(timer);
  timer = null;
  gBar.length = 0;
  return next();
});

function updateBar() {
  for (let i = 0; i < 4; i++) {
    const max = gBar[i].getMaxValue();
    const min = gBar[i].getMinValue();

    if (gBarValue[i] >= max) gInc[i] = -1.0;
    if (gBarValue[i] <= min) gInc[i] = 1.0;

    gBarValue[i] += gInc[i];
    gBar[i].setValue(gBarValue[i]);
  }
}

PlayerEvent.onCommandText("showbar", ({ next }) => {
  gBar.forEach((bar) => bar.show());
  return next();
});

PlayerEvent.onCommandText("hidebar", ({ next }) => {
  gBar.forEach((bar) => bar.hide());
  return next();
});

PlayerEvent.onCommandText("delbar", ({ next }) => {
  gBar.forEach((bar) => bar.destroy());
  gBar.length = 0;
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
