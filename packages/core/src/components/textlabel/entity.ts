import { InvalidEnum, LimitsEnum } from "core/enums";
import { textLabelPool, playerTextLabelPool } from "core/utils/pools";
import { ITextLabel } from "core/interfaces";
import { INTERNAL_FLAGS } from "core/utils/flags";
import * as tg from "core/wrapper/native/3dText/global";
import * as tp from "core/wrapper/native/3dText/player";
import { Player } from "../player/entity";
import { Vehicle } from "../vehicle/entity";
import {
  Create3DTextLabel,
  CreatePlayer3DTextLabel,
  Get3DTextLabelText,
  GetPlayer3DTextLabelText,
  Update3DTextLabelText,
  UpdatePlayer3DTextLabelText,
} from "core/utils/helper";

export class TextLabel {
  private sourceInfo: ITextLabel | null = null;
  private _id: number = InvalidEnum._3DTEXT_ID;
  private _player: Player | null = null;
  get id(): number {
    return this._id;
  }

  constructor(textLabelOrId: ITextLabel | number, player?: Player) {
    if (typeof textLabelOrId === "number") {
      if (player) {
        this._player = player;
      }

      const textLabel = TextLabel.getInstance(textLabelOrId, player);
      if (textLabel) return textLabel;

      this._id = textLabelOrId;
      if (this.isGlobal()) {
        textLabelPool.set(this._id, this);
      }
    } else {
      this.sourceInfo = textLabelOrId;
      this._player = null;
    }
  }

  create(): this {
    if (!this.sourceInfo)
      throw new Error("[TextLabel]: Unable to create with only id");
    if (this.id !== InvalidEnum._3DTEXT_ID)
      throw new Error("[TextLabel]: Unable to create again");

    const {
      charset = "utf8",
      text,
      color,
      x,
      y,
      z,
      drawDistance,
      virtualWorld,
      testLOS,
      attachedPlayer,
      attachedVehicle,
    } = this.sourceInfo;

    if (this.isGlobal()) {
      this._id = Create3DTextLabel(
        charset,
        text,
        color,
        x,
        y,
        z,
        drawDistance,
        virtualWorld,
        testLOS,
      );

      if (
        this.id === InvalidEnum._3DTEXT_ID ||
        TextLabel.getInstances().length === LimitsEnum.MAX_3DTEXT_GLOBAL
      )
        throw new Error("[TextLabel]: Unable to create textLabel");

      textLabelPool.set(this._id, this);
      return this;
    }

    const playerId = this.getPlayerId();
    if (playerId === InvalidEnum.PLAYER_ID) return this;

    const player = this.getPlayer()!;

    this._id = CreatePlayer3DTextLabel(
      charset,
      playerId,
      text,
      color,
      x,
      y,
      z,
      drawDistance,
      typeof attachedPlayer === "undefined"
        ? InvalidEnum.PLAYER_ID
        : attachedPlayer.id,
      typeof attachedVehicle === "undefined"
        ? InvalidEnum.VEHICLE_ID
        : attachedVehicle.id,
      testLOS,
    );
    if (
      this.id === InvalidEnum._3DTEXT_ID ||
      TextLabel.getInstances(player).length === LimitsEnum.MAX_3DTEXT_PLAYER
    )
      throw new Error("[TextLabel]: Unable to create playerTextLabel");

    if (!playerTextLabelPool.has(player)) {
      playerTextLabelPool.set(player, new Map());
    }
    playerTextLabelPool.get(this.getPlayer()!)!.set(this.id, this);
    return this;
  }

