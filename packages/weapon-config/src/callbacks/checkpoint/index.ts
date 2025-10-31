import { CheckPointEvent, RaceCpEvent } from "@infernus/core";
import { isDying } from "../../struct";
import { wc_IsPlayerSpawned } from "../../functions/public/is";

CheckPointEvent.onPlayerEnter(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

export const internalLeaveCP: Parameters<
  (typeof CheckPointEvent)["onPlayerLeave"]
>[0] = ({ player, next }) => {
  if (isDying.get(player.id)) {
    return 0;
  }
  return next();
};

CheckPointEvent.onPlayerLeave(internalLeaveCP, true);

RaceCpEvent.onPlayerEnter(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

export const internalLeaveRaceCP: Parameters<
  (typeof RaceCpEvent)["onPlayerLeave"]
>[0] = ({ player, next }) => {
  if (isDying.get(player.id)) {
    return 0;
  }
  return next();
};

RaceCpEvent.onPlayerLeave(internalLeaveRaceCP, true);

samp.defined._INC_WEAPON_INTERNAL.leaveCP = internalLeaveCP;
samp.defined._INC_WEAPON_INTERNAL.leaveRaceCP = internalLeaveRaceCP;
