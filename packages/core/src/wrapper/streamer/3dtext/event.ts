import { StreamerItemTypes } from "@infernus/streamer";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { GameMode } from "core/controllers/gamemode";
import { Dynamic3DTextLabel } from "./entity";
import type { Player } from "core/controllers/player/entity";

GameMode.onExit(({ next }) => {
  Dynamic3DTextLabel.getInstances().forEach((t) => t.destroy());
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamic3dTextStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: Dynamic3DTextLabel) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamic3dTextStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: Dynamic3DTextLabel) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.TEXT_3D_LABEL) {
    return triggerStreamIn(forPlayer, Dynamic3DTextLabel.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.TEXT_3D_LABEL) {
    return triggerStreamOut(forPlayer, Dynamic3DTextLabel.getInstance(id)!);
  }
  return next();
});

export const Dynamic3DTextLabelEvent = Object.freeze({
  onStreamIn,
  onStreamOut,
});
