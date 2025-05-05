import { DynamicAreaEvent } from "@infernus/core";
import { ACInfo } from "../struct";

DynamicAreaEvent.onPlayerEnter(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  return next();
});

DynamicAreaEvent.onPlayerLeave(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  return next();
});
