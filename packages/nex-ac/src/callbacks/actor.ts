import { DynamicActorEvent } from "@infernus/core";
import { ACInfo } from "../struct";
import { ac_IsValidDamageReason } from "../functions";
import { innerACConfig } from "../config";
import { ac_KickWithCode } from "./trigger";

DynamicActorEvent.onPlayerGiveDamage(
  ({ player, actor, bodyPart, amount, weapon, next }) => {
    if (ACInfo.get(player.id).acKicked > 0) return false;
    if (
      ACInfo.get(player.id).acACAllow[47] &&
      (amount < 0.0 ||
        !(bodyPart >= 3 && bodyPart <= 9) ||
        !ac_IsValidDamageReason(weapon))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Dyn actorId: ${actor.id}, amount: ${amount}, weaponId: ${weapon}, bodyPart: ${bodyPart}`,
        );
      }
      return ac_KickWithCode(player, "", 0, 47, 8);
    }
    return next();
  },
);
