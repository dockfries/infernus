import { Npc, NpcEvent, PlayerEvent, PlayerStateEnum } from "@infernus/core";
import { npcNames } from "../constants";

export function initDriverTest2() {
  const NPC_NAME = npcNames[8];

  function nextPlayback(npc: Npc) {
    npc.startPlayback("driver_test2", true, 0, 0, 0, 0, 0, 0);
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
        }
      }
      return next();
    },
  );

  return [offPlaybackEnd, offStateChange];
}
