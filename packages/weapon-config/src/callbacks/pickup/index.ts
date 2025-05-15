import { DynamicPickupEvent } from "@infernus/core";
import { wc_IsPlayerSpawned } from "../../functions/public/is";

DynamicPickupEvent.onPlayerPickUp(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});
