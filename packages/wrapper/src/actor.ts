import { IActorAnimation, IActorSpawn } from "./interfaces/Actor";

export const GetActorSkin = (actorid: number): number => {
  return samp.callNative("GetActorSkin", "i", actorid);
};

export const SetActorSkin = (actorid: number, model: number): number => {
  return samp.callNative("SetActorSkin", "ii", actorid, model);
};

export const GetActorSpawnInfo = (actorid: number): IActorSpawn => {
  const [skinid = 0, fX = 0, fY = 0, fZ = 0, fAngle = 0]: number[] =
    samp.callNative("GetActorSpawnInfo", "iIFFFF", actorid);
  return { skinid, fX, fY, fZ, fAngle };
};

export const GetActorAnimation = (actorid: number): IActorAnimation => {
  const [
    animlib,
    animname,
    fDelta = 0,
    loop = 0,
    lockx = 0,
    locky = 0,
    freeze = 0,
    time = 0,
  ]: [string, string, number, number, number, number, number, number] =
    samp.callNative("GetActorAnimation", "iSiSiFIIIII", actorid, 32, 32);
  return { animlib, animname, fDelta, loop, lockx, locky, freeze, time };
};
