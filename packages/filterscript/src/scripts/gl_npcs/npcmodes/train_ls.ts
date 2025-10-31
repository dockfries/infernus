//
// A Driver NPC that goes around a path continuously
// Kye 2009
//

import { Npc, NpcEvent, PlayerEvent, PlayerStateEnum } from "@infernus/core";
import { npcNames } from "../constants";

export function initTrainLs() {
  const NUM_PLAYBACK_FILES = 3;
  const NPC_NAME = npcNames[1];

  let gPlaybackFileCycle = 0;

  function nextPlayback(npc: Npc) {
    if (gPlaybackFileCycle >= NUM_PLAYBACK_FILES) gPlaybackFileCycle = 0;

    if (gPlaybackFileCycle === 0) {
      npc.startPlayback("train_ls_to_sf1", true, 0, 0, 0, 0, 0, 0);
    } else if (gPlaybackFileCycle === 1) {
      npc.startPlayback("train_sf_to_lv1", true, 0, 0, 0, 0, 0, 0);
    } else if (gPlaybackFileCycle === 2) {
      npc.startPlayback("train_lv_to_ls1", true, 0, 0, 0, 0, 0, 0);
    }

    gPlaybackFileCycle++;
  }

  const offPlaybackEnd = NpcEvent.onPlaybackEnd(({ npc, next }) => {
    if (npc.getName() === NPC_NAME) {
      nextPlayback(npc);
    }
    return next();
  });

  const offStateChange = PlayerEvent.onStateChange(
    ({ player, newState, next }) => {
      if (player.isNpc() && player.getName().name === NPC_NAME) {
        const npc = Npc.getInstance(player.id)!;
        if (newState === PlayerStateEnum.DRIVER) {
          nextPlayback(npc);
        } else {
          if (npc.isPlayingPlayback()) {
            npc.stopPlayback();
          }
          gPlaybackFileCycle = 0;
        }
      }
      return next();
    },
  );

  return [offPlaybackEnd, offStateChange];
}
