import { GameMode } from "core/controllers/gamemode";
import { DynamicMapIcon } from "./entity";
import { defineEvent } from "core/controllers/bus";
import type { Player } from "core/controllers/player/entity";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { StreamerItemTypes } from "core/enums";
import { dynamicMapIconPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  DynamicMapIcon.getInstances().forEach((m) => m.destroy());
  dynamicMapIconPool.clear();
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicMapIconStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: DynamicMapIcon) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicMapIconStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: DynamicMapIcon) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.MAP_ICON) {
    return triggerStreamIn(forPlayer, DynamicMapIcon.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.MAP_ICON) {
    return triggerStreamOut(forPlayer, DynamicMapIcon.getInstance(id)!);
  }
  return next();
});

export const DynamicMapIconEvent = Object.freeze({
  onStreamIn,
  onStreamOut,
});
