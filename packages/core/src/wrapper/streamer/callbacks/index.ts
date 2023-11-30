/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { defineEvent } from "core/controllers/bus";
import type { StreamerItemTypes } from "@infernus/streamer";
import type { BodyPartsEnum, WeaponEnum } from "core/enums";
import { Player } from "core/controllers/player/entity";
import { DynamicObject } from "../object/entity";
import { DynamicCheckpoint } from "../checkpoint";
import { DynamicArea } from "../area";
import { DynamicActor } from "../actor";
import { DynamicRaceCP } from "../raceCP";
import { DynamicPickup } from "../pickup";

export const [onDynamicObjectMoved] = defineEvent({
  name: "OnDynamicObjectMoved",
  identifier: "i",
  beforeEach(oid: number) {
    return { object: DynamicObject.getInstance(oid)! };
  },
});

export const [onPlayerEditDynamicObject] = defineEvent({
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

export const [onPlayerSelectDynamicObject] = defineEvent({
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

export const [onPlayerShootDynamicObject] = defineEvent({
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

export const onPlayerEditAttachedObject = defineEvent({
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

export const [onPlayerPickUpDynamicPickup] = defineEvent({
  name: "OnPlayerPickUpDynamicPickup",
  identifier: "ii",
  beforeEach(playerId: number, pickupId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicPickup.getInstance(pickupId)!,
    };
  },
});

export const [onPlayerEnterDynamicCP] = defineEvent({
  name: "OnPlayerEnterDynamicCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicCheckpoint.getInstance(checkpointId)!,
    };
  },
});

export const [onPlayerLeaveDynamicCP] = defineEvent({
  name: "OnPlayerLeaveDynamicCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicCheckpoint.getInstance(checkpointId)!,
    };
  },
});

export const [onPlayerEnterDynamicRaceCP] = defineEvent({
  name: "OnPlayerEnterDynamicRaceCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicRaceCP.getInstance(checkpointId)!,
    };
  },
});

export const [onPlayerLeaveDynamicRaceCP] = defineEvent({
  name: "OnPlayerLeaveDynamicRaceCP",
  identifier: "ii",
  beforeEach(playerId: number, checkpointId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicRaceCP.getInstance(checkpointId)!,
    };
  },
});

export const [onPlayerEnterDynamicArea] = defineEvent({
  name: "OnPlayerEnterDynamicArea",
  identifier: "ii",
  beforeEach(playerId: number, areaId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicArea.getInstance(areaId)!,
    };
  },
});

export const [onPlayerLeaveDynamicArea] = defineEvent({
  name: "OnPlayerLeaveDynamicArea",
  identifier: "ii",
  beforeEach(playerId: number, areaId: number) {
    return {
      player: Player.getInstance(playerId)!,
      pickup: DynamicArea.getInstance(areaId)!,
    };
  },
});

export const [onPlayerGiveDamageDynamicActor] = defineEvent({
  name: "OnPlayerGiveDamageDynamicActor",
  identifier: "iiiii",
  beforeEach(
    pid: number,
    aid: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum
  ) {
    return {
      player: Player.getInstance(pid)!,
      actor: DynamicActor.getInstance(aid)!,
      amount,
      weapon,
      bodyPart,
    };
  },
});

export const [onDynamicActorStreamIn] = defineEvent({
  name: "OnDynamicActorStreamIn",
  identifier: "ii",
  beforeEach(aid: number, pid: number) {
    return {
      actor: DynamicActor.getInstance(aid)!,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

export const [onDynamicActorStreamOut] = defineEvent({
  name: "OnDynamicActorStreamOut",
  identifier: "ii",
  beforeEach(aid: number, pid: number) {
    return {
      actor: DynamicActor.getInstance(aid)!,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

export const [onItemStreamIn] = defineEvent({
  name: "Streamer_OnItemStreamIn",
  identifier: "iii",
  beforeEach(type: StreamerItemTypes, id: number, pid: number) {
    return {
      type,
      id,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

export const [onItemStreamOut] = defineEvent({
  name: "Streamer_OnItemStreamOut",
  identifier: "iii",
  beforeEach(type: StreamerItemTypes, id: number, pid: number) {
    return {
      type,
      id,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

export const [onPluginError] = defineEvent({
  name: "Streamer_OnPluginError",
  identifier: "s",
  beforeEach(error: string) {
    return { error };
  },
});
