/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { GameMode } from "core/controllers/gamemode";
import { StreamerItemTypes } from "core/enums";
import { DynamicRaceCP } from "./entity";
import { Player } from "core/controllers/player/entity";

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

const [onPlayerEnterDynamicRaceCP] = defineEvent({
  name: "OnPlayerEnterDynamicRaceCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      raceCP: DynamicRaceCP.getInstance(checkpointId)!,
    };
  },
});

const [onPlayerLeaveDynamicRaceCP] = defineEvent({
  name: "OnPlayerLeaveDynamicRaceCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      raceCp: DynamicRaceCP.getInstance(checkpointId)!,
    };
  },
});

export const DynamicRaceCPEvent = Object.freeze({
  onPlayerEnter: onPlayerEnterDynamicRaceCP,
  onPlayerLeave: onPlayerLeaveDynamicRaceCP,
  onStreamIn,
  onStreamOut,
});
