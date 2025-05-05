import { Player } from "./entity";
import { defineEvent } from "../bus";
import { I18n } from "../i18n";
import type {
  BodyPartsEnum,
  BulletHitTypesEnum,
  KeysEnum,
  PlayerStateEnum,
  WeaponEnum,
} from "../../enums";
import { InvalidEnum } from "../../enums";
import { Dialog } from "./dialog";
import { playerPool } from "./pool";

export const [onConnect] = defineEvent({
  name: "OnPlayerConnect",
  beforeEach(id: number) {
    const player = new Player(id);
    playerPool.set(id, player);
    Dialog.close(player);
    return { player };
  },
});

export const [onDisconnect] = defineEvent({
  name: "OnPlayerDisconnect",
  beforeEach(id: number, reason: number) {
    const player = playerPool.get(id)!;
    return { player, reason };
  },
  afterEach({ player }) {
    playerPool.delete(player.id);
  },
});

export const [onUpdate] = defineEvent({
  name: "OnPlayerUpdate",
  beforeEach(id: number) {
    return { player: Player.getInstance(id)! };
  },
});

export const [onText] = defineEvent({
  name: "OnPlayerTextI18n",
  identifier: "iai",
  beforeEach(id: number, buffer: number[]) {
    const player = Player.getInstance(id)!;
    return { player, text: I18n.decodeFromBuf(buffer, player.charset), buffer };
  },
});

export const [onEnterExitModShop] = defineEvent({
  name: "OnPlayerEnterExitModShop",
  beforeEach(id: number, enterExit: number, interior: number) {
    return {
      player: Player.getInstance(id)!,
      enterExit,
      interior,
    };
  },
});

export const [onClickMap] = defineEvent({
  name: "OnPlayerClickMap",
  defaultValue: false,
  beforeEach(id: number, fX: number, fY: number, fZ: number) {
    return {
      player: Player.getInstance(id)!,
      fX,
      fY,
      fZ,
    };
  },
});

export const [onClickPlayer] = defineEvent({
  name: "OnPlayerClickPlayer",
  defaultValue: false,
  beforeEach(id: number, clickedId: number, source: number) {
    return {
      player: Player.getInstance(id)!,
      clickedPlayer: Player.getInstance(clickedId)!,
      source,
    };
  },
});

export const [onDeath] = defineEvent<{
  player: Player;
  killer: Player | InvalidEnum.PLAYER_ID;
  reason: number;
}>({
  name: "OnPlayerDeath",
  beforeEach(id: number, killer: number, reason: number) {
    return {
      player: Player.getInstance(id)!,
      killer: Player.getInstance(killer) || InvalidEnum.PLAYER_ID,
      reason,
    };
  },
});

export const [onGiveDamage] = defineEvent({
  name: "OnPlayerGiveDamage",
  defaultValue: false,
  beforeEach(
    id: number,
    damage: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      player: Player.getInstance(id)!,
      damage: Player.getInstance(damage)!,
      amount,
      weapon,
      bodyPart,
    };
  },
});

export const [onKeyStateChange] = defineEvent({
  name: "OnPlayerKeyStateChange",
  beforeEach(id: number, newKeys: KeysEnum, oldKeys: KeysEnum) {
    return {
      player: Player.getInstance(id)!,
      newKeys,
      oldKeys,
    };
  },
});

export const [onRequestClass] = defineEvent({
  name: "OnPlayerRequestClass",
  beforeEach(id: number, classId: number) {
    return {
      player: Player.getInstance(id)!,
      classId,
    };
  },
});

export const [onRequestSpawn] = defineEvent({
  name: "OnPlayerRequestSpawn",
  beforeEach(id: number) {
    return { player: Player.getInstance(id)! };
  },
});

export const [onSpawn] = defineEvent({
  name: "OnPlayerSpawn",
  beforeEach(id: number) {
    return { player: Player.getInstance(id)! };
  },
});

export const [onStateChange] = defineEvent({
  name: "OnPlayerStateChange",
  beforeEach(id: number, newState: PlayerStateEnum, oldState: PlayerStateEnum) {
    return { player: Player.getInstance(id)!, newState, oldState };
  },
});

export const [onStreamIn] = defineEvent({
  name: "OnPlayerSteamIn",
  beforeEach(id: number, forPlayer: number) {
    return {
      player: Player.getInstance(id)!,
      forPlayer: Player.getInstance(forPlayer),
    };
  },
});

export const [onStreamOut] = defineEvent({
  name: "OnPlayerSteamOut",
  beforeEach(id: number, forPlayer: number) {
    return {
      player: Player.getInstance(id)!,
      forPlayer: Player.getInstance(forPlayer),
    };
  },
});

export const [onTakeDamage] = defineEvent<{
  player: Player;
  damage: Player | InvalidEnum.PLAYER_ID;
  amount: number;
  weapon: WeaponEnum;
  bodyPart: BodyPartsEnum;
}>({
  name: "OnPlayerTakeDamage",
  defaultValue: false,
  beforeEach(
    id: number,
    damage: number | InvalidEnum.PLAYER_ID,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      player: Player.getInstance(id)!,
      damage: Player.getInstance(damage) || InvalidEnum.PLAYER_ID,
      amount,
      weapon,
      bodyPart,
    };
  },
});

export const [onInteriorChange] = defineEvent({
  name: "OnPlayerInteriorChange",
  beforeEach(id: number, newInteriorId: number, oldInteriorId: number) {
    return {
      player: Player.getInstance(id)!,
      newInteriorId,
      oldInteriorId,
    };
  },
});

export const [onRequestDownload] = defineEvent({
  name: "OnPlayerRequestDownload",
  beforeEach(id: number, type: number, crc: number) {
    return {
      player: Player.getInstance(id)!,
      type,
      crc,
    };
  },
});

export const [onFinishedDownloading] = defineEvent({
  name: "OnPlayerFinishedDownloading",
  beforeEach(id: number, virtualWorld: number) {
    return {
      player: Player.getInstance(id)!,
      virtualWorld,
    };
  },
});

export const [onWeaponShot] = defineEvent({
  name: "OnPlayerWeaponShot",
  beforeEach(
    id: number,
    weapon: WeaponEnum,
    hitType: BulletHitTypesEnum,
    hitId: number,
    fX: number,
    fY: number,
    fZ: number,
  ) {
    return {
      player: Player.getInstance(id)!,
      weapon,
      hitType,
      hitId,
      fX,
      fY,
      fZ,
    };
  },
});
