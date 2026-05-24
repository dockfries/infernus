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

## Sync Bug Emulation

```typescript
import { setDisableSyncBugs, setKnifeSync } from "@infernus/weapon-config";
setDisableSyncBugs(true);
setKnifeSync(true);
```

## Callbacks

```typescript
import {
    onInvalidWeaponDamage, onPlayerDamage, onPlayerDamageDone,
    onPlayerDeathFinished, onPlayerPrepareDeath, onRejectedHit,
} from "@infernus/weapon-config";

onPlayerDamage(({ editable, next }) => {
    editable.amount *= 0.5;   // halve damage
    return next();
});
onPlayerPrepareDeath(({ player, animLib, animName, editable, next }) => {
    editable.respawnTime = 2000;
    return next();
});
onRejectedHit(({ player, hit, next }) => { return next(); });
```

## Get Functions

```typescript
import {
    getWeaponDamage, getWeaponMaxRange, getWeaponShootRate,
    getRespawnTime, getCbugAllowed, getRejectedHit,
    averageHitRate, averageShootRate,
    returnWeaponName,
    enableHealthBarForPlayer,
} from "@infernus/weapon-config";
```

## Set Functions

```typescript
import {
    setWeaponDamage, setWeaponMaxRange, setWeaponShootRate,
    setRespawnTime, setCbugAllowed,
    setCustomArmourRules, setCustomFallDamage, setCustomVendingMachines,
    setDamageFeed, setDamageFeedForPlayer, setDamageSounds,
    setVehiclePassengerDamage, setVehicleUnoccupiedDamage,
    setWeaponArmourRule,
    damagePlayer,
} from "@infernus/weapon-config";
```

## Status Checks

```typescript
import {
    isBulletWeapon, isHighRateWeapon, isMeleeWeapon,
    isDamageFeedActive, isPlayerDying,
    wc_IsPlayerPaused, wc_IsPlayerSpawned,
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
