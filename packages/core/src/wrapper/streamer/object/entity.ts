import { InvalidEnum } from "core/enums";
import type { IDynamicObject } from "core/interfaces";
import type { Vehicle } from "core/controllers/vehicle";
import type { Player } from "core/controllers/player";
import { logger } from "core/logger";
import { rgba } from "core/utils/colorUtils";
import {
  GetDynamicObjectMaterialText,
  SetDynamicObjectMaterialText,
} from "core/utils/helperUtils";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";

export class DynamicObject {
  static readonly objects = new Map<number, DynamicObject>();

  private sourceInfo: IDynamicObject;
  private _id = -1;
  get id(): number {
    return this._id;
  }

  constructor(object: IDynamicObject) {
    this.sourceInfo = object;
  }

  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerObject]: Unable to create object again");
    let {
      streamdistance,
      drawdistance,
      worldid,
      interiorid,
      playerid,
      areaid,
      priority,
    } = this.sourceInfo;
    const { modelid, x, y, z, rx, ry, rz, extended } = this.sourceInfo;

    streamdistance ??= s.StreamerDistances.OBJECT_SD;
    drawdistance ??= s.StreamerDistances.OBJECT_DD;
    priority ??= 0;

    if (extended) {
      if (typeof worldid === "number") worldid = [-1];
      else worldid ??= [-1];
      if (typeof interiorid === "number") interiorid = [-1];
      else interiorid ??= [-1];
      if (typeof playerid === "number") playerid = [-1];
      else playerid ??= [-1];
      if (typeof areaid === "number") areaid = [-1];
      else areaid ??= [-1];

      this._id = s.CreateDynamicObjectEx(
        modelid,
        x,
        y,
        z,
        rx,
        ry,
        rz,
        streamdistance,
        drawdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority
      );
    } else {
      if (Array.isArray(worldid)) worldid = -1;
      else worldid ??= -1;
      if (Array.isArray(interiorid)) interiorid = -1;
      else interiorid ??= -1;
      if (Array.isArray(playerid)) playerid = -1;
      else playerid ??= -1;
      if (Array.isArray(areaid)) areaid = -1;
      else areaid ??= -1;

      this._id = s.CreateDynamicObject(
        modelid,
        x,
        y,
        z,
        rx,
        ry,
        rz,
        worldid,
        interiorid,
        playerid,
        streamdistance,
        drawdistance,
        areaid,
        priority
      );
    }

    DynamicObject.objects.set(this._id, this);
    return this;
  }

  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to destroy the object before create"
      );
    s.DestroyDynamicObject(this.id);
    DynamicObject.objects.delete(this.id);
    return this;
  }

  isValid(): boolean {
    return s.IsValidDynamicObject(this.id);
  }

  getModel() {
    return this.sourceInfo.modelid;
  }

  getPos() {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot get position before create");
    return s.GetDynamicObjectPos(this.id);
  }

  setPos(x: number, y: number, z: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot set position before create");
    return s.SetDynamicObjectPos(this.id, x, y, z);
  }

  getRot() {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot get rotation before create");
    return s.GetDynamicObjectRot(this.id);
  }

  setRot(rx: number, ry: number, rz: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot set rotation before create");
    return s.SetDynamicObjectRot(this.id, rx, ry, rz);
  }

  move(
    x: number,
    y: number,
    z: number,
    speed: number,
    rx = -1000,
    ry = -1000,
    rz = -1000
  ): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot start moving before create");
    if (speed < 0) {
      return logger.warn("[StreamerObject]: speed must not be less than 0");
    }
    if (speed > 120 * 1000)
      logger.warn(
        "[StreamerObject]: speed more than 120 seconds, warn if it's not intentional"
      );
    if (this.isMoving()) this.stop();
    return s.MoveDynamicObject(this.id, x, y, z, speed, rx, ry, rz);
  }

  stop(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot stop moving before create");
    return s.StopDynamicObject(this.id);
  }

  isMoving(): boolean {
    if (this.id === -1) return false;
    return s.IsDynamicObjectMoving(this.id);
  }

  attachCamera<P extends Player>(player: P): void | number {
    if (this.id === -1 || player.id === -1)
      return logger.warn(
        "[StreamerObject]: Cannot attachCamera before both are created"
      );
    return s.AttachCameraToDynamicObject(player.id, this.id);
  }

  attachToObject<O extends DynamicObject>(
    attachto: O,
    offsetx: number,
    offsety: number,
    offsetz: number,
    rx: number,
    ry: number,
    rz: number,
    syncrotation = true
  ): void | number {
    if (this.id === -1 || attachto.id === -1)
      return logger.warn(
        "[StreamerObject]: Cannot attachToObject before both are created"
      );
    return s.AttachDynamicObjectToObject(
      this.id,
      attachto.id,
      offsetx,
      offsety,
      offsetz,
      rx,
      ry,
      rz,
      syncrotation
    );
  }

  attachToPlayer<P extends Player>(
    player: P,
    offsetx: number,
    offsety: number,
    offsetz: number,
    rx: number,
    ry: number,
    rz: number
  ): void | number {
    if (this.id === -1 || player.id === -1)
      return logger.warn(
        "[StreamerObject]: Cannot attachToVehicle before both are created"
      );
    return s.AttachDynamicObjectToPlayer(
      this.id,
      player.id,
      offsetx,
      offsety,
      offsetz,
      rx,
      ry,
      rz
    );
  }

  attachToVehicle<V extends Vehicle>(
    vehicle: V,
    offsetx: number,
    offsety: number,
    offsetz: number,
    rx: number,
    ry: number,
    rz: number
  ): void | number {
    if (this.id === -1 || vehicle.id === -1)
      return logger.warn(
        "[StreamerObject]: Cannot attachToVehicle before both are created"
      );
    return s.AttachDynamicObjectToVehicle(
      this.id,
      vehicle.id,
      offsetx,
      offsety,
      offsetz,
      rx,
      ry,
      rz
    );
  }

  edit<P extends Player>(player: P): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Unable to edit before create");
    player.endObjectEditing();
    return s.EditDynamicObject(player.id, this.id);
  }

  isMaterialUsed(materialIndex: number): boolean {
    if (this.id === -1) return false;
    return s.IsDynamicObjectMaterialUsed(this.id, materialIndex);
  }

  removeMaterial(materialIndex: number): number {
    if (this.id === -1) return 0;
    if (!this.isMaterialUsed(materialIndex)) return 0;
    return s.RemoveDynamicObjectMaterial(this.id, materialIndex);
  }

  getMaterial(materialIndex: number, txdname: string, texturename: string) {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to get material before create"
      );
    return s.GetDynamicObjectMaterial(
      this.id,
      materialIndex,
      txdname,
      texturename
    );
  }

  setMaterial(
    materialindex: number,
    modelid: number,
    txdname: string,
    texturename: string,
    materialcolour = "#000"
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to set material before create"
      );
    return s.SetDynamicObjectMaterial(
      this.id,
      materialindex,
      modelid,
      txdname,
      texturename,
      rgba(materialcolour)
    );
  }

  isMaterialTextUsed(materialIndex: number): boolean {
    if (this.id === -1) return false;
    return s.IsDynamicObjectMaterialTextUsed(this.id, materialIndex);
  }

  removeMaterialText(materialIndex: number) {
    if (!this.isMaterialTextUsed(materialIndex)) return 0;
    return s.RemoveDynamicObjectMaterialText(this.id, materialIndex);
  }

  getMaterialText(materialIndex: number) {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to get material text before create"
      );
    return GetDynamicObjectMaterialText(
      this.id,
      materialIndex,
      this.sourceInfo.charset || "utf8"
    );
  }

  setMaterialText(
    charset = this.sourceInfo.charset,
    materialIndex: number,
    text: string,
    materialSize: number = s.MaterialTextSizes.SIZE_256x128,
    fontFace = "Arial",
    fontSize = 24,
    bold = 1,
    fontColour = "#fff",
    backColour = "#000",
    textAlignment = 0
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to set material text before create"
      );
    this.sourceInfo.charset = charset;
    return SetDynamicObjectMaterialText(
      charset || "utf8",
      this.id,
      materialIndex,
      text,
      materialSize,
      fontFace,
      fontSize,
      bold,
      rgba(fontColour),
      rgba(backColour),
      textAlignment
    );
  }

  getPlayerCameraTarget<P extends Player, O extends DynamicObject>(
    player: P,
    objMap: Map<number, O>
  ): void | O {
    const dynId = s.GetPlayerCameraTargetDynObject(player.id);
    if (dynId === InvalidEnum.OBJECT_ID) return;
    return objMap.get(dynId);
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.OBJECT,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.OBJECT, this.id);
  }

  static getInstance(id: number) {
    return this.objects.get(id);
  }
  static getInstances() {
    return [...this.objects.values()];
  }
}
