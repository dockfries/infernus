export function createObject(
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  add = false
) {
  return samp.callNative(
    "CA_CreateObject",
    "iffffffi",
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    add
  ) as number;
}

export function destroyObject(index: number) {
  return samp.callNative("CA_DestroyObject", "i", index) as number;
}

export function isValidObject(index: number) {
  return samp.callNative("CA_IsValidObject", "i", index) as number;
}

export function setObjectPos(index: number, x: number, y: number, z: number) {
  return Boolean(samp.callNative("CA_SetObjectPos", "ifff", index, x, y, z));
}

export function setObjectRot(
  index: number,
  rx: number,
  ry: number,
  rz: number
) {
  return Boolean(samp.callNative("CA_SetObjectRot", "ifff", index, rx, ry, rz));
}

export function setObjectExtraID(index: number, type: number, data: number) {
  return Boolean(
    samp.callNative("CA_SetObjectExtraID", "iii", index, type, data)
  );
}

export function getObjectExtraID(index: number, type: number) {
  return samp.callNative("CA_GetObjectExtraID", "ii", index, type) as number;
}
