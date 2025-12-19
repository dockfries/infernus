import {
  WeaponEnum,
  WeaponSkillsEnum,
  FightingStylesEnum,
  WeaponStatesEnum,
  BulletHitTypesEnum,
  NPCEntityCheckEnum,
  LandingGearStateEnum,
  SpecialActionsEnum,
} from "core/enums";

export const NPC_Create = (name: string) => {
  return samp.callNative("NPC_Create", "s", name) as number;
};

export const NPC_Destroy = (id: number) => {
  return !!samp.callNative("NPC_Destroy", "i", id);
};

export const NPC_IsValid = (id: number) => {
  return !!samp.callNative("NPC_IsValid", "i", id);
};

export const NPC_Spawn = (id: number) => {
  return !!samp.callNative("NPC_Spawn", "i", id);
};

export const NPC_Respawn = (id: number) => {
  return !!samp.callNative("NPC_Respawn", "i", id);
};

export const NPC_SetPos = (id: number, x: number, y: number, z: number) => {
  return !!samp.callNative("NPC_SetPos", "ifff", id, x, y, z);
};

export const NPC_SetRot = (id: number, rX: number, rY: number, rZ: number) => {
  return !!samp.callNative("NPC_SetRot", "ifff", id, rX, rY, rZ);
};

export const NPC_GetRot = (id: number) => {
  const [rX, rY, rZ, ret]: [number, number, number, number] = samp.callNative(
    "NPC_GetRot",
    "iFFF",
    id,
  );
  return { rX, rY, rZ, ret: !!ret };
};

export const NPC_SetFacingAngle = (id: number, angle: number) => {
  return !!samp.callNative("NPC_SetFacingAngle", "if", id, angle);
};

export const NPC_GetFacingAngle = (id: number) => {
  const [angle, ret]: [number, number] = samp.callNative(
    "NPC_GetFacingAngle",
    "iF",
    id,
  );
  return { angle, ret: !!ret };
};

export const NPC_SetVirtualWorld = (id: number, virtualWorld: number) => {
  return !!samp.callNative("NPC_SetVirtualWorld", "ii", id, virtualWorld);
};

export const NPC_GetVirtualWorld = (id: number) => {
  return samp.callNative("NPC_GetVirtualWorld", "i", id) as number;
};

export const NPC_Move = (
  id: number,
  targetPosX: number,
  targetPosY: number,
  targetPosZ: number,
  moveType: number,
  moveSpeed: number,
) => {
  return !!samp.callNative(
    "NPC_Move",
    "ifffif",
    id,
    targetPosX,
    targetPosY,
    targetPosZ,
    moveType,
    moveSpeed,
  );
};

export const NPC_MoveToPlayer = (
  id: number,
  playerId: number,
  moveType: number,
  moveSpeed: number,
) => {
  return !!samp.callNative(
    "NPC_MoveToPlayer",
    "iiif",
    id,
    playerId,
    moveType,
    moveSpeed,
  );
};

export const NPC_StopMove = (id: number) => {
  return !!samp.callNative("NPC_StopMove", "i", id);
};

export const NPC_IsMoving = (id: number) => {
  return !!samp.callNative("NPC_IsMoving", "i", id);
};

export const NPC_IsMovingToPlayer = (id: number, playerId: number) => {
  return !!samp.callNative("NPC_IsMovingToPlayer", "ii", id, playerId);
};

export const NPC_SetSkin = (id: number, model: number) => {
  return !!samp.callNative("NPC_SetSkin", "ii", id, model);
};

export const NPC_GetSkin = (id: number) => {
  return samp.callNative("NPC_GetSkin", "i", id) as number;
};

export const NPC_IsStreamedIn = (id: number, playerId: number) => {
  return !!samp.callNative("NPC_IsStreamedIn", "ii", id, playerId);
};

export const NPC_IsAnyStreamedIn = (id: number) => {
  return !!samp.callNative("NPC_IsAnyStreamedIn", "i", id);
};

export const NPC_SetInterior = (id: number, interior: number) => {
  return !!samp.callNative("NPC_SetInterior", "ii", id, interior);
};

export const NPC_GetInterior = (id: number) => {
  return samp.callNative("NPC_GetInterior", "i", id) as number;
};

export const NPC_SetHealth = (id: number, health: number) => {
  return !!samp.callNative("NPC_SetHealth", "if", id, health);
};

