import type { ConnectionStatusEnum } from "core/enums";
import * as f from "core/wrapper/native/functions";
import type { Player } from "../player";

export class NetStats {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static getNetworkStats(): string {
    return f.GetNetworkStats();
  }
  static getPlayerNetworkStats(player: Player): string {
    return f.GetPlayerNetworkStats(player.id);
  }
  static getBytesReceived(player: Player): number {
    return f.NetStats_BytesReceived(player.id);
  }
  static getBytesSent(player: Player): number {
    return f.NetStats_BytesSent(player.id);
  }
  static getConnectionStatus(player: Player): ConnectionStatusEnum {
    return f.NetStats_ConnectionStatus(player.id);
  }
  static getConnectedTime(player: Player): number {
    return f.NetStats_GetConnectedTime(player.id);
  }
  static getIpPort(player: Player): string {
    return f.NetStats_GetIpPort(player.id);
  }
  static getMessagesReceived(player: Player): number {
    return f.NetStats_MessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond(player: Player): number {
    return f.NetStats_MessagesRecvPerSecond(player.id);
  }
  static getMessagesSent(player: Player): number {
    return f.NetStats_MessagesSent(player.id);
  }
  static getPacketLossPercent(player: Player): number {
    return f.NetStats_PacketLossPercent(player.id);
  }
}
