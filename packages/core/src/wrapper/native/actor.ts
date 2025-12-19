import { ICommonRetVal } from "core/interfaces";
import type { IActorAnimation, IActorSpawn } from "./interfaces/Actor";

export const GetActorSkin = (actorId: number): number => {
  return samp.callNative("GetActorSkin", "i", actorId);
};

export const SetActorSkin = (actorId: number, model: number): boolean => {
  return !!samp.callNative("SetActorSkin", "ii", actorId, model);
};

export const GetActorSpawnInfo = (
  actorId: number,
): IActorSpawn & ICommonRetVal => {
  const [skinId = 0, fX = 0, fY = 0, fZ = 0, fAngle = 0, ret]: number[] =
    samp.callNative("GetActorSpawnInfo", "iIFFFF", actorId);
  return { skinId, fX, fY, fZ, fAngle, ret: !!ret };
};

export const GetActorAnimation = (
  actorId: number,
): IActorAnimation & ICommonRetVal => {
  const [
    animLib,
    animName,
    fDelta = 0,
    loop = 0,
    lockX = 0,
    lockY = 0,
    freeze = 0,
    time = 0,
    ret,
  ]: [string, string, number, number, number, number, number, number, number] =
    samp.callNative("GetActorAnimation", "iSiSiFIIIII", actorId, 32, 32);
  return {
    animLib,
    animName,
    fDelta,
    loop,
    lockX,
    lockY,
    freeze,
    time,
    ret: !!ret,
  };
};

export const CreateActor = (
  skin: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
): number => {
  return samp.callNative("CreateActor", "iffff", skin, x, y, z, rotation);
};

export const DestroyActor = (actorId: number): boolean => {
  return !!samp.callNative("DestroyActor", "i", actorId);
};

export const IsActorStreamedIn = (
  actorId: number,
  forPlayerId: number,
): boolean => {
  return !!samp.callNative("IsActorStreamedIn", "ii", actorId, forPlayerId);
};

export const SetActorVirtualWorld = (
  actorId: number,
  vWorld: number,
): boolean => {
  return !!samp.callNative("SetActorVirtualWorld", "ii", actorId, vWorld);
};

export const GetActorVirtualWorld = (actorId: number): number => {
  return samp.callNative("GetActorVirtualWorld", "i", actorId);
};

export const ApplyActorAnimation = (
  actorId: number,
  animLib: string,
  animName: string,
  fDelta: number,
  loop: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time: number,
): boolean => {
  return !!samp.callNative(
    "ApplyActorAnimation",
    "issfiiiii",
    actorId,
    animLib,
    animName,
    fDelta,
    loop,
    lockX,
    lockY,
    freeze,
    time,
  );
};

export const ClearActorAnimations = (actorId: number): boolean => {
  return !!samp.callNative("ClearActorAnimations", "i", actorId);
};

export const SetActorPos = (
  actorId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetActorPos", "ifff", actorId, x, y, z);
};

export const GetActorPos = (actorId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetActorPos",
    "iFFF",
    actorId,
  );
  return { x, y, z, ret: !!ret };
};

export const SetActorFacingAngle = (actorId: number, ang: number): boolean => {
  return !!samp.callNative("SetActorFacingAngle", "if", actorId, ang);
};

export const GetActorFacingAngle = (actorId: number) => {
  const [angle, ret]: [number, number] = samp.callNative(
    "GetActorFacingAngle",
    "iF",
    actorId,
  );
  return { angle, ret: !!ret };
};

export const SetActorHealth = (actorId: number, health: number): boolean => {
  return !!samp.callNative("SetActorHealth", "if", actorId, health);
};

export const GetActorHealth = (actorId: number) => {
  const [health, ret]: [number, number] = samp.callNative(
    "GetActorHealth",
    "iF",
    actorId,
  );
  return { health, ret: !!ret };
};

export const SetActorInvulnerable = (
  actorId: number,
  invulnerable: boolean,
): boolean => {
  return !!samp.callNative("SetActorInvulnerable", "ii", actorId, invulnerable);
};

export const IsActorInvulnerable = (actorId: number): boolean => {
  return !!samp.callNative("IsActorInvulnerable", "i", actorId);
};

export const IsValidActor = (actorId: number): boolean => {
  return !!samp.callNative("IsValidActor", "i", actorId);
};
