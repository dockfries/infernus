import type { ConnectionStatusEnum } from "core/enums";
import * as w from "core/wrapper/native";
import type { Player } from "../player";

export class NetStats {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }
  static getNetworkStats() {
    return NetStats.__inject__.getNetworkStats();
  }
  static getPlayerNetworkStats(player: Player) {
    return NetStats.__inject__.getPlayerNetworkStats(player.id);
  }
  static getBytesReceived(player: Player): number {
    return NetStats.__inject__.getBytesReceived(player.id);
  }
  static getBytesSent(player: Player): number {
    return NetStats.__inject__.getBytesSent(player.id);
  }
  static getConnectionStatus(player: Player): ConnectionStatusEnum {
    return NetStats.__inject__.getConnectionStatus(player.id);
  }
  static getConnectedTime(player: Player): number {
    return NetStats.__inject__.getConnectedTime(player.id);
  }
  static getIpPort(player: Player) {
    return NetStats.__inject__.getIpPort(player.id);
  }
  static getMessagesReceived(player: Player): number {
    return NetStats.__inject__.getMessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond(player: Player): number {
    return NetStats.__inject__.getMessagesRecvPerSecond(player.id);
  }
  static getMessagesSent(player: Player): number {
    return NetStats.__inject__.getMessagesSent(player.id);
  }
  static getPacketLossPercent(player: Player): number {
    return NetStats.__inject__.getPacketLossPercent(player.id);
  }

  static __inject__ = {
    getNetworkStats: w.GetNetworkStats,
    getPlayerNetworkStats: w.GetPlayerNetworkStats,
    getBytesReceived: w.NetStats_BytesReceived,
    getBytesSent: w.NetStats_BytesSent,
    getConnectionStatus: w.NetStats_ConnectionStatus,
    getConnectedTime: w.NetStats_GetConnectedTime,
    getIpPort: w.NetStats_GetIpPort,
    getMessagesReceived: w.NetStats_MessagesReceived,
    getMessagesRecvPerSecond: w.NetStats_MessagesRecvPerSecond,
    getMessagesSent: w.NetStats_MessagesSent,
    getPacketLossPercent: w.NetStats_PacketLossPercent,
  };
}
