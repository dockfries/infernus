//
// A Driver NPC that goes around a path continuously
// Kye 2009
//

import { Npc, NpcEvent, VehicleEvent } from "@infernus/core";
import { npcNames } from "../constants";

export function initAt400LV() {
  const NUM_PLAYBACK_FILES = 3;
  const NPC_NAME = npcNames[3];

  let gPlaybackFileCycle = 0;

  function nextPlayback(npc: Npc) {
    if (gPlaybackFileCycle >= NUM_PLAYBACK_FILES) gPlaybackFileCycle = 0;

    if (gPlaybackFileCycle == 0) {
      npc.startPlayback(
        "recordings/at400_lv_to_sf_x1.rec",
        true,
        0,
        0,
        0,
        0,
        0,
        0,
      );
    } else if (gPlaybackFileCycle == 1) {
      npc.startPlayback(
        "recordings/at400_sf_to_ls_x1.rec",
        true,
        0,
        0,
        0,
        0,
        0,
        0,
      );
    } else if (gPlaybackFileCycle == 2) {
      npc.startPlayback(
        "recordings/at400_ls_to_lv_x1.rec",
        true,
        0,
        0,
        0,
        0,
        0,
        0,
      );
    }

    gPlaybackFileCycle++;
  }

  const offPlaybackEnd = NpcEvent.onPlaybackEnd(({ npc, next }) => {
    if (npc.getName() === NPC_NAME) {
      nextPlayback(npc);
    }
    return next();
  });

  const offPlayerEnter = VehicleEvent.onPlayerEnter(({ player, next }) => {
    if (player.isNpc() && player.getName().name === NPC_NAME) {
      nextPlayback(Npc.getInstance(player.id)!);
    }
    return next();
  });

  const offPlayerExit = VehicleEvent.onPlayerExit(({ player, next }) => {
    if (player.isNpc() && player.getName().name === NPC_NAME) {
      Npc.getInstance(player.id)!.stopPlayback();
      gPlaybackFileCycle = 0;
    }
    return next();
  });

  return [offPlaybackEnd, offPlayerEnter, offPlayerExit];
}
