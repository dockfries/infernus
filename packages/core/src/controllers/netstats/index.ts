import type { ConnectionStatusEnum } from "core/enums";
import * as f from "core/wrapper/native/functions";
import type { Player } from "../player";

export class NetStats {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static getNetworkStats(): string {
    return f.GetNetworkStats();
  }
  static getPlayerNetworkStats<P extends Player>(player: P): string {
    return f.GetPlayerNetworkStats(player.id);
  }
  static getBytesReceived<P extends Player>(player: P): number {
    return f.NetStats_BytesReceived(player.id);
  }
  static getBytesSent<P extends Player>(player: P): number {
    return f.NetStats_BytesSent(player.id);
  }
  static getConnectionStatus<P extends Player>(
    player: P
  ): ConnectionStatusEnum {
    return f.NetStats_ConnectionStatus(player.id);
  }
  static getConnectedTime<P extends Player>(player: P): number {
    return f.NetStats_GetConnectedTime(player.id);
  }
  static getIpPort<P extends Player>(player: P): string {
    return f.NetStats_GetIpPort(player.id);
  }
  static getMessagesReceived<P extends Player>(player: P): number {
    return f.NetStats_MessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond<P extends Player>(player: P): number {
    return f.NetStats_MessagesRecvPerSecond(player.id);
  }
  static getMessagesSent<P extends Player>(player: P): number {
    return f.NetStats_MessagesSent(player.id);
  }
  static getPacketLossPercent<P extends Player>(player: P): number {
    return f.NetStats_PacketLossPercent(player.id);
  }
}