export const NPC_GetHealth = (id: number) => {
  return samp.callNativeFloat("NPC_GetHealth", "i", id) as number;
};

export const NPC_SetArmour = (id: number, armour: number) => {
  return !!samp.callNative("NPC_SetArmour", "if", id, armour);
};

export const NPC_GetArmour = (id: number) => {
  return samp.callNativeFloat("NPC_GetArmour", "i", id) as number;
};

export const NPC_IsDead = (id: number) => {
  return !!samp.callNative("NPC_IsDead", "i", id);
};

export const NPC_ApplyAnimation = (
  id: number,
  animLib: string,
  animName: string,
  delta: number,
  loop: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time: number,
  sync: number,
) => {
  return !!samp.callNative(
    "NPC_ApplyAnimation",
    "issfiiiiii",
    id,
    animLib,
    animName,
    delta,
    loop,
    lockX,
    lockY,
    freeze,
    time,
    sync,
  );
};

export const NPC_SetWeapon = (id: number, weapon: WeaponEnum) => {
  return !!samp.callNative("NPC_SetWeapon", "ii", id, weapon);
};

export const NPC_GetWeapon = (id: number) => {
  return samp.callNative("NPC_GetWeapon", "i", id) as WeaponEnum;
};

export const NPC_SetAmmo = (id: number, ammo: number) => {
  return !!samp.callNative("NPC_SetAmmo", "ii", id, ammo);
};

export const NPC_GetAmmo = (id: number) => {
  return samp.callNative("NPC_GetAmmo", "i", id) as number;
};

export const NPC_SetKeys = (
  id: number,
  upAndDown: number,
  leftAndDown: number,
  keys: number,
) => {
  return !!samp.callNative(
    "NPC_SetKeys",
    "iiii",
    id,
    upAndDown,
    leftAndDown,
    keys,
  );
};

export const NPC_GetKeys = (id: number) => {
  const [upAndDown, leftAndDown, keys, ret]: [number, number, number, number] =
    samp.callNative("NPC_GetKeys", "iIII", id);
  return { upAndDown, leftAndDown, keys, ret: !!ret };
};

export const NPC_SetWeaponSkillLevel = (
  id: number,
  skill: WeaponSkillsEnum,
  level: number,
) => {
  return !!samp.callNative("NPC_SetWeaponSkillLevel", "iii", id, skill, level);
};

export const NPC_GetWeaponSkillLevel = (
  id: number,
  skill: WeaponSkillsEnum,
) => {
  return samp.callNative("NPC_GetWeaponSkillLevel", "ii", id, skill) as number;
};

export const NPC_MeleeAttack = (
  id: number,
  time: number = -1,
  secondaryAttack: boolean = false,
) => {
  return !!samp.callNative("NPC_MeleeAttack", "iii", id, time, secondaryAttack);
};

export const NPC_StopMeleeAttack = (id: number) => {
  return !!samp.callNative("NPC_StopMeleeAttack", "i", id);
};

export const NPC_IsMeleeAttacking = (id: number) => {
  return !!samp.callNative("NPC_IsMeleeAttacking", "i", id);
};

export const NPC_SetFightingStyle = (id: number, style: FightingStylesEnum) => {
  return !!samp.callNative("NPC_SetFightingStyle", "ii", id, style);
};

export const NPC_GetFightingStyle = (id: number) => {
  return samp.callNative("NPC_GetFightingStyle", "i", id) as FightingStylesEnum;
};

export const NPC_EnableReloading = (id: number, enable: boolean = true) => {
  return !!samp.callNative("NPC_EnableReloading", "ii", id, enable);
};

export const NPC_IsReloadEnabled = (id: number) => {
  return !!samp.callNative("NPC_IsReloadEnabled", "i", id);
};

export const NPC_IsReloading = (id: number) => {
  return !!samp.callNative("NPC_IsReloading", "i", id);
};

export const NPC_EnableInfiniteAmmo = (id: number, enable: boolean = true) => {
  return !!samp.callNative("NPC_EnableInfiniteAmmo", "ii", id, enable);
};

export const NPC_IsInfiniteAmmoEnabled = (id: number) => {
  return !!samp.callNative("NPC_IsInfiniteAmmoEnabled", "i", id);
};

