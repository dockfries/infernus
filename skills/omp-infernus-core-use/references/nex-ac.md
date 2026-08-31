# @infernus/nex-ac — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [nex-ac](https://github.com/NexiusTailer/nex-ac) anti-cheat plugin.

```bash
pnpm add @infernus/core @infernus/nex-ac
```

## Config

```typescript
import { defineNexACConfig } from "@infernus/nex-ac";

defineNexACConfig(() => ({
  LOCALE: "en",
  DEBUG: true, // default is true (on)
  AC_MAX_PING: 500,
  // ...see the INexACConfig interface in the package source for full options
}));
```

> The `INexACConfig` type is defined in the package source but is **not re-exported** from the package entry — only `defineNexACConfig` is public. If you need the type, import it from `@infernus/nex-ac/src/config` or rely on the inferred return type.

## Enable/Disable

```typescript
import {
  enableAntiCheat,
  enableAntiCheatForPlayer,
  enableAntiNOP,
  enableAntiNOPForPlayer,
} from "@infernus/nex-ac";

enableAntiCheat(code, enable); // code = anti-cheat type
enableAntiCheatForPlayer(player, code, enable);
enableAntiNOP(nopCode, enable);
enableAntiNOPForPlayer(player, nopCode, enable);
```

## Get Functions

```typescript
import {
  antiCheatGetHealth,
  antiCheatGetArmour,
  antiCheatGetPos,
  antiCheatGetSpawnPos,
  antiCheatGetSpawnWeapon,
  antiCheatGetWeaponData,
  antiCheatGetVehicleHealth,
  antiCheatGetVehiclePos,
  antiCheatGetVehicleVelocity,
  antiCheatGetVehicleZAngle,
  antiCheatGetVehicleSpawnPos,
  antiCheatGetVehicleSpawnZAngle,
  antiCheatGetPickupPos,
  antiCheatGetSpeed,
  antiCheatGetAnimationIndex,
  antiCheatGetInterior,
  antiCheatGetEnterVehicle,
  antiCheatGetEnterVehicleSeat,
  antiCheatGetWeapon,
  antiCheatGetWeaponInSlot,
  antiCheatGetAmmoInSlot,
  antiCheatGetSpecialAction,
  antiCheatGetLastSpecialAction,
  antiCheatGetLastShotWeapon,
  antiCheatGetLastPickup,
  antiCheatGetLastUpdateTime,
  antiCheatGetLastReloadTime,
  antiCheatGetLastEnteredVehTime,
  antiCheatGetLastShotTime,
  antiCheatGetLastSpawnTime,
  antiCheatGetVehicleID,
  antiCheatGetVehicleSeat,
  antiCheatGetVehicleDriver,
  antiCheatGetVehicleInterior,
  antiCheatGetVehiclePaintjob,
  antiCheatGetVehicleSpeed,
} from "@infernus/nex-ac";
```

> Position/velocity getters return `{ x, y, z, ret }` (e.g. `antiCheatGetPos`, `antiCheatGetVehiclePos`) — but `antiCheatGetVehicleVelocity` / `antiCheatGetVehicleSpawnPos` / `antiCheatGetPickupPos` / `antiCheatGetSpawnWeapon` use **`result`** as the success key instead of `ret`. `antiCheatGetWeaponData(player, slot)` returns `{ weapons, ammo, ret }`.

## Status Checks

```typescript
import {
  isAntiCheatEnabled,
  isAntiCheatEnabledForPlayer,
  isAntiNOPEnabled,
  isAntiNOPEnabledForPlayer,
  antiCheatIntEnterExitsIsEnabled,
  antiCheatStuntBonusIsEnabled,
  antiCheatIsInModShop,
  antiCheatIsInSpectate,
  antiCheatIsFrozen,
  antiCheatIsDead,
  antiCheatIsConnected,
  antiCheatIsKickedWithDesync,
} from "@infernus/nex-ac";
```

## Events

```typescript
import {
  onCheatDetected,
  onCheatWarning,
  onFloodWarning,
  onNOPWarning,
  antiCheatKickWithDesync,
} from "@infernus/nex-ac";

onCheatDetected(({ player, ipAddress, type, code, next }) => {
  return next();
});
onCheatWarning(({ player, ipAddress, type, code, code2, count, next }) => {
  return next();
});
onFloodWarning(({ player, publicId, count, next }) => {
  return next();
});
onNOPWarning(({ player, nopId, count, next }) => {
  return next();
});

antiCheatKickWithDesync(player, code);
```
