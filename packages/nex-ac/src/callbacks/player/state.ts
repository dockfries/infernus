import {
  InvalidEnum,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  Vehicle,
} from "@infernus/core";
import { ACInfo, ACVehInfo } from "../../struct";
import {
  ac_GetMaxPassengers,
  ac_GetVectorDist,
  ac_IsABikeEx,
  ac_IsABoatEx,
  ac_IsABusEx,
  ac_IsAnAircraftEx,
  ac_IsARemoteControlEx,
  ac_IsATrainPartEx,
} from "../../functions";
import { innerACConfig } from "../../config";
import { ac_Mtfc } from "../../constants";
import { ac_FloodDetect, ac_KickWithCode } from "../trigger";

PlayerEvent.onStateChange(({ player, newState, oldState, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    let ac_s = player.getPing();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[11] < ac_Mtfc[11][0]) {
        if (
          newState !== PlayerStateEnum.ONFOOT ||
          oldState !== PlayerStateEnum.SPAWNED
        ) {
          let ac_model = 0;
          if (oldState === PlayerStateEnum.DRIVER) {
            const ac_model_veh = Vehicle.getInstance(
              ACInfo.get(player.id).acVeh,
            );
            ac_model = ac_model_veh ? ac_model_veh.getModel() : 0;
          } else if (newState === PlayerStateEnum.DRIVER)
            ac_model = player.getVehicle()!.getModel();
          if (ac_model !== 570 && !ac_IsABoatEx(ac_model))
            ac_FloodDetect(player, 11);
        }
      } else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[11] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[11] =
      ac_gtc;
    switch (oldState) {
      case PlayerStateEnum.NONE:
      case PlayerStateEnum.WASTED: {
        if (
          ACInfo.get(player.id).acACAllow[48] &&
          !(
            newState >= PlayerStateEnum.SPAWNED &&
            newState <= PlayerStateEnum.SPECTATING
          )
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] NewState: ${newState}, oldState: ${oldState}`,
            );
          }
          ac_KickWithCode(player, "", 0, 48, 2);
        }
        break;
      }
      case PlayerStateEnum.DRIVER: {
        let ac_t = ACInfo.get(player.id).acVeh;
        if (ACVehInfo.get(ac_t).acDriver === player.id)
          ACVehInfo.get(ac_t).acDriver = InvalidEnum.PLAYER_ID;
        const ac_t_veh = Vehicle.getInstance(ac_t);
        ac_t = ac_t_veh ? ac_t_veh.getModel() : 0;
        if (ac_t <= 0) ac_t = ACInfo.get(player.id).acLastModel;
        if (
          ACInfo.get(player.id).acHealth >= 1 &&
          ACInfo.get(player.id).acHealth < 5 &&
          ac_IsABikeEx(ac_t)
        )
          ACInfo.get(player.id).acHealth = 5;
        ACInfo.get(player.id).acCheatCount[13] = 0;
        if (
          ACInfo.get(player.id).acACAllow[2] &&
          newState === PlayerStateEnum.ONFOOT
        ) {
          let ac_dist = 0;
          const pos = player.getPos();
          const { x: ac_x, y: ac_y } = pos;
          let ac_z = pos.z;
          ac_dist = player.getDistanceFromPoint(
            ACInfo.get(player.id).acSetPosX,
            ACInfo.get(player.id).acSetPosY,
            ACInfo.get(player.id).acTpToZ
              ? ac_z
              : ACInfo.get(player.id).acSetPosZ,
          );
          if (
            (ACInfo.get(player.id).acSet[7] === -1 || ac_dist >= 15.0) &&
            (ac_IsARemoteControlEx(ac_t) ||
              ACInfo.get(player.id).acPosZ >= -90.0 ||
              ac_z - ACInfo.get(player.id).acPosZ < 40.0 ||
              ac_GetVectorDist(
                ac_x - ACInfo.get(player.id).acPosX,
                ac_y - ACInfo.get(player.id).acPosY,
              ) >= 180.0)
          ) {
            if (!ac_IsARemoteControlEx(ac_t)) {
              if (!ac_IsAnAircraftEx(ac_t)) ac_z = ACInfo.get(player.id).acPosZ;
              ac_dist = player.getDistanceFromPoint(
                ACInfo.get(player.id).acPosX,
                ACInfo.get(player.id).acPosY,
                ac_z,
              );
            } else
              ac_dist = player.getDistanceFromPoint(
                ACInfo.get(player.id).acPutPosX,
                ACInfo.get(player.id).acPutPosY,
                ACInfo.get(player.id).acPutPosZ,
              );
            if (ac_dist >= 50.0) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] Veh model: ${ac_t}, veh: ${ACInfo.get(player.id).acVeh}, dist: ${ac_dist}`,
                );
              }
              ac_KickWithCode(player, "", 0, 2, 4);
            }
          }
        }
        ACInfo.get(player.id).acSpeed += 20;
        if (ACInfo.get(player.id).acSet[7] === 3)
          ACInfo.get(player.id).acSet[7] = -1;
        ACInfo.get(player.id).acGtc[15] = ACInfo.get(player.id).acGtc[9] =
          ac_gtc + 1650;
        break;
      }
      case PlayerStateEnum.PASSENGER: {
        const ac_t = ACInfo.get(player.id).acVeh;
        ACInfo.get(player.id).acCheatCount[13] = 0;
        if (
          ACInfo.get(player.id).acACAllow[2] &&
          newState === PlayerStateEnum.ONFOOT
        ) {
          let ac_dist = 0;
          const { x: ac_x, y: ac_y, z: ac_z } = player.getPos();
          ac_dist = player.getDistanceFromPoint(
            ACInfo.get(player.id).acSetPosX,
            ACInfo.get(player.id).acSetPosY,
            ACInfo.get(player.id).acTpToZ
              ? ac_z
              : ACInfo.get(player.id).acSetPosZ,
          );
          if (
            (ACInfo.get(player.id).acSet[7] === -1 || ac_dist >= 15.0) &&
            (ac_GetVectorDist(
              ac_x - ACInfo.get(player.id).acPosX,
              ac_y - ACInfo.get(player.id).acPosY,
            ) >= 180.0 ||
              ACInfo.get(player.id).acPosZ >= -90.0 ||
              ac_z - ACInfo.get(player.id).acPosZ < 40.0)
          ) {
            ac_s = ACVehInfo.get(ac_t).acDriver;
            ac_dist = player.getDistanceFromPoint(
              ACInfo.get(player.id).acPosX,
              ACInfo.get(player.id).acPosY,
              ACInfo.get(player.id).acPosZ,
            );
            const ac_model_veh = Vehicle.getInstance(ac_t);
            let ac_model = ac_model_veh ? ac_model_veh.getModel() : 0;
            if (ac_model <= 0) ac_model = ACInfo.get(player.id).acLastModel;
            if (
              ac_dist >= 180.0 ||
              (ac_dist >= 50.0 &&
                (ac_s === InvalidEnum.PLAYER_ID ||
                  ac_gtc - ACInfo.get(ac_s).acUpdateTick < 2000) &&
                !ac_IsATrainPartEx(ac_model))
            ) {
              if (innerACConfig.DEBUG) {
                if (ac_s === InvalidEnum.PLAYER_ID)
                  console.log(
                    `[Nex-AC DEBUG] Veh model: ${ac_model}, veh: ${ac_t}, dist: ${ac_dist}`,
                  );
                else
                  console.log(
                    `[Nex-AC DEBUG] Veh model: ${ac_model}, veh: ${ac_t}, driver AFK time: ${ac_gtc - ACInfo.get(ac_s).acUpdateTick}, dist: ${ac_dist}`,
                  );
              }
              ac_KickWithCode(player, "", 0, 2, 5);
            }
          }
        }
        ACInfo.get(player.id).acSpeed += 20;
        ACInfo.get(player.id).acGtc[15] = ACInfo.get(player.id).acGtc[9] =
          ac_gtc + 1650;
        break;
      }
      case PlayerStateEnum.SPECTATING: {
        if (
          ACInfo.get(player.id).acACAllow[48] &&
          !(
            newState >= PlayerStateEnum.WASTED &&
            newState <= PlayerStateEnum.SPAWNED
          ) &&
          ac_gtc - ACInfo.get(player.id).acGtc[16] > ac_s
        ) {
          if (innerACConfig.DEBUG) {
            console.log(`[Nex-AC DEBUG] NewState: ${newState}`);
          }
          ac_KickWithCode(player, "", 0, 48, 3);
        }
      }
    }
    switch (newState) {
      case PlayerStateEnum.ONFOOT: {
        ACInfo.get(player.id).acSet[9] = -1;
        ACInfo.get(player.id).acCheatCount[12] = 0;
        ACInfo.get(player.id).acEnterRes = false;
        if (
          oldState >= PlayerStateEnum.DRIVER &&
          oldState <= PlayerStateEnum.PASSENGER
        ) {
          ACInfo.get(player.id).acLastModel = 0;
          const pos = player.getPos();
          ACInfo.get(player.id).acPosX = pos.x;
          ACInfo.get(player.id).acPosY = pos.y;
          ACInfo.get(player.id).acPosZ = pos.z;
          ACInfo.get(player.id).acLastPosX = ACInfo.get(player.id).acPosX;
          ACInfo.get(player.id).acLastPosY = ACInfo.get(player.id).acPosY;
        } else {
          ACInfo.get(player.id).acEnterSeat = -1;
          ACInfo.get(player.id).acEnterVeh = 0;
        }
        break;
      }
      case PlayerStateEnum.DRIVER:
      case PlayerStateEnum.PASSENGER: {
        ACInfo.get(player.id).acSet[9] = -1;
        const ac_vehId = player.getVehicle()!.id,
          ac_seat = player.getVehicleSeat();
        ac_s = player.getVehicle()!.getModel();
        if (ac_s <= 0) {
          if (ACInfo.get(player.id).acACAllow[44]) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, seatId: ${ac_seat}`,
              );
            }
            ac_KickWithCode(player, "", 0, 44, 2);
          }
        } else if (ACInfo.get(player.id).acSet[8] !== ac_vehId) {
          if (ACInfo.get(player.id).acACAllow[44]) {
            const ac_maxSeats = ac_GetMaxPassengers(ac_s);
            if (newState === PlayerStateEnum.DRIVER) {
              if (ac_seat !== 0 || ac_maxSeats === 15) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, seatId: ${ac_seat}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 44, 3);
              }
            } else if (
              ac_seat < 1 ||
              ac_maxSeats === 15 ||
              (ac_seat > ac_maxSeats && !ac_IsABusEx(ac_s) && ac_s !== 570)
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, max seats: ${ac_maxSeats}, seatId: ${ac_seat}`,
                );
              }
              ac_KickWithCode(player, "", 0, 44, 4);
            }
          }
          if (
            ACInfo.get(player.id).acACAllow[4] &&
            !ACInfo.get(player.id).acSpec
          ) {
            if (
              ACInfo.get(player.id).acEnterVeh !== ac_vehId ||
              (ACInfo.get(player.id).acEnterSeat !== -1 &&
                ACInfo.get(player.id).acEnterSeat !== ac_seat) ||
              ac_gtc - ACInfo.get(player.id).acEnterVehTick <
                (ac_IsABikeEx(ac_s) ? 100 : 300)
            ) {
              if (innerACConfig.DEBUG) {
                console.log(
                  `[Nex-AC DEBUG] Entered veh: ${ACInfo.get(player.id).acEnterVeh}, veh: ${ac_vehId}, entered seat: ${ACInfo.get(player.id).acEnterSeat}, seat: ${ac_seat}, veh model: ${ac_s}, enter time: ${ac_gtc - ACInfo.get(player.id).acEnterVehTick}`,
                );
              }
              ac_KickWithCode(player, "", 0, 4, 1);
            } else {
              let ac_dist = player.getDistanceFromPoint(
                ACInfo.get(player.id).acPosX,
                ACInfo.get(player.id).acPosY,
                ACInfo.get(player.id).acPosZ,
              );
              if (newState === PlayerStateEnum.DRIVER) {
                if (
                  ac_dist >= 30.0 ||
                  (ac_dist >= 20.0 &&
                    ac_s !== 553 &&
                    ac_s !== 577 &&
                    ac_s !== 592)
                ) {
                  if (innerACConfig.DEBUG) {
                    console.log(
                      `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, dist: ${ac_dist}`,
                    );
                  }
                  ac_KickWithCode(player, "", 0, 4, 3);
                }
              } else if (
                ac_dist >= 80.0 ||
                (ac_dist >= 30.0 &&
                  ac_gtc - ACInfo.get(player.id).acUpdateTick >= 1500)
              ) {
                if (innerACConfig.DEBUG) {
                  console.log(
                    `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, AFK time: ${ac_gtc - ACInfo.get(player.id).acUpdateTick}, dist: ${ac_dist}`,
                  );
                }
                ac_KickWithCode(player, "", 0, 4, 4);
              }

              if (
                ACInfo.get(player.id).acKicked < 1 &&
                !ACInfo.get(player.id).acEnterRes &&
                !ac_IsATrainPartEx(ac_s)
              ) {
                ac_dist = player.getDistanceFromPoint(
                  ACVehInfo.get(ac_vehId).acPosX,
                  ACVehInfo.get(ac_vehId).acPosY,
                  ACVehInfo.get(ac_vehId).acPosZ,
                );
                if (newState === PlayerStateEnum.DRIVER) {
                  if (
                    ac_dist >= 30.0 ||
                    (ac_dist >= 20.0 &&
                      ac_s !== 553 &&
                      ac_s !== 577 &&
                      ac_s !== 592)
                  ) {
                    if (innerACConfig.DEBUG) {
                      console.log(
                        `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, dist: ${ac_dist}`,
                      );
                    }
                    ac_KickWithCode(player, "", 0, 4, 6);
                  }
                } else if (
                  ac_dist >= 80.0 ||
                  (ac_dist >= 30.0 &&
                    ac_gtc - ACInfo.get(player.id).acUpdateTick >= 1500)
                ) {
                  if (innerACConfig.DEBUG)
                    console.log(
                      `[Nex-AC DEBUG] Veh model: ${ac_s}, veh: ${ac_vehId}, AFK time: ${ac_gtc - ACInfo.get(player.id).acUpdateTick}, dist: ${ac_dist}`,
                    );
                }
                ac_KickWithCode(player, "", 0, 4, 7);
              }
            }
          }
        }
        if (
          newState === PlayerStateEnum.DRIVER &&
          ACInfo.get(player.id).acKicked < 1
        ) {
          ac_s = ACVehInfo.get(ac_vehId).acDriver;
          if (
            ac_s !== InvalidEnum.PLAYER_ID &&
            ACInfo.get(ac_s).acACAllow[32] &&
            ac_s !== player.id
          ) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] AC driver: ${player.id}, driver:${ac_s}, veh: ${ac_vehId}`,
              );
            }
            ac_KickWithCode(Player.getInstance(ac_s)!, "", 0, 32, 2);
            Player.getInstance(ac_s)!.clearAnimations(true);
          }
          ACVehInfo.get(ac_vehId).acDriver = player.id;
          const pos = player.getPos();
          ACInfo.get(player.id).acPosX = pos.x;
          ACInfo.get(player.id).acPosY = pos.y;
          ACInfo.get(player.id).acPosZ = pos.z;

          ACInfo.get(player.id).acLastPosX = ACInfo.get(player.id).acPosX;
          ACInfo.get(player.id).acLastPosY = ACInfo.get(player.id).acPosY;
          ACInfo.get(player.id).acSetVehHealth = -1.0;
          ACInfo.get(player.id).acCheatCount[10] = 0;
          ACInfo.get(player.id).acVehDmgRes = false;
        }
        ACInfo.get(player.id).acEnterSeat = -1;
        ACInfo.get(player.id).acEnterRes = false;
        ACInfo.get(player.id).acEnterVeh = 0;
        break;
      }
      case PlayerStateEnum.SPAWNED: {
        const spawnInfo = player.getSpawnInfo();
        ACInfo.get(player.id).acPosX = spawnInfo.spawnX;
        ACInfo.get(player.id).acPosY = spawnInfo.spawnY;
        ACInfo.get(player.id).acPosZ = spawnInfo.spawnZ;
        ACInfo.get(player.id).acLastPosX = ACInfo.get(player.id).acPosX;
        ACInfo.get(player.id).acLastPosY = ACInfo.get(player.id).acPosY;
        break;
      }
      case PlayerStateEnum.SPECTATING: {
        if (
          ACInfo.get(player.id).acACAllow[21] &&
          !ACInfo.get(player.id).acSpec &&
          ACInfo.get(player.id).acSet[5] === -1
        )
          ac_KickWithCode(player, "", 0, 21);
        if (ACInfo.get(player.id).acKicked < 1) {
          ACInfo.get(player.id).acHealth = 100;
          ACInfo.get(player.id).acSet[5] = -1;
          ACInfo.get(player.id).acSpec = true;
        }
        break;
      }
    }
    return next();
  }
});
