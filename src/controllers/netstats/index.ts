import { ConnectionStatusEnum } from "@/enums";
import {
  NetStats_BytesReceived,
  NetStats_BytesSent,
  NetStats_ConnectionStatus,
  NetStats_GetConnectedTime,
  NetStats_GetIpPort,
  NetStats_MessagesReceived,
  NetStats_MessagesRecvPerSecond,
  NetStats_MessagesSent,
  NetStats_PacketLossPercent,
} from "@/wrapper/functions";
import { BasePlayer } from "../player";

export class NetStats {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  public static getBytesReceived<P extends BasePlayer>(player: P): number {
    return NetStats_BytesReceived(player.id);
  }
  public static getBytesSent<P extends BasePlayer>(player: P): number {
    return NetStats_BytesSent(player.id);
  }
  public static getConnectionStatus<P extends BasePlayer>(
    player: P
  ): ConnectionStatusEnum {
    return NetStats_ConnectionStatus(player.id);
  }
  public static getConnectedTime<P extends BasePlayer>(player: P): number {
    return NetStats_GetConnectedTime(player.id);
  }
  public static getIpPort<P extends BasePlayer>(player: P): string {
    return NetStats_GetIpPort(player.id);
  }
  public static getMessagesReceived<P extends BasePlayer>(player: P): number {
    return NetStats_MessagesReceived(player.id);
  }
  public static getMessagesRecvPerSecond<P extends BasePlayer>(
    player: P
  ): number {
    return NetStats_MessagesRecvPerSecond(player.id);
  }
  public static getMessagesSent<P extends BasePlayer>(player: P): number {
    return NetStats_MessagesSent(player.id);
  }
  public static getPacketLossPercent<P extends BasePlayer>(player: P): number {
    return NetStats_PacketLossPercent(player.id);
  }
}
