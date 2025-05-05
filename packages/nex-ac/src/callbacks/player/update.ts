import {
  E_STREAMER,
  InvalidEnum,
  LimitsEnum,
  PlayerEvent,
  PlayerStateEnum,
  SpecialActionsEnum,
  Streamer,
  StreamerItemTypes,
  Vehicle,
  WeaponEnum,
} from "@infernus/core";
import { ACInfo, ACVehInfo } from "../../struct";
import {
  ac_GetSpeed,
  ac_GetVectorDist,
  ac_InAmmuNation,
  ac_InPayNSpray,
  ac_InRestaurant,
  ac_IsABmx,
  ac_IsABmxEx,
  ac_IsAmmoSharingInSlot,
  ac_IsAnAircraft,
  ac_IsAnAircraftEx,
  ac_IsAnAircraftRC,
  ac_IsATrainLoco,
  ac_IsATrainPartEx,
  ac_IsValidFloat,
  ac_IsValidSkin,
  ac_IsValidVehicleModel,
  ac_NearVendingMachine,
} from "../../functions";
import { innerGameModeConfig, innerACConfig } from "../../config";
import {
  ac_KickWithCode,
  triggerCheatWarning,
  triggerNOPWarning,
} from "../trigger";
import { ac_AmmuNationInfo, ac_pAmmo, ac_wSlot } from "../../constants";
import { orig_playerMethods } from "../../hooks/origin";
import { $t } from "../../lang";

