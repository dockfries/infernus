import fs from "node:fs";
import fsPromise from "node:fs/promises";
import path from "node:path";
import { ac_ACAllow, ac_NOPAllow } from "../constants";
import { i18n } from "../lang";

export const innerGameModeConfig = {
  ac_IntEnterExits: true,
  ac_StuntBonus: true,
  ac_LagCompMode: false,
  ac_QueryEnable: false,
  ac_RconEnable: false,
  ac_PedAnims: false,
  ac_VehFriendlyFire: false,
  ac_BindAddr: 0,
};

export interface INexACConfig {
  LOCALE: string;
  DEBUG: boolean;
  NO_SUSPICION_LOGS: boolean;
  AC_CLIENT_VERSION: string;
  AC_USE_CONFIG_FILES: boolean;
  AUTOSAVE_SETTINGS_IN_CONFIG: boolean;
  AC_CONFIG_FILE: string;
  AC_NOP_CONFIG_FILE: string;
  AC_USE_AMMUNATIONS: boolean;
  AC_USE_PICKUP_WEAPONS: boolean;
  AC_USE_RESTAURANTS: boolean;
  AC_USE_VENDING_MACHINES: boolean;
  AC_USE_TUNING_GARAGES: boolean;
  AC_USE_PAYNSPRAY: boolean;
  AC_USE_CASINOS: boolean;
  AC_USE_NPC: boolean;
  AC_USE_QUERY: boolean;
  AC_USE_STATISTICS: boolean;
  AC_DEFAULT_COLOR: number;
  AC_MAX_CLASSES: number;
  AC_MAX_SKINS: number;
  AC_MAX_CONNECTS_FROM_IP: number;
  AC_MAX_RCON_LOGIN_ATTEMPT: number;
  AC_MAX_MSGS_REC_DIFF: number;
  AC_MAX_PING: number;
  AC_MIN_TIME_RECONNECT: number; // In seconds
  AC_SPEEDHACK_VEH_RESET_DELAY: number; // In seconds
  AC_MAX_NOP_WARNINGS: number;
  AC_MAX_NOP_TIMER_WARNINGS: number;
  AC_MAX_PING_WARNINGS: number;
  AC_MAX_MONEY_WARNINGS: number;
  AC_MAX_AIR_WARNINGS: number;
  AC_MAX_AIR_VEH_WARNINGS: number;
  AC_MAX_SPEEDHACK_WARNINGS: number;
  AC_MAX_SPEEDHACK_VEH_WARNINGS: number;
  AC_MAX_FLYHACK_WARNINGS: number;
  AC_MAX_FLYHACK_BIKE_WARNINGS: number;
  AC_MAX_FLYHACK_VEH_WARNINGS: number;
  AC_MAX_CARSHOT_WARNINGS: number;
  AC_MAX_GODMODE_WARNINGS: number;
  AC_MAX_GODMODE_VEH_WARNINGS: number;
  AC_MAX_FAKE_WEAPON_WARNINGS: number;
  AC_MAX_SILENT_AIM_WARNINGS: number;
  AC_MAX_PRO_AIM_WARNINGS: number;
  AC_MAX_AFK_GHOST_WARNINGS: number;
  AC_MAX_RAPID_FIRE_WARNINGS: number;
  AC_MAX_AUTO_C_WARNINGS: number;
  AC_MAX_TELEPORT_GLITCH_WARNINGS: number;
  AC_MAX_CJ_RUN_WARNINGS: number;
}

