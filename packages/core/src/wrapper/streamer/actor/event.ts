import { DynamicActor } from "./entity";
import { GameMode } from "core/controllers/gamemode";
import {
  onDynamicActorStreamIn,
  onDynamicActorStreamOut,
  onPlayerGiveDamageDynamicActor,
} from "../callbacks";

GameMode.onExit(({ next }) => {
  DynamicActor.getInstances().forEach((a) => a.destroy());
  return next();
});

export const DynamicActorEvent = {
  onStreamIn: onDynamicActorStreamIn,
  onStreamOut: onDynamicActorStreamOut,
  onPlayerGiveDamage: onPlayerGiveDamageDynamicActor,
};
