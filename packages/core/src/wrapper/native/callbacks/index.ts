// Reference to Peter Szombati's samp-node-lib

import type { BodyPartsEnum, WeaponEnum } from "core/enums";

export const OnGameModeInit = (func: () => void) => {
  samp.addEventListener("OnGameModeInit", func);
};

export const OnGameModeExit = (func: () => void) => {
  samp.addEventListener("OnGameModeExit", func);
};

export const OnFilterScriptInit = (func: () => void) => {
  samp.addEventListener("OnFilterScriptInit", func);
};

export const OnFilterScriptExit = (func: () => void) => {
  samp.addEventListener("OnFilterScriptExit", func);
};

export const OnPlayerConnect = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerConnect", func);
};

export const OnPlayerDisconnect = (
  func: (playerid: number, reason: number) => number
) => {
  samp.addEventListener("OnPlayerDisconnect", func);
};

export const OnPlayerSpawn = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerSpawn", func);
};

export const OnPlayerDeath = (
  func: (playerid: number, killerid: number, reason: number) => number
) => {
  samp.addEventListener("OnPlayerDeath", func);
};

export const OnVehicleSpawn = (func: (vehicleid: number) => number) => {
  samp.addEventListener("OnVehicleSpawn", func);
};

export const OnVehicleDeath = (
  func: (vehicleid: number, killer: number) => number
) => {
  samp.addEventListener("OnVehicleDeath", func);
};

export const OnPlayerRequestClass = (
  func: (playerid: number, classid: number) => number
) => {
  samp.addEventListener("OnPlayerRequestClass", func);
};

export const OnPlayerEnterVehicle = (
  func: (playerid: number, vehicleid: number, ispassenger: number) => number
) => {
  samp.addEventListener("OnPlayerEnterVehicle", func);
};

export const OnPlayerExitVehicle = (
  func: (playerid: number, vehicleid: number) => number
) => {
  samp.addEventListener("OnPlayerExitVehicle", func);
};

export const OnPlayerStateChange = (
  func: (playerid: number, newstate: number, oldstate: number) => number
) => {
  samp.addEventListener("OnPlayerStateChange", func);
};

export const OnPlayerEnterCheckpoint = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerEnterCheckpoint", func);
};

export const OnPlayerLeaveCheckpoint = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerLeaveCheckpoint", func);
};

export const OnPlayerEnterRaceCheckpoint = (
  func: (playerid: number) => number
) => {
  samp.addEventListener("OnPlayerEnterRaceCheckpoint", func);
};

export const OnPlayerLeaveRaceCheckpoint = (
  func: (playerid: number) => number
) => {
  samp.addEventListener("OnPlayerLeaveRaceCheckpoint", func);
};

export const OnPlayerRequestSpawn = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerRequestSpawn", func);
};

export const OnObjectMoved = (func: (objectid: number) => number) => {
  samp.addEventListener("OnObjectMoved", func);
};

export const OnPlayerObjectMoved = (
  func: (playerid: number, objectid: number) => number
) => {
  samp.addEventListener("OnPlayerObjectMoved", func);
};

export const OnPlayerPickUpPickup = (
  func: (playerid: number, pickupid: number) => number
) => {
  samp.addEventListener("OnPlayerPickUpPickup", func);
};

export const OnVehicleMod = (
  func: (playerid: number, vehicleid: number, componentid: number) => number
) => {
  samp.addEventListener("OnVehicleMod", func);
};

export const OnEnterExitModShop = (
  func: (playerid: number, enterexit: number, interiorid: number) => number
) => {
  samp.addEventListener("OnEnterExitModShop", func);
};

export const OnVehiclePaintjob = (
  func: (playerid: number, vehicleid: number, paintjobid: number) => number
) => {
  samp.addEventListener("OnVehiclePaintjob", func);
};

export const OnVehicleRespray = (
  func: (
    playerid: number,
    vehicleid: number,
    colour1: number,
    colour2: number
  ) => number
) => {
  samp.addEventListener("OnVehicleRespray", func);
};

export const OnVehicleDamageStatusUpdate = (
  func: (vehicleid: number, playerid: number) => number
) => {
  samp.addEventListener("OnVehicleDamageStatusUpdate", func);
};

export const OnUnoccupiedVehicleUpdate = (
  func: (
    vehicleid: number,
    playerid: number,
    passenger_seat: number,
    new_x: number,
    new_y: number,
    new_z: number,
    vel_x: number,
    vel_y: number,
    vel_z: number
  ) => number
) => {
  samp.addEventListener("OnUnoccupiedVehicleUpdate", func);
};

export const OnPlayerSelectedMenuRow = (
  func: (playerid: number, row: number) => number
) => {
  samp.addEventListener("OnPlayerSelectedMenuRow", func);
};

export const OnPlayerExitedMenu = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerExitedMenu", func);
};

export const OnPlayerInteriorChange = (
  func: (
    playerid: number,
    newinteriorid: number,
    oldinteriorid: number
  ) => number
) => {
  samp.addEventListener("OnPlayerInteriorChange", func);
};

export const OnPlayerKeyStateChange = (
  func: (playerid: number, newkeys: number, oldkeys: number) => number
) => {
  samp.addEventListener("OnPlayerKeyStateChange", func);
};

