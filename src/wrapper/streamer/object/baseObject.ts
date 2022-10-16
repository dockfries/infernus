import { InvalidEnum } from "@/enums";
import type { IDynamicObject } from "@/interfaces";
import type { BaseVehicle } from "@/controllers/vehicle";
import type { BasePlayer } from "@/controllers/player";
import { logger } from "@/logger";
import { objectBus, objectHooks } from "./objectBus";
import { rgba } from "@/utils/colorUtils";
import {
  GetDynamicObjectMaterialText,
  SetDynamicObjectMaterialText,
} from "@/utils/helperUtils";
import {
  AttachCameraToDynamicObject,
  AttachDynamicObjectToObject,
  AttachDynamicObjectToPlayer,
  AttachDynamicObjectToVehicle,
  CreateDynamicObject,
  CreateDynamicObjectEx,
  DestroyDynamicObject,
  EditDynamicObject,
  GetDynamicObjectMaterial,
  GetDynamicObjectPos,
  GetDynamicObjectRot,
  GetPlayerCameraTargetDynObject,
  IsDynamicObjectMaterialTextUsed,
  IsDynamicObjectMaterialUsed,
  IsDynamicObjectMoving,
  IsValidDynamicObject,
  MaterialTextSizes,
  MoveDynamicObject,
  RemoveDynamicObjectMaterial,
  RemoveDynamicObjectMaterialText,
  SetDynamicObjectMaterial,
  SetDynamicObjectPos,
  SetDynamicObjectRot,
  StopDynamicObject,
  StreamerDistances,
  StreamerItemTypes,
} from "omp-wrapper-streamer";
import { Streamer } from "../common";

export class DynamicObject {
  private sourceInfo: IDynamicObject;
  private _id = -1;
  public get id(): number {
    return this._id;
  }

  constructor(object: IDynamicObject) {
    this.sourceInfo = object;
  }

  public create(): void | this {
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

    streamdistance ??= StreamerDistances.OBJECT_SD;
    drawdistance ??= StreamerDistances.OBJECT_DD;
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

      this._id = CreateDynamicObjectEx(
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

      this._id = CreateDynamicObject(
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

    objectBus.emit(objectHooks.created, this);
    return this;
  }

  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to destroy the object before create"
      );
    DestroyDynamicObject(this.id);
    objectBus.emit(objectHooks.destroyed, this);
    return this;
  }

  public isValid(): boolean {
    return IsValidDynamicObject(this.id);
  }

  public getPos() {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot get position before create");
    return GetDynamicObjectPos(this.id);
  }

  public setPos(x: number, y: number, z: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot set position before create");
    return SetDynamicObjectPos(this.id, x, y, z);
  }

  public getRot() {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot get rotation before create");
    return GetDynamicObjectRot(this.id);
  }

  public setRot(rx: number, ry: number, rz: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot set rotation before create");
    return SetDynamicObjectRot(this.id, rx, ry, rz);
  }

  public move(
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
    return MoveDynamicObject(this.id, x, y, z, speed, rx, ry, rz);
  }

  public stop(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot stop moving before create");
    return StopDynamicObject(this.id);
  }

  public isMoving(): boolean {
    if (this.id === -1) return false;
    return IsDynamicObjectMoving(this.id);
  }

  public attachCamera<P extends BasePlayer>(player: P): void | number {
    if (this.id === -1 || player.id === -1)
      return logger.warn(
        "[StreamerObject]: Cannot attachCamera before both are created"
      );
    return AttachCameraToDynamicObject(player.id, this.id);
  }

  public attachToObject<O extends DynamicObject>(
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
    return AttachDynamicObjectToObject(
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

  public attachToPlayer<P extends BasePlayer>(
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
    return AttachDynamicObjectToPlayer(
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

  public attachToVehicle<V extends BaseVehicle>(
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
    return AttachDynamicObjectToVehicle(
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

  public edit<P extends BasePlayer>(player: P): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Unable to edit before create");
    player.cancelEdit();
    return EditDynamicObject(player.id, this.id);
  }

  public isMaterialUsed(materialIndex: number): boolean {
    if (this.id === -1) return false;
    return IsDynamicObjectMaterialUsed(this.id, materialIndex);
  }

  public removeMaterial(materialIndex: number): number {
    if (this.id === -1) return 0;
    if (!this.isMaterialUsed(materialIndex)) return 0;
    return RemoveDynamicObjectMaterial(this.id, materialIndex);
  }

  public getMaterial(
    materialIndex: number,
    txdname: string,
    texturename: string
  ) {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to get material before create"
      );
    return GetDynamicObjectMaterial(
      this.id,
      materialIndex,
      txdname,
      texturename
    );
  }

  public setMaterial(
    materialindex: number,
    modelid: number,
    txdname: string,
    texturename: string,
    materialcolor = "#000"
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to set material before create"
      );
    return SetDynamicObjectMaterial(
      this.id,
      materialindex,
      modelid,
      txdname,
      texturename,
      rgba(materialcolor)
    );
  }

  public isMaterialTextUsed(materialIndex: number): boolean {
    if (this.id === -1) return false;
    return IsDynamicObjectMaterialTextUsed(this.id, materialIndex);
  }

  public removeMaterialText(materialIndex: number) {
    if (!this.isMaterialTextUsed(materialIndex)) return 0;
    return RemoveDynamicObjectMaterialText(this.id, materialIndex);
  }

  public getMaterialText(materialIndex: number) {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to get material text before create"
      );
    return GetDynamicObjectMaterialText(
      this.id,
      materialIndex,
      this.sourceInfo.charset
    );
  }

  public setMaterialText(
    charset: string = this.sourceInfo.charset,
    materialIndex: number,
    text: string,
    materialSize: number = MaterialTextSizes.SIZE_256x128,
    fontFace = "Arial",
    fontSize = 24,
    bold = 1,
    fontColor = "#fff",
    backColor = "#000",
    textAlignment = 0
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to set material text before create"
      );
    this.sourceInfo.charset = charset;
    return SetDynamicObjectMaterialText(
      charset,
      this.id,
      materialIndex,
      text,
      materialSize,
      fontFace,
      fontSize,
      bold,
      rgba(fontColor),
      rgba(backColor),
      textAlignment
    );
  }

  public getPlayerCameraTarget<P extends BasePlayer, O extends DynamicObject>(
    player: P,
    objMap: Map<number, O>
  ): void | O {
    const dynId = GetPlayerCameraTargetDynObject(player.id);
    if (dynId === InvalidEnum.OBJECT_ID) return;
    return objMap.get(dynId);
  }
  public toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerObject]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.OBJECT,
      this.id,
      toggle
    );
  }
  public isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.OBJECT, this.id);
  }
}
