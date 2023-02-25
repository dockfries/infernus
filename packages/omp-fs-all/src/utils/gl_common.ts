import { ICommonOptions } from "@/interfaces";
import { BasePlayer, KeysEnum } from "omp-node-lib";

export const IsKeyJustDown = (
  key: KeysEnum,
  newkeys: KeysEnum,
  oldkeys: KeysEnum
) => {
  if (newkeys & key && !(oldkeys & key)) return true;
  return false;
};

export const PlaySoundForAll = (
  players: Array<BasePlayer>,
  soundid: number,
  x: number,
  y: number,
  z: number
) => {
  players.forEach((p) => {
    if (p.isConnected()) p.playSound(soundid, x, y, z);
  });
};

export const PlaySoundForPlayersInRange = (
  players: Array<BasePlayer>,
  soundid: number,
  range: number,
  x: number,
  y: number,
  z: number
) => {
  players.forEach((p) => {
    if (p.isConnected() && p.isInRangeOfPoint(range, x, y, z))
      p.playSound(soundid, x, y, z);
  });
};

export const log = (options: ICommonOptions, msg: string) => {
  if (options.debug) console.log(msg);
};
