import { PlayerEvent } from "core/controllers";
import { INTERNAL_MAP } from "../constants";

PlayerEvent.onConnect(({ player, next }) => {
  INTERNAL_MAP.rmvs.flat(2).forEach((rmv) => {
    player.removeBuilding(...rmv);
  });
  return next();
});
