import { I18n, Player } from "@infernus/core";
import { ConverterTypes, RussifierType } from "../enums";
import { Converter } from "./converter";
import { Russifier } from "./russifier";
import { defaultRussCharset } from "../constants";

export function getRussifierText(type: RussifierType, str: string) {
  const _type = +type as ConverterTypes;
  let retBytes: number[] = [];

  if (_type < 0 || _type >= ConverterTypes.Hungarian + 1) {
    return { str: "", buffer: retBytes, ret: false };
  }

  retBytes = Converter.process(I18n.encodeToBuf(str, defaultRussCharset).slice(0, -1), _type);

  return {
    str: I18n.decodeFromBuf(retBytes, defaultRussCharset),
    buffer: retBytes,
    ret: true,
  };
}

export function setPlayerRussifierType(player: Player, type: RussifierType) {
  if (type === RussifierType.Disabled) {
    Russifier.disablePlayer(player.id);
    return true;
  }

  const _type = +type as ConverterTypes;
  if (_type < 0 || _type >= ConverterTypes.Hungarian + 1) {
    return false;
  }

  Russifier.setPlayerType(player.id, _type);
  return true;
}

export function getPlayerRussifierType(player: Player): RussifierType {
  const type = Russifier.getExplicitType(player.id);

  return type === undefined ? RussifierType.Disabled : (+type as RussifierType);
}

export function setDefaultRussifierType(type: RussifierType) {
  if (type == RussifierType.Disabled) {
    Russifier.toggleDefault(false);
    return true;
  }

  const _type = +type as ConverterTypes;
  if (_type < 0 || _type >= ConverterTypes.Hungarian + 1) {
    return false;
  }

  Russifier.setDefaultType(_type);
  return true;
}

export function getDefaultRussifierType(): RussifierType {
  if (!Russifier.isDefaultEnabled()) {
    return RussifierType.Disabled;
  }

  return +Russifier.getDefaultType();
}

export function isDefaultRussifierEnabled() {
  return Russifier.isDefaultEnabled();
}

export function toggleDefaultRussifier(enabled: boolean) {
  return Russifier.toggleDefault(enabled);
}
