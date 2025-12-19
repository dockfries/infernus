import type { Player } from "../components/player/entity";
import type { ICommonRetVal, IDialog } from "../interfaces";
import type { IMaterialText } from "core/wrapper/native/interfaces";
import { I18n } from "core/utils/i18n";
import { LimitsEnum } from "../enums";
import { rgba } from "./color";

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
): boolean => {
  const res = processMsg(msg, player.charset);
  return !!samp.callNative(
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
): boolean => {
  return players
    .map((p) => SendClientMessage(p, color, msg))
    .every((v) => v === true);
};

export const SendPlayerMessageToPlayer = (
  player: Player,
  senderId: number,
  message: string,
): boolean => {
  const res = processMsg(message, player.charset);
  return !!samp.callNative(
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
): boolean => {
  return players
    .map((p) => SendPlayerMessageToPlayer(p, senderId, message))
    .every((v) => v === true);
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
): boolean => {
  const buf = I18n.encodeToBuf(reason, charset);
  return !!samp.callNative("BanEx", "ia", playerId, buf);
};

export const SendRconCommand = (command: string, charset = "utf8"): boolean => {
  const [flag, processCommand] = processMsg(command, charset);
  return !!samp.callNative("SendRconCommand", flag, processCommand);
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
  testLOS: boolean,
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
    testLOS,
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
  testLOS: boolean,
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
    testLOS,
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

export const SetObjectMaterialText = (
  charset: string,
  objectId: number,
  text: string,
  materialIndex: number,
  materialSize: number,
  fontFace: string,
  fontSize: number,
  bold = true,
  fontColor: string | number,
  backColor: string | number,
  textAlignment: number,
): boolean => {
  const textBuf = I18n.encodeToBuf(text, charset);
  const fontFaceBuf = I18n.encodeToBuf(fontFace, charset);
  return !!samp.callNative(
    "SetObjectMaterialText",
    "iaiiaiiiii",
    objectId,
    textBuf,
    materialIndex,
    materialSize,
    fontFaceBuf,
    fontSize,
    bold,
    rgba(fontColor),
    rgba(backColor),
    textAlignment,
  );
};

export const GetObjectMaterialText = (
  objectId: number,
  materialIndex: number,
  charset: string,
): IMaterialText & ICommonRetVal => {
  const [
    text,
    materialSize = 0,
    fontFace,
    fontSize = 0,
    bold = 0,
    fontColor = 0,
    backColor = 0,
    textAlignment = 0,
    ret,
  ]: [
    number[],
    number,
    number[],
    number,
    number,
    number,
    number,
    number,
    number,
  ] = samp.callNative(
    "GetObjectMaterialText",
    "iiAiIAiIIIII",
    objectId,
    materialIndex,
    2048,
    32,
  );
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
    ret: !!ret,
  };
};

export const SetPlayerObjectMaterialText = (
  charset: string,
  playerId: number,
  objectId: number,
  text: string,
  materialIndex: number,
  materialSize: number,
  fontFace: string,
  fontsize: number,
  bold = true,
  fontColor: string | number,
  backColor: string | number,
  textAlignment: number,
): boolean => {
  const textBuf = I18n.encodeToBuf(text, charset);
  const fontFaceBuf = I18n.encodeToBuf(fontFace, charset);
  return !!samp.callNative(
    "SetPlayerObjectMaterialText",
    "iiaiiaiiiii",
    playerId,
    objectId,
    textBuf,
    materialIndex,
    materialSize,
    fontFaceBuf,
    fontsize,
    bold,
    rgba(fontColor),
    rgba(backColor),
    textAlignment,
  );
};

export const GetPlayerObjectMaterialText = (
  playerId: number,
  objectId: number,
  materialIndex: number,
  charset: string,
): IMaterialText & ICommonRetVal => {
  const [
    text,
    materialSize = 0,
    fontFace,
    fontsize = 0,
    bold = 0,
    fontColor = 0,
    backColor = 0,
    textAlignment = 0,
    ret,
  ]: [
    number[],
    number,
    number[],
    number,
    number,
    number,
    number,
    number,
    number,
  ] = samp.callNative(
    "GetPlayerObjectMaterialText",
    "iiiAiIAiIIIII",
    playerId,
    objectId,
    materialIndex,
    2048,
    32,
  );
  const textStr = I18n.decodeFromBuf(text, charset);
  const fontFaceStr = I18n.decodeFromBuf(fontFace, charset);
  return {
    text: textStr,
    materialSize,
    fontFace: fontFaceStr,
    fontSize: fontsize,
    bold,
    fontColor,
    backColor,
    textAlignment,
    ret: !!ret,
  };
};

export const Create3DTextLabel = (
  charset: string,
  text: string,
  color: string | number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  virtualWorld: number,
  testLOS = false,
): number => {
  const buf = I18n.encodeToBuf(text, charset);
  return samp.callNative(
    "Create3DTextLabel",
    "aiffffii",
    buf,
    rgba(color),
    x,
    y,
    z,
    drawDistance,
    virtualWorld,
    testLOS,
  );
};

export const CreatePlayer3DTextLabel = (
  charset: string,
  playerId: number,
  text: string,
  color: string | number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer: number,
  attachedVehicle: number,
  testLOS: boolean,
): number => {
  const buf = I18n.encodeToBuf(text, charset);
  return samp.callNative(
    "CreatePlayer3DTextLabel",
    "iaiffffiii",
    playerId,
    buf,
    rgba(color),
    x,
    y,
    z,
    drawDistance,
    attachedPlayer,
    attachedVehicle,
    testLOS,
  );
};

export const Update3DTextLabelText = (
  charset: string,
  id: number,
  color: string | number,
  text: string,
): boolean => {
  const buf = I18n.encodeToBuf(text, charset);
  return !!samp.callNative(
    "Update3DTextLabelText",
    "iia",
    id,
    rgba(color),
    buf,
  );
};

export const UpdatePlayer3DTextLabelText = (
  charset: string,
  playerId: number,
  id: number,
  color: string | number,
  text: string,
): boolean => {
  const buf = I18n.encodeToBuf(text, charset);
  return !!samp.callNative(
    "UpdatePlayer3DTextLabelText",
    "iiia",
    playerId,
    id,
    rgba(color),
    buf,
  );
};

export const Get3DTextLabelText = (charset: string, id: number) => {
  const [buf, ret]: [number[], number] = samp.callNative(
    "Get3DTextLabelText",
    "iAi",
    id,
    144,
  );
  const text = I18n.decodeFromBuf(buf, charset);
  return { text, buf, ret: !!ret };
};

export const GetPlayer3DTextLabelText = (
  charset: string,
  playerId: number,
  id: number,
) => {
  const [buf, ret]: [number[], number] = samp.callNative(
    "GetPlayer3DTextLabelText",
    "iiAi",
    playerId,
    id,
    144,
  );
  const text = I18n.decodeFromBuf(buf, charset);
  return { text, buf, ret: !!ret };
};

export const GetMenuColumnHeader = (
  menuId: number,
  column: number,
  charset: string,
) => {
  const [buf, ret]: [number[], number] = samp.callNative(
    "GetMenuColumnHeader",
    "iiAi",
    menuId,
    column,
    31,
  );
  const header = I18n.decodeFromBuf(buf, charset);
  return { header, buf, ret: !!ret };
};

export const GetMenuItem = (
  menuId: number,
  column: number,
  itemId: number,
  charset: string,
) => {
  const [buf, ret]: [number[], number] = samp.callNative(
    "GetMenuItem",
    "iiiAi",
    menuId,
    column,
    itemId,
    31,
  );
  const item = I18n.decodeFromBuf(buf, charset);
  return { item, buf, ret: !!ret };
};

export const CreateMenu = (
  title: string,
  columns: number,
  x: number,
  y: number,
  col1width: number,
  col2width: number,
  charset: string,
): number => {
  return samp.callNative(
    "CreateMenu",
    "aiffff",
    I18n.encodeToBuf(title, charset),
    columns,
    x,
    y,
    col1width,
    col2width,
  );
};

export const AddMenuItem = (
  menuId: number,
  column: number,
  menuText: string,
  charset: string,
): number => {
  return samp.callNative(
    "AddMenuItem",
    "iia",
    menuId,
    column,
    I18n.encodeToBuf(menuText, charset),
  );
};

export const SetMenuColumnHeader = (
  menuId: number,
  column: number,
  columnHeader: string,
  charset: string,
): boolean => {
  return !!samp.callNative(
    "SetMenuColumnHeader",
    "iia",
    menuId,
    column,
    I18n.encodeToBuf(columnHeader, charset),
  );
};
