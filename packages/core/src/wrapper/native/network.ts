import { I18n } from "core/controllers/i18n";
import type { ConnectionStatusEnum } from "core/enums";

export const NetStats_GetConnectedTime = (playerId: number): number => {
  return samp.callNative("NetStats_GetConnectedTime", "i", playerId);
};

export const NetStats_MessagesReceived = (playerId: number): number => {
  return samp.callNative("NetStats_MessagesReceived", "i", playerId);
};

export const NetStats_BytesReceived = (playerId: number): number => {
  return samp.callNative("NetStats_BytesReceived", "i", playerId);
};

export const NetStats_MessagesSent = (playerId: number): number => {
  return samp.callNative("NetStats_MessagesSent", "i", playerId);
};

export const NetStats_BytesSent = (playerId: number): number => {
  return samp.callNative("NetStats_BytesSent", "i", playerId);
};

export const NetStats_MessagesRecvPerSecond = (playerId: number): number => {
  return samp.callNative("NetStats_MessagesRecvPerSecond", "i", playerId);
};

export const NetStats_PacketLossPercent = (playerId: number): number => {
  return samp.callNativeFloat("NetStats_PacketLossPercent", "i", playerId);
};

export const NetStats_ConnectionStatus = (
  playerId: number
): ConnectionStatusEnum => {
  return samp.callNative("NetStats_ConnectionStatus", "i", playerId);
};

export const NetStats_GetIpPort = (playerId: number): string => {
  return samp.callNative("NetStats_GetIpPort", "iSi", playerId, 128 + 6);
};

export const IsPlayerAdmin = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerAdmin", "i", playerId));
};

export const Kick = (playerId: number): number => {
  return samp.callNative("Kick", "i", playerId);
};

export const Ban = (playerId: number): number => {
  return samp.callNative("Ban", "i", playerId);
};

export const GetPlayerNetworkStats = (playerId: number): string => {
  return samp.callNative("GetPlayerNetworkStats", "iSi", playerId, 1024);
};

export const GetNetworkStats = (): string => {
  return samp.callNative("GetNetworkStats", "Si", 1024);
};

export const BlockIpAddress = (ip_address: string, timems: number): number => {
  return samp.callNative("BlockIpAddress", "si", ip_address, timems);
};

export const UnBlockIpAddress = (ip_address: string): number => {
  return samp.callNative("UnBlockIpAddress", "s", ip_address);
};

export const SendRconCommand = (command: string): number => {
  return samp.callNative("SendRconCommand", "s", command);
};

export const gpci = (playerId: number, charset: string): string => {
  return I18n.decodeFromBuf(
    I18n.getValidStr(samp.callNative("gpci", "iAi", playerId, 41)),
    charset
  );
};

export const SendClientCheck = (
  playerId: number,
  type: number,
  memAddr: number,
  memOffset: number,
  byteCount: number
): number => {
  return samp.callNative(
    "SendClientCheck",
    "iiiii",
    playerId,
    type,
    memAddr,
    memOffset,
    byteCount
  );
};
