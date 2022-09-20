import { rgba } from "./colorUtils";
import { IDialog } from "@/interfaces";
import { LimitsEnum } from "@/enums";
import { I18n } from "@/controllers/i18n";
import { BasePlayer } from "@/controllers/player";
import { defaultCharset as defaultCharset } from "@/controllers/gamemode/settings";

type processTuple = [string, string | number[]];

export const processMsg = (msg: string, charset: string): processTuple => {
  const res: string | number[] = ["utf8", "utf-8"].includes(charset)
    ? msg
    : I18n.encodeToBuf(msg, charset);
  const flag = res instanceof Array ? "a" : "s";
  return [flag, res];
};

// Here are some i18n functions used to override the original functions
export const SendClientMessage = <P extends BasePlayer>(
  player: P,
  color: string,
  msg: string
): number => {
  const res = processMsg(msg, player.charset);
  return samp.callNative(
    "SendClientMessage",
    `ii${res[0]}`,
    player.id,
    rgba(color),
    res[1]
  );
};

export const SendClientMessageToAll = <P extends BasePlayer>(
  fn: Array<P>,
  color: string,
  msg: string
): number => {
  fn.forEach((player) => SendClientMessage(player, color, msg));
  return 1;
};

export const SendPlayerMessageToPlayer = <P extends BasePlayer>(
  player: P,
  senderId: number,
  message: string
): number => {
  const res = processMsg(message, player.charset);
  return samp.callNative(
    "SendPlayerMessageToPlayer",
    `ii${res[0]}`,
    player.id,
    senderId,
    res[1]
  );
};

export const SendPlayerMessageToAll = <P extends BasePlayer>(
  fn: Array<P>,
  senderId: number,
  message: string
): number => {
  fn.forEach((player) => SendPlayerMessageToPlayer(player, senderId, message));
  return 1;
};

export const ShowPlayerDialog = <P extends BasePlayer>(
  player: P,
  id: number,
  dialog: IDialog
): number => {
  const { charset } = player;
  const { style, caption, info, button1, button2 } = dialog;
  const [flag, processCaption] = processMsg(caption || "", charset);
  const [, processInfo] = processMsg(info || "", charset);
  const [, processButton1] = processMsg(button1 || "", charset);
  const [, processButton2] = processMsg(button2 || "", charset);
  return samp.callNative(
    "ShowPlayerDialog",
    `iii${flag.repeat(4)}`,
    player.id,
    id,
    style,
    processCaption,
    processInfo,
    processButton1,
    processButton2
  );
};

// see https://github.com/AmyrAhmady/samp-node/wiki/Events#sampnode_callevent.
// in short, when you write the flag a, you must add I after it, but this I will actually be ignored.

samp.registerEvent("OnPlayerTextI18n", "iai");
export const OnPlayerText = (
  fn: (playerid: number, buf: number[]) => number
) => {
  // get the player input text
  // and you can decode with the player's charset;
  samp.addEventListener("OnPlayerTextI18n", fn);
};

samp.registerEvent("OnPlayerCommandTextI18n", "iai");
export const OnPlayerCommandText = (
  fn: (playerid: number, buf: number[]) => number
) => {
  samp.addEventListener("OnPlayerCommandTextI18n", fn);
};

samp.registerEvent("OnDialogResponseI18n", "iiiiai");
export const OnDialogResponse = (
  fn: (
    playerid: number,
    dialogid: number,
    response: number,
    listitem: number,
    inputbuf: number[]
  ) => number
) => {
  samp.addEventListener("OnDialogResponseI18n", fn);
};

samp.registerEvent("OnClientMessageI18n", "iai");
export const OnClientMessage = (
  fn: (color: number, text: string) => number,
  charset = defaultCharset
) => {
  samp.addEventListener(
    "OnClientMessageI18n",
    (color: number, buf: number[]): void => {
      fn(color, I18n.decodeFromBuf(buf, charset));
    }
  );
};

samp.registerEvent("OnRconCommandI18n", "ai");
export const OnRconCommand = (
  fn: (cmd: string) => number,
  charset = defaultCharset
) => {
  samp.addEventListener("OnRconCommandI18n", (buf: number[]): void => {
    fn(I18n.decodeFromBuf(buf, charset));
  });
};

samp.registerEvent("OnRconLoginAttemptI18n", "aiaii");
export const OnRconLoginAttempt = (
  fn: (ip: string, password: string, success: boolean) => number,
  charset = defaultCharset
) => {
  samp.addEventListener(
    "OnRconLoginAttemptI18n",
    (ip: number[], password: number[], success: number): void => {
      fn(
        I18n.decodeFromBuf(ip, charset),
        I18n.decodeFromBuf(password, charset),
        Boolean(success)
      );
    }
  );
};

export const GetPlayerName = <P extends BasePlayer>(player: P): string => {
  const buf: number[] = samp.callNative(
    "GetPlayerName",
    "iAi",
    player.id,
    LimitsEnum.MAX_PLAYER_NAME
  );
  return I18n.decodeFromBuf(I18n.getValidStr(buf), player.charset);
};

export const SetPlayerName = <P extends BasePlayer>(
  player: P,
  name: string
): number => {
  return samp.callNative(
    "SetPlayerName",
    "ia",
    player.id,
    I18n.encodeToBuf(name, player.charset)
  );
};

export const BanEx = (
  playerid: number,
  reason: string,
  charset: string
): number => {
  const buf = I18n.encodeToBuf(reason, charset);
  return samp.callNative("BanEx", "ia", playerid, buf);
};

export const FindModelFileNameFromCRC = (crc: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("FindModelFileNameFromCRC", "iAi", crc, 255)
  );
  return I18n.decodeFromBuf(buf, defaultCharset);
};

export const FindTextureFileNameFromCRC = (crc: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("FindTextureFileNameFromCRC", "iAi", crc, 255)
  );
  return I18n.decodeFromBuf(buf, defaultCharset);
};

export const GetWeaponName = (weaponid: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("GetWeaponName", "iSi", weaponid, 32)
  );
  return I18n.decodeFromBuf(buf, defaultCharset);
};

export const NetStats_GetIpPort = (playerid: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("NetStats_GetIpPort", "iAi", playerid, 128 + 6)
  );
  return I18n.decodeFromBuf(buf, defaultCharset);
};

export const GetPlayerIp = (playerid: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("GetPlayerIp", "iAi", playerid, 128)
  );
  return I18n.decodeFromBuf(buf, defaultCharset);
};

export const GetAnimationName = (index: number): Array<string> => {
  const [libBuf, nameBuf]: Array<Array<number>> = samp.callNative(
    "GetAnimationName",
    "iAiAi",
    index,
    32,
    32
  );
  const lib = I18n.decodeFromBuf(libBuf, defaultCharset);
  const name = I18n.decodeFromBuf(nameBuf, defaultCharset);
  return [lib, name];
};

export const GetPlayerVersion = (playerid: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("GetPlayerVersion", "iAi", playerid, 24)
  );
  return I18n.decodeFromBuf(buf, defaultCharset);
};

// samp.registerEvent("OnMain", "");
// export const OnMain = (fn: () => void) => samp.addEventListener("OnMain", fn);
