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
      this._id = ObjectMp.__inject__CreateObject(
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
        throw new Error(
          "[ObjectMp]: Unable to create object, maximum has been reached",
        );

      objectMpPool.set(this._id, this);
      return this;
    }

    const playerId = this.getPlayerId();
    if (playerId === InvalidEnum.PLAYER_ID) return this;

    const player = this.getPlayer()!;

    this._id = ObjectMp.__inject__CreatePlayerObject(
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
        ObjectMp.__inject__DestroyObject(this.id);
      }
      objectMpPool.delete(this.id);
    } else {
      const playerId = this.getPlayerId()!;

      if (playerId === InvalidEnum.PLAYER_ID) return this;

      const player = this.getPlayer()!;

      if (!INTERNAL_FLAGS.skip) {
        ObjectMp.__inject__DestroyPlayerObject(playerId, this.id);
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
        return ObjectMp.__inject__GetObjectModel(this.id);
      }
      return ObjectMp.__inject__GetPlayerObjectModel(
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
      return ObjectMp.__inject__GetObjectPos(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectPos(this.getPlayerId(), this.id);
  }

  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set position before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__SetObjectPos(this.id, x, y, z);
    }
    return ObjectMp.__inject__SetPlayerObjectPos(
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
      return ObjectMp.__inject__GetObjectRot(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectRot(this.getPlayerId(), this.id);
  }

  setRot(rx: number, ry: number, rz: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set rotation before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__SetObjectRot(this.id, rx, ry, rz);
    }
    return ObjectMp.__inject__SetPlayerObjectRot(
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
      return ObjectMp.__inject__MoveObject(this.id, x, y, z, speed, rx, ry, rz);
    }
    return ObjectMp.__inject__MovePlayerObject(
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
      return ObjectMp.__inject__StopObject(this.id);
    }
    return ObjectMp.__inject__StopPlayerObject(this.getPlayerId(), this.id);
  }

  isMoving(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__IsObjectMoving(this.id);
    }
    return ObjectMp.__inject__IsPlayerObjectMoving(this.getPlayerId(), this.id);
  }

  attachCamera(player?: Player): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      if (!player) {
        throw new Error("[ObjectMp]: Cannot attachCamera without player");
      }
      return ObjectMp.__inject__AttachCameraToObject(player.id, this.id);
    }
    return ObjectMp.__inject__AttachCameraToPlayerObject(
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
      return ObjectMp.__inject__AttachObjectToObject(
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
      return ObjectMp.__inject__AttachPlayerObjectToObject(
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
      return ObjectMp.__inject__AttachObjectToPlayer(
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
    return ObjectMp.__inject__AttachPlayerObjectToPlayer(
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
      return ObjectMp.__inject__AttachObjectToVehicle(
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
    return ObjectMp.__inject__AttachPlayerObjectToVehicle(
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
      return ObjectMp.__inject__BeginObjectEditing(player.id, this.id);
    }
    return ObjectMp.__inject__BeginPlayerObjectEditing(player.id, this.id);
  }

  isMaterialUsed(materialIndex: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__IsObjectMaterialSlotUsed(
        this.id,
        materialIndex,
      );
    }
    return ObjectMp.__inject__IsPlayerObjectMaterialSlotUsed(
      this.getPlayerId(),
      this.id,
      materialIndex,
    );
  }

  getMaterial(materialIndex: number) {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to get material before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__GetObjectMaterial(this.id, materialIndex);
    }
    return ObjectMp.__inject__GetPlayerObjectMaterial(
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
      return ObjectMp.__inject__SetObjectMaterial(
        this.id,
        materialIndex,
        modelId,
        txdName,
        textureName,
        rgba(materialColor),
      );
    }
    return ObjectMp.__inject__SetPlayerObjectMaterial(
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
      const id = ObjectMp.__inject__GetPlayerCameraTargetObject(player.id);
      if (id === InvalidEnum.OBJECT_ID) return;
      return objectMpPool.get(id);
    }
    const id = ObjectMp.__inject__GetPlayerCameraTargetPlayerObject(player.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getPlayersInstances()
      .map(([, o]) => o)
      .flat()
      .find((o) => o.id === id);
  }

  setNoCameraCollision(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__SetObjectNoCameraCollision(this.id);
    }
    return ObjectMp.__inject__SetPlayerObjectNoCameraCollision(
      this.getPlayerId(),
      this.id,
    );
  }

  isNoCameraCol(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__IsObjectNoCameraCol(this.id);
    }
    return ObjectMp.__inject__IsPlayerObjectNoCameraCol(
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
      return ObjectMp.__inject__GetObjectDrawDistance(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectDrawDistance(
      this.getPlayerId(),
      this.id,
    );
  }

  setMoveSpeed(speed: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__SetObjectMoveSpeed(this.id, speed);
    }
    return ObjectMp.__inject__SetPlayerObjectMoveSpeed(
      this.getPlayerId(),
      this.id,
      speed,
    );
  }

  getMoveSpeed() {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return ObjectMp.__inject__GetObjectMoveSpeed(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectMoveSpeed(
      this.getPlayerId(),
      this.id,
    );
  }

  getMovingTargetPos() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__GetObjectMovingTargetPos(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectMovingTargetPos(
      this.getPlayerId(),
      this.id,
    );
  }

  getSyncRotation() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__GetObjectSyncRotation(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectSyncRotation(
      this.getPlayerId(),
      this.id,
    );
  }

  getAttachedOffset() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__GetObjectAttachedOffset(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectAttachedOffset(
      this.getPlayerId(),
      this.id,
    );
  }

  getTarget() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__GetObjectTarget(this.id);
    }
    return ObjectMp.__inject__GetPlayerObjectTarget(
      this.getPlayerId(),
      this.id,
    );
  }

  static isValid(objectId: number, playerId?: number) {
    if (playerId === InvalidEnum.PLAYER_ID) return false;
    return typeof playerId === "undefined"
      ? ObjectMp.__inject__IsValidObject(objectId)
      : ObjectMp.__inject__IsValidPlayerObject(playerId, objectId);
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

  static __inject__CreateObject = o.CreateObject;
  static __inject__CreatePlayerObject = o.CreatePlayerObject;
  static __inject__DestroyObject = o.DestroyObject;
  static __inject__DestroyPlayerObject = o.DestroyPlayerObject;
  static __inject__SetObjectMaterialText = SetObjectMaterialText;
  static __inject__SetPlayerObjectMaterialText = SetPlayerObjectMaterialText;
  static __inject__SetObjectNoCameraCollision = o.SetObjectNoCameraCollision;
  static __inject__SetPlayerObjectNoCameraCollision =
    o.SetPlayerObjectNoCameraCollision;
  static __inject__IsObjectNoCameraCol = o.IsObjectNoCameraCol;
  static __inject__IsPlayerObjectNoCameraCol = o.IsPlayerObjectNoCameraCol;
  static __inject__GetObjectDrawDistance = o.GetObjectDrawDistance;
  static __inject__GetPlayerObjectDrawDistance = o.GetPlayerObjectDrawDistance;
  static __inject__SetObjectMoveSpeed = o.SetObjectMoveSpeed;
  static __inject__SetPlayerObjectMoveSpeed = o.SetPlayerObjectMoveSpeed;
  static __inject__GetObjectMoveSpeed = o.GetObjectMoveSpeed;
  static __inject__GetPlayerObjectMoveSpeed = o.GetPlayerObjectMoveSpeed;
  static __inject__GetObjectMovingTargetPos = o.GetObjectMovingTargetPos;
  static __inject__GetPlayerObjectMovingTargetPos =
    o.GetPlayerObjectMovingTargetPos;
  static __inject__GetObjectSyncRotation = o.GetObjectSyncRotation;
  static __inject__GetPlayerObjectSyncRotation = o.GetPlayerObjectSyncRotation;
  static __inject__GetObjectAttachedOffset = o.GetObjectAttachedOffset;
  static __inject__GetPlayerObjectAttachedOffset =
    o.GetPlayerObjectAttachedOffset;
  static __inject__GetObjectTarget = o.GetObjectTarget;
  static __inject__GetPlayerObjectTarget = o.GetPlayerObjectTarget;
  static __inject__IsValidObject = o.IsValidObject;
  static __inject__IsValidPlayerObject = o.IsValidPlayerObject;
  static __inject__GetPlayerCameraTargetObject = o.GetPlayerCameraTargetObject;
  static __inject__GetPlayerCameraTargetPlayerObject =
    o.GetPlayerCameraTargetPlayerObject;
  static __inject__GetObjectModel = o.GetObjectModel;
  static __inject__GetPlayerObjectModel = o.GetPlayerObjectModel;
  static __inject__GetObjectPos = o.GetObjectPos;
  static __inject__GetPlayerObjectPos = o.GetPlayerObjectPos;
  static __inject__GetObjectRot = o.GetObjectRot;
  static __inject__GetPlayerObjectRot = o.GetPlayerObjectRot;
  static __inject__SetObjectPos = o.SetObjectPos;
  static __inject__SetPlayerObjectPos = o.SetPlayerObjectPos;
  static __inject__SetObjectRot = o.SetObjectRot;
  static __inject__SetPlayerObjectRot = o.SetPlayerObjectRot;
  static __inject__MoveObject = o.MoveObject;
  static __inject__MovePlayerObject = o.MovePlayerObject;
  static __inject__SetObjectMaterial = o.SetObjectMaterial;
  static __inject__SetPlayerObjectMaterial = o.SetPlayerObjectMaterial;
  static __inject__StopObject = o.StopObject;
  static __inject__StopPlayerObject = o.StopPlayerObject;
  static __inject__IsObjectMoving = o.IsObjectMoving;
  static __inject__IsPlayerObjectMoving = o.IsPlayerObjectMoving;
  static __inject__AttachCameraToObject = o.AttachCameraToObject;
  static __inject__AttachCameraToPlayerObject = o.AttachCameraToPlayerObject;
  static __inject__AttachObjectToPlayer = o.AttachObjectToPlayer;
  static __inject__AttachObjectToObject = o.AttachObjectToObject;
  static __inject__AttachPlayerObjectToObject = o.AttachPlayerObjectToObject;
  static __inject__AttachPlayerObjectToPlayer = o.AttachPlayerObjectToPlayer;
  static __inject__AttachObjectToVehicle = o.AttachObjectToVehicle;
  static __inject__AttachPlayerObjectToVehicle = o.AttachPlayerObjectToVehicle;
  static __inject__BeginObjectEditing = o.BeginObjectEditing;
  static __inject__BeginPlayerObjectEditing = o.BeginPlayerObjectEditing;
  static __inject__EndObjectEditing = o.EndObjectEditing;
  static __inject__GetObjectMaterial = o.GetObjectMaterial;
  static __inject__GetPlayerObjectMaterial = o.GetPlayerObjectMaterial;
  static __inject__IsObjectMaterialSlotUsed = o.IsObjectMaterialSlotUsed;
  static __inject__IsPlayerObjectMaterialSlotUsed =
    o.IsPlayerObjectMaterialSlotUsed;
}
