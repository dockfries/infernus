import { LimitsEnum } from "@/enums";
import { IBaseGangZone } from "@/interfaces";
import { logger } from "@/logger";
import { rgba } from "@/utils/colorUtils";
import * as fns from "@/wrapper/functions";
import * as ow from "omp-wrapper";
import { BasePlayer } from "../player";
import { gangZoneBus, gangZoneHooks } from "./gangZoneBus";

export abstract class BaseGangZone<P extends BasePlayer> {
  private _id = -1;
  private static createdGlobalCount = 0;
  private static createdPlayerCount = 0;
  public readonly sourceInfo: IBaseGangZone<P>;

  constructor(gangZone: IBaseGangZone<P>) {
    this.sourceInfo = gangZone;
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
      this._id = ow.CreatePlayerGangZone(player.id, minx, miny, maxx, maxy);
      BaseGangZone.createdPlayerCount++;
      // PlayerGangZones may be automatically destroyed when a player disconnects.
      samp.addEventListener("OnPlayerDisconnect", this.unregisterEvent);
    }
    gangZoneBus.emit(gangZoneHooks.created, {
      key: { id: this.id, global: player === undefined },
      value: this,
    });
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
      ow.PlayerGangZoneDestroy(player.id, this.id);
      BaseGangZone.createdPlayerCount--;
    }
    gangZoneBus.emit(gangZoneHooks.destroyed, {
      id: this.id,
      global: player === undefined,
    });
    this._id = -1;
  }

  public showForAll(color: string): void | this {
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

  public showForPlayer(color: string, player?: P): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) ow.PlayerGangZoneShow(p.id, this.id, rgba(color));
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
    if (p) ow.PlayerGangZoneHide(p.id, this.id);
    else {
      if (player) fns.GangZoneHideForPlayer(player.id, this.id);
      else return logger.warn("[BaseGangZone]: invalid player for hide");
    }
    return this;
  }

  public flashForAll(flashcolor: string): void | this {
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

  public flashForPlayer(player: P, flashcolor: string): void | this {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) ow.PlayerGangZoneFlash(p.id, this.id, rgba(flashcolor));
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
    if (p) ow.PlayerGangZoneStopFlash(p.id, this.id);
    else {
      if (player) fns.GangZoneStopFlashForPlayer(player.id, this.id);
      else return logger.warn("[BaseGangZone]: invalid player for flash");
    }
    return this;
  }

  public isValid(): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.IsValidPlayerGangZone(p.id, this.id);
    return ow.IsValidGangZone(this.id);
  }

  public isPlayerIn(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.IsPlayerInPlayerGangZone(p.id, this.id);
    return ow.IsPlayerInGangZone(player.id, this.id);
  }

  public isVisibleForPlayer(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.IsPlayerGangZoneVisible(p.id, this.id);
    return ow.IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  public getColorForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn("[BaseGangZone]: Unable to get color before create");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerGangZoneGetColor(p.id, this.id);
    return ow.GangZoneGetColorForPlayer(player.id, this.id);
  }

  public getFlashColorForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to get flash color before create"
      );
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerGangZoneGetFlashColor(p.id, this.id);
    return ow.GangZoneGetFlashColorForPlayer(player.id, this.id);
  }

  public isFlashingForPlayer(player: P): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.IsPlayerGangZoneFlashing(p.id, this.id);
    return ow.IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  public getPos(): void | ow.GangZonePos {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to get position before create"
      );
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerGangZoneGetPos(p.id, this.id);
    return ow.GangZoneGetPos(this.id);
  }

  public useCheck(toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn("[BaseGangZone]: Unable to use check before create");
    const p = this.sourceInfo.player;
    if (p) ow.UsePlayerGangZoneCheck(p.id, this.id, toggle);
    else ow.UseGangZoneCheck(this.id, toggle);
    return this;
  }

  private unregisterEvent(): number {
    this.destroy();
    samp.removeEventListener("OnPlayerDisconnect", this.unregisterEvent);
    return 1;
  }
}
