import { logger } from "@/logger";
import { TDynamicArea } from "@/types";
import * as ows from "omp-wrapper-streamer";
import { areaBus, areaHooks } from "./areaBus";

export class DynamicArea {
  private sourceInfo: TDynamicArea;
  private _id = -1;
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
}
