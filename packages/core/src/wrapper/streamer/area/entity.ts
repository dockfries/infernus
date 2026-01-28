import { InvalidEnum } from "core/enums";
import type { Player } from "core/components/player";
import type { Vehicle } from "core/components/vehicle";
import type { TDynamicArea } from "core/types";
import type { StreamerAreaTypes } from "@infernus/streamer";
import * as s from "@infernus/streamer";
import type { DynamicObject } from "../object";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { dynamicAreasPool } from "core/utils/pools";
import { DynamicAreaException } from "core/exceptions";

export class DynamicArea {
  private sourceInfo: TDynamicArea | null = null;
  private _id: number = s.StreamerMiscellaneous.INVALID_ID;
  get type() {
    return this.sourceInfo?.type ?? undefined;
  }
  get id(): number {
    return this._id;
  }
  constructor(areaOrId: TDynamicArea | number) {
    if (typeof areaOrId === "number") {
      if (areaOrId === s.StreamerMiscellaneous.INVALID_ID) {
        throw new DynamicAreaException("Invalid id");
      }

      const obj = DynamicArea.getInstance(areaOrId);
      if (obj) {
        return obj;
      }
      this._id = areaOrId;
      dynamicAreasPool.set(this._id, this);
    } else {
      this.sourceInfo = areaOrId;
    }
  }
  create(): this {
    if (this.id !== s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicAreaException("Cannot create again");
    if (!this.sourceInfo)
      throw new DynamicAreaException("Cannot create with only id");
    let { worldId, interiorId, playerId, priority } = this.sourceInfo;
    priority ??= 0;
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
          throw new DynamicAreaException("Invalid circle extend size");
        this._id = DynamicArea.__inject__.createCircleEx(
          x,
          y,
          size,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "cuboid") {
        const { minX, minY, minZ, maxX, maxY, maxZ } = this.sourceInfo;
        this._id = DynamicArea.__inject__.createCuboidEx(
          minX,
          minY,
          minZ,
          maxX,
          maxY,
          maxZ,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "cylinder") {
        const { x, y, minZ: minZ, maxZ: maxZ, size } = this.sourceInfo;
        if (size < 0)
          throw new DynamicAreaException("Invalid cylinder extend size");
        this._id = DynamicArea.__inject__.createCylinderEx(
          x,
          y,
          minZ,
          maxZ,
          size,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "polygon") {
        const { points, minZ, maxZ } = this.sourceInfo;
        if (points.length % 2 !== 0)
          throw new DynamicAreaException(
            "Cannot create polygon extended with asymmetrical points",
          );
        this._id = DynamicArea.__inject__.createPolygonEx(
          points,
          minZ,
          maxZ,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "rectangle") {
        const {
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        } = this.sourceInfo;
        this._id = DynamicArea.__inject__.createRectangleEx(
          minX,
          minY,
          maxX,
          maxY,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0)
          throw new DynamicAreaException("Invalid sphere extended size");
        this._id = DynamicArea.__inject__.createSphereEx(
          x,
          y,
          z,
          size,
          worldId,
          interiorId,
          playerId,
          priority,
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
        if (size < 0) throw new DynamicAreaException("Invalid circle size");
        this._id = DynamicArea.__inject__.createCircle(
          x,
          y,
          size,
          worldId,
          interiorId,
          playerId,
          priority,
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
        this._id = DynamicArea.__inject__.createCuboid(
          minX,
          minY,
          minZ,
          maxX,
          maxY,
          maxZ,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "cylinder") {
        const { x, y, minZ: minZ, maxZ: maxZ, size } = this.sourceInfo;
        if (size < 0) throw new DynamicAreaException("Invalid cylinder size");
        this._id = DynamicArea.__inject__.createCylinder(
          x,
          y,
          minZ,
          maxZ,
          size,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "polygon") {
        const { points, minZ, maxZ } = this.sourceInfo;
        if (points.length % 2 !== 0)
          throw new DynamicAreaException(
            "Cannot create polygon with asymmetrical points",
          );
        this._id = DynamicArea.__inject__.createPolygon(
          points,
          minZ,
          maxZ,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else if (type === "rectangle") {
        const {
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        } = this.sourceInfo;
        this._id = DynamicArea.__inject__.createRectangle(
          minX,
          minY,
          maxX,
          maxY,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      } else {
        const { x, y, z, size } = this.sourceInfo;
        if (size < 0) throw new DynamicAreaException("Invalid sphere size");
        this._id = DynamicArea.__inject__.createSphere(
          x,
          y,
          z,
          size,
          worldId,
          interiorId,
          playerId,
          priority,
        );
      }
    }
    dynamicAreasPool.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID && !INTERNAL_FLAGS.skip)
      throw new DynamicAreaException("Cannot destroy the area before create");
    if (!INTERNAL_FLAGS.skip) {
      DynamicArea.__inject__.destroy(this.id);
    }
    dynamicAreasPool.delete(this.id);
    this._id = s.StreamerMiscellaneous.INVALID_ID;
    return this;
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== s.StreamerMiscellaneous.INVALID_ID)
      return true;
    return DynamicArea.isValid(this.id);
  }
  getType(): StreamerAreaTypes {
    if (this.id !== s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicAreaException("Cannot get type before create");
    return DynamicArea.__inject__.getType(this.id);
  }
  getPolygonPoints() {
    return DynamicArea.__inject__.getPolygonPoints(this.id);
  }
  getPolygonNumberPoints(): number {
    if (this.id !== s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicAreaException(
        "Cannot getPolygonNumberPoints number before create",
      );
    if (this.type !== "polygon")
      throw new DynamicAreaException(
        "getPolygonNumberPoints invalid area type",
      );
    return DynamicArea.__inject__.getPolygonNumberPoints(this.id);
  }
  isPlayerIn(player: Player, recheck = false): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicArea.__inject__.isPlayerIn(player.id, this.id, recheck);
  }
  static isPlayerInAny(player: Player, recheck = false): boolean {
    return DynamicArea.__inject__.isPlayerInAny(player.id, recheck);
  }
  isAnyPlayerIn(recheck = false): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicArea.__inject__.isAnyPlayerIn(this.id, recheck);
  }
  static isAnyPlayerInAny(recheck = false): boolean {
    return DynamicArea.__inject__.isAnyPlayerInAny(recheck);
  }
  static getPlayerAreas(player: Player): Array<DynamicArea | undefined> {
    if (!DynamicArea.getPlayerAreasNumber(player)) return [];
    const ids = DynamicArea.__inject__.getPlayerAreas(player.id).areas;
    return ids.map((a) => dynamicAreasPool.get(a));
  }
  static getPlayerAreasNumber(player: Player) {
    return DynamicArea.__inject__.getPlayerAreasNumber(player.id);
  }
  isPointIn(x: number, y: number, z: number): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicArea.__inject__.isPointIn(this.id, x, y, z);
  }
  static isPointInAny(x: number, y: number, z: number): boolean {
    return DynamicArea.__inject__.isPointInAny(x, y, z);
  }
  isLineIn(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
  ): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicArea.__inject__.isLineIn(this.id, x1, y1, z1, x2, y2, z2);
  }
  static isLineInAny(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
  ): boolean {
    return DynamicArea.__inject__.isLineInAny(x1, y1, z1, x2, y2, z2);
  }
  static getForPoint(x: number, y: number, z: number) {
    if (!DynamicArea.getNumberForPoint(x, y, z)) return [];
    const ids = DynamicArea.__inject__.getForPoint(x, y, z).areas;

    return ids.map((a) => DynamicArea.getInstance(a)).filter(Boolean);
  }
  static getNumberForPoint(x: number, y: number, z: number): number {
    return DynamicArea.__inject__.getNumberForPoint(x, y, z);
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
    const ids = DynamicArea.__inject__.getForLine(x1, y1, z1, x2, y2, z2).areas;

    return ids.map((a) => DynamicArea.getInstance(a)).filter(Boolean);
  }
  static getNumberForLine(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
  ): number {
    return DynamicArea.__inject__.getNumberForLine(x1, y1, z1, x2, y2, z2);
  }
  attachToObject(
    obj: DynamicObject,
    offsetX = 0.0,
    offsetY = 0.0,
    offsetZ = 0.0,
  ): number {
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      obj.id === s.StreamerMiscellaneous.INVALID_ID
    )
      throw new DynamicAreaException(
        "Cannot toggle attach to object before create",
      );
    return DynamicArea.__inject__.attachToObject(
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
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      player.id === InvalidEnum.PLAYER_ID
    )
      throw new DynamicAreaException(
        "Cannot toggle attach to player before create",
      );
    return DynamicArea.__inject__.attachToPlayer(
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
    if (
      this.id === s.StreamerMiscellaneous.INVALID_ID ||
      vehicle.id === InvalidEnum.VEHICLE_ID
    )
      throw new DynamicAreaException(
        "Cannot toggle attach to vehicle before create",
      );
    return DynamicArea.__inject__.attachToVehicle(
      this.id,
      vehicle.id,
      offsetX,
      offsetY,
      offsetZ,
    );
  }
  toggleSpectateMode(toggle: boolean): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicAreaException(
        "Cannot toggle spectate mode before create",
      );
    return DynamicArea.__inject__.toggleSpectateMode(this.id, toggle);
  }
  isToggleSpectateMode(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicArea.__inject__.isToggleSpectateMode(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicAreaException("Cannot toggle callbacks before create");
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.AREA,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.AREA, this.id);
  }
  static isValid = s.IsValidDynamicArea;
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(player, s.StreamerItemTypes.AREA, update);
  }
  static hideForPlayer(player: Player, z = -50000) {
    Streamer.updateEx(player, 0, 0, z);
    return this.togglePlayerUpdate(player, false);
  }
  static showForPlayer(player: Player, z = -50000) {
    const pos = player.getPos();
    if (pos.ret) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }

  static getInstance(id: number) {
    return dynamicAreasPool.get(id);
  }
  static getInstances() {
    return [...dynamicAreasPool.values()];
  }

  static __inject__ = {
    createCircleEx: s.CreateDynamicCircleEx,
    createCuboidEx: s.CreateDynamicCuboidEx,
    createCylinderEx: s.CreateDynamicCylinderEx,
    createPolygonEx: s.CreateDynamicPolygonEx,
    createRectangleEx: s.CreateDynamicRectangleEx,
    createSphereEx: s.CreateDynamicSphereEx,
    createCircle: s.CreateDynamicCircle,
    createCuboid: s.CreateDynamicCuboid,
    createCylinder: s.CreateDynamicCylinder,
    createPolygon: s.CreateDynamicPolygon,
    createRectangle: s.CreateDynamicRectangle,
    createSphere: s.CreateDynamicSphere,
    destroy: s.DestroyDynamicArea,
    getType: s.GetDynamicAreaType,
    getPolygonPoints: s.GetDynamicPolygonPoints,
    getPolygonNumberPoints: s.GetDynamicPolygonNumberPoints,
    isPlayerIn: s.IsPlayerInDynamicArea,
    isPlayerInAny: s.IsPlayerInAnyDynamicArea,
    isAnyPlayerIn: s.IsAnyPlayerInDynamicArea,
    isAnyPlayerInAny: s.IsAnyPlayerInAnyDynamicArea,
    getPlayerAreas: s.GetPlayerDynamicAreas,
    getPlayerAreasNumber: s.GetPlayerNumberDynamicAreas,
    isPointIn: s.IsPointInDynamicArea,
    isPointInAny: s.IsPointInAnyDynamicArea,
    isLineIn: s.IsLineInDynamicArea,
    isLineInAny: s.IsLineInAnyDynamicArea,
    getForPoint: s.GetDynamicAreasForPoint,
    getNumberForPoint: s.GetNumberDynamicAreasForPoint,
    getForLine: s.GetDynamicAreasForLine,
    getNumberForLine: s.GetNumberDynamicAreasForLine,
    attachToObject: s.AttachDynamicAreaToObject,
    attachToPlayer: s.AttachDynamicAreaToPlayer,
    attachToVehicle: s.AttachDynamicAreaToVehicle,
    toggleSpectateMode: s.ToggleDynAreaSpectateMode,
    isToggleSpectateMode: s.IsToggleDynAreaSpectateMode,
  };
}
