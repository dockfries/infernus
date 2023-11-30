import { logger } from "core/logger";
import { InvalidEnum } from "core/enums";
import type { Player } from "core/controllers/player";
import type { Vehicle } from "core/controllers/vehicle";
import type { TDynamicArea, TDynamicAreaTypes } from "core/types";
import type { StreamerAreaTypes } from "@infernus/streamer";
import * as s from "@infernus/streamer";
import type { DynamicObject } from "../object";
import { Streamer } from "../common";

export class DynamicArea {
  static readonly areas = new Map<number, DynamicArea>();

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
    let { worldId, interiorId: interiorId, playerId } = this.sourceInfo;
    const { type, extended } = this.sourceInfo;

    if (extended) {
      if (typeof worldId === "number") worldId = [-1];
      else worldId ??= [-1];
      if (typeof interiorId === "number") interiorId = [-1];
      else interiorId ??= [-1];
      if (typeof playerId === "number") playerId = [-1];
      else playerId ??= [-1];

      if (type === "circle") {
        const { x, y, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid circle extend size");
        this._id = s.CreateDynamicCircleEx(
          x,
          y,
          size,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "cuboid") {
        const {
          minX: minx,
          minY: miny,
          minz,
          maxX: maxx,
          maxY: maxy,
          maxz,
        } = this.sourceInfo;
        this._id = s.CreateDynamicCuboidEx(
          minx,
          miny,
          minz,
          maxx,
          maxy,
          maxz,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "cylinder") {
        const { x, y, minZ: minz, maxZ: maxz, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid cylinder extend size");
        this._id = s.CreateDynamicCylinderEx(
          x,
          y,
          minz,
          maxz,
          size,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "polygon") {
        const { points, minz, maxz } = this.sourceInfo;
        if (points.length % 2 !== 0)
          return logger.warn(
            "[StreamerArea]: Unable to create polygon extended with asymmetrical points"
          );
        this._id = s.CreateDynamicPolygonEx(
          points,
          minz,
          maxz,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "rectangle") {
        const {
          minX: minx,
          minY: miny,
          maxX: maxx,
          maxY: maxy,
        } = this.sourceInfo;
        this._id = s.CreateDynamicRectangleEx(
          minx,
          miny,
          maxx,
          maxy,
          worldId,
          interiorId,
          playerId
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid sphere extended size");
        this._id = s.CreateDynamicSphereEx(
          x,
          y,
          z,
          size,
          worldId,
          interiorId,
          playerId
        );
      }
    } else {
      if (Array.isArray(worldId)) worldId = -1;
      else worldId ??= -1;
      if (Array.isArray(interiorId)) interiorId = -1;
      else interiorId ??= -1;
      if (Array.isArray(playerId)) playerId = -1;
      else playerId ??= -1;

      if (type === "circle") {
        const { x, y, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid circle size");
        this._id = s.CreateDynamicCircle(
          x,
          y,
          size,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "cuboid") {
        const {
          minX: minx,
          minY: miny,
          minz,
          maxX: maxx,
          maxY: maxy,
          maxz,
        } = this.sourceInfo;
        this._id = s.CreateDynamicCuboid(
          minx,
          miny,
          minz,
          maxx,
          maxy,
          maxz,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "cylinder") {
        const { x, y, minZ: minz, maxZ: maxz, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid cylinder size");
        this._id = s.CreateDynamicCylinder(
          x,
          y,
          minz,
          maxz,
          size,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "polygon") {
        const { points, minz, maxz } = this.sourceInfo;
        if (points.length % 2 !== 0)
          return logger.warn(
            "[StreamerArea]: Unable to create polygon with asymmetrical points"
          );
        this._id = s.CreateDynamicPolygon(
          points,
          minz,
          maxz,
          worldId,
          interiorId,
          playerId
        );
      } else if (type === "rectangle") {
        const {
          minX: minx,
          minY: miny,
          maxX: maxx,
          maxY: maxy,
        } = this.sourceInfo;
        this._id = s.CreateDynamicRectangle(
          minx,
          miny,
          maxx,
          maxy,
          worldId,
          interiorId,
          playerId
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0)
          return logger.error("[StreamerArea]: Invalid sphere size");
        this._id = s.CreateDynamicSphere(
          x,
          y,
          z,
          size,
          worldId,
          interiorId,
          playerId
        );
      }
    }
    DynamicArea.areas.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to destroy the area before create"
      );
    s.DestroyDynamicArea(this.id);
    DynamicArea.areas.delete(this.id);
    return this;
  }
  isValid(): boolean {
    if (this.id === -1) return false;
    return s.IsValidDynamicArea(this.id);
  }
  getType(): void | StreamerAreaTypes {
    if (this.id !== -1)
      return logger.warn("[StreamerArea]: Unable to get type before create");
    return s.GetDynamicAreaType(this.id);
  }
  getPolygonPoints(): void | number[] {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerArea]: Unable to get polygon points before create"
      );
    if (this.type !== "polygon") return undefined;
    return s.GetDynamicPolygonPoints(this.id);
  }
  getPolygonNumberPoints(): void | number {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerArea]: Unable to get polygon points number before create"
      );
    if (this.type !== "polygon") return undefined;
    return s.GetDynamicPolygonNumberPoints(this.id);
  }
  isPlayerIn<P extends Player>(player: P, recheck = false): boolean {
    if (this.id === -1) return false;
    return s.IsPlayerInDynamicArea(player.id, this.id, recheck);
  }
  static isPlayerInAny<P extends Player>(player: P, recheck = false): boolean {
    return s.IsPlayerInAnyDynamicArea(player.id, recheck);
  }
  isAnyPlayerIn(recheck = false): boolean {
    if (this.id === -1) return false;
    return s.IsAnyPlayerInDynamicArea(this.id, recheck);
  }
  static isAnyPlayerInAny(recheck = false): boolean {
    return s.IsAnyPlayerInAnyDynamicArea(recheck);
  }
  static getPlayerAreas<P extends Player, A extends DynamicArea>(
    player: P,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getPlayerAreasNumber(player)) return [];
    const ids = s.GetPlayerDynamicAreas(player.id);
    return ids.map((a) => areas.get(a));
  }
  static getPlayerAreasNumber<P extends Player>(player: P) {
    return s.GetPlayerNumberDynamicAreas(player.id);
  }
  isPointIn(x: number, y: number, z: number): boolean {
    if (this.id === -1) return false;
    return s.IsPointInDynamicArea(this.id, x, y, z);
  }
  static isPointInAny(x: number, y: number, z: number): boolean {
    return s.IsPointInAnyDynamicArea(x, y, z);
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
    return s.IsLineInDynamicArea(this.id, x1, y1, z1, x2, y2, z2);
  }
  static isLineInAny(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): boolean {
    return s.IsLineInAnyDynamicArea(x1, y1, z1, x2, y2, z2);
  }
  static getForPoint<A extends DynamicArea>(
    x: number,
    y: number,
    z: number,
    areas: Map<number, A>
  ): Array<A | undefined> {
    if (!DynamicArea.getNumberForPoint(x, y, z)) return [];
    const ids = s.GetDynamicAreasForPoint(x, y, z);
    return ids.map((a) => areas.get(a));
  }
  static getNumberForPoint(x: number, y: number, z: number): number {
    return s.GetNumberDynamicAreasForPoint(x, y, z);
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
    const ids = s.GetDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
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
    return s.GetNumberDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
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
    return s.AttachDynamicAreaToObject(
      this.id,
      obj.id,
      s.StreamerObjectTypes.DYNAMIC,
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
    return s.AttachDynamicAreaToPlayer(
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
    return s.AttachDynamicAreaToVehicle(
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
    return s.ToggleDynAreaSpectateMode(this.id, toggle);
  }
  isToggleSpectateMode(): boolean {
    if (this.id === -1) return false;
    return s.IsToggleDynAreaSpectateMode(this.id);
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerArea]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.AREA,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.AREA, this.id);
  }

  static getInstance(id: number) {
    return this.areas.get(id);
  }
  static getInstances() {
    return [...this.areas.values()];
  }
}
