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
      this._id = ObjectMp.__inject__.create(
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

    this._id = ObjectMp.__inject__.createPlayer(
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
      throw new Error("[ObjectMp]: Unable to destroy before create");

    if (this.isGlobal()) {
      if (!INTERNAL_FLAGS.skip) {
        ObjectMp.__inject__.destroy(this.id);
      }
      objectMpPool.delete(this.id);
    } else {
      const playerId = this.getPlayerId()!;

      if (playerId === InvalidEnum.PLAYER_ID) return this;

      const player = this.getPlayer()!;

      if (!INTERNAL_FLAGS.skip) {
        ObjectMp.__inject__.destroyPlayer(playerId, this.id);
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
        return ObjectMp.__inject__.getModel(this.id);
      }
      return ObjectMp.__inject__.getModelPlayer(this.getPlayerId(), this.id);
    }
    return this.sourceInfo.modelId;
  }

  getPos() {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot get position before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getPos(this.id);
    }
    return ObjectMp.__inject__.getPosPlayer(this.getPlayerId(), this.id);
  }

  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set position before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.setPos(this.id, x, y, z);
    }
    return ObjectMp.__inject__.setPosPlayer(
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
      return ObjectMp.__inject__.getRot(this.id);
    }
    return ObjectMp.__inject__.getRotPlayer(this.getPlayerId(), this.id);
  }

  setRot(rx: number, ry: number, rz: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Cannot set rotation before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.setRot(this.id, rx, ry, rz);
    }
    return ObjectMp.__inject__.setRotPlayer(
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
      return ObjectMp.__inject__.move(this.id, x, y, z, speed, rx, ry, rz);
    }
    return ObjectMp.__inject__.movePlayer(
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
      return ObjectMp.__inject__.stop(this.id);
    }
    return ObjectMp.__inject__.stopPlayer(this.getPlayerId(), this.id);
  }

  isMoving(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.isMoving(this.id);
    }
    return ObjectMp.__inject__.isMovingPlayer(this.getPlayerId(), this.id);
  }

  attachCamera(player?: Player): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      if (!player) {
        throw new Error("[ObjectMp]: Cannot attachCamera without player");
      }
      return ObjectMp.__inject__.attachCamera(player.id, this.id);
    }
    return ObjectMp.__inject__.attachCameraPlayer(this.getPlayerId(), this.id);
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
      return ObjectMp.__inject__.attachToObject(
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
      return ObjectMp.__inject__.attachPlayerToObject(
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
      return ObjectMp.__inject__.attachToPlayer(
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
    return ObjectMp.__inject__.attachPlayerToPlayer(
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
      return ObjectMp.__inject__.attachToVehicle(
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
    return ObjectMp.__inject__.attachPlayerToVehicle(
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
      return ObjectMp.__inject__.beginEditing(player.id, this.id);
    }
    return ObjectMp.__inject__.beginEditingPlayer(player.id, this.id);
  }

  isMaterialUsed(materialIndex: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.isMaterialSlotUsed(this.id, materialIndex);
    }
    return ObjectMp.__inject__.isMaterialSlotUsedPlayer(
      this.getPlayerId(),
      this.id,
      materialIndex,
    );
  }

  getMaterial(materialIndex: number) {
    if (this.id === InvalidEnum.OBJECT_ID)
      throw new Error("[ObjectMp]: Unable to get material before create");
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getMaterial(this.id, materialIndex);
    }
    return ObjectMp.__inject__.getMaterialPlayer(
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
      return ObjectMp.__inject__.setMaterial(
        this.id,
        materialIndex,
        modelId,
        txdName,
        textureName,
        rgba(materialColor),
      );
    }
    return ObjectMp.__inject__.setMaterialPlayer(
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
      return ObjectMp.__inject__.getMaterialText(
        this.id,
        materialIndex,
        this.sourceInfo?.charset || "utf8",
      );
    }
    return ObjectMp.__inject__.getMaterialTextPlayer(
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
      const id = ObjectMp.__inject__.getCameraTarget(player.id);
      if (id === InvalidEnum.OBJECT_ID) return;
      return objectMpPool.get(id);
    }
    const id = ObjectMp.__inject__.getCameraTargetPlayer(player.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getPlayersInstances()
      .map(([, o]) => o)
      .flat()
      .find((o) => o.id === id);
  }

  setNoCameraCollision(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.setNoCameraCollision(this.id);
    }
    return ObjectMp.__inject__.setNoCameraCollisionPlayer(
      this.getPlayerId(),
      this.id,
    );
  }

  isNoCameraCol(): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.isNoCameraCol(this.id);
    }
    return ObjectMp.__inject__.isNoCameraColPlayer(this.getPlayerId(), this.id);
  }

  hasCameraCollision() {
    return !this.isNoCameraCol();
  }

  getDrawDistance(): number {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getDrawDistance(this.id);
    }
    return ObjectMp.__inject__.getDrawDistancePlayer(
      this.getPlayerId(),
      this.id,
    );
  }

  setMoveSpeed(speed: number): boolean {
    if (this.id === InvalidEnum.OBJECT_ID) return false;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.setMoveSpeed(this.id, speed);
    }
    return ObjectMp.__inject__.setMoveSpeedPlayer(
      this.getPlayerId(),
      this.id,
      speed,
    );
  }

  getMoveSpeed() {
    if (this.id === InvalidEnum.OBJECT_ID) return 0.0;
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getMoveSpeed(this.id);
    }
    return ObjectMp.__inject__.getMoveSpeedPlayer(this.getPlayerId(), this.id);
  }

  getMovingTargetPos() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getMovingTargetPos(this.id);
    }
    return ObjectMp.__inject__.getMovingTargetPosPlayer(
      this.getPlayerId(),
      this.id,
    );
  }

  getSyncRotation() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getSyncRotation(this.id);
    }
    return ObjectMp.__inject__.getSyncRotationPlayer(
      this.getPlayerId(),
      this.id,
    );
  }

  getAttachedOffset() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getAttachedOffset(this.id);
    }
    return ObjectMp.__inject__.getAttachedOffsetPlayer(
      this.getPlayerId(),
      this.id,
    );
  }

  getTarget() {
    if (this.isGlobal()) {
      return ObjectMp.__inject__.getTarget(this.id);
    }
    return ObjectMp.__inject__.getTargetPlayer(this.getPlayerId(), this.id);
  }

  static isValid(objectId: number, playerId?: number) {
    if (playerId === InvalidEnum.PLAYER_ID) return false;
    return typeof playerId === "undefined"
      ? ObjectMp.__inject__.isValid(objectId)
      : ObjectMp.__inject__.isValidPlayer(playerId, objectId);
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
    create: o.CreateObject,
    createPlayer: o.CreatePlayerObject,
    destroy: o.DestroyObject,
    destroyPlayer: o.DestroyPlayerObject,
    setMaterialText: SetObjectMaterialText,
    setMaterialTextPlayer: SetPlayerObjectMaterialText,
    setNoCameraCollision: o.SetObjectNoCameraCollision,
    setNoCameraCollisionPlayer: o.SetPlayerObjectNoCameraCollision,
    isNoCameraCol: o.IsObjectNoCameraCol,
    isNoCameraColPlayer: o.IsPlayerObjectNoCameraCol,
    getDrawDistance: o.GetObjectDrawDistance,
    getDrawDistancePlayer: o.GetPlayerObjectDrawDistance,
    setMoveSpeed: o.SetObjectMoveSpeed,
    setMoveSpeedPlayer: o.SetPlayerObjectMoveSpeed,
    getMoveSpeed: o.GetObjectMoveSpeed,
    getMoveSpeedPlayer: o.GetPlayerObjectMoveSpeed,
    getMovingTargetPos: o.GetObjectMovingTargetPos,
    getMovingTargetPosPlayer: o.GetPlayerObjectMovingTargetPos,
    getSyncRotation: o.GetObjectSyncRotation,
    getSyncRotationPlayer: o.GetPlayerObjectSyncRotation,
    getAttachedOffset: o.GetObjectAttachedOffset,
    getAttachedOffsetPlayer: o.GetPlayerObjectAttachedOffset,
    getTarget: o.GetObjectTarget,
    getTargetPlayer: o.GetPlayerObjectTarget,
    isValid: o.IsValidObject,
    isValidPlayer: o.IsValidPlayerObject,
    getCameraTarget: o.GetPlayerCameraTargetObject,
    getCameraTargetPlayer: o.GetPlayerCameraTargetPlayerObject,
    getModel: o.GetObjectModel,
    getModelPlayer: o.GetPlayerObjectModel,
    getPos: o.GetObjectPos,
    getPosPlayer: o.GetPlayerObjectPos,
    getRot: o.GetObjectRot,
    getRotPlayer: o.GetPlayerObjectRot,
    setPos: o.SetObjectPos,
    setPosPlayer: o.SetPlayerObjectPos,
    setRot: o.SetObjectRot,
    setRotPlayer: o.SetPlayerObjectRot,
    move: o.MoveObject,
    movePlayer: o.MovePlayerObject,
    setMaterial: o.SetObjectMaterial,
    setMaterialPlayer: o.SetPlayerObjectMaterial,
    stop: o.StopObject,
    stopPlayer: o.StopPlayerObject,
    isMoving: o.IsObjectMoving,
    isMovingPlayer: o.IsPlayerObjectMoving,
    attachCamera: o.AttachCameraToObject,
    attachCameraPlayer: o.AttachCameraToPlayerObject,
    attachToObject: o.AttachObjectToObject,
    attachToPlayer: o.AttachObjectToPlayer,
    attachToVehicle: o.AttachObjectToVehicle,
    attachPlayerToObject: o.AttachPlayerObjectToObject,
    attachPlayerToPlayer: o.AttachPlayerObjectToPlayer,
    attachPlayerToVehicle: o.AttachPlayerObjectToVehicle,
    beginEditing: o.BeginObjectEditing,
    beginEditingPlayer: o.BeginPlayerObjectEditing,
    endEditing: o.EndObjectEditing,
    getMaterial: o.GetObjectMaterial,
    getMaterialPlayer: o.GetPlayerObjectMaterial,
    isMaterialSlotUsed: o.IsObjectMaterialSlotUsed,
    isMaterialSlotUsedPlayer: o.IsPlayerObjectMaterialSlotUsed,
    getMaterialText: GetObjectMaterialText,
    getMaterialTextPlayer: GetPlayerObjectMaterialText,
  };
}
