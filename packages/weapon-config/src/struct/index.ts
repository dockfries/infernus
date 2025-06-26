import { DynamicObject, InvalidEnum, TextDraw } from "@infernus/core";
import { IOnFootSync } from "@infernus/raknet";
import { WC_WeaponEnum } from "../enums";
import { SafetyMap } from "../utils/safetyMap";

export class DamageFeedHit {
  issuer: number = InvalidEnum.PLAYER_ID;
  name: string = "";
  amount: number = 0;
  weapon: number = WC_WeaponEnum.UNKNOWN; // wc_WeaponEnum
  tick: number = 0;
}

export class RejectedHit {
  time: number = 0;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  weapon: WC_WeaponEnum = WC_WeaponEnum.UNKNOWN;
  reason: number = 0;
  info1: number = 0;
  info2: number = 0;
  info3: number = 0;
  name: string = "";
}

export class ResyncData {
  health: number = 0;
  armour: number = 0;
  skin: number = 0;
  team: number = 0;
  posX: number = 0;
  posY: number = 0;
  posZ: number = 0;
  posA: number = 0;
  weapon: number = WC_WeaponEnum.UNKNOWN; // wc_WeaponEnum
  weaponId: number[] = []; // wc_WeaponEnum 13
  weaponAmmo: number[] = []; // 13
}

export class ShotInfo {
  tick: number = 0;
  weapon: WC_WeaponEnum = WC_WeaponEnum.UNKNOWN;
  hitType: number = 0;
  hitId: number = 0;
  hits: number = 0;
  x: number = 0;
  y: number = 0;
  z: number = 0;
  oX: number = 0;
  oY: number = 0;
  oZ: number = 0;
  hX: number = 0;
  hY: number = 0;
  hZ: number = 0;
  length: number = 0;
  valid: boolean = false;
}

export class HitInfo {
  tick: number = 0;
  issuer: number = 0;
  weapon: number = WC_WeaponEnum.UNKNOWN;
  amount: number = 0;
  health: number = 0;
  armour: number = 0;
  bodyPart: number = 0;
}

export class SpawnInfo {
  skin: number = 0;
  team: number = 0;
  posX: number = 0;
  posY: number = 0;
  posZ: number = 0;
  rot: number = 0;
  weapon1: number = WC_WeaponEnum.UNKNOWN;
  ammo1: number = 0;
  weapon2: number = WC_WeaponEnum.UNKNOWN;
  ammo2: number = 0;
  weapon3: number = WC_WeaponEnum.UNKNOWN;
  ammo3: number = 0;
}

export const playerMaxHealth = new SafetyMap<number, number>(() => 100.0);
export const playerHealth = new SafetyMap<number, number>(() => 100.0);
export const playerMaxArmour = new SafetyMap<number, number>(() => 100.0);
export const playerArmour = new SafetyMap<number, number>(() => 0.0);
export const lastSentHealth = new SafetyMap<number, number>(() => 0.0);
export const lastSentArmour = new SafetyMap<number, number>(() => 0.0);

export const lastExplosive = new SafetyMap<number, number>(
  () => WC_WeaponEnum.UNKNOWN,
);
export const playerTeam = new SafetyMap<number, number>(
  () => InvalidEnum.NO_TEAM,
);
export const spectating = new SafetyMap<number, number>(
  () => InvalidEnum.PLAYER_ID,
);
export const lastUpdateTick = new SafetyMap<number, number>(() => -1);
export const lastVehicleEnterTime = new SafetyMap<number, number>(() => 0);
export const lastVehicleTick = new SafetyMap<number, number>(() => 0);

export const enableHealthBar = new SafetyMap<number, boolean>(() => false);
export const healthBarVisible = new SafetyMap<number, boolean>(() => false);
export const healthBarForeground = new SafetyMap<number, TextDraw | null>(
  () => null,
);

export const damageFeedPlayer = new SafetyMap<number, number>(() => -1);
export const damageFeedTaken = new SafetyMap<number, TextDraw | null>(
  () => null,
);
export const damageFeedGiven = new SafetyMap<number, TextDraw | null>(
  () => null,
);
export const damageFeedHitsGiven = new SafetyMap<
  number,
  (DamageFeedHit | null)[]
>(() => []); // wc_FEED_HEIGHT
export const damageFeedHitsTaken = new SafetyMap<
  number,
  (DamageFeedHit | null)[]
>(() => []); // wc_FEED_HEIGHT
export const damageFeedUpdateTick = new SafetyMap<number, number>(() => 0);
export const damageFeedTimer = new SafetyMap<number, NodeJS.Timeout | null>(
  () => null,
);

export const internalTextDraw = new SafetyMap<number, boolean>(() => false);
export const internalPlayerTextDraw = new SafetyMap<number, boolean[]>(
  () => [],
); // [PlayerText:MAX_PLAYER_TEXT_DRAWS]

export const lastAnim = new SafetyMap<number, number>(() => -1);
export const lastZVelo = new SafetyMap<number, number>(() => 0.0);
export const lastZ = new SafetyMap<number, number>(() => 0.0);
export const lastStopTick = new SafetyMap<number, number>(() => 0);

export const cBugAllowed = new SafetyMap<number, boolean>(() => true);
export const cBugFroze = new SafetyMap<number, number>(() => 0);

