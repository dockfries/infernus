import { InvalidEnum } from "@/enums";
import type { IDynamicObject } from "@/interfaces";
import type { BaseVehicle } from "@/controllers/vehicle";
import type { BasePlayer } from "@/controllers/player";
import { logger } from "@/logger";
import * as ows from "omp-wrapper-streamer";
import { objectBus, objectHooks } from "./objectBus";

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

    streamdistance ??= ows.StreamerDistances.OBJECT_SD;
    drawdistance ??= ows.StreamerDistances.OBJECT_DD;
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

      this._id = ows.CreateDynamicObjectEx(
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

      this._id = ows.CreateDynamicObject(
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
    ows.DestroyDynamicObject(this.id);
    objectBus.emit(objectHooks.destroyed, this);
    return this;
  }

  public static isValid(object: DynamicObject): boolean {
    return ows.IsValidDynamicObject(object.id);
  }

  public getPos() {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot get position before create");
    return ows.GetDynamicObjectPos(this.id);
  }

  public setPos(x: number, y: number, z: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot set position before create");
    return ows.SetDynamicObjectPos(this.id, x, y, z);
  }

  public getRot() {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot get rotation before create");
    return ows.GetDynamicObjectRot(this.id);
  }

  public setRot(rx: number, ry: number, rz: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot set rotation before create");
    return ows.SetDynamicObjectRot(this.id, rx, ry, rz);
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
    return ows.MoveDynamicObject(this.id, x, y, z, speed, rx, ry, rz);
  }

  public stop(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerObject]: Cannot stop moving before create");
    return ows.StopDynamicObject(this.id);
  }

  public isMoving(): boolean {
    if (this.id === -1) return false;
    return ows.IsDynamicObjectMoving(this.id);
  }

  public attachCamera<P extends BasePlayer>(player: P): void | number {
    if (this.id === -1 || player.id === -1)
      return logger.warn(
        "[StreamerObject]: Cannot attachCamera before both are created"
      );
    return ows.AttachCameraToDynamicObject(player.id, this.id);
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
    return ows.AttachDynamicObjectToObject(
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
    return ows.AttachDynamicObjectToPlayer(
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
    return ows.AttachDynamicObjectToVehicle(
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
    return ows.EditDynamicObject(player.id, this.id);
  }

  public isMaterialUsed(materialIndex: number): boolean {
    if (this.id === -1) return false;
    return ows.IsDynamicObjectMaterialUsed(this.id, materialIndex);
  }

  public removeMaterial(materialIndex: number): number {
    if (this.id === -1) return 0;
    if (!this.isMaterialUsed(materialIndex)) return 0;
    return ows.RemoveDynamicObjectMaterial(this.id, materialIndex);
  }

  // public getMaterial(materialIndex: number) {
  //   // need i18n
  //   // return ows.GetDynamicObjectMaterialText(this.id, materialIndex);
  // }

  // need i18n
  // ows.SetDynamicObjectMaterial(objectid, materialindex, modelid, const txdname[], const texturename[], materialcolor = 0)

  public isMaterialTextUsed(materialIndex: number): boolean {
    if (this.id === -1) return false;
    return ows.IsDynamicObjectMaterialTextUsed(this.id, materialIndex);
  }

  public removeMaterialText(materialIndex: number) {
    if (!this.isMaterialTextUsed(materialIndex)) return 0;
    return ows.RemoveDynamicObjectMaterialText(this.id, materialIndex);
  }

  // need i18n
  // ows.GetDynamicObjectMaterialText(objectid, materialindex, text[], &materialsize, fontface[], &fontsize, &bold, &fontcolor, &backcolor, &textalignment, maxtext = sizeof text, maxfontface = sizeof fontface)

  // need i18n
  // ows.SetDynamicObjectMaterialText(objectid, materialindex, const text[], materialsize = OBJECT_MATERIAL_SIZE_256x128, const fontface[] = "Arial", fontsize = 24, bold = 1, fontcolor = 0xFFFFFFFF, backcolor = 0, textalignment = 0)

  public getPlayerCameraTarget<P extends BasePlayer, O extends DynamicObject>(
    player: P,
    objMap: Map<number, O>
  ): void | O {
    const dynId = ows.GetPlayerCameraTargetDynObject(player.id);
    if (dynId === InvalidEnum.OBJECT_ID) return;
    return objMap.get(dynId);
  }
}
