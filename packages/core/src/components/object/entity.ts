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

    const { modelId, x, y, z, rx, ry, rz, drawDistance } = this.sourceInfo;

    if (this.isGlobal()) {
      this._id = o.CreateObject(modelId, x, y, z, rx, ry, rz, drawDistance);

      if (
        this.id === InvalidEnum.OBJECT_ID ||
        ObjectMp.getInstances().length === LimitsEnum.MAX_OBJECTS
      )
        throw new Error(
          "[ObjectMp]: Unable to create object, maximum has been reached",
        );

      objectMpPool.set(this._id, this);
      return this;
    }

    const playerId = this.getPlayerId();
    if (playerId === InvalidEnum.PLAYER_ID) return this;

    const player = this.getPlayer()!;

    this._id = o.CreatePlayerObject(
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
      throw new Error(
        "[ObjectMp]: Unable to create player object, maximum has been reached",
      );

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
        o.DestroyObject(this.id);
      }
      objectMpPool.delete(this.id);
    } else {
      const playerId = this.getPlayerId()!;

      if (playerId === InvalidEnum.PLAYER_ID) return this;

      const player = this.getPlayer()!;

      if (!INTERNAL_FLAGS.skip) {
        o.DestroyPlayerObject(playerId, this.id);
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
    return typeof player === "undefined";
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
        return o.GetObjectModel(this.id);
      }
      return o.GetPlayerObjectModel(this.getPlayerId(), this.id);
    }
    return this.sourceInfo.modelId;
  }

  getPos() {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot get position before create");
    if (this.isGlobal()) {
      return o.GetObjectPos(this.id);
    }
    return o.GetPlayerObjectPos(this.getPlayerId(), this.id);
  }

  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set position before create");
    if (this.isGlobal()) {
      return o.SetObjectPos(this.id, x, y, z);
    }
    return o.SetPlayerObjectPos(this.getPlayerId(), this.id, x, y, z);
  }

  getRot() {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot get rotation before create");
    if (this.isGlobal()) {
      return o.GetObjectRot(this.id);
    }
    return o.GetPlayerObjectRot(this.getPlayerId(), this.id);
  }

  setRot(rx: number, ry: number, rz: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set rotation before create");
    if (this.isGlobal()) {
      return o.SetObjectRot(this.id, rx, ry, rz);
    }
    return o.SetPlayerObjectRot(this.getPlayerId(), this.id, rx, ry, rz);
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
      return o.MoveObject(this.id, x, y, z, speed, rx, ry, rz);
    }
    return o.MovePlayerObject(
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
      return o.StopObject(this.id);
    }
    return o.StopPlayerObject(this.getPlayerId(), this.id);
  }

  isMoving(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return o.IsObjectMoving(this.id);
    }
    return o.IsPlayerObjectMoving(this.getPlayerId(), this.id);
  }

  attachCamera(player?: Player): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      if (!player) {
        throw new Error("[ObjectMp]: Cannot attachCamera without player");
      }
      return o.AttachCameraToObject(player.id, this.id);
    }
    return o.AttachCameraToPlayerObject(this.getPlayerId(), this.id);
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
      return o.AttachObjectToObject(
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
      return o.AttachPlayerObjectToObject(
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
      return o.AttachObjectToPlayer(
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
    return o.AttachPlayerObjectToPlayer(
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
      return o.AttachObjectToVehicle(
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
    return o.AttachPlayerObjectToVehicle(
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
      return o.BeginObjectEditing(player.id, this.id);
    }
    return o.BeginPlayerObjectEditing(player.id, this.id);
  }

  isMaterialUsed(materialIndex: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return o.IsObjectMaterialSlotUsed(this.id, materialIndex);
    }
    return o.IsPlayerObjectMaterialSlotUsed(
      this.getPlayerId(),
      this.id,
      materialIndex,
    );
  }

  getMaterial(materialIndex: number) {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to get material before create");
    if (this.isGlobal()) {
      return o.GetObjectMaterial(this.id, materialIndex);
    }
    return o.GetPlayerObjectMaterial(
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
      return o.SetObjectMaterial(
        this.id,
        materialIndex,
        modelId,
        txdName,
        textureName,
        rgba(materialColor),
      );
    }
    return o.SetPlayerObjectMaterial(
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
      return GetObjectMaterialText(
        this.id,
        materialIndex,
        this.sourceInfo?.charset || "utf8",
      );
    }
    return GetPlayerObjectMaterialText(
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
      const id = o.GetPlayerCameraTargetObject(player.id);
      if (id === InvalidEnum.OBJECT_ID) return;
      return objectMpPool.get(id);
    }
    const id = o.GetPlayerCameraTargetPlayerObject(player.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getPlayersInstances()
      .map(([, o]) => o)
      .flat()
      .find((o) => o.id === id);
  }

  setNoCameraCollision(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return o.SetObjectNoCameraCollision(this.id);
    }
    return o.SetPlayerObjectNoCameraCollision(this.getPlayerId(), this.id);
  }

  isNoCameraCol(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return o.IsObjectNoCameraCol(this.id);
    }
    return o.IsPlayerObjectNoCameraCol(this.getPlayerId(), this.id);
  }

  hasCameraCollision() {
    return !this.isNoCameraCol();
  }

  getDrawDistance(): number {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return o.GetObjectDrawDistance(this.id);
    }
    return o.GetPlayerObjectDrawDistance(this.getPlayerId(), this.id);
  }

  setMoveSpeed(speed: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return o.SetObjectMoveSpeed(this.id, speed);
    }
    return o.SetPlayerObjectMoveSpeed(this.getPlayerId(), this.id, speed);
  }

  getMoveSpeed() {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return o.GetObjectMoveSpeed(this.id);
    }
    return o.GetPlayerObjectMoveSpeed(this.getPlayerId(), this.id);
  }

  getMovingTargetPos() {
    if (this.isGlobal()) {
      return o.GetObjectMovingTargetPos(this.id);
    }
    return o.GetPlayerObjectMovingTargetPos(this.getPlayerId(), this.id);
  }

  getSyncRotation() {
    if (this.isGlobal()) {
      return o.GetObjectSyncRotation(this.id);
    }
    return o.GetPlayerObjectSyncRotation(this.getPlayerId(), this.id);
  }

  getAttachedOffset() {
    if (this.isGlobal()) {
      return o.GetObjectAttachedOffset(this.id);
    }
    return o.GetPlayerObjectAttachedOffset(this.getPlayerId(), this.id);
  }

  getTarget() {
    if (this.isGlobal()) {
      return o.GetObjectTarget(this.id);
    }
    return o.GetPlayerObjectTarget(this.getPlayerId(), this.id);
  }

  static isValid(objectId: number, playerId?: number) {
    if (playerId === InvalidEnum.PLAYER_ID) return false;
    return typeof playerId === "undefined"
      ? o.IsValidObject(objectId)
      : o.IsValidPlayerObject(playerId, objectId);
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
}
