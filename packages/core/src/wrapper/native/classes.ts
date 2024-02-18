import type { WeaponEnum } from "core/enums";
import type { IPlayerClass } from "./interfaces/PlayerClass";

export const GetAvailableClasses = (): number => {
  return samp.callNative("GetAvailableClasses", "");
};

// when getting a class through AddPlayerClass(without ex), teamId may be 255.
// bug: z_angle The value of does not look accurate? not sure of the cause of the problem
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
  ] = res;
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

// bug: z_angel is not assigned a value, not sure of the cause of the problem
export const EditPlayerClass = (
  classId: number,
  teamId: number,
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "EditPlayerClass",
      "iiiffffiiiiii",
      classId,
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
    ),
  );
};

export const SetTeamCount = (count: number): number => {
  return samp.callNative("SetTeamCount", "i", count);
};

export const AddPlayerClass = (
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number,
): number => {
  return samp.callNative(
    "AddPlayerClass",
    "iffffiiiiii",
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
  );
};

export const AddPlayerClassEx = (
  teamId: number,
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number,
): number => {
  return samp.callNative(
    "AddPlayerClassEx",
    "iiffffiiiiii",
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
  weapon1_ammo: number,
  weapon2: WeaponEnum,
  weapon2_ammo: number,
  weapon3: WeaponEnum,
  weapon3_ammo: number,
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
    weapon1_ammo,
    weapon2,
    weapon2_ammo,
    weapon3,
    weapon3_ammo,
  );
};

export const SpawnPlayer = (playerId: number): number => {
  return samp.callNative("SpawnPlayer", "i", playerId);
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
