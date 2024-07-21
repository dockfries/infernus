//
// Admin netstats display
//

import type { IFilterScript } from "@infernus/core";
import { Player } from "@infernus/core";
import {
  InvalidEnum,
  NetStats,
  Dialog,
  DialogStylesEnum,
  PlayerEvent,
} from "@infernus/core";

let gNetStatsPlayer: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID;
let gNetStatsDisplay: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID;
let gNetStatsTimer: NodeJS.Timeout | null = null;

async function netStatsDisplay() {
  const netStatsStr = NetStats.getNetworkStats();
  try {
    await new Dialog({
      style: DialogStylesEnum.MSGBOX,
      caption: "Server NetStats",
      info: netStatsStr,
      button1: "Ok",
    }).show(gNetStatsPlayer as Player);
    gNetStatsTimer && clearInterval(gNetStatsTimer);
    gNetStatsPlayer = InvalidEnum.PLAYER_ID;
  } catch {
    /* empty */
  }
}

async function netStatsDisplay2() {
  const player = gNetStatsDisplay as Player;
  const szPlayerIpPort = NetStats.getIpPort(player);
  const connectedTime = NetStats.getConnectedTime(player);
  const connectionStatus = NetStats.getConnectionStatus(player);
  const packetLossPercent = NetStats.getPacketLossPercent(player).toFixed(2);
  const messagesReceived = NetStats.getMessagesReceived(player);
  const messagesSent = NetStats.getMessagesSent(player);
  const messagesRecvPerSecond = NetStats.getMessagesRecvPerSecond(player);
  const netStatsStr = [
    `IP_Port: ${szPlayerIpPort}`,
    `Connected Time (ms): ${connectedTime}`,
    `Connection Status: ${connectionStatus}`,
    `Packet Loss: ${packetLossPercent}`,
    `Messages Recv: ${messagesReceived}`,
    `Messages Sent: ${messagesSent}`,
    `Messages/sec: ${messagesRecvPerSecond}`,
  ].join("\n");
  try {
    await new Dialog({
      style: DialogStylesEnum.MSGBOX,
      caption: "Player NetStats",
      info: netStatsStr,
      button1: "Ok",
    }).show(gNetStatsPlayer as Player);
    gNetStatsTimer && clearInterval(gNetStatsTimer);
    gNetStatsPlayer = InvalidEnum.PLAYER_ID;
  } catch {
    /* empty */
  }
}

export const NetStatsFs: IFilterScript = {
  name: "net_stats",
  load() {
    const netstatCmd = PlayerEvent.onCommandText(
      ["netstats", "pnetstats"],
      ({ player, next }) => {
        if (!player.isAdmin()) return false;

        gNetStatsTimer && clearInterval(gNetStatsTimer);

        gNetStatsPlayer = player;
        netStatsDisplay();
        gNetStatsTimer = setInterval(netStatsDisplay, 3000); // this will refresh the display every 3 seconds
        return next();
      },
    );

    const netstatCmd2 = PlayerEvent.onCommandText(
      ["netstats2", "pnetstats2"],
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;

        const [gNetStatsDisplayId] = subcommand;
        if (!gNetStatsDisplayId || !Player.isConnected(+gNetStatsDisplayId))
          return next();

        gNetStatsDisplay = Player.getInstance(+gNetStatsDisplayId)!;

        gNetStatsTimer && clearInterval(gNetStatsTimer);
        gNetStatsPlayer = player;
        netStatsDisplay2();
        gNetStatsTimer = setInterval(netStatsDisplay2, 3000); // this will refresh the display every 3 seconds

        return next();
      },
    );

    console.log("\n--Admin NetStats FS loaded.\n");

    return [netstatCmd, netstatCmd2];
  },
  unload() {
    gNetStatsTimer && clearInterval(gNetStatsTimer);
    gNetStatsTimer = null;

    gNetStatsPlayer = InvalidEnum.PLAYER_ID;
    gNetStatsDisplay = InvalidEnum.PLAYER_ID;
  },
};
