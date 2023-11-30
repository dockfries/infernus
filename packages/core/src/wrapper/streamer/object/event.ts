/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DynamicObject } from "./entity";
import { GameMode } from "core/controllers/gamemode";
import {
  onDynamicObjectMoved,
  onItemStreamIn,
  onItemStreamOut,
  onPlayerEditAttachedObject,
  onPlayerEditDynamicObject,
  onPlayerSelectDynamicObject,
  onPlayerShootDynamicObject,
} from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import type { Player } from "core/controllers/player/entity";
import { StreamerItemTypes } from "core/enums";

GameMode.onExit(({ next }) => {
  DynamicObject.getInstances().forEach((o) => o.destroy());
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicObjectStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: DynamicObject) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicObjectStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: DynamicObject) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.OBJECT) {
    return triggerStreamIn(forPlayer, DynamicObject.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.OBJECT) {
    return triggerStreamOut(forPlayer, DynamicObject.getInstance(id)!);
  }
  return next();
});

export const DynamicObjectEvent = {
  onMoved: onDynamicObjectMoved,
  onPlayerEdit: onPlayerEditDynamicObject,
  onPlayerSelect: onPlayerSelectDynamicObject,
  onPlayerShoot: onPlayerShootDynamicObject,
  onPlayerEditAttached: onPlayerEditAttachedObject,
  onStreamIn,
  onStreamOut,
};
