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

GameMode.onExit(({ next }) => {
  Npc.npcs.clear();
  return next();
});

const [onConnect] = defineEvent({
  name: "OnNpcConnect",
  beforeEach(myPlayerId: number) {
    return { myPlayerId };
  },
});

const [onDisconnect] = defineEvent({
  name: "OnNpcDisconnect",
  beforeEach(reason: string) {
    return { reason };
  },
});

const [onModeInit] = defineEvent({
  name: "OnNpcModeInit",
});

const [onModeExit] = defineEvent({
  name: "OnNpcModeExit",
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
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onCreate] = defineEvent({
  name: "OnNPCCreate",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onDestroy] = defineEvent({
  name: "OnNPCDestroy",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

const [onWeaponStateChange] = defineEvent({
  name: "OnNPCWeaponStateChange",
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
  beforeEach(
    id: number,
    killer: InvalidEnum.PLAYER_ID | Player,
    reason: number,
  ) {
    return {
      npc: Npc.getInstance(id)!,
      killer,
      reason,
    };
  },
});

const [onSpawn] = defineEvent({
  name: "OnNpcSpawn",
  beforeEach(id: number) {
    return {
      npc: Npc.getInstance(id)!,
    };
  },
});

export const NpcEvent = Object.freeze({
  onConnect,
  onDisconnect,
  onModeInit,
  onModeExit,
  onClientMessage,
  onFinishMove,
  onCreate,
  onDestroy,
  onWeaponStateChange,
  onTakeDamage,
  onGiveDamage,
  onDeath,
  onSpawn,
});
