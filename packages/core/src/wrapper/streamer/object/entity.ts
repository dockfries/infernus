import { InvalidEnum } from "core/enums";
import type { IDynamicObject } from "core/interfaces";
import type { Vehicle } from "core/components/vehicle";
import type { Player } from "core/components/player";
import { rgba } from "core/utils/color";
import {
  GetDynamicObjectMaterial,
  GetDynamicObjectMaterialText,
  SetDynamicObjectMaterialText,
} from "core/utils/helper";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { dynamicObjectPool } from "core/utils/pools";

export class DynamicObject {
  private sourceInfo: IDynamicObject | null = null;
  private _id: number = s.StreamerMiscellaneous.INVALID_ID;
  get id(): number {
    return this._id;
  }

  constructor(objectOrId: IDynamicObject | number) {
    if (typeof objectOrId === "number") {
      const obj = DynamicObject.getInstance(objectOrId);
      if (obj) {
        return obj;
      }
      this._id = objectOrId;
      dynamicObjectPool.set(this._id, this);
    } else {
      this.sourceInfo = objectOrId;
    }
  }

  create(): this {
    if (this.id !== s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[StreamerObject]: Unable to create with only id");
    let {
      streamDistance,
      drawDistance: drawDistance,
      worldId,
      interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { modelId, x, y, z, rx, ry, rz, extended } = this.sourceInfo;

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

      this._id = DynamicObject.__inject__.createEx(
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

      this._id = DynamicObject.__inject__.create(
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

    dynamicObjectPool.set(this._id, this);
    return this;
  }

  destroy(): this {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID && !INTERNAL_FLAGS.skip)
      throw new Error(
        "[StreamerObject]: Unable to destroy object before create",
      );
    if (!INTERNAL_FLAGS.skip) {
      DynamicObject.__inject__.destroy(this.id);
    }
    dynamicObjectPool.delete(this.id);
    this._id = s.StreamerMiscellaneous.INVALID_ID;
    return this;
  }

  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== s.StreamerMiscellaneous.INVALID_ID)
      return true;
    return DynamicObject.isValid(this.id);
  }

  getModel() {
    if (!this.sourceInfo) {
      return Streamer.getIntData(
        s.StreamerItemTypes.OBJECT,
        this._id,
        s.E_STREAMER.MODEL_ID,
      );
    }
    return this.sourceInfo.modelId;
  }

  getPos() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Cannot get position before create");
    return DynamicObject.__inject__.getPos(this.id);
  }

  setPos(x: number, y: number, z: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Cannot set position before create");
    return DynamicObject.__inject__.setPos(this.id, x, y, z);
  }

