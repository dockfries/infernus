import { I18n } from "core/controllers/i18n";
import type { Player } from "../controllers/player/entity";
import { LimitsEnum } from "../enums";
import type { IDialog } from "../interfaces";
import { rgba } from "./colorUtils";

type processTuple = [string, string | number[]];

export const processMsg = (msg: string, charset: string): processTuple => {
  const isUtf8 = charset.replace("-", "") === "utf8";
  const res = isUtf8 ? msg : I18n.encodeToBuf(msg, charset);
  const flag = res instanceof Array ? "a" : "s";
  return [flag, res];
};

// Here are some i18n functions used to override the original functions
export const SendClientMessage = (
  player: Player,
  color: string | number,
  msg: string,
): number => {
  const res = processMsg(msg, player.charset);
  return samp.callNative(
    "SendClientMessage",
    `ii${res[0]}`,
    player.id,
    rgba(color),
    res[1],
  );
};

export const SendClientMessageToAll = (
  players: Array<Player>,
  color: string | number,
  msg: string,
): number => {
  players.forEach((p) => SendClientMessage(p, color, msg));
  return 1;
};

export const SendPlayerMessageToPlayer = (
  player: Player,
  senderId: number,
  message: string,
): number => {
  const res = processMsg(message, player.charset);
  return samp.callNative(
    "SendPlayerMessageToPlayer",
    `ii${res[0]}`,
    player.id,
    senderId,
    res[1],
  );
};

export const SendPlayerMessageToAll = (
  players: Array<Player>,
  senderId: number,
  message: string,
): number => {
  players.forEach((p) => {
    SendPlayerMessageToPlayer(p, senderId, message);
  });
  return 1;
};

export const ShowPlayerDialog = (
  player: Player,
  id: number,
  dialog: IDialog,
): boolean => {
  const { charset } = player;
  const { style, caption, info, button1, button2 } = dialog;
  const [flag, processCaption] = processMsg(caption || "", charset);
  const [, processInfo] = processMsg(info || "", charset);
  const [, processButton1] = processMsg(button1 || "", charset);
  const [, processButton2] = processMsg(button2 || "", charset);
  return !!samp.callNative(
    "ShowPlayerDialog",
    `iii${flag.repeat(4)}`,
    player.id,
    id,
    style,
    processCaption,
    processInfo,
    processButton1,
    processButton2,
  );
};

export const GetPlayerName = (player: Player) => {
  const [buf, ret]: [number[], number] = samp.callNative(
    "GetPlayerName",
    "iAi",
    player.id,
    LimitsEnum.MAX_PLAYER_NAME,
  );
  return {
    name: I18n.decodeFromBuf(I18n.getValidStr(buf), player.charset),
    ret,
  };
};

export const SetPlayerName = (player: Player, name: string): number => {
  return samp.callNative(
    "SetPlayerName",
    "ia",
    player.id,
    I18n.encodeToBuf(name, player.charset),
  );
};

export const BanEx = (
  playerId: number,
  reason: string,
  charset: string,
): number => {
  const buf = I18n.encodeToBuf(reason, charset);
  return samp.callNative("BanEx", "ia", playerId, buf);
};

export const SendRconCommand = (command: string, charset = "utf8"): number => {
  const [flag, processCommand] = processMsg(command, charset);
  return samp.callNative("SendRconCommand", flag, processCommand);
};

export const CreateDynamic3DTextLabel = (
  charset: string,
  text: string,
  color: number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer: number,
  attachedVehicle: number,
  testLos: boolean,
  worldId: number,
  interiorId: number,
  playerId: number,
  streamDistance: number,
  areaId: number,
  priority: number,
): number => {
  const buf = I18n.encodeToBuf(text, charset);
  return samp.callNative(
    "CreateDynamic3DTextLabel",
    "aiffffiiiiiifii",
    buf,
    color,
    x,
    y,
    z,
    drawDistance,
    attachedPlayer,
    attachedVehicle,
    testLos,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority,
  );
};

