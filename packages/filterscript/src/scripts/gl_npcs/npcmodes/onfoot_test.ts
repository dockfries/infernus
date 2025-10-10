import { Npc, NpcEvent } from "@infernus/core";
import { npcNames } from "../constants";

export function initOnFootTest() {
  const NPC_NAME = npcNames[6];

  function nextPlayback(npc: Npc) {
    npc.startPlayback("recordings/truth1.rec", true, 0, 0, 0, 0, 0, 0);
  }

  const offPlaybackEnd = NpcEvent.onPlaybackEnd(({ npc, next }) => {
    if (npc.getName() === NPC_NAME) {
      nextPlayback(npc);
    }
    return next();
  });

  const offSpawn = NpcEvent.onSpawn(({ npc, next }) => {
    if (npc.getName() === NPC_NAME) {
      nextPlayback(npc);
    }
    return next();
  });

  return [offPlaybackEnd, offSpawn];
}
