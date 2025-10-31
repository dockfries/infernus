import { DynamicObject } from "./entity";
import { GameMode } from "core/components/gamemode";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/utils/bus";
import { Player } from "core/components/player/entity";
import type { WeaponEnum } from "core/enums";
import { StreamerItemTypes } from "core/enums";
import { dynamicObjectPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  DynamicObject.getInstances().forEach((o) => o.destroy());
  dynamicObjectPool.clear();
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

const [onDynamicObjectMoved] = defineEvent({
  name: "OnDynamicObjectMoved",
  identifier: "i",
  beforeEach(oid: number) {
    return { object: DynamicObject.getInstance(oid)! };
  },
});

const [onPlayerEditDynamicObject] = defineEvent({
  name: "OnPlayerEditDynamicObject",
  identifier: "iiiffffff",
  defaultValue: false,
  beforeEach(
    pid: number,
    oid: number,
    response: number,
    x: number,
    y: number,
    z: number,
    rX: number,
    rY: number,
    rZ: number,
  ) {
    return {
      player: Player.getInstance(pid)!,
      object: DynamicObject.getInstance(oid)!,
      response,
      x,
      y,
      z,
      rX,
      rY,
      rZ,
    };
  },
});

const [onPlayerSelectDynamicObject] = defineEvent({
  name: "OnPlayerSelectDynamicObject",
  identifier: "iiifff",
  beforeEach(
    pid: number,
    oid: number,
    modelId: number,
    x: number,
    y: number,
    z: number,
  ) {
    return {
      player: Player.getInstance(pid)!,
      object: DynamicObject.getInstance(oid)!,
      modelId,
      x,
      y,
      z,
    };
  },
});

const [onPlayerShootDynamicObject] = defineEvent({
  name: "OnPlayerShootDynamicObject",
  identifier: "iiifff",
  beforeEach(
    pid: number,
    weapon: WeaponEnum,
    oid: number,
    x: number,
    y: number,
    z: number,
  ) {
    return {
      player: Player.getInstance(pid)!,
      object: DynamicObject.getInstance(oid)!,
      weapon,
      x,
      y,
      z,
    };
  },
});

export const DynamicObjectEvent = Object.freeze({
  onMoved: onDynamicObjectMoved,
  onPlayerEdit: onPlayerEditDynamicObject,
  onPlayerSelect: onPlayerSelectDynamicObject,
  onPlayerShoot: onPlayerShootDynamicObject,
  onStreamIn,
  onStreamOut,
});