export const OnPlayerUpdate = (func: (playerid: number) => number) => {
  samp.addEventListener("OnPlayerUpdate", func);
};

export const OnPlayerStreamIn = (
  func: (playerid: number, forplayerid: number) => number
) => {
  samp.addEventListener("OnPlayerStreamIn", func);
};

export const OnPlayerStreamOut = (
  func: (playerid: number, forplayerid: number) => number
) => {
  samp.addEventListener("OnPlayerStreamOut", func);
};

export const OnVehicleStreamIn = (
  func: (vehicleid: number, forplayerid: number) => number
) => {
  samp.addEventListener("OnVehicleStreamIn", func);
};

export const OnVehicleStreamOut = (
  func: (vehicleid: number, forplayerid: number) => number
) => {
  samp.addEventListener("OnVehicleStreamOut", func);
};

export const OnActorStreamIn = (
  func: (actorid: number, forplayerid: number) => number
) => {
  samp.addEventListener("OnActorStreamIn", func);
};

export const OnActorStreamOut = (
  func: (actorid: number, forplayerid: number) => number
) => {
  samp.addEventListener("OnActorStreamOut", func);
};

export const OnPlayerTakeDamage = (
  func: (
    playerid: number,
    issuerid: number,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ) => number
) => {
  samp.addEventListener("OnPlayerTakeDamage", func);
};

export const OnPlayerGiveDamage = (
  func: (
    playerid: number,
    damageid: number,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ) => number
) => {
  samp.addEventListener("OnPlayerGiveDamage", func);
};

export const OnPlayerGiveDamageActor = (
  func: (
    playerid: number,
    damaged_actorid: number,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ) => number
) => {
  samp.addEventListener("OnPlayerGiveDamageActor", func);
};

export const OnPlayerClickMap = (
  func: (playerid: number, fX: number, fY: number, fZ: number) => number
) => {
  samp.addEventListener("OnPlayerClickMap", func);
};

export const OnPlayerClickTextDraw = (
  func: (playerid: number, clickedid: number) => number
) => {
  samp.addEventListener("OnPlayerClickTextDraw", func);
};

export const OnPlayerClickPlayerTextDraw = (
  func: (playerid: number, playertextid: number) => number
) => {
  samp.addEventListener("OnPlayerClickPlayerTextDraw", func);
};

export const OnIncomingConnection = (
  func: (playerid: number, ip_address: string, port: number) => number
) => {
  samp.addEventListener("OnIncomingConnection", func);
};

export const OnTrailerUpdate = (
  func: (playerid: number, vehicleid: number) => number
) => {
  samp.addEventListener("OnTrailerUpdate", func);
};

export const OnVehicleSirenStateChange = (
  func: (playerid: number, vehicleid: number, newstate: number) => number
) => {
  samp.addEventListener("OnVehicleSirenStateChange", func);
};

export const OnPlayerFinishedDownloading = (
  func: (playerid: number, virtualworld: number) => number
) => {
  samp.addEventListener("OnPlayerFinishedDownloading", func);
};

export const OnPlayerRequestDownload = (
  func: (playerid: number, type: number, crc: number) => number
) => {
  samp.addEventListener("OnPlayerRequestDownload", func);
};

export const OnPlayerClickPlayer = (
  func: (playerid: number, clickedplayerid: number, source: number) => number
) => {
  samp.addEventListener("OnPlayerClickPlayer", func);
};

export const OnPlayerSelectObject = (
  func: (
    playerid: number,
    type: number,
    objectid: number,
    modelid: number,
    fX: number,
    fY: number,
    fZ: number
  ) => number
) => {
  samp.addEventListener("OnPlayerSelectObject", func);
};

export const OnPlayerWeaponShot = (
  func: (
    playerid: number,
    weaponid: WeaponEnum,
    hittype: number,
    hitid: number,
    fX: number,
    fY: number,
    fZ: number
  ) => number
) => {
  samp.addEventListener("OnPlayerWeaponShot", func);
};

export const OnClientCheckResponse = (
  func: (
    playerid: number,
    actionid: number,
    memaddr: number,
    retndata: number
  ) => number
) => {
  samp.addEventListener("OnClientCheckResponse", func);
};

export const OnScriptCash = (
  func: (playerid: number, amount: number, source: number) => number
) => {
  samp.addEventListener("OnScriptCash", func);
};

export const OnNPCEnterVehicle = (
  func: (vehicleid: number, seatid: number) => number
) => {
  samp.addEventListener("OnNPCEnterVehicle", func);
};

export const OnNPCExitVehicle = (func: () => number) => {
  samp.addEventListener("OnNPCExitVehicle", func);
};

export const OnNpcConnect = (func: (myplayerid: number) => number) => {
  samp.addEventListener("OnNpcConnect", func);
};

export const OnNpcDisconnect = (func: (reason: string) => number) => {
  samp.addEventListener("OnNpcDisconnect", func);
};

export const OnNPCModeInit = (func: () => number) => {
  samp.addEventListener("OnNPCModeInit", func);
};

export const OnNPCModeExit = (func: () => number) => {
  samp.addEventListener("OnNPCModeExit", func);
};

export const OnNPCSpawn = (func: () => number) => {
  samp.addEventListener("OnNPCSpawn", func);
};
