import { logger } from "core/logger";
import { InvalidEnum } from "core/enums";
import type { Player } from "core/controllers/player";
import type { Vehicle } from "core/controllers/vehicle";
import type { TDynamicArea, TDynamicAreaTypes } from "core/types";
import { areaBus, areaHooks } from "./areaBus";
import type { StreamerAreaTypes } from "@infernus/streamer";
import {
  AttachDynamicAreaToObject,
  AttachDynamicAreaToPlayer,
  AttachDynamicAreaToVehicle,
  CreateDynamicCircle,
  CreateDynamicCircleEx,
  CreateDynamicCuboid,
  CreateDynamicCuboidEx,
  CreateDynamicCylinder,
  CreateDynamicCylinderEx,
  CreateDynamicPolygon,
  CreateDynamicPolygonEx,
  CreateDynamicRectangle,
  CreateDynamicRectangleEx,
  CreateDynamicSphere,
  CreateDynamicSphereEx,
  DestroyDynamicArea,
  GetDynamicAreasForLine,
  GetDynamicAreasForPoint,
  GetDynamicAreaType,
  GetDynamicPolygonNumberPoints,
  GetDynamicPolygonPoints,
  GetNumberDynamicAreasForLine,
  GetNumberDynamicAreasForPoint,
  GetPlayerDynamicAreas,
  GetPlayerNumberDynamicAreas,
  IsAnyPlayerInAnyDynamicArea,
  IsAnyPlayerInDynamicArea,
  IsLineInAnyDynamicArea,
  IsLineInDynamicArea,
  IsPlayerInAnyDynamicArea,
  IsPlayerInDynamicArea,
  IsPointInAnyDynamicArea,
  IsPointInDynamicArea,
  IsToggleDynAreaSpectateMode,
  IsValidDynamicArea,
  StreamerItemTypes,
  StreamerObjectTypes,
  ToggleDynAreaSpectateMode,
} from "@infernus/streamer";
import type { DynamicObject } from "../object";
import { Streamer } from "../common";