export const shotsFired = new SafetyMap<number, number>(() => 0);
export const hitsIssued = new SafetyMap<number, number>(() => 0);
export const lastShot = new SafetyMap<number, ShotInfo>(() => new ShotInfo());
export const lastShotTicks = new SafetyMap<number, number[]>(() =>
  Array.from({ length: 10 }).map(() => 0),
);
export const lastShotWeapons = new SafetyMap<number, number[]>(() =>
  Array.from({ length: 10 }).map(() => 0),
);
export const lastShotIdx = new SafetyMap<number, number>(() => 0);
export const lastHitTicks = new SafetyMap<number, number[]>(() =>
  Array.from({ length: 10 }).map(() => 0),
);
export const lastHitWeapons = new SafetyMap<number, number[]>(() =>
  Array.from({ length: 10 }).map(() => 0),
);
export const lastHitIdx = new SafetyMap<number, number>(() => 0);

export const rejectedHits = new SafetyMap<number, (RejectedHit | null)[]>(
  () => [],
); // wc_MAX_REJECTED_HITS
export const rejectedHitIdx = new SafetyMap<number, number>(() => 0);

export const previousHits = new SafetyMap<number, HitInfo[]>(() =>
  Array.from({ length: 10 }).map(() => new HitInfo()),
);
export const previousHitIdx = new SafetyMap<number, number>(() => 0);

export const damageDoneHealth = new SafetyMap<number, number>(() => 0);
export const damageDoneArmour = new SafetyMap<number, number>(() => 0);

export const alreadyConnected = new SafetyMap<number, boolean>(() => false);
export const firstSpawn = new SafetyMap<number, boolean>(() => true);
export const vendingMachineObject: DynamicObject[] = []; // sc_VendingMachines
export const vendingUseTimer = new SafetyMap<number, NodeJS.Timeout | null>(
  () => null,
);

export const damageRangeSteps: number[] = []; // 55
export const damageRangeRanges = new SafetyMap<number, number[]>(() => []); // 55 wc_MAX_DAMAGE_RANGES
export const damageRangeValues = new SafetyMap<number, number[]>(() => []); // 55 wc_MAX_DAMAGE_RANGES

export const isDying = new SafetyMap<number, boolean>(() => false);
export const trueDeath = new SafetyMap<number, boolean>(() => false);
export const world = new SafetyMap<number, number>(() => 0);
export const lastDeathTick = new SafetyMap<number, number>(() => 0);
export const delayedDeathTimer = new SafetyMap<number, NodeJS.Timeout | null>(
  () => null,
);
export const deathTimer = new SafetyMap<number, NodeJS.Timeout | null>(
  () => null,
);

export const inClassSelection = new SafetyMap<number, boolean>(() => false);
export const forceClassSelection = new SafetyMap<number, boolean>(() => false);
export const classSpawnInfo = new SafetyMap<number, SpawnInfo>(
  () => new SpawnInfo(),
);
export const playerSpawnInfo = new SafetyMap<number, SpawnInfo>(
  () => new SpawnInfo(),
);
export const playerFallbackSpawnInfo = new SafetyMap<number, SpawnInfo>(
  () => new SpawnInfo(),
);
export const playerClass = new SafetyMap<number, number>(() => -2);
export const spawnInfoModified = new SafetyMap<number, boolean>(() => false);
export const deathSkip = new SafetyMap<number, number>(() => 0);
export const deathSkipTick = new SafetyMap<number, number>(() => 0);

export const beingResynced = new SafetyMap<number, boolean>(() => false);
export const spawnForStreamedIn = new SafetyMap<number, boolean>(() => false);
export const knifeTimeout = new SafetyMap<number, NodeJS.Timeout | null>(
  () => null,
);
export const syncData = new SafetyMap<number, ResyncData>(
  () => new ResyncData(),
);

export const vehicleAlive = new SafetyMap<number, boolean>(() => false);
export const lastVehicleShooter = new SafetyMap<number, number>(
  () => InvalidEnum.PLAYER_ID,
);
export const vehicleRespawnTimer = new SafetyMap<number, NodeJS.Timeout | null>(
  () => null,
);

export const fakeHealth = new SafetyMap<number, number>(() => 0);
export const fakeArmour = new SafetyMap<number, number>(() => 0);
// export const fakeQuat = new SafetyMap<number, [number, number, number, number]>(
//   () => [0, 0, 0, 0],
// );
export const syncDataFrozen = new SafetyMap<number, boolean>(() => false);

export const lastSyncData = new SafetyMap<number, IOnFootSync>(() => {
  return {
    lrKey: 0,
    udKey: 0,
    keys: 0,
    position: [0, 0, 0],
    quaternion: [0, 0, 0, 0],
    health: 0,
    armour: 0,
    additionalKey: 0,
    weaponId: 0,
    specialAction: 0,
    velocity: [0, 0, 0],
    surfingOffsets: [0, 0, 0],
    surfingVehicleId: 0,
    animationId: 0,
    animationFlags: 0,
  };
});
export const tempSyncData = new SafetyMap<number, IOnFootSync>(() => {
  return {
    lrKey: 0,
    udKey: 0,
    keys: 0,
    position: [0, 0, 0],
    quaternion: [0, 0, 0, 0],
    health: 0,
    armour: 0,
    additionalKey: 0,
    weaponId: 0,
    specialAction: 0,
    velocity: [0, 0, 0],
    surfingOffsets: [0, 0, 0],
    surfingVehicleId: 0,
    animationId: 0,
    animationFlags: 0,
  };
});
export const tempDataWritten = new SafetyMap<number, boolean>(() => false);

export const gogglesUsed = new SafetyMap<number, number>(() => 0);
export const gogglesTick = new SafetyMap<number, number>(() => 0);

export const restorePlayerTeleport = new SafetyMap<number, boolean>(
  () => false,
);
export const blockAdminTeleport = new SafetyMap<number, boolean>(() => false);
