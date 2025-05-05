import { Player, PlayerEvent } from "@infernus/core";
import { ACInfo, ACVehInfo } from "../../struct";
import { ac_FloodDetect, ac_KickWithCode } from "../../functions";
import { innerACConfig } from "../../config";
import { ac_Mtfc } from "../../constants";

PlayerEvent.onEnterExitModShop(({ player, enterExit, interior, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;

  if (
    (!innerACConfig.AC_USE_TUNING_GARAGES &&
      ACInfo.get(player.id).acACAllow[23]) ||
    (innerACConfig.AC_USE_TUNING_GARAGES &&
      ACInfo.get(player.id).acACAllow[23] &&
      !(enterExit >= 0 && enterExit <= 1)) ||
    !(interior >= 0 && interior <= 3)
  ) {
    ac_KickWithCode(player, "", 0, 23, 1);
  }

  let ac_i = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_i - ACInfo.get(player.id).acCall[1] < ac_Mtfc[1][0])
      ac_FloodDetect(player, 1);
    else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[1] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acModShop = !!enterExit;
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[1] = ac_i;
  ACInfo.get(player.id).acSetPosTick = ACInfo.get(player.id).acGtc[19] =
    ac_i + 3850;
  const ac_vehId = ACInfo.get(player.id).acVeh;
  if (ACInfo.get(player.id).acKicked < 1) {
    ac_i = interior % 256;
    ACVehInfo.get(ac_vehId).acInt = ac_i;
    Player.getInstances().forEach((ac_j) => {
      if (ACInfo.get(ac_j.id).acVeh !== ac_vehId) return;
      ACInfo.get(ac_j.id).acInt = ac_i;
    });
  } else {
    Player.getInstances().forEach((ac_j) => {
      if (ACInfo.get(ac_j.id).acVeh !== ac_vehId) return;
      if (ACInfo.get(ac_j.id).acUnFrozen) ACInfo.get(ac_j.id).acIntRet = 2;
      else ACInfo.get(ac_j.id).acIntRet = 1;
    });
  }
  return next();
});

PlayerEvent.onInteriorChange(
  ({ player, newInteriorId, oldInteriorId, next }) => {
    if (ACInfo.get(player.id).acKicked > 0) return false;
    if (ACInfo.get(player.id).acIntRet > 0) {
      player.setInterior(ACInfo.get(player.id).acInt);
      if (ACInfo.get(player.id).acIntRet === 2) player.toggleControllable(true);
      ACInfo.get(player.id).acIntRet = 0;
    } else if (newInteriorId !== ACInfo.get(player.id).acSet[0]) {
      if (ACInfo.get(player.id).acSet[0] === -1) {
        if (ACInfo.get(player.id).acVeh > 0) {
          if (
            ACInfo.get(player.id).acACAllow[3] &&
            newInteriorId !== ACInfo.get(player.id).acInt
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] AC interior: ${ACInfo.get(player.id).acSet[0]}, acInt (last): ${ACInfo.get(player.id).acInt}, newInteriorId: ${newInteriorId}, oldInteriorId: ${oldInteriorId}, veh: ${ACInfo.get(player.id).acVeh}`,
              );
            }
            ac_KickWithCode(player, "", 0, 3, 1);
          }
        } else if (ACInfo.get(player.id).acIntEnterExits)
          ACInfo.get(player.id).acSetPosTick = Date.now() + 3850;
        else if (
          ACInfo.get(player.id).acACAllow[2] &&
          newInteriorId !== ACInfo.get(player.id).acInt
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] AC interior: ${ACInfo.get(player.id).acSet[0]}, acInt (last): ${ACInfo.get(player.id).acInt}, newInteriorId: ${newInteriorId}, oldInteriorId: ${oldInteriorId}`,
            );
          }
          ac_KickWithCode(player, "", 0, 2, 1);
        }
      }
    } else ACInfo.get(player.id).acSet[0] = -1;
    if (ACInfo.get(player.id).acKicked < 1)
      ACInfo.get(player.id).acInt = newInteriorId % 256;
    return next();
  },
);