export class DynamicArea {
  private sourceInfo: TDynamicArea;
  private _id = -1;
  get type(): TDynamicAreaTypes {
    return this.sourceInfo.type;
  }
  get id(): number {
    return this._id;
  }
  constructor(area: TDynamicArea) {
    this.sourceInfo = area;
  }
  create(): void | this {
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
        this._id = CreateDynamicCircleEx(
          x,
          y,
          size,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "cuboid") {
        const { minx, miny, minz, maxx, maxy, maxz } = this.sourceInfo;
        this._id = CreateDynamicCuboidEx(
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
        this._id = CreateDynamicCylinderEx(
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
        this._id = CreateDynamicPolygonEx(
          points,
          minz,
          maxz,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "rectangle") {
        const { minx, miny, maxx, maxy } = this.sourceInfo;
        this._id = CreateDynamicRectangleEx(
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
        this._id = CreateDynamicSphereEx(
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
        this._id = CreateDynamicCircle(
          x,
          y,
          size,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "cuboid") {
        const { minx, miny, minz, maxx, maxy, maxz } = this.sourceInfo;
        this._id = CreateDynamicCuboid(
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
        this._id = CreateDynamicCylinder(
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
        this._id = CreateDynamicPolygon(
          points,
          minz,
          maxz,
          worldid,
          interiorid,
          playerid
        );
      } else if (type === "rectangle") {
        const { minx, miny, maxx, maxy } = this.sourceInfo;
        this._id = CreateDynamicRectangle(
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
        this._id = CreateDynamicSphere(
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
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to destroy the area before create"
      );
    DestroyDynamicArea(this.id);
    areaBus.emit(areaHooks.destroyed, this);
    return this;
  }
  isValid(): boolean {
    if (this.id === -1) return false;
    return IsValidDynamicArea(this.id);
  }
  getType(): void | StreamerAreaTypes {
    if (this.id !== -1)
      return logger.warn("[StreamerArea]: Unable to get type before create");
    return GetDynamicAreaType(this.id);
  }
  getPolygonPoints(): void | number[] {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerArea]: Unable to get polygon points before create"
      );
    if (this.type !== "polygon") return undefined;
    return GetDynamicPolygonPoints(this.id);
  }
  getPolygonNumberPoints(): void | number {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerArea]: Unable to get polygon points number before create"
      );
    if (this.type !== "polygon") return undefined;
    return GetDynamicPolygonNumberPoints(this.id);
  }
  isPlayerIn<P extends Player>(player: P, recheck = false): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicArea(player.id, this.id, recheck);
  }
  static isPlayerInAny<P extends Player>(player: P, recheck = false): boolean {
    return IsPlayerInAnyDynamicArea(player.id, recheck);
  }
  isAnyPlayerIn(recheck = false): boolean {
    if (this.id === -1) return false;
    return IsAnyPlayerInDynamicArea(this.id, recheck);
  }
  static isAnyPlayerInAny(recheck = false): boolean {
    return IsAnyPlayerInAnyDynamicArea(recheck);
  }
  static getPlayerAreas<P extends Player, A extends DynamicArea>(
    player: P,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getPlayerAreasNumber(player)) return [];
    const ids = GetPlayerDynamicAreas(player.id);
    return ids.map((a) => areas.get(a));
  }
  static getPlayerAreasNumber<P extends Player>(player: P) {
    return GetPlayerNumberDynamicAreas(player.id);
  }
  isPointIn(x: number, y: number, z: number): boolean {
    if (this.id === -1) return false;
    return IsPointInDynamicArea(this.id, x, y, z);
  }
  static isPointInAny(x: number, y: number, z: number): boolean {
    return IsPointInAnyDynamicArea(x, y, z);
  }
  isLineIn(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): boolean {
    if (this.id === -1) return false;
    return IsLineInDynamicArea(this.id, x1, y1, z1, x2, y2, z2);
  }
  static isLineInAny(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): boolean {
    return IsLineInAnyDynamicArea(x1, y1, z1, x2, y2, z2);
  }
  static getForPoint<A extends DynamicArea>(
    x: number,
    y: number,
    z: number,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getNumberForPoint(x, y, z)) return [];
    const ids = GetDynamicAreasForPoint(x, y, z);
    return ids.map((a) => areas.get(a));
  }
  static getNumberForPoint(x: number, y: number, z: number): number {
    return GetNumberDynamicAreasForPoint(x, y, z);
  }
  static getForLine<A extends DynamicArea>(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getNumberForLine(x1, y1, z1, x2, y2, z2)) return [];
    const ids = GetDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
    return ids.map((a) => areas.get(a));
  }
  static getNumberForLine(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): number {
    return GetNumberDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
  }
  attachToObject<O extends DynamicObject>(
    obj: O,
    offsetx = 0.0,
    offsety = 0.0,
    offsetz = 0.0
  ): void | number {
    if (this.id === -1 || obj.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle attach to object before create"
      );
    return AttachDynamicAreaToObject(
      this.id,
      obj.id,
      StreamerObjectTypes.DYNAMIC,
      InvalidEnum.PLAYER_ID,
      offsetx,
      offsety,
      offsetz
    );
  }
  attachToPlayer<P extends Player>(
    player: P,
    offsetx = 0.0,
    offsety = 0.0,
    offsetz = 0.0
  ): void | number {
    if (this.id === -1 || player.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle attach to player before create"
      );
    return AttachDynamicAreaToPlayer(
      this.id,
      player.id,
      offsetx,
      offsety,
      offsetz
    );
  }
  attachToVehicle<V extends Vehicle>(
    vehicle: V,
    offsetx = 0.0,
    offsety = 0.0,
    offsetz = 0.0
  ): void | number {
    if (this.id === -1 || vehicle.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle attach to vehicle before create"
      );
    return AttachDynamicAreaToVehicle(
      this.id,
      vehicle.id,
      offsetx,
      offsety,
      offsetz
    );
  }
  toggleSpectateMode(toggle: boolean): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle specate mode before create"
      );
    return ToggleDynAreaSpectateMode(this.id, toggle);
  }
  isToggleSpectateMode(): boolean {
    if (this.id === -1) return false;
    return IsToggleDynAreaSpectateMode(this.id);
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.AREA,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.AREA, this.id);
  }
}
