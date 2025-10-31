import * as g from "core/wrapper/native";
import { InvalidEnum, LimitsEnum } from "../../enums";
import { Player, PlayerEvent } from "../player";
import { rgba } from "../../utils/color";
import type { IGangZone } from "core/interfaces";
import type { IGangZonePos } from "core/wrapper/native/interfaces";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { gangZonePool, playerGangZonePool } from "core/utils/pools";

export class GangZone {
  readonly sourceInfo: IGangZone;

  private _id: number = InvalidEnum.GANG_ZONE;
  get id() {
    return this._id;
  }

  constructor(gangZone: IGangZone) {
    this.sourceInfo = gangZone;
  }

  create() {
    if (this.id !== InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to create again");

    const { player } = this.sourceInfo;
    if (!player) {
      const { minX, minY, maxX, maxY } = this.sourceInfo;
      this._id = GangZone.__inject__GangZoneCreate(minX, minY, maxX, maxY);

      if (
        this.id === InvalidEnum.GANG_ZONE ||
        GangZone.getInstances().length === LimitsEnum.MAX_GANG_ZONES
      )
        throw new Error(
          "[GangZone]: Unable to create gangzone, maximum has been reached",
        );

      gangZonePool.set(this.id, this);
    } else {
      const { minX, minY, maxX, maxY } = this.sourceInfo;
      this._id = GangZone.__inject__CreatePlayerGangZone(
        player.id,
        minX,
        minY,
        maxX,
        maxY,
      );

      if (
        this.id === InvalidEnum.GANG_ZONE ||
        GangZone.getInstances(player).length === LimitsEnum.MAX_GANG_ZONES
      )
        throw new Error(
          "[GangZone]: Unable to create player gangzone, maximum has been reached",
        );

      // PlayerGangZones automatically destroyed when player disconnect
      const off = PlayerEvent.onDisconnect(({ player, next }) => {
        next();
        if (player === this.sourceInfo.player) {
          if (this.isValid()) {
            this.destroy();
          }
          off();
        }
      });
      if (!playerGangZonePool.has(player)) {
        playerGangZonePool.set(player, new Map());
      }
      playerGangZonePool.get(player)!.set(this._id, this);
    }

    return this;
  }

  destroy() {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error(
        "[GangZone]: Unable to destroy the gangzone before create",
      );

    const { player } = this.sourceInfo;
    if (!player) {
      if (!INTERNAL_FLAGS.skip) {
        GangZone.__inject__GangZoneDestroy(this.id);
      }
      gangZonePool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        GangZone.__inject__PlayerGangZoneDestroy(player.id, this.id);
      }
      if (playerGangZonePool.has(player)) {
        const perPlayerGangZone = playerGangZonePool.get(player)!;
        perPlayerGangZone.delete(this.id);

        if (!perPlayerGangZone.size) {
          playerGangZonePool.delete(player);
        }
      }
    }

    this._id = InvalidEnum.GANG_ZONE;
  }

