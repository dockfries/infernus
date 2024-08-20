import { DynamicPickup } from "./entity";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { StreamerItemTypes } from "core/enums";
import { GameMode } from "core/controllers/gamemode";
import { Player } from "core/controllers/player/entity";

GameMode.onExit(({ next }) => {
  DynamicPickup.getInstances().forEach((p) => p.destroy());
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicPickupStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: DynamicPickup) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicPickupStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: DynamicPickup) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.PICKUP) {
    return triggerStreamIn(forPlayer, DynamicPickup.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.PICKUP) {
    return triggerStreamOut(forPlayer, DynamicPickup.getInstance(id)!);
  }
  return next();
});

const [onPlayerPickUp] = defineEvent({
  name: "OnPlayerPickUpDynamicPickup",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicPickup.getInstance(pickupId)!,
    };
  },
});

export const DynamicPickupEvent = Object.freeze({
  onPlayerPickUp,
  onStreamIn,
  onStreamOut,
});
