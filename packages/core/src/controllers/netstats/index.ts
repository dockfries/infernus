import type { ConnectionStatusEnum } from "core/enums";
import * as w from "core/wrapper/native";
import type { Player } from "../player";

export class NetStats {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }
  static getNetworkStats(): string {
    return w.GetNetworkStats();
  }
  static getPlayerNetworkStats(player: Player): string {
    return w.GetPlayerNetworkStats(player.id);
  }
  static getBytesReceived(player: Player): number {
    return w.NetStats_BytesReceived(player.id);
  }
  static getBytesSent(player: Player): number {
    return w.NetStats_BytesSent(player.id);
  }
  static getConnectionStatus(player: Player): ConnectionStatusEnum {
    return w.NetStats_ConnectionStatus(player.id);
  }
  static getConnectedTime(player: Player): number {
    return w.NetStats_GetConnectedTime(player.id);
  }
  static getIpPort(player: Player): string {
    return w.NetStats_GetIpPort(player.id);
  }
  static getMessagesReceived(player: Player): number {
    return w.NetStats_MessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond(player: Player): number {
    return w.NetStats_MessagesRecvPerSecond(player.id);
  }
  static getMessagesSent(player: Player): number {
    return w.NetStats_MessagesSent(player.id);
  }
  static getPacketLossPercent(player: Player): number {
    return w.NetStats_PacketLossPercent(player.id);
  }
}
