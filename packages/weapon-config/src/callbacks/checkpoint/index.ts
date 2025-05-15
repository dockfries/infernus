import { DynamicCheckPointEvent, DynamicRaceCPEvent } from "@infernus/core";
import { isDying } from "../../struct";
import { wc_IsPlayerSpawned } from "../../functions/public/is";

DynamicCheckPointEvent.onPlayerEnter(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

export const internalLeaveDynamicCP: Parameters<
  (typeof DynamicCheckPointEvent)["onPlayerLeave"]
>[0] = ({ player, next }) => {
  if (isDying.get(player.id)) {
    return 0;
  }
  return next();
};

DynamicCheckPointEvent.onPlayerLeave(internalLeaveDynamicCP);

DynamicRaceCPEvent.onPlayerEnter(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

export const internalLeaveDynamicRaceCP: Parameters<
  (typeof DynamicRaceCPEvent)["onPlayerLeave"]
>[0] = ({ player, next }) => {
  if (isDying.get(player.id)) {
    return 0;
  }
  return next();
};

DynamicRaceCPEvent.onPlayerLeave(internalLeaveDynamicRaceCP);
