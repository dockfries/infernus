import type { IDynamicObject } from "@infernus/core";
import { DynamicObject } from "@infernus/core";
import {
  createObject,
  destroyObject,
  getObjectExtraID,
  isValidObject,
  setObjectExtraID,
  setObjectPos,
  setObjectRot,
} from "./natives/inner";
import { MAX_CA_OBJECTS } from "./definitions";

const CA_Objects: CA_Object[] = [];

export class CA_Object {
  collisionID = -1;
  objectInstance: DynamicObject | null = null;

  constructor(obj: IDynamicObject, dc = false, newObject = true) {
    if (CA_Objects.length < MAX_CA_OBJECTS) {
      if (newObject) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.objectInstance = new DynamicObject(obj).create()!;
      }

      const colId = createObject(
        obj.modelId,
        obj.x,
        obj.y,
        obj.z,
        obj.rx,
        obj.ry,
        obj.rz,
        dc,
      );

      if (dc) this.collisionID = colId;

      CA_Objects.push(this);
    }
  }

  destroy() {
    if (!this.objectInstance || this.objectInstance.id === -1) return -1;

    if (this.collisionID !== -1) {
      destroyObject(this.collisionID);
      this.collisionID = -1;
    }

    this.objectInstance.destroy();
    this.objectInstance = null;

    CA_Objects.splice(CA_Objects.indexOf(this), 1);
    return 1;
  }

  static destroyAll() {
    CA_Objects.forEach((o) => o.objectInstance?.isValid() && o.destroy());
  }

  setPos(x: number, y: number, z: number) {
    if (
      !this.objectInstance ||
      this.objectInstance.id === -1 ||
      this.collisionID === -1
    )
      return -1;

    this.objectInstance.setPos(x, y, z);
    setObjectPos(this.collisionID, x, y, z);
    return 1;
  }

  setRot(rx: number, ry: number, rz: number) {
    if (
      !this.objectInstance ||
      this.objectInstance.id === -1 ||
      this.collisionID === -1
    )
      return -1;
    this.objectInstance.setRot(rx, ry, rz);
    setObjectRot(this.collisionID, rx, ry, rz);
    return 1;
  }

  setExtraID(type: number, data: number) {
    if (this.collisionID === -1) return -1;
    return setObjectExtraID(this.collisionID, type, data);
  }

  getExtraID(type: number) {
    if (this.collisionID === -1) return -1;
    return getObjectExtraID(this.collisionID, type);
  }

  isValid() {
    if (this.collisionID === -1) return false;
    return isValidObject(this.collisionID);
  }

  // CA_GetCollisionObjectID = this.collisionID
  // CA_GetObjectType always use streamer dynamic object
  // CA_GetObjectID = this.objectInstance.id
}
