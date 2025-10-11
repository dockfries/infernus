import { Npc, NpcEvent, PlayerEvent } from "@infernus/core";
import { npcNames } from "../constants";

export function initOnFootTest() {
  const NPC_NAME = npcNames[6];

  function nextPlayback(npc: Npc) {
    npc.startPlayback("truth1", true, 0, 0, 0, 0, 0, 0);
  }

  const offPlaybackEnd = NpcEvent.onPlaybackEnd(({ npc, next }) => {
    if (npc.getName() === NPC_NAME) {
      nextPlayback(npc);
    }
    return next();
  });

  const offStateChange = PlayerEvent.onStateChange(({ player, next }) => {
    if (player.isNpc() && player.getName().name === NPC_NAME) {
      nextPlayback(Npc.getInstance(player.id)!);
    }
    return next();
  });

  return [offPlaybackEnd, offStateChange];
}
