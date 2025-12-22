import { DynamicPickup } from "./entity";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/utils/bus";
import { InvalidEnum, StreamerItemTypes } from "core/enums";
import { GameMode } from "core/components/gamemode";
import { Player } from "core/components/player/entity";
import { dynamicPickupPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  DynamicPickup.getInstances().forEach((p) => p.destroy());
  dynamicPickupPool.clear();
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicPickupStreamIn",
  isNative: false,
  beforeEach(player: InvalidEnum.PLAYER_ID, instance: DynamicPickup) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicPickupStreamOut",
  isNative: false,
  beforeEach(player: InvalidEnum.PLAYER_ID, instance: DynamicPickup) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, next }) => {
  if (type === StreamerItemTypes.PICKUP) {
    return triggerStreamIn(
      InvalidEnum.PLAYER_ID,
      DynamicPickup.getInstance(id)!,
    );
  }
  return next();
});

onItemStreamOut(({ type, id, next }) => {
  if (type === StreamerItemTypes.PICKUP) {
    return triggerStreamOut(
      InvalidEnum.PLAYER_ID,
      DynamicPickup.getInstance(id)!,
    );
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
