import type { BasePlayer } from "@/controllers/player";
import {
  OnDynamicActorStreamIn,
  OnDynamicActorStreamOut,
} from "omp-wrapper-streamer";
import { actorBus, actorHooks } from "./actorBus";
import { DynamicActor } from "./baseActor";

export abstract class DynamicRaceCPEvent<
  P extends BasePlayer,
  A extends DynamicActor
> {
  public readonly actors = new Map<number, A>();
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
      return this.onStreamIn(act, p);
    });
    OnDynamicActorStreamOut((actorid: number, forplayerid: number): number => {
      const act = this.actors.get(actorid);
      if (!act) return 0;
      const p = this.players.get(forplayerid);
      if (!p) return 0;
      return this.onStreamOut(act, p);
    });
  }

  protected abstract onStreamIn(actor: A, player: P): number;
  protected abstract onStreamOut(actor: A, player: P): number;

  public getActorsArr(): Array<A> {
    return [...this.actors.values()];
  }
}
