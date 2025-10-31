import { pickupPool } from "core/utils/pools";
import { GameMode } from "../gamemode";
import { Pickup } from "./entity";
import { defineEvent } from "../bus";
import { Player } from "../player";

GameMode.onExit(({ next }) => {
  Pickup.getInstances().forEach((p) => p.destroy());
  pickupPool.clear();
  return next();
});

const [onPlayerPickUp] = defineEvent({
  name: "OnPlayerPickUpPickup",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: Pickup.getInstance(pickupId)!,
    };
  },
});

const [onStreamIn] = defineEvent({
  name: "OnPickupStreamIn",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: Pickup.getInstance(pickupId)!,
    };
  },
});

const [onStreamOut] = defineEvent({
  name: "OnPickupStreamOut",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: Pickup.getInstance(pickupId)!,
    };
  },
});

export const PickUpEvent = Object.freeze({
  onPlayerPickUp,
  onStreamIn,
  onStreamOut,
});
