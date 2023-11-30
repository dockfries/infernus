/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DynamicPickup } from "./entity";
import {
  onItemStreamIn,
  onItemStreamOut,
  onPlayerPickUpDynamicPickup,
} from "../callbacks";
import type { Player } from "core/controllers";
import { GameMode } from "core/controllers";
import { defineEvent } from "core/controllers/bus";
import { StreamerItemTypes } from "core/enums";

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

export const DynamicPickupEvent = {
  onPlayerPickUp: onPlayerPickUpDynamicPickup,
  onStreamIn,
  onStreamOut,
};
