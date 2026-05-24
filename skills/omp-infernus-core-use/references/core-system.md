# @infernus/core — System API Reference

> **All API calls in this reference must be placed inside event callbacks** (`GameMode.onInit`, `PlayerEvent.onConnect`, `onCommandText`, etc.). They will silently fail at module/global context — samp-node is not ready until `OnGameModeInit`.

## Architecture

| Export | Kind | Description |
|--------|------|-------------|
| `GameMode` | static class | Global game state, lifecycle events |
| `Dialog` | class | Promise-based async dialogs |
| `NetStats` | static class | Network statistics |
| `I18n` | class | Internationalization |
| `defineEvent` / `useTrigger` | functions | Custom event creation |
| `defineHooks` | function | Method interceptor system |
| `Streamer` | static class | Streamer plugin config |
| `Dynamic*` entities | classes | Re-exported from @infernus/streamer |

## Lifecycle Constraint

**All game API calls must be inside event callbacks.** Module-level calls silently fail:

```typescript
import { GameMode } from "@infernus/core";

// WRONG
GameMode.setWeather(10);

// CORRECT
GameMode.onInit(({ next }) => {
    GameMode.setWeather(10);
    return next();
});
```

Valid inside: `onInit`, `onConnect`, `onSpawn`, `onCommandText`, etc.

## new vs create Pattern

```typescript
// Constructor creates JS object only — NO game API call
const veh = new Vehicle({ modelId: 411, ... });
const actor = new Actor({ skin: 0, ... });
const obj = new ObjectMp({ modelId: 1337, ... });
const td = new TextDraw({ x: 100, y: 200, text: "Hello" });
const tl = new TextLabel({ text: "Label", ... });
const gz = new GangZone({ minX: 0, maxX: 100, ... });
const pu = new Pickup({ model: 1240, ... });
const menu = new Menu({ title: "Menu", ... });
const npc = new Npc("BotName");      // NPC takes name string

// .create() actually creates in-game
veh.create(); actor.create(); obj.create(); td.create();
tl.create(); gz.create(); pu.create(); menu.create();
npc.create();
```

**Classes that do NOT need `.create()`:**
- `Dialog` — `new Dialog(config)` then `.show(player)`
- `GameText` — `new GameText(str, time, style)` then `.forAll()`
- `Player` — created automatically by `onConnect`
- **`new Player(id)`** with an already-tracked ID returns the same instance

## Event System (Middleware)

```typescript
PlayerEvent.onConnect(({ player, next }) => {
    return next();       // continue chain
});
PlayerEvent.onText(({ next }) => {
    return true;         // override native default
});
```

- Multiple subscribers execute in registration order
- **Not calling `next()` stops the chain** — subsequent subscribers will not execute.
- **Return value vs chain control are independent:**
  - `return next()` — passes control to next subscriber AND forwards its return value
  - `return true` / `return false` — overrides native default but **does NOT** stop the chain (next subscriber still runs)
  - Omitting `next()` entirely — stops the chain AND returns the event's `defaultValue`
- **Async return values are discarded** — when any middleware is async, the default value is returned to the native callback immediately, regardless of what the async function returns.
- `off()` returned by subscription cancels a middleware.

## Pool System (getInstance / getInstances)

Every entity class maintains an internal `Map<number, Entity>` pool:

```typescript
const player = Player.getInstance(0);    // looks up playerPool Map by numeric ID
const veh = Vehicle.getInstance(vehId);  // looks up vehiclePool Map
```

- **Key is always the numeric in-game ID** (playerid, vehicleid, etc.). Not a config object, not a name string.
- `getInstances()` returns `[...pool.values()]` — an array of all tracked instances.
- **Per-player entities** (ObjectMp, TextDraw, GangZone, Pickup, TextLabel) have separate pools per player. Passing a `Player` scopes the lookup:

```typescript
TextDraw.getInstance(id);           // → global textdraw pool
TextDraw.getInstance(id, player);   // → that player's private textdraw pool
TextDraw.getInstances(player);      // → all textdraws for that player
```

Pools are populated automatically by event callbacks (e.g., `onConnect` adds to `playerPool`) or by constructors (`new Vehicle(id)` / `new Vehicle(config).create()`).

## Auto-Cleanup on State Changes

Some cleanup is automatic; some you must do manually:

| Trigger | Auto-Cleaned | Must Clean Manually |
|---------|-------------|---------------------|
| Player disconnect | `playerPool`, per-player ObjectMp/TextDraw/GangZone/Pickup/TextLabel pools | — |
| GameMode exit | Vehicle, Actor, FCNPC, all per-player pools cleared; Dynamic* entities destroyed | Custom timers, interval handles, global state |
| Vehicle destroyed | Entry stays in pool (ID may be reused) | — |

