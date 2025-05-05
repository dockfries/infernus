import {
  GameMode,
  InvalidEnum,
  IPlayerClass,
  KeysEnum,
  Player,
  PlayerEvent,
  SpecialActionsEnum,
  Vehicle,
  WeaponEnum,
} from "@infernus/core";
import { ACInfo, ACVehInfo } from "../../struct";
import {
  ac_IsAnAircraft,
  ac_IsAnAircraftRC,
  ac_IsValidVehicleModel,
  ac_IsValidWeapon,
} from "../../functions";
import { innerGameModeConfig, innerACConfig } from "../../config";
import { ac_ACAllow, ac_Mtfc, ac_NOPAllow, ac_wSlot } from "../../constants";
import { ac_Timer } from "../../functions/timer";
import { $t } from "../../lang";
import { ac_IpToInt } from "../../utils/covert";
import { ac_KickWithCode, ac_FloodDetect } from "../trigger";

PlayerEvent.onConnect(({ player, next }) => {
  ACInfo.get(player.id).acVeh =
    ACInfo.get(player.id).acKickVeh =
    ACInfo.get(player.id).acKicked =
      0;
  ACInfo.get(player.id).acIp = player.getIp();
  ACInfo.get(player.id).acIpInt = ac_IpToInt(ACInfo.get(player.id).acIp);
  if (innerACConfig.AC_USE_NPC) {
    if (ac_ACAllow[36] && player.isNpc()) {
      const ac_rslt =
        ACInfo.get(player.id).acIpInt === innerGameModeConfig.ac_BindAddr;

      if (ACInfo.get(player.id).acIp !== "127.0.0.1" && !ac_rslt) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] NPC's IP: '${ACInfo.get(player.id).acIp}'`,
          );
        }
        ac_KickWithCode(player, "", 0, 36);
      }
    }
  } else {
    if (ac_ACAllow[36] && player.isNpc()) ac_KickWithCode(player, "", 0, 36);
  }

  if (ac_ACAllow[48] && ACInfo.get(player.id).acOnline) {
    ac_KickWithCode(player, "", 0, 48, 1);
  }

  if (ac_ACAllow[41] && !player.isNpc()) {
    const ac_ver = player.getVersion();
    if (!ac_ver.includes(innerACConfig.AC_CLIENT_VERSION)) {
      if (innerACConfig.DEBUG) {
        console.log($t("DEBUG_CODE_2", [player.id, ac_ver]));
      }
      ac_KickWithCode(player, "", 0, 41);
    }
  }

  let ac_i = innerACConfig.AC_MAX_CONNECTS_FROM_IP;

  if (ac_ACAllow[40]) {
    for (const ac_j of Player.getInstances()) {
      if (ac_j === player) continue;
      if (!ac_j.isConnected() || (innerACConfig.AC_USE_NPC && ac_j.isNpc()))
        continue;
      if (ACInfo.get(player.id).acIpInt === ACInfo.get(ac_j.id).acIpInt) {
        ac_i--;
        if (ac_i < 1) {
          if (innerACConfig.DEBUG) {
            console.log(
              $t("DEBUG_CODE_3", [
                player.id,
                innerACConfig.AC_MAX_CONNECTS_FROM_IP,
              ]),
            );
          }
          ac_KickWithCode(player, "", 0, 40);
          break;
        }
      }
    }
  }

  ACInfo.get(player.id).acSpec =
    ACInfo.get(player.id).acForceClass =
    ACInfo.get(player.id).acDeathRes =
      false;
  ACInfo.get(player.id).acClassRes = ACInfo.get(player.id).acDead = true;
  ACInfo.get(player.id).acIntEnterExits = innerGameModeConfig.ac_IntEnterExits;
  ACInfo.get(player.id).acStuntBonus = innerGameModeConfig.ac_StuntBonus;
  ACInfo.get(player.id).acCheatCount[0] =
    ACInfo.get(player.id).acHoldWeapon =
    ACInfo.get(player.id).acLastWeapon =
    ACInfo.get(player.id).acSpawnRes =
    ACInfo.get(player.id).acCamMode =
    ACInfo.get(player.id).acMoney =
    ACInfo.get(player.id).acAnim =
    ACInfo.get(player.id).acInt =
      0;
  ACInfo.get(player.id).acSet[11] =
    ACInfo.get(player.id).acSet[10] =
    ACInfo.get(player.id).acSet[6] =
    ACInfo.get(player.id).acSet[5] =
    ACInfo.get(player.id).acSet[0] =
    ACInfo.get(player.id).acNextDialog =
    ACInfo.get(player.id).acDialog =
      -1;
  ACInfo.get(player.id).acDropJpX = ACInfo.get(player.id).acDropJpY = 25000.0;
  for (ac_i = 12; ac_i >= 0; --ac_i) {
    ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
    ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
  }
  for (ac_i = ac_Mtfc.length - 1; ac_i >= 0; --ac_i)
    ACInfo.get(player.id).acFloodCount[ac_i] = 0;
  ACInfo.get(player.id).acNOPAllow = [...ac_NOPAllow];
  ACInfo.get(player.id).acACAllow = [...ac_ACAllow];
  if (ACInfo.get(player.id).acKicked < 1) {
    ACInfo.get(player.id).acTimerTick = Date.now();
    ACInfo.get(player.id).acTimerID = setInterval(() => {
      ac_Timer(player);
    }, 1000);
  }
  ACInfo.get(player.id).acOnline = true;
  return next();
});

