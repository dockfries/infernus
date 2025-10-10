import {
  BodyPartsEnum,
  InvalidEnum,
  PlayerStateEnum,
  WeaponEnum,
} from "core/enums";
import { defineEvent } from "../bus";
import { I18n } from "../i18n";
import { Npc } from "./entity";
import { Player } from "../player";
import { GameMode } from "../gamemode";
import {
  npcNodePool,
  npcPathPool,
  npcPool,
  npcRecordPool,
} from "core/utils/pools";
import { NpcRecord } from "./record";
import { NpcNode } from "./node";
import { NpcPath } from "./path";

GameMode.onExit(({ next }) => {
  npcPool.clear();
  npcNodePool.clear();
  npcPathPool.clear();
  npcRecordPool.clear();
  return next();
});

const [onClientMessage] = defineEvent({
  name: "OnClientMessageI18n",
  identifier: "iai",
  beforeEach(color: number, buffer: number[]) {
    return {
      color,
      buffer,
      string: I18n.decodeFromBuf(buffer),
    };
  },
});

const [onFinishMove] = defineEvent({
  name: "OnNPCFinishMove",
  identifier: "i",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onCreate] = defineEvent({
  name: "OnNPCCreate",
  identifier: "i",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onDestroy] = defineEvent({
  name: "OnNPCDestroy",
  identifier: "i",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
  afterEach({ npc }) {
    npcPool.delete(npc.id);
  },
});

const [onWeaponStateChange] = defineEvent({
  name: "OnNPCWeaponStateChange",
  identifier: "iii",
  beforeEach(id: number, newState: PlayerStateEnum, oldState: PlayerStateEnum) {
    return {
      npc: Npc.getInstance(id)!,
      newState,
      oldState,
    };
  },
});

const [onTakeDamage] = defineEvent({
  name: "OnNPCTakeDamage",
  identifier: "iiiii",
  beforeEach(
    id: number,
    damager: number,
    damage: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      npc: Npc.getInstance(id)!,
      damager: Player.getInstance(damager)!,
      damage,
      weapon,
      bodyPart,
    };
  },
});

const [onGiveDamage] = defineEvent({
  name: "OnNPCGiveDamage",
  identifier: "iiiii",
  beforeEach(
    id: number,
    damager: number,
    damage: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      npc: Npc.getInstance(id)!,
      damager: Player.getInstance(damager)!,
      damage,
      weapon,
      bodyPart,
    };
  },
});

const [onDeath] = defineEvent({
  name: "OnNPCDeath",
  identifier: "iii",
  beforeEach(id: number, killer: number, reason: number) {
    const _killer: InvalidEnum.PLAYER_ID | Player =
      Player.getInstance(killer) || InvalidEnum.PLAYER_ID;
    return {
      npc: Npc.getInstance(id)!,
      killer: _killer,
      reason,
    };
  },
});

const [onSpawn] = defineEvent({
  name: "OnNPCSpawn",
  identifier: "i",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onRespawn] = defineEvent({
  name: "OnNPCRespawn",
  identifier: "i",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onPlaybackStart] = defineEvent({
  name: "OnNPCPlaybackStart",
  identifier: "ii",
  beforeEach(id: number, recordId: number) {
    return {
      npc: Npc.getInstance(id)!,
      record: NpcRecord.getInstance(recordId),
      recordId,
    };
  },
});
const [onPlaybackEnd] = defineEvent({
  name: "OnNPCPlaybackEnd",
  identifier: "ii",
  beforeEach(id: number, recordId: number) {
    return {
      npc: Npc.getInstance(id)!,
      record: NpcRecord.getInstance(recordId),
      recordId,
    };
  },
});
const [onWeaponShot] = defineEvent({
  name: "OnNPCWeaponShot",
  identifier: "iiiifff",
  beforeEach(
    id: number,
    weapon: number,
    hitType: number,
    hitId: number,
    fX: number,
    fY: number,
    fZ: number,
  ) {
    return {
      npc: Npc.getInstance(id)!,
      weapon,
      hitType,
      hitId,
      fX,
      fY,
      fZ,
    };
  },
});
const [onFinishNodePoint] = defineEvent({
  name: "OnNPCFinishNodePoint",
  identifier: "iii",
  beforeEach(id: number, nodeId: number, pointId: number) {
    return {
      npc: Npc.getInstance(id)!,
      node: NpcNode.getInstance(nodeId),
      nodeId,
      pointId,
    };
  },
});
const [onFinishNode] = defineEvent({
  name: "OnNPCFinishNode",
  identifier: "ii",
  beforeEach(id: number, nodeId: number) {
    return {
      npc: Npc.getInstance(id)!,
      node: NpcNode.getInstance(nodeId),
      nodeId,
    };
  },
});
const [onChangeNode] = defineEvent({
  name: "OnNPCChangeNode",
  identifier: "iii",
  beforeEach(id: number, newNodeId: number, oldNodeId: number) {
    return {
      npc: Npc.getInstance(id)!,
      newNode: NpcNode.getInstance(newNodeId),
      oldNode: NpcNode.getInstance(oldNodeId),
      newNodeId,
      oldNodeId,
    };
  },
});

const [onFinishMovePath] = defineEvent({
  name: "OnNPCFinishMovePath",
  identifier: "ii",
  beforeEach(id: number, pathId: number) {
    return {
      npc: Npc.getInstance(id)!,
      path: NpcPath.getInstance(pathId),
      pathId,
    };
  },
});

const [onFinishMovePathPoint] = defineEvent({
  name: "OnNPCFinishMovePathPoint",
  identifier: "iii",
  beforeEach(id: number, pathId: number, pointIndex: number) {
    return {
      npc: Npc.getInstance(id)!,
      path: NpcPath.getInstance(pathId),
      pathId,
      pointIndex,
    };
  },
});

export const NpcEvent = Object.freeze({
  onClientMessage,
  onFinishMove,
  onCreate,
  onDestroy,
  onSpawn,
  onRespawn,
  onWeaponStateChange,
  onTakeDamage,
  onGiveDamage,
  onDeath,
  onPlaybackStart,
  onPlaybackEnd,
  onWeaponShot,
  onFinishNodePoint,
  onFinishNode,
  onChangeNode,
  onFinishMovePath,
  onFinishMovePathPoint,
});
