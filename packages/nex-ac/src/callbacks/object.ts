import {
  DynamicObjectEvent,
  E_STREAMER,
  ObjectMpEvent,
  Streamer,
  StreamerItemTypes,
} from "@infernus/core";
import { ACInfo } from "../struct";
import { ac_IsBrokenObjectModel } from "../functions";
import { innerACConfig } from "../config";
import { ac_Mtfc } from "../constants";
import { ac_FloodDetect, ac_KickWithCode } from "./trigger";

DynamicObjectEvent.onPlayerSelect(({ player, object, modelId, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  let ac_i = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_i - ACInfo.get(player.id).acCall[26] < ac_Mtfc[26][0])
      ac_FloodDetect(player, 26);
    else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[26] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[26] = ac_i;

  if (
    ACInfo.get(player.id).acACAllow[46] &&
    (ac_i = Streamer.getIntData(
      StreamerItemTypes.OBJECT,
      object.id,
      E_STREAMER.MODEL_ID,
    )) !== modelId
  ) {
    if (innerACConfig.DEBUG) {
      console.log(
        `[Nex-AC DEBUG] Dyn object model: ${ac_i}, modelId: ${modelId}`,
      );
    }
    return ac_KickWithCode(player, "", 0, 46, 3);
  }
  return next();
});

ObjectMpEvent.onPlayerEditAttached(
  ({ player, modelId, index, boneId, next }) => {
    if (ACInfo.get(player.id).acKicked > 0) return true;
    if (
      ACInfo.get(player.id).acACAllow[46] &&
      (ac_IsBrokenObjectModel(modelId) ||
        !(index >= 0 && index <= 9) ||
        !(boneId >= 1 && boneId <= 18))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Object modelId: ${modelId}, index: ${index}, boneId ${boneId}`,
        );
      }
      ac_KickWithCode(player, "", 0, 46, 1);
      return true;
    }
    return next();
  },
);
