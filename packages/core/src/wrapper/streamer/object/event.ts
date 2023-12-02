/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DynamicObject } from "./entity";
import { GameMode } from "core/controllers/gamemode";
import { onItemStreamIn, onItemStreamOut } from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import { Player } from "core/controllers/player/entity";
import type { WeaponEnum } from "core/enums";
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

const [onDynamicObjectMoved] = defineEvent({
  name: "OnDynamicObjectMoved",
  identifier: "i",
  beforeEach(oid: number) {
    return { object: DynamicObject.getInstance(oid)! };
  },
});

const [onPlayerEditDynamicObject] = defineEvent({
  name: "OnPlayerEditDynamicObject",
  identifier: "iiiiiiiii",
  beforeEach(
    pid: number,
    oid: number,
    response: number,
    x: number,
    y: number,
    z: number,
    rX: number,
    rY: number,
    rZ: number
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
  identifier: "iiiiii",
  beforeEach(
    pid: number,
    oid: number,
    modelId: number,
    x: number,
    y: number,
    z: number
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
  identifier: "iiiiii",
  beforeEach(
    pid: number,
    weapon: WeaponEnum,
    oid: number,
    x: number,
    y: number,
    z: number
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

const [onPlayerEditAttachedObject] = defineEvent({
  name: "OnPlayerEditAttachedObject",
  beforeEach(
    pid: number,
    response: number,
    index: number,
    modelId: number,
    boneId: number,
    fOffsetX: number,
    fOffsetY: number,
    fOffsetZ: number,
    fRotX: number,
    fRotY: number,
    fRotZ: number,
    fScaleX: number,
    fScaleY: number,
    fScaleZ: number
  ) {
    return {
      player: Player.getInstance(pid)!,
      response,
      index,
      modelId,
      boneId,
      fOffsetX,
      fOffsetY,
      fOffsetZ,
      fRotX,
      fRotY,
      fRotZ,
      fScaleX,
      fScaleY,
      fScaleZ,
    };
  },
});

export const DynamicObjectEvent = Object.freeze({
  onMoved: onDynamicObjectMoved,
  onPlayerEdit: onPlayerEditDynamicObject,
  onPlayerSelect: onPlayerSelectDynamicObject,
  onPlayerShoot: onPlayerShootDynamicObject,
  onPlayerEditAttached: onPlayerEditAttachedObject,
  onStreamIn,
  onStreamOut,
});
