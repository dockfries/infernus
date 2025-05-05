import { defineEvent, GameMode, Player } from "@infernus/core";
import { antiCheatKickWithDesync } from "../functions/kick";
import { innerACConfig } from "../config";
import { $t } from "../lang";

let blockDefaultOnCheatDetected = false;

function ac_OnCheatDetected(
  player: Player,
  ipAddress: string,
  type: number,
  code: number,
) {
  if (type) {
    GameMode.blockIpAddress(ipAddress, 0);
  } else {
    switch (code) {
      case 40: {
        player.sendClientMessage(
          innerACConfig.AC_DEFAULT_COLOR,
          $t("MAX_CONNECTS_MSG", null, player.locale),
        );
        break;
      }
      case 41: {
        player.sendClientMessage(
          innerACConfig.AC_DEFAULT_COLOR,
          $t("UNKNOWN_CLIENT_MSG", null, player.locale),
        );
        break;
      }
      default: {
        player.sendClientMessage(
          innerACConfig.AC_DEFAULT_COLOR,
          $t("KICK_MSG", [(code + "").padStart(3, "0")], player.locale),
        );
      }
    }
    antiCheatKickWithDesync(player, code);
  }
  return 1;
}

const [innerOnCheatDetected, triggerCheatDetected] = defineEvent({
  name: "OnCheatDetected",
  isNative: false,
  beforeEach(player: Player, ipAddress: string, type: number, code: number) {
    return {
      player,
      ipAddress,
      type,
      code,
    };
  },
});

export { triggerCheatDetected };

const offDefault = innerOnCheatDetected(
  ({ player, ipAddress, type, code, next }) => {
    if (!blockDefaultOnCheatDetected) {
      return ac_OnCheatDetected(player, ipAddress, type, code);
    }
    return next();
  },
);

export function onCheatDetected(
  ...args: Parameters<typeof innerOnCheatDetected>
) {
  if (!blockDefaultOnCheatDetected) {
    blockDefaultOnCheatDetected = true;
    const ret = innerOnCheatDetected(...args);
    offDefault();
    return ret;
  }
  return innerOnCheatDetected(...args);
}

export const [onCheatWarning, triggerCheatWarning] = defineEvent({
  name: "OnCheatWarning",
  isNative: false,
  beforeEach(
    player: Player,
    ipAddress: string,
    type: number,
    code: number,
    code2: number,
    count: number,
  ) {
    return {
      player,
      ipAddress,
      type,
      code,
      code2,
      count,
    };
  },
});

export const [onFloodWarning, triggerFloodWarning] = defineEvent({
  name: "OnFloodWarning",
  isNative: false,
  beforeEach(player: Player, publicId: number, count: number) {
    return {
      player,
      publicId,
      count,
    };
  },
});

export const [onNOPWarning, triggerNOPWarning] = defineEvent({
  name: "OnNOPWarning",
  isNative: false,
  beforeEach(player: Player, nopId: number, count: number) {
    return {
      player,
      nopId,
      count,
    };
  },
});
