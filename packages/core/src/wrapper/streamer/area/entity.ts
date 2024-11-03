import { InvalidEnum } from "core/enums";
import type { Player } from "core/controllers/player";
import type { Vehicle } from "core/controllers/vehicle";
import type { TDynamicArea, TDynamicAreaTypes } from "core/types";
import type { StreamerAreaTypes } from "@infernus/streamer";
import * as s from "@infernus/streamer";
import type { DynamicObject } from "../object";
import { Streamer } from "../common";
import { streamerFlag } from "../flag";

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
  create(): this {
    if (this.id !== -1)
      throw new Error("[StreamerArea]: Unable to create area again");
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
          throw new Error("[StreamerArea]: Invalid circle extend size");
        this._id = s.CreateDynamicCircleEx(
          x,
          y,
          size,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "cuboid") {
        const {
          minX: minX,
          minY: minY,
          minZ,
          maxX: maxX,
          maxY: maxY,
          maxZ,
        } = this.sourceInfo;
        this._id = s.CreateDynamicCuboidEx(
          minX,
          minY,
          minZ,
          maxX,
          maxY,
          maxZ,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "cylinder") {
        const { x, y, minZ: minZ, maxZ: maxZ, size } = this.sourceInfo;
        if (size < 0)
          throw new Error("[StreamerArea]: Invalid cylinder extend size");
        this._id = s.CreateDynamicCylinderEx(
          x,
          y,
          minZ,
          maxZ,
          size,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "polygon") {
        const { points, minZ, maxZ } = this.sourceInfo;
        if (points.length % 2 !== 0)
          throw new Error(
            "[StreamerArea]: Unable to create polygon extended with asymmetrical points",
          );
        this._id = s.CreateDynamicPolygonEx(
          points,
          minZ,
          maxZ,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "rectangle") {
        const {
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        } = this.sourceInfo;
        this._id = s.CreateDynamicRectangleEx(
          minX,
          minY,
          maxX,
          maxY,
          worldId,
          interiorId,
          playerId,
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0)
          throw new Error("[StreamerArea]: Invalid sphere extended size");
        this._id = s.CreateDynamicSphereEx(
          x,
          y,
          z,
          size,
          worldId,
          interiorId,
          playerId,
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
        if (size < 0) throw new Error("[StreamerArea]: Invalid circle size");
        this._id = s.CreateDynamicCircle(
          x,
          y,
          size,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "cuboid") {
        const {
          minX: minX,
          minY: minY,
          minZ,
          maxX: maxX,
          maxY: maxY,
          maxZ,
        } = this.sourceInfo;
        this._id = s.CreateDynamicCuboid(
          minX,
          minY,
          minZ,
          maxX,
          maxY,
          maxZ,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "cylinder") {
        const { x, y, minZ: minZ, maxZ: maxZ, size } = this.sourceInfo;
        if (size < 0) throw new Error("[StreamerArea]: Invalid cylinder size");
        this._id = s.CreateDynamicCylinder(
          x,
          y,
          minZ,
          maxZ,
          size,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "polygon") {
        const { points, minZ, maxZ } = this.sourceInfo;
        if (points.length % 2 !== 0)
          throw new Error(
            "[StreamerArea]: Unable to create polygon with asymmetrical points",
          );
        this._id = s.CreateDynamicPolygon(
          points,
          minZ,
          maxZ,
          worldId,
          interiorId,
          playerId,
        );
      } else if (type === "rectangle") {
        const {
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        } = this.sourceInfo;
        this._id = s.CreateDynamicRectangle(
          minX,
          minY,
          maxX,
          maxY,
          worldId,
          interiorId,
          playerId,
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0) throw new Error("[StreamerArea]: Invalid sphere size");
        this._id = s.CreateDynamicSphere(
          x,
          y,
          z,
          size,
          worldId,
          interiorId,
          playerId,
        );
      }
    }
    DynamicArea.areas.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === -1 && !streamerFlag.skip)
      throw new Error(
        "[StreamerArea]: Unable to destroy the area before create",
      );
    if (!streamerFlag.skip) s.DestroyDynamicArea(this.id);
    DynamicArea.areas.delete(this.id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    if (streamerFlag.skip && this.id !== -1) return true;
    return s.IsValidDynamicArea(this.id);
  }
  getType(): StreamerAreaTypes {
    if (this.id !== -1)
      throw new Error("[StreamerArea]: Unable to get type before create");
    return s.GetDynamicAreaType(this.id);
  }
  getPolygonPoints(): number[] {
    if (this.id !== -1)
      throw new Error(
        "[StreamerArea]: Unable to getPolygonPoints before create",
      );
    if (this.type !== "polygon")
      throw new Error("[StreamerArea]: getPolygonPoints invalid area type");
    return s.GetDynamicPolygonPoints(this.id);
  }
  getPolygonNumberPoints(): number {
    if (this.id !== -1)
      throw new Error(
        "[StreamerArea]: Unable to getPolygonNumberPoints number before create",
      );
    if (this.type !== "polygon")
      throw new Error(
        "[StreamerArea]: getPolygonNumberPoints invalid area type",
      );
    return s.GetDynamicPolygonNumberPoints(this.id);
  }
  isPlayerIn(player: Player, recheck = false): boolean {
    if (this.id === -1) return false;
    return s.IsPlayerInDynamicArea(player.id, this.id, recheck);
  }
  static isPlayerInAny(player: Player, recheck = false): boolean {
    return s.IsPlayerInAnyDynamicArea(player.id, recheck);
  }
  isAnyPlayerIn(recheck = false): boolean {
    if (this.id === -1) return false;
    return s.IsAnyPlayerInDynamicArea(this.id, recheck);
  }
  static isAnyPlayerInAny(recheck = false): boolean {
    return s.IsAnyPlayerInAnyDynamicArea(recheck);
  }
  static getPlayerAreas(player: Player): Array<DynamicArea | undefined> {
    if (!DynamicArea.getPlayerAreasNumber(player)) return [];
    const ids = s.GetPlayerDynamicAreas(player.id);
    return ids.map((a) => DynamicArea.areas.get(a));
  }
  static getPlayerAreasNumber(player: Player) {
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
    z2: number,
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
    z2: number,
  ): boolean {
    return s.IsLineInAnyDynamicArea(x1, y1, z1, x2, y2, z2);
  }
  static getForPoint(x: number, y: number, z: number) {
    if (!DynamicArea.getNumberForPoint(x, y, z)) return [];
    const ids = s.GetDynamicAreasForPoint(x, y, z);

    return ids.map((a) => DynamicArea.getInstance(a)!);
  }
  static getNumberForPoint(x: number, y: number, z: number): number {
    return s.GetNumberDynamicAreasForPoint(x, y, z);
  }
  static getForLine(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
  ) {
    if (!DynamicArea.getNumberForLine(x1, y1, z1, x2, y2, z2)) return [];
    const ids = s.GetDynamicAreasForLine(x1, y1, z1, x2, y2, z2);

    return ids.map((a) => DynamicArea.areas.get(a)!);
  }
  static getNumberForLine(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
  ): number {
    return s.GetNumberDynamicAreasForLine(x1, y1, z1, x2, y2, z2);
  }
  attachToObject(
    obj: DynamicObject,
    offsetX = 0.0,
    offsetY = 0.0,
    offsetZ = 0.0,
  ): number {
    if (this.id === -1 || obj.id === -1)
      throw new Error(
        "[StreamerArea]: Unable to toggle attach to object before create",
      );
    return s.AttachDynamicAreaToObject(
      this.id,
      obj.id,
      s.StreamerObjectTypes.DYNAMIC,
      InvalidEnum.PLAYER_ID,
      offsetX,
      offsetY,
      offsetZ,
    );
  }
  attachToPlayer(
    player: Player,
    offsetX = 0.0,
    offsetY = 0.0,
    offsetZ = 0.0,
  ): number {
    if (this.id === -1 || player.id === -1)
      throw new Error(
        "[StreamerArea]: Unable to toggle attach to player before create",
      );
    return s.AttachDynamicAreaToPlayer(
      this.id,
      player.id,
      offsetX,
      offsetY,
      offsetZ,
    );
  }
  attachToVehicle(
    vehicle: Vehicle,
    offsetX = 0.0,
    offsetY = 0.0,
    offsetZ = 0.0,
  ): number {
    if (this.id === -1 || vehicle.id === -1)
      throw new Error(
        "[StreamerArea]: Unable to toggle attach to vehicle before create",
      );
    return s.AttachDynamicAreaToVehicle(
      this.id,
      vehicle.id,
      offsetX,
      offsetY,
      offsetZ,
    );
  }
  toggleSpectateMode(toggle: boolean): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerArea]: Unable to toggle specate mode before create",
      );
    return s.ToggleDynAreaSpectateMode(this.id, toggle);
  }
  isToggleSpectateMode(): boolean {
    if (this.id === -1) return false;
    return s.IsToggleDynAreaSpectateMode(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerArea]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.AREA,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.AREA, this.id);
  }

  static getInstance(id: number) {
    return this.areas.get(id);
  }
  static getInstances() {
    return [...this.areas.values()];
  }
}
