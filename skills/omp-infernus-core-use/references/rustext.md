# @infernus/rustext — API Reference

> The setters are plain JS state and can be called anywhere, but text is only rewritten when an RPC is sent to a player — so set player types inside `onConnect` / `onSpawn`.

Port of the [rustext](https://github.com/ziggi/rustext) plugin: rewrites outgoing `GameText` / `TextDraw` / `Menu` RPC text, converting cp1251 Russian text into the glyph codes of a russifier font.

**The native plugin is not needed.** The RPC rewriting is reimplemented in TypeScript, so do **not** ship `rustext.dll` / `rustext.inc` — just the package. It requires `@infernus/core` and `@infernus/raknet` as peer dependencies, and therefore the `raknet.inc` polyfill.

```sh
pnpm add @infernus/core @infernus/raknet @infernus/rustext
```

## Charset — the one thing that silently breaks

The glyph table is indexed by **cp1251** bytes, so the text must reach the RPC already encoded as cp1251. `GameText` defaults to `win1252` and `TextDraw` defaults to `ISO-8859-1`, and both turn Cyrillic into `?` (`0x3F`) _before_ this package can see it — nothing to convert, nothing recoverable:

| charset used for the call | `"Привет"` becomes                    |
| ------------------------- | ------------------------------------- |
| `win1252`, `ISO-8859-1`   | `63,63,63,63,63,63` (`??????`) — dead |
| `cp1251`                  | `207,240,232,226,229,242` — correct   |

Pass `"cp1251"` explicitly:

```typescript
new GameText("Привет, мир!", 5000, 3).forPlayer(player, "cp1251");

const td = new TextDraw({ x: 150, y: 150, text: "Я могу прочитать", charset: "cp1251" }).create();
```

This is **not** `player.charset` — `GameText` and `TextDraw` read their own `charset` (the `TextDraw` one comes from `sourceInfo.charset` and is reused by `setString`).

### Accented Latin characters ('à', 'é', 'ñ') cannot be used

Two reasons, neither fixable from here:

- cp1251 has no accented Latin characters, so they become `?` at encode time.
- The russifier font replaces the very glyph slots they live in — `convertSpecialChar` maps `à` to slot `0x97` and `À` to `0x80`, while the SanLtd table uses `0x97` for `б` and `0x80` for `Б`.

The original plugin has the same limitation (its font replaces the same slots). Use `player.sendClientMessage`, dialogs or 3D labels for Latin text — those follow `player.charset` instead.

## API

```typescript
import {
  RussifierType,
  getRussifierText,
  setPlayerRussifierType,
  getPlayerRussifierType,
  setDefaultRussifierType,
  getDefaultRussifierType,
  isDefaultRussifierEnabled,
  toggleDefaultRussifier,
} from "@infernus/rustext";
```

| Function                               | Description                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `getRussifierText(type, str)`          | Convert `str` offline. Returns `{ str, buffer, ret }`; `buffer` is the byte array, `ret` is `false` if `type` is out of range. |
| `setPlayerRussifierType(player, type)` | Set the player's type, or `RussifierType.Disabled` to disable them. Returns `false` on an invalid type.                        |
| `getPlayerRussifierType(player)`       | The type the player explicitly set, or `RussifierType.Disabled` if they never did.                                             |
| `setDefaultRussifierType(type)`        | Default for players who never set their own, or `RussifierType.Disabled` to turn it off.                                       |
| `getDefaultRussifierType()`            | Current default type, or `RussifierType.Disabled`.                                                                             |
| `isDefaultRussifierEnabled()`          | Whether the default is enabled (it is, on import).                                                                             |
| `toggleDefaultRussifier(enabled)`      | Turn the default on/off.                                                                                                       |

### RussifierType

```typescript
enum RussifierType {
  Disabled = -1,
  SanLtd = 0,
  OneC,
  Rush,
  Unknown1,
  Unknown2,
  Unknown3,
  MG, // the 7 Russian localizations
  Community,
  Ukrainian,
  Hungarian,
}
```

`SanLtd` is the default. Pass a value outside `0..9` to the setters and they return `false` instead of throwing — there is no exception class.

## Player state — default switch vs. per-player

The default switch only applies to players that never made a choice; an explicit choice, including "off", always wins:

| Player state      | default on (initial)                      | default off         |
| ----------------- | ----------------------------------------- | ------------------- |
| never set         | converted, using the current default type | not converted       |
| set to `MG`       | converted with `MG`                       | converted with `MG` |
| set to `Disabled` | **not converted**                         | not converted       |

`getPlayerRussifierType` reports `RussifierType.Disabled` both for "never set" and for "explicitly disabled". State is cleared when a player disconnects, so a reconnecting player falls back to the default.

## What cannot be converted

Only RPCs sent to a specific player are rewritten. Broadcast RPCs — `GameText.forAll` — carry no player id, so they are skipped entirely; use the per-player variants when the text must be russified. (If the server is built with open.mp's `Fixes` component, game text is implemented as per-player TextDraws instead, and is converted after all.)

## Example

Show the same sentence through every Russian russifier and let the player pick one:

```typescript
import { GameMode, PlayerEvent, TextDraw, TextDrawEvent } from "@infernus/core";
import { RussifierType, setPlayerRussifierType } from "@infernus/rustext";

const RUSSIAN_RUSSIFIERS = [
  RussifierType.SanLtd,
  RussifierType.OneC,
  RussifierType.Rush,
  RussifierType.Unknown1,
  RussifierType.Unknown2,
  RussifierType.Unknown3,
  RussifierType.MG,
];

const textRusTD: TextDraw[] = [];

GameMode.onInit(({ next }) => {
  textRusTD.length = 0;

  RUSSIAN_RUSSIFIERS.forEach((_, i) => {
    const td = new TextDraw({
      x: 150.0,
      y: 150.0 + 15.0 * i,
      text: "Я могу прочитать этот текст, это мой русификатор",
      charset: "cp1251",
    }).create();

    td.setSelectable(true);
    td.setTextSize(600.0, 10.0);
    textRusTD.push(td);
  });

  return next();
});

PlayerEvent.onSpawn(({ player, next }) => {
  textRusTD.forEach((td, i) => {
    // the text is converted when the RPC is sent, so set the type first
    setPlayerRussifierType(player, RUSSIAN_RUSSIFIERS[i]);
    td.show(player);
  });

  player.selectTextDraw(0xaa3333ff);
  return next();
});

TextDrawEvent.onPlayerClickGlobal(({ player, textDraw, next }) => {
  textRusTD.forEach((td, i) => {
    if (textDraw === td) {
      setPlayerRussifierType(player, RUSSIAN_RUSSIFIERS[i]);
      player.cancelSelectTextDraw();
    }

    td.hide(player);
  });

  return next();
});
```