  destroy(): this {
    if (this.id === InvalidEnum._3DTEXT_ID)
      throw new Error(
        "[TextLabel]: Unable to destroy the textLabel before create",
      );

    if (this.isGlobal()) {
      if (!INTERNAL_FLAGS.skip) {
        TextLabel.__inject__Delete3DTextLabel(this.id);
      }
      textLabelPool.delete(this.id);
    } else {
      const playerId = this.getPlayerId()!;

      if (playerId === InvalidEnum.PLAYER_ID) return this;

      const player = this.getPlayer()!;

      if (!INTERNAL_FLAGS.skip) {
        TextLabel.__inject__DeletePlayer3DTextLabel(playerId, this.id);
      }

      if (playerTextLabelPool.has(player)) {
        const perPlayerMap = playerTextLabelPool.get(player)!;
        perPlayerMap.delete(this.id);

        if (perPlayerMap.size === 0) {
          playerTextLabelPool.delete(player);
        }
      }
    }

    this._id = InvalidEnum._3DTEXT_ID;
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
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum._3DTEXT_ID) return true;
    if (this.isGlobal()) {
      return TextLabel.isValid(this.id);
    }
    return TextLabel.isValid(this.id, this.getPlayerId());
  }

  attachToPlayer(
    player: Player,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
  ): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (!this.isGlobal()) {
      throw new Error(
        "[TextLabel]: Unable to attach to player, textLabel is not global",
      );
    }
    return TextLabel.__inject__Attach3DTextLabelToPlayer(
      this.id,
      player.id,
      offsetX,
      offsetY,
      offsetZ,
    );
  }

  attachToVehicle(
    vehicle: Vehicle,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
  ): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (!this.isGlobal()) {
      throw new Error(
        "[TextLabel]: Unable to attach to vehicle, textLabel is not global",
      );
    }
    return TextLabel.__inject__Attach3DTextLabelToVehicle(
      this.id,
      vehicle.id,
      offsetX,
      offsetY,
      offsetZ,
    );
  }

  updateText(
    color: number | string,
    text: string,
    charset: string = "utf8",
  ): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (this.isGlobal()) {
      return Update3DTextLabelText(charset, this.id, color, text);
    }
    return UpdatePlayer3DTextLabelText(
      charset,
      this.getPlayerId(),
      this.id,
      color,
      text,
    );
  }

  isStreamedIn(player: Player): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (!this.isGlobal()) {
      throw new Error(
        "[TextLabel]: Unable to check stream in, textLabel is not global",
      );
    }
    return TextLabel.__inject__Is3DTextLabelStreamedIn(this.id, player.id);
  }

  getText(charset = this.sourceInfo?.charset || "utf8") {
    if (this.isGlobal()) {
      return Get3DTextLabelText(charset, this.id);
    }
    return GetPlayer3DTextLabelText(charset, this.getPlayerId(), this.id);
  }

  getColor(): number {
    if (this.isGlobal()) {
      return TextLabel.__inject__Get3DTextLabelColor(this.id);
    }
    return TextLabel.__inject__GetPlayer3DTextLabelColor(
      this.getPlayerId(),
      this.id,
    );
  }

  getPos() {
    if (this.isGlobal()) {
      return TextLabel.__inject__Get3DTextLabelPos(this.id);
    }
    return TextLabel.__inject__GetPlayer3DTextLabelPos(
      this.getPlayerId(),
      this.id,
    );
  }

  setDrawDistance(distance: number): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (this.isGlobal()) {
      return TextLabel.__inject__Set3DTextLabelDrawDistance(this.id, distance);
    }
    return TextLabel.__inject__SetPlayer3DTextLabelDrawDistance(
      this.getPlayerId(),
      this.id,
      distance,
    );
  }

  getDrawDistance(): number {
    if (this.isGlobal()) {
      return TextLabel.__inject__Get3DTextLabelDrawDistance(this.id);
    }
    return TextLabel.__inject__GetPlayer3DTextLabelDrawDistance(
      this.getPlayerId(),
      this.id,
    );
  }

  getLOS(): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (this.isGlobal()) {
      return TextLabel.__inject__Get3DTextLabelLOS(this.id);
    }
    return TextLabel.__inject__GetPlayer3DTextLabelLOS(
      this.getPlayerId(),
      this.id,
    );
  }

  setLOS(status: boolean): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (this.isGlobal()) {
      return TextLabel.__inject__Set3DTextLabelLOS(this.id, status);
    }
    return TextLabel.__inject__SetPlayer3DTextLabelLOS(
      this.getPlayerId(),
      this.id,
      status,
    );
  }

  getVirtualWorld(): number {
    if (this.id === InvalidEnum._3DTEXT_ID) return 0;
    if (this.isGlobal()) {
      return TextLabel.__inject__Get3DTextLabelVirtualWorld(this.id);
    }
    return TextLabel.__inject__GetPlayer3DTextLabelVirtualWorld(
      this.getPlayerId(),
      this.id,
    );
  }

  setVirtualWorld(world: number): boolean {
    if (this.id === InvalidEnum._3DTEXT_ID) return false;
    if (this.isGlobal()) {
      return TextLabel.__inject__Set3DTextLabelVirtualWorld(this.id, world);
    }
    return TextLabel.__inject__SetPlayer3DTextLabelVirtualWorld(
      this.getPlayerId(),
      this.id,
      world,
    );
  }

  getAttachedData() {
    if (this.isGlobal()) {
      return TextLabel.__inject__Get3DTextLabelAttachedData(this.id);
    }
    return TextLabel.__inject__GetPlayer3DTextLabelAttachedData(
      this.getPlayerId(),
      this.id,
    );
  }

  static isValid(textLabelId: number, playerId?: number) {
    if (playerId === InvalidEnum.PLAYER_ID) return false;
    return typeof playerId === "undefined"
      ? TextLabel.__inject__IsValid3DTextLabel(textLabelId)
      : TextLabel.__inject__IsValidPlayer3DTextLabel(playerId, textLabelId);
  }

  static getInstance(textLabelId: number, player?: Player) {
    if (!player) return textLabelPool.get(textLabelId);

    if (player.id === InvalidEnum.PLAYER_ID) return;
    return playerTextLabelPool.get(player)?.get(textLabelId);
  }

  static getInstances(player?: Player) {
    if (!player) return [...textLabelPool.values()];

    if (player.id === InvalidEnum.PLAYER_ID) return [];
    return [...(playerTextLabelPool.get(player)?.values() || [])];
  }

  static getPlayersInstances(): [Player, TextLabel[]][] {
    return Array.from(playerTextLabelPool.entries()).map(
      ([player, textLabels]) => {
        return [player, Array.from(textLabels.values())];
      },
    );
  }

  static __inject__Delete3DTextLabel = tg.Delete3DTextLabel;
  static __inject__Attach3DTextLabelToPlayer = tg.Attach3DTextLabelToPlayer;
  static __inject__Attach3DTextLabelToVehicle = tg.Attach3DTextLabelToVehicle;
  static __inject__Is3DTextLabelStreamedIn = tg.Is3DTextLabelStreamedIn;
  static __inject__Get3DTextLabelColor = tg.Get3DTextLabelColor;
  static __inject__Get3DTextLabelPos = tg.Get3DTextLabelPos;
  static __inject__Set3DTextLabelDrawDistance = tg.Set3DTextLabelDrawDistance;
  static __inject__Get3DTextLabelDrawDistance = tg.Get3DTextLabelDrawDistance;
  static __inject__Get3DTextLabelLOS = tg.Get3DTextLabelLOS;
  static __inject__Set3DTextLabelLOS = tg.Set3DTextLabelLOS;
  static __inject__Get3DTextLabelVirtualWorld = tg.Get3DTextLabelVirtualWorld;
  static __inject__Set3DTextLabelVirtualWorld = tg.Set3DTextLabelVirtualWorld;
  static __inject__Get3DTextLabelAttachedData = tg.Get3DTextLabelAttachedData;
  static __inject__IsValid3DTextLabel = tg.IsValid3DTextLabel;
  static __inject__DeletePlayer3DTextLabel = tp.DeletePlayer3DTextLabel;
  static __inject__GetPlayer3DTextLabelColor = tp.GetPlayer3DTextLabelColor;
  static __inject__GetPlayer3DTextLabelPos = tp.GetPlayer3DTextLabelPos;
  static __inject__SetPlayer3DTextLabelDrawDistance =
    tp.SetPlayer3DTextLabelDrawDistance;
  static __inject__GetPlayer3DTextLabelDrawDistance =
    tp.GetPlayer3DTextLabelDrawDistance;
  static __inject__GetPlayer3DTextLabelLOS = tp.GetPlayer3DTextLabelLOS;
  static __inject__SetPlayer3DTextLabelLOS = tp.SetPlayer3DTextLabelLOS;
  static __inject__GetPlayer3DTextLabelVirtualWorld =
    tp.GetPlayer3DTextLabelVirtualWorld;
  static __inject__SetPlayer3DTextLabelVirtualWorld =
    tp.SetPlayer3DTextLabelVirtualWorld;
  static __inject__GetPlayer3DTextLabelAttachedData =
    tp.GetPlayer3DTextLabelAttachedData;
  static __inject__IsValidPlayer3DTextLabel = tp.IsValidPlayer3DTextLabel;
}
