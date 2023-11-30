/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DynamicCheckpoint } from "./entity";
import {
  onItemStreamIn,
  onItemStreamOut,
  onPlayerEnterDynamicCP,
  onPlayerLeaveDynamicCP,
} from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { GameMode } from "core/controllers/gamemode";
import type { Player } from "core/controllers/player/entity";
import { StreamerItemTypes } from "core/enums";

GameMode.onExit(({ next }) => {
  DynamicCheckpoint.checkpoints.forEach((c) => c.destroy());
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicCheckPointStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: DynamicCheckpoint) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicCheckPointStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: DynamicCheckpoint) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.CP) {
    return triggerStreamIn(forPlayer, DynamicCheckpoint.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.CP) {
    return triggerStreamOut(forPlayer, DynamicCheckpoint.getInstance(id)!);
  }
  return next();
});

export const DynamicCheckPointEvent = {
  onPlayerEnter: onPlayerEnterDynamicCP,
  onPlayerLeave: onPlayerLeaveDynamicCP,
  onStreamIn,
  onStreamOut,
};
