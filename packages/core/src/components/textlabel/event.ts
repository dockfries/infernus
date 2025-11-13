import { playerTextLabelPool, textLabelPool } from "core/utils/pools";
import { GameMode } from "../gamemode";
import { TextLabel } from "./entity";
import { PlayerEvent } from "../player";

PlayerEvent.onDisconnect(({ player, next }) => {
  if (playerTextLabelPool.has(player)) {
    TextLabel.getInstances(player).forEach((t) => {
      if (t.isValid()) {
        t.destroy();
      }
    });
    playerTextLabelPool.delete(player);
  }
  return next();
});

GameMode.onExit(({ next }) => {
  TextLabel.getInstances().forEach((o) => o.destroy());
  TextLabel.getPlayersInstances()
    .map(([, o]) => o)
    .flat()
    .forEach((o) => o.destroy());
  textLabelPool.clear();
  playerTextLabelPool.clear();
  return next();
});
