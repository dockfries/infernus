import type { ICommonOptions } from "filterscript/interfaces";
import type { KeysEnum } from "@infernus/core";
import { Player } from "@infernus/core";

export const isKeyJustDown = (
  key: KeysEnum,
  newKeys: KeysEnum,
  oldKeys: KeysEnum,
) => {
  if (newKeys & key && !(oldKeys & key)) return true;
  return false;
};

export const playSoundForAll = (
  soundId: number,
  x: number,
  y: number,
  z: number,
) => {
  Player.getInstances().forEach((p) => {
    if (p.isConnected()) p.playSound(soundId, x, y, z);
  });
};

export const playSoundForPlayersInRange = (
  soundId: number,
  range: number,
  x: number,
  y: number,
  z: number,
) => {
  Player.getInstances().forEach((p) => {
    if (p.isConnected() && p.isInRangeOfPoint(range, x, y, z))
      p.playSound(soundId, x, y, z);
  });
};

export const log = (options: ICommonOptions, msg: string) => {
  if (options.debug) console.log(msg);
};
