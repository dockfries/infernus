# @infernus/rustext

[![npm](https://img.shields.io/npm/v/@infernus/rustext)](https://www.npmx.dev/package/@infernus/rustext) ![npm](https://img.shields.io/npm/dw/@infernus/rustext) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/rustext)

A wrapper of the popular [rustext plugin](https://github.com/ziggi/rustext) for samp-node.

It rewrites the text of outgoing `GameText` / `TextDraw` / `Menu` RPCs on the fly, converting cp1251 Russian text into the glyph codes of a russifier — a Russian localization mod that players install on their own client, which redraws the game's font so Cyrillic letters sit in slots the original font reserves for accented Latin characters. This package ships no russifier assets. Set each player's type to the pack they actually have: `SanLtd` (the default), `OneC`, `Rush`, `MG` and the others each lay the letters out differently.

## Getting started

```sh
pnpm add @infernus/core @infernus/raknet @infernus/rustext
```

## Charset

The conversion table is indexed by **cp1251** bytes, so the text must reach the RPC already encoded as cp1251. `GameText` defaults to `win1252` and `TextDraw` defaults to `ISO-8859-1`, and both silently replace Cyrillic with `?` (`0x3F`) before this package can see it:

| charset                 | `"Привет"` becomes                                  |
| ----------------------- | --------------------------------------------------- |
| `win1252`, `ISO-8859-1` | `63,63,63,63,63,63` — unrecoverable, nothing to fix |
| `cp1251`                | `207,240,232,226,229,242` — correct                 |

So pass `"cp1251"` explicitly. This is **not** `player.charset` — the two APIs above read their own `charset`.

```ts
import { GameText } from "@infernus/core";

new GameText("Привет, мир!", 5000, 3).forPlayer(player, "cp1251");
```

## Example

A port of the [original plugin's example](https://github.com/ziggi/rustext#example-of-usage): show the same sentence through every Russian russifier and let the player pick the one their client reads best.

Note the ordering in `onSpawn`: the text is converted when the RPC is sent, so each player's type has to be set **before** the textdraw is shown.

```ts
import { GameMode, PlayerEvent, TextDraw, TextDrawEvent } from "@infernus/core";
import { RussifierType, setPlayerRussifierType } from "@infernus/rustext";

const TEXT_BASE_X = 150.0;
const TEXT_BASE_Y = 150.0;

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
      x: TEXT_BASE_X,
      y: TEXT_BASE_Y + 15.0 * i,
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

## API

| Function                               | Description                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `getRussifierText(type, str)`          | Convert `str` with the given russifier. Returns `{ str, buffer, ret }`, where `buffer` is the byte array.    |
| `setPlayerRussifierType(player, type)` | Set the player's russifier, or disable it with `RussifierType.Disabled`. Returns `false` on an invalid type. |
| `getPlayerRussifierType(player)`       | The type the player explicitly set, or `RussifierType.Disabled` if they never did.                           |
| `setDefaultRussifierType(type)`        | Default type used for players who never set their own, or `RussifierType.Disabled` to turn it off.           |
| `getDefaultRussifierType()`            | The current default type, or `RussifierType.Disabled`.                                                       |
| `isDefaultRussifierEnabled()`          | Whether the default is enabled.                                                                              |
| `toggleDefaultRussifier(enabled)`      | Turn the default on/off.                                                                                     |

## Notes

- Only RPCs sent to a specific player are rewritten. Broadcast RPCs (`GameText.forAll`, …) carry no player id and cannot be converted — use the per-player variants.
- The default switch only applies to players who never made a choice: `setPlayerRussifierType(player, RussifierType.Disabled)` disables that player even while the default is on. Use `setDefaultRussifierType(RussifierType.Disabled)` or `toggleDefaultRussifier(false)` to turn it off for everyone who has not set their own.
- A player who never set a type is converted while the default is on, using the current default type, and `getPlayerRussifierType` reports `RussifierType.Disabled` for them until they set one.
- The package takes effect on import: once `@infernus/rustext` is loaded, `@infernus/core` stops applying its own `convertSpecialChar` mapping to per-player `GameText` and `TextDraw` text, leaving that job to this package. `GameText.forAll` keeps the mapping, because broadcast RPCs cannot be converted.
