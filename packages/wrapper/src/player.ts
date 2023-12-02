import type { IBounds } from "./interfaces/Bounds";
import type { ICheckPoint, IRaceCheckPoint } from "./interfaces/CheckPoint";
import type { IAttachedObject } from "./interfaces/Object";
import type { IOffsets } from "./interfaces/Offsets";
import type { IPlayerClass } from "./interfaces/PlayerClass";
import type { IQuat } from "./interfaces/Quat";

export const TogglePlayerWidescreen = (
  playerId: number,
  set: boolean
): number => {
  return samp.callNative("TogglePlayerWidescreen", "ii", playerId, set);
};

export const IsPlayerWidescreenToggled = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerWidescreenToggled", "i", playerId));
};

export const GetSpawnInfo = (playerId: number): IPlayerClass => {
  const [
    teamId,
    modelId = 0,
    spawn_x = 0.0,
    spawn_y = 0.0,
    spawn_z = 0.0,
    z_angle = 0.0,
    weapon1 = 0,
    weapon1_ammo = 0,
    weapon2 = 0,
    weapon2_ammo = 0,
    weapon3 = 0,
    weapon3_ammo = 0,
  ]: number[] = samp.callNative("GetSpawnInfo", "iIIFFFFIIIIII", playerId);
  return {
    teamId,
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    weapon1,
    weapon1_ammo,
    weapon2,
    weapon2_ammo,
    weapon3,
    weapon3_ammo,
  };
};

export const GetPlayerSkillLevel = (
  playerId: number,
  skill: number
): number => {
  return samp.callNative("GetPlayerSkillLevel", "ii", playerId, skill);
};

export const GetPlayerWeather = (playerId: number): number => {
  return samp.callNative("GetPlayerWeather", "i", playerId);
};

export const IsPlayerCheckpointActive = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerCheckpointActive", "i", playerId));
};

export const GetPlayerCheckpoint = (playerId: number): ICheckPoint => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, fSize = 0.0]: number[] = samp.callNative(
    "GetPlayerCheckpoint",
    "iFFFF",
    playerId
  );
  return { fX, fY, fZ, fSize };
};

export const IsPlayerRaceCheckpointActive = (playerId: number): boolean => {
  return Boolean(
    samp.callNative("IsPlayerRaceCheckpointActive", "i", playerId)
  );
};

export const GetPlayerRaceCheckpoint = (playerId: number): IRaceCheckPoint => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fNextX = 0.0,
    fNextY = 0.0,
    fNextZ = 0.0,
    fSize = 0.0,
  ]: number[] = samp.callNative(
    "GetPlayerRaceCheckpoint",
    "iFFFFFFF",
    playerId
  );
  return { fX, fY, fZ, fNextX, fNextY, fNextZ, fSize };
};

export const GetPlayerWorldBounds = (playerId: number): IBounds => {
  const [x_max = 0.0, x_min = 0.0, y_max = 0.0, y_min = 0.0]: number[] =
    samp.callNative("GetPlayerWorldBounds", "iFFFF", playerId);
  return { x_max, x_min, y_max, y_min };
};

export const IsPlayerInModShop = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInModShop", "i", playerId));
};

export const GetPlayerSirenState = (playerId: number): number => {
  return samp.callNative("GetPlayerSirenState", "i", playerId);
};

export const GetPlayerLandingGearState = (playerId: number): number => {
  return samp.callNative("GetPlayerLandingGearState", "i", playerId);
};

export const GetPlayerHydraReactorAngle = (playerId: number): number => {
  return samp.callNative("GetPlayerHydraReactorAngle", "i", playerId);
};

export const GetPlayerTrainSpeed = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerTrainSpeed", "i", playerId);
};

export const GetPlayerZAim = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerZAim", "i", playerId);
};

export const GetPlayerSurfingOffsets = (playerId: number): IOffsets => {
  const [fOffsetX = 0.0, fOffsetY = 0.0, fOffsetZ = 0.0]: number[] =
    samp.callNative("GetPlayerSurfingOffsets", "iFFF", playerId);
  return { fOffsetX, fOffsetY, fOffsetZ };
};

