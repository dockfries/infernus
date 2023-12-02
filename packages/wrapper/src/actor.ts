import type { IActorAnimation, IActorSpawn } from "./interfaces/Actor";

export const GetActorSkin = (actorId: number): number => {
  return samp.callNative("GetActorSkin", "i", actorId);
};

export const SetActorSkin = (actorId: number, model: number): number => {
  return samp.callNative("SetActorSkin", "ii", actorId, model);
};

export const GetActorSpawnInfo = (actorId: number): IActorSpawn => {
  const [skinId = 0, fX = 0, fY = 0, fZ = 0, fAngle = 0]: number[] =
    samp.callNative("GetActorSpawnInfo", "iIFFFF", actorId);
  return { skinId, fX, fY, fZ, fAngle };
};

export const GetActorAnimation = (actorId: number): IActorAnimation => {
  const [
    animLib,
    animName,
    fDelta = 0,
    loop = 0,
    lockX = 0,
    lockY = 0,
    freeze = 0,
    time = 0,
  ]: [string, string, number, number, number, number, number, number] =
    samp.callNative("GetActorAnimation", "iSiSiFIIIII", actorId, 32, 32);
  return { animLib, animName, fDelta, loop, lockX, lockY, freeze, time };
};
