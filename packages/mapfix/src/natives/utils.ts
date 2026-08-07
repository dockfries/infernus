import { DynamicObject, ObjectMp } from "@infernus/core";

export function mf_CreateObject(
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  drawDistance: number,
) {
  const obj = new DynamicObject({
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    worldId: -1,
    interiorId: -1,
    playerId: -1,
    drawDistance,
  });
  obj.create();
  return obj;
}

export function mf_SetObjectMaterial(
  obj: DynamicObject | ObjectMp,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor?: string | number | undefined,
) {
  return obj.setMaterial(materialIndex, modelId, txdName, textureName, materialColor);
}

export function mf_DestroyObject(obj: DynamicObject | ObjectMp) {
  return obj.isValid() && obj.destroy();
}

export function mf_CreateFloorObject(
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  drawDistance: number,
) {
  const obj = new ObjectMp({
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    drawDistance,
  });
  obj.create();
  return obj;
}

export const mf_DestroyFloorObject = mf_DestroyObject;
