import { Player, Vehicle } from "@infernus/core";
import {
  ac_AmmuNations,
  ac_Casinos,
  ac_PayNSpray,
  ac_Restaurants,
  ac_vMachines,
  ac_vMods,
  ac_vType,
} from "../constants";
import { ACInfo } from "../struct";
import { innerACConfig } from "../config";

export function ac_IsValidVehicleModel(modelId: number) {
  return modelId >= 400 && modelId <= 611;
}

export function ac_IsAnAirplane(modelId: number) {
  return ac_vType[modelId - 400] === 1;
}

export function ac_IsAnAircraft(modelId: number) {
  return ac_vType[modelId - 400] >= 1 && ac_vType[modelId - 400] <= 2;
}

export function ac_IsAnAircraftEx(modelId: number) {
  return (
    ac_IsValidVehicleModel(modelId) &&
    ac_vType[modelId - 400] >= 1 &&
    ac_vType[modelId - 400] <= 2
  );
}

export function ac_IsABoatEx(modelId: number) {
  return ac_IsValidVehicleModel(modelId) && ac_vType[modelId - 400] === 3;
}

export function ac_IsABmx(modelId: number) {
  return ac_vType[modelId - 400] === 4;
}

export function ac_IsABmxEx(modelId: number) {
  return ac_IsValidVehicleModel(modelId) && ac_vType[modelId - 400] === 4;
}

export function ac_IsABikeEx(modelId: number) {
  return (
    ac_IsValidVehicleModel(modelId) &&
    ac_vType[modelId - 400] >= 4 &&
    ac_vType[modelId - 400] <= 5
  );
}

export function ac_IsABusEx(modelId: number) {
  return ac_IsValidVehicleModel(modelId) && ac_vType[modelId - 400] === 6;
}

export function ac_IsATrainLoco(modelId: number) {
  return ac_vType[modelId - 400] === 7;
}

export function ac_IsATrainCarriageEx(modelId: number) {
  return ac_IsValidVehicleModel(modelId) && ac_vType[modelId - 400] === 8;
}

export function ac_IsATrainPartEx(modelId: number) {
  return (
    ac_IsValidVehicleModel(modelId) &&
    ac_vType[modelId - 400] >= 7 &&
    ac_vType[modelId - 400] <= 8
  );
}

export function ac_IsAnAircraftRC(modelId: number) {
  return ac_vType[modelId - 400] === 9;
}

export function ac_IsARemoteControlEx(modelId: number) {
  return (
    ac_IsValidVehicleModel(modelId) &&
    ac_vType[modelId - 400] >= 9 &&
    ac_vType[modelId - 400] <= 10
  );
}

export function ac_IsValidDamageReason(weaponId: number) {
  return (
    (weaponId >= 0 && weaponId <= 18) ||
    (weaponId >= 22 && weaponId <= 46) ||
    (weaponId >= 49 && weaponId <= 54)
  );
}

export function ac_IsValidWeapon(weaponId: number) {
  return (
    (weaponId >= 0 && weaponId <= 18) || (weaponId >= 22 && weaponId <= 46)
  );
}

export function ac_IsBulletWeapon(weaponId: number) {
  return weaponId === 38 || (weaponId >= 22 && weaponId <= 34);
}

export function ac_IsWeaponSlotWithAmmo(weaponSlot: number) {
  return weaponSlot >= 2 && weaponSlot <= 9;
}

export function ac_IsAmmoSharingInSlot(weaponSlot: number) {
  return weaponSlot >= 3 && weaponSlot <= 5;
}

export function ac_IsBrokenObjectModel(modelId: number) {
  return (
    ac_IsValidVehicleModel(modelId) ||
    modelId === 320 ||
    (modelId >= 384 && modelId <= 393) ||
    modelId === 20000
  );
}

export function ac_IsValidFloat(value: number) {
  return value === value && value !== 0x7f800000 && value !== 0xff800000;
}

