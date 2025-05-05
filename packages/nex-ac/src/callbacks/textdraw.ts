import { TextDrawEvent } from "@infernus/core";
import { ACInfo } from "../struct";
import { ac_Mtfc } from "../constants";
import { ac_FloodDetect } from "./trigger";

TextDrawEvent.onPlayerClickGlobal(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[4] < ac_Mtfc[4][0]) {
      ac_FloodDetect(player, 4);
      return true;
    }
    if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[4] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[4] = ac_gtc;
  return next();
});

TextDrawEvent.onPlayerClickPlayer(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[23] < ac_Mtfc[23][0]) {
      ac_FloodDetect(player, 23);
      return true;
    }
    if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[23] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[23] = ac_gtc;
  return next();
});
