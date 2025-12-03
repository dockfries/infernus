import { pickupPool, playerPickupPool } from "core/utils/pools";
import { GameMode } from "../gamemode";
import { Pickup } from "./entity";
import { defineEvent } from "../../utils/bus";
import { Player, PlayerEvent } from "../player";

PlayerEvent.onDisconnect(({ player, next }) => {
  if (playerPickupPool.has(player)) {
    Pickup.getInstances(player).forEach((p) => {
      if (p.isValid()) {
        p.destroy();
      }
    });
    playerPickupPool.delete(player);
  }
  return next();
});

GameMode.onExit(({ next }) => {
  Pickup.getInstances().forEach((p) => p.destroy());
  Pickup.getPlayersInstances()
    .map(([, p]) => p)
    .flat()
    .forEach((p) => p.destroy());
  pickupPool.clear();
  playerPickupPool.clear();
  return next();
});

const [onPlayerPickUpGlobal] = defineEvent({
  name: "OnPlayerPickUpPickup",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: Pickup.getInstance(pickupId)!,
    };
  },
});

const [onStreamInGlobal] = defineEvent({
  name: "OnPickupStreamIn",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: Pickup.getInstance(pickupId)!,
    };
  },
});

const [onStreamOutGlobal] = defineEvent({
  name: "OnPickupStreamOut",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: Pickup.getInstance(pickupId)!,
    };
  },
});

const [onPlayerPickupPlayer] = defineEvent({
  name: "OnPlayerPickUpPlayerPickup",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    const player = Player.getInstance(playerId)!;
    return {
      player,
      pickup: Pickup.getInstance(pickupId, player)!,
    };
  },
});

const [onStreamInPlayer] = defineEvent({
  name: "OnPlayerPickupStreamIn",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    const player = Player.getInstance(playerId)!;
    return {
      player,
      pickup: Pickup.getInstance(pickupId, player)!,
    };
  },
});

const [onStreamOutPlayer] = defineEvent({
  name: "OnPlayerPickupStreamOut",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    const player = Player.getInstance(playerId)!;
    return {
      player,
      pickup: Pickup.getInstance(pickupId, player)!,
    };
  },
});

export const PickUpEvent = Object.freeze({
  onPlayerPickUpGlobal,
  onStreamInGlobal,
  onStreamOutGlobal,
  onPlayerPickupPlayer,
  onStreamInPlayer,
  onStreamOutPlayer,
});
