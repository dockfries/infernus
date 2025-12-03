import {
  DynamicPickup,
  DynamicPickupEvent,
  E_STREAMER,
  LimitsEnum,
  PickUpEvent,
  SpecialActionsEnum,
  Streamer,
  StreamerItemTypes,
} from "@infernus/core";
import { ACInfo, ACPickInfo } from "../struct";
import { ac_Mtfc, ac_pAmmo, ac_wSlot } from "../constants";
import { ac_FloodDetect, ac_KickWithCode } from "./trigger";
import { innerACConfig } from "../config";
import { ac_GetVectorDist, ac_IsAmmoSharingInSlot } from "../functions";

DynamicPickupEvent.onPlayerPickUp(({ pickup, player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return 0;
  let ac_i = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_i - ACInfo.get(player.id).acCall[8] < ac_Mtfc[8][0])
      ac_FloodDetect(player, 8);
    else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[8] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  if (ACInfo.get(player.id).acACAllow[6]) {
    const { distance: ac_dist } = Streamer.getDistanceToItem(
      ACInfo.get(player.id).acPosX,
      ACInfo.get(player.id).acPosY,
      ACInfo.get(player.id).acPosZ,
      StreamerItemTypes.PICKUP,
      pickup.id,
    );
    if (ac_dist >= 15.0) {
      const { distance: ac_dist_set } = Streamer.getDistanceToItem(
        ACInfo.get(player.id).acSetPosX,
        ACInfo.get(player.id).acSetPosY,
        ACInfo.get(player.id).acTpToZ
          ? ACInfo.get(player.id).acPosZ
          : ACInfo.get(player.id).acSetPosZ,
        StreamerItemTypes.PICKUP,
        pickup.id,
      );
      if (ACInfo.get(player.id).acSet[7] === -1 || ac_dist_set >= 15.0) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC debug] Dyn pickupid: ${pickup.id}, dist: ${ac_dist}, dist set: ${ac_dist_set}, acSet[7]: ${ACInfo.get(player.id).acSet[7]}, playerid: ${player.id}`,
          );
        }
        ac_KickWithCode(player, "", 0, 6, 2);
        return 0;
      }
    }
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[8] = ac_i;
  if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
    switch (
      (ac_i = Streamer.getIntData(
        StreamerItemTypes.PICKUP,
        pickup.id,
        E_STREAMER.EXTRA_ID,
      ))
    ) {
      case 1: {
        ACInfo.get(player.id).acSpecAct = SpecialActionsEnum.USEJETPACK;
        break;
      }
      case 2: {
        if (ACInfo.get(player.id).acHealth < 100)
          ACInfo.get(player.id).acHealth = 100;
        break;
      }
      case 3: {
        if (ACInfo.get(player.id).acArmour < 100)
          ACInfo.get(player.id).acArmour = 100;
        break;
      }
      default: {
        if (ac_i - 100 >= 1 && ac_i - 100 <= 46) {
          ac_i -= 100;
          const ac_s = ac_wSlot[ac_i];
          if (
            ACInfo.get(player.id).acWeapon[ac_s] === ac_i ||
            (ac_IsAmmoSharingInSlot(ac_s) &&
              ACInfo.get(player.id).acWeapon[ac_s] > 0)
          )
            ACInfo.get(player.id).acAmmo[ac_s] += ac_pAmmo[ac_i];
        }
        break;
      }
    }
  }
  ACInfo.get(player.id).acLastPickup = pickup.id + LimitsEnum.MAX_PICKUPS;
  return next();
});

PickUpEvent.onPlayerPickUpGlobal(({ pickup, player, next }) => {
  if (
    ACInfo.get(player.id).acKicked > 0 ||
    !(pickup.id >= 0 && pickup.id < LimitsEnum.MAX_PICKUPS)
  )
    return false;

  const streamerId = Streamer.getItemStreamerID(
    player,
    StreamerItemTypes.PICKUP,
    pickup.id,
  );
  if (!DynamicPickup.isValid(streamerId)) {
    const ac_i = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_i - ACInfo.get(player.id).acCall[8] < ac_Mtfc[8][0])
        ac_FloodDetect(player, 8);
      else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[8] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    if (ACInfo.get(player.id).acACAllow[6]) {
      const ac_dist = ac_GetVectorDist(
        ACInfo.get(player.id).acPosX - ACPickInfo.get(player.id).acPosX,
        ACInfo.get(player.id).acPosY - ACPickInfo.get(player.id).acPosY,
        ACInfo.get(player.id).acPosZ - ACPickInfo.get(player.id).acPosZ,
      );
      if (ac_dist >= 15.0) {
        const ac_dist_set = ac_GetVectorDist(
          ACInfo.get(player.id).acSetPosX - ACPickInfo.get(player.id).acPosX,
          ACInfo.get(player.id).acSetPosY - ACPickInfo.get(player.id).acPosY,
          (ACInfo.get(player.id).acTpToZ
            ? ACPickInfo.get(player.id).acPosZ
            : ACInfo.get(player.id).acSetPosZ) -
            ACPickInfo.get(player.id).acPosZ,
        );
        if (ACInfo.get(player.id).acSet[7] === -1 || ac_dist_set >= 15.0) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC debug] Pickupid: ${pickup.id}, dist: ${ac_dist}, dist set: ${ac_dist_set}, acSet[7]: ${ACInfo.get(player.id).acSet[7]}, player.id: ${player.id}`,
            );
          }
          ac_KickWithCode(player, "", 0, 6, 1);
          return 0;
        }
      }
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[8] = ac_i;
    if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
      switch (ACPickInfo.get(pickup.id).acType) {
        case 1: {
          ACInfo.get(player.id).acSpecAct = SpecialActionsEnum.USEJETPACK;
          break;
        }
        case 2: {
          if (ACInfo.get(player.id).acHealth < 100)
            ACInfo.get(player.id).acHealth = 100;
          break;
        }
        case 3: {
          if (ACInfo.get(player.id).acArmour < 100)
            ACInfo.get(player.id).acArmour = 100;
          break;
        }
        case 4: {
          const ac_i = ACPickInfo.get(pickup.id).acWeapon;
          const ac_s = ac_wSlot[ac_i];
          if (
            ACInfo.get(player.id).acWeapon[ac_s] === ac_i ||
            (ac_IsAmmoSharingInSlot(ac_s) &&
              ACInfo.get(player.id).acWeapon[ac_s] > 0)
          )
            ACInfo.get(player.id).acAmmo[ac_s] += ac_pAmmo[ac_i];
          break;
        }
      }
    }
    ACInfo.get(player.id).acLastPickup = pickup.id;
  }
  return next();
});
