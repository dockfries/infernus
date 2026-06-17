import { DynamicObject, KeysEnum, Player, Vehicle, VehicleModelInfoEnum } from "@infernus/core";
import {
  playerUsingVehPara,
  vehicleConfigParachute,
  vehicleParachuteObject,
  vehParaConfig,
} from "./constants";
import { VehParaException } from "./exceptions";

export class VehPara {
  private constructor() {
    throw new VehParaException("Cannot create an instance of this class");
  }

  static isUsing(player: Player) {
    return playerUsingVehPara.has(player.id);
  }

  static isToggle(vehicle: Vehicle | number) {
    return vehicleConfigParachute.has(typeof vehicle === "number" ? vehicle : vehicle.id);
  }

  static setKey(key: KeysEnum) {
    vehParaConfig.key = key;
  }

  static toggle(vehicle: Vehicle | number, toggle: boolean) {
    const vehicleId = typeof vehicle === "number" ? vehicle : vehicle.id;

    const vehObjs = vehicleParachuteObject.get(vehicleId);
    if (vehObjs) {
      vehObjs.forEach((obj) => {
        if (obj && obj.isValid()) obj.destroy();
      });
      vehicleParachuteObject.delete(vehicleId);
    }

    if (toggle) {
      if (!VehPara.isToggle(vehicleId)) {
        const obj1 = new DynamicObject({
          modelId: 1310,
          x: 0.0,
          y: 0.0,
          z: -6000.0,
          rx: 0.0,
          ry: 0.0,
          rz: 0.0,
        });
        obj1.create();

        const obj2 = new DynamicObject({
          modelId: 1310,
          x: 0.0,
          y: 0.0,
          z: -6000.0,
          rx: 0.0,
          ry: 0.0,
          rz: 0.0,
        });
        obj2.create();

        vehicleParachuteObject.set(vehicleId, [undefined, obj1, obj2]);

        const veh = Vehicle.getInstance(vehicleId)!;
        let { z } = veh.getModelInfo(VehicleModelInfoEnum.SIZE);
        z /= 2.0;

        obj1.attachToVehicle(veh, 0.5, 0.0, z + 0.1, 270.0, 0.0, 35.0);
        obj2.attachToVehicle(veh, -0.5, 0.0, z + 0.1, 270.0, 0.0, 325.0);
      }
      vehicleConfigParachute.add(vehicleId);
    } else {
      vehicleConfigParachute.delete(vehicleId);
    }
  }
}
