import { InvalidEnum } from "core/enums";
import type { IDynamicObject } from "core/interfaces";
import type { Vehicle } from "core/controllers/vehicle";
import type { Player } from "core/controllers/player";
import { rgba } from "core/utils/colorUtils";
import {
  GetDynamicObjectMaterialText,
  SetDynamicObjectMaterialText,
} from "core/utils/helperUtils";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { streamerFlag } from "../flag";
import { dynamicObjectPool } from "./pool";

export class DynamicObject {
  static readonly objects = dynamicObjectPool;

  private sourceInfo: IDynamicObject;
  private _id = -1;
  get id(): number {
    return this._id;
  }

  constructor(object: IDynamicObject) {
    this.sourceInfo = object;
  }

  create(): this {
    if (this.id !== -1)
      throw new Error("[StreamerObject]: Unable to create object again");
    let {
      streamDistance,
      drawDistance: drawDistance,
      worldId,
      interiorId: interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { modelId: modelId, x, y, z, rx, ry, rz, extended } = this.sourceInfo;

    streamDistance ??= s.StreamerDistances.OBJECT_SD;
    drawDistance ??= s.StreamerDistances.OBJECT_DD;
    priority ??= 0;

    if (extended) {
      if (typeof worldId === "number") worldId = [-1];
      else worldId ??= [-1];
      if (typeof interiorId === "number") interiorId = [-1];
      else interiorId ??= [-1];
      if (typeof playerId === "number") playerId = [-1];
      else playerId ??= [-1];
      if (typeof areaId === "number") areaId = [-1];
      else areaId ??= [-1];

      this._id = s.CreateDynamicObjectEx(
        modelId,
        x,
        y,
        z,
        rx,
        ry,
        rz,
        streamDistance,
        drawDistance,
        worldId,
        interiorId,
        playerId,
        areaId,
        priority,
      );
    } else {
      if (Array.isArray(worldId)) worldId = -1;
      else worldId ??= -1;
      if (Array.isArray(interiorId)) interiorId = -1;
      else interiorId ??= -1;
      if (Array.isArray(playerId)) playerId = -1;
      else playerId ??= -1;
      if (Array.isArray(areaId)) areaId = -1;
      else areaId ??= -1;

      this._id = s.CreateDynamicObject(
        modelId,
        x,
        y,
        z,
        rx,
        ry,
        rz,
        worldId,
        interiorId,
        playerId,
        streamDistance,
        drawDistance,
        areaId,
        priority,
      );
    }

    DynamicObject.objects.set(this._id, this);
    return this;
  }

  destroy(): this {
    if (this.id === -1 && !streamerFlag.skip)
      throw new Error(
        "[StreamerObject]: Unable to destroy the object before create",
      );
    if (!streamerFlag.skip) s.DestroyDynamicObject(this.id);
    DynamicObject.objects.delete(this.id);
    this._id = -1;
    return this;
  }

  isValid(): boolean {
    if (streamerFlag.skip && this.id !== -1) return true;
    return s.IsValidDynamicObject(this.id);
  }

  getModel() {
    return this.sourceInfo.modelId;
  }

  getPos() {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Cannot get position before create");
    return s.GetDynamicObjectPos(this.id);
  }

  setPos(x: number, y: number, z: number): number {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Cannot set position before create");
    return s.SetDynamicObjectPos(this.id, x, y, z);
  }

  getRot() {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Cannot get rotation before create");
    return s.GetDynamicObjectRot(this.id);
  }

  setRot(rx: number, ry: number, rz: number): number {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Cannot set rotation before create");
    return s.SetDynamicObjectRot(this.id, rx, ry, rz);
  }

  move(
    x: number,
    y: number,
    z: number,
    speed: number,
    rx = -1000,
    ry = -1000,
    rz = -1000,
  ): number {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Cannot start moving before create");
    if (speed < 0) {
      throw new Error("[StreamerObject]: speed must not be less than 0");
    }
    if (speed > 120 * 1000)
      throw new Error(
        "[StreamerObject]: speed more than 120 seconds, warn if it's not intentional",
      );
    if (this.isMoving()) this.stop();
    return s.MoveDynamicObject(this.id, x, y, z, speed, rx, ry, rz);
  }

  stop(): number {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Cannot stop moving before create");
    return s.StopDynamicObject(this.id);
  }

  isMoving(): boolean {
    if (this.id === -1) return false;
    return s.IsDynamicObjectMoving(this.id);
  }

  attachCamera(player: Player): number {
    if (this.id === -1 || player.id === -1)
      throw new Error(
        "[StreamerObject]: Cannot attachCamera before both are created",
      );
    return s.AttachCameraToDynamicObject(player.id, this.id);
  }

  attachToObject(
    attachTo: DynamicObject,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    rx: number,
    ry: number,
    rz: number,
    syncRotation = true,
  ): number {
    if (this.id === -1 || attachTo.id === -1)
      throw new Error(
        "[StreamerObject]: Cannot attachToObject before both are created",
      );
    return s.AttachDynamicObjectToObject(
      this.id,
      attachTo.id,
      offsetX,
      offsetY,
      offsetZ,
      rx,
      ry,
      rz,
      syncRotation,
    );
  }

  attachToPlayer(
    player: Player,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    rx: number,
    ry: number,
    rz: number,
  ): number {
    if (this.id === -1 || player.id === -1)
      throw new Error(
        "[StreamerObject]: Cannot attachToPlayer before both are created",
      );
    return s.AttachDynamicObjectToPlayer(
      this.id,
      player.id,
      offsetX,
      offsetY,
      offsetZ,
      rx,
      ry,
      rz,
    );
  }

  attachToVehicle(
    vehicle: Vehicle,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    rx: number,
    ry: number,
    rz: number,
  ): number {
    if (this.id === -1 || vehicle.id === -1)
      throw new Error(
        "[StreamerObject]: Cannot attachToVehicle before both are created",
      );
    return s.AttachDynamicObjectToVehicle(
      this.id,
      vehicle.id,
      offsetX,
      offsetY,
      offsetZ,
      rx,
      ry,
      rz,
    );
  }

  edit(player: Player): number {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Unable to edit before create");
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

  getMaterial(materialIndex: number, txdName: string, textureName: string) {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Unable to get material before create");
    return s.GetDynamicObjectMaterial(
      this.id,
      materialIndex,
      txdName,
      textureName,
    );
  }

  setMaterial(
    materialIndex: number,
    modelId: number,
    txdName: string,
    textureName: string,
    materialColor: string | number = "#000",
  ): number {
    if (this.id === -1)
      throw new Error("[StreamerObject]: Unable to set material before create");
    return s.SetDynamicObjectMaterial(
      this.id,
      materialIndex,
      modelId,
      txdName,
      textureName,
      rgba(materialColor),
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
      throw new Error(
        "[StreamerObject]: Unable to get material text before create",
      );
    return GetDynamicObjectMaterialText(
      this.id,
      materialIndex,
      this.sourceInfo.charset || "utf8",
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
    fontColor: string | number = "#fff",
    backColor: string | number = "#000",
    textAlignment = 0,
  ): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerObject]: Unable to set material text before create",
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
      rgba(fontColor),
      rgba(backColor),
      textAlignment,
    );
  }

  getPlayerCameraTarget(player: Player) {
    const dynId = s.GetPlayerCameraTargetDynObject(player.id);
    if (dynId === InvalidEnum.OBJECT_ID) return;
    return DynamicObject.objects.get(dynId);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerObject]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.OBJECT,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.OBJECT, this.id);
  }
  setNoCameraCollision() {
    return s.SetDynamicObjectNoCameraCol(this.id);
  }
  getNoCameraCollision() {
    return s.GetDynamicObjectNoCameraCol(this.id);
  }
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(
      player,
      s.StreamerItemTypes.OBJECT,
      update,
    );
  }
  static hideForPlayer(player: Player, z = -50000) {
    Streamer.updateEx(player, 0, 0, z);
    return this.togglePlayerUpdate(player, false);
  }
  static showForPlayer(player: Player, z = -50000) {
    const pos = player.getPos();
    if (pos) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }
  static getInstance(id: number) {
    return this.objects.get(id);
  }
  static getInstances() {
    return [...this.objects.values()];
  }
}
