# @infernus/rec — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

NPC recording file parsing utilities. Data block classes represent structured recording frames.

```bash
pnpm add @infernus/core @infernus/rec
```

## Data Blocks

```typescript
import {
    HeaderDataBlock,
    OnFootDataBlock,
    VehicleDataBlock,
    RecordTypesEnum,
    recToJson,
    jsonToRec,
} from "@infernus/rec";

// Header data
const header = new HeaderDataBlock();
header.version;      // number
header.type;         // number
header.hydra;        // boolean

// On-foot frame
const onfoot = new OnFootDataBlock();
onfoot.time;         // number
onfoot.leftRight;    // number
onfoot.upDown;       // number
onfoot.keys;         // number
onfoot.position;     // [number, number, number]
onfoot.rotation;     // [number, number, number, number]
onfoot.health;       // number
onfoot.armour;       // number
onfoot.weaponIdYesNoBack;  // { weaponId, yesNoBack }
onfoot.specialAction;// number
onfoot.velocity;     // [number, number, number]
onfoot.surfing;      // [number, number, number]
onfoot.surfingId;    // number
onfoot.animationId;  // number
onfoot.animationFlags; // { animationDelta, animationLoop, animationLockX, ... }

// Vehicle frame
const veh = new VehicleDataBlock();
veh.time;            // number
veh.vehicleId;       // number
veh.leftRight;       // number
veh.upDown;          // number
veh.keys;            // number
veh.rotation;        // [number, number, number, number]
veh.position;        // [number, number, number]
veh.velocity;        // [number, number, number]
veh.vehicleHealth;   // number
veh.health;          // number
veh.armour;          // number
// ... additional vehicle-specific fields
```

## File Conversion

```typescript
recToJson(filePath);   // → Promise<any[]>  — parse .rec file to JSON
jsonToRec(filePath, data);  // → Promise<void> — write JSON to .rec file
```

## Enums

```typescript
enum RecordTypesEnum { NONE = 0, DRIVER = 1, ONFOOT = 2 }
```

## Exception

`RecException` is thrown on invalid recording file parsing or conversion errors.

```typescript
import { RecException } from "@infernus/rec";
```

## Types

```typescript
// C++ struct reflection types for custom data block definitions
type CppField<OmittedKeys = never> = ...;
type CppObject<OmittedKeys = never> = CppField[];
```
