import { playerTextLabelPool, textLabelPool } from "core/utils/pools";
import { GameMode } from "../gamemode";
import { TextLabel } from "./entity";

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
