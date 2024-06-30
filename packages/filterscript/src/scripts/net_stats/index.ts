//
// Admin netstats display
//

import type { IFilterScript, Player } from "@infernus/core";
import {
  InvalidEnum,
  NetStats,
  Dialog,
  DialogStylesEnum,
  PlayerEvent,
} from "@infernus/core";

let gNetStatsPlayer: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID;
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

export const NetStatsFs: IFilterScript = {
  name: "net_stats",
  offs: [],
  load() {
    PlayerEvent.onCommandText("netstats", ({ player, next }) => {
      if (!player.isAdmin()) return next();
      gNetStatsPlayer = player;
      netStatsDisplay();
      gNetStatsTimer = setInterval(netStatsDisplay, 3000); // this will refresh the display every 3 seconds
    });

    console.log("\n--Admin NetStats FS loaded.\n");
    this.offs.push();
  },
  unload() {
    gNetStatsTimer && clearInterval(gNetStatsTimer);
    gNetStatsTimer = null;
    gNetStatsPlayer = InvalidEnum.PLAYER_ID;
    this.offs.forEach((off) => off());
    this.offs = [];
  },
};
