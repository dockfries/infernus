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
  const [ipp] = samp.callNative("NetStats_GetIpPort", "iSi", playerId, 128 + 6);
  return ipp;
};

export const IsPlayerAdmin = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerAdmin", "i", playerId));
};

export const SetPlayerAdmin = (playerId: number, admin: boolean): number => {
  return samp.callNative("SetPlayerAdmin", "ii", playerId, admin);
};

export const Kick = (playerId: number): number => {
  return samp.callNative("Kick", "i", playerId);
};

export const Ban = (playerId: number): number => {
  return samp.callNative("Ban", "i", playerId);
};

export const GetPlayerNetworkStats = (playerId: number): string => {
  const [stats] = samp.callNative(
    "GetPlayerNetworkStats",
    "iSi",
    playerId,
    1024
  );
  return stats;
};

export const GetNetworkStats = (): string => {
  return samp.callNative("GetNetworkStats", "Si", 1024);
};

export const BlockIpAddress = (ip_address: string, timeMs: number): number => {
  return samp.callNative("BlockIpAddress", "si", ip_address, timeMs);
};

export const UnBlockIpAddress = (ip_address: string): number => {
  return samp.callNative("UnBlockIpAddress", "s", ip_address);
};

export const SendRconCommand = (command: string): number => {
  return samp.callNative("SendRconCommand", "s", command);
};

export const gpci = (playerId: number, charset: string): string => {
  const [ret] = samp.callNative("gpci", "iAi", playerId, 41);
  return I18n.decodeFromBuf(I18n.getValidStr(ret), charset);
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

export const ClearBanList = (): void => {
  samp.callNative("ClearBanList", "");
};

export const IsBanned = (ipAddress: string): boolean => {
  return Boolean(samp.callNative("IsBanned", "s", ipAddress));
};

export const GetPlayerRawIp = (playerId: number): string => {
  return samp.callNative("GetPlayerRawIp", "i", playerId);
};

export const GetPlayerIp = (playerId: number): string => {
  const [ip] = samp.callNative("GetPlayerIp", "iSi", playerId, 128);
  return ip;
};

export const GetPlayerVersion = (playerId: number): string => {
  const [version] = samp.callNative("GetPlayerVersion", "iSi", playerId, 24);
  return version;
};
