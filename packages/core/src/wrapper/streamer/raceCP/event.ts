/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Player } from "core/controllers";
import { DynamicRaceCP, GameMode } from "core/controllers";
import {
  onItemStreamIn,
  onItemStreamOut,
  onPlayerEnterDynamicRaceCP,
  onPlayerLeaveDynamicRaceCP,
} from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { StreamerItemTypes } from "core/enums";

GameMode.onExit(({ next }) => {
  DynamicRaceCP.getInstances().forEach((r) => r.destroy());
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicRaceCPStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: DynamicRaceCP) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicRaceCPStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: DynamicRaceCP) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.RACE_CP) {
    return triggerStreamIn(forPlayer, DynamicRaceCP.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.RACE_CP) {
    return triggerStreamOut(forPlayer, DynamicRaceCP.getInstance(id)!);
  }
  return next();
});

export const DynamicRaceCPEvent = {
  onPlayerEnter: onPlayerEnterDynamicRaceCP,
  onPlayerLeave: onPlayerLeaveDynamicRaceCP,
  onStreamIn,
  onStreamOut,
};
