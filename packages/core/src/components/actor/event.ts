import { BodyPartsEnum, WeaponEnum } from "core/enums";
import { defineEvent } from "../../utils/bus";
import { Player } from "../player/entity";
import { Actor } from "./entity";
import { GameMode } from "../gamemode";
import { actorPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  Actor.getInstances().forEach((a) => a.destroy());
  actorPool.clear();
  return next();
});

const [onPlayerGiveDamage] = defineEvent({
  name: "OnPlayerGiveDamageActor",
  identifier: "iifii",
  defaultValue: false,
  beforeEach(
    playerId: number,
    damagedActorId: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      player: Player.getInstance(playerId),
      actor: Actor.getInstance(damagedActorId),
      amount,
      weapon,
      bodyPart,
    };
  },
});

const [onStreamIn] = defineEvent({
  name: "OnActorStreamIn",
  identifier: "ii",
  beforeEach(actorId: number, forPlayerId: number) {
    return {
      actor: Actor.getInstance(actorId),
      player: Player.getInstance(forPlayerId),
    };
  },
});

const [onStreamOut] = defineEvent({
  name: "OnActorStreamOut",
  identifier: "ii",
  beforeEach(actorId: number, forPlayerId: number) {
    return {
      actor: Actor.getInstance(actorId),
      player: Player.getInstance(forPlayerId),
    };
  },
});

export const ActorEvent = Object.freeze({
  onPlayerGiveDamage,
  onStreamIn,
  onStreamOut,
});
