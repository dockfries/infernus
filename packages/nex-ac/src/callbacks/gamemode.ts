import { LogLevelEnum, GameMode, InvalidEnum, LimitsEnum } from "@infernus/core";
import {
  ac_ClassAmmo,
  ac_ClassPos,
  ac_ClassWeapon,
  ACInfo,
  ACPickInfo,
  ACVehInfo,
} from "../struct";
import { innerGameModeConfig, innerACConfig, ac_LoadCfg, ac_LoadNOPCfg } from "../config";
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

  if (innerACConfig.AC_USE_CONFIG_FILES) {
    ac_LoadCfg().then((res) => {
      if (!res) {
        samp.logprint($t("CFG_OPENING_ERROR", [innerACConfig.AC_CONFIG_FILE]), LogLevelEnum.ERROR);
      }
    });
    ac_LoadNOPCfg().then((res) => {
      if (!res) {
        samp.logprint(
          $t("CFG_OPENING_ERROR", [innerACConfig.AC_NOP_CONFIG_FILE]),
          LogLevelEnum.ERROR,
        );
      }
    });
  }
  if (ac_ACAllow[42]) {
    if (!innerACConfig.AC_USE_QUERY) {
      innerGameModeConfig.ac_QueryEnable = GameMode.getConsoleVarAsBool("enable_query");
      GameMode.sendRconCommand("enable_query 0");
    }

    innerGameModeConfig.ac_RconEnable = GameMode.getConsoleVarAsBool("rcon.enable");
    GameMode.sendRconCommand("rcon.enable 0");
  }
  innerGameModeConfig.ac_LagCompMode = !!GameMode.getConsoleVarAsInt("game.lag_compensation_mode");
  if (innerACConfig.AC_USE_NPC) {
    const ac_strTmp = GameMode.getConsoleVarAsString("network.bind").consoleVar;
    innerGameModeConfig.ac_BindAddr = ac_IpToInt(ac_strTmp);
  }
  samp.logprint(" ", LogLevelEnum.INFO);
  samp.logprint("--------------------------------------", LogLevelEnum.INFO);
  samp.logprint($t("LOADED_MSG_1"), LogLevelEnum.INFO);
  samp.logprint($t("LOADED_MSG_2", [NEX_AC_VERSION]), LogLevelEnum.INFO);
  samp.logprint($t("LOADED_MSG_3"), LogLevelEnum.INFO);
  samp.logprint("--------------------------------------\n", LogLevelEnum.INFO);
  const ac_a = next();
  return ac_a;
});

GameMode.onExit(({ next }) => {
  if (innerACConfig.AC_USE_STATISTICS) {
    const ac_a = next();
    samp.logprint(" ", LogLevelEnum.INFO);
    samp.logprint("--------------------------------------", LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_1"), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_2"), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_3", [ac_sInfo[0]]), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_4", [ac_sInfo[1]]), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_5", [ac_sInfo[2]]), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_6", [ac_sInfo[3]]), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_7", [ac_sInfo[4]]), LogLevelEnum.INFO);
    samp.logprint($t("STATS_STRING_8", [ac_sInfo[5]]), LogLevelEnum.INFO);
    samp.logprint("--------------------------------------\n", LogLevelEnum.INFO);
    return ac_a;
  }
  return next();
});

const ac_ipTables: [number, number][] = Array.from({ length: LimitsEnum.MAX_PLAYERS }, () => [
  0, 0,
]);
let ac_ipIndex = 0;

GameMode.onRconLoginAttempt(({ ip, password, success, next }) => {
  const ac_currentIp = ac_IpToInt(ip);
  let ac_i = 0;

  for (; ac_i < ac_ipTables.length; ++ac_i) {
    if (ac_ipTables[ac_i][0] !== ac_currentIp) continue;

    if (success) {
      ac_ipTables[ac_i][1] = 0;
    } else if (ac_ACAllow[42]) {
      ++ac_ipTables[ac_i][1];
      if (ac_ipTables[ac_i][1] > innerACConfig.AC_MAX_RCON_LOGIN_ATTEMPT) {
        if (innerACConfig.DEBUG) {
          samp.logprint($t("DEBUG_CODE_4", [ip, password]), LogLevelEnum.DEBUG);
        }
        ac_ipTables[ac_i][1] = 0;
        ac_KickWithCode(InvalidEnum.PLAYER_ID, ip, 1, 42, 1);
      } else {
        triggerCheatWarning(InvalidEnum.PLAYER_ID, ip, 1, 42, 1, ac_ipTables[ac_i][1]);
      }
    }

    ac_i = -1;
    break;
  }

  if (ac_i !== -1 && !success) {
    ac_ipTables[ac_ipIndex][0] = ac_currentIp;

    if (ac_ACAllow[42]) {
      ++ac_ipTables[ac_ipIndex][1];
      if (ac_ipTables[ac_ipIndex][1] > innerACConfig.AC_MAX_RCON_LOGIN_ATTEMPT) {
        if (innerACConfig.DEBUG) {
          samp.logprint(
            $t("DEBUG_CODE_4", [ip, password, ac_ipTables[ac_ipIndex][1]]),
            LogLevelEnum.DEBUG,
          );
        }
        ac_ipTables[ac_ipIndex][1] = 0;
        ac_KickWithCode(InvalidEnum.PLAYER_ID, ip, 1, 42, 2);
      } else {
        triggerCheatWarning(InvalidEnum.PLAYER_ID, ip, 1, 42, 2, ac_ipTables[ac_ipIndex][1]);
      }
    }

    ++ac_ipIndex;
    if (ac_ipIndex >= ac_ipTables.length) ac_ipIndex = 0;
    ac_ipTables[ac_ipIndex][1] = 0;
  }

  return next();
});

export {};
