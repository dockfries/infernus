import { Npc, NpcEvent, VehicleEvent } from "@infernus/core";
import { npcNames } from "../constants";

export function initMatTest2() {
  const NPC_NAME = npcNames[7];

  function nextPlayback(npc: Npc) {
    npc.startPlayback("carmod968", true, 0, 0, 0, 0, 0, 0);
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
    }
    return next();
  });

  return [offPlaybackEnd, offPlayerEnter, offPlayerExit];
}
