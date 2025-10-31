import * as w from "core/wrapper/native";
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
      this._id = w.GangZoneCreate(minX, minY, maxX, maxY);

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
      this._id = w.CreatePlayerGangZone(player.id, minX, minY, maxX, maxY);

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
        w.GangZoneDestroy(this.id);
      }
      gangZonePool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        w.PlayerGangZoneDestroy(player.id, this.id);
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
      w.GangZoneShowForAll(this.id, color);
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
    if (p) w.PlayerGangZoneShow(p.id, this.id, rgba(color));
    else {
      if (player) w.GangZoneShowForPlayer(player.id, this.id, color);
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
      w.GangZoneHideForAll(this.id);
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
    if (p) w.PlayerGangZoneHide(p.id, this.id);
    else {
      if (player) w.GangZoneHideForPlayer(player.id, this.id);
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
      w.GangZoneFlashForAll(this.id, flashColor);
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
    if (p) w.PlayerGangZoneFlash(p.id, this.id, rgba(flashColor));
    else {
      if (player) w.GangZoneFlashForPlayer(player.id, this.id, flashColor);
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
      w.GangZoneStopFlashForAll(this.id);
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
    if (p) w.PlayerGangZoneStopFlash(p.id, this.id);
    else {
      if (player) w.GangZoneStopFlashForPlayer(player.id, this.id);
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
    if (p) return w.IsPlayerInPlayerGangZone(p.id, this.id);
    return w.IsPlayerInGangZone(player.id, this.id);
  }

  isVisibleForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return w.IsPlayerGangZoneVisible(p.id, this.id);
    return w.IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  getColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get color before create");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerGangZoneGetColor(p.id, this.id);
    return w.GangZoneGetColorForPlayer(player.id, this.id);
  }

  getFlashColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get flash color before create");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerGangZoneGetFlashColor(p.id, this.id);
    return w.GangZoneGetFlashColorForPlayer(player.id, this.id);
  }

  isFlashingForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return w.IsPlayerGangZoneFlashing(p.id, this.id);
    return w.IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  getPos(): IGangZonePos {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get position before create");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerGangZoneGetPos(p.id, this.id);
    return w.GangZoneGetPos(this.id);
  }

  useCheck(toggle: boolean) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to use check before create");
    }
    const p = this.sourceInfo.player;
    if (p) w.UsePlayerGangZoneCheck(p.id, this.id, toggle);
    else w.UseGangZoneCheck(this.id, toggle);
    return this;
  }

  static isValidPlayer = w.IsValidPlayerGangZone;
  static isValidGlobal = w.IsValidGangZone;

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
}