export const NPC_SetWeaponState = (
  id: number,
  weaponState: WeaponStatesEnum,
) => {
  return !!samp.callNative("NPC_SetWeaponState", "ii", id, weaponState);
};

export const NPC_GetWeaponState = (id: number) => {
  return samp.callNative("NPC_GetWeaponState", "i", id) as WeaponStatesEnum;
};

export const NPC_SetAmmoInClip = (id: number, ammo: number) => {
  return !!samp.callNative("NPC_SetAmmoInClip", "ii", id, ammo);
};

export const NPC_GetAmmoInClip = (id: number) => {
  return samp.callNative("NPC_GetAmmoInClip", "i", id) as number;
};

export const NPC_Shoot = (
  id: number,
  weapon: WeaponStatesEnum,
  hitId: number,
  hitType: BulletHitTypesEnum,
  endPointX: number,
  endPointY: number,
  endPointZ: number,
  offsetX: number = 0.0,
  offsetY: number = 0.0,
  offsetZ: number = 0.0,
  isHit: boolean = true,
  checkInBetweenFlags: NPCEntityCheckEnum = NPCEntityCheckEnum.ALL,
) => {
  return !!samp.callNative(
    "NPC_Shoot",
    "iiiffffffii",
    id,
    weapon,
    hitId,
    hitType,
    endPointX,
    endPointY,
    endPointZ,
    offsetX,
    offsetY,
    offsetZ,
    isHit,
    checkInBetweenFlags,
  );
};

export const NPC_IsShooting = (id: number) => {
  return !!samp.callNative("NPC_IsShooting", "i", id);
};

export const NPC_AimAt = (
  id: number,
  pointX: number,
  pointY: number,
  pointZ: number,
  shoot: boolean = false,
  shootDelay: number = -1,
  updateAngle: boolean = true,
  offsetFromX: number = 0.0,
  offsetFromY: number = 0.0,
  offsetFromZ: number = 0.0,
  checkInBetweenFlags: NPCEntityCheckEnum = NPCEntityCheckEnum.ALL,
) => {
  return !!samp.callNative(
    "NPC_AimAt",
    "ifffiiifffi",
    id,
    pointX,
    pointY,
    pointZ,
    shoot,
    shootDelay,
    updateAngle,
    offsetFromX,
    offsetFromY,
    offsetFromZ,
    checkInBetweenFlags,
  );
};

export const NPC_AimAtPlayer = (
  id: number,
  playerId: number,
  shoot: boolean = false,
  shootDelay: number = -1,
  updateAngle: boolean = true,
  offsetX: number = 0.0,
  offsetY: number = 0.0,
  offsetZ: number = 0.0,
  offsetFromX: number = 0.0,
  offsetFromY: number = 0.0,
  offsetFromZ: number = 0.0,
  checkInBetweenFlags: NPCEntityCheckEnum = NPCEntityCheckEnum.ALL,
) => {
  return !!samp.callNative(
    "NPC_AimAtPlayer",
    "iiiiiffffffi",
    id,
    playerId,
    shoot,
    shootDelay,
    updateAngle,
    offsetX,
    offsetY,
    offsetZ,
    offsetFromX,
    offsetFromY,
    offsetFromZ,
    checkInBetweenFlags,
  );
};

export const NPC_StopAim = (id: number) => {
  return !!samp.callNative("NPC_StopAim", "i", id);
};

export const NPC_IsAiming = (id: number) => {
  return !!samp.callNative("NPC_IsAiming", "i", id);
};

export const NPC_IsAimingAtPlayer = (id: number, playerId: number) => {
  return !!samp.callNative("NPC_IsAimingAtPlayer", "ii", id, playerId);
};

export const NPC_SetWeaponAccuracy = (
  id: number,
  weapon: WeaponEnum,
  accuracy: number,
) => {
  return !!samp.callNative(
    "NPC_SetWeaponAccuracy",
    "iif",
    id,
    weapon,
    accuracy,
  );
};

export const NPC_GetWeaponAccuracy = (id: number, weapon: number) => {
  return samp.callNativeFloat(
    "NPC_GetWeaponAccuracy",
    "ii",
    id,
    weapon,
  ) as number;
};

export const NPC_SetWeaponReloadTime = (
  id: number,
  weapon: number,
  time: number,
) => {
  return !!samp.callNative("NPC_SetWeaponReloadTime", "iii", id, weapon, time);
};