  showForAll(color: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to show the gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__GangZoneShowForAll(this.id, color);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be show for all.",
    );
  }

  showForPlayer(color: string | number, player?: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to show the gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__PlayerGangZoneShow(p.id, this.id, rgba(color));
    else {
      if (player)
        GangZone.__inject__GangZoneShowForPlayer(player.id, this.id, color);
      else {
        throw new Error("[GangZone]: invalid player for show");
      }
    }
    return this;
  }

  hideForAll() {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to hide the gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__GangZoneHideForAll(this.id);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be hide for all.",
    );
  }

  hideForPlayer(player?: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to hide the gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__PlayerGangZoneHide(p.id, this.id);
    else {
      if (player) GangZone.__inject__GangZoneHideForPlayer(player.id, this.id);
      else {
        throw new Error("[GangZone]: invalid player for hide");
      }
    }
    return this;
  }

  flashForAll(flashColor: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to flash the gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__GangZoneFlashForAll(this.id, flashColor);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be flash for all.",
    );
  }

  flashForPlayer(player: Player, flashColor: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to flash the gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (p)
      GangZone.__inject__PlayerGangZoneFlash(p.id, this.id, rgba(flashColor));
    else {
      if (player)
        GangZone.__inject__GangZoneFlashForPlayer(
          player.id,
          this.id,
          flashColor,
        );
      else {
        throw new Error("[GangZone]: invalid player for flash");
      }
    }
    return this;
  }

  stopFlashForAll() {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error(
        "[GangZone]: Unable to stop flash the gangzone before create",
      );
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__GangZoneStopFlashForAll(this.id);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be stop flash for all.",
    );
  }

  stopFlashForPlayer(player: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error(
        "[GangZone]: Unable to stop flash the gangzone before create",
      );
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__PlayerGangZoneStopFlash(p.id, this.id);
    else {
      if (player)
        GangZone.__inject__GangZoneStopFlashForPlayer(player.id, this.id);
      else {
        throw new Error("[GangZone]: invalid player for flash");
      }
    }
    return this;
  }

  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.GANG_ZONE) return true;
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return GangZone.isValidPlayer(p.id, this.id);
    return GangZone.isValidGlobal(this.id);
  }

  isPlayerIn(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__IsPlayerInPlayerGangZone(p.id, this.id);
    return GangZone.__inject__IsPlayerInGangZone(player.id, this.id);
  }

  isVisibleForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__IsPlayerGangZoneVisible(p.id, this.id);
    return GangZone.__inject__IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  getColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get color before create");
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__PlayerGangZoneGetColor(p.id, this.id);
    return GangZone.__inject__GangZoneGetColorForPlayer(player.id, this.id);
  }

  getFlashColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get flash color before create");
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__PlayerGangZoneGetFlashColor(p.id, this.id);
    return GangZone.__inject__GangZoneGetFlashColorForPlayer(
      player.id,
      this.id,
    );
  }

  isFlashingForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__IsPlayerGangZoneFlashing(p.id, this.id);
    return GangZone.__inject__IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  getPos(): IGangZonePos {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get position before create");
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__PlayerGangZoneGetPos(p.id, this.id);
    return GangZone.__inject__GangZoneGetPos(this.id);
  }

  useCheck(toggle: boolean) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to use check before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__UsePlayerGangZoneCheck(p.id, this.id, toggle);
    else GangZone.__inject__UseGangZoneCheck(this.id, toggle);
    return this;
  }

  static isValidPlayer(playerId: number, zoneId: number) {
    return GangZone.__inject__IsValidPlayerGangZone(playerId, zoneId);
  }
  static isValidGlobal(zoneId: number) {
    return GangZone.__inject__IsValidGangZone(zoneId);
  }

  static getInstance(gangZoneId: number, player?: Player) {
    if (!player) return gangZonePool.get(gangZoneId);

    if (player.id === InvalidEnum.PLAYER_ID) return;
    return playerGangZonePool.get(player)?.get(gangZoneId);
  }

  static getInstances(player?: Player) {
    if (!player) return [...gangZonePool.values()];

    if (player.id === InvalidEnum.PLAYER_ID) return [];
    return [...(playerGangZonePool.get(player)?.values() || [])];
  }

  static getPlayersInstances(): [Player, GangZone[]][] {
    return Array.from(playerGangZonePool.entries()).map(
      ([player, gangZones]) => {
        return [player, Array.from(gangZones.values())];
      },
    );
  }

  static __inject__GangZoneCreate = g.GangZoneCreate;
  static __inject__GangZoneDestroy = g.GangZoneDestroy;
  static __inject__GangZoneShowForAll = g.GangZoneShowForAll;
  static __inject__GangZoneHideForAll = g.GangZoneHideForAll;
  static __inject__GangZoneFlashForAll = g.GangZoneFlashForAll;
  static __inject__GangZoneStopFlashForAll = g.GangZoneStopFlashForAll;
  static __inject__GangZoneGetPos = g.GangZoneGetPos;
  static __inject__UseGangZoneCheck = g.UseGangZoneCheck;
  static __inject__CreatePlayerGangZone = g.CreatePlayerGangZone;
  static __inject__PlayerGangZoneDestroy = g.PlayerGangZoneDestroy;
  static __inject__PlayerGangZoneShow = g.PlayerGangZoneShow;
  static __inject__GangZoneShowForPlayer = g.GangZoneShowForPlayer;
  static __inject__PlayerGangZoneHide = g.PlayerGangZoneHide;
  static __inject__GangZoneHideForPlayer = g.GangZoneHideForPlayer;
  static __inject__PlayerGangZoneFlash = g.PlayerGangZoneFlash;
  static __inject__GangZoneFlashForPlayer = g.GangZoneFlashForPlayer;
  static __inject__PlayerGangZoneStopFlash = g.PlayerGangZoneStopFlash;
  static __inject__GangZoneStopFlashForPlayer = g.GangZoneStopFlashForPlayer;
  static __inject__PlayerGangZoneGetPos = g.PlayerGangZoneGetPos;
  static __inject__UsePlayerGangZoneCheck = g.UsePlayerGangZoneCheck;
  static __inject__IsPlayerInGangZone = g.IsPlayerInGangZone;
  static __inject__IsPlayerInPlayerGangZone = g.IsPlayerInPlayerGangZone;
  static __inject__IsGangZoneVisibleForPlayer = g.IsGangZoneVisibleForPlayer;
  static __inject__IsPlayerGangZoneVisible = g.IsPlayerGangZoneVisible;
  static __inject__GangZoneGetColorForPlayer = g.GangZoneGetColorForPlayer;
  static __inject__PlayerGangZoneGetColor = g.PlayerGangZoneGetColor;
  static __inject__GangZoneGetFlashColorForPlayer =
    g.GangZoneGetFlashColorForPlayer;
  static __inject__PlayerGangZoneGetFlashColor = g.PlayerGangZoneGetFlashColor;
  static __inject__IsGangZoneFlashingForPlayer = g.IsGangZoneFlashingForPlayer;
  static __inject__IsPlayerGangZoneFlashing = g.IsPlayerGangZoneFlashing;
  static __inject__IsValidPlayerGangZone = g.IsValidPlayerGangZone;
  static __inject__IsValidGangZone = g.IsValidGangZone;
}
