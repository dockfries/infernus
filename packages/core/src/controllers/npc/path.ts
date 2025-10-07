import { NPCMoveSpeedEnum, NPCMoveTypeEnum } from "core/enums/npc";
import { npcPathPool } from "core/utils/pools";

export class NpcPath {
  private _id: number = -1;

  get id() {
    return this._id;
  }

  constructor(pathId?: number) {
    if (typeof pathId !== "undefined") {
      if (npcPathPool.has(pathId)) {
        return npcPathPool.get(pathId)!;
      }
      this._id = pathId;
    } else {
      this._id = samp.callNative("NPC_CreatePath", "") as number;
    }
  }

  destroy() {
    const ret = !!samp.callNative("NPC_DestroyPath", "i", this._id);
    if (ret) {
      this._id = -1;
      npcPathPool.delete(this._id);
    }
    return ret;
  }
  addPoint(x: number, y: number, z: number, stopRange: number) {
    return !!samp.callNative(
      "NPC_AddPointToPath",
      "iffff",
      this._id,
      x,
      y,
      z,
      stopRange,
    );
  }
  removePoint(pointIndex: number) {
    return !!samp.callNative(
      "NPC_RemovePointFromPath",
      "ii",
      this._id,
      pointIndex,
    );
  }
  clear() {
    return !!samp.callNative("NPC_ClearPath", "i", this._id);
  }
  getPointCount() {
    return samp.callNative("NPC_GetPathPointCount", "i", this._id) as number;
  }
  getPoint(pointIndex: number) {
    const [x, y, z, stopRange, ret]: number[] = samp.callNative(
      "NPC_GetPathPoint",
      "ii",
      this._id,
      pointIndex,
    );
    return { x, y, z, stopRange, ret };
  }
  isValid() {
    return NpcPath.isValid(this._id);
  }
  getCurrentPointIndex() {
    return samp.callNative(
      "NPC_GetCurrentPathPointIndex",
      "i",
      this._id,
    ) as number;
  }
  move(
    moveType = NPCMoveTypeEnum.JOG,
    moveSpeed: number = NPCMoveSpeedEnum.AUTO,
    reversed = false,
  ) {
    return !!samp.callNative(
      "NPC_MoveByPath",
      "iiifi",
      this._id,
      this._id,
      moveType,
      moveSpeed,
      reversed,
    );
  }
  hasPointInRadius(x: number, y: number, z: number, radius: number) {
    return !!samp.callNative(
      "NPC_HasPathPointInRange",
      "iiffff",
      this._id,
      this._id,
      x,
      y,
      z,
      radius,
    );
  }
  static destroyAll() {
    const ret = !!samp.callNative("NPC_DestroyAllPath", "");
    if (ret) {
      npcPathPool.clear();
    }
    return ret;
  }
  static getCount() {
    return samp.callNative("NPC_GetPathCount", "") as number;
  }
  static isValid(pathId: number) {
    return !!samp.callNative("NPC_IsValidPath", "i", pathId);
  }
  static getInstance(id: number) {
    return npcPathPool.get(id);
  }
  static getInstances() {
    return [...npcPathPool.values()];
  }
}
