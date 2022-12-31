import type { BasePlayer } from "@/controllers/player";
import { EditResponseTypesEnum } from "@/enums";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnDynamicObjectMoved,
  OnPlayerEditDynamicObject,
  OnPlayerSelectDynamicObject,
  OnPlayerShootDynamicObject,
  StreamerItemTypes,
} from "omp-wrapper-streamer";
import { Streamer } from "../common";
import { DynamicObject } from "./baseObject";
import { objectBus, objectHooks } from "./objectBus";

export abstract class DynamicObjectEvent<
  P extends BasePlayer,
  O extends DynamicObject
> {
  private readonly objects = new Map<number, O>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    objectBus.on(objectHooks.created, (object: O) => {
      this.objects.set(object.id, object);
    });
    objectBus.on(objectHooks.destroyed, (object: O) => {
      this.objects.delete(object.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.objects.forEach((o) => o.destroy());
        this.objects.clear();
      });
    }
    OnDynamicObjectMoved((id): number => {
      const o = this.objects.get(id);
      if (!o) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onMoved,
        "OnDynamicObjectMoved"
      );
      return pFn(o);
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
        const pFn = promisifyCallback.call(
          this,
          this.onPlayerEdit,
          "OnPlayerEditDynamicObject"
        );
        return pFn(p, o, response, x, y, z, rx, ry, rz);
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
        const pFn = promisifyCallback.call(
          this,
          this.onPlayerSelect,
          "OnPlayerSelectDynamicObject"
        );
        return pFn(p, o, modelid, x, y, z);
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
        const pFn = promisifyCallback.call(
          this,
          this.onPlayerShoot,
          "OnPlayerShootDynamicObject"
        );
        return pFn(p, weaponid, o, x, y, z);
      }
    );
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.OBJECT) {
        const obj = this.objects.get(item);
        const p = this.players.get(player);
        if (obj && p)
          return promisifyCallback.call(
            this,
            this.onStreamIn,
            "Streamer_OnItemStreamIn"
          )(obj, p);
      }
      return 1;
    });
    Streamer.onItemStreamOut((type, item, player) => {
      if (type === StreamerItemTypes.OBJECT) {
        const obj = this.objects.get(item);
        const p = this.players.get(player);
        if (obj && p)
          return promisifyCallback.call(
            this,
            this.onStreamOut,
            "Streamer_OnItemStreamOut"
          )(obj, p);
      }
      return 1;
    });
  }

  protected abstract onMoved(object: O): TCommonCallback;

  protected abstract onPlayerEdit(
    player: P,
    object: O,
    response: EditResponseTypesEnum,
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number
  ): TCommonCallback;

  protected abstract onPlayerSelect(
    player: P,
    object: O,
    modelid: number,
    x: number,
    y: number,
    z: number
  ): TCommonCallback;

  protected abstract onPlayerShoot(
    player: P,
    weaponid: number,
    object: O,
    x: number,
    y: number,
    z: number
  ): TCommonCallback;

  protected abstract onStreamIn(object: O, player: P): TCommonCallback;
  protected abstract onStreamOut(object: O, player: P): TCommonCallback;

  public getObjectsArr(): Array<O> {
    return [...this.objects.values()];
  }

  public getObjectsMap(): Map<number, O> {
    return this.objects;
  }
}