export function ac_IsValidSkin(skinId: number) {
  return skinId >= 0 && skinId < innerACConfig.AC_MAX_SKINS && skinId !== 74;
}

export function ac_GetElevationAngle(
  ac_w: number,
  ac_x: number,
  ac_y: number,
  ac_z: number,
) {
  return Math.abs(
    (Math.atan2(
      (ac_y * ac_z + ac_w * ac_x) * 2.0,
      ac_w * ac_w - ac_x * ac_x - ac_y * ac_y + ac_z * ac_z,
    ) *
      180) /
      Math.PI,
  );
}

export function ac_IsUpsideDown(
  ac_w: number,
  ac_x: number,
  ac_y: number,
  ac_z: number,
) {
  return ac_GetElevationAngle(ac_w, ac_x, ac_y, ac_z) > 90.0;
}

export function ac_IsVehicleSeatOccupied(vehicle: Vehicle, seat: number) {
  return Player.getInstances().some((ac_i) => {
    return (
      ACInfo.get(ac_i.id)!.acVeh === vehicle.id &&
      ACInfo.get(ac_i.id)!.acSeat === seat
    );
  });
}

export function ac_InRestaurant(player: Player, interiorId: number) {
  switch (interiorId) {
    case 5: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_Restaurants[0][0],
          ac_Restaurants[0][1],
          ac_Restaurants[0][2],
        )
      )
        return true;
      break;
    }
    case 9: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_Restaurants[1][0],
          ac_Restaurants[1][1],
          ac_Restaurants[1][2],
        )
      )
        return true;
      break;
    }
    case 10: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_Restaurants[2][0],
          ac_Restaurants[2][1],
          ac_Restaurants[2][2],
        )
      )
        return true;
      break;
    }
  }
  return false;
}

export function ac_InAmmuNation(player: Player, interiorId: number) {
  switch (interiorId) {
    case 1: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_AmmuNations[0][0],
          ac_AmmuNations[0][1],
          ac_AmmuNations[0][2],
        )
      )
        return true;
      break;
    }
    case 4: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_AmmuNations[1][0],
          ac_AmmuNations[1][1],
          ac_AmmuNations[1][2],
        )
      )
        return true;
      break;
    }
    case 6: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_AmmuNations[2][0],
          ac_AmmuNations[2][1],
          ac_AmmuNations[2][2],
        ) ||
        player.isInRangeOfPoint(
          3.0,
          ac_AmmuNations[3][0],
          ac_AmmuNations[3][1],
          ac_AmmuNations[3][2],
        )
      )
        return true;
      break;
    }
    case 7: {
      if (
        player.isInRangeOfPoint(
          3.0,
          ac_AmmuNations[4][0],
          ac_AmmuNations[4][1],
          ac_AmmuNations[4][2],
        )
      )
        return true;
      break;
    }
  }
  return false;
}

export function ac_InPayNSpray(
  interiorId: number,
  ac_x: number,
  ac_y: number,
  ac_z: number,
) {
  if (interiorId === 0) {
    for (let ac_i = ac_PayNSpray.length - 1; ac_i >= 0; --ac_i) {
      if (
        ac_x >= ac_PayNSpray[ac_i][0] &&
        ac_x <= ac_PayNSpray[ac_i][3] &&
        ac_y >= ac_PayNSpray[ac_i][1] &&
        ac_y <= ac_PayNSpray[ac_i][4] &&
        ac_z >= ac_PayNSpray[ac_i][2] &&
        ac_z <= ac_PayNSpray[ac_i][5]
      )
        return true;
    }
  }
  return false;
}

