import { StreamerObjectTypes } from "../definitions/ObjectTypes";

export const CreateDynamicCircle = (
  x: number,
  y: number,
  size: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1
): number => {
  return samp.callNative(
    "CreateDynamicCircle",
    "fffiii",
    x,
    y,
    size,
    worldid,
    interiorid,
    playerid
  );
};

export const CreateDynamicCylinder = (
  x: number,
  y: number,
  minz: number,
  maxz: number,
  size: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1
): number => {
  return samp.callNative(
    "CreateDynamicCylinder",
    "fffffiii",
    x,
    y,
    minz,
    maxz,
    size,
    worldid,
    interiorid,
    playerid
  );
};

export const CreateDynamicSphere = (
  x: number,
  y: number,
  z: number,
  size: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1
): number => {
  return samp.callNative(
    "CreateDynamicSphere",
    "ffffiii",
    x,
    y,
    z,
    size,
    worldid,
    interiorid,
    playerid
  );
};

export const CreateDynamicRectangle = (
  minx: number,
  miny: number,
  maxx: number,
  maxy: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1
): number => {
  return samp.callNative(
    "CreateDynamicRectangle",
    "ffffiii",
    minx,
    miny,
    maxx,
    maxy,
    worldid,
    interiorid,
    playerid
  );
};

export const CreateDynamicCuboid = (
  minx: number,
  miny: number,
  minz: number,
  maxx: number,
  maxy: number,
  maxz: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1
): number => {
  return samp.callNative(
    "CreateDynamicCuboid",
    "ffffffiii",
    minx,
    miny,
    minz,
    maxx,
    maxy,
    maxz,
    worldid,
    interiorid,
    playerid
  );
};

export const CreateDynamicPolygon = (
  points: number[],
  minz: number = Number.MIN_VALUE,
  maxz: number = Number.MAX_VALUE,
  worldid = -1,
  interiorid = -1,
  playerid = -1
): number => {
  return samp.callNative(
    "CreateDynamicPolygon",
    "affiiii",
    points,
    minz,
    maxz,
    points.length,
    worldid,
    interiorid,
    playerid
  );
};

export const DestroyDynamicArea = (areaid: number): number => {
  return samp.callNative("DestroyDynamicArea", "i", areaid);
};

export const IsValidDynamicArea = (areaid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicArea", "i", areaid));
};

export const GetDynamicAreaType = (areaid: number): number => {
  return samp.callNative("GetDynamicAreaType", "i", areaid);
};

export const GetDynamicPolygonPoints = (areaid: number): number[] => {
  return samp.callNative(
    "GetDynamicPolygonPoints",
    "iAi",
    areaid,
    GetDynamicPolygonNumberPoints(areaid)
  );
};

export const GetDynamicPolygonNumberPoints = (areaid: number): number => {
  return samp.callNative("GetDynamicPolygonNumberPoints", "i", areaid);
};

export const IsPlayerInDynamicArea = (
  playerid: number,
  areaid: number,
  recheck = false
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicArea", "iii", playerid, areaid, recheck)
  );
};

export const IsPlayerInAnyDynamicArea = (
  playerid: number,
  recheck = false
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInAnyDynamicArea", "ii", playerid, recheck)
  );
};

export const IsAnyPlayerInDynamicArea = (
  areaid: number,
  recheck = false
): boolean => {
  return Boolean(
    samp.callNative("IsAnyPlayerInDynamicArea", "ii", areaid, recheck)
  );
};

export const IsAnyPlayerInAnyDynamicArea = (recheck = false): boolean => {
  return Boolean(samp.callNative("IsAnyPlayerInAnyDynamicArea", "i", recheck));
};

export const GetPlayerDynamicAreas = (playerid: number): number[] => {
  return samp.callNative(
    "GetPlayerDynamicAreas",
    "iAi",
    playerid,
    GetPlayerNumberDynamicAreas(playerid)
  );
};

export const GetPlayerNumberDynamicAreas = (playerid: number) => {
  return samp.callNative("GetPlayerNumberDynamicAreas", "i", playerid);
};

export const IsPointInDynamicArea = (
  areaid: number,
  x: number,
  y: number,
  z: number
): boolean => {
  return Boolean(
    samp.callNative("IsPointInDynamicArea", "ifff", areaid, x, y, z)
  );
};

export const IsPointInAnyDynamicArea = (
  x: number,
  y: number,
  z: number
): boolean => {
  return Boolean(samp.callNative("IsPointInAnyDynamicArea", "fff", x, y, z));
};

export const IsLineInDynamicArea = (
  areaid: number,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsLineInDynamicArea",
      "iffffff",
      areaid,
      x1,
      y1,
      z1,
      x2,
      y2,
      z2
    )
  );
};

export const IsLineInAnyDynamicArea = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): boolean => {
  return Boolean(
    samp.callNative("IsLineInAnyDynamicArea", "ffffff", x1, y1, z1, x2, y2, z2)
  );
};

export const GetDynamicAreasForPoint = (
  x: number,
  y: number,
  z: number
): number[] => {
  return samp.callNative(
    "GetDynamicAreasForPoint",
    "fffAi",
    x,
    y,
    z,
    GetNumberDynamicAreasForPoint(x, y, z)
  );
};

export const GetNumberDynamicAreasForPoint = (
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("GetNumberDynamicAreasForPoint", "fff", x, y, z);
};

export const GetDynamicAreasForLine = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number[] => {
  return samp.callNative(
    "GetDynamicAreasForLine",
    "ffffffAi",
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    GetNumberDynamicAreasForLine(x1, y1, z1, x2, y2, z2)
  );
};

export const GetNumberDynamicAreasForLine = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number => {
  return samp.callNative(
    "GetNumberDynamicAreasForLine",
    "ffffff",
    x1,
    y1,
    z1,
    x2,
    y2,
    z2
  );
};

export const AttachDynamicAreaToObject = (
  areaid: number,
  objectid: number,
  type = StreamerObjectTypes.DYNAMIC,
  playerid = 0xffff,
  offsetx = 0.0,
  offsety = 0.0,
  offsetz = 0.0
): number => {
  return samp.callNative(
    "AttachDynamicAreaToObject",
    "iiiifff",
    areaid,
    objectid,
    type,
    playerid,
    offsetx,
    offsety,
    offsetz
  );
};

export const AttachDynamicAreaToPlayer = (
  areaid: number,
  playerid: number,
  offsetx = 0.0,
  offsety = 0.0,
  offsetz = 0.0
): number => {
  return samp.callNative(
    "AttachDynamicAreaToPlayer",
    "iifff",
    areaid,
    playerid,
    offsetx,
    offsety,
    offsetz
  );
};

export const AttachDynamicAreaToVehicle = (
  areaid: number,
  vehicleid: number,
  offsetx = 0.0,
  offsety = 0.0,
  offsetz = 0.0
): number => {
  return samp.callNative(
    "AttachDynamicAreaToVehicle",
    "iifff",
    areaid,
    vehicleid,
    offsetx,
    offsety,
    offsetz
  );
};

export const ToggleDynAreaSpectateMode = (
  areaid: number,
  toggle: boolean
): number => {
  return samp.callNative("ToggleDynAreaSpectateMode", "ii", areaid, toggle);
};

export const IsToggleDynAreaSpectateMode = (areaid: number): boolean => {
  return Boolean(samp.callNative("IsToggleDynAreaSpectateMode", "i", areaid));
};
