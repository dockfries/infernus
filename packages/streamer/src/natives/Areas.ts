import { StreamerObjectTypes } from "../definitions/ObjectTypes";

export const CreateDynamicCircle = (
  x: number,
  y: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
): number => {
  return samp.callNative(
    "CreateDynamicCircle",
    "fffiii",
    x,
    y,
    size,
    worldId,
    interiorId,
    playerId,
  );
};

export const CreateDynamicCylinder = (
  x: number,
  y: number,
  minZ: number,
  maxZ: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
): number => {
  return samp.callNative(
    "CreateDynamicCylinder",
    "fffffiii",
    x,
    y,
    minZ,
    maxZ,
    size,
    worldId,
    interiorId,
    playerId,
  );
};

export const CreateDynamicSphere = (
  x: number,
  y: number,
  z: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
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
    playerId,
  );
};

export const CreateDynamicRectangle = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
): number => {
  return samp.callNative(
    "CreateDynamicRectangle",
    "ffffiii",
    minX,
    minY,
    maxX,
    maxY,
    worldId,
    interiorId,
    playerId,
  );
};

export const CreateDynamicCuboid = (
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
): number => {
  return samp.callNative(
    "CreateDynamicCuboid",
    "ffffffiii",
    minX,
    minY,
    minZ,
    maxX,
    maxY,
    maxZ,
    worldId,
    interiorId,
    playerId,
  );
};

export const CreateDynamicPolygon = (
  points: number[],
  minZ: number = Number.MIN_VALUE,
  maxZ: number = Number.MAX_VALUE,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
): number => {
  return samp.callNative(
    "CreateDynamicPolygon",
    "affiiii",
    points,
    minZ,
    maxZ,
    points.length,
    worldId,
    interiorId,
    playerId,
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
  const [points] = samp.callNative(
    "GetDynamicPolygonPoints",
    "iAi",
    areaId,
    GetDynamicPolygonNumberPoints(areaId),
  ) as [number[]];
  return points;
};

export const GetDynamicPolygonNumberPoints = (areaId: number): number => {
  return samp.callNative("GetDynamicPolygonNumberPoints", "i", areaId);
};

export const IsPlayerInDynamicArea = (
  playerId: number,
  areaId: number,
  recheck = false,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicArea", "iii", playerId, areaId, recheck),
  );
};

export const IsPlayerInAnyDynamicArea = (
  playerId: number,
  recheck = false,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInAnyDynamicArea", "ii", playerId, recheck),
  );
};

export const IsAnyPlayerInDynamicArea = (
  areaId: number,
  recheck = false,
): boolean => {
  return Boolean(
    samp.callNative("IsAnyPlayerInDynamicArea", "ii", areaId, recheck),
  );
};

export const IsAnyPlayerInAnyDynamicArea = (recheck = false): boolean => {
  return Boolean(samp.callNative("IsAnyPlayerInAnyDynamicArea", "i", recheck));
};

export const GetPlayerDynamicAreas = (playerId: number): number[] => {
  const [areas] = samp.callNative(
    "GetPlayerDynamicAreas",
    "iAi",
    playerId,
    GetPlayerNumberDynamicAreas(playerId),
  ) as [number[]];
  return areas;
};

export const GetPlayerNumberDynamicAreas = (playerId: number) => {
  return samp.callNative("GetPlayerNumberDynamicAreas", "i", playerId);
};

export const IsPointInDynamicArea = (
  areaId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPointInDynamicArea", "ifff", areaId, x, y, z),
  );
};

export const IsPointInAnyDynamicArea = (
  x: number,
  y: number,
  z: number,
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
  z2: number,
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
      z2,
    ),
  );
};

export const IsLineInAnyDynamicArea = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): boolean => {
  return Boolean(
    samp.callNative("IsLineInAnyDynamicArea", "ffffff", x1, y1, z1, x2, y2, z2),
  );
};

export const GetDynamicAreasForPoint = (
  x: number,
  y: number,
  z: number,
): number[] => {
  const [areas] = samp.callNative(
    "GetDynamicAreasForPoint",
    "fffAi",
    x,
    y,
    z,
    GetNumberDynamicAreasForPoint(x, y, z),
  ) as [number[]];
  return areas;
};

export const GetNumberDynamicAreasForPoint = (
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNative("GetNumberDynamicAreasForPoint", "fff", x, y, z);
};

export const GetDynamicAreasForLine = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): number[] => {
  const [areas] = samp.callNative(
    "GetDynamicAreasForLine",
    "ffffffAi",
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    GetNumberDynamicAreasForLine(x1, y1, z1, x2, y2, z2),
  ) as [number[]];
  return areas;
};

export const GetNumberDynamicAreasForLine = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): number => {
  return samp.callNative(
    "GetNumberDynamicAreasForLine",
    "ffffff",
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
  );
};

export const AttachDynamicAreaToObject = (
  areaId: number,
  objectId: number,
  type = StreamerObjectTypes.DYNAMIC,
  playerId = 0xffff,
  offsetX = 0.0,
  offsetY = 0.0,
  offsetZ = 0.0,
): number => {
  return samp.callNative(
    "AttachDynamicAreaToObject",
    "iiiifff",
    areaId,
    objectId,
    type,
    playerId,
    offsetX,
    offsetY,
    offsetZ,
  );
};

export const AttachDynamicAreaToPlayer = (
  areaId: number,
  playerId: number,
  offsetX = 0.0,
  offsetY = 0.0,
  offsetZ = 0.0,
): number => {
  return samp.callNative(
    "AttachDynamicAreaToPlayer",
    "iifff",
    areaId,
    playerId,
    offsetX,
    offsetY,
    offsetZ,
  );
};

export const AttachDynamicAreaToVehicle = (
  areaId: number,
  vehicleId: number,
  offsetX = 0.0,
  offsetY = 0.0,
  offsetZ = 0.0,
): number => {
  return samp.callNative(
    "AttachDynamicAreaToVehicle",
    "iifff",
    areaId,
    vehicleId,
    offsetX,
    offsetY,
    offsetZ,
  );
};

export const ToggleDynAreaSpectateMode = (
  areaId: number,
  toggle: boolean,
): number => {
  return samp.callNative("ToggleDynAreaSpectateMode", "ii", areaId, toggle);
};

export const IsToggleDynAreaSpectateMode = (areaId: number): boolean => {
  return Boolean(samp.callNative("IsToggleDynAreaSpectateMode", "i", areaId));
};
