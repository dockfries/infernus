import type { ConnectionStatusEnum } from "core/enums";
import * as w from "core/wrapper/native";
import type { Player } from "../player";

export class NetStats {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }
  static getNetworkStats() {
    return NetStats.__inject__.GetNetworkStats();
  }
  static getPlayerNetworkStats(player: Player) {
    return NetStats.__inject__.GetPlayerNetworkStats(player.id);
  }
  static getBytesReceived(player: Player): number {
    return NetStats.__inject__.NetStats_BytesReceived(player.id);
  }
  static getBytesSent(player: Player): number {
    return NetStats.__inject__.NetStats_BytesSent(player.id);
  }
  static getConnectionStatus(player: Player): ConnectionStatusEnum {
    return NetStats.__inject__.NetStats_ConnectionStatus(player.id);
  }
  static getConnectedTime(player: Player): number {
    return NetStats.__inject__.NetStats_GetConnectedTime(player.id);
  }
  static getIpPort(player: Player) {
    return NetStats.__inject__.NetStats_GetIpPort(player.id);
  }
  static getMessagesReceived(player: Player): number {
    return NetStats.__inject__.NetStats_MessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond(player: Player): number {
    return NetStats.__inject__.NetStats_MessagesRecvPerSecond(player.id);
  }
  static getMessagesSent(player: Player): number {
    return NetStats.__inject__.NetStats_MessagesSent(player.id);
  }
  static getPacketLossPercent(player: Player): number {
    return NetStats.__inject__.NetStats_PacketLossPercent(player.id);
  }

  static __inject__ = {
    GetNetworkStats: w.GetNetworkStats,
    GetPlayerNetworkStats: w.GetPlayerNetworkStats,
    NetStats_BytesReceived: w.NetStats_BytesReceived,
    NetStats_BytesSent: w.NetStats_BytesSent,
    NetStats_ConnectionStatus: w.NetStats_ConnectionStatus,
    NetStats_GetConnectedTime: w.NetStats_GetConnectedTime,
    NetStats_GetIpPort: w.NetStats_GetIpPort,
    NetStats_MessagesReceived: w.NetStats_MessagesReceived,
    NetStats_MessagesRecvPerSecond: w.NetStats_MessagesRecvPerSecond,
    NetStats_MessagesSent: w.NetStats_MessagesSent,
    NetStats_PacketLossPercent: w.NetStats_PacketLossPercent,
  };
}
