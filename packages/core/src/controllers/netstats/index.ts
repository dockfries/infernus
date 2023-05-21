import type { ConnectionStatusEnum } from "core/enums";
import * as fns from "core/wrapper/native/functions";
import type { Player } from "../player";

export class NetStats {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static getNetworkStats(): string {
    return fns.GetNetworkStats();
  }
  static getPlayerNetworkStats<P extends Player>(player: P): string {
    return fns.GetPlayerNetworkStats(player.id);
  }
  static getBytesReceived<P extends Player>(player: P): number {
    return fns.NetStats_BytesReceived(player.id);
  }
  static getBytesSent<P extends Player>(player: P): number {
    return fns.NetStats_BytesSent(player.id);
  }
  static getConnectionStatus<P extends Player>(
    player: P
  ): ConnectionStatusEnum {
    return fns.NetStats_ConnectionStatus(player.id);
  }
  static getConnectedTime<P extends Player>(player: P): number {
    return fns.NetStats_GetConnectedTime(player.id);
  }
  static getIpPort<P extends Player>(player: P): string {
    return fns.NetStats_GetIpPort(player.id);
  }
  static getMessagesReceived<P extends Player>(player: P): number {
    return fns.NetStats_MessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond<P extends Player>(player: P): number {
    return fns.NetStats_MessagesRecvPerSecond(player.id);
  }
  static getMessagesSent<P extends Player>(player: P): number {
    return fns.NetStats_MessagesSent(player.id);
  }
  static getPacketLossPercent<P extends Player>(player: P): number {
    return fns.NetStats_PacketLossPercent(player.id);
  }
}