  getRot() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Cannot get rotation before create");
    return DynamicObject.__inject__.getRot(this.id);
  }

  setRot(rx: number, ry: number, rz: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Cannot set rotation before create");
    return DynamicObject.__inject__.setRot(this.id, rx, ry, rz);
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
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Cannot start moving before create");
    if (speed < 0) {
      throw new Error("[StreamerObject]: speed must not be less than 0");
    }
    if (speed > 120 * 1000)
      throw new Error(
        "[StreamerObject]: speed more than 120 seconds, warn if it's not intentional",
      );
    if (this.isMoving()) this.stop();
    return DynamicObject.__inject__.move(this.id, x, y, z, speed, rx, ry, rz);
  }

  stop(): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Cannot stop moving before create");
    return DynamicObject.__inject__.stop(this.id);
  }

  isMoving(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicObject.__inject__.isMoving(this.id);
  }

  attachCamera(player: Player): number {
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      player.id === InvalidEnum.PLAYER_ID
    )
      throw new Error(
        "[StreamerObject]: Cannot attachCamera before both are created",
      );
    return DynamicObject.__inject__.attachCamera(player.id, this.id);
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
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      attachTo.id === s.StreamerMiscellaneous.INVALID_ID
    )
      throw new Error(
        "[StreamerObject]: Cannot attachToObject before both are created",
      );
    return DynamicObject.__inject__.attachToObject(
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
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      player.id === InvalidEnum.PLAYER_ID
    )
      throw new Error(
        "[StreamerObject]: Cannot attachToPlayer before both are created",
      );
    return DynamicObject.__inject__.attachToPlayer(
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
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      vehicle.id === InvalidEnum.VEHICLE_ID
    )
      throw new Error(
        "[StreamerObject]: Cannot attachToVehicle before both are created",
      );
    return DynamicObject.__inject__.attachToVehicle(
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
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Unable to edit before create");
    player.endObjectEditing();
    return DynamicObject.__inject__.edit(player.id, this.id);
  }

  isMaterialUsed(materialIndex: number): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicObject.__inject__.isMaterialUsed(this.id, materialIndex);
  }

  removeMaterial(materialIndex: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return 0;
    if (!this.isMaterialUsed(materialIndex)) return 0;
    return DynamicObject.__inject__.removeMaterial(this.id, materialIndex);
  }

  getMaterial(materialIndex: number) {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Unable to get material before create");
    return DynamicObject.__inject__.getMaterial(this.id, materialIndex);
  }

  setMaterial(
    materialIndex: number,
    modelId: number,
    txdName: string,
    textureName: string,
    materialColor: string | number = "#000",
  ): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerObject]: Unable to set material before create");
    return DynamicObject.__inject__.setMaterial(
      this.id,
      materialIndex,
      modelId,
      txdName,
      textureName,
      rgba(materialColor),
    );
  }

  isMaterialTextUsed(materialIndex: number): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicObject.__inject__.isMaterialTextUsed(this.id, materialIndex);
  }

  removeMaterialText(materialIndex: number) {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return 0;
    if (!this.isMaterialTextUsed(materialIndex)) return 0;
    return DynamicObject.__inject__.removeMaterialText(this.id, materialIndex);
  }

  getMaterialText(materialIndex: number) {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerObject]: Unable to get material text before create",
      );
    return DynamicObject.__inject__.getMaterialText(
      this.id,
      materialIndex,
      this.sourceInfo?.charset || "utf8",
    );
  }

  setMaterialText(
    charset = this.sourceInfo?.charset,
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
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerObject]: Unable to set material text before create",
      );
    if (this.sourceInfo) {
      this.sourceInfo.charset = charset;
    }
    return DynamicObject.__inject__.setMaterialText(
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
    const dynId = DynamicObject.__inject__.getPlayerCameraTarget(player.id);
    if (dynId === s.StreamerMiscellaneous.INVALID_ID) return;
    return dynamicObjectPool.get(dynId);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
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
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.OBJECT, this.id);
  }
  setNoCameraCollision() {
    return DynamicObject.__inject__.setNoCameraCol(this.id);
  }
  getNoCameraCollision() {
    return DynamicObject.__inject__.getNoCameraCol(this.id);
  }
  static isValid = s.IsValidDynamicObject;
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
    if (pos.ret) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }
  static getInstance(id: number) {
    return dynamicObjectPool.get(id);
  }
  static getInstances() {
    return [...dynamicObjectPool.values()];
  }

  static __inject__ = {
    createEx: s.CreateDynamicObjectEx,
    create: s.CreateDynamicObject,
    destroy: s.DestroyDynamicObject,
    getPos: s.GetDynamicObjectPos,
    setPos: s.SetDynamicObjectPos,
    getRot: s.GetDynamicObjectRot,
    setRot: s.SetDynamicObjectRot,
    move: s.MoveDynamicObject,
    stop: s.StopDynamicObject,
    isMoving: s.IsDynamicObjectMoving,
    attachCamera: s.AttachCameraToDynamicObject,
    attachToObject: s.AttachDynamicObjectToObject,
    attachToPlayer: s.AttachDynamicObjectToPlayer,
    attachToVehicle: s.AttachDynamicObjectToVehicle,
    edit: s.EditDynamicObject,
    isMaterialUsed: s.IsDynamicObjectMaterialUsed,
    removeMaterial: s.RemoveDynamicObjectMaterial,
    getMaterial: GetDynamicObjectMaterial,
    setMaterial: s.SetDynamicObjectMaterial,
    isMaterialTextUsed: s.IsDynamicObjectMaterialTextUsed,
    removeMaterialText: s.RemoveDynamicObjectMaterialText,
    getMaterialText: GetDynamicObjectMaterialText,
    setMaterialText: SetDynamicObjectMaterialText,
    getPlayerCameraTarget: s.GetPlayerCameraTargetDynObject,
    setNoCameraCol: s.SetDynamicObjectNoCameraCol,
    getNoCameraCol: s.GetDynamicObjectNoCameraCol,
  };
}
