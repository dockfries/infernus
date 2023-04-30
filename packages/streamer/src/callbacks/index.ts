import type { StreamerItemTypes } from "../definitions/ItemTypes";

export const OnDynamicObjectMoved = (
  fn: (objectid: number) => number
): void => {
  samp.on("OnDynamicObjectMoved", fn);
};

export const OnPlayerEditDynamicObject = (
  fn: (
    playerid: number,
    objectid: number,
    response: number,
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number
  ) => number
): void => {
  samp.on("OnPlayerEditDynamicObject", fn);
};

export const OnPlayerSelectDynamicObject = (
  fn: (
    playerid: number,
    objectid: number,
    modelid: number,
    x: number,
    y: number,
    z: number
  ) => number
): void => {
  samp.on("OnPlayerSelectDynamicObject", fn);
};

export const OnPlayerShootDynamicObject = (
  fn: (
    playerid: number,
    weaponid: number,
    objectid: number,
    x: number,
    y: number,
    z: number
  ) => number
): void => {
  samp.on("OnPlayerShootDynamicObject", fn);
};

export const OnPlayerPickUpDynamicPickup = (
  fn: (playerid: number, pickupid: number) => number
): void => {
  samp.on("OnPlayerPickUpDynamicPickup", fn);
};

export const OnPlayerEnterDynamicCP = (
  fn: (playerid: number, checkpointid: number) => number
): void => {
  samp.on("OnPlayerEnterDynamicCP", fn);
};

export const OnPlayerLeaveDynamicCP = (
  fn: (playerid: number, checkpointid: number) => number
): void => {
  samp.on("OnPlayerLeaveDynamicCP", fn);
};

export const OnPlayerEnterDynamicRaceCP = (
  fn: (playerid: number, checkpointid: number) => number
): void => {
  samp.on("OnPlayerEnterDynamicRaceCP", fn);
};

export const OnPlayerLeaveDynamicRaceCP = (
  fn: (playerid: number, checkpointid: number) => number
): void => {
  samp.on("OnPlayerLeaveDynamicRaceCP", fn);
};

export const OnPlayerEnterDynamicArea = (
  fn: (playerid: number, areaid: number) => number
): void => {
  samp.on("OnPlayerEnterDynamicArea", fn);
};

export const OnPlayerLeaveDynamicArea = (
  fn: (playerid: number, areaid: number) => number
): void => {
  samp.on("OnPlayerLeaveDynamicArea", fn);
};

export const OnPlayerGiveDamageDynamicActor = (
  fn: (
    playerid: number,
    actorid: number,
    amount: number,
    weaponid: number,
    bodypart: number
  ) => number
): void => {
  samp.on("OnPlayerGiveDamageDynamicActor", fn);
};

export const OnDynamicActorStreamIn = (
  fn: (actorid: number, forplayerid: number) => number
): void => {
  samp.on("OnDynamicActorStreamIn", fn);
};

export const OnDynamicActorStreamOut = (
  fn: (actorid: number, forplayerid: number) => number
): void => {
  samp.on("OnDynamicActorStreamOut", fn);
};

export const Streamer_OnItemStreamIn = (
  fn: (type: StreamerItemTypes, id: number, forplayerid: number) => number
): void => {
  samp.on("Streamer_OnItemStreamIn", fn);
};

export const Streamer_OnItemStreamOut = (
  fn: (type: StreamerItemTypes, id: number, forplayerid: number) => number
): void => {
  samp.on("Streamer_OnItemStreamOut", fn);
};

export const Streamer_OnPluginError = (fn: (error: string) => number): void => {
  samp.on("Streamer_OnPluginError", fn);
};
