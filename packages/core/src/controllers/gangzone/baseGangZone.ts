import { LimitsEnum } from "@/enums";
import { IGangZone } from "@/interfaces";
import { logger } from "@/logger";
import { rgba } from "@/utils/colorUtils";
import * as fns from "@/wrapper/native/functions";
import {
  CreatePlayerGangZone,
  PlayerGangZoneDestroy,
  PlayerGangZoneShow,
  PlayerGangZoneHide,
  PlayerGangZoneFlash,
  PlayerGangZoneStopFlash,
  IsValidPlayerGangZone,
  IsValidGangZone,
  IsPlayerInPlayerGangZone,
  IsPlayerInGangZone,
  IsPlayerGangZoneVisible,
  IsGangZoneVisibleForPlayer,
  PlayerGangZoneGetColour,
  IsPlayerGangZoneFlashing,
  IsGangZoneFlashingForPlayer,
  GangZonePos,
  PlayerGangZoneGetPos,
  GangZoneGetPos,
  UsePlayerGangZoneCheck,
  UseGangZoneCheck,
  GangZoneGetColourForPlayer,
  GangZoneGetFlashColourForPlayer,
  PlayerGangZoneGetFlashColour,
} from "@infernus/wrapper";

import { Player } from "../player";
import { gangZoneBus, gangZoneHooks } from "./gangZoneBus";

export class GangZone<P extends Player> {
  private _id = -1;
  private static createdGlobalCount = 0;
  private static createdPlayerCount = 0;
  readonly sourceInfo: IGangZone<P>;

  constructor(gangZone: IGangZone<P>) {
    this.sourceInfo = gangZone;
  }

  get id() {
    return this._id;
  }

  create(): void {
    if (this.id !== -1)
      return logger.warn("[GangZone]: Unable to create the gangzone again");

    const { player } = this.sourceInfo;
    if (!player) {
      if (GangZone.createdGlobalCount === LimitsEnum.MAX_GANG_ZONES)
        return logger.warn(
          "[GangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
        );
      const { minx, miny, maxx, maxy } = this.sourceInfo;
      this._id = fns.GangZoneCreate(minx, miny, maxx, maxy);
      GangZone.createdGlobalCount++;
    } else {
      if (GangZone.createdPlayerCount === LimitsEnum.MAX_GANG_ZONES)
        return logger.warn(
          "[GangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
        );
      const { minx, miny, maxx, maxy } = this.sourceInfo;
      this._id = CreatePlayerGangZone(player.id, minx, miny, maxx, maxy);
      GangZone.createdPlayerCount++;
      // PlayerGangZones may be automatically destroyed when a player disconnects.
      samp.addEventListener("OnPlayerDisconnect", this.unregisterEvent);
    }
    gangZoneBus.emit(gangZoneHooks.created, {
      key: { id: this.id, global: player === undefined },
      value: this,
    });
  }

  destroy() {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to destroy the gangzone before create"
      );

    const { player } = this.sourceInfo;
    if (!player) {
      fns.GangZoneDestroy(this.id);
      GangZone.createdGlobalCount--;
    } else {
      PlayerGangZoneDestroy(player.id, this.id);
      GangZone.createdPlayerCount--;
    }
    gangZoneBus.emit(gangZoneHooks.destroyed, {
      id: this.id,
      global: player === undefined,
    });
    this._id = -1;
  }

  showForAll(colour: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneShowForAll(this.id, colour);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be show for all."
    );
  }

  showForPlayer(colour: string | number, player?: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneShow(p.id, this.id, rgba(colour));
    else {
      if (player) fns.GangZoneShowForPlayer(player.id, this.id, colour);
      else return logger.warn("[GangZone]: invalid player for show");
    }
    return this;
  }

  hideForAll(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to hide the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneHideForAll(this.id);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be hide for all."
    );
  }

  hideForPlayer(player?: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to hide the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneHide(p.id, this.id);
    else {
      if (player) fns.GangZoneHideForPlayer(player.id, this.id);
      else return logger.warn("[GangZone]: invalid player for hide");
    }
    return this;
  }

  flashForAll(flashcolour: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneFlashForAll(this.id, flashcolour);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be flash for all."
    );
  }

  flashForPlayer(player: P, flashcolour: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneFlash(p.id, this.id, rgba(flashcolour));
    else {
      if (player) fns.GangZoneFlashForPlayer(player.id, this.id, flashcolour);
      else return logger.warn("[GangZone]: invalid player for flash");
    }
    return this;
  }

  StopFlashForAll(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to stop flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneStopFlashForAll(this.id);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be stop flash for all."
    );
  }

  StopFlashForPlayer(player: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to stop flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneStopFlash(p.id, this.id);
    else {
      if (player) fns.GangZoneStopFlashForPlayer(player.id, this.id);
      else return logger.warn("[GangZone]: invalid player for flash");
    }
    return this;
  }

  isValid(): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsValidPlayerGangZone(p.id, this.id);
    return IsValidGangZone(this.id);
  }

  isPlayerIn(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsPlayerInPlayerGangZone(p.id, this.id);
    return IsPlayerInGangZone(player.id, this.id);
  }

  isVisibleForPlayer(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsPlayerGangZoneVisible(p.id, this.id);
    return IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  getColourForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to get colour before create");
    const p = this.sourceInfo.player;
    if (p) return PlayerGangZoneGetColour(p.id, this.id);
    return GangZoneGetColourForPlayer(player.id, this.id);
  }

  getFlashColourForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to get flash colour before create"
      );
    const p = this.sourceInfo.player;
    if (p) return PlayerGangZoneGetFlashColour(p.id, this.id);
    return GangZoneGetFlashColourForPlayer(player.id, this.id);
  }

  isFlashingForPlayer(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsPlayerGangZoneFlashing(p.id, this.id);
    return IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  getPos(): void | GangZonePos {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to get position before create");
    const p = this.sourceInfo.player;
    if (p) return PlayerGangZoneGetPos(p.id, this.id);
    return GangZoneGetPos(this.id);
  }

  useCheck(toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to use check before create");
    const p = this.sourceInfo.player;
    if (p) UsePlayerGangZoneCheck(p.id, this.id, toggle);
    else UseGangZoneCheck(this.id, toggle);
    return this;
  }

  private unregisterEvent(): number {
    this.destroy();
    samp.removeEventListener("OnPlayerDisconnect", this.unregisterEvent);
    return 1;
  }
}