PlayerEvent.onDisconnect(({ player, reason, next }) => {
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    if (ACInfo.get(player.id).acTimerID) {
      clearInterval(ACInfo.get(player.id).acTimerID!);
      ACInfo.get(player.id).acTimerID = null;
    }
    if (
      ACInfo.get(player.id).acACAllow[37] &&
      innerACConfig.AC_MAX_CONNECTS_FROM_IP < 2
    ) {
      if (reason === 0) {
        const ac_tmp = GameMode.getConsoleVarAsInt("network.player_timeout");
        GameMode.blockIpAddress(
          ACInfo.get(player.id).acIp,
          innerACConfig.AC_MIN_TIME_RECONNECT * 1000 - ac_tmp,
        );
      } else {
        GameMode.blockIpAddress(
          ACInfo.get(player.id).acIp,
          innerACConfig.AC_MIN_TIME_RECONNECT * 1000,
        );
      }
    }
  }
  if (ACInfo.get(player.id).acKickTimerID) {
    clearTimeout(ACInfo.get(player.id).acKickTimerID!);
    ACInfo.get(player.id).acKickTimerID = null;
  }
  let ac_vehId = ACInfo.get(player.id).acKickVeh;
  if (ac_vehId > 0) {
    if (ACVehInfo.get(ac_vehId).acDriver === player.id)
      ACVehInfo.get(ac_vehId).acDriver = InvalidEnum.PLAYER_ID;
    if (ACInfo.get(player.id).acKicked === 2) {
      const ac_veh = Vehicle.getInstance(ac_vehId)!;
      ac_veh.linkToInterior(ACVehInfo.get(ac_vehId).acInt);
      ac_veh.setZAngle(ACVehInfo.get(ac_vehId).acZAngle);
      ac_veh.setPos(
        ACVehInfo.get(ac_vehId).acPosX,
        ACVehInfo.get(ac_vehId).acPosY,
        ACVehInfo.get(ac_vehId).acPosZ,
      );
      ac_veh.setHealth(ACVehInfo.get(ac_vehId).acHealth);
      ac_veh.changePaintjob(ACVehInfo.get(ac_vehId).acPaintJob as any);
    }
  }
  if ((ac_vehId = ACInfo.get(player.id).acVeh) > 0) {
    if (ACVehInfo.get(ac_vehId).acDriver === player.id)
      ACVehInfo.get(ac_vehId).acDriver = InvalidEnum.PLAYER_ID;
    if (ACInfo.get(player.id).acKicked === 2) {
      const ac_veh = Vehicle.getInstance(ac_vehId)!;
      ac_veh.linkToInterior(ACVehInfo.get(ac_vehId).acInt);
      ac_veh.setZAngle(ACVehInfo.get(ac_vehId).acZAngle);
      ac_veh.setPos(
        ACVehInfo.get(ac_vehId).acPosX,
        ACVehInfo.get(ac_vehId).acPosY,
        ACVehInfo.get(ac_vehId).acPosZ,
      );
      ac_veh.setHealth(ACVehInfo.get(ac_vehId).acHealth);
      ac_veh.changePaintjob(ACVehInfo.get(ac_vehId).acPaintJob as any);
    }
  }
  ACInfo.get(player.id).acOnline = false;
  if (ACInfo.get(player.id).acKicked < 1) ACInfo.get(player.id).acKicked = 3;
  return next();
});

