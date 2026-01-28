import * as g from "core/wrapper/native";
import { InvalidEnum, LimitsEnum } from "../../enums";
import { Player } from "../player";
import { rgba } from "../../utils/color";
import type { IGangZone } from "core/interfaces";
import type { IGangZonePos } from "core/wrapper/native/interfaces";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { gangZonePool, playerGangZonePool } from "core/utils/pools";
import { GangZoneException } from "core/exceptions";

export class GangZone {
  readonly sourceInfo: IGangZone | null = null;
  private _player: Player | null = null;
  private _id: number = InvalidEnum.GANG_ZONE;

  get id() {
    return this._id;
  }

  constructor(gangZoneOrId: IGangZone | number, player?: Player) {
    if (typeof gangZoneOrId === "number") {
      if (gangZoneOrId === InvalidEnum.GANG_ZONE) {
        throw new GangZoneException("Invalid id");
      }

      if (player) {
        this._player = player;
      }

      const gangZone = GangZone.getInstance(gangZoneOrId, player);
      if (gangZone) return gangZone;

      this._id = gangZoneOrId;
      if (this.isGlobal()) {
        gangZonePool.set(this._id, this);
      } else if (player) {
        if (!playerGangZonePool.has(player)) {
          playerGangZonePool.set(player, new Map());
        }
        playerGangZonePool.get(this.getPlayer()!)!.set(this.id, this);
      }
    } else {
      this.sourceInfo = gangZoneOrId;
      this._player = null;
    }
  }

  create() {
    if (!this.sourceInfo) {
      throw new GangZoneException("Cannot create with only id");
    }
    if (this.id !== InvalidEnum.GANG_ZONE)
      throw new GangZoneException("Cannot create again");

    const { player } = this.sourceInfo;
    if (!player) {
      const { minX, minY, maxX, maxY } = this.sourceInfo;
      this._id = GangZone.__inject__.create(minX, minY, maxX, maxY);

      if (
        this.id === InvalidEnum.GANG_ZONE ||
        GangZone.getInstances().length === LimitsEnum.MAX_GANG_ZONES
      )
        throw new GangZoneException("Cannot create gangZone");

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
        throw new GangZoneException("Cannot create playerGangZone");
      if (!playerGangZonePool.has(player)) {
        playerGangZonePool.set(player, new Map());
      }
      playerGangZonePool.get(player)!.set(this._id, this);
    }

    return this;
  }

  destroy() {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new GangZoneException("Cannot destroy before create");

    const player = this.getPlayer();
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

  showForAll(color: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot show gangzone before create");
    }
    const p = this.getPlayer();
    if (!p) {
      GangZone.__inject__.showForAll(this.id, color);
      return this;
    }
    throw new GangZoneException(
      "player's gangzone should not be show for all.",
    );
  }

  showForPlayer(color: string | number, player?: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot show gangzone before create");
    }
    const p = this.getPlayer();
    if (p) GangZone.__inject__.showPlayer(p.id, this.id, rgba(color));
    else {
      if (player) GangZone.__inject__.showForPlayer(player.id, this.id, color);
      else {
        throw new GangZoneException("invalid player for show");
      }
    }
    return this;
  }

  hideForAll() {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot hide gangzone before create");
    }
    const p = this.getPlayer();
    if (!p) {
      GangZone.__inject__.hideForAll(this.id);
      return this;
    }
    throw new GangZoneException(
      "player's gangzone should not be hide for all.",
    );
  }

  hideForPlayer(player?: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot hide gangzone before create");
    }
    const p = this.getPlayer();
    if (p) GangZone.__inject__.hidePlayer(p.id, this.id);
    else {
      if (player) GangZone.__inject__.hideForPlayer(player.id, this.id);
      else {
        throw new GangZoneException("invalid player for hide");
      }
    }
    return this;
  }

  flashForAll(flashColor: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot flash gangzone before create");
    }
    const p = this.getPlayer();
    if (!p) {
      GangZone.__inject__.flashForAll(this.id, flashColor);
      return this;
    }
    throw new GangZoneException(
      "player's gangzone should not be flash for all.",
    );
  }

  flashForPlayer(player: Player, flashColor: string | number) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot flash gangzone before create");
    }
    const p = this.getPlayer();
    if (p) GangZone.__inject__.flashPlayer(p.id, this.id, rgba(flashColor));
    else {
      if (player)
        GangZone.__inject__.flashForPlayer(player.id, this.id, flashColor);
      else {
        throw new GangZoneException("invalid player for flash");
      }
    }
    return this;
  }

  stopFlashForAll() {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot stop flash gangzone before create");
    }
    const p = this.getPlayer();
    if (!p) {
      GangZone.__inject__.stopFlashForAll(this.id);
      return this;
    }
    throw new GangZoneException(
      "player's gangzone should not be stop flash for all.",
    );
  }

  stopFlashForPlayer(player: Player) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot stop flash gangzone before create");
    }
    const p = this.getPlayer();
    if (p) GangZone.__inject__.stopFlashPlayer(p.id, this.id);
    else {
      if (player) GangZone.__inject__.stopFlashForPlayer(player.id, this.id);
      else {
        throw new GangZoneException("invalid player for flash");
      }
    }
    return this;
  }

  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.GANG_ZONE) return true;
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.getPlayer();
    if (p) return GangZone.isValidPlayer(p.id, this.id);
    return GangZone.isValidGlobal(this.id);
  }

  isPlayerIn(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.getPlayer();
    if (p) return GangZone.__inject__.isPlayerInPlayer(p.id, this.id);
    return GangZone.__inject__.isPlayerIn(player.id, this.id);
  }

  isVisibleForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.getPlayer();
    if (p) return GangZone.__inject__.isVisiblePlayer(p.id, this.id);
    return GangZone.__inject__.isVisibleForPlayer(player.id, this.id);
  }

  getColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new GangZoneException("Cannot get color before create");
    const p = this.getPlayer();
    if (p) return GangZone.__inject__.getColorPlayer(p.id, this.id);
    return GangZone.__inject__.getColorForPlayer(player.id, this.id);
  }

  getFlashColorForPlayer(player: Player): number {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new GangZoneException("Cannot get flash color before create");
    const p = this.getPlayer();
    if (p) return GangZone.__inject__.getFlashColorPlayer(p.id, this.id);
    return GangZone.__inject__.getFlashColorForPlayer(player.id, this.id);
  }

  isFlashingForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.GANG_ZONE) return false;
    const p = this.getPlayer();
    if (p) return GangZone.__inject__.isFlashingPlayer(p.id, this.id);
    return GangZone.__inject__.isFlashingForPlayer(player.id, this.id);
  }

  getPos(): IGangZonePos {
    if (this.id === InvalidEnum.GANG_ZONE)
      throw new GangZoneException("Cannot get position before create");
    const p = this.getPlayer();
    if (p) return GangZone.__inject__.getPosPlayer(p.id, this.id);
    return GangZone.__inject__.getPos(this.id);
  }

  useCheck(toggle: boolean) {
    if (this.id === InvalidEnum.GANG_ZONE) {
      throw new GangZoneException("Cannot use check before create");
    }
    const p = this.getPlayer();
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
