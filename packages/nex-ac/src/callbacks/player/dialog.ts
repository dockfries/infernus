import { PlayerEvent } from "@infernus/core";
import { ACInfo } from "../../struct";
import { ac_FloodDetect, ac_KickWithCode } from "../../functions";
import { innerACConfig } from "../../config";
import { ac_Mtfc } from "../../constants";

PlayerEvent.onDialogResponse(
  ({ player, dialogId, listItem, inputText, next }) => {
    if (ACInfo.get(player.id).acKicked > 0) return true;
    const ac_i = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_i - ACInfo.get(player.id).acCall[0] < ac_Mtfc[0][0])
        ac_FloodDetect(player, 0);
      else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[0] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    if (
      ACInfo.get(player.id).acACAllow[39] &&
      (dialogId !== ACInfo.get(player.id).acDialog || listItem < -1)
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] AC dialog: ${ACInfo.get(player.id).acDialog}, dialogId: ${dialogId}, listItem: ${listItem}`,
        );
      }
      ac_KickWithCode(player, "", 0, 39);
      return true;
    }
    ACInfo.get(player.id).acDialog = -1;
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[0] = ac_i;
    if (ACInfo.get(player.id).acACAllow[45]) {
      inputText = inputText.replaceAll("%", "").replaceAll("~k~", "");
      return next({ inputText });
    }
    return next();
  },
);
