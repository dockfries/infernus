---
name: omp-infernus-core-use
description: >-
  Expert on `@infernus/*` — TypeScript wrappers designed exclusively for the samp-node + open.mp server environment
  (NOT standalone Node.js). Use this skill whenever a user asks how to write an open.mp gamemode in TypeScript/JS,
  how to use @infernus/core APIs (Player, Vehicle, NPC, events, commands, dialogs), how events/commands/dialogs work,
  how to create or destroy entities, how to send messages or set player health/pos/skin, how to register commands,
  how to migrate from PAWN to Infernus, how the middleware event pipeline works, how to use `next()`, 
  how to intercept RakNet packets or read BitStream data, or how to use any companion @infernus/* package.
  Do NOT trigger for general open.mp or PAWN questions unrelated to the Infernus library, or for standalone Node.js usage.
---

# Infernus Skill

`@infernus/*` packages are **TypeScript OOP wrappers** designed exclusively for the [samp-node](https://github.com/dockfries/samp-node) + [open.mp](https://open.mp) server environment. They depend on `samp-node` being loaded as an open.mp plugin.

**Wrapper chain:** open.mp C++ → samp-node plugin (embeds Node.js) → @infernus/*

## Minimal Gamemode

```typescript
import { GameMode, PlayerEvent, Vehicle } from "@infernus/core";

// All game API calls MUST be inside events — module level calls silently fail
GameMode.onInit(({ next }) => {
  GameMode.setWeather(0);
  GameMode.setWorldTime(12);
  GameMode.addPlayerClass(0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0);
  return next();
});

PlayerEvent.onConnect(({ player, next }) => {
  player.sendClientMessage("#fff", "Welcome!");
  return next();
});

// Commands use declarative registration, not manual strcmp
PlayerEvent.onCommandText("veh", ({ player, next }) => {
  const veh = new Vehicle({ modelId: 411, x: 0, y: 0, z: 5, zAngle: 0, color: [-1, -1] });
  veh.create(); // ← must call .create(), new alone is not enough
  veh.putPlayerIn(player, 0);
  return next();
});
```

## Read This First

If the user is **new to Infernus**, read `references/getting-started.md`.
If they ask about **PAWN migration**, read `references/migration-from-pawn.md`.
If they hit an **error**, read `references/troubleshooting.md`.
If they ask about **ecosystem context** (polyfills, versions, omp-node), read `references/ecosystem.md`.

## Reference Files

### Core API

| File                          | Covers                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `references/core-entities.md` | Player, Vehicle, Actor, NPC, ObjectMp, Pickup, GangZone, TextDraw, TextLabel, Checkpoint/RaceCheckpoint, Menu, GameText                                |
| `references/core-system.md`   | Lifecycle, Event system, GameMode, Dialog, Commands, NetStats, FilterScript, Hooks, i18n, Colors, Dynamic* streamer entities, Companion packages table |

### Plugin Wrappers

| File                       | Covers                                           |
| -------------------------- | ------------------------------------------------ |
| `references/streamer.md`   | DynamicObject, DynamicArea, Streamer config      |
| `references/raknet.md`     | BitStream, packet/RPC interception, sync classes |
| `references/fcnpc.md`      | FCNPC class, full movement/combat/vehicle API    |
| `references/colandreas.md` | Raycasting, CA_Object, collision helpers         |
| `references/cef.md`        | CefBrowser, CefEvent, CEF overlay                |
| `references/samp-voice.md` | Voice streams, SampVoice, effects                |
| `references/nex-ac.md`     | Anti-cheat config, events, functions             |
| `references/gps.md`        | MapNode, GpsPath, Waze navigation                |

### Internal Utilities

| File                            | Covers                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `references/weapon-config.md`   | Weapon damage config, callbacks                                              |
| `references/e-selection.md`     | ModelSelectionMenu                                                           |
| `references/progress.md`        | ProgressBar                                                                  |
| `references/qrcode.md`          | QR code generator                                                            |
| `references/drift-detection.md` | Drift detection events                                                       |
| `references/map-loader.md`      | .map file loader                                                             |
| `references/query.md`           | UDP server query                                                             |
| `references/rec.md`             | Recording data blocks                                                        |
| `references/utilities.md`       | @infernus/distance, @infernus/mapandreas, @infernus/fs, @infernus/create-app |
| `references/s-art.md`           | Image-to-object art renderer                                                 |
| `references/veh-para.md`        | Vehicle parachute system                                                     |

### Guides

| File                                | Covers                                                |
| ----------------------------------- | ----------------------------------------------------- |
| `references/getting-started.md`     | New project setup, minimal gamemode, starter template |
| `references/migration-from-pawn.md` | PAWN ↔ Infernus mapping table                         |
| `references/troubleshooting.md`     | Common errors and fixes                               |
| `references/ecosystem.md`           | Runtime requirements, polyfills, omp-node migration   |

## Quick Truths

- **All game API calls must be inside event callbacks.** Module-level calls silently fail.
- **`new` does NOT call the game API** — only `.create()` does (Vehicle, Actor, ObjectMp, TextDraw, TextLabel, GangZone, Pickup, Menu, Npc, Dynamic*).
- **Some entities are per-player, not global.** Their config object already has a `player?` field — do NOT pass `player` as both config property and second constructor arg; they are mutually exclusive. E.g. `new TextDraw({ x: 100, text: "Hello", player })` (correct), `new TextDraw({ x: 100, text: "Hello" }, player)` (also correct, player as second arg for ID-based construction), `new TextDraw({ ..., player }, player)` (WRONG — double-specified).
- **`getInstance(id, player?)` looks up by numeric entity ID** in either the global pool or the per-player pool. It does NOT accept config objects. `getInstances(player?)` returns all instances optionally filtered by player.
- **Events use a middleware pipeline** — call `next()` to continue, return `true`/`false` to override native default.
- **Colors accept multiple formats**: `"#fff"`, `"#ff0000"`, `-1` (ARGB), `"(255,0,0,255)"` (rgba).
- **Reference [open.mp docs](https://open.mp/docs)** for native parameter ranges and behavior.
- **Async + player disconnection:** In async functions that involve a `Player`, check `player.isConnected()` after **every `await`** if you need to continue operating on that player. If the awaited promise rejects on disconnect (e.g. `dialog.show()` throws `DialogException`), use try/catch:

```typescript
async function handle(player: Player) {
  try {
    const result = await dialog.show(player);
  } catch (e) {
    if (e instanceof DialogException) return; // disconnected / closed
    throw e;
  }
  await someAsyncTask();
  if (!player.isConnected()) return; // must check after await
  player.sendClientMessage("#0f0", "still here");
}
```
