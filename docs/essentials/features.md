# Features

## Streamer

The `Object`, `GangZone`, `3dText` and other `api` of native functions are replaced with `Streamer`, which means you must use the `Streamer` plugin. The original function is developed and implemented by yourself, but it is strongly not recommended and may cause unknown problems.

## Automatically destroy instance

When the game mode exits, all the `Streamer` instances, vehicle instances, textdraw, and menus will be automatically destroyed, which means you no longer need to write a large number of destroy functions repeatedly.

However, assuming that your instance needs to be destroyed when the player quits the game, you still need to destroy it manually.

## Discard

Discard functions that can be implemented by `JavaScript` built-in functions or third-party libraries, such as `floatabs`, `strcmp`, `sqlite db`, `setTimer` and so on.
This means that you should use the `JavaScript` library, and you no longer need or should use native development plugins, such as `mysql`, timerfix`, etc.

## Get string

For most string fetches, you no longer need to define a fixed-length array as native developers do. The commonly used functions have been dealt with internally in `Infernus`. The principle is that an array of strings with maximum length is defined, and then the array is automatically iterated to the point where the first byte is `0` to intercept the string, such as `GetPlayerName`, that is `player.getName()`.

The method of interception comes from the [practical functions](./i18n.md#practical-functions) in internationalization. If you encounter some similar scenarios, you do not have to repeat the wheel.

## Color conversion

`Infernus` underlying color conversion uses the [Peter Szombati's samp-node-lib](https://github.com/peterszombati/samp-node-lib) source code,used to use more semantic colors when you call certain functions during development, such as `#fff`,`#ffffff`,`(r, g, b)`, `(r, g, b, a)`.

If it is not as expected in some scenes, it is rendered black or white, such as textdraw, after using color values, you can try a different format. For example, change the original `#fff` to`(255,255,255,255)`, or still use the native developed digital format.

## Player attribute

- `getFps()`：To obtain the player's current frame rate, you can only get `1` updates every `1` second, and it may be `0`.
- `lastUpdateTick`：The timestamp of the player's last update.
- `lastUpdateFpsTick`：The last updated `fps` timestamp of the player.
- `lastDrunkLevel`：The last time the player updated the drunkenness level.

## Pause event

Built-in callback events for players to pause `onPause` and resume `onResume`. It is not necessarily suitable for `sa definitive edition` or Android version, and it is determined by timer and `onUpdate` with error amount.

:::tip
The callback may also be mistakenly triggered when the player's network is not good.
:::
