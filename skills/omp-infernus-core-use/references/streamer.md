# @infernus/streamer — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [samp-incognito/samp-streamer-plugin](https://github.com/samp-incognito/samp-streamer-plugin) v2.9.6. The Dynamic* entity classes are re-exported from `@infernus/core` via `wrapper/streamer/`. The package is `"private": true`.

## Streamer Config (static class)

```typescript
import { Streamer } from "@infernus/core";

Streamer.setTickRate(rate);             Streamer.getTickRate();
Streamer.setPlayerTickRate(player, r);  Streamer.getPlayerTickRate(player);
Streamer.toggleChunkStream(toggle);     Streamer.isToggleChunkStream();
Streamer.setChunkTickRate(type, rate);  Streamer.getChunkTickRate(type);
Streamer.setChunkSize(size);            Streamer.getChunkSize();
Streamer.setMaxItems(type, max);        Streamer.getMaxItems(type);
Streamer.setVisibleItems(type, items);  Streamer.getVisibleItems(type);
Streamer.setRadiusMultiplier(type, m);  Streamer.getRadiusMultiplier(type);
Streamer.setPriority(type, priority);   Streamer.getPriority(type);
Streamer.getPlayerStreamerPointer(player);
```

## Dynamic* Entities

All follow `new X(config).create()` pattern:

- `DynamicObject` — `{ modelId, x, y, z, rx, ry, rz, virtualWorld?, interior?, playerId?, streamDistance?, priority?, drawDistance? }`
- `DynamicPickup` — `{ modelId, type, x, y, z, virtualWorld?, interior?, playerId?, streamDistance?, priority? }`
- `DynamicActor` — `{ modelId, x, y, z, r, invulnerable?, health?, virtualWorld?, interior?, playerId?, streamDistance?, priority? }`
- `Dynamic3DTextLabel` — `{ text, color, x, y, z, drawDistance, virtualWorld?, interior?, playerId?, attachedPlayer?, attachedVehicle?, testLOS?, priority?, streamDistance? }`
- `DynamicMapIcon` — `{ x, y, z, type, color, style?, virtualWorld?, interior?, playerId?, streamDistance?, priority? }`
- `DynamicCheckpoint` — `{ x, y, z, size, virtualWorld?, interior?, playerId?, streamDistance?, priority? }`
- `DynamicRaceCP` — `{ type, x, y, z, nextX, nextY, nextZ, size, virtualWorld?, interior?, playerId?, streamDistance?, priority? }`
- `DynamicArea` — use static factories: `DynamicArea.createCircle()`, `createCylinder()`, `createSphere()`, `createRectangle()`, `createCuboid()`, `createPolygon()`

```typescript
import { DynamicObject, DynamicArea, DynamicAreaEvent } from "@infernus/core";

const obj = new DynamicObject({ modelId: 1337, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0 });
obj.create();

obj.setPos(x, y, z);    obj.getPos();
obj.setRot(rx, ry, rz); obj.getRot();
obj.move(x, y, z, speed, rx, ry, rz);
obj.stop();
obj.attachCamera(player);
obj.edit(player);
obj.setMaterial(slot, modelId, txd, texture, color);
obj.setMaterialText(text, slot, size, fontFace, fontSize, bold, fontColor, backColor, align);
obj.destroy();

// DynamicArea — use new + .create() with a type config, NOT static factories
const circle = new DynamicArea({ type: "circle", x: 0, y: 0, size: 50, worldId: -1, interiorId: -1, playerId: -1 });
circle.create();
// Available types: "circle", "sphere", "cylinder", "cuboid", "rectangle", "polygon"
// Set extended: true in config for array-based world/interior/playerId support
circle.destroy();

DynamicAreaEvent.onPlayerEnter(({ area, player, next }) => { return next(); });
DynamicAreaEvent.onPlayerLeave(({ area, player, next }) => { return next(); });
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
