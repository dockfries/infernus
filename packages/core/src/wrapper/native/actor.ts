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

export const CreateActor = (
  modelId: number,
  X: number,
  Y: number,
  Z: number,
  Rotation: number
): number => {
  return samp.callNative("CreateActor", "iffff", modelId, X, Y, Z, Rotation);
};

export const DestroyActor = (actorId: number): number => {
  return samp.callNative("DestroyActor", "i", actorId);
};

export const IsActorStreamedIn = (
  actorId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    samp.callNative("IsActorStreamedIn", "ii", actorId, forPlayerId)
  );
};

export const SetActorVirtualWorld = (
  actorId: number,
  vWorld: number
): number => {
  return samp.callNative("SetActorVirtualWorld", "ii", actorId, vWorld);
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
  time: number
): number => {
  return samp.callNative(
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
    time
  );
};

export const ClearActorAnimations = (actorId: number): number => {
  return samp.callNative("ClearActorAnimations", "i", actorId);
};

export const SetActorPos = (
  actorId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetActorPos", "ifff", actorId, X, Y, Z);
};

export const GetActorPos = (actorId: number): Array<number> => {
  return samp.callNative("GetActorPos", "iFFF", actorId);
};

export const SetActorFacingAngle = (actorId: number, ang: number): number => {
  return samp.callNative("SetActorFacingAngle", "if", actorId, ang);
};

export const GetActorFacingAngle = (actorId: number): number => {
  const [angle] = samp.callNative(
    "GetActorFacingAngle",
    "iF",
    actorId
  ) as unknown as number[];
  return angle;
};

export const SetActorHealth = (actorId: number, health: number): number => {
  return samp.callNative("SetActorHealth", "if", actorId, health);
};

export const GetActorHealth = (actorId: number): number => {
  const [health] = samp.callNative(
    "GetActorHealth",
    "iF",
    actorId
  ) as unknown as number[];
  return health;
};

export const SetActorInvulnerable = (
  actorId: number,
  invulnerable: boolean
): number => {
  return samp.callNative("SetActorInvulnerable", "ii", actorId, invulnerable);
};

export const IsActorInvulnerable = (actorId: number): boolean => {
  return Boolean(samp.callNative("IsActorInvulnerable", "i", actorId));
};

export const IsValidActor = (actorId: number): boolean => {
  return Boolean(samp.callNative("IsValidActor", "i", actorId));
};
