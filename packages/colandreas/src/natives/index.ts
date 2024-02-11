import { MAX_MULTICAST_SIZE } from "../definitions";

export function init() {
  return Boolean(samp.callNative("CA_Init", ""));
}

export function removeBuilding(
  modelId: number,
  x: number,
  y: number,
  z: number,
  radius: number
) {
  return Boolean(
    samp.callNative("CA_RemoveBuilding", "iffff", modelId, x, y, z, radius)
  );
}

export function restoreBuilding(
  modelId: number,
  x: number,
  y: number,
  z: number,
  radius: number
) {
  return Boolean(
    samp.callNative("CA_RestoreBuilding", "iffff", modelId, x, y, z, radius)
  );
}

export function rayCastLine(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, result] = samp.callNative(
    "CA_RayCastLine",
    "ffffffFFF",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { result, x, y, z };
}

export function rayCastLineID(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, result] = samp.callNative(
    "CA_RayCastLineID",
    "ffffffFFF",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { result, x, y, z };
}

export function rayCastLineExtraID(
  type: number,
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, result] = samp.callNative(
    "CA_RayCastLineExtraID",
    "iffffffFFF",
    type,
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { result, x, y, z };
}

export function rayCastMultiLine(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number,
  size = MAX_MULTICAST_SIZE
) {
  const [x, y, z, dist, modelIds, result] = samp.callNative(
    "CA_RayCastMultiLine",
    "ffffffVVVVAi",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ,
    size
  ) as [number[], number[], number[], number[], number[], number];

  const len = result > 0 ? result : 0;

  return {
    collisions: result,
    x: x.slice(0, len),
    y: y.slice(0, len),
    z: z.slice(0, len),
    dist: dist.slice(0, len),
    modelIds: modelIds.slice(0, len),
  };
}

export function rayCastLineAngle(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, rx, ry, rz, result] = samp.callNative(
    "CA_RayCastLineAngle",
    "ffffffFFFFFF",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { result, x, y, z, rx, ry, rz };
}

export function rayCastReflectionVector(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, nx, ny, nz, result] = samp.callNative(
    "CA_RayCastReflectionVector",
    "ffffffFFFFFF",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { result, x, y, z, nx, ny, nz };
}

export function rayCastLineNormal(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, nx, ny, nz, result] = samp.callNative(
    "CA_RayCastLineNormal",
    "ffffffFFFFFF",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { result, x, y, z, nx, ny, nz };
}

export function contactTest(
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number
) {
  return Boolean(
    samp.callNative("CA_ContactTest", "iffffff", modelId, x, y, z, rx, ry, rz)
  );
}

export function eulerToQuat(rx: number, ry: number, rz: number) {
  const [x, y, z, w] = samp.callNative(
    "CA_EulerToQuat",
    "fffFFFF",
    rx,
    ry,
    rz
  ) as number[];
  return { x, y, z, w };
}

export function quatToEuler(x: number, y: number, z: number, w: number) {
  const [rx, ry, rz] = samp.callNative(
    "CA_QuatToEuler",
    "ffff",
    x,
    y,
    z,
    w
  ) as number[];
  return { rx, ry, rz };
}

export function getModelBoundingSphere(modelId: number) {
  const [offX, offY, offZ, radius, result] = samp.callNative(
    "CA_GetModelBoundingSphere",
    "iFFFF",
    modelId
  ) as number[];

  if (!result) return null;

  return { offX, offY, offZ, radius };
}

export function getModelBoundingBox(modelId: number) {
  const [minX, minY, minZ, maxX, maxY, maxZ, result] = samp.callNative(
    "CA_GetModelBoundingBox",
    "iFFFFFF",
    modelId
  ) as number[];

  if (!result) return null;

  return { minX, minY, minZ, maxX, maxY, maxZ };
}

export function rayCastLineEx(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, rx, ry, rz, rw, cx, cy, cz, result] = samp.callNative(
    "CA_RayCastLineEx",
    "ffffffFFFFFFFFFF",
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ
  ) as number[];

  if (!result) return null;

  return { x, y, z, rx, ry, rz, rw, cx, cy, cz };
}

export function rayCastLineAngleEx(
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
) {
  const [x, y, z, rx, ry, rz, ocx, ocy, ocz, orx, ory, orz, result] =
    samp.callNative(
      "CA_RayCastLineAngleEx",
      "ffffffFFFFFFFFFFFF",
      startX,
      startY,
      startZ,
      endX,
      endY,
      endZ
    ) as number[];

  if (!result) return null;

  return { x, y, z, rx, ry, rz, ocx, ocy, ocz, orx, ory, orz };
}

export function loadFromDff(newId: number, dffFileName: string) {
  return samp.callNative("CA_LoadFromDff", "is", newId, dffFileName) as number;
}