The `INTERNAL_FLAGS.skip` flag is set during GameMode exit — entity destroy calls skip native API invocations to avoid errors when the game server is shutting down.

### Custom Events

```typescript
import { defineEvent } from "@infernus/core";

const [onPlayerDanger, trigger] = defineEvent({
    name: "OnPlayerDanger",
    isNative: false,
    defaultValue: true,
    beforeEach(player: Player, health: number) {
        return { player, health };
    },
});

onPlayerDanger(({ player, health, next }) => {
    player.sendClientMessage("#ff0", `DANGER!`);
    return next();
});

trigger(somePlayer, somePlayer.getHealth());
```

## GameMode

```typescript
import { GameMode } from "@infernus/core";

GameMode.onInit(({ next }) => {
    GameMode.setWeather(10);         GameMode.setWorldTime(12);
    GameMode.setGravity(0.008);      GameMode.setGameModeText("MyMode");
    GameMode.showNameTags(true);     GameMode.showPlayerMarkers(mode);
    GameMode.limitGlobalChatRadius(200);
    GameMode.setNameTagDrawDistance(20);
    GameMode.disableInteriorEnterExits();
    GameMode.usePlayerPedAnims();    GameMode.manualVehicleEngineAndLights();
    GameMode.enableStuntBonusForAll(true);
    GameMode.addPlayerClass(skin, x, y, z, angle, w1, a1, w2, a2, w3, a3);
    GameMode.createExplosion(x, y, z, type, radius);   // type 0-13
    GameMode.supportAllNickname();
    GameMode.use(MyScript);
    return next();
});

GameMode.onExit(({ next }) => { return next(); });
GameMode.onIncomingConnection(({ playerId, ipAddress, port, next }) => { return next(); });

GameMode.sendRconCommand("cmd");
GameMode.getWeather();          GameMode.getWorldTime();
GameMode.getGravity();          GameMode.getServerTickRate();
GameMode.getWeaponName(id);     GameMode.getWeaponSlot(id);
GameMode.vectorSize(x, y, z);   GameMode.isValidNickName(name);
GameMode.enableCmdCaseSensitive();   GameMode.disableCmdCaseSensitive();
```

## Dialog (Promise-based)

```typescript
import { Dialog } from "@infernus/core";

const dlg = new Dialog({
    style: DialogStylesEnum.INPUT,  // MSGBOX, LIST, TABLIST, PASSWORD, FORM
    caption: "Title",
    info: "Enter text:",
    button1: "OK",
    button2: "Cancel",
});

const { response, listItem, inputText } = await dlg.show(player);
dlg.caption = "New Title";    // dynamic update via setter
Dialog.close(player);
```

## Commands

```typescript
import { PlayerEvent, GameMode } from "@infernus/core";

const off = PlayerEvent.onCommandText("help", ({ player, next, subcommand, cmdText }) => {
    return next();
});
off();   // unsubscribe

PlayerEvent.onCommandText(["msg", "message"], ({ player, subcommand, next }) => {
    // subcommand = ["hello"] for /msg hello
    return next();
});

PlayerEvent.onCommandText({
    caseSensitive: false,
    command: "foo",
    run({ player, next }) { return next(); },
});

// Guards
PlayerEvent.onCommandReceived(({ player, command, next }) => { return next(); });  // before
PlayerEvent.onCommandPerformed(({ player, command, next }) => { return next(); }); // after
PlayerEvent.onCommandError(({ player, command, error, next }) => {
    player.sendClientMessage("#f00", `Error #${error.code}: ${error.msg}`);
    return true;   // true = handled, suppress default
});
```

## NetStats

```typescript
import { NetStats } from "@infernus/core";

NetStats.getNetworkStats();                 NetStats.getPlayerNetworkStats(player);
NetStats.getBytesReceived(player);          NetStats.getBytesSent(player);
NetStats.getConnectionStatus(player);       NetStats.getConnectedTime(player);
NetStats.getIpPort(player);                 // { ip, port }
NetStats.getMessagesReceived(player);       NetStats.getMessagesSent(player);
NetStats.getMessagesRecvPerSecond(player);  NetStats.getPacketLossPercent(player);
```

## FilterScript

```typescript
import { GameMode } from "@infernus/core";
import type { IFilterScript } from "@infernus/core";

