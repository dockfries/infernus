import { logger } from "@/logger";
import { InvalidEnum } from "@/enums";
import { BasePlayer } from "@/controllers/player";
import { BaseVehicle } from "@/controllers/vehicle";
import { DynamicObject } from "@/controllers/streamer";
import { TDynamicArea, TDynamicAreaTypes } from "@/types";
import * as ows from "omp-wrapper-streamer";
import { areaBus, areaHooks } from "./areaBus";

export class DynamicArea {
  private sourceInfo: TDynamicArea;
  private _id = -1;
  public get type(): TDynamicAreaTypes {
    return this.sourceInfo.type;
  }
  public get id(): number {
    return this._id;
  }
  constructor(area: TDynamicArea) {
    this.sourceInfo = area;
  }
  public create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerArea]: Unable to create area again");
    let { worldid, interiorid, playerid } = this.sourceInfo;
    const { type, extended } = this.sourceInfo;

    if (extended) {
      if (typeof worldid === "number") worldid = [-1];
      else worldid ??= [-1];
      if (typeof interiorid === "number") interiorid = [-1];
      else interiorid ??= [-1];
      if (typeof playerid === "number") playerid = [-1];
      else playerid ??= [-1];

      if (type === "circle") {
        const { x, y, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid circle extend size");
        this._id = ows.CreateDynamicCircleEx(
          x,
          y,
          size,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "cuboid") {
        const { minx, miny, minz, maxx, maxy, maxz } = this.sourceInfo;
        this._id = ows.CreateDynamicCuboidEx(
          minx,
          miny,
          minz,
          maxx,
          maxy,
          maxz,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "cylinder") {
        const { x, y, minz, maxz, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid cylinder extend size");
        this._id = ows.CreateDynamicCylinderEx(
          x,
          y,
          minz,
          maxz,
          size,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "polygon") {
        const { points, minz, maxz } = this.sourceInfo;
        if (points.length % 2 !== 0)
          return logger.warn(
            "[StreamerArea]: Unable to create polygon extended with asymmetrical points"
          );
        this._id = ows.CreateDynamicPolygonEx(
          points,
          minz,
          maxz,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "rectangle") {
        const { minx, miny, maxx, maxy } = this.sourceInfo;
        this._id = ows.CreateDynamicRectangleEx(
          minx,
          miny,
          maxx,
          maxy,
          worldid,
          interiorid,
          playerid
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid sphere extended size");
        this._id = ows.CreateDynamicSphereEx(
          x,
          y,
          z,
          size,
          worldid,
          interiorid,
          playerid
        );
      }
    } else {
      if (Array.isArray(worldid)) worldid = -1;
      else worldid ??= -1;
      if (Array.isArray(interiorid)) interiorid = -1;
      else interiorid ??= -1;
      if (Array.isArray(playerid)) playerid = -1;
      else playerid ??= -1;

      if (type === "circle") {
        const { x, y, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid circle size");
        this._id = ows.CreateDynamicCircle(
          x,
          y,
          size,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "cuboid") {
        const { minx, miny, minz, maxx, maxy, maxz } = this.sourceInfo;
        this._id = ows.CreateDynamicCuboid(
          minx,
          miny,
          minz,
          maxx,
          maxy,
          maxz,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "cylinder") {
        const { x, y, minz, maxz, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid cylinder size");
        this._id = ows.CreateDynamicCylinder(
          x,
          y,
          minz,
          maxz,
          size,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "polygon") {
        const { points, minz, maxz } = this.sourceInfo;
        if (points.length % 2 !== 0)
          return logger.warn(
            "[StreamerArea]: Unable to create polygon with asymmetrical points"
          );
        this._id = ows.CreateDynamicPolygon(
          points,
          minz,
          maxz,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "rectangle") {
        const { minx, miny, maxx, maxy } = this.sourceInfo;
        this._id = ows.CreateDynamicRectangle(
          minx,
          miny,
          maxx,
          maxy,
          worldid,
          interiorid,
          playerid
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid sphere size");
        this._id = ows.CreateDynamicSphere(
          x,
          y,
          z,
          size,
          worldid,
          interiorid,
          playerid
        );
      }
    }
    areaBus.emit(areaHooks.created, this);
    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to destroy the area before create"
      );
    ows.DestroyDynamicArea(this.id);
    areaBus.emit(areaHooks.destroyed, this);
    return this;
  }
  public isValid(): boolean {
    if (this.id === -1) return false;
    return ows.IsValidDynamicArea(this.id);
  }
  public getType(): void | ows.StreamerAreaTypes {
    if (this.id !== -1)
      return logger.warn("[StreamerArea]: Unable to get type before create");
    return ows.GetDynamicAreaType(this.id);
  }
  public getPolygonPoints(): void | number[] {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerArea]: Unable to get polygon points before create"
      );
    if (this.type !== "polygon") return undefined;
    return ows.GetDynamicPolygonPoints(this.id);
  }
  public getPolygonNumberPoints(): void | number {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerArea]: Unable to get polygon points number before create"
      );
    if (this.type !== "polygon") return undefined;
    return ows.GetDynamicPolygonNumberPoints(this.id);
  }
  public isPlayerIn<P extends BasePlayer>(player: P, recheck = false): boolean {
    if (this.id === -1) return false;
    return ows.IsPlayerInDynamicArea(player.id, this.id, recheck);
  }
  public static isPlayerInAny<P extends BasePlayer>(
    player: P,
    recheck = false
  ): boolean {
    return ows.IsPlayerInAnyDynamicArea(player.id, recheck);
  }
  public isAnyPlayerIn(recheck = false): boolean {
    if (this.id === -1) return false;
    return ows.IsAnyPlayerInDynamicArea(this.id, recheck);
  }
  public static isAnyPlayerInAny(recheck = false): boolean {
    return ows.IsAnyPlayerInAnyDynamicArea(recheck);
  }
  public static getPlayerAreas<P extends BasePlayer, A extends DynamicArea>(
    player: P,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getPlayerAreasNumber(player)) return [];
    const ids = ows.GetPlayerDynamicAreas(player.id);
    return ids.map((a) => areas.get(a));
  }
  public static getPlayerAreasNumber<P extends BasePlayer>(player: P) {
    return ows.GetPlayerNumberDynamicAreas(player.id);
  }
  public isPointIn(x: number, y: number, z: number): boolean {
    if (this.id === -1) return false;
    return ows.IsPointInDynamicArea(this.id, x, y, z);
  }
  public static isPointInAny(x: number, y: number, z: number): boolean {
    return ows.IsPointInAnyDynamicArea(x, y, z);
  }
  public isLineIn(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): boolean {
    if (this.id === -1) return false;
    return ows.IsLineInDynamicArea(this.id, x1, y1, z1, x2, y2, z2);
  }
  public static isLineInAny(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): boolean {
    return ows.IsLineInAnyDynamicArea(x1, y1, z1, x2, y2, z2);
  }
  public static getForPoint<A extends DynamicArea>(
    x: number,
    y: number,
    z: number,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getNumberForPoint(x, y, z)) return [];
    const ids = ows.GetDynamicAreasForPoint(x, y, z);
    return ids.map((a) => areas.get(a));
  }
  public static getNumberForPoint(x: number, y: number, z: number): number {
    return ows.GetNumberDynamicAreasForPoint(x, y, z);
  }
  public static getForLine<A extends DynamicArea>(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getNumberForLine(x1, y1, z1, x2, y2, z2)) return [];
    const ids = ows.GetDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
    return ids.map((a) => areas.get(a));
  }
  public static getNumberForLine(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): number {
    return ows.GetNumberDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
  }
  public attachToObject<O extends DynamicObject>(
    obj: O,
    offsetx = 0.0,
    offsety = 0.0,
    offsetz = 0.0
  ): void | number {
    if (this.id === -1 || obj.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle attach to object before create"
      );
    return ows.AttachDynamicAreaToObject(
      this.id,
      obj.id,
      ows.StreamerObjectTypes.DYNAMIC,
      InvalidEnum.PLAYER_ID,
      offsetx,
      offsety,
      offsetz
    );
  }
  public attachToPlayer<P extends BasePlayer>(
    player: P,
    offsetx = 0.0,
    offsety = 0.0,
    offsetz = 0.0
  ): void | number {
    if (this.id === -1 || player.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle attach to player before create"
      );
    return ows.AttachDynamicAreaToPlayer(
      this.id,
      player.id,
      offsetx,
      offsety,
      offsetz
    );
  }
  public attachToVehicle<V extends BaseVehicle>(
    vehicle: V,
    offsetx = 0.0,
    offsety = 0.0,
    offsetz = 0.0
  ): void | number {
    if (this.id === -1 || vehicle.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle attach to vehicle before create"
      );
    return ows.AttachDynamicAreaToVehicle(
      this.id,
      vehicle.id,
      offsetx,
      offsety,
      offsetz
    );
  }
  public toggleSpectateMode(toggle: boolean): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle specate mode before create"
      );
    return ows.ToggleDynAreaSpectateMode(this.id, toggle);
  }
  public isToggleSpectateMode(): boolean {
    if (this.id === -1) return false;
    return ows.IsToggleDynAreaSpectateMode(this.id);
  }
}
