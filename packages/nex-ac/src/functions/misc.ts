import { InvalidEnum, Player, Vehicle } from "@infernus/core";
import { ac_Mtfc, ac_sInfo } from "../constants";
import { ACInfo } from "../struct";
import {
  triggerCheatDetected,
  triggerFloodWarning,
} from "../callbacks/trigger";
import { innerACConfig } from "../config";
import {
  ac_EnableAntiNOPForPlayer,
  ac_IsAntiCheatEnabled,
  ac_IsAntiNOPEnabled,
  ac_IsAntiCheatEnabledForPlayer,
  ac_IsAntiNOPEnabledForPlayer,
  ac_AntiCheatGetSpeed,
  ac_AntiCheatGetAnimationIndex,
  ac_AntiCheatGetDialog,
  ac_AntiCheatGetInterior,
  ac_AntiCheatGetEnterVehicle,
  ac_AntiCheatGetEnterVehicleSeat,
  ac_AntiCheatGetVehicleID,
  ac_AntiCheatGetVehicleSeat,
  ac_AntiCheatGetWeapon,
  ac_AntiCheatGetWeaponInSlot,
  ac_AntiCheatGetAmmoInSlot,
  ac_AntiCheatGetSpecAction,
  ac_AntiCheatGetLastSpecAction,
  ac_AntiCheatGetLastShotWeapon,
  ac_AntiCheatGetLastPickup,
  ac_AntiCheatGetLastUpdateTime,
  ac_AntiCheatGetLastReloadTime,
  ac_AntiCheatGetLastEnterVehTime,
  ac_AntiCheatGetLastShotTime,
  ac_AntiCheatGetLastSpawnTime,
  ac_AntiCheatIntEntExitIsEnabled,
  ac_AntiCheatStuntBonusIsEnabled,
  ac_AntiCheatIsInModShop,
  ac_AntiCheatIsInSpectate,
  ac_AntiCheatIsFrozen,
  ac_AntiCheatIsDead,
  ac_AntiCheatIsConnected,
  ac_AntiCheatIsKickedWithDesync,
  ac_AntiCheatGetVehicleDriver,
  ac_EnableAntiCheat,
  ac_EnableAntiNOP,
  ac_EnableAntiCheatForPlayer,
  ac_AntiCheatGetVehicleInterior,
  ac_AntiCheatGetVehiclePaintjob,
  ac_AntiCheatGetVehicleSpeed,
  ac_AntiCheatIsVehicleSpawned,
} from "../hooks";
import { $t } from "../lang";

export function enableAntiCheat(code: number, enable: boolean) {
  return ac_EnableAntiCheat(code, enable);
}

export function enableAntiNOP(nopCode: number, enable: boolean) {
  return ac_EnableAntiNOP(nopCode, enable);
}

export function enableAntiCheatForPlayer(
  player: Player,
  code: number,
  enable: boolean,
) {
  if (!player.isConnected()) return 0;
  return ac_EnableAntiCheatForPlayer(player, code, enable);
}

export function enableAntiNOPForPlayer(
  player: Player,
  nopCode: number,
  enable: boolean,
) {
  if (!player.isConnected()) return 0;
  return ac_EnableAntiNOPForPlayer(player, nopCode, enable);
}

export function isAntiCheatEnabled(code: number) {
  return ac_IsAntiCheatEnabled(code);
}

export function isAntiNOPEnabled(nopCode: number) {
  return ac_IsAntiNOPEnabled(nopCode);
}

export function isAntiCheatEnabledForPlayer(player: Player, code: number) {
  if (!player.isConnected()) return false;
  return ac_IsAntiCheatEnabledForPlayer(player, code);
}

export function isAntiNOPEnabledForPlayer(player: Player, nopCode: number) {
  if (!player.isConnected()) return false;
  return ac_IsAntiNOPEnabledForPlayer(player, nopCode);
}

export function antiCheatGetSpeed(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetSpeed(player);
}

export function antiCheatGetAnimationIndex(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetAnimationIndex(player);
}

export function antiCheatGetDialog(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetDialog(player);
}

export function antiCheatGetInterior(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetInterior(player);
}

export function antiCheatGetEnterVehicle(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetEnterVehicle(player);
}

export function antiCheatGetEnterVehicleSeat(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetEnterVehicleSeat(player);
}

export function antiCheatGetVehicleID(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetVehicleID(player);
}

export function antiCheatGetVehicleSeat(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetVehicleSeat(player);
}

export function antiCheatGetWeapon(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetWeapon(player);
}

export function antiCheatGetWeaponInSlot(player: Player, slot: number) {
  if (!player.isConnected()) return -1;
  if (!(slot >= 0 && slot <= 12)) return -2;
  return ac_AntiCheatGetWeaponInSlot(player, slot);
}

export function antiCheatGetAmmoInSlot(player: Player, slot: number) {
  if (!player.isConnected()) return -1;
  if (!(slot >= 0 && slot <= 12)) return -2;
  return ac_AntiCheatGetAmmoInSlot(player, slot);
}

export function antiCheatGetSpecialAction(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetSpecAction(player);
}

export function antiCheatGetLastSpecialAction(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastSpecAction(player);
}

export function antiCheatGetLastShotWeapon(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetLastShotWeapon(player);
}

export function antiCheatGetLastPickup(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetLastPickup(player);
}

export function antiCheatGetLastUpdateTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastUpdateTime(player);
}

export function antiCheatGetLastReloadTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastReloadTime(player);
}

export function antiCheatGetLastEnteredVehTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastEnterVehTime(player);
}

export function antiCheatGetLastShotTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastShotTime(player);
}

export function antiCheatGetLastSpawnTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastSpawnTime(player);
}

export function antiCheatIntEnterExitsIsEnabled(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIntEntExitIsEnabled(player);
}

export function antiCheatStuntBonusIsEnabled(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatStuntBonusIsEnabled(player);
}

export function antiCheatIsInModShop(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsInModShop(player);
}

export function antiCheatIsInSpectate(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsInSpectate(player);
}

export function antiCheatIsFrozen(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsFrozen(player);
}

export function antiCheatIsDead(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsDead(player);
}

export function antiCheatIsConnected(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsConnected(player);
}

export function antiCheatIsKickedWithDesync(player: Player) {
  if (!player.isConnected()) return 3;
  return ac_AntiCheatIsKickedWithDesync(player);
}

export function antiCheatGetVehicleDriver(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return InvalidEnum.PLAYER_ID;
  return ac_AntiCheatGetVehicleDriver(vehicleId);
}

export function antiCheatGetVehicleInterior(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return 0;
  return ac_AntiCheatGetVehicleInterior(vehicleId);
}

export function antiCheatGetVehiclePaintjob(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return 3;
  return ac_AntiCheatGetVehiclePaintjob(vehicleId);
}

export function antiCheatGetVehicleSpeed(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return false;
  return ac_AntiCheatGetVehicleSpeed(vehicleId);
}

export function antiCheatIsVehicleSpawned(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return false;
  return ac_AntiCheatIsVehicleSpawned(vehicleId);
}

export function ac_IpToInt(ip: string): number {
  const [b3, b2, b1, b0] = ip.split(".").map(Number);
  return (b3 << 24) | (b2 << 16) | (b1 << 8) | b0;
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
