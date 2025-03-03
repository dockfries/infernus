import { defineEvent, PlayerEvent } from "@infernus/core";
import { WCPlayerDamage } from "../interfaces";

export const [onPlayerDamage, triggerOnPlayerDamage] = defineEvent({
  name: "OnPlayerDamage",
  isNative: false,
  beforeEach(params: WCPlayerDamage) {
    return params;
  },
});

export const [onPlayerDamageDone, wc_onPlayerDamageDone] = defineEvent({
  name: "OnPlayerDamageDone",
  isNative: false,
  beforeEach(params: WCPlayerDamage) {
    return params;
  },
});

onPlayerDamage(({ next, player, issuer }) => {
  console.log(player, issuer);
  return next();
});

const triggeredRet = triggerOnPlayerDamage({
  // player: ...
  // amount: ...
} as WCPlayerDamage);

if (triggeredRet) {
  //
  wc_onPlayerDamageDone({} as WCPlayerDamage);
}

// PlayerEvent.onGiveDamage(({next, player, amount}) => {
PlayerEvent.onGiveDamage(({ player, amount }) => {
  console.log(player, amount);
  // Don't send OnPlayerGiveDamage to the rest of the script, since it should not be used
  // So we will not use next() to trigger other subsequently defined events
  // It also means that users should not proactively define the event
  return false;
});
