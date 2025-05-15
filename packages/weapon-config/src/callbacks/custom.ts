import { defineEvent, InvalidEnum, Player } from "@infernus/core";
import { RejectedHit } from "../struct";
import { InvalidDamageEnum } from "../enums";

export interface IEditableOnPlayerDamage {
  player: Player;
  amount: number;
  issuerId: Player | InvalidEnum.PLAYER_ID;
  weaponId: number;
  bodyPart: number;
}

export const [onPlayerDamage, triggerOnPlayerDamage] = defineEvent({
  name: "OnPlayerDamage",
  isNative: false,
  beforeEach(editable: IEditableOnPlayerDamage) {
    return {
      editable,
    };
  },
});

export const [onPlayerDamageDone, triggerOnPlayerDamageDone] = defineEvent({
  name: "OnPlayerDamageDone",
  isNative: false,
  beforeEach(
    player: Player,
    amount: number,
    issuerId: Player | InvalidEnum.PLAYER_ID,
    weaponId: number,
    bodyPart: number,
  ) {
    return {
      player,
      amount,
      issuerId,
      weaponId,
      bodyPart,
    };
  },
});

export interface IEditableOnPlayerPrepareDeath {
  animLock: boolean;
  respawnTime: number;
}

export const [onPlayerPrepareDeath, triggerOnPlayerPrepareDeath] = defineEvent({
  name: "OnPlayerPrepareDeath",
  isNative: false,
  beforeEach(
    player: Player,
    animLib: string,
    animName: string,
    editable: IEditableOnPlayerPrepareDeath,
  ) {
    return {
      player,
      animLib,
      animName,
      editable,
    };
  },
});

export const [onRejectedHit, triggerOnRejectedHit] = defineEvent({
  name: "OnRejectedHit",
  isNative: false,
  beforeEach(player: Player, hit: RejectedHit) {
    return {
      player,
      hit,
    };
  },
});

export const [onPlayerDeathFinished, triggerOnPlayerDeathFinished] =
  defineEvent({
    name: "OnPlayerDeathFinished",
    isNative: false,
    beforeEach(player: Player) {
      return {
        player,
      };
    },
  });

export interface IEditableOnPlayerUseVendingMachine {
  healthGiven: number;
}

export const [onPlayerUseVendingMachine, triggerOnPlayerUseVendingMachine] =
  defineEvent({
    name: "OnPlayerUseVendingMachine",
    isNative: false,
    beforeEach(player, editable: IEditableOnPlayerUseVendingMachine) {
      return {
        player,
        editable,
      };
    },
  });

export const [onInvalidWeaponDamage, triggerOnInvalidWeaponDamage] =
  defineEvent({
    name: "OnInvalidWeaponDamage",
    isNative: false,
    beforeEach(
      player: Player | InvalidEnum.PLAYER_ID,
      damaged: Player,
      amount: number,
      weapon: number,
      bodyPart: number,
      error: InvalidDamageEnum,
      given: boolean,
    ) {
      return {
        player,
        damaged,
        amount,
        weapon,
        bodyPart,
        error,
        given,
      };
    },
  });
