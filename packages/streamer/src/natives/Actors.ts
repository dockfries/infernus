import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicActor = (
  modelId: number,
  x: number,
  y: number,
  z: number,
  r: number,
  invulnerable = true,
  health = 100.0,
  worldId = 0,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.ACTOR_SD,
  areaId = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicActor",
    "iffffifiiifii",
    modelId,
    x,
    y,
    z,
    r,
    invulnerable,
    health,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority
  );
};

export const DestroyDynamicActor = (actorId: number): number => {
  return samp.callNative("DestroyDynamicActor", "i", actorId);
};

export const IsValidDynamicActor = (actorId: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicActor", "i", actorId));
};

export const IsDynamicActorStreamedIn = (
  actorId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    samp.callNative("IsDynamicActorStreamedIn", "ii", actorId, forPlayerId)
  );
};

export const GetDynamicActorVirtualWorld = (actorId: number): number => {
  return samp.callNative("GetDynamicActorVirtualWorld", "i", actorId);
};

export const SetDynamicActorVirtualWorld = (
  actorId: number,
  vWorld: number
): number => {
  return samp.callNative("SetDynamicActorVirtualWorld", "ii", actorId, vWorld);
};

export const ApplyDynamicActorAnimation = (
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
    "ApplyDynamicActorAnimation",
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

export const ClearDynamicActorAnimations = (actorId: number): number => {
  return samp.callNative("ClearDynamicActorAnimations", "i", actorId);
};

export const GetDynamicActorFacingAngle = (actorId: number): number => {
  return samp.callNative("GetDynamicActorFacingAngle", "iF", actorId);
};

export const SetDynamicActorFacingAngle = (
  actorId: number,
  ang: number
): number => {
  return samp.callNative("SetDynamicActorFacingAngle", "if", actorId, ang);
};

export const GetDynamicActorPos = (actorId: number) => {
  const [x, y, z]: number[] = samp.callNative(
    "GetDynamicActorPos",
    "iFFF",
    actorId
  );
  return { x, y, z };
};

export const SetDynamicActorPos = (
  actorId: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetDynamicActorPos", "ifff", actorId, x, y, z);
};

export const GetDynamicActorHealth = (actorId: number): number => {
  return samp.callNative("GetDynamicActorHealth", "iF", actorId);
};

export const SetDynamicActorHealth = (
  actorId: number,
  health: number
): number => {
  return samp.callNative("SetDynamicActorHealth", "if", actorId, health);
};

export const SetDynamicActorInvulnerable = (
  actorId: number,
  invulnerable = true
): number => {
  return samp.callNative(
    "SetDynamicActorInvulnerable",
    "ii",
    actorId,
    invulnerable
  );
};

export const IsDynamicActorInvulnerable = (actorId: number): boolean => {
  return Boolean(samp.callNative("IsDynamicActorInvulnerable", "i", actorId));
};

export const GetPlayerTargetDynamicActor = (playerId: number): number => {
  return samp.callNative("GetPlayerTargetDynamicActor", "i", playerId);
};

export const GetPlayerCameraTargetDynActor = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetDynActor", "i", playerId);
};