const MyScript: IFilterScript = {
    name: "my_script",
    load(...args) {
        const off1 = PlayerEvent.onCommandText("foo", ({ next }) => next());
        const off2 = PlayerEvent.onConnect(({ next }) => next());
        return [off1, off2];   // ← return cleanup array to avoid memory leaks
    },
    unload() { /* reset timers, global state */ },
};

GameMode.use(MyScript, "arg1");
GameMode.loadUseScript("my_script");
GameMode.unloadUseScript("my_script");
GameMode.reloadUseScript("my_script");
```

## Hooks

Two mechanisms:

```typescript
import { defineHooks, Player, Vehicle } from "@infernus/core";

// 1. Prototype method interception (defineHooks)
const [orig, setHook] = defineHooks(Player);
setHook("setHealth", function(health: number) {
    return orig.setHealth.call(this, Math.min(health, 100));
});

// 2. __inject__ native function replacement
const origCreate = Vehicle.__inject__.create;
Vehicle.__inject__.create = function(...args) {
    const id = origCreate(...args);
    console.log(`Vehicle ${id} created`);
    return id;
};
```

## i18n (Internationalization)

```typescript
import { I18n } from "@infernus/core";

const { $t } = new I18n("en_US", {
    zh_CN: { server: { running: "服务器已运行 %s" } },
    en_US: { server: { running: "Server running %s" } },
});
console.log($t("server.running", ["v1.0"]));
console.log($t("server.running", ["v1.0"], "zh_CN"));

player.sendClientMessage("#fff", $t("server.running", null, player.locale));

// Static utilities
I18n.encodeToBuf("text", "utf8");     // string → byte array
I18n.decodeFromBuf(bytes, "utf8");    // byte array → string
I18n.getValidStr(bytes);              // truncate at first 0-byte
```

## Colors

```typescript
player.sendClientMessage("#fff", "text");           // hex shorthand
player.sendClientMessage("#ff0000", "red");
player.sendClientMessage(-1, "white");               // native ARGB
player.sendClientMessage("(255,0,0,255)", "red");    // CSS rgba
```

## Dynamic (Streamer) Entities

Re-exported from `@infernus/streamer`. Available: `DynamicObject`, `DynamicPickup`, `DynamicActor`, `Dynamic3DTextLabel`, `DynamicMapIcon`, `DynamicCheckpoint`, `DynamicRaceCP`, `DynamicArea`.

```typescript
import { DynamicObject, DynamicArea, Streamer } from "@infernus/core";

const obj = new DynamicObject({
    modelId: 1337, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0,
    virtualWorld: -1, interior: -1, playerId: -1,
    streamDistance: 200, priority: 0,
});
obj.create();
const circle = DynamicArea.createCircle({ x: 0, y: 0, z: 0, size: 50 });
Streamer.setTickRate(50);
```

## Companion Packages

| Package | Wraps | Description |
|---------|-------|-------------|
| `@infernus/streamer` | [samp-streamer-plugin](https://github.com/samp-incognito/samp-streamer-plugin) | Dynamic objects, areas (`"private": true`) |
| `@infernus/raknet` | [Pawn.RakNet](https://github.com/katursis/Pawn.RakNet) | RakNet packet/RPC interception |
| `@infernus/fs` | Built-in filterscripts | Rewrites of official filterscripts |
| `@infernus/cef` | [omp-cef](https://github.com/aurora-mp/omp-cef) | CEF browser overlay |
| `@infernus/fcnpc` | [FCNPC](https://github.com/ziggi/FCNPC) | Advanced NPC plugin |
| `@infernus/colandreas` | [ColAndreas](https://github.com/Pottus/ColAndreas) | Collision detection |
| `@infernus/samp-voice` | [samp-voice](https://github.com/CocaColaBear/samp-voice) | In-game voice chat |
| `@infernus/progress` | — | Progress bar TextDraw |
| `@infernus/qrcode` | — | QR code via DynamicObject |
| `@infernus/query` | — | UDP server query |
| `@infernus/gps` | [samp-gps-plugin](https://github.com/AmyrAhmady/samp-gps-plugin) | GPS navigation |
| `@infernus/mapandreas` | [MapAndreas](https://github.com/Pottus/MapAndreas) | Height map |
| `@infernus/map-loader` | — | .map file loader |
| `@infernus/nex-ac` | [nex-ac](https://github.com/nex-om/nex-ac) | Anti-cheat |
| `@infernus/weapon-config` | — | Weapon damage config |
| `@infernus/create-app` | — | CLI scaffolding (`npx infernus`) |
