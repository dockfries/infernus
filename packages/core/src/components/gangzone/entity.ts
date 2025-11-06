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
      this._id = GangZone.__inject__.create(minX, minY, maxX, maxY);

      if (
        this.id === InvalidEnum.GANG_ZONE ||
        GangZone.getInstances().length === LimitsEnum.MAX_GANG_ZONES
      )
        throw new Error("[GangZone]: Unable to create gangZone");

      gangZonePool.set(this.id, this);
    } else {
      const { minX, minY, maxX, maxY } = this.sourceInfo;
      this._id = GangZone.__inject__.createPlayer(
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
        throw new Error("[GangZone]: Unable to create playerGangZone");

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
      throw new Error("[GangZone]: Unable to destroy gangzone before create");

    const { player } = this.sourceInfo;
    if (!player) {
      if (!INTERNAL_FLAGS.skip) {
        GangZone.__inject__.destroy(this.id);
      }
      gangZonePool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        GangZone.__inject__.destroyPlayer(player.id, this.id);
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
      throw new Error("[GangZone]: Unable to show gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__.showForAll(this.id, color);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be show for all.",
    );
  }

  showForPlayer(color: string | number, player?: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to show gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__.showPlayer(p.id, this.id, rgba(color));
    else {
      if (player) GangZone.__inject__.showForPlayer(player.id, this.id, color);
      else {
        throw new Error("[GangZone]: invalid player for show");
      }
    }
    return this;
  }

  hideForAll() {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to hide gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__.hideForAll(this.id);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be hide for all.",
    );
  }

  hideForPlayer(player?: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to hide gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__.hidePlayer(p.id, this.id);
    else {
      if (player) GangZone.__inject__.hideForPlayer(player.id, this.id);
      else {
        throw new Error("[GangZone]: invalid player for hide");
      }
    }
    return this;
  }

  flashForAll(flashColor: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to flash gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__.flashForAll(this.id, flashColor);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be flash for all.",
    );
  }

  flashForPlayer(player: Player, flashColor: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to flash gangzone before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__.flashPlayer(p.id, this.id, rgba(flashColor));
    else {
      if (player)
        GangZone.__inject__.flashForPlayer(player.id, this.id, flashColor);
      else {
        throw new Error("[GangZone]: invalid player for flash");
      }
    }
    return this;
  }

  stopFlashForAll() {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error(
        "[GangZone]: Unable to stop flash gangzone before create",
      );
    }
    const p = this.sourceInfo.player;
    if (!p) {
      GangZone.__inject__.stopFlashForAll(this.id);
      return this;
    }
    throw new Error(
      "[GangZone]: player's gangzone should not be stop flash for all.",
    );
  }

  stopFlashForPlayer(player: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error(
        "[GangZone]: Unable to stop flash gangzone before create",
      );
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__.stopFlashPlayer(p.id, this.id);
    else {
      if (player) GangZone.__inject__.stopFlashForPlayer(player.id, this.id);
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
    if (p) return GangZone.__inject__.isPlayerInPlayer(p.id, this.id);
    return GangZone.__inject__.isPlayerIn(player.id, this.id);
  }

  isVisibleForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__.isVisiblePlayer(p.id, this.id);
    return GangZone.__inject__.isVisibleForPlayer(player.id, this.id);
  }

  getColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get color before create");
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__.getColorPlayer(p.id, this.id);
    return GangZone.__inject__.getColorForPlayer(player.id, this.id);
  }

  getFlashColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get flash color before create");
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__.getFlashColorPlayer(p.id, this.id);
    return GangZone.__inject__.getFlashColorForPlayer(player.id, this.id);
  }

  isFlashingForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__.isFlashingPlayer(p.id, this.id);
    return GangZone.__inject__.isFlashingForPlayer(player.id, this.id);
  }

  getPos(): IGangZonePos {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new Error("[GangZone]: Unable to get position before create");
    const p = this.sourceInfo.player;
    if (p) return GangZone.__inject__.getPosPlayer(p.id, this.id);
    return GangZone.__inject__.getPos(this.id);
  }

  useCheck(toggle: boolean) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new Error("[GangZone]: Unable to use check before create");
    }
    const p = this.sourceInfo.player;
    if (p) GangZone.__inject__.useCheckPlayer(p.id, this.id, toggle);
    else GangZone.__inject__.useCheck(this.id, toggle);
    return this;
  }

  static isValidPlayer(playerId: number, zoneId: number) {
    return GangZone.__inject__.isValidPlayer(playerId, zoneId);
  }
  static isValidGlobal(zoneId: number) {
    return GangZone.__inject__.isValidGlobal(zoneId);
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

  static __inject__ = {
    create: g.GangZoneCreate,
    destroy: g.GangZoneDestroy,
    showForAll: g.GangZoneShowForAll,
    hideForAll: g.GangZoneHideForAll,
    flashForAll: g.GangZoneFlashForAll,
    stopFlashForAll: g.GangZoneStopFlashForAll,
    getPos: g.GangZoneGetPos,
    useCheck: g.UseGangZoneCheck,
    createPlayer: g.CreatePlayerGangZone,
    destroyPlayer: g.PlayerGangZoneDestroy,
    showPlayer: g.PlayerGangZoneShow,
    showForPlayer: g.GangZoneShowForPlayer,
    hidePlayer: g.PlayerGangZoneHide,
    hideForPlayer: g.GangZoneHideForPlayer,
    flashPlayer: g.PlayerGangZoneFlash,
    flashForPlayer: g.GangZoneFlashForPlayer,
    stopFlashPlayer: g.PlayerGangZoneStopFlash,
    stopFlashForPlayer: g.GangZoneStopFlashForPlayer,
    getPosPlayer: g.PlayerGangZoneGetPos,
    useCheckPlayer: g.UsePlayerGangZoneCheck,
    isPlayerIn: g.IsPlayerInGangZone,
    isPlayerInPlayer: g.IsPlayerInPlayerGangZone,
    isVisibleForPlayer: g.IsGangZoneVisibleForPlayer,
    isVisiblePlayer: g.IsPlayerGangZoneVisible,
    getColorForPlayer: g.GangZoneGetColorForPlayer,
    getColorPlayer: g.PlayerGangZoneGetColor,
    getFlashColorForPlayer: g.GangZoneGetFlashColorForPlayer,
    getFlashColorPlayer: g.PlayerGangZoneGetFlashColor,
    isFlashingForPlayer: g.IsGangZoneFlashingForPlayer,
    isFlashingPlayer: g.IsPlayerGangZoneFlashing,
    isValidPlayer: g.IsValidPlayerGangZone,
    isValidGlobal: g.IsValidGangZone,
  };
}