export const CreateDynamic3DTextLabelEx = (
  text: string,
  color: number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer: number,
  attachedVehicle: number,
  testLos: boolean,
  streamDistance: number,
  worlds: number[],
  interiors: number[],
  players: number[],
  areas: number[],
  priority: number,
  charset: string,
): number => {
  const buf = I18n.encodeToBuf(text, charset);
  return samp.callNative(
    "CreateDynamic3DTextLabelEx",
    "aiffffiiifaaaaiiiii",
    buf,
    color,
    x,
    y,
    z,
    drawDistance,
    attachedPlayer,
    attachedVehicle,
    testLos,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length,
  );
};

export const UpdateDynamic3DTextLabelText = (
  id: number,
  color: number,
  text: string,
  charset: string,
): number => {
  const buf = I18n.encodeToBuf(text, charset);
  return samp.callNative("UpdateDynamic3DTextLabelText", "iia", id, color, buf);
};

export const GetDynamic3DTextLabelText = (id: number, charset: string) => {
  const [buf, ret]: [number[], number] = samp.callNative(
    "GetDynamic3DTextLabelText",
    "iAi",
    id,
    1024,
  );
  return {
    text: I18n.decodeFromBuf(I18n.getValidStr(buf), charset),
    ret,
  };
};

export const SetDynamicObjectMaterialText = (
  charset: string,
  objectId: number,
  materialIndex: number,
  text: string,
  materialSize: number,
  fontFace: string,
  fontsize: number,
  bold: number,
  fontColor: number,
  backColor: number,
  textAlignment: number,
): number => {
  const textBuf = I18n.encodeToBuf(text, charset);
  const fontFaceBuf = I18n.encodeToBuf(fontFace, charset);
  return samp.callNative(
    "SetDynamicObjectMaterialText",
    "iiaiaiiiii",
    objectId,
    materialIndex,
    textBuf,
    materialSize,
    fontFaceBuf,
    fontsize,
    bold,
    fontColor,
    backColor,
    textAlignment,
  );
};

export const GetDynamicObjectMaterial = (
  objectId: number,
  materialIndex: number,
  charset: string = "utf8",
) => {
  const [modelId, txdNameBuf, textureNameBuf, materialColor, ret]: [
    number,
    number[],
    number[],
    number,
    number,
  ] = samp.callNative(
    "GetDynamicObjectMaterial",
    "iiIAAIii",
    objectId,
    materialIndex,
    64,
    64,
  );
  return {
    modelId,
    txdName: I18n.decodeFromBuf(I18n.getValidStr(txdNameBuf), charset),
    textureName: I18n.decodeFromBuf(I18n.getValidStr(textureNameBuf), charset),
    materialColor,
    ret,
  };
};

export const GetDynamicObjectMaterialText = (
  objectId: number,
  materialIndex: number,
  charset: string,
) => {
  const [
    text,
    materialSize,
    fontFace,
    fontSize,
    bold,
    fontColor,
    backColor,
    textAlignment,
    ret,
  ] = samp.callNative(
    "GetDynamicObjectMaterialText",
    "iiAIAIIIIIii",
    objectId,
    materialIndex,
    2048,
    32,
  ) as [
    number[],
    number,
    number[],
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  const textStr = I18n.decodeFromBuf(text, charset);
  const fontFaceStr = I18n.decodeFromBuf(fontFace, charset);
  return {
    text: textStr,
    materialSize,
    fontFace: fontFaceStr,
    fontSize,
    bold,
    fontColor,
    backColor,
    textAlignment,
    ret,
  };
};

export const SetPlayerChatBubble = (
  playerId: number,
  text: string,
  color: string | number,
  drawDistance: number,
  expireTime: number,
  charset: string,
): boolean => {
  const textBuf = I18n.encodeToBuf(text, charset);
  return !!samp.callNative(
    "SetPlayerChatBubble",
    "iaifi",
    playerId,
    textBuf,
    rgba(color),
    drawDistance,
    expireTime,
  );
};
