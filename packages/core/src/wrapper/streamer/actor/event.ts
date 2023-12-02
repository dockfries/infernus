/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DynamicActor } from "./entity";
import { GameMode } from "core/controllers/gamemode";
import { defineEvent } from "core/controllers/bus";
import { Player } from "core/controllers/player/entity";
import type { WeaponEnum, BodyPartsEnum } from "core/enums";

GameMode.onExit(({ next }) => {
  DynamicActor.getInstances().forEach((a) => a.destroy());
  return next();
});

const [onDynamicActorStreamIn] = defineEvent({
  name: "OnDynamicActorStreamIn",
  identifier: "ii",
  beforeEach(aid: number, pid: number) {
    return {
      actor: DynamicActor.getInstance(aid)!,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

const [onDynamicActorStreamOut] = defineEvent({
  name: "OnDynamicActorStreamOut",
  identifier: "ii",
  beforeEach(aid: number, pid: number) {
    return {
      actor: DynamicActor.getInstance(aid)!,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

const [onPlayerGiveDamageDynamicActor] = defineEvent({
  name: "OnPlayerGiveDamageDynamicActor",
  identifier: "iiiii",
  beforeEach(
    pid: number,
    aid: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum
  ) {
    return {
      player: Player.getInstance(pid)!,
      actor: DynamicActor.getInstance(aid)!,
      amount,
      weapon,
      bodyPart,
    };
  },
});

export const DynamicActorEvent = Object.freeze({
  onStreamIn: onDynamicActorStreamIn,
  onStreamOut: onDynamicActorStreamOut,
  onPlayerGiveDamage: onPlayerGiveDamageDynamicActor,
});
