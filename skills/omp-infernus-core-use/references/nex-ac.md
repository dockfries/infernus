# @infernus/nex-ac — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [nex-ac](https://github.com/NexiusTailer/nex-ac) anti-cheat plugin.

```bash
pnpm add @infernus/core @infernus/nex-ac
```

## Config

```typescript
import { defineNexACConfig, type INexACConfig } from "@infernus/nex-ac";

defineNexACConfig(() => ({
  LOCALE: "en",
  DEBUG: false,
  AC_MAX_PING: 500,
  // ...see INexACConfig for full options
}));
```

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
