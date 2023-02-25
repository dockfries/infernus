import { ConnectionStatusEnum } from "@/enums";
import * as fns from "@/wrapper/native/functions";
import { BasePlayer } from "../player";

export class NetStats {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static getNetworkStats(): string {
    return fns.GetNetworkStats();
  }
  static getPlayerNetworkStats<P extends BasePlayer>(player: P): string {
    return fns.GetPlayerNetworkStats(player.id);
  }
  static getBytesReceived<P extends BasePlayer>(player: P): number {
    return fns.NetStats_BytesReceived(player.id);
  }
  static getBytesSent<P extends BasePlayer>(player: P): number {
    return fns.NetStats_BytesSent(player.id);
  }
  static getConnectionStatus<P extends BasePlayer>(
    player: P
  ): ConnectionStatusEnum {
    return fns.NetStats_ConnectionStatus(player.id);
  }
  static getConnectedTime<P extends BasePlayer>(player: P): number {
    return fns.NetStats_GetConnectedTime(player.id);
  }
  static getIpPort<P extends BasePlayer>(player: P): string {
    return fns.NetStats_GetIpPort(player.id);
  }
  static getMessagesReceived<P extends BasePlayer>(player: P): number {
    return fns.NetStats_MessagesReceived(player.id);
  }
  static getMessagesRecvPerSecond<P extends BasePlayer>(player: P): number {
    return fns.NetStats_MessagesRecvPerSecond(player.id);
  }
  static getMessagesSent<P extends BasePlayer>(player: P): number {
    return fns.NetStats_MessagesSent(player.id);
  }
  static getPacketLossPercent<P extends BasePlayer>(player: P): number {
    return fns.NetStats_PacketLossPercent(player.id);
  }
}
