import type { IDynamicObject } from "@infernus/core";
import { DynamicObject, StreamerMiscellaneous } from "@infernus/core";
import {
  createObject,
  destroyObject,
  getObjectExtraID,
  isValidObject,
  setObjectExtraID,
  setObjectPos,
  setObjectRot,
} from "./natives/inner";
import { INVALID_CA_ID, MAX_CA_OBJECTS } from "./defines";

export class CA_Object {
  private static pool: Set<CA_Object> = new Set();
  private collisionID = INVALID_CA_ID;
  private objectInstance: DynamicObject | null = null;

  constructor(obj: IDynamicObject, dc = false, newObject = true) {
    if (CA_Object.pool.size < MAX_CA_OBJECTS) {
      if (newObject) {
        this.objectInstance = new DynamicObject(obj).create()!;
      }

      const colId = createObject(obj.modelId, obj.x, obj.y, obj.z, obj.rx, obj.ry, obj.rz, dc);

      if (dc) this.collisionID = colId;

      CA_Object.pool.add(this);
    }
  }

  destroy() {
    if (CA_Object.pool.has(this)) {
      CA_Object.pool.delete(this);
    }

    if (this.objectInstance && this.objectInstance.isValid()) {
      this.objectInstance.destroy();
      this.objectInstance = null;
    }

    const prevId = this.collisionID;
    if (prevId !== INVALID_CA_ID) {
      destroyObject(prevId);
      this.collisionID = INVALID_CA_ID;
    }

    return prevId;
  }

  static destroyAll() {
    CA_Object.pool.forEach((o) => o.destroy());
    CA_Object.pool.clear();
  }

  setPos(x: number, y: number, z: number) {
    if (!this.isValid() || !this.objectInstance?.isValid()) return INVALID_CA_ID;
    this.objectInstance.setPos(x, y, z);
    return setObjectPos(this.collisionID, x, y, z);
  }

  setRot(rx: number, ry: number, rz: number) {
    if (!this.isValid() || !this.objectInstance?.isValid()) return INVALID_CA_ID;
    this.objectInstance.setRot(rx, ry, rz);
    return setObjectRot(this.collisionID, rx, ry, rz);
  }

  setExtraID(type: number, data: number) {
    if (!this.isValid()) return INVALID_CA_ID;
    return setObjectExtraID(this.collisionID, type, data);
  }

  getExtraID(type: number) {
    if (!this.isValid()) return INVALID_CA_ID;
    return getObjectExtraID(this.collisionID, type);
  }

  isValid() {
    if (this.collisionID <= INVALID_CA_ID) return false;
    return isValidObject(this.collisionID);
  }

  getCollisionID() {
    if (!isValidObject(this.collisionID)) return -2;
    return this.collisionID;
  }

  getObjectId() {
    if (!isValidObject(this.collisionID)) return -2;
    return this.objectInstance?.id || StreamerMiscellaneous.INVALID_ID;
  }
}
