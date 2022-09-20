import type { BasePlayer } from "@/controllers/player";
import {
  OnDynamicObjectMoved,
  OnPlayerEditDynamicObject,
  OnPlayerSelectDynamicObject,
  OnPlayerShootDynamicObject,
} from "omp-wrapper-streamer";
import { DynamicObject } from "./baseObject";
import { objectBus, objectHooks } from "./objectBus";

export abstract class DynamicPickupEvent<
  P extends BasePlayer,
  O extends DynamicObject
> {
  public readonly objects = new Map<number, O>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    objectBus.on(objectHooks.created, (object: O) => {
      this.objects.set(object.id, object);
    });
    objectBus.on(objectHooks.destroyed, (object: O) => {
      this.objects.delete(object.id);
    });
    OnDynamicObjectMoved((id): number => {
      const o = this.objects.get(id);
      if (!o) return 0;
      return this.onMoved(o);
    });
    OnPlayerEditDynamicObject(
      (
        playerid: number,
        objectid: number,
        response: number,
        x: number,
        y: number,
        z: number,
        rx: number,
        ry: number,
        rz: number
      ): number => {
        const o = this.objects.get(objectid);
        if (!o) return 0;
        const p = this.players.get(playerid);
        if (!p) return 0;
        return this.onPlayerEdit(p, o, response, x, y, z, rx, ry, rz);
      }
    );
    OnPlayerSelectDynamicObject(
      (
        playerid: number,
        objectid: number,
        modelid: number,
        x: number,
        y: number,
        z: number
      ) => {
        const p = this.players.get(playerid);
        if (!p) return 0;
        const o = this.objects.get(objectid);
        if (!o) return 0;
        return this.onPlayerSelect(p, o, modelid, x, y, z);
      }
    );
    OnPlayerShootDynamicObject(
      (
        playerid: number,
        weaponid: number,
        objectid: number,
        x: number,
        y: number,
        z: number
      ) => {
        const p = this.players.get(playerid);
        if (!p) return 0;
        const o = this.objects.get(objectid);
        if (!o) return 0;
        return this.onPlayerShoot(p, weaponid, o, x, y, z);
      }
    );
  }

  protected abstract onMoved(object: O): number;

  protected abstract onPlayerEdit(
    player: P,
    object: O,
    response: number,
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number
  ): number;

  protected abstract onPlayerSelect(
    player: P,
    object: O,
    modelid: number,
    x: number,
    y: number,
    z: number
  ): number;

  protected abstract onPlayerShoot(
    player: P,
    weaponid: number,
    object: O,
    x: number,
    y: number,
    z: number
  ): number;

  public getObjectsArr(): Array<O> {
    return [...this.objects.values()];
  }
}
