import { Player } from "./entity";
import { defineEvent } from "../../utils/bus";
import { I18n } from "../../utils/i18n";
import type {
  BodyPartsEnum,
  BulletHitTypesEnum,
  KeysEnum,
  PlayerStateEnum,
  WeaponEnum,
} from "../../enums";
import { InvalidEnum } from "../../enums";
import { Dialog } from "./dialog";
import { playerPool } from "core/utils/pools";

export const [onConnect] = defineEvent({
  name: "OnPlayerConnect",
  identifier: "i",
  beforeEach(id: number) {
    const player = new Player(id);
    playerPool.set(id, player);
    Dialog.close(player);
    return { player };
  },
});

export const [onDisconnect] = defineEvent({
  name: "OnPlayerDisconnect",
  identifier: "ii",
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
  identifier: "i",
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
  identifier: "iii",
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
  identifier: "ifff",
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
  identifier: "iii",
  defaultValue: false,
  beforeEach(id: number, clickedId: number, source: number) {
    return {
      player: Player.getInstance(id)!,
      clickedPlayer: Player.getInstance(clickedId)!,
      source,
    };
  },
});

export const [onDeath] = defineEvent({
  name: "OnPlayerDeath",
  identifier: "iii",
  beforeEach(id: number, killer: number, reason: number) {
    const _killer: InvalidEnum.PLAYER_ID | Player =
      Player.getInstance(killer) || InvalidEnum.PLAYER_ID;
    return {
      player: Player.getInstance(id)!,
      killer: _killer,
      reason,
    };
  },
});

export const [onGiveDamage] = defineEvent({
  name: "OnPlayerGiveDamage",
  identifier: "iiiii",
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
  identifier: "iii",
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
  identifier: "ii",
  beforeEach(id: number, classId: number) {
    return {
      player: Player.getInstance(id)!,
      classId,
    };
  },
});

export const [onRequestSpawn] = defineEvent({
  name: "OnPlayerRequestSpawn",
  identifier: "i",
  beforeEach(id: number) {
    return { player: Player.getInstance(id)! };
  },
});

export const [onSpawn] = defineEvent({
  name: "OnPlayerSpawn",
  identifier: "i",
  beforeEach(id: number) {
    return { player: Player.getInstance(id)! };
  },
});

export const [onStateChange] = defineEvent({
  name: "OnPlayerStateChange",
  identifier: "iii",
  beforeEach(id: number, newState: PlayerStateEnum, oldState: PlayerStateEnum) {
    return { player: Player.getInstance(id)!, newState, oldState };
  },
});

export const [onStreamIn] = defineEvent({
  name: "OnPlayerStreamIn",
  identifier: "ii",
  beforeEach(id: number, forPlayer: number) {
    return {
      player: Player.getInstance(id)!,
      forPlayer: Player.getInstance(forPlayer),
    };
  },
});

export const [onStreamOut] = defineEvent({
  name: "OnPlayerStreamOut",
  identifier: "ii",
  beforeEach(id: number, forPlayer: number) {
    return {
      player: Player.getInstance(id)!,
      forPlayer: Player.getInstance(forPlayer),
    };
  },
});

export const [onTakeDamage] = defineEvent({
  name: "OnPlayerTakeDamage",
  identifier: "iiiii",
  defaultValue: false,
  beforeEach(
    id: number,
    damage: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    const _damage: InvalidEnum.PLAYER_ID | Player =
      Player.getInstance(damage) || InvalidEnum.PLAYER_ID;
    return {
      player: Player.getInstance(id)!,
      damage: _damage,
      amount,
      weapon,
      bodyPart,
    };
  },
});

export const [onInteriorChange] = defineEvent({
  name: "OnPlayerInteriorChange",
  identifier: "iii",
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
  identifier: "iii",
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
  identifier: "ii",
  beforeEach(id: number, virtualWorld: number) {
    return {
      player: Player.getInstance(id)!,
      virtualWorld,
    };
  },
});

export const [onWeaponShot] = defineEvent({
  name: "OnPlayerWeaponShot",
  identifier: "iiiifff",
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