PlayerEvent.onSpawn(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  let ac_i = 0,
    ac_ur = false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (
      ACInfo.get(player.id).acSpec &&
      (ACInfo.get(player.id).acSet[6] <= 1 ||
        ACInfo.get(player.id).acSet[6] === 4)
    ) {
      ACInfo.get(player.id).acSet[3] =
        ACInfo.get(player.id).acSet[7] =
        ACInfo.get(player.id).acSet[8] =
          -1;
      ACInfo.get(player.id).acSpec = false;
    } else {
      if (
        ACInfo.get(player.id).acACAllow[27] &&
        (ACInfo.get(player.id).acSpawnRes < 1 ||
          ac_gtc - ACInfo.get(player.id).acSpawnTick < 1000)
      ) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] Spawn res: ${ACInfo.get(player.id).acSpawnRes}, respawn time: ${ac_gtc - ACInfo.get(player.id).acSpawnTick}`,
          );
        }
        ac_KickWithCode(player, "", 0, 27);

        ACInfo.get(player.id).acSpawnRes = 1;
      }
      if (ACInfo.get(player.id).acSpawnRes > 0)
        ACInfo.get(player.id).acSpawnRes--;
      if (
        ACInfo.get(player.id).acSet[6] !== 2 &&
        ACInfo.get(player.id).acSet[6] !== 5
      )
        ACInfo.get(player.id).acSpec = false;
      if (
        !(
          ACInfo.get(player.id).acSet[6] >= 1 &&
          ACInfo.get(player.id).acSet[6] <= 2
        )
      ) {
        for (ac_i = 11; ac_i >= 0; --ac_i)
          ACInfo.get(player.id).acSet[ac_i] = -1;
        ac_ur = true;
      }
    }
    if (
      !(
        ACInfo.get(player.id).acSet[6] >= 1 &&
        ACInfo.get(player.id).acSet[6] <= 2
      )
    ) {
      for (ac_i = 12; ac_i >= 0; --ac_i) {
        ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
        ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
      }
      ACInfo.get(player.id).acNextSpecAct = -1;
      ACInfo.get(player.id).acUnFrozen = true;
    }
    for (ac_i = 12; ac_i >= 0; --ac_i) {
      ACInfo.get(player.id).acWeapon[ac_i] = ACInfo.get(player.id).acAmmo[
        ac_i
      ] = 0;
    }
    ACInfo.get(player.id).acModShop =
      ACInfo.get(player.id).acForceClass =
      ACInfo.get(player.id).acClassRes =
      ACInfo.get(player.id).acDeathRes =
      ACInfo.get(player.id).acDmgRes =
      ACInfo.get(player.id).acDead =
        false;
    ACInfo.get(player.id).acLastPickup =
      ACInfo.get(player.id).acSet[6] =
      ACInfo.get(player.id).acSeat =
        -1;
    ACInfo.get(player.id).acCheatCount[5] =
      ACInfo.get(player.id).acCheatCount[6] =
      ACInfo.get(player.id).acCheatCount[7] =
      ACInfo.get(player.id).acCheatCount[8] =
      ACInfo.get(player.id).acCheatCount[9] =
      ACInfo.get(player.id).acCheatCount[11] =
      ACInfo.get(player.id).acCheatCount[14] =
      ACInfo.get(player.id).acCheatCount[16] =
      ACInfo.get(player.id).acCheatCount[18] =
      ACInfo.get(player.id).acLastSpecAct =
      ACInfo.get(player.id).acHoldWeapon =
      ACInfo.get(player.id).acLastWeapon =
      ACInfo.get(player.id).acParachute =
      ACInfo.get(player.id).acShotWeapon =
      ACInfo.get(player.id).acLastModel =
      ACInfo.get(player.id).acKickVeh =
      ACInfo.get(player.id).acSpecAct =
      ACInfo.get(player.id).acIntRet =
      ACInfo.get(player.id).acSpeed =
      ACInfo.get(player.id).acVeh =
        0;
    ACInfo.get(player.id).acSetPosTick = ac_gtc + 2650;
    if (ac_IsValidWeapon(ACInfo.get(player.id).acSpawnWeapon1)) {
      ac_i = ac_wSlot[ACInfo.get(player.id).acSpawnWeapon1];
      ACInfo.get(player.id).acWeapon[ac_i] = ACInfo.get(
        player.id,
      ).acSpawnWeapon1;
      ACInfo.get(player.id).acAmmo[ac_i] = ACInfo.get(player.id).acSpawnAmmo1;
    }
    if (ac_IsValidWeapon(ACInfo.get(player.id).acSpawnWeapon2)) {
      ac_i = ac_wSlot[ACInfo.get(player.id).acSpawnWeapon2];
      ACInfo.get(player.id).acWeapon[ac_i] = ACInfo.get(
        player.id,
      ).acSpawnWeapon2;
      ACInfo.get(player.id).acAmmo[ac_i] = ACInfo.get(player.id).acSpawnAmmo2;
    }
    if (ac_IsValidWeapon(ACInfo.get(player.id).acSpawnWeapon3)) {
      ac_i = ac_wSlot[ACInfo.get(player.id).acSpawnWeapon3];
      ACInfo.get(player.id).acWeapon[ac_i] = ACInfo.get(
        player.id,
      ).acSpawnWeapon3;
      ACInfo.get(player.id).acAmmo[ac_i] = ACInfo.get(player.id).acSpawnAmmo3;
    }
  }
  const ac_ret = next();
  if (ac_ur) {
    if (ACInfo.get(player.id).acSet[0] === -1) player.setInterior(0);
    if (ACInfo.get(player.id).acSet[1] === -1) player.setHealth(100.0);
    if (ACInfo.get(player.id).acSet[2] === -1) player.setArmour(0.0);
  }

  return ac_ret;
});

PlayerEvent.onDeath(({ player, killer, reason, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    if (
      ACInfo.get(player.id).acACAllow[28] &&
      (ACInfo.get(player.id).acDead ||
        (!ACInfo.get(player.id).acDeathRes &&
          ((reason !== WeaponEnum.REASON_COLLISION && reason !== 255) ||
            killer !== InvalidEnum.PLAYER_ID)))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Is dead: ${ACInfo.get(player.id).acDead}, death res: ${ACInfo.get(player.id).acDeathRes}, killerId: ${typeof killer === "number" ? killer : killer.id}, reason: ${reason}`,
        );
      }
      ac_KickWithCode(player, "", 0, 28);
    }
    ACInfo.get(player.id).acDead = true;
    ACInfo.get(player.id).acDeathRes = false;
    if (
      ACInfo.get(player.id).acSpawnRes < 1 &&
      ACInfo.get(player.id).acSet[1] <= 0
    )
      ACInfo.get(player.id).acSpawnTick = Date.now();
    if (!ACInfo.get(player.id).acSpec) ACInfo.get(player.id).acSpawnRes = 1;
    else {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Spawn res: ${ACInfo.get(player.id).acSpawnRes}`,
        );
      }
      ac_KickWithCode(player, "", 0, 48, 4);
    }
  }
  return next();
});

PlayerEvent.onKeyStateChange(({ player, newKeys, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    let ac_i = player.getWeapon();
    if (
      newKeys & KeysEnum.CROUCH &&
      ((ac_i >= 24 && ac_i <= 25) || (ac_i >= 33 && ac_i <= 34))
    )
      ACInfo.get(player.id).acCheatCount[12] = 0;
    if (newKeys & KeysEnum.SECONDARY_ATTACK) {
      const ac_i_veh = Vehicle.getInstance(ACInfo.get(player.id).acVeh);
      ac_i = ac_i_veh ? ac_i_veh.getModel() : 0;
      if (
        ac_IsValidVehicleModel(ac_i) &&
        (ac_IsAnAircraft(ac_i) || ac_IsAnAircraftRC(ac_i))
      )
        ACInfo.get(player.id).acParachute = 1;
      if (
        ACInfo.get(player.id).acSpecAct === SpecialActionsEnum.USEJETPACK &&
        player.getSpecialAction() !== SpecialActionsEnum.USEJETPACK
      ) {
        ACInfo.get(player.id).acDropJpX = ACInfo.get(player.id).acPosX;
        ACInfo.get(player.id).acDropJpY = ACInfo.get(player.id).acPosY;
      }
    }
  }
  return next();
});

PlayerEvent.onCommandTextRaw(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[5] < ac_Mtfc[5][0]) {
        ac_FloodDetect(player, 5);
        return true;
      }
      if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[5] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[5] = ac_gtc;
  }
  return next();
});

PlayerEvent.onRequestClass(({ player, classId, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_i = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_i - ACInfo.get(player.id).acCall[9] < ac_Mtfc[9][0])
        ac_FloodDetect(player, 9);
      else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[9] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acClassRes = true;
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[9] = ac_i;
    const classInfo = GameMode.getPlayerClass(
      classId,
    ) as unknown as IPlayerClass;
    ACInfo.get(player.id).acSpawnPosX = classInfo.spawnX;
    ACInfo.get(player.id).acSpawnPosY = classInfo.spawnY;
    ACInfo.get(player.id).acSpawnPosZ = classInfo.spawnZ;
    ACInfo.get(player.id).acSpawnWeapon1 = classInfo.weapon1;
    ACInfo.get(player.id).acSpawnAmmo1 = classInfo.weapon1Ammo;
    ACInfo.get(player.id).acSpawnWeapon2 = classInfo.weapon2;
    ACInfo.get(player.id).acSpawnAmmo2 = classInfo.weapon2Ammo;
    ACInfo.get(player.id).acSpawnWeapon3 = classInfo.weapon3;
    ACInfo.get(player.id).acSpawnAmmo3 = classInfo.weapon3Ammo;
  }
  return next();
});

PlayerEvent.onText(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[16] < ac_Mtfc[16][0])
        return ac_FloodDetect(player, 16);
      if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[16] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[16] =
      ac_gtc;
  }
  return next();
});

PlayerEvent.onRequestSpawn(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;

  const ac_gtc = Date.now();

  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[19] < ac_Mtfc[19][0])
        ac_FloodDetect(player, 19);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[19] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    if (!ACInfo.get(player.id).acClassRes) {
      ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[19] =
        ac_gtc;
      return false;
    }
  }

  const ac_i = next();
  if (!ac_i) return ac_i;

  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[19] = ac_gtc;
  ACInfo.get(player.id).acSpawnTick = ACInfo.get(player.id).acNOPCount[9] = 0;
  ACInfo.get(player.id).acSpawnRes = 1;
  ACInfo.get(player.id).acSet[6] = 3;
  return ac_i;
});
