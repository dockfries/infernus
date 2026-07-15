# @infernus/weapon-config — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Weapon damage configuration system.

```bash
pnpm add @infernus/core @infernus/weapon-config
```

## Config

```typescript
import { defineWeaponConfig, type IWeaponConfig } from "@infernus/weapon-config";

defineWeaponConfig(() => ({
  DEBUG: false,
  MAX_REJECTED_HITS: 30,
  DEATH_WORLD: 5,
  FEED_HEIGHT: 300,
  CUSTOM_VENDING_MACHINES: false,
  // ... see IWeaponConfig for full options
}));
```

Config is split into two interfaces:

| Interface         | Scope                                                | Usage                            |
| ----------------- | ---------------------------------------------------- | -------------------------------- |
| `IWeaponConfig`   | Static, set via `defineWeaponConfig(cb)` before init | Health bar colors, debug, limits |
| `IWeaponConfigGM` | Runtime, set via public API during gameplay          | Positions, sizes, toggles        |

### IWeaponConfig (static — `defineWeaponConfig`)

| Field                 | Default      | Description                    |
| --------------------- | ------------ | ------------------------------ |
| `HEALTH_BAR_FG_COLOR` | `0xb4191dff` | Foreground (health fill) color |
| `HEALTH_BG_BG_COLOR`  | `0x5a0c0eff` | Background color               |

### IWeaponConfigGM (runtime via set\* API)

| Field                  | Default                | Description                             |
| ---------------------- | ---------------------- | --------------------------------------- |
| `healthBarPosX`        | `546.0`                | Health bar X position                   |
| `healthBarPosY`        | `66.7`                 | Health bar Y position                   |
| `healthBarSizeX`       | `61.7`                 | Health bar width                        |
| `healthBarSizeY`       | `8.4`                  | Health bar height                       |
| `healthBarPadding`     | `[2.1, 1.9, 1.6, 2.0]` | Padding `[top, right, bottom, left]`    |
| `healthBarBorderColor` | `255`                  | Border color (RGBA)                     |
| `healthBarBGColor`     | derived                | Background color (derived from fg if 0) |
| `healthBarFGColor`     | `0xb4191dff`           | Foreground/health fill color            |

> The old global TextDraw-based `healthBarBorder` and `healthBarBackground` fields have been replaced with per-player TextDraw instances and the new position/size/color fields above.

## Sync Bug Emulation

```typescript
import { setDisableSyncBugs, setKnifeSync } from "@infernus/weapon-config";
setDisableSyncBugs(true);
setKnifeSync(true);
```

## Callbacks

```typescript
import {
  onInvalidWeaponDamage,
  onPlayerDamage,
  onPlayerDamageDone,
  onPlayerDeathFinished,
  onPlayerPrepareDeath,
  onRejectedHit,
} from "@infernus/weapon-config";

onPlayerDamage(({ editable, next }) => {
  editable.amount *= 0.5; // halve damage
  return next();
});
onPlayerPrepareDeath(({ player, animLib, animName, editable, next }) => {
  editable.respawnTime = 2000;
  return next();
});
onRejectedHit(({ player, hit, next }) => {
  return next();
});
```

## Get Functions

```typescript
import {
  getWeaponDamage,
  getWeaponMaxRange,
  getWeaponShootRate,
  getRespawnTime,
  getCbugAllowed,
  getRejectedHit,
  averageHitRate,
  averageShootRate,
  returnWeaponName,
  enableHealthBarForPlayer,
  getHealthBarPosition,
  getHealthBarSize,
  getHealthBarPadding,
  getHealthBarColor,
} from "@infernus/weapon-config";
```

