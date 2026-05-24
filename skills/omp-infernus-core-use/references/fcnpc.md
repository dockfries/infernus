# @infernus/fcnpc — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [FCNPC plugin](https://github.com/ziggi/FCNPC). Advanced NPC system with full movement, combat, vehicle, animation, and pathfinding control. Compatible with legacy SA-MP only (not [open.mp NPC](https://github.com/openmultiplayer/open.mp/pull/916)).

```bash
pnpm add @infernus/core @infernus/fcnpc
```

## FCNPC Class

```typescript
import { FCNPC, FCNPCEvent } from "@infernus/fcnpc";

// Create
const npc = new FCNPC("npc_name");
npc.create();        // connect NPC
npc.spawn(skin, x, y, z);
npc.respawn();
npc.kill();
npc.destroy();

// Movement
npc.setPosition(x, y, z);          npc.getPosition();       // → { x, y, z, ret }
npc.givePosition(x, y, z);         npc.setAngle(angle);
npc.giveAngle(angle);              npc.getAngle();
npc.setAngleToPos(x, y);           npc.setAngleToPlayer(player);
npc.setQuaternion(w, x, y, z);     npc.getQuaternion();
npc.setVelocity(x, y, z);          npc.getVelocity();
npc.giveVelocity(x, y, z);         npc.setSpeed(speed);
npc.getSpeed();                    npc.getDestination();
npc.goto(x, y, z, type, speed, mode, pathFinding, radius, setAngle, minDist, stopDelay);
npc.gotoPlayer(player, ...);
npc.stop();                        npc.isMoving();

// Aiming & Combat
npc.aimAt(x, y, z, shoot, delay, setAngle, ...);
npc.aimAtPlayer(player, ...);
npc.stopAim();
npc.meleeAttack(delay, fightingStyle);
npc.stopAttack();                  npc.isAttacking();
npc.triggerWeaponShot(weapon, hitType, hitId, x, y, z, ...);

// Weapons
npc.setWeapon(weaponId);           npc.getWeapon();
npc.setAmmo(ammo);                 npc.giveAmmo(ammo);
npc.getAmmo();                     npc.setAmmoInClip(ammo);
npc.getAmmoInClip();
npc.setWeaponInfo(weapon, reload, shoot, clip, accuracy);
npc.getWeaponInfo(weapon);
FCNPC.setWeaponDefaultInfo(weapon, reload, shoot, clip, accuracy);
FCNPC.getWeaponDefaultInfo(weapon);

// Health & Armour
npc.setHealth(health);             npc.giveHealth(amount);
npc.getHealth();                   npc.setArmour(armour);
npc.giveArmour(amount);            npc.getArmour();
npc.setInvulnerable(bool);         npc.isInvulnerable();

// Skin & Appearance
npc.setSkin(skinId);               npc.getSkin();
npc.getCustomSkin();

// Animation
npc.setAnimation(animId, delta, loop, lockX, lockY, freeze, time);
npc.setAnimationByName(name, ...);
npc.resetAnimation();              npc.getAnimation();
npc.applyAnimation(...);           npc.clearAnimations();
npc.setFightingStyle(style);

// Vehicle
npc.enterVehicle(vehicle, seat, moveType);
npc.exitVehicle();                 npc.putInVehicle(vehicle, seat);
npc.removeFromVehicle();           npc.getVehicleId();
npc.getVehicleSeat();
npc.useVehicleSiren(bool);         npc.isVehicleSirenUsed();
npc.setVehicleHealth(health);      npc.getVehicleHealth();
npc.setVehicleGearState(state);    npc.getVehicleGearState();

// Surfing
npc.setSurfingOffsets(x, y, z);    npc.getSurfingOffsets();
npc.setSurfingVehicle(vehicle);    npc.setSurfingObject(objId);
npc.setSurfingDynamicObject(obj);  npc.stopSurfing();

// Playback
npc.startPlayingPlayback(file, recordId, ...);
npc.stopPlayingPlayback();         npc.pausePlayingPlayback();
npc.resumePlayingPlayback();
FCNPC.loadPlayingPlayback(file);   FCNPC.unloadPlayingPlayback(recordId);

// Node & Path
npc.playNode(node, ...);           npc.stopPlayingNode();
npc.goByMovePath(path, ...);
npc.setMoveMode(mode);             npc.getMoveMode();

// Misc
npc.setKeys(upDown, leftRight, keys);
npc.getKeys();                     npc.setSpecialAction(action);
npc.showInTabListForPlayer(p);     npc.hideInTabListForPlayer(p);

// Static
FCNPC.setUpdateRate(rate);         FCNPC.getUpdateRate();
FCNPC.setTickRate(rate);           FCNPC.getTickRate();
FCNPC.useMoveMode(mode, use);      FCNPC.isMoveModeUsed(mode);
FCNPC.getPluginVersion();
FCNPC.getInstance(id);             FCNPC.getInstances();
```

## FCNPCEvent

```typescript
FCNPCEvent.onInit(({ next }) => { return next(); });
FCNPCEvent.onCreate(({ npc, next }) => { return next(); });
FCNPCEvent.onDestroy(({ npc, next }) => { return next(); });
FCNPCEvent.onSpawn(({ npc, next }) => { return next(); });
FCNPCEvent.onRespawn(({ npc, next }) => { return next(); });
FCNPCEvent.onDeath(({ npc, killer, reason, next }) => { return next(); });
FCNPCEvent.onTakeDamage(({ npc, from, weapon, bodyPart, healthLoss, armorLoss, next }) => { return next(); });
FCNPCEvent.onGiveDamage(({ npc, to, weapon, bodyPart, healthLoss, armorLoss, next }) => { return next(); });
FCNPCEvent.onReachDestination(({ npc, next }) => { return next(); });
FCNPCEvent.onFinishMovePath(({ npc, path, pointId, next }) => { return next(); });
FCNPCEvent.onStreamIn(({ npc, forPlayer, next }) => { return next(); });
FCNPCEvent.onStreamOut(({ npc, forPlayer, next }) => { return next(); });
FCNPCEvent.onWeaponShot(({ npc, weapon, hitType, hitId, x, y, z, next }) => { return next(); });
FCNPCEvent.onStateChange(({ npc, newState, oldState, next }) => { return next(); });
FCNPCEvent.onVehicleEntryComplete(({ npc, vehicle, seat, next }) => { return next(); });
// 20+ events total — see source for full list
```

## Enums

```typescript
enum MoveType { AUTO = -1, WALK, RUN, SPRINT, DRIVE }
enum MoveSpeed { AUTO = -1.0, WALK = 0.155, RUN = 0.564, SPRINT = 0.926 }
enum MoveMode { AUTO = -1, NONE, MAPANDREAS, COLANDREAS }
enum MovePathFinding { AUTO = -1, NONE, Z, RAYCAST }
enum EntityCheck { NONE, PLAYER, NPC, ACTOR, VEHICLE, OBJECT, ..., ALL = 255 }
enum EntityMode { AUTO = -1, NONE, COLANDREAS }
```

## Constants

```typescript
MAX_NODES = 64;
INVALID_MOVEPATH_ID = -1;
INVALID_RECORD_ID = -1;
```
