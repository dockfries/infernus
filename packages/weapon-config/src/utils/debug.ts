import { InvalidEnum, Player } from "@infernus/core";
import { innerWeaponConfig } from "../config";

export function debugMessage(
  player: Player | InvalidEnum.PLAYER_ID,
  msg: string,
) {
  const clientMsg = `(wc) ${msg}`;
  const logMsg = `(wc:${typeof player === "number" ? player : player.id}) ${msg}`;

  if (innerWeaponConfig.DEBUG_SILENT) {
    console.log(logMsg);
  } else if (innerWeaponConfig.DEBUG) {
    if (typeof player !== "number") {
      player.sendClientMessage(-1, clientMsg);
    }
    console.log(logMsg);
  }
}

export function debugMessageRed(player: Player, msg: string) {
  const clientMsg = `(wc) ${msg}`;
  const logMsg = `(wc:${player.id}) WARN: ${msg}`;

  if (innerWeaponConfig.DEBUG_SILENT) {
    console.log(logMsg);
  } else if (innerWeaponConfig.DEBUG) {
    player.sendClientMessage(0xcc0000ff, clientMsg);
    console.log(logMsg);
  }
}

export function debugMessageAll(msg: string) {
  const clientMsg = `(wc) ${msg}`;
  const logMsg = clientMsg;

  if (innerWeaponConfig.DEBUG_SILENT) {
    console.log(logMsg);
  } else if (innerWeaponConfig.DEBUG) {
    Player.sendClientMessageToAll(-1, clientMsg);
    console.log(logMsg);
  }
}

export function debugMessageRedAll(msg: string) {
  const clientMsg = `(wc) ${msg}`;
  const logMsg = `(wc) WARN: ${msg}`;

  if (innerWeaponConfig.DEBUG_SILENT) {
    console.log(logMsg);
  } else if (innerWeaponConfig.DEBUG) {
    Player.sendClientMessageToAll(0xcc0000ff, clientMsg);
    console.log(logMsg);
  }
}
