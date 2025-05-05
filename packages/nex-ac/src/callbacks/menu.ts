import { LimitsEnum, MenuEvent } from "@infernus/core";
import { ACInfo } from "../struct";
import { ac_FloodDetect } from "../functions";
import { ac_Mtfc } from "../constants";

MenuEvent.onPlayerSelectedRow(({ player, next }) => {
  if (
    !(player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) ||
    ACInfo.get(player.id).acKicked > 0
  )
    return false;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[10] < ac_Mtfc[10][0])
      ac_FloodDetect(player, 10);
    else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[10] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[10] = ac_gtc;
  return next();
});

MenuEvent.onPlayerExited(({ player, next }) => {
  if (
    !(player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) ||
    ACInfo.get(player.id).acKicked > 0
  )
    return false;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[20] < ac_Mtfc[20][0])
      ac_FloodDetect(player, 20);
    else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[20] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[20] = ac_gtc;
  return next();
});
