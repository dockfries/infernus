import type { WeaponEnum } from "core/enums";
import type { IPlayerClass } from "./interfaces/PlayerClass";

export const GetAvailableClasses = (): number => {
  return samp.callNative("GetAvailableClasses", "");
};

// when getting a class through AddPlayerClass(without ex), teamId may be 255.
// bug: zAngle The value of does not look accurate? not sure of the cause of the problem
export const GetPlayerClass = (classId: number): boolean | IPlayerClass => {
  if (classId < GetAvailableClasses() || classId > 319) return false;
  const res: number[] = samp.callNative(
    "GetPlayerClass",
    "iIIFFFFIIIIII",
    classId,
  );
  const [
    teamId,
    modelId = 0,
    spawnX = 0.0,
    spawnY = 0.0,
    spawnZ = 0.0,
    zAngle = 0.0,
    weapon1 = 0,
    weapon1Ammo = 0,
    weapon2 = 0,
    weapon2Ammo = 0,
    weapon3 = 0,
    weapon3Ammo = 0,
  ] = res;
  return {
    teamId,
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  };
};

// bug: zAngle is not assigned a value, not sure of the cause of the problem
export const EditPlayerClass = (
  classId: number,
  teamId: number,
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  weapon1: number,
  weapon1Ammo: number,
  weapon2: number,
  weapon2Ammo: number,
  weapon3: number,
  weapon3Ammo: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "EditPlayerClass",
      "iiiffffiiiiii",
      classId,
      teamId,
      modelId,
      spawnX,
      spawnY,
      spawnZ,
      zAngle,
      weapon1,
      weapon1Ammo,
      weapon2,
      weapon2Ammo,
      weapon3,
      weapon3Ammo,
    ),
  );
};

export const SetTeamCount = (count: number): number => {
  return samp.callNative("SetTeamCount", "i", count);
};

export const AddPlayerClass = (
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  weapon1: number,
  weapon1Ammo: number,
  weapon2: number,
  weapon2Ammo: number,
  weapon3: number,
  weapon3Ammo: number,
): number => {
  return samp.callNative(
    "AddPlayerClass",
    "iffffiiiiii",
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );
};

export const AddPlayerClassEx = (
  teamId: number,
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  weapon1: number,
  weapon1Ammo: number,
  weapon2: number,
  weapon2Ammo: number,
  weapon3: number,
  weapon3Ammo: number,
): number => {
  return samp.callNative(
    "AddPlayerClassEx",
    "iiffffiiiiii",
    teamId,
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );
};

export const SetSpawnInfo = (
  playerId: number,
  team: number,
  skin: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  weapon1: WeaponEnum,
  weapon1Ammo: number,
  weapon2: WeaponEnum,
  weapon2Ammo: number,
  weapon3: WeaponEnum,
  weapon3Ammo: number,
): number => {
  return samp.callNative(
    "SetSpawnInfo",
    "iiiffffiiiiii",
    playerId,
    team,
    skin,
    x,
    y,
    z,
    rotation,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );
};

export const SpawnPlayer = (playerId: number): number => {
  return samp.callNative("SpawnPlayer", "i", playerId);
};

export const GetSpawnInfo = (playerId: number): IPlayerClass => {
  const [
    teamId,
    modelId = 0,
    spawnX = 0.0,
    spawnY = 0.0,
    spawnZ = 0.0,
    zAngle = 0.0,
    weapon1 = 0,
    weapon1Ammo = 0,
    weapon2 = 0,
    weapon2Ammo = 0,
    weapon3 = 0,
    weapon3Ammo = 0,
  ]: number[] = samp.callNative("GetSpawnInfo", "iIIFFFFIIIIII", playerId);
  return {
    teamId,
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  };
};