| Function                        | Returns                                  | Description                                                                        |
| ------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `getHealthBarPosition(player?)` | `{ ret, x, y }`                          | Get health bar position for a player or global default                             |
| `getHealthBarSize(player?)`     | `{ ret, x, y }`                          | Get health bar size for a player or global default                                 |
| `getHealthBarPadding(player?)`  | `{ ret, padding }`                       | Get health bar padding `[top, right, bottom, left]` for a player or global default |
| `getHealthBarColor(player?)`    | `{ ret, borderColor, bgColor, fgColor }` | Get health bar colors for a player or global default                               |

> `player` parameter is optional — pass `InvalidEnum.PLAYER_ID` or omit for global defaults.

## Set Functions

```typescript
import {
  setWeaponDamage,
  setWeaponMaxRange,
  setWeaponShootRate,
  setRespawnTime,
  setCbugAllowed,
  setCbugDeathDelay,
  setCustomArmourRules,
  setCustomFallDamage,
  setCustomVendingMachines,
  setDamageFeed,
  setDamageFeedForPlayer,
  setDamageSounds,
  setVehiclePassengerDamage,
  setVehicleUnoccupiedDamage,
  setWeaponArmourRule,
  damagePlayer,
  setHealthBarPosition,
  setHealthBarSize,
  setHealthBarPadding,
  setHealthBarPositionForPlayer,
  setHealthBarSizeForPlayer,
  setHealthBarPaddingForPlayer,
  setHealthBarColor,
  setHealthBarColorForPlayer,
} from "@infernus/weapon-config";
```

### Health Bar — Global

| Function               | Signature                                     | Description                                                                                                      |
| ---------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `setHealthBarPosition` | `(x: number, y: number)`                      | Set global health bar position, rebuilds affected per-player bars                                                |
| `setHealthBarSize`     | `(x: number, y: number)`                      | Set global health bar size, updates affected per-player bars                                                     |
| `setHealthBarPadding`  | `(padding: [number, number, number, number])` | Set global padding `[top, right, bottom, left]`, rebuilds affected bars                                          |
| `setHealthBarColor`    | `(borderColor?, bgColor?, fgColor?)`          | Set global colors; `bgColor` auto-derives from `fgColor` via `darkenRGBA` if `bgColor` is 0 but `fgColor` is set |

### Health Bar — Per-Player

| Function                        | Signature                                    | Description                                                                  |
| ------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `setHealthBarPositionForPlayer` | `(player, x?, y?)`                           | Override position for a specific player; pass `NaN` to fall back to global   |
| `setHealthBarSizeForPlayer`     | `(player, x?, y?)`                           | Override size for a specific player                                          |
| `setHealthBarPaddingForPlayer`  | `(player, padding?)`                         | Override padding for a specific player                                       |
| `setHealthBarColorForPlayer`    | `(player, borderColor?, bgColor?, fgColor?)` | Override colors for a specific player; auto-derives `bgColor` from `fgColor` |

> Per-player overrides default to `NaN`/`0` to fall back to the global config value. Setting a per-player value rebuilds or resizes that player's health bar immediately.

### Other

| Function                    | Description              |
| --------------------------- | ------------------------ |
| `setCbugDeathDelay(toggle)` | Toggle c-bug death delay |

## Status Checks

```typescript
import {
  isBulletWeapon,
  isHighRateWeapon,
  isMeleeWeapon,
  isDamageFeedActive,
  isPlayerDying,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "@infernus/weapon-config";
```

## Enums

```typescript
enum InvalidDamageEnum { NO_ERROR, NO_ISSUER, NO_DAMAGED, INVALID_DAMAGE, INVALID_DISTANCE }
enum DamageTypeEnum { MULTIPLIER, STATIC, RANGE_MULTIPLIER, RANGE }
enum RejectedReasonEnum { HIT_NO_DAMAGEDID, HIT_INVALID_WEAPON, ... /* 20+ reasons */ }
enum WC_WeaponEnum { UNARMED, COLT45, SILENCED, DEAGLE, SHOTGUN, M4, AK47, SNIPER, ... }
enum WC_BodyPartsEnum { UNKNOWN, TORSO, GROIN, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG, HEAD }
```
