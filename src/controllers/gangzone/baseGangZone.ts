import { LimitsEnum } from "@/enums";
import { IBaseGangZone } from "@/interfaces";
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
  PlayerGangZoneGetColor,
  GangZoneGetColorForPlayer,
  PlayerGangZoneGetFlashColor,
  GangZoneGetFlashColorForPlayer,
  IsPlayerGangZoneFlashing,
  IsGangZoneFlashingForPlayer,
  GangZonePos,
  PlayerGangZoneGetPos,
  GangZoneGetPos,
  UsePlayerGangZoneCheck,
  UseGangZoneCheck,
} from "omp-wrapper";

import { BasePlayer } from "../player";
import { BaseGangZoneEvent } from "./gangZoneEvent";

export abstract class BaseGangZone<P extends BasePlayer> {
  private _id = -1;
  private static createdGlobalCount = 0;
  private static createdPlayerCount = 0;
  public readonly sourceInfo: IBaseGangZone<P>;
  private readonly event?: BaseGangZoneEvent;

  constructor(gangZone: IBaseGangZone<P>, event?: BaseGangZoneEvent) {
    this.sourceInfo = gangZone;
    this.event = event;
  }

  public get id() {
    return this._id;
  }

  public create(): void {
    if (this.id !== -1)
      return logger.warn("[BaseGangZone]: Unable to create the gangzone again");

    const { player } = this.sourceInfo;
    if (!player) {
      if (BaseGangZone.createdGlobalCount === LimitsEnum.MAX_GANG_ZONES)
        return logger.warn(
          "[BaseGangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
        );
      const { minx, miny, maxx, maxy } = this.sourceInfo;
      this._id = fns.GangZoneCreate(minx, miny, maxx, maxy);
      BaseGangZone.createdGlobalCount++;
    } else {
      if (BaseGangZone.createdPlayerCount === LimitsEnum.MAX_GANG_ZONES)
        return logger.warn(
          "[BaseGangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
        );
      const { minx, miny, maxx, maxy } = this.sourceInfo;
      this._id = CreatePlayerGangZone(player.id, minx, miny, maxx, maxy);
      BaseGangZone.createdPlayerCount++;
      // PlayerGangZones may be automatically destroyed when a player disconnects.
      samp.addEventListener("OnPlayerDisconnect", this.unregisterEvent);
    }

    this.event?._onCreated && this.event._onCreated(this, player === undefined);
  }

  public destroy() {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to destroy the gangzone before create"
      );

    const { player } = this.sourceInfo;
    if (!player) {
      fns.GangZoneDestroy(this.id);
      BaseGangZone.createdGlobalCount--;
    } else {
      PlayerGangZoneDestroy(player.id, this.id);
      BaseGangZone.createdPlayerCount--;
    }
    this.event?._onDestroyed &&
      this.event?._onDestroyed(this, player === undefined);
    this._id = -1;
  }

  public showForAll(color: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneShowForAll(this.id, color);
      return this;
    }
    return logger.warn(
      "[BaseGangZone]: player's gangzone should not be show for all."
    );
  }

  public showForPlayer(color: string | number, player?: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneShow(p.id, this.id, rgba(color));
    else {
      if (player) fns.GangZoneShowForPlayer(player.id, this.id, color);
      else return logger.warn("[BaseGangZone]: invalid player for show");
    }
    return this;
  }

  public hideForAll(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to hide the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneHideForAll(this.id);
      return this;
    }
    return logger.warn(
      "[BaseGangZone]: player's gangzone should not be hide for all."
    );
  }

  public hideForPlayer(player?: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to hide the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneHide(p.id, this.id);
    else {
      if (player) fns.GangZoneHideForPlayer(player.id, this.id);
      else return logger.warn("[BaseGangZone]: invalid player for hide");
    }
    return this;
  }

  public flashForAll(flashcolor: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneFlashForAll(this.id, flashcolor);
      return this;
    }
    return logger.warn(
      "[BaseGangZone]: player's gangzone should not be flash for all."
    );
  }

  public flashForPlayer(player: P, flashcolor: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneFlash(p.id, this.id, rgba(flashcolor));
    else {
      if (player) fns.GangZoneFlashForPlayer(player.id, this.id, flashcolor);
      else return logger.warn("[BaseGangZone]: invalid player for flash");
    }
    return this;
  }

  public StopFlashForAll(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to stop flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      fns.GangZoneStopFlashForAll(this.id);
      return this;
    }
    return logger.warn(
      "[BaseGangZone]: player's gangzone should not be stop flash for all."
    );
  }

  public StopFlashForPlayer(player: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to stop flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) PlayerGangZoneStopFlash(p.id, this.id);
    else {
      if (player) fns.GangZoneStopFlashForPlayer(player.id, this.id);
      else return logger.warn("[BaseGangZone]: invalid player for flash");
    }
    return this;
  }

  public isValid(): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsValidPlayerGangZone(p.id, this.id);
    return IsValidGangZone(this.id);
  }

  public isPlayerIn(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsPlayerInPlayerGangZone(p.id, this.id);
    return IsPlayerInGangZone(player.id, this.id);
  }

  public isVisibleForPlayer(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsPlayerGangZoneVisible(p.id, this.id);
    return IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  public getColorForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn("[BaseGangZone]: Unable to get color before create");
    const p = this.sourceInfo.player;
    if (p) return PlayerGangZoneGetColor(p.id, this.id);
    return GangZoneGetColorForPlayer(player.id, this.id);
  }

  public getFlashColorForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to get flash color before create"
      );
    const p = this.sourceInfo.player;
    if (p) return PlayerGangZoneGetFlashColor(p.id, this.id);
    return GangZoneGetFlashColorForPlayer(player.id, this.id);
  }

  public isFlashingForPlayer(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return IsPlayerGangZoneFlashing(p.id, this.id);
    return IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  public getPos(): void | GangZonePos {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to get position before create"
      );
    const p = this.sourceInfo.player;
    if (p) return PlayerGangZoneGetPos(p.id, this.id);
    return GangZoneGetPos(this.id);
  }

  public useCheck(toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn("[BaseGangZone]: Unable to use check before create");
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