export const innerACConfig: INexACConfig = {
  LOCALE: "en_US",
  DEBUG: true,
  NO_SUSPICION_LOGS: false,
  AC_CLIENT_VERSION: "0.3",
  AC_USE_CONFIG_FILES: true,
  AUTOSAVE_SETTINGS_IN_CONFIG: false,
  AC_CONFIG_FILE: "nex-ac_settings.cfg",
  AC_NOP_CONFIG_FILE: "nex-ac_nop_settings.cfg",
  AC_USE_AMMUNATIONS: true,
  AC_USE_PICKUP_WEAPONS: true,
  AC_USE_RESTAURANTS: true,
  AC_USE_VENDING_MACHINES: true,
  AC_USE_TUNING_GARAGES: true,
  AC_USE_PAYNSPRAY: true,
  AC_USE_CASINOS: true,
  AC_USE_NPC: true,
  AC_USE_QUERY: true,
  AC_USE_STATISTICS: true,
  AC_DEFAULT_COLOR: -1,
  AC_MAX_CLASSES: 320,
  AC_MAX_SKINS: 312,
  AC_MAX_CONNECTS_FROM_IP: 1,
  AC_MAX_RCON_LOGIN_ATTEMPT: 1,
  AC_MAX_MSGS_REC_DIFF: 800,
  AC_MAX_PING: 500,
  AC_MIN_TIME_RECONNECT: 12, // In seconds
  AC_SPEEDHACK_VEH_RESET_DELAY: 3, // In seconds
  AC_MAX_NOP_WARNINGS: 8,
  AC_MAX_NOP_TIMER_WARNINGS: 3,
  AC_MAX_PING_WARNINGS: 8,
  AC_MAX_MONEY_WARNINGS: 2,
  AC_MAX_AIR_WARNINGS: 4,
  AC_MAX_AIR_VEH_WARNINGS: 4,
  AC_MAX_SPEEDHACK_WARNINGS: 6,
  AC_MAX_SPEEDHACK_VEH_WARNINGS: 1 * 3,
  AC_MAX_FLYHACK_WARNINGS: 2,
  AC_MAX_FLYHACK_BIKE_WARNINGS: 10,
  AC_MAX_FLYHACK_VEH_WARNINGS: 5,
  AC_MAX_CARSHOT_WARNINGS: 4,
  AC_MAX_GODMODE_WARNINGS: 3,
  AC_MAX_GODMODE_VEH_WARNINGS: 3,
  AC_MAX_FAKE_WEAPON_WARNINGS: 2,
  AC_MAX_SILENT_AIM_WARNINGS: 2,
  AC_MAX_PRO_AIM_WARNINGS: 2,
  AC_MAX_AFK_GHOST_WARNINGS: 2,
  AC_MAX_RAPID_FIRE_WARNINGS: 16,
  AC_MAX_AUTO_C_WARNINGS: 8,
  AC_MAX_TELEPORT_GLITCH_WARNINGS: 1,
  AC_MAX_CJ_RUN_WARNINGS: 8,
};

export function defineNexACConfig(cb: () => Partial<INexACConfig>) {
  const config = cb();
  Object.assign(innerACConfig, config);
  i18n.defaultLocale = innerACConfig.LOCALE;
}

const FULL_AC_CONFIG_FILE = () =>
  path.resolve(process.cwd(), "scriptfiles", innerACConfig.AC_CONFIG_FILE);
const FULL_AC_NOP_CONFIG_FILE = () =>
  path.resolve(process.cwd(), "scriptfiles", innerACConfig.AC_NOP_CONFIG_FILE);

const configLineReg = /([0|1]) \/\/([0-9]+)/;

export async function ac_LoadCfg() {
  try {
    if (fs.existsSync(FULL_AC_CONFIG_FILE())) {
      const ac_cfgFile = await fsPromise.readFile(
        FULL_AC_CONFIG_FILE(),
        "utf-8",
      );
      ac_cfgFile.split("\n").forEach((ac_string, ac_i) => {
        const matched = ac_string.match(configLineReg);
        if (matched && matched[1]) {
          const ac_j = matched[1];
          ac_ACAllow[ac_i] = !!Number(ac_j);
        }
      });
    } else {
      await ac_writeCfg();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

export async function ac_writeCfg() {
  try {
    const ac_string = ac_ACAllow
      .map((ac_val, ac_i) => {
        return `${+ac_val} //${ac_i}`;
      })
      .join("\n");
    await fsPromise.writeFile(FULL_AC_CONFIG_FILE(), ac_string, "utf-8");
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

export async function ac_LoadNOPCfg() {
  try {
    if (fs.existsSync(FULL_AC_NOP_CONFIG_FILE())) {
      const ac_cfgFile = await fsPromise.readFile(
        FULL_AC_NOP_CONFIG_FILE(),
        "utf-8",
      );
      ac_cfgFile.split("\n").forEach((ac_string, ac_i) => {
        const matched = ac_string.match(configLineReg);
        if (matched && matched[1]) {
          const ac_j = matched[1];
          ac_NOPAllow[ac_i] = !!Number(ac_j);
        }
      });
    } else {
      await ac_writeNOPCfg();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

export async function ac_writeNOPCfg() {
  try {
    const ac_string = ac_NOPAllow
      .map((ac_val, ac_i) => {
        return `${+ac_val} //${ac_i}`;
      })
      .join("\n");
    await fsPromise.writeFile(FULL_AC_NOP_CONFIG_FILE(), ac_string, "utf-8");
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
