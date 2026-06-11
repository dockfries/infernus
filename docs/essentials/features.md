# Features

## Automatic Instance Destruction

When the GameMode exits, all `Streamer/vehicle/textdraw/menus...` instances are automatically destroyed — no more repetitive cleanup code.

However, if an instance needs to be destroyed when a player disconnects, you still need to handle that manually.

## Discarded

Functions that can be implemented with built-in JavaScript features or third-party libraries (e.g., `floatabs`, `strcmp`, `sqlite db`, `setTimer`) have been discarded. This means you should use JavaScript libraries instead of native plugins like `mysql` or `timerfix`.

## String Retrieval

For most string operations, you no longer need to define fixed-length arrays as in native development. Common functions are handled internally by `Infernus`. The principle is straightforward: a maximum-length buffer is allocated, then iterated until the first `0` byte is found, marking the end of the string — for example, `GetPlayerName` becomes `player.getName().name`.

This approach comes from the [practical functions](./i18n.md#practical-functions) in the internationalization module. If you encounter similar scenarios, there's no need to reinvent the wheel.

## Color Conversion

`Infernus`'s underlying color conversion is based on [Peter Szombati's samp-node-lib](https://github.com/peterszombati/samp-node-lib), allowing you to use more semantic color values like `#fff`, `#ffffff`, `(r, g, b)`, or `(r, g, b, a)` when calling certain functions.

If a color doesn't render as expected in certain contexts (e.g., textdraws appear black or white), try a different format — switch `#fff` to `(255, 255, 255, 255)`, or fall back to the native numeric format.

## Player Attributes

- `getFps()`: Returns the player's current frame rate (limited to one update per second; may return `0`).
- `lastUpdateTick`: Timestamp of the player's last update.
- `lastUpdateFpsTick`: Timestamp of the player's last FPS update.
- `lastDrunkLevel`: The player's last reported drunk level.

## Pause Events

Built-in callbacks for player pause (`onPause`) and resume (`onResume`). These may not work reliably with the SA Definitive Edition or Android version, as they rely on timers and `onUpdate` with a margin of error.

:::tip
The callback may also be inadvertently triggered when the player's network connection is poor.
:::
