import { PlayerEvent } from "@infernus/core";
import { ACInfo } from "../../struct";
import { ac_FloodDetect } from "../../functions";
import { ac_Mtfc } from "../../constants";

PlayerEvent.onClickMap(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[2] < ac_Mtfc[2][0])
      ac_FloodDetect(player, 2);
    else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[2] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[2] = ac_gtc;
  return next();
});

PlayerEvent.onClickPlayer(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[3] < ac_Mtfc[3][0]) {
      ac_FloodDetect(player, 3);
      return true;
    }
    if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[3] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[3] = ac_gtc;
  return next();
});