PlayerEvent.onUpdate(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  const ac_gtc = Date.now();
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gpp = player.getPing();
    let ac_w = 0;
    let ac_sa = 0;
    if (
      !ACInfo.get(player.id).acSpec &&
      (ac_sa = player.getState()) !== PlayerStateEnum.SPECTATING &&
      (ac_w = player.getWeapon()) !== -1
    ) {
      let ac_s = ac_wSlot[ac_w];
      const ac_a = player.getAmmo();
      let ac_tmp = 0;
      let ac_i = 0;
      if (
        innerACConfig.AC_USE_AMMUNATIONS ||
        innerACConfig.AC_USE_TUNING_GARAGES
      ) {
        ac_i = orig_playerMethods.getMoney.call(player);
      }
      if (innerACConfig.AC_USE_AMMUNATIONS) {
        if (ACInfo.get(player.id).acSet[10] !== -1) {
          if (
            ac_i < ACInfo.get(player.id).acMoney &&
            ACInfo.get(player.id).acMoney - ac_i >=
              ACInfo.get(player.id).acSet[10]
          )
            ACInfo.get(player.id).acSet[10] = -1;
        }
      }
      if (innerACConfig.AC_USE_TUNING_GARAGES) {
        if (ACInfo.get(player.id).acSet[11] !== -1) {
          if (
            ac_i < ACInfo.get(player.id).acMoney &&
            ACInfo.get(player.id).acMoney - ac_i >=
              ACInfo.get(player.id).acSet[11]
          )
            ACInfo.get(player.id).acSet[11] = -1;
        }
      }
      const { x: ac_pX, y: ac_pY, z: ac_pZ } = player.getPos()!;
      if (ac_gtc - ACInfo.get(player.id).acGtc[6] > ac_gpp) {
        if (ACInfo.get(player.id).acSetWeapon[ac_s] > 0) {
          if (
            ACInfo.get(player.id).acSetWeapon[ac_s] === ac_w ||
            ACInfo.get(player.id).acGiveAmmo[ac_s] === 0
          ) {
            ACInfo.get(player.id).acSetWeapon[ac_s] = -1;
            ACInfo.get(player.id).acWeapon[ac_s] = ac_w;
          } else if (
            !(
              ac_sa >= PlayerStateEnum.DRIVER &&
              ac_sa <= PlayerStateEnum.PASSENGER
            ) &&
            ac_gtc - ACInfo.get(player.id).acGtcSetWeapon[ac_s] > ac_gpp
          ) {
            if (
              ACInfo.get(player.id).acACAllow[52] &&
              ACInfo.get(player.id).acNOPAllow[0]
            ) {
              if (
                ++ACInfo.get(player.id).acNOPCount[0] >
                innerACConfig.AC_MAX_NOP_WARNINGS
              ) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    $t("DEBUG_CODE_5", [player.id, "GivePlayerWeapon"]),
                  );
                  console.log(
                    `[Nex-AC DEBUG] AC weapon: ${ACInfo.get(player.id).acSetWeapon[ac_s]}, weaponId: ${ac_w}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 52, 1);
                if (ACInfo.get(player.id).acKicked > 0) return false;
                ACInfo.get(player.id).acSetWeapon[ac_s] = -1;
              } else {
                triggerNOPWarning(
                  player,
                  1,
                  ACInfo.get(player.id).acNOPCount[0],
                );
              }
            } else if (
              ++ACInfo.get(player.id).acNOPCount[0] >
              innerACConfig.AC_MAX_NOP_WARNINGS
            ) {
              ACInfo.get(player.id).acSetWeapon[ac_s] = -1;
            }
          }
        }
        if (ACInfo.get(player.id).acGiveAmmo[ac_s] !== -65535) {
          if (ACInfo.get(player.id).acGiveAmmo[ac_s] === ac_a) {
            ACInfo.get(player.id).acGiveAmmo[ac_s] = -65535;
            ACInfo.get(player.id).acAmmo[ac_s] = ac_a;
          } else if (
            ac_gtc - ACInfo.get(player.id).acGtcGiveAmmo[ac_s] >
            ac_gpp
          ) {
            if (
              ACInfo.get(player.id).acACAllow[52] &&
              ACInfo.get(player.id).acNOPAllow[1] &&
              (ACInfo.get(player.id).acGiveAmmo[ac_s] < ac_a ||
                (0 > ac_a && 0 <= ACInfo.get(player.id).acGiveAmmo[ac_s]))
            ) {
              if (
                ++ACInfo.get(player.id).acNOPCount[1] >
                innerACConfig.AC_MAX_NOP_WARNINGS
              ) {
                if (innerACConfig.DEBUG) {
                  console.log($t("DEBUG_CODE_5", [player.id, "SetPlayerAmmo"]));
                  console.log(
                    `[Nex-AC DEBUG] AC ammo: ${ACInfo.get(player.id).acGiveAmmo[ac_s]}, ammo: ${ac_a}, weaponId: ${ac_w}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 52, 2);
                if (ACInfo.get(player.id).acKicked > 0) return false;
                ACInfo.get(player.id).acGiveAmmo[ac_s] = -65535;
              } else {
                triggerNOPWarning(
                  player,
                  2,
                  ACInfo.get(player.id).acNOPCount[1],
                );
              }
            } else if (
              ++ACInfo.get(player.id).acNOPCount[1] >
              innerACConfig.AC_MAX_NOP_WARNINGS
            ) {
              if (
                ACInfo.get(player.id).acGiveAmmo[ac_s] > ac_a &&
                !(0 > ac_a && 0 <= ACInfo.get(player.id).acGiveAmmo[ac_s])
              )
                ACInfo.get(player.id).acAmmo[ac_s] = ac_a;
              ACInfo.get(player.id).acGiveAmmo[ac_s] = -65535;
            }
          }
        }
        if (ACInfo.get(player.id).acHoldWeapon !== ac_w) {
          if (ACInfo.get(player.id).acWeapon[ac_s] !== ac_w) {
            if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
              if (ACInfo.get(player.id).acLastPickup > LimitsEnum.MAX_PICKUPS)
                ac_tmp = Streamer.getDistanceToItem(
                  ac_pX,
                  ac_pY,
                  ac_pZ,
                  StreamerItemTypes.PICKUP,
                  ACInfo.get(player.id).acLastPickup - LimitsEnum.MAX_PICKUPS,
                );
              if (
                ACInfo.get(player.id).acLastPickup > LimitsEnum.MAX_PICKUPS &&
                Streamer.getIntData(
                  StreamerItemTypes.PICKUP,
                  ACInfo.get(player.id).acLastPickup - LimitsEnum.MAX_PICKUPS,
                  E_STREAMER.EXTRA_ID,
                ) ===
                  ac_w + 100 &&
                ac_a <=
                  (ac_IsAmmoSharingInSlot(ac_s)
                    ? ACInfo.get(player.id).acAmmo[ac_s] + ac_pAmmo[ac_w]
                    : ac_pAmmo[ac_w]) &&
                ac_tmp <= 15.0
              ) {
                ACInfo.get(player.id).acWeapon[ac_s] = ac_w;
                ACInfo.get(player.id).acAmmo[ac_s] = ac_a;
              } else {
                if (
                  innerACConfig.AC_USE_AMMUNATIONS &&
                  ac_s >= 2 &&
                  ac_s <= 5 &&
                  ac_InAmmuNation(player, ACInfo.get(player.id).acInt)
                ) {
                  ACInfo.get(player.id).acCheatCount[20] = 0;
                  if (ACInfo.get(player.id).acSet[10] !== -1)
                    ACInfo.get(player.id).acSet[10] +=
                      ac_AmmuNationInfo[ac_w - 22][0];
                  else
                    ACInfo.get(player.id).acSet[10] =
                      ac_AmmuNationInfo[ac_w - 22][0];
                  if (ac_s !== 2)
                    ACInfo.get(player.id).acAmmo[ac_s] +=
                      ac_AmmuNationInfo[ac_w - 22][1];
                  else
                    ACInfo.get(player.id).acAmmo[ac_s] =
                      ac_AmmuNationInfo[ac_w - 22][1];
                  ACInfo.get(player.id).acWeapon[ac_s] = ac_w;
                  ACInfo.get(player.id).acGtc[17] = ac_gtc + 2650;
                } else {
                  if (
                    ac_w === 0 ||
                    ac_w === WeaponEnum.BOMB ||
                    (ac_w === WeaponEnum.PARACHUTE &&
                      ACInfo.get(player.id).acParachute > 0 &&
                      (ACInfo.get(player.id).acVeh > 0 ||
                        ac_gtc - ACInfo.get(player.id).acGtc[15] <= ac_gpp))
                  ) {
                    if (ac_w === WeaponEnum.PARACHUTE)
                      ACInfo.get(player.id).acParachute = 0;
                    ACInfo.get(player.id).acWeapon[ac_s] = ac_w;
                    ACInfo.get(player.id).acAmmo[ac_s] = ac_a;
                  } else if (
                    ACInfo.get(player.id).acACAllow[15] &&
                    ACInfo.get(player.id).acSetWeapon[ac_s] === -1
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] AC weaponId: ${ACInfo.get(player.id).acWeapon[ac_s]}, AC ammo: ${ACInfo.get(player.id).acAmmo[ac_s]}, weaponId: ${ac_w}, ammo: ${ac_a}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 15, 1);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acWeapon[ac_s] = ac_w;
                    ACInfo.get(player.id).acAmmo[ac_s] = ac_a;
                  }
                }
              }
            }
          }
        } else if (
          ACInfo.get(player.id).acAmmo[ac_s] !== ac_a &&
          !(
            ac_sa >= PlayerStateEnum.DRIVER &&
            ac_sa <= PlayerStateEnum.PASSENGER
          ) &&
          ac_s >= 7 &&
          ac_s <= 9 &&
          ac_w !== WeaponEnum.MINIGUN &&
          ACInfo.get(player.id).acGiveAmmo[ac_s] === -65535
        ) {
          if (
            ACInfo.get(player.id).acACAllow[16] &&
            (ACInfo.get(player.id).acAmmo[ac_s] === 0 ||
              ac_a > ACInfo.get(player.id).acAmmo[ac_s] ||
              (0 > ac_a && ac_a < ACInfo.get(player.id).acAmmo[ac_s]))
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] AC ammo: ${ACInfo.get(player.id).acAmmo[ac_s]}, ammo: ${ac_a}, weaponId: ${ac_w}`,
              );
            }
            ac_KickWithCode(player, "", 0, 16, 1);
            if (ACInfo.get(player.id).acKicked > 0) return false;
          }
          ACInfo.get(player.id).acAmmo[ac_s] = ac_a;
        }
      }
      ac_tmp = player.getHealth();
      let ac_health = ac_tmp < 0 ? Math.ceil(ac_tmp) : Math.floor(ac_tmp);
      if (ACInfo.get(player.id).acSet[1] !== -1) {
        if (ACInfo.get(player.id).acSet[1] > 255) {
          ac_health +=
            ACInfo.get(player.id).acSet[1] -
            (ACInfo.get(player.id).acSet[1] % 256) -
            256;
          if (ACInfo.get(player.id).acSet[1] - ac_health > 255)
            ac_health += 256;
        }
        if (ACInfo.get(player.id).acSet[1] === ac_health) {
          ACInfo.get(player.id).acSet[1] = -1;
          ACInfo.get(player.id).acCheatCount[9] = 0;
          ACInfo.get(player.id).acDmgRes = false;
        } else if (ac_gtc - ACInfo.get(player.id).acGtc[2] > ac_gpp) {
          if (
            ACInfo.get(player.id).acACAllow[52] &&
            ACInfo.get(player.id).acNOPAllow[3] &&
            ACInfo.get(player.id).acSet[1] < ac_health
          ) {
            if (
              ++ACInfo.get(player.id).acNOPCount[3] >
              innerACConfig.AC_MAX_NOP_WARNINGS
            ) {
              if (innerACConfig.DEBUG) {
                console.log($t("DEBUG_CODE_5", [player.id, "SetPlayerHealth"]));
                console.log(
                  `[Nex-AC DEBUG] AC health: ${ACInfo.get(player.id).acSet[1]}, health: ${ac_health}`,
                );
              }
              ac_KickWithCode(player, "", 0, 52, 3);
              if (ACInfo.get(player.id).acKicked > 0) return false;
              ACInfo.get(player.id).acSet[1] = -1;
            } else {
              triggerNOPWarning(
                player.id,
                3,
                ACInfo.get(player.id).acNOPCount[3],
              );
            }
          } else if (
            ++ACInfo.get(player.id).acNOPCount[3] >
            innerACConfig.AC_MAX_NOP_WARNINGS
          ) {
            if (ACInfo.get(player.id).acSet[1] > ac_health) {
              ACInfo.get(player.id).acCheatCount[9] = 0;
              ACInfo.get(player.id).acDmgRes = false;
            }
            ACInfo.get(player.id).acSet[1] = -1;
          }
        }
      } else {
        if (ACInfo.get(player.id).acHealth > 255) {
          ac_health +=
            ACInfo.get(player.id).acHealth -
            (ACInfo.get(player.id).acHealth % 256) -
            256;
          if (ACInfo.get(player.id).acHealth - ac_health > 255)
            ac_health += 256;
        }
        if (
          ACInfo.get(player.id).acACAllow[12] &&
          ac_health > ACInfo.get(player.id).acHealth
        ) {
          if (
            !innerACConfig.AC_USE_RESTAURANTS ||
            (innerACConfig.AC_USE_RESTAURANTS &&
              ac_health - ACInfo.get(player.id).acHealth > 70) ||
            !ac_InRestaurant(player, ACInfo.get(player.id).acInt)
          ) {
            if (
              !innerACConfig.AC_USE_VENDING_MACHINES ||
              (innerACConfig.AC_USE_VENDING_MACHINES &&
                ac_health - ACInfo.get(player.id).acHealth > 35) ||
              !ac_NearVendingMachine(player, ACInfo.get(player.id).acInt)
            ) {
              if (innerACConfig.DEBUG)
                console.log(
                  `[Nex-AC DEBUG] AC health: ${ACInfo.get(player.id).acHealth}, health: ${ac_health}`,
                );
            }
            ac_KickWithCode(player, "", 0, 12);
            if (ACInfo.get(player.id).acKicked > 0) return false;
          }
        }
      }
      ac_tmp = player.getArmour();
      let ac_armour = ac_tmp < 0 ? Math.ceil(ac_tmp) : Math.floor(ac_tmp);
      if (ACInfo.get(player.id).acSet[2] !== -1) {
        if (ACInfo.get(player.id).acSet[2] > 255) {
          ac_armour +=
            ACInfo.get(player.id).acSet[2] -
            (ACInfo.get(player.id).acSet[2] % 256) -
            256;
          if (ACInfo.get(player.id).acSet[2] - ac_armour > 255)
            ac_armour += 256;
        }
        if (ACInfo.get(player.id).acSet[2] === ac_armour) {
          ACInfo.get(player.id).acSet[2] = -1;
          ACInfo.get(player.id).acCheatCount[9] = 0;
          ACInfo.get(player.id).acDmgRes = false;
        } else if (ac_gtc - ACInfo.get(player.id).acGtc[4] > ac_gpp) {
          if (
            ACInfo.get(player.id).acACAllow[52] &&
            ACInfo.get(player.id).acNOPAllow[5] &&
            ACInfo.get(player.id).acSet[2] < ac_armour
          ) {
            if (
              ++ACInfo.get(player.id).acNOPCount[5] >
              innerACConfig.AC_MAX_NOP_WARNINGS
            ) {
              if (innerACConfig.DEBUG) {
                console.log($t("DEBUG_CODE_5", [player.id, "SetPlayerArmour"]));
                console.log(
                  `[Nex-AC DEBUG] AC armour: ${ACInfo.get(player.id).acSet[2]}, armour: ${ac_armour}`,
                );
              }
              ac_KickWithCode(player, "", 0, 52, 4);
              if (ACInfo.get(player.id).acKicked > 0) return false;
              ACInfo.get(player.id).acSet[2] = -1;
            } else {
              triggerNOPWarning(
                player.id,
                4,
                ACInfo.get(player.id).acNOPCount[5],
              );
            }
          } else if (
            ++ACInfo.get(player.id).acNOPCount[5] >
            innerACConfig.AC_MAX_NOP_WARNINGS
          ) {
            if (ACInfo.get(player.id).acSet[2] > ac_armour) {
              ACInfo.get(player.id).acCheatCount[9] = 0;
              ACInfo.get(player.id).acDmgRes = false;
            }
            ACInfo.get(player.id).acSet[2] = -1;
          }
        }
      } else {
        if (ACInfo.get(player.id).acArmour > 255) {
          ac_armour +=
            ACInfo.get(player.id).acArmour -
            (ACInfo.get(player.id).acArmour % 256) -
            256;
          if (ACInfo.get(player.id).acArmour - ac_armour > 255)
            ac_armour += 256;
        }
        if (
          ACInfo.get(player.id).acACAllow[13] &&
          ac_armour > ACInfo.get(player.id).acArmour
        ) {
          if (
            !innerACConfig.AC_USE_AMMUNATIONS ||
            (innerACConfig.AC_USE_AMMUNATIONS &&
              ac_armour === 100 &&
              ac_InAmmuNation(player, ACInfo.get(player.id).acInt))
          ) {
            ACInfo.get(player.id).acCheatCount[20] = 0;
            if (ACInfo.get(player.id).acSet[10] !== -1)
              ACInfo.get(player.id).acSet[10] += 200;
            else ACInfo.get(player.id).acSet[10] = 200;
            ACInfo.get(player.id).acGtc[17] = ac_gtc + 2650;
          } else {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] AC armour: ${ACInfo.get(player.id).acArmour}, armour: ${ac_armour}`,
              );
            }

            ac_KickWithCode(player, "", 0, 13);
            if (ACInfo.get(player.id).acKicked > 0) return false;

            return ac_KickWithCode(player, "", 0, 13);
          }
        }
      }
      if (
        ac_health < ACInfo.get(player.id).acHealth ||
        ac_armour < ACInfo.get(player.id).acArmour
      ) {
        ACInfo.get(player.id).acDmgRes = ACInfo.get(player.id).acVehDmgRes =
          false;
        ACInfo.get(player.id).acCheatCount[9] = 0;
      } else if (
        ACInfo.get(player.id).acACAllow[19] &&
        ACInfo.get(player.id).acDmgRes &&
        ACInfo.get(player.id).acSet[1] === -1 &&
        ACInfo.get(player.id).acSet[2] === -1 &&
        ac_gtc - ACInfo.get(player.id).acGtc[13] > ac_gpp
      ) {
        ACInfo.get(player.id).acDmgRes = ACInfo.get(player.id).acVehDmgRes =
          false;
        if (
          ++ACInfo.get(player.id).acCheatCount[9] >
          innerACConfig.AC_MAX_GODMODE_WARNINGS
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] AC health: ${ACInfo.get(player.id).acHealth}, health: ${ac_health}, AC armour: ${ACInfo.get(player.id).acArmour}, armour: ${ac_armour}`,
            );
          }
          ac_KickWithCode(player, "", 0, 19);
          if (ACInfo.get(player.id).acKicked > 0) return false;
          ACInfo.get(player.id).acCheatCount[9] = 0;
        } else {
          triggerCheatWarning(
            player,
            "",
            0,
            19,
            0,
            ACInfo.get(player.id).acCheatCount[9],
          );
        }
      }
      if (
        ACInfo.get(player.id).acSet[5] !== -1 &&
        ac_gtc - ACInfo.get(player.id).acGtc[11] > ac_gpp
      ) {
        if (
          ACInfo.get(player.id).acACAllow[52] &&
          ACInfo.get(player.id).acNOPAllow[8]
        ) {
          if (
            ++ACInfo.get(player.id).acNOPCount[8] >
            innerACConfig.AC_MAX_NOP_WARNINGS
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                $t("DEBUG_CODE_5", [player.id, "TogglePlayerSpectating"]),
              );
            }
            ac_KickWithCode(player, "", 0, 52, 6);
            if (ACInfo.get(player.id).acKicked > 0) return false;
            ACInfo.get(player.id).acSet[5] = -1;
          } else {
            triggerNOPWarning(
              player.id,
              6,
              ACInfo.get(player.id).acNOPCount[8],
            );
          }
        } else if (
          ++ACInfo.get(player.id).acNOPCount[8] >
          innerACConfig.AC_MAX_NOP_WARNINGS
        )
          ACInfo.get(player.id).acSet[5] = -1;
      }
      ac_s = player.getVehicleSeat();
      const ac_veh = player.getVehicle();
      const ac_vehId = ac_veh ? ac_veh.id : 0;
      let ac_put = false;
      ac_i = ac_veh ? ac_veh.getModel() : 0;
      if (ACInfo.get(player.id).acSet[8] !== -1) {
        if (
          ACInfo.get(player.id).acSet[8] === ac_vehId &&
          ac_sa !== PlayerStateEnum.ONFOOT &&
          (ACInfo.get(player.id).acSet[4] === ac_s ||
            ACInfo.get(player.id).acSet[4] === -1)
        ) {
          if (
            ACInfo.get(player.id).acACAllow[4] &&
            !ac_IsATrainPartEx(ac_i) &&
            ac_sa === PlayerStateEnum.DRIVER &&
            ACInfo.get(player.id).acVeh !== ac_vehId
          ) {
            let ac_dist = player.getDistanceFromPoint(
              ACVehInfo.get(ac_vehId).acPosX,
              ACVehInfo.get(ac_vehId).acPosY,
              ACVehInfo.get(ac_vehId).acPosZ,
            );
            ac_tmp = player.getDistanceFromPoint(
              ACInfo.get(player.id).acPutPosX,
              ACInfo.get(player.id).acPutPosY,
              ACInfo.get(player.id).acPutPosZ,
            );
            if (ac_tmp < ac_dist) ac_dist = ac_tmp;
            if (ac_dist >= 20.0) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] Veh model: ${ac_i}, veh: ${ac_vehId}, dist: ${ac_dist}`,
                );
              }
              ac_KickWithCode(player, "", 0, 4, 5);
              if (ACInfo.get(player.id).acKicked > 0) return false;
            }
          }
          if (ACInfo.get(player.id).acVeh > 0) {
            let ac_t = ACInfo.get(player.id).acVeh;
            if (ACVehInfo.get(ac_t).acDriver === player.id)
              ACVehInfo.get(ac_t).acDriver = InvalidEnum.PLAYER_ID;
            const ac_t_veh = Vehicle.getInstance(ac_t);
            ac_t = ac_t_veh ? ac_t_veh.getModel() : 0;
            if (ac_t <= 0) ac_t = ACInfo.get(player.id).acLastModel;
            if (
              ac_IsValidVehicleModel(ac_t) &&
              (ac_IsAnAircraft(ac_t) || ac_IsAnAircraftRC(ac_t))
            )
              ACInfo.get(player.id).acParachute = 2;
          }
          if (ac_sa === PlayerStateEnum.DRIVER) {
            ACVehInfo.get(ac_vehId).acDriver = player.id;
            ACVehInfo.get(ac_vehId).acZAngle = ac_veh!.getZAngle();
            ACInfo.get(player.id).acGtc[8] = ac_gtc + 1650;
            ACInfo.get(player.id).acSetVehHealth = -1.0;
            ACInfo.get(player.id).acPosX = ACInfo.get(player.id).acLastPosX =
              ac_pX;
            ACInfo.get(player.id).acPosY = ACInfo.get(player.id).acLastPosY =
              ac_pY;
            ACInfo.get(player.id).acPosZ = ac_pZ;
          }
          ac_put = true;
          ACInfo.get(player.id).acPutPosX = ac_pX;
          ACInfo.get(player.id).acPutPosY = ac_pY;
          ACInfo.get(player.id).acPutPosZ = ac_pZ;
          ACInfo.get(player.id).acEnterVeh = ACInfo.get(
            player.id,
          ).acCheatCount[10] = 0;
          ACInfo.get(player.id).acVehDmgRes = ACInfo.get(player.id).acEnterRes =
            false;
          ACInfo.get(player.id).acEnterSeat =
            ACInfo.get(player.id).acSet[9] =
            ACInfo.get(player.id).acSet[8] =
            ACInfo.get(player.id).acSet[7] =
              -1;
          ACInfo.get(player.id).acSeat = ac_s;
        } else if (ac_gtc - ACInfo.get(player.id).acGtc[1] > ac_gpp) {
          const ac_set8_veh = Vehicle.getInstance(
            ACInfo.get(player.id).acSet[8],
          );
          if (
            ACInfo.get(player.id).acACAllow[52] &&
            ACInfo.get(player.id).acNOPAllow[7] &&
            ACInfo.get(player.id).acSet[4] !== -1 &&
            ACVehInfo.get(ACInfo.get(player.id).acSet[8]).acSpawned &&
            ACVehInfo.get(ACInfo.get(player.id).acSet[8]).acHealth !== 0.0 &&
            (ac_set8_veh ? ac_set8_veh.isStreamedIn(player) : false)
          ) {
            if (
              ++ACInfo.get(player.id).acNOPCount[7] >
              innerACConfig.AC_MAX_NOP_WARNINGS
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  $t("DEBUG_CODE_5", [player.id, "PutPlayerInVehicle"]),
                );
                console.log(
                  `[Nex-AC DEBUG] AC veh: ${ACInfo.get(player.id).acSet[8]}, veh: ${ac_vehId}, AC seat: ${ACInfo.get(player.id).acSet[4]}, seatId: ${ac_s}`,
                );
              }
              ac_KickWithCode(player, "", 0, 52, 9);
              if (ACInfo.get(player.id).acKicked > 0) return false;
              ACInfo.get(player.id).acSet[8] = -1;
            } else {
              triggerNOPWarning(player, 9, ACInfo.get(player.id).acNOPCount[7]);
            }
          } else if (
            ++ACInfo.get(player.id).acNOPCount[7] >
            innerACConfig.AC_MAX_NOP_WARNINGS
          )
            ACInfo.get(player.id).acSet[8] = -1;
        }
      }
      if (!ac_put) {
        let ac_dist_set = 25000.0;
        if (ACInfo.get(player.id).acSet[7] !== -1) {
          ac_dist_set = player.getDistanceFromPoint(
            ACInfo.get(player.id).acSetPosX,
            ACInfo.get(player.id).acSetPosY,
            ACInfo.get(player.id).acTpToZ
              ? ac_pZ
              : ACInfo.get(player.id).acSetPosZ,
          );
          if (
            ac_dist_set < 15.0 &&
            (ACInfo.get(player.id).acSet[7] === 3 ||
              ac_sa === PlayerStateEnum.ONFOOT)
          ) {
            ACInfo.get(player.id).acSet[7] = -1;
            ACInfo.get(player.id).acCheatCount[1] =
              ACInfo.get(player.id).acCheatCount[2] =
              ACInfo.get(player.id).acGtc[10] =
                0;
            ACInfo.get(player.id).acPosX = ACInfo.get(player.id).acLastPosX =
              ac_pX;
            ACInfo.get(player.id).acPosY = ACInfo.get(player.id).acLastPosY =
              ac_pY;
            ACInfo.get(player.id).acPosZ = ac_pZ;
          } else if (ac_gtc - ACInfo.get(player.id).acGtc[10] > ac_gpp) {
            if (
              ACInfo.get(player.id).acACAllow[52] &&
              ACInfo.get(player.id).acNOPAllow[10]
            ) {
              if (
                ++ACInfo.get(player.id).acNOPCount[10] >
                innerACConfig.AC_MAX_NOP_WARNINGS
              ) {
                if (innerACConfig.DEBUG) {
                  console.log($t("DEBUG_CODE_5", [player.id, "SetPlayerPos"]));
                  console.log(
                    `[Nex-AC DEBUG] Dist: ${ac_dist_set}, acSet[7]: ${ACInfo.get(player.id).acSet[7]}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 52, 10);
                if (ACInfo.get(player.id).acKicked > 0) return false;
                ACInfo.get(player.id).acSet[7] = -1;
              } else {
                triggerNOPWarning(
                  player,
                  10,
                  ACInfo.get(player.id).acNOPCount[10],
                );
              }
            } else if (
              ++ACInfo.get(player.id).acNOPCount[10] >
              innerACConfig.AC_MAX_NOP_WARNINGS
            ) {
              ACInfo.get(player.id).acSet[7] = -1;
            }
          }
        }
        const ac_dist = player.getDistanceFromPoint(
          ACInfo.get(player.id).acPosX,
          ACInfo.get(player.id).acPosY,
          ACInfo.get(player.id).acPosZ,
        );
        if (ac_vehId > 0 && ac_sa !== PlayerStateEnum.ONFOOT) {
          if (ACInfo.get(player.id).acVeh > 0) {
            if (ACInfo.get(player.id).acVeh !== ac_vehId) {
              if (ACInfo.get(player.id).acACAllow[4]) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC DEBUG] AC veh: ${ACInfo.get(player.id).acVeh}, veh: ${ac_vehId}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 4, 2);
                if (ACInfo.get(player.id).acKicked > 0) return false;
              }
            } else if (
              ACInfo.get(player.id).acACAllow[50] &&
              ACInfo.get(player.id).acSeat !== ac_s
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] AC seat: ${ACInfo.get(player.id).acSeat}, seatId: ${ac_s}, veh model: ${ac_i}, veh: ${ac_vehId}`,
                );
              }
              ac_KickWithCode(player, "", 0, 50);
              if (ACInfo.get(player.id).acKicked > 0) return false;
            }
          }
          const { x: ac_vX, y: ac_vY, z: ac_vZ } = ac_veh!.getVelocity();
          const ac_vsp = ac_GetSpeed(ac_vX, ac_vY, ac_vZ);
          if (
            ACInfo.get(player.id).acSet[9] !== -1 &&
            ac_gtc - ACInfo.get(player.id).acGtc[7] > ac_gpp
          ) {
            if (
              ACInfo.get(player.id).acACAllow[52] &&
              ACInfo.get(player.id).acNOPAllow[11]
            ) {
              if (ac_vsp > 25) ACInfo.get(player.id).acGtc[7] = ac_gtc + 2650;
              else {
                if (innerACConfig.DEBUG) {
                  console.log(
                    $t("DEBUG_CODE_5", [player.id, "RemovePlayerFromVehicle"]),
                  );
                  console.log(
                    `[Nex-AC DEBUG] Veh model: ${ac_i}, veh: ${ac_vehId}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 52, 8);
                if (ACInfo.get(player.id).acKicked > 0) return false;
                ACInfo.get(player.id).acSet[9] = -1;
              }
            } else ACInfo.get(player.id).acSet[9] = -1;
          }
          if (ac_sa === PlayerStateEnum.DRIVER) {
            if (
              ACInfo.get(player.id).acACAllow[32] &&
              ACVehInfo.get(ac_vehId).acDriver !== player.id &&
              ACVehInfo.get(ac_vehId).acDriver !== InvalidEnum.PLAYER_ID
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] AC driver: ${ACVehInfo.get(ac_vehId).acDriver}, driver: ${player.id}, veh: ${ac_vehId}`,
                );
              }

              ac_KickWithCode(player, "", 0, 32, 1);

              player.clearAnimations(true);
              return false;
            }
            const ac_vHealth = ac_veh!.getHealth();
            if (ACInfo.get(player.id).acSetVehHealth !== -1.0) {
              if (ACInfo.get(player.id).acSetVehHealth === ac_vHealth) {
                ACInfo.get(player.id).acSetVehHealth = -1.0;
                ACInfo.get(player.id).acCheatCount[10] = 0;
                ACInfo.get(player.id).acVehDmgRes = false;
              } else if (ac_gtc - ACInfo.get(player.id).acGtc[3] > ac_gpp) {
                if (
                  ACInfo.get(player.id).acACAllow[52] &&
                  ACInfo.get(player.id).acNOPAllow[4] &&
                  ACInfo.get(player.id).acSetVehHealth < ac_vHealth
                ) {
                  if (
                    ++ACInfo.get(player.id).acNOPCount[4] >
                    innerACConfig.AC_MAX_NOP_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        $t("DEBUG_CODE_5", [player.id, "SetVehicleHealth"]),
                      );
                      console.log(
                        `[Nex-AC DEBUG] AC veh health: ${ACInfo.get(player.id).acSetVehHealth}, veh health: ${ac_vHealth}, veh: ${ac_vehId}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 52, 11);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acSetVehHealth = -1.0;
                  } else {
                    triggerNOPWarning(
                      player.id,
                      11,
                      ACInfo.get(player.id).acNOPCount[4],
                    );
                  }
                } else if (
                  ++ACInfo.get(player.id).acNOPCount[4] >
                  innerACConfig.AC_MAX_NOP_WARNINGS
                ) {
                  if (ACInfo.get(player.id).acSetVehHealth > ac_vHealth) {
                    ACInfo.get(player.id).acCheatCount[10] = 0;
                    ACInfo.get(player.id).acVehDmgRes = false;
                  }
                  ACInfo.get(player.id).acSetVehHealth = -1.0;
                }
              }
            } else if (
              ACInfo.get(player.id).acACAllow[11] &&
              (!ac_IsValidFloat(ac_vHealth) ||
                (ac_vHealth > ACVehInfo.get(ac_vehId).acHealth &&
                  !ACInfo.get(player.id).acModShop &&
                  ac_vHealth))
            ) {
              if (
                !innerACConfig.AC_USE_PAYNSPRAY ||
                (innerACConfig.AC_USE_PAYNSPRAY &&
                  !ac_InPayNSpray(
                    ACInfo.get(player.id).acInt,
                    ac_pX,
                    ac_pY,
                    ac_pZ,
                  ))
              ) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC DEBUG] AC veh health: ${ACVehInfo.get(ac_vehId).acHealth}, veh health: ${ac_vHealth}, veh: ${ac_vehId}, playerId: ${player.id}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 11);
                if (ACInfo.get(player.id).acKicked > 0) return false;
                ac_veh!.setHealth(
                  ACVehInfo.get(ac_vehId).acHealth < 0
                    ? Math.ceil(ACVehInfo.get(ac_vehId).acHealth)
                    : Math.floor(ACVehInfo.get(ac_vehId).acHealth),
                );
              }
            }
            if (ACInfo.get(player.id).acVehDmgRes) {
              if (ac_vHealth < ACVehInfo.get(ac_vehId).acHealth) {
                ACInfo.get(player.id).acDmgRes = ACInfo.get(
                  player.id,
                ).acVehDmgRes = false;
                ACInfo.get(player.id).acCheatCount[10] = 0;
              } else if (
                ACInfo.get(player.id).acACAllow[20] &&
                ACInfo.get(player.id).acSetVehHealth === -1.0 &&
                ac_gtc - ACInfo.get(player.id).acGtc[14] > ac_gpp
              ) {
                ACInfo.get(player.id).acDmgRes = ACInfo.get(
                  player.id,
                ).acVehDmgRes = false;
                if (
                  ++ACInfo.get(player.id).acCheatCount[10] >
                  innerACConfig.AC_MAX_GODMODE_VEH_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] AC veh health: ${ACVehInfo.get(ac_vehId).acHealth}, veh health: ${ac_vHealth}, veh: ${ac_vehId}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 20);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[10] = 0;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    20,
                    0,
                    ACInfo.get(player.id).acCheatCount[10],
                  );
                }
              }
            }
            if (ac_dist > 0.8) {
              if (
                ac_dist >= 80.0 &&
                ac_dist - ACVehInfo.get(ac_vehId).acPosDiff >
                  (ac_dist / 2.6) * 1.8 &&
                ac_dist_set >= 80.0 &&
                ac_dist_set - ACVehInfo.get(ac_vehId).acPosDiff >
                  (ac_dist_set / 2.6) * 1.8
              ) {
                if (
                  ACInfo.get(player.id).acACAllow[3] &&
                  ac_gtc - ACInfo.get(player.id).acGtc[19] > ac_gpp &&
                  (ACInfo.get(player.id).acPosZ >= -90.0 ||
                    ac_pZ - ACInfo.get(player.id).acPosZ < 40.0 ||
                    ac_GetVectorDist(
                      ac_pX - ACInfo.get(player.id).acPosX,
                      ac_pY - ACInfo.get(player.id).acPosY,
                    ) >= 180.0 ||
                    ++ACInfo.get(player.id).acCheatCount[19] >
                      innerACConfig.AC_MAX_TELEPORT_GLITCH_WARNINGS)
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Dist: ${ac_dist}, dist set: ${ac_dist_set}, old pos diff: ${ACVehInfo.get(ac_vehId).acPosDiff}, speed: ${ac_vsp}, veh: ${ac_vehId}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 3, 2);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[19] = 0;
                }
                ACInfo.get(player.id).acLastPosX = ac_pX;
                ACInfo.get(player.id).acLastPosY = ac_pY;
              } else if (
                ac_vsp < 12 &&
                ac_gtc - ACInfo.get(player.id).acSetPosTick > ac_gpp
              ) {
                if (ac_dist >= 40.0 && ac_dist_set >= 40.0) {
                  if (ACInfo.get(player.id).acACAllow[3]) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Speed: ${ac_vsp}, dist: ${ac_dist}, dist set: ${ac_dist_set}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 3, 4);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                  }
                } else if (ACInfo.get(player.id).acACAllow[1]) {
                  if (
                    ++ACInfo.get(player.id).acCheatCount[2] >
                    innerACConfig.AC_MAX_AIR_VEH_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Speed: ${ac_vsp}, dist: ${ac_dist}, veh: ${ac_vehId}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 1, 1);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acCheatCount[2] = 0;
                  } else {
                    triggerCheatWarning(
                      player,
                      "",
                      0,
                      1,
                      1,
                      ACInfo.get(player.id).acCheatCount[2],
                    );
                  }
                }
              }
            }
            const ac_spDiff = ac_vsp - ACVehInfo.get(ac_vehId).acSpeed;
            const ac_zAngle = ac_veh!.getZAngle();
            if (ac_gtc - ACInfo.get(player.id).acGtc[8] > ac_gpp) {
              if (ACInfo.get(player.id).acACAllow[10]) {
                if (ac_spDiff > 220 || ac_vsp > 620) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Speed: ${ac_vsp}, old speed: ${ACVehInfo.get(ac_vehId).acSpeed}, veh model: ${ac_i}, veh: ${ac_vehId}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 10, 3);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                } else if (
                  ac_spDiff >= 20 &&
                  ACVehInfo.get(ac_vehId).acSpeedDiff <= ac_spDiff &&
                  ACVehInfo.get(ac_vehId).acHealth <= ac_vHealth &&
                  !(
                    ac_IsValidVehicleModel(ac_i) &&
                    ((ac_spDiff < 65 &&
                      (ac_i === 432 || ac_IsATrainLoco(ac_i))) ||
                      (ac_spDiff < 45 &&
                        ac_IsABmx(ac_i) &&
                        Math.abs(ac_vX) <= 0.76 &&
                        Math.abs(ac_vY) <= 0.76 &&
                        Math.abs(ac_vZ) <= 0.76) ||
                      (!ac_IsATrainLoco(ac_i) &&
                        !ac_IsABmx(ac_i) &&
                        ACVehInfo.get(ac_vehId).acHealth < 250.0))
                  )
                ) {
                  ACInfo.get(player.id).acCheatCount[14] +=
                    1 * innerACConfig.AC_SPEEDHACK_VEH_RESET_DELAY;
                  if (
                    ACInfo.get(player.id).acCheatCount[14] >
                    innerACConfig.AC_MAX_SPEEDHACK_VEH_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Speed: ${ac_vsp}, old speed: ${ACVehInfo.get(ac_vehId).acSpeed}, veh model: ${ac_i}, veh: ${ac_vehId}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 10, 1);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acCheatCount[14] = 0;
                  } else {
                    triggerCheatWarning(
                      player,
                      "",
                      0,
                      10,
                      1,
                      Math.round(
                        ACInfo.get(player.id).acCheatCount[14] /
                          innerACConfig.AC_SPEEDHACK_VEH_RESET_DELAY,
                      ),
                    );
                  }
                }
              }
              if (
                ACInfo.get(player.id).acACAllow[25] &&
                ac_vsp > 15 &&
                Math.abs(ac_spDiff) < 25 &&
                Math.round(
                  Math.abs(ac_zAngle - ACVehInfo.get(ac_vehId).acZAngle),
                ) === 180 &&
                ac_vX < 0.0 !== ACVehInfo.get(ac_vehId).acVelX < 0.0 &&
                ac_vY < 0.0 !== ACVehInfo.get(ac_vehId).acVelY < 0.0 &&
                ac_vZ < 0.0 !== ACVehInfo.get(ac_vehId).acVelZ < 0.0
              ) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC DEBUG] Speed: ${ac_vsp}, speed diff: ${ac_spDiff}, z angle: ${ac_zAngle}, old z angle: ${ACVehInfo.get(ac_vehId).acZAngle}, veh: ${ac_vehId}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 25);
                if (ACInfo.get(player.id).acKicked > 0) return false;
              }
              if (ac_IsAnAircraftEx(ac_i)) {
                if (
                  ACInfo.get(player.id).acACAllow[10] &&
                  (ac_sa = ac_GetSpeed(ac_vX, ac_vY)) > 270
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Speed (x, y): ${ac_sa}, veh model: ${ac_i}, veh: ${ac_vehId}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 10, 2);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                }
              } else if (ACInfo.get(player.id).acACAllow[8]) {
                ac_tmp = ac_pZ - ACInfo.get(player.id).acPosZ;
                if (
                  (ac_vZ >= 0.1 &&
                    ac_vZ > ACVehInfo.get(ac_vehId).acVelZ &&
                    Math.abs(ACInfo.get(player.id).acPosX - ac_pX) <
                      ac_tmp / 2.0 &&
                    Math.abs(ACInfo.get(player.id).acPosY - ac_pY) <
                      ac_tmp / 2.0) ||
                  (ac_vZ >= 0.0 && ac_tmp <= -1.0) ||
                  (ac_vZ <= 0.0 && ac_tmp >= 1.0)
                ) {
                  if (
                    ++ACInfo.get(player.id).acCheatCount[3] >
                    (ac_IsABmxEx(ac_i)
                      ? innerACConfig.AC_MAX_FLYHACK_BIKE_WARNINGS
                      : innerACConfig.AC_MAX_FLYHACK_VEH_WARNINGS)
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Vel z: ${ac_vZ}, old vel z: ${ACVehInfo.get(ac_vehId).acVelZ}, pos diff x, y, z: ${ACInfo.get(player.id).acPosX - ac_pX}, ${ACInfo.get(player.id).acPosY - ac_pY}, ${ac_tmp}, veh: ${ac_vehId}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 8, 1);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acCheatCount[3] = 0;
                  } else {
                    triggerCheatWarning(
                      player,
                      "",
                      0,
                      8,
                      1,
                      ACInfo.get(player.id).acCheatCount[3],
                    );
                  }
                }
              }
              ACVehInfo.get(ac_vehId).acSpeedDiff = ac_spDiff;
            } else if (
              ACInfo.get(player.id).acACAllow[10] &&
              ACVehInfo.get(ac_vehId).acSpeed < ac_vsp &&
              (ac_spDiff > 220 || ac_vsp > 620)
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] Speed: ${ac_vsp}, old speed: ${ACVehInfo.get(ac_vehId).acSpeed}, veh model: ${ac_i}, veh: ${ac_vehId}`,
                );
              }
              ac_KickWithCode(player, "", 0, 10, 5);
              if (ACInfo.get(player.id).acKicked > 0) return false;
            }
            ACVehInfo.get(ac_vehId).acPosX = ac_pX;
            ACVehInfo.get(ac_vehId).acPosY = ac_pY;
            ACVehInfo.get(ac_vehId).acPosZ = ac_pZ;
            ACVehInfo.get(ac_vehId).acVelX = ac_vX;
            ACVehInfo.get(ac_vehId).acVelY = ac_vY;
            ACVehInfo.get(ac_vehId).acVelZ = ac_vZ;
            ACVehInfo.get(ac_vehId).acSpeed = ac_vsp;
            ACVehInfo.get(ac_vehId).acPosDiff = ac_dist;
            if (ACInfo.get(player.id).acSetVehHealth === -1.0)
              ACVehInfo.get(ac_vehId).acHealth = ac_vHealth;
            ACVehInfo.get(ac_vehId).acZAngle = ac_zAngle;
            ACInfo.get(player.id).acSpeed = ac_vsp;
          }
          ACInfo.get(player.id).acSeat = ac_s;
        } else {
          const { x: ac_vX, y: ac_vY, z: ac_vZ } = player.getVelocity();
          ac_s = ac_GetSpeed(ac_vX, ac_vY, ac_vZ);
          const ac_specAct = player.getSpecialAction();
          ac_sa = player.getAnimationIndex();
          if (ACInfo.get(player.id).acAnim === ac_sa) {
            if (ACInfo.get(player.id).acACAllow[7]) {
              if (
                (ac_sa >= 156 && ac_sa <= 162) ||
                (ac_sa >= 1055 && ac_sa <= 1059)
              ) {
                if (
                  ++ACInfo.get(player.id).acCheatCount[13] >
                  innerACConfig.AC_MAX_FLYHACK_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Anim: ${ac_sa}, old anim: ${ACInfo.get(player.id).acAnim}, old veh: ${ACInfo.get(player.id).acVeh}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 7, 2);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[13] = 0;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    7,
                    2,
                    ACInfo.get(player.id).acCheatCount[13],
                  );
                }
              } else if (
                ac_sa >= 1538 &&
                ac_sa <= 1544 &&
                ac_s > 42 &&
                ACInfo.get(player.id).acSpeed < ac_s
              ) {
                if (
                  ++ACInfo.get(player.id).acCheatCount[13] >
                  innerACConfig.AC_MAX_FLYHACK_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Speed: ${ac_s}, old speed: ${ACInfo.get(player.id).acSpeed}, anim: ${ac_sa}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 7, 3);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[13] = 0;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    7,
                    3,
                    ACInfo.get(player.id).acCheatCount[13],
                  );
                }
              } else if (ac_gtc - ACInfo.get(player.id).acGtc[9] > ac_gpp) {
                ac_tmp = ac_GetVectorDist(ac_vX, ac_vY);
                if (
                  ac_sa >= 958 &&
                  ac_sa <= 979 &&
                  (ac_vZ > 0.1 || ac_tmp > 0.9)
                ) {
                  if (
                    ++ACInfo.get(player.id).acCheatCount[13] >
                    innerACConfig.AC_MAX_FLYHACK_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Anim: ${ac_sa}, old anim: ${ACInfo.get(player.id).acAnim}, weaponId: ${ac_w}, spec act: ${ac_specAct}, vel x, y: ${ac_tmp}, vel z: ${ac_vZ}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 7, 1);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acCheatCount[13] = 0;
                  } else {
                    triggerCheatWarning(
                      player,
                      "",
                      0,
                      7,
                      1,
                      ACInfo.get(player.id).acCheatCount[13],
                    );
                  }
                } else ACInfo.get(player.id).acCheatCount[13] = 0;
              }
            }
            if (
              ACInfo.get(player.id).acACAllow[30] &&
              !innerGameModeConfig.ac_PedAnims
            ) {
              ac_i = player.getSkin();
              if (
                (ac_sa === 1231 || ac_sa === 1246) &&
                ac_w !== WeaponEnum.PARACHUTE &&
                ac_IsValidSkin(ac_i) &&
                ac_i !== 0
              ) {
                if (
                  ++ACInfo.get(player.id).acCheatCount[17] >
                  innerACConfig.AC_MAX_CJ_RUN_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Skin: ${ac_i}, old anim: ${ACInfo.get(player.id).acAnim}, weaponId: ${ac_w}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 30);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[17] = 0;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    30,
                    0,
                    ACInfo.get(player.id).acCheatCount[17],
                  );
                }
              } else ACInfo.get(player.id).acCheatCount[17] = 0;
            }
          } else if (ACInfo.get(player.id).acACAllow[24] && ac_sa === -1) {
            ac_KickWithCode(player, "", 0, 24);
            if (ACInfo.get(player.id).acKicked > 0) return false;
          }
          if (ACInfo.get(player.id).acSet[3] !== -1) {
            if (ac_specAct === ACInfo.get(player.id).acSet[3]) {
              ACInfo.get(player.id).acSet[3] = -1;
            } else if (ac_gtc - ACInfo.get(player.id).acGtc[5] > ac_gpp) {
              if (
                ACInfo.get(player.id).acACAllow[52] &&
                ACInfo.get(player.id).acNOPAllow[6] &&
                ac_specAct !== SpecialActionsEnum.DUCK &&
                !(
                  ac_specAct >= SpecialActionsEnum.ENTER_VEHICLE &&
                  ac_specAct <= SpecialActionsEnum.EXIT_VEHICLE
                )
              ) {
                if (
                  ++ACInfo.get(player.id).acNOPCount[6] >
                  innerACConfig.AC_MAX_NOP_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      $t("DEBUG_CODE_5", [player.id, "SetPlayerSpecialAction"]),
                    );
                    console.log(
                      `[Nex-AC DEBUG] AC spec act: ${ACInfo.get(player.id).acSet[3]}, spec act: ${ac_specAct}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 52, 12);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acSet[3] = -1;
                } else {
                  triggerNOPWarning(
                    player,
                    12,
                    ACInfo.get(player.id).acNOPCount[6],
                  );
                }
              } else if (
                ++ACInfo.get(player.id).acNOPCount[6] >
                innerACConfig.AC_MAX_NOP_WARNINGS
              ) {
                ACInfo.get(player.id).acSet[3] = -1;
              }
            }
          } else if (ac_specAct !== ACInfo.get(player.id).acSpecAct) {
            if (
              ACInfo.get(player.id).acSpecAct === SpecialActionsEnum.USEJETPACK
            ) {
              ACInfo.get(player.id).acDropJpX = ACInfo.get(player.id).acPosX;
              ACInfo.get(player.id).acDropJpY = ACInfo.get(player.id).acPosY;
            }
            if (ac_specAct === ACInfo.get(player.id).acNextSpecAct)
              ACInfo.get(player.id).acNextSpecAct = -1;
            else if (ACInfo.get(player.id).acACAllow[18]) {
              switch (ac_specAct) {
                case SpecialActionsEnum.NONE: {
                  switch (ACInfo.get(player.id).acSpecAct) {
                    case (SpecialActionsEnum.USECELLPHONE, 24, 25): {
                      ac_KickWithCode(player, "", 0, 18, 1);
                      if (ACInfo.get(player.id).acKicked > 0) return false;
                      break;
                    }
                  }
                  break;
                }
                case SpecialActionsEnum.DUCK: {
                  if (
                    ACInfo.get(player.id).acSpecAct > SpecialActionsEnum.NONE &&
                    !(
                      ACInfo.get(player.id).acSpecAct >=
                        SpecialActionsEnum.ENTER_VEHICLE &&
                      ACInfo.get(player.id).acSpecAct <=
                        SpecialActionsEnum.EXIT_VEHICLE
                    ) &&
                    !(
                      ACInfo.get(player.id).acSpecAct >=
                        SpecialActionsEnum.DRINK_BEER &&
                      ACInfo.get(player.id).acSpecAct <= 25
                    )
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] AC spec act: ${ACInfo.get(player.id).acSpecAct}, spec act: ${ac_specAct}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 18, 2);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                  }
                  break;
                }
                case SpecialActionsEnum.USEJETPACK: {
                  if (
                    (ac_tmp = player.getDistanceFromPoint(
                      ACInfo.get(player.id).acDropJpX,
                      ACInfo.get(player.id).acDropJpY,
                      ac_pZ,
                    )) >= 15.0
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] AC spec act: ${ACInfo.get(player.id).acSpecAct}, spec act: ${ac_specAct}, dist: ${ac_tmp}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 18, 3);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                  } else
                    ACInfo.get(player.id).acNextSpecAct = ACInfo.get(
                      player.id,
                    ).acSpecAct;
                  ACInfo.get(player.id).acDropJpX = ACInfo.get(
                    player.id,
                  ).acDropJpY = 25000.0;
                  break;
                }
                case SpecialActionsEnum.ENTER_VEHICLE: {
                  if (
                    [
                      SpecialActionsEnum.DANCE1,
                      SpecialActionsEnum.DANCE2,
                      SpecialActionsEnum.DANCE3,
                      SpecialActionsEnum.DANCE4,
                      SpecialActionsEnum.USECELLPHONE,
                      68,
                    ].includes(ACInfo.get(player.id).acSpecAct)
                  ) {
                    ac_KickWithCode(player, "", 0, 18, 4);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                  }
                  break;
                }
                default: {
                  if (
                    !(
                      ((ac_specAct >= SpecialActionsEnum.DRINK_BEER &&
                        ac_specAct <= 25 &&
                        ACInfo.get(player.id).acSpecAct ===
                          SpecialActionsEnum.DUCK) ||
                        ACInfo.get(player.id).acSpecAct ===
                          SpecialActionsEnum.ENTER_VEHICLE) &&
                      ac_specAct === ACInfo.get(player.id).acLastSpecAct
                    ) &&
                    ((ACInfo.get(player.id).acVeh === 0 &&
                      (ac_specAct !== SpecialActionsEnum.EXIT_VEHICLE ||
                        ac_gtc - ACInfo.get(player.id).acGtc[15] > 1350)) ||
                      (ac_specAct !== SpecialActionsEnum.EXIT_VEHICLE &&
                        !(ac_specAct >= 24 && ac_specAct <= 25) &&
                        ac_specAct !== SpecialActionsEnum.USECELLPHONE))
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] AC spec act: ${ACInfo.get(player.id).acSpecAct}, spec act: ${ac_specAct}, last spec act: ${ACInfo.get(player.id).acLastSpecAct}, old veh: ${ACInfo.get(player.id).acVeh}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 18, 5);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                  }
                }
              }
            }
            ACInfo.get(player.id).acLastSpecAct = ACInfo.get(
              player.id,
            ).acSpecAct;
          }
          const ac_a1 = player.getSurfingVehicle();
          if (
            (ac_a1 ? !ac_a1.isStreamedIn(player) : true) &&
            !player.getSurfingObject() &&
            !player.getSurfingPlayerObject()
          ) {
            if (ac_dist > 0.8) {
              if (ac_dist >= 40.0 && ac_dist_set >= 40.0) {
                if (
                  ACInfo.get(player.id).acACAllow[2] &&
                  !ACInfo.get(player.id).acIntEnterExits &&
                  (ACInfo.get(player.id).acPosZ >= -90.0 ||
                    ac_pZ - ACInfo.get(player.id).acPosZ < 40.0 ||
                    ac_GetVectorDist(
                      ac_pX - ACInfo.get(player.id).acPosX,
                      ac_pY - ACInfo.get(player.id).acPosY,
                    ) >= 180.0 ||
                    ++ACInfo.get(player.id).acCheatCount[19] >
                      innerACConfig.AC_MAX_TELEPORT_GLITCH_WARNINGS)
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Dist: ${ac_dist}, dist set: ${ac_dist_set}, speed: ${ac_s}, pos x, y, z: ${ac_pX}, ${ac_pY}, ${ac_pZ}, old pos x, y, z: ${ACInfo.get(player.id).acPosX}, ${ACInfo.get(player.id).acPosY}, ${ACInfo.get(player.id).acPosZ}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 2, 2);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[19] = 0;
                }
                ACInfo.get(player.id).acLastPosX = ac_pX;
                ACInfo.get(player.id).acLastPosY = ac_pY;
              } else if (
                ac_s < ac_dist * (ac_dist < 1.0 ? 12.0 : 5.0) &&
                ac_gtc - ACInfo.get(player.id).acSetPosTick > ac_gpp
              ) {
                if (
                  ac_s < 3 &&
                  ((ac_dist >= 30.0 && ac_dist_set >= 30.0) ||
                    (ac_dist >= 20.0 &&
                      ac_dist_set >= 20.0 &&
                      ac_gtc - ACInfo.get(player.id).acUpdateTick < 1500))
                ) {
                  if (ACInfo.get(player.id).acACAllow[2]) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Speed: ${ac_s}, dist: ${ac_dist}, dist set: ${ac_dist_set}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 2, 3);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                  }
                } else if (
                  ACInfo.get(player.id).acACAllow[0] &&
                  (ac_s >= 3.0 || ac_dist >= 3.0)
                ) {
                  if (
                    ++ACInfo.get(player.id).acCheatCount[1] >
                    innerACConfig.AC_MAX_AIR_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG)
                      console.log(
                        `[Nex-AC DEBUG] Speed: ${ac_s}, dist: ${ac_dist}`,
                      );
                  }
                  ac_KickWithCode(player, "", 0, 0);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[1] = 0;
                } else {
                  triggerNOPWarning(
                    player,
                    "",
                    0,
                    0,
                    0,
                    ACInfo.get(player.id).acCheatCount[1],
                  );
                }
              }
            }
            if (ACInfo.get(player.id).acACAllow[9]) {
              if (ACInfo.get(player.id).acSpeed < ac_s && ac_s > 518) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC DEBUG] Speed: ${ac_s}, old speed: ${ACInfo.get(player.id).acSpeed}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 9, 1);
                if (ACInfo.get(player.id).acKicked > 0) return false;
              } else if (ac_gtc - ACInfo.get(player.id).acGtc[9] > ac_gpp) {
                ac_i = ac_GetSpeed(ac_vX, ac_vY);
                ac_tmp = ac_pZ - ACInfo.get(player.id).acPosZ;
                if (
                  (ac_s >= 258 ||
                    ac_i > 182 ||
                    (Math.abs(ac_vZ) > 1.0 && Math.abs(ac_tmp) < 1.0)) &&
                  ACInfo.get(player.id).acHealth <= ac_health
                ) {
                  if (
                    ++ACInfo.get(player.id).acCheatCount[15] >
                    innerACConfig.AC_MAX_SPEEDHACK_WARNINGS
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Speed: ${ac_s}, speed x, y: ${ac_i}, vel z: ${ac_vZ}, pos diff z: ${ac_tmp}, old speed: ${ACInfo.get(player.id).acSpeed}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 9, 2);
                    if (ACInfo.get(player.id).acKicked > 0) return false;
                    ACInfo.get(player.id).acCheatCount[15] = 0;
                  } else {
                    triggerCheatWarning(
                      player,
                      "",
                      0,
                      9,
                      2,
                      ACInfo.get(player.id).acCheatCount[15],
                    );
                  }
                } else ACInfo.get(player.id).acCheatCount[15] = 0;
              }
            }
            if (ac_gtc - ACInfo.get(player.id).acGtc[9] > ac_gpp)
              ACInfo.get(player.id).acSpeed = ac_s;
            else {
              if (ACInfo.get(player.id).acACAllow[9]) {
                if (ac_a1 && ac_a1.id !== InvalidEnum.VEHICLE_ID) {
                  const { x: ac_vX, y: ac_vY, z: ac_vZ } = ac_a1.getVelocity();
                  ac_i = ac_GetSpeed(ac_vX, ac_vY, ac_vZ);
                  if (ac_s - ac_i > 220) {
                    if (
                      ac_s - ac_i > 620 ||
                      ++ACInfo.get(player.id).acCheatCount[15] >
                        innerACConfig.AC_MAX_SPEEDHACK_WARNINGS
                    ) {
                      if (innerACConfig.DEBUG) {
                        console.log(
                          `[Nex-AC DEBUG] Speed: ${ac_s}, old speed: ${ACInfo.get(player.id).acSpeed}, veh model: ${ac_a1.getModel()}, veh speed: ${ac_i}`,
                        );
                      }
                      ac_KickWithCode(player, "", 0, 9, 3);
                      if (ACInfo.get(player.id).acKicked > 0) return false;
                      ACInfo.get(player.id).acCheatCount[15] = 0;
                    } else {
                      triggerCheatWarning(
                        player,
                        "",
                        0,
                        9,
                        3,
                        ACInfo.get(player.id).acCheatCount[15],
                      );
                    }
                  } else ACInfo.get(player.id).acCheatCount[15] = 0;
                } else if (ACInfo.get(player.id).acSpeed < ac_s && ac_s > 518) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Speed: ${ac_s}, old speed: ${ACInfo.get(player.id).acSpeed}`,
                    );
                  }

                  ac_KickWithCode(player, "", 0, 9, 4);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                }
              }
              ACInfo.get(player.id).acSpeed = ac_s;
            }
            ACInfo.get(player.id).acSpecAct = ac_specAct;
            ACInfo.get(player.id).acAnim = ac_sa;
          }
          ACInfo.get(player.id).acPosX = ac_pX;
          ACInfo.get(player.id).acPosY = ac_pY;
          ACInfo.get(player.id).acPosZ = ac_pZ;
        }
        ACInfo.get(player.id).acVeh = ac_vehId;
        ACInfo.get(player.id).acHealth = ac_health;
        ACInfo.get(player.id).acArmour = ac_armour;
        if (ac_gtc - ACInfo.get(player.id).acGtc[6] > ac_gpp)
          ACInfo.get(player.id).acHoldWeapon = ac_w;
        ACInfo.get(player.id).acLastWeapon = ac_w;
      }
    }
    ACInfo.get(player.id).acUpdateTick = ac_gtc;
    const ac_ret = next();
    if (
      ACInfo.get(player.id).acACAllow[33] &&
      !ACInfo.get(player.id).acUnFrozen
    )
      return false;
    return ac_ret;
  }
  return next();
});
