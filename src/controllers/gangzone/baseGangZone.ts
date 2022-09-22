import { LimitsEnum } from "@/enums";
import { IBaseGangZone } from "@/interfaces";
import { logger } from "@/logger";
import {
  GangZoneCreate,
  GangZoneDestroy,
  GangZoneFlashForAll,
  GangZoneFlashForPlayer,
  GangZoneHideForAll,
  GangZoneHideForPlayer,
  GangZoneShowForAll,
  GangZoneShowForPlayer,
  GangZoneStopFlashForAll,
  GangZoneStopFlashForPlayer,
} from "@/wrapper/functions";
import {
  GangZoneGetColorForPlayer,
  GangZoneGetFlashColorForPlayer,
  GangZoneGetPos,
  GangZonePos,
  IsGangZoneFlashingForPlayer,
  IsGangZoneVisibleForPlayer,
  IsPlayerInGangZone,
  IsValidGangZone,
  UseGangZoneCheck,
} from "omp-wrapper";
import { BasePlayer } from "../player";

export abstract class BaseGangZone<P extends BasePlayer> {
  private _id = -1;
  private static createdCount = 0;
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
    if (BaseGangZone.createdCount === LimitsEnum.MAX_GANG_ZONES)
      return logger.warn(
        "[BaseGangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
      );
    const { minx, miny, maxx, maxy } = this.sourceInfo;
    this._id = GangZoneCreate(minx, miny, maxx, maxy);
  }

  public destroy() {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to destroy the gangzone before create"
      );
    GangZoneDestroy(this.id);
    BaseGangZone.createdCount--;
    this._id = -1;
  }

  public showForAll(color: string): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to show the gangzone before create"
      );
    return GangZoneShowForAll(this.id, color);
  }

  public showForPlayer(player: P, color: string): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to show the gangzone before create"
      );
    return GangZoneShowForPlayer(player.id, this.id, color);
  }

  public hideForAll(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to hide the gangzone before create"
      );
    return GangZoneHideForAll(this.id);
  }

  public hideForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to hide the gangzone before create"
      );
    return GangZoneHideForPlayer(player.id, this.id);
  }

  public flashForAll(flashcolor: string): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to flash the gangzone before create"
      );
    return GangZoneFlashForAll(this.id, flashcolor);
  }

  public flashForPlayer(player: P, flashcolor: string): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to flash the gangzone before create"
      );
    return GangZoneFlashForPlayer(player.id, this.id, flashcolor);
  }

  public StopFlashForAll(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to stop flash the gangzone before create"
      );
    return GangZoneStopFlashForAll(this.id);
  }

  public StopFlashForPlayer(player: P): void | number {
    if (this.id === -1)
      return logger.warn(
        "[BaseGangZone]: Unable to stop flash the gangzone before create"
      );
    return GangZoneStopFlashForPlayer(player.id, this.id);
  }

  public isValid(): boolean {
    return IsValidGangZone(this.id);
  }

  public isPlayerIn(player: P): boolean {
    return IsPlayerInGangZone(player.id, this.id);
  }

  public isVisibleForPlayer(player: P): boolean {
    return IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  public getColorForPlayer(player: P): number {
    return GangZoneGetColorForPlayer(player.id, this.id);
  }

  public getFlashColorForPlayer(player: P): number {
    return GangZoneGetFlashColorForPlayer(player.id, this.id);
  }

  public isFlashingForPlayer(player: P): boolean {
    return IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  public getPos(): void | GangZonePos {
    return GangZoneGetPos(this.id);
  }

  public useCheck(toggle: boolean): void {
    UseGangZoneCheck(this.id, toggle);
  }
}