export const NPC_GetWeaponReloadTime = (id: number, weapon: number) => {
  return samp.callNative("NPC_GetWeaponReloadTime", "ii", id, weapon) as number;
};

export const NPC_GetWeaponActualReloadTime = (id: number, weapon: number) => {
  return samp.callNative(
    "NPC_GetWeaponActualReloadTime",
    "ii",
    id,
    weapon,
  ) as number;
};

export const NPC_SetWeaponShootTime = (
  id: number,
  weapon: number,
  time: number,
) => {
  return !!samp.callNative("NPC_SetWeaponShootTime", "iii", id, weapon, time);
};

export const NPC_GetWeaponShootTime = (id: number, weapon: number) => {
  return samp.callNative("NPC_GetWeaponShootTime", "ii", id, weapon) as number;
};

export const NPC_SetWeaponClipSize = (
  id: number,
  weapon: number,
  size: number,
) => {
  return !!samp.callNative("NPC_SetWeaponClipSize", "iii", id, weapon, size);
};

export const NPC_GetWeaponClipSize = (id: number, weapon: number) => {
  return samp.callNative("NPC_GetWeaponClipSize", "ii", id, weapon) as number;
};

export const NPC_GetWeaponActualClipSize = (id: number, weapon: number) => {
  return samp.callNative(
    "NPC_GetWeaponActualClipSize",
    "ii",
    id,
    weapon,
  ) as number;
};

export const NPC_EnterVehicle = (
  id: number,
  vehicleId: number,
  seatId: number,
  moveType: number,
) => {
  return !!samp.callNative(
    "NPC_EnterVehicle",
    "iiii",
    id,
    vehicleId,
    seatId,
    moveType,
  );
};

export const NPC_ExitVehicle = (id: number) => {
  return !!samp.callNative("NPC_ExitVehicle", "i", id);
};

export const NPC_PutInVehicle = (
  id: number,
  vehicleId: number,
  seat: number,
) => {
  return !!samp.callNative("NPC_PutInVehicle", "iii", id, vehicleId, seat);
};

export const NPC_RemoveFromVehicle = (id: number) => {
  return !!samp.callNative("NPC_RemoveFromVehicle", "i", id);
};

export const NPC_GetVehicle = (id: number) => {
  return samp.callNative("NPC_GetVehicle", "i", id) as number;
};

export const NPC_GetVehicleSeat = (id: number) => {
  return samp.callNative("NPC_GetVehicleSeat", "i", id) as number;
};

export const NPC_GetEnteringVehicle = (id: number) => {
  return samp.callNative("NPC_GetEnteringVehicle", "i", id) as number;
};

export const NPC_GetEnteringVehicleSeat = (id: number) => {
  return samp.callNative("NPC_GetEnteringVehicleSeat", "i", id) as number;
};

export const NPC_IsEnteringVehicle = (id: number) => {
  return !!samp.callNative("NPC_IsEnteringVehicle", "i", id);
};

export const NPC_UseVehicleSiren = (id: number, use: boolean) => {
  return !!samp.callNative("NPC_UseVehicleSiren", "ii", id, use);
};

export const NPC_IsVehicleSirenUsed = (id: number) => {
  return !!samp.callNative("NPC_IsVehicleSirenUsed", "i", id);
};

export const NPC_SetVehicleHealth = (id: number, health: number) => {
  return !!samp.callNative("NPC_SetVehicleHealth", "if", id, health);
};

export const NPC_GetVehicleHealth = (id: number) => {
  return samp.callNativeFloat("NPC_GetVehicleHealth", "i", id) as number;
};

export const NPC_SetVehicleHydraThrusters = (id: number, direction: number) => {
  return !!samp.callNative("NPC_SetVehicleHydraThrusters", "ii", id, direction);
};

export const NPC_GetVehicleHydraThrusters = (id: number) => {
  return samp.callNative("NPC_GetVehicleHydraThrusters", "i", id) as number;
};

export const NPC_SetVehicleGearState = (
  id: number,
  gearState: LandingGearStateEnum,
) => {
  return !!samp.callNative("NPC_SetVehicleGearState", "ii", id, gearState);
};

export const NPC_GetVehicleGearState = (id: number): LandingGearStateEnum => {
  return samp.callNative(
    "NPC_GetVehicleGearState",
    "i",
    id,
  ) as LandingGearStateEnum;
};

