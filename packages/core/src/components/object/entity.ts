import { InvalidEnum, LimitsEnum, MaterialTextSizes } from "core/enums";
import { IObjectMp } from "core/interfaces";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { objectMpPool, playerObjectPool } from "core/utils/pools";
import { rgba } from "core/utils/color";
import * as o from "core/wrapper/native";
import type { Player } from "../player/entity";
import { Vehicle } from "../vehicle/entity";
import {
  GetObjectMaterialText,
  SetObjectMaterialText,
  GetPlayerObjectMaterialText,
  SetPlayerObjectMaterialText,
} from "core/utils/helper";

export class ObjectMp {
  private sourceInfo: IObjectMp | null = null;
  private _id: number = InvalidEnum.OBJECT_ID;
  private _player: Player | null = null;
  get id(): number {
    return this._id;
  }

  constructor(objectOrId: IObjectMp | number, player?: Player) {
    if (typeof objectOrId === "number") {
      if (player) {
        this._player = player;
      }

      const obj = ObjectMp.getInstance(objectOrId, player);
      if (obj) return obj;

      this._id = objectOrId;
      if (this.isGlobal()) {
        objectMpPool.set(this._id, this);
      }
    } else {
      this.sourceInfo = objectOrId;
      this._player = null;
    }
  }

