import { I18n } from "core/utils/i18n";
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
  playerId: number,
): ConnectionStatusEnum => {
  return samp.callNative("NetStats_ConnectionStatus", "i", playerId);
};

export const NetStats_GetIpPort = (playerId: number) => {
  const [ipPort, ret] = samp.callNative(
    "NetStats_GetIpPort",
    "iSi",
    playerId,
    128 + 6,
  ) as [string, number];
  return { ipPort, ret };
};

export const IsPlayerAdmin = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerAdmin", "i", playerId));
};

export const SetPlayerAdmin = (playerId: number, admin: boolean): boolean => {
  return !!samp.callNative("SetPlayerAdmin", "ii", playerId, admin);
};

export const Kick = (playerId: number): boolean => {
  return !!samp.callNative("Kick", "i", playerId);
};

export const Ban = (playerId: number): boolean => {
  return !!samp.callNative("Ban", "i", playerId);
};

export const GetPlayerNetworkStats = (playerId: number) => {
  const [stats, ret] = samp.callNative(
    "GetPlayerNetworkStats",
    "iSi",
    playerId,
    1024,
  ) as [string, number];
  return { stats, ret };
};

export const GetNetworkStats = () => {
  const [stats, ret]: [string, number] = samp.callNative(
    "GetNetworkStats",
    "Si",
    1024,
  );
  return { stats, ret };
};

export const BlockIpAddress = (ipAddress: string, timeMs: number): number => {
  return samp.callNative("BlockIpAddress", "si", ipAddress, timeMs);
};

export const UnBlockIpAddress = (ipAddress: string): number => {
  return samp.callNative("UnBlockIpAddress", "s", ipAddress);
};

export const gpci = (playerId: number, charset: string) => {
  const [val, ret]: [number[], number] = samp.callNative(
    "gpci",
    "iAi",
    playerId,
    41,
  );
  return {
    val: I18n.decodeFromBuf(I18n.getValidStr(val), charset),
    ret,
  };
};

export const SendClientCheck = (
  playerId: number,
  type: number,
  memAddr: number,
  memOffset: number,
  byteCount: number,
): number => {
  return samp.callNative(
    "SendClientCheck",
    "iiiii",
    playerId,
    type,
    memAddr,
    memOffset,
    byteCount,
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

export const GetPlayerIp = (playerId: number) => {
  const [ip, ret] = samp.callNative("GetPlayerIp", "iSi", playerId, 128) as [
    string,
    number,
  ];
  return { ip, ret };
};

export const GetPlayerVersion = (playerId: number) => {
  const [version, ret] = samp.callNative(
    "GetPlayerVersion",
    "iSi",
    playerId,
    24,
  ) as [string, number];
  return { version, ret };
};
