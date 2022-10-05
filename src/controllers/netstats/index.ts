import { ConnectionStatusEnum } from "@/enums";
import * as fns from "@/wrapper/functions";
import { BasePlayer } from "../player";

export class NetStats {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  public static getNetworkStats(): string {
    return fns.GetNetworkStats();
  }
  public static getPlayerNetworkStats<P extends BasePlayer>(player: P): string {
    return fns.GetPlayerNetworkStats(player.id);
  }
  public static getBytesReceived<P extends BasePlayer>(player: P): number {
    return fns.NetStats_BytesReceived(player.id);
  }
  public static getBytesSent<P extends BasePlayer>(player: P): number {
    return fns.NetStats_BytesSent(player.id);
  }
  public static getConnectionStatus<P extends BasePlayer>(
    player: P
  ): ConnectionStatusEnum {
    return fns.NetStats_ConnectionStatus(player.id);
  }
  public static getConnectedTime<P extends BasePlayer>(player: P): number {
    return fns.NetStats_GetConnectedTime(player.id);
  }
  public static getIpPort<P extends BasePlayer>(player: P): string {
    return fns.NetStats_GetIpPort(player.id);
  }
  public static getMessagesReceived<P extends BasePlayer>(player: P): number {
    return fns.NetStats_MessagesReceived(player.id);
  }
  public static getMessagesRecvPerSecond<P extends BasePlayer>(
    player: P
  ): number {
    return fns.NetStats_MessagesRecvPerSecond(player.id);
  }
  public static getMessagesSent<P extends BasePlayer>(player: P): number {
    return fns.NetStats_MessagesSent(player.id);
  }
  public static getPacketLossPercent<P extends BasePlayer>(player: P): number {
    return fns.NetStats_PacketLossPercent(player.id);
  }
}
