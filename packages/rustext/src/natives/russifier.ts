import { GameMode, PlayerEvent } from "@infernus/core";
import { ConverterTypes, RussifierType } from "../enums";

const gPlayerTypesMap = new Map<number, ConverterTypes | RussifierType.Disabled>();

let gDefaultType = ConverterTypes.SanLtd;
let gIsDefaultEnabled = true;

export class Russifier {
  static setPlayerType(playerId: number, type: ConverterTypes) {
    gPlayerTypesMap.set(playerId, type);
  }

  static getPlayerType(playerId: number): ConverterTypes {
    const type = gPlayerTypesMap.get(playerId);

    return type === undefined || type === RussifierType.Disabled ? gDefaultType : type;
  }

  static getExplicitType(playerId: number) {
    return gPlayerTypesMap.get(playerId);
  }

  static disablePlayer(playerId: number) {
    gPlayerTypesMap.set(playerId, RussifierType.Disabled);
  }

  static forgetPlayer(playerId: number) {
    gPlayerTypesMap.delete(playerId);
  }

  static setDefaultType(type: ConverterTypes) {
    gDefaultType = type;
  }

  static getDefaultType() {
    return gDefaultType;
  }

  static toggleDefault(enabled: boolean) {
    gIsDefaultEnabled = enabled;
  }

  static isDefaultEnabled() {
    return gIsDefaultEnabled;
  }

  static isEnabledForPlayer(playerId: number) {
    const type = gPlayerTypesMap.get(playerId);

    return type === undefined ? this.isDefaultEnabled() : type !== RussifierType.Disabled;
  }
}

GameMode.onExit(({ next }) => {
  gPlayerTypesMap.clear();
  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  Russifier.forgetPlayer(player.id);
  return next();
});

export {};
