import type { ICommonOptions } from "filterscript/interfaces";
import type { KeysEnum } from "@infernus/core";
import { Player } from "@infernus/core";

export const IsKeyJustDown = (
  key: KeysEnum,
  newkeys: KeysEnum,
  oldkeys: KeysEnum,
) => {
  if (newkeys & key && !(oldkeys & key)) return true;
  return false;
};

export const PlaySoundForAll = (
  soundid: number,
  x: number,
  y: number,
  z: number,
) => {
  Player.getInstances().forEach((p) => {
    if (p.isConnected()) p.playSound(soundid, x, y, z);
  });
};

export const PlaySoundForPlayersInRange = (
  soundid: number,
  range: number,
  x: number,
  y: number,
  z: number,
) => {
  Player.getInstances().forEach((p) => {
    if (p.isConnected() && p.isInRangeOfPoint(range, x, y, z))
      p.playSound(soundid, x, y, z);
  });
};

export const log = (options: ICommonOptions, msg: string) => {
  if (options.debug) console.log(msg);
};
