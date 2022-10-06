import type { BasePlayer } from "@/controllers/player";
import type { BodyPartsEnum } from "@/enums";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import {
  OnDynamicActorStreamIn,
  OnDynamicActorStreamOut,
  OnPlayerGiveDamageDynamicActor,
} from "omp-wrapper-streamer";
import { actorBus, actorHooks } from "./actorBus";
import { DynamicActor } from "./baseActor";

export abstract class DynamicActorEvent<
  P extends BasePlayer,
  A extends DynamicActor
> {
  private readonly actors = new Map<number, A>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    actorBus.on(actorHooks.created, (actor: A) => {
      this.actors.set(actor.id, actor);
    });
    actorBus.on(actorHooks.destroyed, (actor: A) => {
      this.actors.delete(actor.id);
    });
    OnDynamicActorStreamIn((actorid: number, forplayerid: number): number => {
      const act = this.actors.get(actorid);
      if (!act) return 0;
      const p = this.players.get(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onStreamIn,
        "OnDynamicActorStreamIn"
      );
      return pFn(act, p);
    });
    OnDynamicActorStreamOut((actorid: number, forplayerid: number): number => {
      const act = this.actors.get(actorid);
      if (!act) return 0;
      const p = this.players.get(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onStreamOut,
        "OnDynamicActorStreamOut"
      );
      return pFn(act, p);
    });
    OnPlayerGiveDamageDynamicActor(
      (
        playerid: number,
        actorid: number,
        amount: number,
        weaponid: number,
        bodypart: number
      ): number => {
        const act = this.actors.get(actorid);
        if (!act) return 0;
        const p = this.players.get(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onPlayerGiveDamage,
          "OnPlayerGiveDamageDynamicActor"
        );
        return pFn(p, act, amount, weaponid, bodypart);
      }
    );
  }

  protected abstract onStreamIn(actor: A, player: P): TCommonCallback;
  protected abstract onStreamOut(actor: A, player: P): TCommonCallback;
  protected abstract onPlayerGiveDamage(
    player: P,
    actor: A,
    amount: number,
    weaponid: number,
    bodypart: BodyPartsEnum
  ): TCommonCallback;

  public getActorsArr(): Array<A> {
    return [...this.actors.values()];
  }

  public getActorsMap(): Map<number, A> {
    return this.actors;
  }
}
