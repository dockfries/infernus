import { npcNodePool } from "core/utils/pools";

export class NpcNode {
  private _id: number = -1;

  get id() {
    return this._id;
  }

  constructor(id: number) {
    this._id = id;
    if (npcNodePool.has(this._id)) {
      return npcNodePool.get(this._id)!;
    }
    npcNodePool.set(this._id, this);
  }

  open() {
    const ret = !!samp.callNative("NPC_OpenNode", "i", this._id);
    if (ret && !npcNodePool.has(this._id)) {
      npcNodePool.set(this._id, this);
    }
  }
  close() {
    const ret = !!samp.callNative("NPC_CloseNode", "i", this._id);
    if (ret) {
      npcNodePool.delete(this._id);
    }
    return ret;
  }
  isOpen() {
    return !!samp.callNative("NPC_IsNodeOpen", "i", this._id);
  }
  getType() {
    return samp.callNative("NPC_GetNodeType", "i", this._id) as number;
  }
  setPoint(pointId: number) {
    return !!samp.callNative("NPC_SetNodePoint", "ii", this._id, pointId);
  }
  getPointPosition() {
    const [x, y, z, ret] = samp.callNative(
      "NPC_GetNodePointPosition",
      "iFFF",
      this._id,
    );
    return {
      x,
      y,
      z,
      ret: !!ret,
    };
  }
  getPointCount() {
    return samp.callNative("NPC_GetNodePointCount", "i", this._id) as number;
  }
  getInfo() {
    const [vehNodes, pedNodes, naviNode, ret] = samp.callNative(
      "NPC_GetNodeInfo",
      "iIII",
      this._id,
    );
    return {
      vehNodes,
      pedNodes,
      naviNode,
      ret: !!ret,
    };
  }
  static getInstance(id: number) {
    return npcNodePool.get(id);
  }
  static getInstances() {
    return [...npcNodePool.values()];
  }
}
