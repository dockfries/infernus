import {
  BulletHitTypesEnum,
  InvalidEnum,
  LimitsEnum,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  SpecialActionsEnum,
  Vehicle,
  VehicleModelInfoEnum,
  WeaponEnum,
  WeaponStatesEnum,
} from "@infernus/core";
import { ACInfo, ACVehInfo } from "../../struct";
import {
  ac_GetVectorDist,
  ac_InAmmuNation,
  ac_InCasino,
  ac_InRestaurant,
  ac_IsBulletWeapon,
} from "../../functions";
import { innerGameModeConfig, innerACConfig } from "../../config";
import { ac_KickWithCode, triggerCheatWarning } from "../trigger";
import { ac_wMinRange, ac_wSlot } from "../../constants";

PlayerEvent.onWeaponShot(
  ({ player, weapon, hitType, hitId, fX, fY, fZ, next }) => {
    if (ACInfo.get(player.id).acKicked > 0 || ACInfo.get(player.id).acDead)
      return false;
    if (
      ACInfo.get(player.id).acACAllow[22] &&
      !innerGameModeConfig.ac_LagCompMode
    ) {
      ac_KickWithCode(player, "", 0, 22);
      return false;
    }
    if (
      ACInfo.get(player.id).acACAllow[47] &&
      (!(
        hitType >= BulletHitTypesEnum.NONE &&
        hitType <= BulletHitTypesEnum.PLAYER_OBJECT
      ) ||
        (hitType === BulletHitTypesEnum.PLAYER &&
          !(hitId >= 0 && hitId < LimitsEnum.MAX_PLAYERS)) ||
        (hitType === BulletHitTypesEnum.VEHICLE &&
          !(hitId >= 1 && hitId < LimitsEnum.MAX_VEHICLES)) ||
        (hitType === BulletHitTypesEnum.OBJECT &&
          !(hitId >= 1 && hitId < LimitsEnum.MAX_OBJECTS)) ||
        (hitType === BulletHitTypesEnum.PLAYER_OBJECT &&
          !(hitId >= 1 && hitId < LimitsEnum.MAX_OBJECTS)) ||
        !ac_IsBulletWeapon(weapon))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] HitType: ${hitType}, hitId: ${hitId}, weaponId: ${weapon}`,
        );
      }
      return ac_KickWithCode(player, "", 0, 47, 1);
    }
    const {
      fOriginX: ac_oX,
      fOriginY: ac_oY,
      fOriginZ: ac_oZ,
      fHitPosX: ac_hX,
      fHitPosY: ac_hY,
      fHitPosZ: ac_hZ,
    } = player.getLastShotVectors();
    if (ACInfo.get(player.id).acACAllow[34]) {
      const ac_zDiff = Math.abs(ACInfo.get(player.id).acPosZ - ac_oZ),
        ac_dist = player.getDistanceFromPoint(ac_oX, ac_oY, ac_oZ);

      const surfingVehicle = player.getSurfingVehicle();
      const surfingObject = player.getSurfingObject();
      const surfingPlayerObject = player.getSurfingPlayerObject();

      if (
        ac_dist >= 80.0 ||
        ac_zDiff >= 15.0 ||
        ((ac_dist >= 15.0 || ac_zDiff >= 5.0) &&
          ACInfo.get(player.id).acVeh === 0 &&
          (!surfingVehicle || !surfingVehicle.isStreamedIn(player)) &&
          (!surfingObject || surfingObject.id === InvalidEnum.OBJECT_ID) &&
          (!surfingPlayerObject ||
            surfingPlayerObject.id === InvalidEnum.OBJECT_ID))
      ) {
        if (
          ++ACInfo.get(player.id).acCheatCount[5] >
          innerACConfig.AC_MAX_AFK_GHOST_WARNINGS
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] WeaponId: ${weapon}, origin dist: ${ac_dist}, pZ: ${ACInfo.get(player.id).acPosZ}, oZ: ${ac_oZ}`,
            );
          }
          ac_KickWithCode(player, "", 0, 34);
          if (ACInfo.get(player.id).acKicked > 0) return false;
          ACInfo.get(player.id).acCheatCount[5] = 0;
        } else {
          triggerCheatWarning(
            player,
            "",
            0,
            34,
            0,
            ACInfo.get(player.id).acCheatCount[5],
          );
        }
      }
    } else ACInfo.get(player.id).acCheatCount[5] = 0;

    const ac_gtc = Date.now(),
      ac_gpp = player.getPing();
    if (ACInfo.get(player.id).acACAllow[29]) {
      if (hitType > BulletHitTypesEnum.NONE) {
        if (
          (fX === 0.0 && fY === 0.0 && fZ === 0.0) ||
          (ac_oX === ac_hX && ac_oY === ac_hY) ||
          ac_oX === ACInfo.get(player.id).acPosX ||
          ac_oY === ACInfo.get(player.id).acPosY ||
          ac_oZ === ACInfo.get(player.id).acPosZ
        ) {
          if (
            ++ACInfo.get(player.id).acCheatCount[11] >
            innerACConfig.AC_MAX_SILENT_AIM_WARNINGS
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] HitType: ${hitType}, weaponId: ${weapon}, pZ: ${ACInfo.get(player.id).acPosZ}, oZ: ${ac_oZ}, fX, fY, fZ: ${fX}, ${fY}, ${fZ}`,
              );
            }
            ac_KickWithCode(player, "", 0, 29, 1);
            if (ACInfo.get(player.id).acKicked > 0) return false;
            ACInfo.get(player.id).acCheatCount[11] = 0;
          } else {
            triggerCheatWarning(
              player,
              "",
              0,
              29,
              1,
              ACInfo.get(player.id).acCheatCount[11],
            );
          }
        }
      } else {
        if (
          hitType === BulletHitTypesEnum.PLAYER &&
          hitId !== InvalidEnum.PLAYER_ID
        ) {
          const hitPlayer = Player.getInstance(hitId)!;

          if (!ACInfo.get(hitId).acDead) {
            if (
              ac_gtc - ACInfo.get(hitId).acSetPosTick > ac_gpp &&
              ac_gtc - ACInfo.get(hitId).acUpdateTick < 1500
            ) {
              const ac_dist = hitPlayer.getDistanceFromPoint(
                ac_hX,
                ac_hY,
                ac_hZ,
              );

              const surfingVehicle = hitPlayer.getSurfingVehicle();
              const surfingObject = hitPlayer.getSurfingObject();
              const surfingPlayerObject = hitPlayer.getSurfingPlayerObject();

              if (
                ac_dist >= 50.0 ||
                (ac_dist >= 20.0 &&
                  ACInfo.get(hitId).acVeh === 0 &&
                  (!surfingVehicle ||
                    !surfingVehicle.isStreamedIn(hitPlayer)) &&
                  (!surfingObject ||
                    surfingObject.id === InvalidEnum.OBJECT_ID) &&
                  (!surfingPlayerObject ||
                    surfingPlayerObject.id === InvalidEnum.OBJECT_ID))
              ) {
                if (
                  ++ACInfo.get(player.id).acCheatCount[6] >
                  innerACConfig.AC_MAX_PRO_AIM_WARNINGS
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] WeaponId: ${weapon}, hit dist: ${ac_dist}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 29, 2);
                  if (ACInfo.get(player.id).acKicked > 0) return false;
                  ACInfo.get(player.id).acCheatCount[6] = 0;
                } else {
                  triggerCheatWarning(
                    player,
                    "",
                    0,
                    29,
                    2,
                    ACInfo.get(player.id).acCheatCount[6],
                  );
                }
              } else ACInfo.get(player.id).acCheatCount[6] = 0;
            }
          }
        }
        ACInfo.get(player.id).acCheatCount[11] = 0;
      }
    } else ACInfo.get(player.id).acCheatCount[11] = 0;

    let ac_i = 0,
      ac_t = 0,
      ac_ur = false,
      ac_ur2 = false;
    switch (hitType) {
      case BulletHitTypesEnum.PLAYER: {
        if (
          hitId !== InvalidEnum.PLAYER_ID &&
          ACInfo.get(hitId).acACAllow[19] &&
          ACInfo.get(hitId).acUnFrozen
        ) {
          const hitPlayer = Player.getInstance(hitId)!;
          if (
            (innerACConfig.AC_USE_NPC &&
              !hitPlayer.isNpc() &&
              !ACInfo.get(hitId).acDead) ||
            !ACInfo.get(hitId).acDead
          ) {
            if (
              ac_gtc - ACInfo.get(hitId).acSetPosTick > ac_gpp &&
              hitPlayer.isInRangeOfPoint(
                ac_wMinRange[weapon - 22],
                ac_oX,
                ac_oY,
                ac_oZ,
              ) &&
              !(
                ACInfo.get(hitId).acSpecAct >=
                  SpecialActionsEnum.ENTER_VEHICLE &&
                ACInfo.get(hitId).acSpecAct <= SpecialActionsEnum.EXIT_VEHICLE
              )
            ) {
              ac_t = player.getTeam();
              if (
                ac_t === InvalidEnum.NO_TEAM ||
                ac_t !== hitPlayer.getTeam()
              ) {
                if (
                  !innerACConfig.AC_USE_RESTAURANTS ||
                  (innerACConfig.AC_USE_RESTAURANTS &&
                    !ac_InRestaurant(hitPlayer, ACInfo.get(hitId).acInt))
                ) {
                  if (
                    !innerACConfig.AC_USE_AMMUNATIONS ||
                    (innerACConfig.AC_USE_AMMUNATIONS &&
                      !ac_InAmmuNation(hitPlayer, ACInfo.get(hitId).acInt))
                  ) {
                    if (
                      !innerACConfig.AC_USE_CASINOS ||
                      (innerACConfig.AC_USE_CASINOS &&
                        !ac_InCasino(hitPlayer, ACInfo.get(hitId).acInt))
                    ) {
                      ac_ur = true;
                    }
                  }
                }
              }
            }
          }
        }
        break;
      }
      case BulletHitTypesEnum.VEHICLE: {
        if (hitId !== InvalidEnum.VEHICLE_ID) {
          ac_i = ACVehInfo.get(hitId).acDriver;
          if (
            !innerACConfig.AC_USE_NPC ||
            (innerACConfig.AC_USE_NPC &&
              ac_i !== InvalidEnum.PLAYER_ID &&
              !Player.getInstance(ac_i)!.isNpc())
          ) {
            if (
              ACInfo.get(ac_i).acACAllow[20] &&
              ACInfo.get(ac_i).acUnFrozen &&
              ACVehInfo.get(hitId).acHealth >= 250.0 &&
              ac_gtc - ACInfo.get(ac_i).acSetPosTick > ac_gpp
            ) {
              ac_t = player.getTeam();
              if (
                !innerGameModeConfig.ac_VehFriendlyFire ||
                ac_t === InvalidEnum.NO_TEAM ||
                ac_t !== Player.getInstance(ac_i)!.getTeam()
              ) {
                ac_t = Vehicle.getInstance(hitId)!.getModel();
                const {
                  x: ac_hX,
                  y: ac_hY,
                  z: ac_hZ,
                } = Vehicle.getModelInfo(
                  ac_t,
                  VehicleModelInfoEnum.WHEELSFRONT,
                );
                const {
                  x: ac_oX,
                  y: ac_oY,
                  z: ac_oZ,
                } = Vehicle.getModelInfo(ac_t, VehicleModelInfoEnum.WHEELSREAR);
                const {
                  x: ac_wX,
                  y: ac_wY,
                  z: ac_wZ,
                } = Vehicle.getModelInfo(ac_t, VehicleModelInfoEnum.WHEELSMID);
                if (
                  ac_GetVectorDist(ac_hX - fX, ac_hY - fY, ac_hZ - fZ) > 1.2 &&
                  ac_GetVectorDist(-ac_hX - fX, ac_hY - fY, ac_hZ - fZ) > 1.2 &&
                  ac_GetVectorDist(ac_oX - fX, ac_oY - fY, ac_oZ - fZ) > 1.2 &&
                  ac_GetVectorDist(-ac_oX - fX, ac_oY - fY, ac_oZ - fZ) > 1.2 &&
                  ((ac_wX === 0.0 && ac_wY === 0.0 && ac_wZ === 0.0) ||
                    (ac_GetVectorDist(ac_wX - fX, ac_wY - fY, ac_wZ - fZ) >
                      1.2 &&
                      ac_GetVectorDist(-ac_wX - fX, ac_wY - fY, ac_wZ - fZ) >
                        1.2))
                )
                  ac_ur2 = true;
              }
            }
          }
        }
        break;
      }
    }
    const ac_s = ac_wSlot[weapon];
    ac_t = player.getState();
    if (ACInfo.get(player.id).acACAllow[47]) {
      if (ac_t === PlayerStateEnum.DRIVER) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] WeaponId: ${weapon}, state: ${ac_t}, veh model: ${Vehicle.getInstance(ACInfo.get(player.id).acVeh)!.getModel()}, veh: ${ACInfo.get(player.id).acVeh}`,
          );
        }
        return ac_KickWithCode(player, "", 0, 47, 6);
      } else {
        if (
          (ACInfo.get(player.id).acLastWeapon !== weapon &&
            ac_t !== PlayerStateEnum.PASSENGER) ||
          (ACInfo.get(player.id).acWeapon[ac_s] !== weapon &&
            ACInfo.get(player.id).acSetWeapon[ac_s] !== weapon)
        ) {
          if (
            ++ACInfo.get(player.id).acCheatCount[16] >
            innerACConfig.AC_MAX_FAKE_WEAPON_WARNINGS
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] Armed weapon: ${ACInfo.get(player.id).acLastWeapon}, AC weapon: ${ACInfo.get(player.id).acWeapon[ac_s]}, weaponId: ${weapon}, state: ${ac_t}`,
              );
            }
            ac_KickWithCode(player, "", 0, 47, 2);
            ACInfo.get(player.id).acCheatCount[16] = 0;
          } else {
            triggerCheatWarning(
              player,
              "",
              0,
              47,
              2,
              ACInfo.get(player.id).acCheatCount[16],
            );
          }
          return false;
        } else ACInfo.get(player.id).acCheatCount[16] = 0;
      }
    }
    if (ACInfo.get(player.id).acACAllow[26]) {
      ac_i = ac_gtc - ACInfo.get(player.id).acShotTick;
      if (ACInfo.get(player.id).acShotWeapon === weapon) {
        if (
          weapon !== WeaponEnum.MINIGUN &&
          ac_t !== PlayerStateEnum.PASSENGER
        ) {
          if (ac_gtc - ACInfo.get(player.id).acReloadTick < 110) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] WeaponId: ${weapon}, reload time: ${ac_gtc - ACInfo.get(player.id).acReloadTick}, state: ${ac_t}`,
              );
            }

            ac_KickWithCode(player, "", 0, 26, 4);
            if (ACInfo.get(player.id).acKicked > 0) return false;
            ACInfo.get(player.id).acReloadTick = 0;
          } else if (ac_i < 30 || (ac_i < 50 && ac_s !== 4)) {
            if (
              ++ACInfo.get(player.id).acCheatCount[8] >
              innerACConfig.AC_MAX_RAPID_FIRE_WARNINGS
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] Fire rate: ${ac_i}, weaponId: ${weapon}`,
                );
              }
              ac_KickWithCode(player, "", 0, 26, 1);
              if (ACInfo.get(player.id).acKicked > 0) return false;
              ACInfo.get(player.id).acCheatCount[8] = 0;
            } else {
              triggerCheatWarning(
                player,
                "",
                0,
                26,
                1,
                ACInfo.get(player.id).acCheatCount[8],
              );
            }
          }
        } else ACInfo.get(player.id).acCheatCount[8] = 0;
        if (
          (weapon === 24 && ac_i < 240) ||
          (weapon === 25 && ac_i < 480) ||
          (weapon >= 33 && weapon <= 34 && ac_i < 380)
        ) {
          if (
            ++ACInfo.get(player.id).acCheatCount[12] >
            innerACConfig.AC_MAX_AUTO_C_WARNINGS
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] Fire rate: ${ac_i}, weaponId: ${weapon}`,
              );
            }

            ac_KickWithCode(player, "", 0, 26, 2);
            if (ACInfo.get(player.id).acKicked > 0) return false;
            ACInfo.get(player.id).acCheatCount[12] = 0;
          } else {
            triggerCheatWarning(
              player,
              "",
              0,
              26,
              2,
              ACInfo.get(player.id).acCheatCount[12],
            );
          }
        }
      }
    } else if (ac_i < 30) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Fire rate: ${ac_i}, weaponId: ${weapon}, last weapon: ${ACInfo.get(player.id).acShotWeapon}`,
        );
      }

      ac_KickWithCode(player, "", 0, 26, 3);
      if (ACInfo.get(player.id).acKicked > 0) return false;
    }
    if (player.getWeaponState() === WeaponStatesEnum.LAST_BULLET)
      ACInfo.get(player.id).acReloadTick = ac_gtc;

    if (
      ACInfo.get(player.id).acACAllow[17] &&
      ac_t !== PlayerStateEnum.PASSENGER &&
      ACInfo.get(player.id).acGiveAmmo[ac_s] === -65535 &&
      ac_gtc - ACInfo.get(player.id).acGtc[6] > ac_gpp
    ) {
      ac_t = player.getAmmo();
      if (ACInfo.get(player.id).acAmmo[ac_s] === 0) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] WeaponId: ${weapon}, AC ammo: ${ACInfo.get(player.id).acAmmo[ac_s]}, ammo: ${ac_t}`,
          );
        }

        ac_KickWithCode(player, "", 0, 17, 1);
        if (ACInfo.get(player.id).acKicked > 0) return false;
        ACInfo.get(player.id).acAmmo[ac_s] = ac_t;
      }
      if (ACInfo.get(player.id).acAmmo[ac_s] < ac_t) {
        if (weapon === WeaponEnum.MINIGUN) {
          if (++ACInfo.get(player.id).acCheatCount[7] > 9) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] WeaponId: ${weapon}, AC ammo: ${ACInfo.get(player.id).acAmmo[ac_s]}, ammo: ${ac_t}, acCheatCount[7]: ${ACInfo.get(player.id).acCheatCount[7]}`,
              );
            }
            ac_KickWithCode(player, "", 0, 17, 2);
            if (ACInfo.get(player.id).acKicked > 0) return false;
            ACInfo.get(player.id).acCheatCount[7] = 0;
            ACInfo.get(player.id).acAmmo[ac_s] = ac_t;
          } else {
            triggerCheatWarning(
              player,
              "",
              0,
              17,
              2,
              ACInfo.get(player.id).acCheatCount[7],
            );
          }
        }
      } else if (ac_t - ACInfo.get(player.id).acAmmo[ac_s] > 6) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] WeaponId: ${weapon}, AC ammo: ${ACInfo.get(player.id).acAmmo[ac_s]}, ammo: ${ac_t}`,
          );
        }

        ac_KickWithCode(player, "", 0, 17, 3);
        if (ACInfo.get(player.id).acKicked > 0) return false;
        ACInfo.get(player.id).acCheatCount[7] = 0;
        ACInfo.get(player.id).acAmmo[ac_s] = ac_t;
      }
    } else ACInfo.get(player.id).acCheatCount[7] = 0;

    if (ACInfo.get(player.id).acAmmo[ac_s] !== 0)
      ACInfo.get(player.id).acAmmo[ac_s]--;
    if (ACInfo.get(player.id).acAmmo[ac_s] < -32768)
      ACInfo.get(player.id).acAmmo[ac_s] += 65536;
    ACInfo.get(player.id).acShotWeapon = weapon;
    ACInfo.get(player.id).acShotTick = ac_gtc;

    const ac_ret = next();
    if (!ac_ret) return ac_ret;

    if (
      ACInfo.get(player.id).acACAllow[33] &&
      !ACInfo.get(player.id).acUnFrozen
    )
      return false;
    if (ac_ur) {
      ACInfo.get(hitId).acDmgRes = true;
      ACInfo.get(hitId).acGtc[13] = ac_gtc + 165;
    }
    if (ac_ur2) {
      ac_t = ACVehInfo.get(hitId).acDriver;
      if (ac_t !== InvalidEnum.PLAYER_ID) {
        ACInfo.get(ac_t).acVehDmgRes = true;
        ACInfo.get(ac_t).acGtc[14] = ac_gtc + 165;
      }
    }
    return ac_ret;
  },
);
