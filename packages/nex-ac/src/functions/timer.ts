import {
  E_STREAMER,
  LimitsEnum,
  NetStats,
  Player,
  PlayerStateEnum,
  Streamer,
  StreamerItemTypes,
  Vehicle,
  WeaponEnum,
} from "@infernus/core";
import { ACInfo, ACPickInfo, ACVehInfo } from "../struct";
import { innerACConfig, innerGameModeConfig } from "../config";
import {
  ac_KickWithCode,
  triggerCheatWarning,
  triggerNOPWarning,
} from "../callbacks/trigger";
import { ac_AmmuNationInfo, ac_pAmmo, ac_wSlot } from "../constants";
import {
  ac_InAmmuNation,
  ac_InCasino,
  ac_IsAmmoSharingInSlot,
  ac_IsAnAirplane,
  ac_IsATrainLoco,
  ac_IsBulletWeapon,
  ac_IsValidVehicleModel,
  ac_IsWeaponSlotWithAmmo,
} from "./is";
import { orig_playerMethods } from "../hooks/origin";
import { ac_GetSpeed } from "./get";
import { $t } from "../lang";

export function ac_Timer(player: Player) {
  if (!player.isConnected() || ACInfo.get(player.id).acKicked > 0) return 0;
  let ac_gpp;

  if (
    ACInfo.get(player.id).acACAllow[51] &&
    (ac_gpp = NetStats.getMessagesRecvPerSecond(player)) >
      innerACConfig.AC_MAX_MSGS_REC_DIFF
  ) {
    if (innerACConfig.DEBUG) {
      console.log(
        `[Nex-AC debug] Max msgs per sec: ${innerACConfig.AC_MAX_MSGS_REC_DIFF}, msgs per sec: ${ac_gpp}`,
      );
    }
    ac_KickWithCode(player, "", 0, 51);
  }

  ac_gpp = player.getPing();
  if (ACInfo.get(player.id).acACAllow[38]) {
    if (ac_gpp > innerACConfig.AC_MAX_PING) {
      if (
        ++ACInfo.get(player.id).acCheatCount[0] >
        innerACConfig.AC_MAX_PING_WARNINGS
      ) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC debug] Max ping: ${innerACConfig.AC_MAX_PING}, ping: ${ac_gpp}`,
          );
        }
        ac_KickWithCode(player, "", 0, 38);
        ACInfo.get(player.id).acCheatCount[0] = 0;
      } else {
        triggerCheatWarning(
          player,
          "",
          0,
          38,
          0,
          ACInfo.get(player.id).acCheatCount[0],
        );
      }
    } else if (ACInfo.get(player.id).acCheatCount[0] > 0)
      ACInfo.get(player.id).acCheatCount[0]--;
  }
  const ac_gtc = Date.now();
  if (!ACInfo.get(player.id).acDead) {
    if (ac_gtc - ACInfo.get(player.id).acUpdateTick < 1500) {
      let ac_t,
        ac_s = ACInfo.get(player.id).acLastWeapon,
        ac_m;
      let ac_pick_dist = 0;
      if (ac_s !== -1 && ac_gtc - ACInfo.get(player.id).acGtc[6] > ac_gpp) {
        if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
          if (ACInfo.get(player.id).acLastPickup > LimitsEnum.MAX_PICKUPS) {
            ac_pick_dist = Streamer.getDistanceToItem(
              ACInfo.get(player.id).acPosX,
              ACInfo.get(player.id).acPosY,
              ACInfo.get(player.id).acPosZ,
              StreamerItemTypes.PICKUP,
              ACInfo.get(player.id).acLastPickup - LimitsEnum.MAX_PICKUPS,
            ).distance;
            ac_t =
              Streamer.getIntData(
                StreamerItemTypes.PICKUP,
                ACInfo.get(player.id).acLastPickup - LimitsEnum.MAX_PICKUPS,
                E_STREAMER.EXTRA_ID,
              ) - 100;
          }
        }
        ac_s = ac_wSlot[ac_s];
        for (let ac_i = 0, ac_cw = false; ac_i <= 12; ++ac_i) {
          const { weapons: ac_w, ammo: ac_a } = player.getWeaponData(ac_i);
          if (ac_w === WeaponEnum.SATCHEL) ac_cw = true;
          if (ac_s !== ac_i) {
            if (ACInfo.get(player.id).acSetWeapon[ac_i] > 0) {
              if (
                ACInfo.get(player.id).acSetWeapon[ac_i] === ac_w ||
                ACInfo.get(player.id).acGiveAmmo[ac_i] === 0
              ) {
                ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
                ACInfo.get(player.id).acWeapon[ac_i] = ac_w;
              } else if (
                ac_gtc - ACInfo.get(player.id).acGtcSetWeapon[ac_i] >
                ac_gpp
              ) {
                if (
                  ACInfo.get(player.id).acACAllow[52] &&
                  ACInfo.get(player.id).acNOPAllow[0]
                ) {
                  if (
                    ++ACInfo.get(player.id).acNOPCount[0] >
                    innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        $t("DEBUG_CODE_5", [player.id, "GivePlayerWeapon"]),
                      );
                      console.log(
                        `[Nex-AC debug] AC weapon: ${ACInfo.get(player.id).acSetWeapon[ac_i]}, weaponId: ${ac_w}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 52, 13);

                    ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
                  } else {
                    triggerNOPWarning(
                      player,
                      13,
                      ACInfo.get(player.id).acNOPCount[0],
                    );
                  }
                } else if (
                  ++ACInfo.get(player.id).acNOPCount[0] >
                  innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
                )
                  ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
              }
            } else {
              if (ACInfo.get(player.id).acWeapon[ac_i] !== ac_w) {
                if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
                  if (
                    (ACInfo.get(player.id).acLastPickup >= 0 &&
                      ACInfo.get(player.id).acLastPickup >=
                        LimitsEnum.MAX_PICKUPS &&
                      ACPickInfo.get(ACInfo.get(player.id).acLastPickup)
                        .acWeapon === ac_w &&
                      ac_a <=
                        (ac_IsAmmoSharingInSlot(ac_i)
                          ? ACInfo.get(player.id).acAmmo[ac_i] + ac_pAmmo[ac_w]
                          : ac_pAmmo[ac_w]) &&
                      player.isInRangeOfPoint(
                        15.0,
                        ACPickInfo.get(ACInfo.get(player.id).acLastPickup)
                          .acPosX,
                        ACPickInfo.get(ACInfo.get(player.id).acLastPickup)
                          .acPosY,
                        ACPickInfo.get(ACInfo.get(player.id).acLastPickup)
                          .acPosZ,
                      )) ||
                    (ACInfo.get(player.id).acLastPickup >
                      LimitsEnum.MAX_PICKUPS &&
                      ac_t === ac_w &&
                      ac_a <=
                        (ac_IsAmmoSharingInSlot(ac_i)
                          ? ACInfo.get(player.id).acAmmo[ac_i] + ac_pAmmo[ac_w]
                          : ac_pAmmo[ac_w]) &&
                      ac_pick_dist <= 15.0)
                  ) {
                    ACInfo.get(player.id).acWeapon[ac_i] = ac_w;
                    ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                  } else {
                    if (
                      ac_w === 0 ||
                      (ac_w === WeaponEnum.BOMB && ac_cw) ||
                      (ac_w === WeaponEnum.PARACHUTE &&
                        ACInfo.get(player.id).acParachute > 0 &&
                        (ACInfo.get(player.id).acVeh > 0 ||
                          ac_gtc - ACInfo.get(player.id).acGtc[15] <= ac_gpp))
                    ) {
                      if (ac_w === WeaponEnum.PARACHUTE)
                        ACInfo.get(player.id).acParachute = 0;
                      ACInfo.get(player.id).acWeapon[ac_i] = ac_w;
                      ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                    } else if (
                      ACInfo.get(player.id).acACAllow[15] &&
                      (!ac_IsWeaponSlotWithAmmo(ac_i) || ac_a !== 0)
                    ) {
                      if (innerACConfig.DEBUG)
                        console.log(
                          `[Nex-AC debug] AC weaponId: ${ACInfo.get(player.id).acWeapon[ac_i]}, AC ammo: ${ACInfo.get(player.id).acAmmo[ac_i]}, weaponId: ${ac_w}, ammo: ${ac_a}`,
                        );
                    }
                    ac_KickWithCode(player, "", 0, 15, 2);

                    if (ACInfo.get(player.id).acKicked < 1) {
                      ACInfo.get(player.id).acWeapon[ac_i] = ac_w;
                      ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                    }
                  }
                }
              }
              if (ACInfo.get(player.id).acGiveAmmo[ac_i] !== -65535) {
                if (ACInfo.get(player.id).acGiveAmmo[ac_i] === ac_a) {
                  ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
                  ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                } else if (
                  ac_gtc - ACInfo.get(player.id).acGtcGiveAmmo[ac_i] >
                  ac_gpp
                ) {
                  if (
                    ACInfo.get(player.id).acACAllow[52] &&
                    ACInfo.get(player.id).acNOPAllow[1] &&
                    (ACInfo.get(player.id).acGiveAmmo[ac_i] < ac_a ||
                      (0 > ac_a &&
                        ac_a <= ACInfo.get(player.id).acGiveAmmo[ac_i]))
                  ) {
                    if (
                      ++ACInfo.get(player.id).acNOPCount[1] >
                      innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
                    ) {
                      if (innerACConfig.DEBUG) {
                        console.log(
                          $t("DEBUG_CODE_5", [player.id, "SetPlayerAmmo"]),
                        );
                        console.log(
                          `[Nex-AC debug] AC ammo: ${ACInfo.get(player.id).acGiveAmmo[ac_i]}, ammo: ${ac_a}, weaponId: ${ac_w}`,
                        );
                      }
                      ac_KickWithCode(player, "", 0, 52, 14);

                      ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
                    } else {
                      triggerNOPWarning(
                        player,
                        14,
                        ACInfo.get(player.id).acNOPCount[1],
                      );
                    }
                  } else if (
                    ++ACInfo.get(player.id).acNOPCount[1] >
                    innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
                  ) {
                    if (
                      ACInfo.get(player.id).acGiveAmmo[ac_i] > ac_a &&
                      !(
                        0 > ac_a &&
                        ac_a <= ACInfo.get(player.id).acGiveAmmo[ac_i]
                      )
                    )
                      ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                    ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
                  }
                }
              } else if (ac_IsWeaponSlotWithAmmo(ac_i)) {
                if (ac_a === 0) ACInfo.get(player.id).acAmmo[ac_i] = 0;
                else if (
                  ACInfo.get(player.id).acACAllow[16] &&
                  (ac_a > ACInfo.get(player.id).acAmmo[ac_i] ||
                    (0 > ac_a && ac_a <= ACInfo.get(player.id).acAmmo[ac_i])) &&
                  (!innerGameModeConfig.ac_LagCompMode ||
                    !ac_IsBulletWeapon(ac_w) ||
                    ac_gtc - ACInfo.get(player.id).acShotTick > 3850)
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC debug] AC ammo: ${ACInfo.get(player.id).acAmmo[ac_i]}, ammo: ${ac_a}, weaponId: ${ac_w}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 16, 2);

                  if (ACInfo.get(player.id).acKicked < 1)
                    ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                }
              }
            }
          } else if (ac_IsBulletWeapon(ac_w)) {
            if (
              ac_a > ACInfo.get(player.id).acAmmo[ac_i] ||
              (0 > ac_a && ac_a <= ACInfo.get(player.id).acAmmo[ac_i])
            ) {
              if (ACInfo.get(player.id).acGiveAmmo[ac_i] === -65535) {
                if (
                  innerACConfig.AC_USE_AMMUNATIONS &&
                  ac_i >= 2 &&
                  ac_i <= 5 &&
                  ac_InAmmuNation(player, ACInfo.get(player.id).acInt) &&
                  (ac_m = ac_a - ACInfo.get(player.id).acAmmo[ac_i]) %
                    ac_AmmuNationInfo[ac_w - 22][1] ===
                    0
                ) {
                  if (ACInfo.get(player.id).acSet[10] !== -1)
                    ACInfo.get(player.id).acSet[10] +=
                      ac_AmmuNationInfo[ac_w - 22][0] *
                      (ac_m / ac_AmmuNationInfo[ac_w - 22][1]);
                  else
                    ACInfo.get(player.id).acSet[10] =
                      ac_AmmuNationInfo[ac_w - 22][0] *
                      (ac_m / ac_AmmuNationInfo[ac_w - 22][1]);
                  ACInfo.get(player.id).acAmmo[ac_i] += ac_m;
                  ACInfo.get(player.id).acGtc[17] = ac_gtc + 2650;
                  ACInfo.get(player.id).acCheatCount[20] = 0;
                } else {
                  if (
                    ACInfo.get(player.id).acACAllow[16] &&
                    (!innerGameModeConfig.ac_LagCompMode ||
                      ac_gtc - ACInfo.get(player.id).acShotTick > 3850)
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC debug] AC ammo: ${ACInfo.get(player.id).acAmmo[ac_i]}, ammo: ${ac_a}, weaponId: ${ac_w}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 16, 3);

                    if (ACInfo.get(player.id).acKicked < 1)
                      ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
                  }
                }
              } else if (ACInfo.get(player.id).acAmmo[ac_i] !== 0)
                ACInfo.get(player.id).acAmmo[ac_i] = ac_a;
            }
          }
        }
        ac_s = player.getState();
        if (ac_s === PlayerStateEnum.DRIVER) {
          ac_t = ACInfo.get(player.id).acVeh;
          if (
            ACInfo.get(player.id).acACAllow[35] &&
            player.getCameraMode() === 55
          )
            ac_KickWithCode(player, "", 0, 35);
          if (
            ACInfo.get(player.id).acACAllow[3] &&
            ACInfo.get(player.id).acSet[8] === -1
          ) {
            let ac_time = 0;
            let ac_maxDist = 140.0;
            const ac_dist = player.getDistanceFromPoint(
              ACInfo.get(player.id).acLastPosX,
              ACInfo.get(player.id).acLastPosY,
              ACInfo.get(player.id).acPosZ,
            );
            const ac_dist_set = player.getDistanceFromPoint(
              ACInfo.get(player.id).acSetPosX,
              ACInfo.get(player.id).acSetPosY,
              ACInfo.get(player.id).acPosZ,
            );
            if (
              (ac_time =
                (ac_gtc - ACInfo.get(player.id).acTimerTick) / 1000.0) > 1.0
            )
              ac_maxDist *= ac_time;
            if (
              ac_dist >= ac_maxDist &&
              (ACInfo.get(player.id).acSet[7] === -1 ||
                ac_dist_set >= ac_maxDist)
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC debug] Dist: ${ac_dist}, dist set: ${ac_dist_set}, acSet[7]: ${ACInfo.get(player.id).acSet[7]}, speed: ${ACVehInfo.get(ac_t).acSpeed}, veh: ${ac_t}`,
                );
              }
              ac_KickWithCode(player, "", 0, 3, 3);
            }
          }
          ACInfo.get(player.id).acLastPosX = ACInfo.get(player.id).acPosX;
          ACInfo.get(player.id).acLastPosY = ACInfo.get(player.id).acPosY;
          ac_s = ac_GetSpeed(
            ACVehInfo.get(ac_t).acVelX,
            ACVehInfo.get(ac_t).acVelY,
          );
          if (
            ACInfo.get(player.id).acACAllow[10] &&
            ac_gtc - ACInfo.get(player.id).acGtc[8] > ac_gpp
          ) {
            const ac_m_veh = Vehicle.getInstance(ac_t);
            ac_m = ac_m_veh ? ac_m_veh.getModel() : 0;
            const ac_time =
              (ac_gtc - ACInfo.get(player.id).acTimerTick) / 1100.0;
            if (
              ac_s - ACVehInfo.get(ac_t).acLastSpeed >=
                (ac_time > 1.0 ? Math.round(80.0 * ac_time) : 80) &&
              (!ac_IsValidVehicleModel(ac_m) ||
                (!ac_IsATrainLoco(ac_m) && !ac_IsAnAirplane(ac_m)))
            ) {
              ACInfo.get(player.id).acCheatCount[18] +=
                1 * innerACConfig.AC_SPEEDHACK_VEH_RESET_DELAY;
              if (
                ACInfo.get(player.id).acCheatCount[18] >
                innerACConfig.AC_MAX_SPEEDHACK_VEH_WARNINGS
              ) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC debug] Speed: ${ac_s}, last speed: ${ACVehInfo.get(ac_t).acLastSpeed}, veh model: ${ac_m}, veh: ${ac_t}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 10, 4);

                ACInfo.get(player.id).acCheatCount[18] = 0;
              } else {
                triggerCheatWarning(
                  player,
                  "",
                  0,
                  10,
                  4,
                  Math.round(
                    ACInfo.get(player.id).acCheatCount[18] /
                      innerACConfig.AC_SPEEDHACK_VEH_RESET_DELAY,
                  ),
                );
              }
            }
          }
          ACVehInfo.get(ac_t).acLastSpeed = ac_s;
        } else if (ac_s === PlayerStateEnum.ONFOOT) {
          if (
            ACInfo.get(player.id).acACAllow[2] &&
            ACInfo.get(player.id).acSet[8] === -1 &&
            !player.getSurfingVehicle()?.isStreamedIn(player) &&
            !player.getSurfingObject() &&
            !player.getSurfingPlayerObject()
          ) {
            let ac_time = 0,
              ac_maxDist = 80.0;
            const ac_dist = player.getDistanceFromPoint(
              ACInfo.get(player.id).acLastPosX,
              ACInfo.get(player.id).acLastPosY,
              ACInfo.get(player.id).acPosZ,
            );
            const ac_dist_set = player.getDistanceFromPoint(
              ACInfo.get(player.id).acSetPosX,
              ACInfo.get(player.id).acSetPosY,
              ACInfo.get(player.id).acPosZ,
            );
            if (
              (ac_time =
                (ac_gtc - ACInfo.get(player.id).acTimerTick) / 1000.0) > 1.0
            )
              ac_maxDist *= ac_time;
            if (
              ac_dist >= ac_maxDist &&
              (ACInfo.get(player.id).acSet[7] === -1 ||
                ac_dist_set >= ac_maxDist)
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC debug] Dist: ${ac_dist}, dist set: ${ac_dist_set}, acSet[7]: ${ACInfo.get(player.id).acSet[7]}, speed: ${ACInfo.get(player.id).acSpeed}, old pos x, y: ${ACInfo.get(player.id).acLastPosX}, ${ACInfo.get(player.id).acLastPosY}`,
                );
              }
              ac_KickWithCode(player, "", 0, 2, 6);
            }
          }
          ACInfo.get(player.id).acLastPosX = ACInfo.get(player.id).acPosX;
          ACInfo.get(player.id).acLastPosY = ACInfo.get(player.id).acPosY;
        }
        ac_t = orig_playerMethods.getMoney.call(player);
        if (innerACConfig.AC_USE_AMMUNATIONS) {
          if (ACInfo.get(player.id).acSet[10] !== -1) {
            if (
              ac_t < ACInfo.get(player.id).acMoney &&
              ACInfo.get(player.id).acMoney - ac_t >=
                ACInfo.get(player.id).acSet[10]
            )
              ACInfo.get(player.id).acSet[10] = -1;
            else if (ac_gtc - ACInfo.get(player.id).acGtc[17] > ac_gpp) {
              if (ACInfo.get(player.id).acACAllow[15]) {
                if (
                  ++ACInfo.get(player.id).acCheatCount[20] >
                  innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC debug] Money: ${ac_t}, old money: ${ACInfo.get(player.id).acMoney}, price: ${ACInfo.get(player.id).acSet[10]}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 15, 3);

                  ACInfo.get(player.id).acSet[10] = -1;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    15,
                    3,
                    ACInfo.get(player.id).acCheatCount[20],
                  );
                }
              } else if (
                ++ACInfo.get(player.id).acCheatCount[20] >
                innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
              )
                ACInfo.get(player.id).acSet[10] = -1;
            }
          }
        }
        if (innerACConfig.AC_USE_TUNING_GARAGES) {
          if (ACInfo.get(player.id).acSet[11] !== -1) {
            if (
              ac_t < ACInfo.get(player.id).acMoney &&
              ACInfo.get(player.id).acMoney - ac_t >=
                ACInfo.get(player.id).acSet[11]
            )
              ACInfo.get(player.id).acSet[11] = -1;
            else if (ac_gtc - ACInfo.get(player.id).acGtc[18] > ac_gpp) {
              if (ACInfo.get(player.id).acACAllow[23]) {
                if (
                  ++ACInfo.get(player.id).acCheatCount[21] >
                  innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC debug] Money: ${ac_t}, old money: ${ACInfo.get(player.id).acMoney}, components price: ${ACInfo.get(player.id).acSet[11]}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 23, 3);

                  ACInfo.get(player.id).acSet[11] = -1;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    23,
                    3,
                    ACInfo.get(player.id).acCheatCount[21],
                  );
                }
              } else if (
                ++ACInfo.get(player.id).acCheatCount[21] >
                innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
              )
                ACInfo.get(player.id).acSet[11] = -1;
            }
          }
        }
        if (
          ACInfo.get(player.id).acSet[6] !== -1 &&
          ac_gtc - ACInfo.get(player.id).acGtc[12] > ac_gpp
        ) {
          if (
            ACInfo.get(player.id).acACAllow[52] &&
            ACInfo.get(player.id).acNOPAllow[9]
          ) {
            if (
              ++ACInfo.get(player.id).acNOPCount[9] >
              innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
            ) {
              if (innerACConfig.DEBUG) {
                console.log($t("DEBUG_CODE_5", [player.id, "SpawnPlayer"]));
                console.log(
                  `[Nex-AC debug] acSet[6]: ${ACInfo.get(player.id).acSet[6]}`,
                );
              }
              ac_KickWithCode(player, "", 0, 52, 7);

              ACInfo.get(player.id).acSet[6] = -1;
            } else {
              triggerNOPWarning(player, 7, ACInfo.get(player.id).acNOPCount[9]);
            }
          } else if (
            ++ACInfo.get(player.id).acNOPCount[9] >
            innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
          )
            ACInfo.get(player.id).acSet[6] = -1;
        }
        if (
          ACInfo.get(player.id).acSet[0] !== -1 &&
          ac_gtc - ACInfo.get(player.id).acGtc[0] > ac_gpp
        ) {
          if (
            ACInfo.get(player.id).acACAllow[52] &&
            ACInfo.get(player.id).acNOPAllow[2] &&
            ACInfo.get(player.id).acInt !== ACInfo.get(player.id).acSet[0]
          ) {
            if (
              ++ACInfo.get(player.id).acNOPCount[2] >
              innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  $t("DEBUG_CODE_5", [player.id, "SetPlayerInterior"]),
                );
                console.log(
                  `[Nex-AC debug] AC interior: ${ACInfo.get(player.id).acSet[0]}, interiorId: ${ACInfo.get(player.id).acInt}`,
                );
              }
              ac_KickWithCode(player, "", 0, 52, 5);

              ACInfo.get(player.id).acSet[0] = -1;
            } else {
              triggerNOPWarning(player, 5, ACInfo.get(player.id).acNOPCount[2]);
            }
          } else if (
            ++ACInfo.get(player.id).acNOPCount[2] >
            innerACConfig.AC_MAX_NOP_TIMER_WARNINGS
          )
            ACInfo.get(player.id).acSet[0] = -1;
        }
        if (ACInfo.get(player.id).acNOPCount[11] > 0)
          ACInfo.get(player.id).acNOPCount[11]--;
        else {
          if (
            ACInfo.get(player.id).acACAllow[14] &&
            ac_t > ACInfo.get(player.id).acMoney &&
            (!ACInfo.get(player.id).acStuntBonus ||
              (ACInfo.get(player.id).acVeh === 0 &&
                ac_gtc - ACInfo.get(player.id).acGtc[15] > ac_gpp))
          ) {
            if (
              !innerACConfig.AC_USE_CASINOS ||
              (innerACConfig.AC_USE_CASINOS &&
                !ac_InCasino(player, ACInfo.get(player.id).acInt))
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC debug] AC money: ${ACInfo.get(player.id).acMoney}, money: ${ac_t}, stunt bonus: ${ACInfo.get(player.id).acStuntBonus}, veh: ${ACInfo.get(player.id).acVeh}, playerId: ${player.id}`,
                );
              }

              ac_KickWithCode(player, "", 0, 14);

              ac_t = ACInfo.get(player.id).acMoney;

              player.resetMoney();
              player.giveMoney(ac_t);
            }
          }
        }
        ACInfo.get(player.id).acMoney = ac_t;
      }
    } else {
      ac_gpp = ac_gtc - ACInfo.get(player.id).acTimerTick;
      if (ACInfo.get(player.id).acSet[3] !== -1)
        ACInfo.get(player.id).acGtc[5] += ac_gpp;
      if (ACInfo.get(player.id).acSet[7] !== -1)
        ACInfo.get(player.id).acGtc[10] += ac_gpp;
      if (ACInfo.get(player.id).acSet[9] !== -1)
        ACInfo.get(player.id).acGtc[7] += ac_gpp;
      if (ACInfo.get(player.id).acSetVehHealth !== -1.0)
        ACInfo.get(player.id).acGtc[3] += ac_gpp;
      if (ac_gtc - ACInfo.get(player.id).acGtc[9] < 1000)
        ACInfo.get(player.id).acGtc[9] += ac_gpp;
      if (ac_gtc - ACInfo.get(player.id).acGtc[8] < 1000)
        ACInfo.get(player.id).acGtc[8] += ac_gpp;
      if (ac_gtc - ACInfo.get(player.id).acGtc[6] < 1000)
        ACInfo.get(player.id).acGtc[6] += ac_gpp;
    }
    if (ACInfo.get(player.id).acCheatCount[14] > 0)
      ACInfo.get(player.id).acCheatCount[14]--;
    if (ACInfo.get(player.id).acCheatCount[18] > 0)
      ACInfo.get(player.id).acCheatCount[18]--;
    ACInfo.get(player.id).acCheatCount[1] =
      ACInfo.get(player.id).acCheatCount[2] =
      ACInfo.get(player.id).acCheatCount[3] =
      ACInfo.get(player.id).acCheatCount[4] =
      ACInfo.get(player.id).acCheatCount[19] =
        0;
  }
  ACInfo.get(player.id).acTimerTick = ac_gtc;
  return 1;
}
