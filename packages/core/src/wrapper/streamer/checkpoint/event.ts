import { DynamicCheckpoint } from "./entity";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { GameMode } from "core/controllers/gamemode";
import { Player } from "core/controllers/player/entity";
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

const [onPlayerEnterDynamicCP] = defineEvent({
  name: "OnPlayerEnterDynamicCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      cp: DynamicCheckpoint.getInstance(checkpointId)!,
    };
  },
});

const [onPlayerLeaveDynamicCP] = defineEvent({
  name: "OnPlayerLeaveDynamicCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      cp: DynamicCheckpoint.getInstance(checkpointId)!,
    };
  },
});

export const DynamicCheckPointEvent = Object.freeze({
  onPlayerEnter: onPlayerEnterDynamicCP,
  onPlayerLeave: onPlayerLeaveDynamicCP,
  onStreamIn,
  onStreamOut,
});
