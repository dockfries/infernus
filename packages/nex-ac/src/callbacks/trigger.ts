import {
  defineEvent,
  GameMode,
  InvalidEnum,
  Player,
  PlayerStateEnum,
} from "@infernus/core";
import { innerACConfig } from "../config";
import { $t } from "../lang";
import { ac_sInfo, ac_Mtfc } from "../constants";
import { ACInfo } from "../struct";

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

export function ac_KickTimer(player: Player) {
  if (
    !(
      1 >= ACInfo.get(player.id).acKicked && ACInfo.get(player.id).acKicked <= 2
    )
  )
    return false;
  return player.kick();
}

function ac_AntiCheatKickWithDesync(player: Player, code: number) {
  if (ACInfo.get(player.id).acKicked > 0) return -1;
  const ac_gpp = player.getPing() + 150;
  ACInfo.get(player.id).acKickTimerID = setTimeout(
    () => {
      ac_KickTimer(player);
    },
    ac_gpp > innerACConfig.AC_MAX_PING ? innerACConfig.AC_MAX_PING : ac_gpp,
  );
  if (player.getState() === PlayerStateEnum.DRIVER) {
    if (code === 4) ACInfo.get(player.id).acKickVeh = player.getVehicle()!.id;
    ACInfo.get(player.id).acKicked = 2;
  } else ACInfo.get(player.id).acKicked = 1;
  return 1;
}

export function antiCheatKickWithDesync(player: Player, code: number) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatKickWithDesync(player, code);
}

export function ac_KickWithCode(
  player: Player | InvalidEnum.PLAYER_ID,
  ipAddress: string,
  type: number,
  code: number,
  code2 = 0,
) {
  if (
    type === 0 &&
    (player === InvalidEnum.PLAYER_ID ||
      !player.isConnected() ||
      ACInfo.get(player.id).acKicked > 0)
  )
    return false;
  if (innerACConfig.AC_USE_STATISTICS) {
    ac_sInfo[5]++;
    if ((code >= 0 && code <= 35) || [37, 39, 51].includes(code)) {
      ac_sInfo[0]++;
    } else if ([36, 38, 40, 41, 50].includes(code)) {
      ac_sInfo[4]++;
    } else if (code === 42) {
      ac_sInfo[1]++;
    } else if (code >= 47 && code <= 49) {
      ac_sInfo[3]++;
    } else if (code >= 43 && code <= 46) {
      ac_sInfo[2]++;
    }
  }
  if (innerACConfig.NO_SUSPICION_LOGS) {
    code2 = 0;
  } else {
    const ac_strTmp = code2 !== 0 ? ` (${code2})` : "";
    if (type)
      console.log(
        $t("SUSPICION_2", [ipAddress, (code + "").padStart(3, "0"), ac_strTmp]),
      );
    else
      console.log(
        $t("SUSPICION_1", [
          typeof player === "number" ? player : player.id,
          (code + "").padStart(3, "0"),
          ac_strTmp,
        ]),
      );
  }
  triggerCheatDetected(player, ipAddress, type, code);
  return false;
}

export function ac_FloodDetect(player: Player, publicId: number) {
  if (ACInfo.get(player.id).acKicked < 1) {
    if (++ACInfo.get(player.id).acFloodCount[publicId] > ac_Mtfc[publicId][1]) {
      if (innerACConfig.DEBUG) {
        console.log(
          $t("DEBUG_CODE_1", [player.id, ac_Mtfc[publicId][1], publicId]),
        );
      }

      ac_KickWithCode(player, "", 0, 49, publicId);
      ACInfo.get(player.id).acFloodCount[publicId] = ACInfo.get(
        player.id,
      )!.acFloodCount[27] = 0;
    } else
      triggerFloodWarning(
        player,
        publicId,
        ACInfo.get(player.id).acFloodCount[publicId],
      );

    return false;
  }
  return false;
}