export function ac_NearVendingMachine(player: Player, interiorId: number) {
  switch (interiorId) {
    case 0: {
      for (let ac_i = 44; ac_i >= 0; --ac_i) {
        if (
          player.isInRangeOfPoint(
            1.5,
            ac_vMachines[ac_i][0],
            ac_vMachines[ac_i][1],
            ac_vMachines[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
    case 1: {
      for (let ac_i = 51; ac_i >= 45; --ac_i) {
        if (
          player.isInRangeOfPoint(
            1.5,
            ac_vMachines[ac_i][0],
            ac_vMachines[ac_i][1],
            ac_vMachines[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
    case 2: {
      if (
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[52][0],
          ac_vMachines[52][1],
          ac_vMachines[52][2],
        )
      )
        return true;
      break;
    }
    case 3: {
      for (let ac_i = 58; ac_i >= 53; --ac_i) {
        if (
          player.isInRangeOfPoint(
            1.5,
            ac_vMachines[ac_i][0],
            ac_vMachines[ac_i][1],
            ac_vMachines[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
    case 6: {
      if (
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[59][0],
          ac_vMachines[59][1],
          ac_vMachines[59][2],
        ) ||
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[60][0],
          ac_vMachines[60][1],
          ac_vMachines[60][2],
        )
      )
        return true;
      break;
    }
    case 7: {
      if (
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[61][0],
          ac_vMachines[61][1],
          ac_vMachines[61][2],
        )
      )
        return true;
      break;
    }
    case 15: {
      if (
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[62][0],
          ac_vMachines[62][1],
          ac_vMachines[62][2],
        )
      )
        return true;
      break;
    }
    case 16: {
      if (
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[63][0],
          ac_vMachines[63][1],
          ac_vMachines[63][2],
        ) ||
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[64][0],
          ac_vMachines[64][1],
          ac_vMachines[64][2],
        ) ||
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[65][0],
          ac_vMachines[65][1],
          ac_vMachines[65][2],
        )
      )
        return true;
      break;
    }
    case 17: {
      for (let ac_i = 72; ac_i >= 66; --ac_i) {
        if (
          player.isInRangeOfPoint(
            1.5,
            ac_vMachines[ac_i][0],
            ac_vMachines[ac_i][1],
            ac_vMachines[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
    case 18: {
      if (
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[73][0],
          ac_vMachines[73][1],
          ac_vMachines[73][2],
        ) ||
        player.isInRangeOfPoint(
          1.5,
          ac_vMachines[74][0],
          ac_vMachines[74][1],
          ac_vMachines[74][2],
        )
      )
        return true;
      break;
    }
  }
  return false;
}

export function ac_InCasino(player: Player, interiorId: number) {
  switch (interiorId) {
    case 1: {
      for (let ac_i = 29; ac_i >= 0; --ac_i) {
        if (
          player.isInRangeOfPoint(
            ac_Casinos[ac_i][3],
            ac_Casinos[ac_i][0],
            ac_Casinos[ac_i][1],
            ac_Casinos[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
    case 10: {
      for (let ac_i = 49; ac_i >= 30; --ac_i) {
        if (
          player.isInRangeOfPoint(
            ac_Casinos[ac_i][3],
            ac_Casinos[ac_i][0],
            ac_Casinos[ac_i][1],
            ac_Casinos[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
    case 12: {
      for (let ac_i = 58; ac_i >= 50; --ac_i) {
        if (
          player.isInRangeOfPoint(
            ac_Casinos[ac_i][3],
            ac_Casinos[ac_i][0],
            ac_Casinos[ac_i][1],
            ac_Casinos[ac_i][2],
          )
        )
          return true;
      }
      break;
    }
  }
  return false;
}

export function ac_IsCompatible(modelId: number, componentId: number) {
  if (ac_IsValidVehicleModel(modelId)) {
    if (componentId >= 1000 && componentId <= 1191) {
      componentId -= 1000;
      if (
        ac_vMods[(modelId - 400) * 6 + (componentId >>> 5)] &
        (1 << (componentId & 0b00011111))
      )
        return true;
    } else if (componentId === 1192 || componentId === 1193) {
      if (modelId === 576) return true;
    }
  }
  return false;
}
