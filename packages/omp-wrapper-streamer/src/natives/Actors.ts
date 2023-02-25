import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicActor = (
  modelid: number,
  x: number,
  y: number,
  z: number,
  r: number,
  invulnerable = true,
  health = 100.0,
  worldid = 0,
  interiorid = -1,
  playerid = -1,
  streamdistance: number = StreamerDistances.ACTOR_SD,
  areaid = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicActor",
    "iffffifiiifii",
    modelid,
    x,
    y,
    z,
    r,
    invulnerable,
    health,
    worldid,
    interiorid,
    playerid,
    streamdistance,
    areaid,
    priority
  );
};

export const DestroyDynamicActor = (actorid: number): number => {
  return samp.callNative("DestroyDynamicActor", "i", actorid);
};

export const IsValidDynamicActor = (actorid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicActor", "i", actorid));
};

export const IsDynamicActorStreamedIn = (
  actorid: number,
  forplayerid: number
): boolean => {
  return Boolean(
    samp.callNative("IsDynamicActorStreamedIn", "ii", actorid, forplayerid)
  );
};

export const GetDynamicActorVirtualWorld = (actorid: number): number => {
  return samp.callNative("GetDynamicActorVirtualWorld", "i", actorid);
};

export const SetDynamicActorVirtualWorld = (
  actorid: number,
  vworld: number
): number => {
  return samp.callNative("SetDynamicActorVirtualWorld", "ii", actorid, vworld);
};

export const ApplyDynamicActorAnimation = (
  actorid: number,
  animlib: string,
  animname: string,
  fdelta: number,
  loop: boolean,
  lockx: boolean,
  locky: boolean,
  freeze: boolean,
  time: number
): number => {
  return samp.callNative(
    "ApplyDynamicActorAnimation",
    "issfiiiii",
    actorid,
    animlib,
    animname,
    fdelta,
    loop,
    lockx,
    locky,
    freeze,
    time
  );
};

export const ClearDynamicActorAnimations = (actorid: number): number => {
  return samp.callNative("ClearDynamicActorAnimations", "i", actorid);
};

export const GetDynamicActorFacingAngle = (actorid: number): number => {
  return samp.callNative("GetDynamicActorFacingAngle", "iF", actorid);
};

export const SetDynamicActorFacingAngle = (
  actorid: number,
  ang: number
): number => {
  return samp.callNative("SetDynamicActorFacingAngle", "if", actorid, ang);
};

export const GetDynamicActorPos = (actorid: number) => {
  const [x, y, z]: number[] = samp.callNative(
    "GetDynamicActorPos",
    "iFFF",
    actorid
  );
  return { x, y, z };
};

export const SetDynamicActorPos = (
  actorid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetDynamicActorPos", "ifff", actorid, x, y, z);
};

export const GetDynamicActorHealth = (actorid: number): number => {
  return samp.callNative("GetDynamicActorHealth", "iF", actorid);
};

export const SetDynamicActorHealth = (
  actorid: number,
  health: number
): number => {
  return samp.callNative("SetDynamicActorHealth", "if", actorid, health);
};

export const SetDynamicActorInvulnerable = (
  actorid: number,
  invulnerable = true
): number => {
  return samp.callNative(
    "SetDynamicActorInvulnerable",
    "ii",
    actorid,
    invulnerable
  );
};

export const IsDynamicActorInvulnerable = (actorid: number): boolean => {
  return Boolean(samp.callNative("IsDynamicActorInvulnerable", "i", actorid));
};

export const GetPlayerTargetDynamicActor = (playerid: number): number => {
  return samp.callNative("GetPlayerTargetDynamicActor", "i", playerid);
};

export const GetPlayerCameraTargetDynActor = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraTargetDynActor", "i", playerid);
};
