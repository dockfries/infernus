import { StreamerObjectTypes } from "../definitions/ObjectTypes";

export const CreateDynamicCircle = (
  x: number,
  y: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1
): number => {
  return samp.callNative(
    "CreateDynamicCircle",
    "fffiii",
    x,
    y,
    size,
    worldId,
    interiorId,
    playerId
  );
};

export const CreateDynamicCylinder = (
  x: number,
  y: number,
  minz: number,
  maxz: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1
): number => {
  return samp.callNative(
    "CreateDynamicCylinder",
    "fffffiii",
    x,
    y,
    minz,
    maxz,
    size,
    worldId,
    interiorId,
    playerId
  );
};

export const CreateDynamicSphere = (
  x: number,
  y: number,
  z: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1
): number => {
  return samp.callNative(
    "CreateDynamicSphere",
    "ffffiii",
    x,
    y,
    z,
    size,
    worldId,
    interiorId,
    playerId
  );
};

export const CreateDynamicRectangle = (
  minx: number,
  miny: number,
  maxx: number,
  maxy: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1
): number => {
  return samp.callNative(
    "CreateDynamicRectangle",
    "ffffiii",
    minx,
    miny,
    maxx,
    maxy,
    worldId,
    interiorId,
    playerId
  );
};

export const CreateDynamicCuboid = (
  minx: number,
  miny: number,
  minz: number,
  maxx: number,
  maxy: number,
  maxz: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1
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
    worldId,
    interiorId,
    playerId
  );
};

export const CreateDynamicPolygon = (
  points: number[],
  minz: number = Number.MIN_VALUE,
  maxz: number = Number.MAX_VALUE,
  worldId = -1,
  interiorId = -1,
  playerId = -1
): number => {
  return samp.callNative(
    "CreateDynamicPolygon",
    "affiiii",
    points,
    minz,
    maxz,
    points.length,
    worldId,
    interiorId,
    playerId
  );
};

export const DestroyDynamicArea = (areaId: number): number => {
  return samp.callNative("DestroyDynamicArea", "i", areaId);
};

export const IsValidDynamicArea = (areaId: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicArea", "i", areaId));
};

export const GetDynamicAreaType = (areaId: number): number => {
  return samp.callNative("GetDynamicAreaType", "i", areaId);
};

export const GetDynamicPolygonPoints = (areaId: number): number[] => {
  return samp.callNative(
    "GetDynamicPolygonPoints",
    "iAi",
    areaId,
    GetDynamicPolygonNumberPoints(areaId)
  );
};

export const GetDynamicPolygonNumberPoints = (areaId: number): number => {
  return samp.callNative("GetDynamicPolygonNumberPoints", "i", areaId);
};

export const IsPlayerInDynamicArea = (
  playerId: number,
  areaId: number,
  recheck = false
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicArea", "iii", playerId, areaId, recheck)
  );
};

export const IsPlayerInAnyDynamicArea = (
  playerId: number,
  recheck = false
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInAnyDynamicArea", "ii", playerId, recheck)
  );
};

export const IsAnyPlayerInDynamicArea = (
  areaId: number,
  recheck = false
): boolean => {
  return Boolean(
    samp.callNative("IsAnyPlayerInDynamicArea", "ii", areaId, recheck)
  );
};

export const IsAnyPlayerInAnyDynamicArea = (recheck = false): boolean => {
  return Boolean(samp.callNative("IsAnyPlayerInAnyDynamicArea", "i", recheck));
};

export const GetPlayerDynamicAreas = (playerId: number): number[] => {
  return samp.callNative(
    "GetPlayerDynamicAreas",
    "iAi",
    playerId,
    GetPlayerNumberDynamicAreas(playerId)
  );
};

export const GetPlayerNumberDynamicAreas = (playerId: number) => {
  return samp.callNative("GetPlayerNumberDynamicAreas", "i", playerId);
};

export const IsPointInDynamicArea = (
  areaId: number,
  x: number,
  y: number,
  z: number
): boolean => {
  return Boolean(
    samp.callNative("IsPointInDynamicArea", "ifff", areaId, x, y, z)
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
  areaId: number,
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
      areaId,
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
  areaId: number,
  objectid: number,
  type = StreamerObjectTypes.DYNAMIC,
  playerId = 0xffff,
  offsetx = 0.0,
  offsety = 0.0,
  offsetz = 0.0
): number => {
  return samp.callNative(
    "AttachDynamicAreaToObject",
    "iiiifff",
    areaId,
    objectid,
    type,
    playerId,
    offsetx,
    offsety,
    offsetz
  );
};

export const AttachDynamicAreaToPlayer = (
  areaId: number,
  playerId: number,
  offsetx = 0.0,
  offsety = 0.0,
  offsetz = 0.0
): number => {
  return samp.callNative(
    "AttachDynamicAreaToPlayer",
    "iifff",
    areaId,
    playerId,
    offsetx,
    offsety,
    offsetz
  );
};

export const AttachDynamicAreaToVehicle = (
  areaId: number,
  vehicleid: number,
  offsetx = 0.0,
  offsety = 0.0,
  offsetz = 0.0
): number => {
  return samp.callNative(
    "AttachDynamicAreaToVehicle",
    "iifff",
    areaId,
    vehicleid,
    offsetx,
    offsety,
    offsetz
  );
};

export const ToggleDynAreaSpectateMode = (
  areaId: number,
  toggle: boolean
): number => {
  return samp.callNative("ToggleDynAreaSpectateMode", "ii", areaId, toggle);
};

export const IsToggleDynAreaSpectateMode = (areaId: number): boolean => {
  return Boolean(samp.callNative("IsToggleDynAreaSpectateMode", "i", areaId));
};
