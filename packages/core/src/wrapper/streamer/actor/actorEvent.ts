import type { Player } from "@/controllers/player";
import type { BodyPartsEnum } from "@/enums";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnDynamicActorStreamIn,
  OnDynamicActorStreamOut,
  OnPlayerGiveDamageDynamicActor,
} from "@infernus/streamer";
import { actorBus, actorHooks } from "./actorBus";
import { DynamicActor } from "./baseActor";

export class DynamicActorEvent<P extends Player, A extends DynamicActor> {
  private readonly actors = new Map<number, A>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    actorBus.on(actorHooks.created, (actor: A) => {
      this.actors.set(actor.id, actor);
    });
    actorBus.on(actorHooks.destroyed, (actor: A) => {
      this.actors.delete(actor.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.actors.forEach((a) => a.destroy());
        this.actors.clear();
      });
    }
    OnDynamicActorStreamIn((actorid: number, forplayerid: number): number => {
      const act = this.actors.get(actorid);
      if (!act) return 0;
      const p = this.players.get(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback(
        this,
        "onStreamIn",
        "OnDynamicActorStreamIn"
      );
      return pFn(act, p);
    });
    OnDynamicActorStreamOut((actorid: number, forplayerid: number): number => {
      const act = this.actors.get(actorid);
      if (!act) return 0;
      const p = this.players.get(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback(
        this,
        "onStreamOut",
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
        const pFn = promisifyCallback(
          this,
          "onPlayerGiveDamage",
          "OnPlayerGiveDamageDynamicActor"
        );
        return pFn(p, act, amount, weaponid, bodypart);
      }
    );
  }

  onStreamIn?(actor: A, player: P): TCommonCallback;
  onStreamOut?(actor: A, player: P): TCommonCallback;
  onPlayerGiveDamage?(
    player: P,
    actor: A,
    amount: number,
    weaponid: number,
    bodypart: BodyPartsEnum
  ): TCommonCallback;

  getActorsArr(): Array<A> {
    return [...this.actors.values()];
  }

  getActorsMap(): Map<number, A> {
    return this.actors;
  }
}