export const NPC_SetVehicleTrainSpeed = (id: number, speed: number) => {
  return !!samp.callNative("NPC_SetVehicleTrainSpeed", "if", id, speed);
};

export const NPC_GetVehicleTrainSpeed = (id: number) => {
  return samp.callNativeFloat("NPC_GetVehicleTrainSpeed", "i", id) as number;
};

export const NPC_ResetAnimation = (id: number): boolean => {
  return !!samp.callNative("NPC_ResetAnimation", "i", id);
};

export const NPC_SetAnimation = (
  id: number,
  animationId: number,
  delta: number,
  loop: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time: number,
): boolean => {
  return !!samp.callNative(
    "NPC_SetAnimation",
    "iifiiiii",
    id,
    animationId,
    delta,
    loop,
    lockX,
    lockY,
    freeze,
    time,
  );
};

export const NPC_GetAnimation = (id: number) => {
  const [animationId, delta, loop, lockX, lockY, freeze, time, ret]: number[] =
    samp.callNative("NPC_GetAnimation", "iIFIIIII", id);
  return {
    animationId,
    delta,
    loop: !!loop,
    lockX: !!lockX,
    lockY: !!lockY,
    freeze: !!freeze,
    time,
    ret: !!ret,
  };
};

export const NPC_ClearAnimations = (id: number): boolean => {
  return !!samp.callNative("NPC_ClearAnimations", "i", id);
};

export const NPC_SetSpecialAction = (
  id: number,
  action: SpecialActionsEnum,
): boolean => {
  return !!samp.callNative("NPC_SetSpecialAction", "ii", id, action);
};

export const NPC_GetSpecialAction = (id: number): SpecialActionsEnum => {
  return samp.callNative("NPC_GetSpecialAction", "i", id);
};

export const NPC_StartPlayback = (
  id: number,
  recordName: string,
  autoUnload: boolean = false,
  startX: number = 0.0,
  startY: number = 0.0,
  startZ: number = 0.0,
  rotX: number = 0.0,
  rotY: number = 0.0,
  rotZ: number = 0.0,
) => {
  return !!samp.callNative(
    "NPC_StartPlayback",
    "isiffffff",
    id,
    recordName,
    autoUnload,
    startX,
    startY,
    startZ,
    rotX,
    rotY,
    rotZ,
  );
};

export const NPC_StartPlaybackEx = (
  id: number,
  recordId: number,
  autoUnload: boolean = false,
  startX: number = 0.0,
  startY: number = 0.0,
  startZ: number = 0.0,
  rotX: number = 0.0,
  rotY: number = 0.0,
  rotZ: number = 0.0,
) => {
  return !!samp.callNative(
    "NPC_StartPlaybackEx",
    "iiiffffff",
    id,
    recordId,
    autoUnload,
    startX,
    startY,
    startZ,
    rotX,
    rotY,
    rotZ,
  );
};

export const NPC_StopPlayback = (id: number) => {
  return !!samp.callNative("NPC_StopPlayback", "i", id);
};

export const NPC_PausePlayback = (id: number, paused: boolean = true) => {
  return !!samp.callNative("NPC_PausePlayback", "ii", id, paused);
};

export const NPC_IsPlayingPlayback = (id: number) => {
  return !!samp.callNative("NPC_IsPlayingPlayback", "i", id);
};

export const NPC_IsPlaybackPaused = (id: number) => {
  return !!samp.callNative("NPC_IsPlaybackPaused", "i", id);
};

export const NPC_PlayNode = (
  id: number,
  nodeId: number,
  moveType: number,
  speed: number,
  radius: number,
  setAngle: boolean,
) => {
  return !!samp.callNative(
    "NPC_PlayNode",
    "iiiffi",
    id,
    nodeId,
    moveType,
    speed,
    radius,
    setAngle,
  );
};

export const NPC_StopPlayingNode = (id: number) => {
  return !!samp.callNative("NPC_StopPlayingNode", "i", id);
};

export const NPC_PausePlayingNode = (id: number) => {
  return !!samp.callNative("NPC_PausePlayingNode", "i", id);
};

export const NPC_ResumePlayingNode = (id: number) => {
  return !!samp.callNative("NPC_ResumePlayingNode", "i", id);
};