export const GetPlayerRotationQuat = (playerId: number): IQuat => {
  const [w = 0.0, x = 0.0, y = 0.0, z = 0.0]: number[] = samp.callNative(
    "GetPlayerRotationQuat",
    "iFFFF",
    playerId
  );
  return { w, x, y, z };
};

export const GetPlayerDialogID = (playerId: number): number => {
  return samp.callNative("GetPlayerDialogID", "i", playerId);
};

export const GetPlayerSpectateID = (playerId: number): number => {
  return samp.callNative("GetPlayerSpectateID", "i", playerId);
};

export const GetPlayerSpectateType = (playerId: number): number => {
  return samp.callNative("GetPlayerSpectateType", "i", playerId);
};

export const GetPlayerRawIp = (playerId: number): string => {
  return samp.callNative("GetPlayerRawIp", "i", playerId);
};

export const SetPlayerGravity = (playerId: number, gravity: number): number => {
  return samp.callNative("SetPlayerGravity", "if", playerId, gravity);
};

export const GetPlayerGravity = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerGravity", "i", playerId);
};

export const SetPlayerAdmin = (playerId: number, admin: boolean): number => {
  return samp.callNative("SetPlayerAdmin", "ii", playerId, admin);
};

export const IsPlayerSpawned = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerSpawned", "i", playerId));
};

export const IsPlayerControllable = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerControllable", "i", playerId));
};

export const IsPlayerCameraTargetEnabled = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerCameraTargetEnabled", "i", playerId));
};

export const TogglePlayerGhostMode = (
  playerId: number,
  toggle: boolean
): number => {
  return samp.callNative("TogglePlayerGhostMode", "ii", playerId, toggle);
};

export const GetPlayerGhostMode = (playerId: number): boolean => {
  return Boolean(samp.callNative("GetPlayerGhostMode", "i", playerId));
};

export const GetPlayerBuildingsRemoved = (playerId: number): number => {
  return samp.callNative("GetPlayerBuildingsRemoved", "i", playerId);
};

export const GetPlayerAttachedObject = (
  playerId: number,
  index: number
): IAttachedObject => {
  const [
    modelId = 0,
    bone = 0,
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
    fScaleX = 0.0,
    fScaleY = 0.0,
    fScaleZ = 0.0,
    materialColor1 = 0,
    materialColor2 = 0,
  ]: number[] = samp.callNative(
    "GetPlayerAttachedObject",
    "iiIIFFFFFFFFFII",
    playerId,
    index
  );
  return {
    modelId,
    bone,
    fX,
    fY,
    fZ,
    fRotX,
    fRotY,
    fRotZ,
    fScaleX,
    fScaleY,
    fScaleZ,
    materialColor1,
    materialColor2,
  };
};

export const RemovePlayerWeapon = (
  playerId: number,
  weaponId: number
): number => {
  return samp.callNative("RemovePlayerWeapon", "ii", playerId, weaponId);
};

export const HidePlayerDialog = (playerId: number): number => {
  return samp.callNative("HidePlayerDialog", "i", playerId);
};

export const IsPlayerUsingOfficialClient = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerUsingOfficialClient", "i", playerId));
};

export const AllowPlayerTeleport = (
  playerId: number,
  allow: boolean
): boolean => {
  return Boolean(samp.callNative("AllowPlayerTeleport", "ii", playerId, allow));
};

export const IsPlayerTeleportAllowed = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerTeleportAllowed", "i", playerId));
};

export const AllowPlayerWeapons = (
  playerId: number,
  allow: boolean
): boolean => {
  return Boolean(samp.callNative("AllowPlayerWeapons", "i", playerId, allow));
};

export const ArePlayerWeaponsAllowed = (playerId: number): boolean => {
  return Boolean(samp.callNative("ArePlayerWeaponsAllowed", "i", playerId));
};
