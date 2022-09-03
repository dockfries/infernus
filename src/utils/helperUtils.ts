import { rgba } from "./colorUtils";
import { I18n, BaseGameMode, BasePlayer } from "@/controllers";
import { IDialog } from "@/interfaces";
import { LimitsEnum } from "@/enums";

type processTuple = [string, string | number[]];

export const processMsg = (msg: string, charset: string): processTuple => {
  const res: string | number[] = ["utf8", "utf-8"].includes(charset)
    ? msg
    : I18n.encodeToBuf(msg, charset);
  const flag = res instanceof Array ? "a" : "s";
  return [flag, res];
};

// Here are some i18n functions used to override the original functions
export const SendClientMessage = <T extends BasePlayer>(
  player: T,
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

export const SendClientMessageToAll = <T extends BasePlayer>(
  fn: Array<T>,
  color: string,
  msg: string
): number => {
  fn.forEach((player) => SendClientMessage(player, color, msg));
  return 1;
};

export const ShowPlayerDialog = <T extends BasePlayer>(
  player: T,
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
export const OnPlayerText = (fn: (playerid: number, buf: number[]) => void) => {
  // get the player input text
  // and you can decode with the player's charset;
  samp.addEventListener("OnPlayerTextI18n", fn);
};

samp.registerEvent("OnPlayerCommandTextI18n", "iai");
export const OnPlayerCommandText = (
  fn: (playerid: number, buf: number[]) => void
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
  ) => void
) => {
  samp.addEventListener("OnDialogResponseI18n", fn);
};

samp.registerEvent("OnClientMessageI18n", "iai");
export const OnClientMessage = (
  fn: (color: number, text: string) => void,
  charset = BaseGameMode.charset
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
  fn: (cmd: string) => void,
  charset = BaseGameMode.charset
) => {
  samp.addEventListener("OnRconCommandI18n", (buf: number[]): void => {
    fn(I18n.decodeFromBuf(buf, charset));
  });
};

samp.registerEvent("OnRconLoginAttemptI18n", "aiaii");
export const OnRconLoginAttempt = (
  fn: (ip: string, password: string, success: boolean) => void,
  charset = BaseGameMode.charset
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

export const GetPlayerName = <T extends BasePlayer>(player: T): string => {
  const buf: number[] = samp.callNative(
    "GetPlayerName",
    "iAi",
    player.id,
    LimitsEnum.MAX_PLAYER_NAME
  );
  return I18n.decodeFromBuf(I18n.getValidStr(buf), player.charset);
};