export const NPC_IsPlayingNodePaused = (id: number) => {
  return !!samp.callNative("NPC_IsPlayingNodePaused", "i", id);
};

export const NPC_IsPlayingNode = (id: number) => {
  return !!samp.callNative("NPC_IsPlayingNode", "i", id);
};

export const NPC_ChangeNode = (id: number, nodeId: number, link: number) => {
  return !!samp.callNative("NPC_ChangeNode", "iii", id, nodeId, link);
};

export const NPC_UpdateNodePoint = (id: number, pointId: number) => {
  return !!samp.callNative("NPC_UpdateNodePoint", "ii", id, pointId);
};

export const NPC_SetInvulnerable = (id: number, toggle: boolean = true) => {
  return !!samp.callNative("NPC_SetInvulnerable", "ii", id, toggle) as boolean;
};

export const NPC_IsInvulnerable = (id: number) => {
  return !!samp.callNative("NPC_IsInvulnerable", "i", id);
};

export const NPC_SetSurfingOffsets = (
  id: number,
  x: number,
  y: number,
  z: number,
) => {
  return !!samp.callNative("NPC_SetSurfingOffsets", "ifff", id, x, y, z);
};

export const NPC_GetSurfingOffsets = (id: number) => {
  const [x, y, z, ret]: number[] = samp.callNative(
    "NPC_GetSurfingOffsets",
    "iFFF",
    id,
  );
  return { x, y, z, ret: !!ret };
};

export const NPC_SetSurfingVehicle = (id: number, vehicleId: number) => {
  return !!samp.callNative("NPC_SetSurfingVehicle", "ii", id, vehicleId);
};

export const NPC_GetSurfingVehicle = (id: number) => {
  return samp.callNative("NPC_GetSurfingVehicle", "i", id) as number;
};

export const NPC_SetSurfingObject = (id: number, objectId: number) => {
  return !!samp.callNative("NPC_SetSurfingObject", "ii", id, objectId);
};

export const NPC_GetSurfingObject = (id: number) => {
  return samp.callNative("NPC_GetSurfingObject", "i", id) as number;
};

export const NPC_SetSurfingPlayerObject = (id: number, objectId: number) => {
  return !!samp.callNative("NPC_SetSurfingPlayerObject", "ii", id, objectId);
};

export const NPC_GetSurfingPlayerObject = (id: number) => {
  return samp.callNative("NPC_GetSurfingPlayerObject", "i", id) as number;
};

export const NPC_ResetSurfingData = (id: number) => {
  return !!samp.callNative("NPC_ResetSurfingData", "i", id);
};

export const NPC_IsSpawned = (id: number) => {
  return !!samp.callNative("NPC_IsSpawned", "i", id);
};

export const NPC_Kill = (id: number, killerId: number, reason: number) => {
  return !!samp.callNative("NPC_Kill", "iii", id, killerId, reason);
};

export const NPC_SetVelocity = (
  id: number,
  x: number,
  y: number,
  z: number,
) => {
  return !!samp.callNative("NPC_SetVelocity", "ifff", id, x, y, z);
};

export const NPC_GetVelocity = (id: number) => {
  const [x, y, z, ret]: number[] = samp.callNative(
    "NPC_GetVelocity",
    "iFFF",
    id,
  );
  return { x, y, z, ret };
};

export const NPC_GetPlayerAimingAt = (id: number) => {
  return samp.callNative("NPC_GetPlayerAimingAt", "i", id) as number;
};

export const NPC_GetPlayerMovingTo = (id: number) => {
  return samp.callNative("NPC_GetPlayerMovingTo", "i", id) as number;
};

export const NPC_GetPosMovingTo = (id: number) => {
  const [x, y, z, ret]: number[] = samp.callNative(
    "NPC_GetPosMovingTo",
    "iFFF",
    id,
  );
  return { x, y, z, ret: !!ret };
};

export const NPC_GetCustomSkin = (id: number) => {
  return samp.callNative("NPC_GetCustomSkin", "i", id) as number;
};

export const NPC_SetAngleToPos = (
  id: number,
  x: number,
  y: number,
  z: number,
) => {
  return !!samp.callNative("NPC_SetAngleToPos", "ifff", id, x, y, z);
};

export const NPC_SetAngleToPlayer = (id: number, playerId: number) => {
  return !!samp.callNative("NPC_SetAngleToPlayer", "ii", id, playerId);
};
