import { GameMode, InvalidEnum } from "@infernus/core";
import {
  ac_ClassAmmo,
  ac_ClassPos,
  ac_ClassWeapon,
  ac_ipTables,
  ACInfo,
  ACPickInfo,
  ACVehInfo,
} from "../struct";
import {
  innerGameModeConfig,
  innerACConfig,
  ac_LoadCfg,
  ac_LoadNOPCfg,
} from "../config";
import { ac_KickWithCode, triggerCheatWarning } from "./trigger";
import { ac_ACAllow, ac_sInfo, NEX_AC_VERSION } from "../constants";
import { $t } from "../lang";
import { ac_IpToInt } from "../utils/covert";

GameMode.onInit(({ next }) => {
  ACInfo.clear();
  ACVehInfo.clear();
  ACPickInfo.clear();
  ac_ClassPos.clear();
  ac_ClassWeapon.clear();
  ac_ClassAmmo.clear();
  ac_ipTables.clear();

  if (innerACConfig.AC_USE_CONFIG_FILES) {
    ac_LoadCfg().then((res) => {
      if (!res) {
        console.log($t("CFG_OPENING_ERROR", [innerACConfig.AC_CONFIG_FILE]));
      }
    });
    ac_LoadNOPCfg().then((res) => {
      if (!res) {
        console.log(
          $t("CFG_OPENING_ERROR", [innerACConfig.AC_NOP_CONFIG_FILE]),
        );
      }
    });
  }
  if (ac_ACAllow[42]) {
    if (!innerACConfig.AC_USE_QUERY) {
      innerGameModeConfig.ac_QueryEnable =
        GameMode.getConsoleVarAsBool("enable_query");
      GameMode.sendRconCommand("enable_query 0");
    }

    innerGameModeConfig.ac_RconEnable =
      GameMode.getConsoleVarAsBool("rcon.enable");
    GameMode.sendRconCommand("rcon.enable 0");
  }
  innerGameModeConfig.ac_LagCompMode = !!GameMode.getConsoleVarAsInt(
    "game.lag_compensation_mode",
  );
  if (innerACConfig.AC_USE_NPC) {
    const ac_strTmp = GameMode.getConsoleVarAsString("network.bind").consoleVar;
    innerGameModeConfig.ac_BindAddr = ac_IpToInt(ac_strTmp);
  }
  console.log(" ");
  console.log("--------------------------------------");
  console.log($t("LOADED_MSG_1"));
  console.log($t("LOADED_MSG_2", [NEX_AC_VERSION]));
  console.log($t("LOADED_MSG_3"));
  console.log("--------------------------------------\n");
  const ac_a = next();
  return ac_a;
});

GameMode.onExit(({ next }) => {
  if (innerACConfig.AC_USE_STATISTICS) {
    const ac_a = next();
    console.log(" ");
    console.log("--------------------------------------");
    console.log($t("STATS_STRING_1"));
    console.log($t("STATS_STRING_2"));
    console.log($t("STATS_STRING_3", [ac_sInfo[0]]));
    console.log($t("STATS_STRING_4", [ac_sInfo[1]]));
    console.log($t("STATS_STRING_5", [ac_sInfo[2]]));
    console.log($t("STATS_STRING_6", [ac_sInfo[3]]));
    console.log($t("STATS_STRING_7", [ac_sInfo[4]]));
    console.log($t("STATS_STRING_8", [ac_sInfo[5]]));
    console.log("--------------------------------------\n");
    return ac_a;
  }
  return next();
});

GameMode.onRconLoginAttempt(({ ip, password, success, next }) => {
  const ac_currentIp = ac_IpToInt(ip);
  if (success) {
    if (ac_ipTables.has(ac_currentIp)) {
      ac_ipTables.delete(ac_currentIp);
    }
  } else if (ac_ACAllow[42]) {
    const code2 = ac_ipTables.has(ac_currentIp) ? 1 : 2;

    const currentAttempts = ac_ipTables.get(ac_currentIp) || 0;
    ac_ipTables.set(ac_currentIp, currentAttempts + 1);
    const updatedAttempts = ac_ipTables.get(ac_currentIp)!;
    if (updatedAttempts > innerACConfig.AC_MAX_RCON_LOGIN_ATTEMPT) {
      if (innerACConfig.DEBUG) {
        console.log($t("DEBUG_CODE_4", [ip, password]));
      }
      ac_ipTables.delete(ac_currentIp);
      ac_KickWithCode(InvalidEnum.PLAYER_ID, ip, 1, 42, code2);
    } else {
      triggerCheatWarning(
        InvalidEnum.PLAYER_ID,
        ip,
        1,
        42,
        code2,
        updatedAttempts,
      );
    }
  }
  return next();
});
