# @infernus/colandreas — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [SA-MP ColAndreas plugin](https://github.com/Pottus/ColAndreas). Collision detection and raycasting.

```bash
pnpm add @infernus/core @infernus/colandreas
```

## Init

```typescript
import { init } from "@infernus/colandreas";

GameMode.onInit(({ next }) => {
    init();
    return next();
});
```

## Raycasting (natives)

```typescript
import {
    rayCastLine,           // → { ret, x, y, z } | null
    rayCastLineID,         // → includes object ID
    rayCastLineExtraID,    // → with type filter
    rayCastLineAngle,      // → { x, y, z, rx, ry, rz } | null
    rayCastLineAngleEx,    // → extended with surface angles
    rayCastLineNormal,     // → { x, y, z, nx, ny, nz } | null
    rayCastReflectionVector, // → { x, y, z, nx, ny, nz } | null
    rayCastLineEx,         // → extended with rotation/contact
    rayCastMultiLine,      // → { collisions, x[], y[], z[], dist[], modelIds[] }
    contactTest,           // → boolean
} from "@infernus/colandreas";
```

## Building Manipulation

```typescript
import { removeBuilding, restoreBuilding } from "@infernus/colandreas";

removeBuilding(modelId, x, y, z, radius);
restoreBuilding(modelId, x, y, z, radius);
```

## Helper Functions

```typescript
import {
    findZ_For2DCoord,       // → number | undefined
    rayCastExplode,         // → { x, y, z }[] — explosion ray fragmentation
    isPlayerInWater,        // → false | { depth, playerDepth }
    isVehicleInWater,       // → false | { depth, vehicleDepth }
    isPlayerOnSurface,      // → boolean
    isVehicleOnSurface,     // → boolean
    isPlayerNearWater,      // → boolean
    isVehicleNearWater,     // → boolean
    isPlayerFacingWater,    // → boolean
    isVehicleFacingWater,   // → boolean
    isPlayerBlocked,        // → boolean
    isVehicleBlocked,       // → boolean
    removeBarriers,         // → boolean
    removeBreakableBuildings, // → boolean
    getRoomHeight,          // → number
    getRoomCenter,          // → -1 | { size, m_x, m_y }
} from "@infernus/colandreas";
```

## Model Utilities

```typescript
import {
    eulerToQuat,              // → { x, y, z, w, ret }
    quatToEuler,              // → { rx, ry, rz, ret }
    getModelBoundingBox,      // → { minX, minY, minZ, maxX, maxY, maxZ } | null
    getModelBoundingSphere,   // → { offX, offY, offZ, radius } | null
    loadFromDff,              // → number
} from "@infernus/colandreas";
```

## CA_Object

Collision object attached to a DynamicObject.

```typescript
import { CA_Object } from "@infernus/colandreas";

const obj = new CA_Object(dynamicObject, dc?, newObject?);
obj.setPos(x, y, z);           // → boolean
obj.setRot(rx, ry, rz);         // → boolean
obj.setExtraID(type, data);     // → boolean
obj.getExtraID(type);           // → number
obj.isValid();                  // → number
obj.getCollisionID();           // → number
obj.getObjectId();              // → number
obj.destroy();

CA_Object.destroyAll();
```

## Defines

```typescript
MAX_CA_OBJECTS = 50000;
WATER_OBJECT = 20000;
FLOAT_INFINITY = 2139095040;
MAX_MULTICAST_SIZE = 99;
INVALID_CA_ID = -1;
```