  create(): this {
    if (!this.sourceInfo)
      throw new Error("[ObjectMp]: Unable to create with only id");
    if (this.id !== InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to create again");

    const {
      modelId,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      drawDistance = 0.0,
    } = this.sourceInfo;

    if (this.isGlobal()) {
      this._id = ObjectMp.__inject__.CreateObject(
        modelId,
        x,
        y,
        z,
        rx,
        ry,
        rz,
        drawDistance,
      );

      if (
        this.id === InvalidEnum.OBJECT_ID ||
        ObjectMp.getInstances().length === LimitsEnum.MAX_OBJECTS
      )
        throw new Error("[ObjectMp]: Unable to create object");

      objectMpPool.set(this._id, this);
      return this;
    }

    const playerId = this.getPlayerId();
    if (playerId === InvalidEnum.PLAYER_ID) return this;

    const player = this.getPlayer()!;

    this._id = ObjectMp.__inject__.CreatePlayerObject(
      playerId,
      modelId,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      drawDistance,
    );
    if (
      this.id === InvalidEnum.OBJECT_ID ||
      ObjectMp.getInstances(player).length === LimitsEnum.MAX_OBJECTS
    )
      throw new Error("[ObjectMp]: Unable to create player object");

    if (!playerObjectPool.has(player)) {
      playerObjectPool.set(player, new Map());
    }
    playerObjectPool.get(this.getPlayer()!)!.set(this.id, this);
    return this;
  }

  destroy(): this {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to destroy the object before create");

    if (this.isGlobal()) {
      if (!INTERNAL_FLAGS.skip) {
        ObjectMp.__inject__.DestroyObject(this.id);
      }
      objectMpPool.delete(this.id);
    } else {
      const playerId = this.getPlayerId()!;

      if (playerId === InvalidEnum.PLAYER_ID) return this;

      const player = this.getPlayer()!;

      if (!INTERNAL_FLAGS.skip) {
        ObjectMp.__inject__.DestroyPlayerObject(playerId, this.id);
      }

      if (playerObjectPool.has(player)) {
        const perPlayerMap = playerObjectPool.get(player)!;
        perPlayerMap.delete(this.id);

        if (perPlayerMap.size === 0) {
          playerObjectPool.delete(player);
        }
      }
    }

    this._id = InvalidEnum.OBJECT_ID;
    return this;
  }

  isGlobal() {
    const player = this.sourceInfo ? this.sourceInfo.player : this._player;
    return !player;
  }

  isPlayer() {
    return !this.isGlobal();
  }

  getPlayer() {
    if (this._player) return this._player;
    if (this.sourceInfo && this.sourceInfo.player) {
      return this.sourceInfo.player;
    }
    return null;
  }

  getPlayerId() {
    const player = this.getPlayer();
    return player ? player.id : InvalidEnum.PLAYER_ID;
  }

  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.OBJECT_ID) return true;
    if (this.isGlobal()) {
      return ObjectMp.isValid(this.id);
    }
    return ObjectMp.isValid(this.id, this.getPlayerId());
  }

  getModel() {
    if (!this.sourceInfo) {
      if (this.isGlobal()) {
        return ObjectMp.__inject__.GetObjectModel(this.id);
      }
      return ObjectMp.__inject__.GetPlayerObjectModel(
        this.getPlayerId(),
        this.id,
      );
    }
    return this.sourceInfo.modelId;
  }

  getPos() {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot get position before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectPos(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectPos(this.getPlayerId(), this.id);
  }

  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set position before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.SetObjectPos(this.id, x, y, z);
    }
    return ObjectMp.__inject__.SetPlayerObjectPos(
      this.getPlayerId(),
      this.id,
      x,
      y,
      z,
    );
  }

  getRot() {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot get rotation before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectRot(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectRot(this.getPlayerId(), this.id);
  }

  setRot(rx: number, ry: number, rz: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set rotation before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.SetObjectRot(this.id, rx, ry, rz);
    }
    return ObjectMp.__inject__.SetPlayerObjectRot(
      this.getPlayerId(),
      this.id,
      rx,
      ry,
      rz,
    );
  }

  move(
    x: number,
    y: number,
    z: number,
    speed: number,
    rx: number,
    ry: number,
    rz: number,
  ): number {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot start moving before create");
    if (speed < 0) {
      throw new Error("[ObjectMp]: speed must not be less than 0");
    }
    if (speed > 120 * 1000)
      throw new Error(
        "[ObjectMp]: speed more than 120 seconds, warn if it's not intentional",
      );
    if (this.isMoving()) this.stop();
    if (this.isGlobal()) {
      return ObjectMp.__inject__.MoveObject(
        this.id,
        x,
        y,
        z,
        speed,
        rx,
        ry,
        rz,
      );
    }
    return ObjectMp.__inject__.MovePlayerObject(
      this.getPlayerId(),
      this.id,
      x,
      y,
      z,
      speed,
      rx,
      ry,
      rz,
    );
  }

  stop(): number {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot stop moving before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.StopObject(this.id);
    }
    return ObjectMp.__inject__.StopPlayerObject(this.getPlayerId(), this.id);
  }

  isMoving(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.IsObjectMoving(this.id);
    }
    return ObjectMp.__inject__.IsPlayerObjectMoving(
      this.getPlayerId(),
      this.id,
    );
  }

  attachCamera(player?: Player): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      if (!player) {
        throw new Error("[ObjectMp]: Cannot attachCamera without player");
      }
      return ObjectMp.__inject__.AttachCameraToObject(player.id, this.id);
    }
    return ObjectMp.__inject__.AttachCameraToPlayerObject(
      this.getPlayerId(),
      this.id,
    );
  }

  attachToObject(
    attachTo: ObjectMp,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    rx: number,
    ry: number,
    rz: number,
    syncRotation = true,
  ): boolean {
    if (
      this.id === InvalidEnum.OBJECT_ID ||
      attachTo.id === InvalidEnum.OBJECT_ID
    )
      throw new Error(
        "[ObjectMp]: Cannot attachToObject before both are created",
      );

    if (this.isGlobal() && attachTo.isGlobal()) {
      return ObjectMp.__inject__.AttachObjectToObject(
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
    } else if (!this.isGlobal() && !attachTo.isGlobal()) {
      return ObjectMp.__inject__.AttachPlayerObjectToObject(
        this.getPlayerId(),
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
    throw new Error(
      "[ObjectMp]: Cannot attachToObject with global and player object",
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
  ): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      if (!player) {
        throw new Error("[ObjectMp]: Cannot attachCamera without player");
      }
      return ObjectMp.__inject__.AttachObjectToPlayer(
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
    return ObjectMp.__inject__.AttachPlayerObjectToPlayer(
      this.getPlayerId(),
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
  ): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.AttachObjectToVehicle(
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
    return ObjectMp.__inject__.AttachPlayerObjectToVehicle(
      this.getPlayerId(),
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

  edit(player: Player): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to edit before create");
    player.endObjectEditing();
    if (this.isGlobal()) {
      return ObjectMp.__inject__.BeginObjectEditing(player.id, this.id);
    }
    return ObjectMp.__inject__.BeginPlayerObjectEditing(player.id, this.id);
  }

  isMaterialUsed(materialIndex: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.IsObjectMaterialSlotUsed(
        this.id,
        materialIndex,
      );
    }
    return ObjectMp.__inject__.IsPlayerObjectMaterialSlotUsed(
      this.getPlayerId(),
      this.id,
      materialIndex,
    );
  }

  getMaterial(materialIndex: number) {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to get material before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectMaterial(this.id, materialIndex);
    }
    return ObjectMp.__inject__.GetPlayerObjectMaterial(
      this.getPlayerId(),
      this.id,
      materialIndex,
    );
  }

  setMaterial(
    materialIndex: number,
    modelId: number,
    txdName: string,
    textureName: string,
    materialColor: string | number = "#000",
  ): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to set material before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.SetObjectMaterial(
        this.id,
        materialIndex,
        modelId,
        txdName,
        textureName,
        rgba(materialColor),
      );
    }
    return ObjectMp.__inject__.SetPlayerObjectMaterial(
      this.getPlayerId(),
      this.id,
      materialIndex,
      modelId,
      txdName,
      textureName,
      rgba(materialColor),
    );
  }

  getMaterialText(materialIndex: number) {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to get material text before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectMaterialText(
        this.id,
        materialIndex,
        this.sourceInfo?.charset || "utf8",
      );
    }
    return ObjectMp.__inject__.GetPlayerObjectMaterialText(
      this.getPlayerId(),
      this.id,
      materialIndex,
      this.sourceInfo?.charset || "utf8",
    );
  }

  setMaterialText(
    charset = this.sourceInfo?.charset,
    text: string,
    materialIndex: number,
    materialSize: number = MaterialTextSizes.SIZE_256x128,
    fontFace = "Arial",
    fontSize = 24,
    bold = true,
    fontColor: string | number = "#fff",
    backColor: string | number = "#000",
    textAlignment = 0,
  ): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to set material text before create");
    if (this.sourceInfo) {
      this.sourceInfo.charset = charset;
    }
    if (this.isGlobal()) {
      return SetObjectMaterialText(
        charset || "utf8",
        this.id,
        text,
        materialIndex,
        materialSize,
        fontFace,
        fontSize,
        bold,
        rgba(fontColor),
        rgba(backColor),
        textAlignment,
      );
    }
    return SetPlayerObjectMaterialText(
      charset || "utf8",
      this.getPlayerId(),
      this.id,
      text,
      materialIndex,
      materialSize,
      fontFace,
      fontSize,
      bold,
      rgba(fontColor),
      rgba(backColor),
      textAlignment,
    );
  }

  static getPlayerCameraTarget(player: Player, isGlobal = true) {
    if (isGlobal) {
      const id = ObjectMp.__inject__.GetPlayerCameraTargetObject(player.id);
      if (id === InvalidEnum.OBJECT_ID) return;
      return objectMpPool.get(id);
    }
    const id = ObjectMp.__inject__.GetPlayerCameraTargetPlayerObject(player.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getPlayersInstances()
      .map(([, o]) => o)
      .flat()
      .find((o) => o.id === id);
  }

  setNoCameraCollision(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.SetObjectNoCameraCollision(this.id);
    }
    return ObjectMp.__inject__.SetPlayerObjectNoCameraCollision(
      this.getPlayerId(),
      this.id,
    );
  }

  isNoCameraCol(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.IsObjectNoCameraCol(this.id);
    }
    return ObjectMp.__inject__.IsPlayerObjectNoCameraCol(
      this.getPlayerId(),
      this.id,
    );
  }

  hasCameraCollision() {
    return !this.isNoCameraCol();
  }

  getDrawDistance(): number {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectDrawDistance(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectDrawDistance(
      this.getPlayerId(),
      this.id,
    );
  }

  setMoveSpeed(speed: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.SetObjectMoveSpeed(this.id, speed);
    }
    return ObjectMp.__inject__.SetPlayerObjectMoveSpeed(
      this.getPlayerId(),
      this.id,
      speed,
    );
  }

  getMoveSpeed() {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectMoveSpeed(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectMoveSpeed(
      this.getPlayerId(),
      this.id,
    );
  }

  getMovingTargetPos() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectMovingTargetPos(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectMovingTargetPos(
      this.getPlayerId(),
      this.id,
    );
  }

  getSyncRotation() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectSyncRotation(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectSyncRotation(
      this.getPlayerId(),
      this.id,
    );
  }

  getAttachedOffset() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectAttachedOffset(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectAttachedOffset(
      this.getPlayerId(),
      this.id,
    );
  }

  getTarget() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.GetObjectTarget(this.id);
    }
    return ObjectMp.__inject__.GetPlayerObjectTarget(
      this.getPlayerId(),
      this.id,
    );
  }

  static isValid(objectId: number, playerId?: number) {
    if (playerId === InvalidEnum.PLAYER_ID) return false;
    return typeof playerId === "undefined"
      ? ObjectMp.__inject__.IsValidObject(objectId)
      : ObjectMp.__inject__.IsValidPlayerObject(playerId, objectId);
  }

  static getInstance(objectId: number, player?: Player) {
    if (!player) return objectMpPool.get(objectId);

    if (player.id === InvalidEnum.PLAYER_ID) return;
    return playerObjectPool.get(player)?.get(objectId);
  }

  static getInstances(player?: Player) {
    if (!player) return [...objectMpPool.values()];

    if (player.id === InvalidEnum.PLAYER_ID) return [];
    return [...(playerObjectPool.get(player)?.values() || [])];
  }

  static getPlayersInstances(): [Player, ObjectMp[]][] {
    return Array.from(playerObjectPool.entries()).map(([player, objects]) => {
      return [player, Array.from(objects.values())];
    });
  }

  static __inject__ = {
    CreateObject: o.CreateObject,
    CreatePlayerObject: o.CreatePlayerObject,
    DestroyObject: o.DestroyObject,
    DestroyPlayerObject: o.DestroyPlayerObject,
    SetObjectMaterialText: SetObjectMaterialText,
    SetPlayerObjectMaterialText: SetPlayerObjectMaterialText,
    SetObjectNoCameraCollision: o.SetObjectNoCameraCollision,
    SetPlayerObjectNoCameraCollision: o.SetPlayerObjectNoCameraCollision,
    IsObjectNoCameraCol: o.IsObjectNoCameraCol,
    IsPlayerObjectNoCameraCol: o.IsPlayerObjectNoCameraCol,
    GetObjectDrawDistance: o.GetObjectDrawDistance,
    GetPlayerObjectDrawDistance: o.GetPlayerObjectDrawDistance,
    SetObjectMoveSpeed: o.SetObjectMoveSpeed,
    SetPlayerObjectMoveSpeed: o.SetPlayerObjectMoveSpeed,
    GetObjectMoveSpeed: o.GetObjectMoveSpeed,
    GetPlayerObjectMoveSpeed: o.GetPlayerObjectMoveSpeed,
    GetObjectMovingTargetPos: o.GetObjectMovingTargetPos,
    GetPlayerObjectMovingTargetPos: o.GetPlayerObjectMovingTargetPos,
    GetObjectSyncRotation: o.GetObjectSyncRotation,
    GetPlayerObjectSyncRotation: o.GetPlayerObjectSyncRotation,
    GetObjectAttachedOffset: o.GetObjectAttachedOffset,
    GetPlayerObjectAttachedOffset: o.GetPlayerObjectAttachedOffset,
    GetObjectTarget: o.GetObjectTarget,
    GetPlayerObjectTarget: o.GetPlayerObjectTarget,
    IsValidObject: o.IsValidObject,
    IsValidPlayerObject: o.IsValidPlayerObject,
    GetPlayerCameraTargetObject: o.GetPlayerCameraTargetObject,
    GetPlayerCameraTargetPlayerObject: o.GetPlayerCameraTargetPlayerObject,
    GetObjectModel: o.GetObjectModel,
    GetPlayerObjectModel: o.GetPlayerObjectModel,
    GetObjectPos: o.GetObjectPos,
    GetPlayerObjectPos: o.GetPlayerObjectPos,
    GetObjectRot: o.GetObjectRot,
    GetPlayerObjectRot: o.GetPlayerObjectRot,
    SetObjectPos: o.SetObjectPos,
    SetPlayerObjectPos: o.SetPlayerObjectPos,
    SetObjectRot: o.SetObjectRot,
    SetPlayerObjectRot: o.SetPlayerObjectRot,
    MoveObject: o.MoveObject,
    MovePlayerObject: o.MovePlayerObject,
    SetObjectMaterial: o.SetObjectMaterial,
    SetPlayerObjectMaterial: o.SetPlayerObjectMaterial,
    StopObject: o.StopObject,
    StopPlayerObject: o.StopPlayerObject,
    IsObjectMoving: o.IsObjectMoving,
    IsPlayerObjectMoving: o.IsPlayerObjectMoving,
    AttachCameraToObject: o.AttachCameraToObject,
    AttachCameraToPlayerObject: o.AttachCameraToPlayerObject,
    AttachObjectToPlayer: o.AttachObjectToPlayer,
    AttachObjectToObject: o.AttachObjectToObject,
    AttachPlayerObjectToObject: o.AttachPlayerObjectToObject,
    AttachPlayerObjectToPlayer: o.AttachPlayerObjectToPlayer,
    AttachObjectToVehicle: o.AttachObjectToVehicle,
    AttachPlayerObjectToVehicle: o.AttachPlayerObjectToVehicle,
    BeginObjectEditing: o.BeginObjectEditing,
    BeginPlayerObjectEditing: o.BeginPlayerObjectEditing,
    EndObjectEditing: o.EndObjectEditing,
    GetObjectMaterial: o.GetObjectMaterial,
    GetPlayerObjectMaterial: o.GetPlayerObjectMaterial,
    IsObjectMaterialSlotUsed: o.IsObjectMaterialSlotUsed,
    IsPlayerObjectMaterialSlotUsed: o.IsPlayerObjectMaterialSlotUsed,
    GetObjectMaterialText,
    GetPlayerObjectMaterialText,
  };
}
