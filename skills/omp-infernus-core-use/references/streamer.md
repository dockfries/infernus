# @infernus/streamer — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [dockfries/samp-streamer-plugin](https://github.com/dockfries/samp-streamer-plugin) v2.9.6. The Dynamic* entity classes are re-exported from `@infernus/core` via `wrapper/streamer/`. The package is `"private": true`.

## Streamer Config (static class)

```typescript
import { Streamer } from "@infernus/core";

Streamer.setTickRate(rate);
Streamer.getTickRate();
Streamer.setPlayerTickRate(player, r);
Streamer.getPlayerTickRate(player);
Streamer.toggleChunkStream(toggle);
Streamer.isToggleChunkStream();
Streamer.setChunkTickRate(type, rate);
Streamer.getChunkTickRate(type);
Streamer.setChunkSize(size);
Streamer.getChunkSize();
Streamer.setMaxItems(type, max);
Streamer.getMaxItems(type);
Streamer.setVisibleItems(type, items);
Streamer.getVisibleItems(type);
Streamer.setRadiusMultiplier(type, m);
Streamer.getRadiusMultiplier(type);
Streamer.setPriority(type, priority);
Streamer.getPriority(type);
Streamer.getPlayerStreamerPointer(player);
```

## Dynamic* Entities

All follow `new X(config).create()` pattern:

- `DynamicObject` — `{ modelId, x, y, z, rx, ry, rz, worldId?, interiorId?, playerId?, areaId?, streamDistance?, priority?, drawDistance? }`
- `DynamicPickup` — `{ modelId, type, x, y, z, worldId?, interiorId?, playerId?, areaId?, streamDistance?, priority? }`
- `DynamicActor` — `{ modelId, x, y, z, r, invulnerable, health, worldId?, interiorId?, playerId?, areaId?, streamDistance?, priority? }`
- `Dynamic3DTextLabel` — `{ text, color, x, y, z, drawDistance, worldId?, interiorId?, playerId?, areaId?, attachedPlayer?, attachedVehicle?, testLOS?, priority?, streamDistance? }`
- `DynamicMapIcon` — `{ x, y, z, type, color, style?, worldId?, interiorId?, playerId?, areaId?, streamDistance?, priority? }`
- `DynamicCheckpoint` — `{ x, y, z, size, worldId?, interiorId?, playerId?, areaId?, streamDistance?, priority? }`
- `DynamicRaceCP` — `{ type, x, y, z, nextX, nextY, nextZ, size, worldId?, interiorId?, playerId?, areaId?, streamDistance?, priority? }`
- `DynamicArea` — `new + .create()` with a type config: `type: "circle" | "sphere" | "cylinder" | "cuboid" | "rectangle" | "polygon"`

All configs also accept `extended?: boolean` — pass `extended: true` whenever any of `worldId` / `interiorId` / `playerId` / `areaId` is an **array** (see ⚠️ below).

```typescript
import { DynamicObject, DynamicArea, DynamicAreaEvent } from "@infernus/core";

const obj = new DynamicObject({ modelId: 1337, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0 });
obj.create();

obj.setPos(x, y, z);
obj.getPos();
obj.setRot(rx, ry, rz);
obj.getRot();
obj.move(x, y, z, speed, rx, ry, rz);
obj.stop();
obj.attachCamera(player);
obj.edit(player);
obj.setMaterial(slot, modelId, txd, texture, color);
obj.setMaterialText(text, slot, size, fontFace, fontSize, bold, fontColor, backColor, align);
obj.destroy();

// DynamicArea — use new + .create() with a type config, NOT static factories
const circle = new DynamicArea({
  type: "circle",
  x: 0,
  y: 0,
  size: 50,
  worldId: -1,
  interiorId: -1,
  playerId: -1,
});
circle.create();
// Available types: "circle", "sphere", "cylinder", "cuboid", "rectangle", "polygon"
// Set extended: true for array-based worldId/interiorId/playerId/areaId — see the ⚠️ note below
circle.destroy();

DynamicAreaEvent.onPlayerEnter(({ area, player, next }) => {
  return next();
});
DynamicAreaEvent.onPlayerLeave(({ area, player, next }) => {
  return next();
});
```

> ⚠️ **`extended` must match how you write `worldId` / `interiorId` / `playerId` / `areaId`.**
>
> | Value shape                      | `extended: true`? | Result                                                            |
> | -------------------------------- | ----------------- | ----------------------------------------------------------------- |
> | array, e.g. `worldId: [1, 2]`    | **Yes**           | multi-world / multi-interior / multi-player visibility            |
> | single number, e.g. `worldId: 1` | **No**            | single value kept as-is                                           |
> | array + no `extended`            | —                 | array silently flattened to `-1`, values discarded, **no error**  |
> | single number + `extended: true` | —                 | number silently replaced by `[-1]`, value discarded, **no error** |
>
> Mismatched combos never throw — the value just becomes `-1` (all worlds / all interiors). Applies uniformly to all Dynamic\* entities.

```typescript
// ✓ correct
new DynamicObject({
  modelId: 1337,
  x: 0,
  y: 0,
  z: 10,
  rx: 0,
  ry: 0,
  rz: 0,
  worldId: [1, 2],
  extended: true,
}).create();
new DynamicObject({ modelId: 1337, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0, worldId: 1 }).create();

// ✗ silent footguns — both end up as -1
new DynamicObject({
  modelId: 1337,
  x: 0,
  y: 0,
  z: 10,
  rx: 0,
  ry: 0,
  rz: 0,
  worldId: [1, 2],
}).create(); // array without extended
new DynamicObject({
  modelId: 1337,
  x: 0,
  y: 0,
  z: 10,
  rx: 0,
  ry: 0,
  rz: 0,
  worldId: 1,
  extended: true,
}).create(); // single number with extended
```

**Instance management:** All Dynamic* classes have `getInstance(id)`, `getInstances()`, and pools.

**Events:** Each Dynamic* entity has an `Event` frozen object. Common event names: `onMoved`, `onPlayerEdit`, `onPlayerSelect`, `onPlayerShoot`, `onPlayerPickUp`, `onStreamIn`, `onStreamOut`.

## Natives (raw)

```typescript
import * as StreamerNatives from "@infernus/streamer";
// All streamer plugin natives: CreateDynamicObject, DestroyDynamicObject, etc.
```

## Enums

```typescript
enum E_STREAMER { AREA_ID, ATTACHED_OBJECT, ATTACHED_PLAYER, COLOR, DRAW_DISTANCE, ... }
enum MaterialTextAlign { LEFT, CENTER, RIGHT }
enum MaterialTextSizes { SIZE_32x32 = 10, ..., SIZE_512x512 = 140 }
```
