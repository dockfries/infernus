import { IPlayerClass } from "./interfaces/PlayerClass";

export const GetAvailableClasses = (): number => {
  return samp.callNative("GetAvailableClasses", "");
};

// when getting a class through AddPlayerClass(without ex), teamid may be 255.
// bug: z_angle The value of does not look accurate? not sure of the cause of the problem
export const GetPlayerClass = (classid: number): boolean | IPlayerClass => {
  if (classid < GetAvailableClasses() || classid > 319) return false;
  const res: number[] = samp.callNative(
    "GetPlayerClass",
    "iIIFFFFIIIIII",
    classid
  );
  const [
    teamid,
    modelid = 0,
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
    teamid,
    modelid,
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
  classid: number,
  teamid: number,
  modelid: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number
): boolean => {
  return Boolean(
    samp.callNative(
      "EditPlayerClass",
      "iiiffffiiiiii",
      classid,
      teamid,
      modelid,
      spawn_x,
      spawn_y,
      spawn_z,
      z_angle,
      weapon1,
      weapon1_ammo,
      weapon2,
      weapon2_ammo,
      weapon3,
      weapon3_ammo
    )
  );
};
