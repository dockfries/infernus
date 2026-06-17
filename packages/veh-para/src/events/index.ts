import {
  defineEvent,
  GameMode,
  isPressed,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  Vehicle,
  VehicleEvent,
} from "@infernus/core";
import {
  playerUsingVehPara,
  POSITION_FLAG_AIR,
  POSITION_FLAG_GROUND,
  vehicleConfigParachute,
  vehicleParachuteObject,
  vehParaConfig,
} from "../constants";
import {
  decompressRotation,
  getVehicleCollisionFlags,
  getVehicleRotationEx,
  isCollisionFlag,
  shiftVectorRotation,
  startVehicleParachuteAction,
  stopVehicleParachuteAction,
  togglePlayerUsingVehPara,
} from "../utils/internal";
import { VehPara } from "../vehPara";

PlayerEvent.onUpdate(({ player, next }) => {
  if (VehPara.isUsing(player)) {
    const veh = player.getVehicle();
    if (!veh) return next();

    if (isCollisionFlag(getVehicleCollisionFlags(veh), POSITION_FLAG_GROUND)) {
      stopVehicleParachuteAction(player);
      triggerThrown(player, veh);
    } else {
      const { rx, ry, rz } = getVehicleRotationEx(veh);
      const { x: tx, y: ty } = shiftVectorRotation(
        decompressRotation(ry) / 180.0,
        decompressRotation(-rx) / 180.0,
        0.0,
        0.0,
        0.0,
        rz,
      );
      veh.setVelocity(tx / 10.0, ty / 10.0, -0.2);
    }
  }
  return next();
});

VehicleEvent.onSpawn(({ vehicle, next }) => {
  VehPara.toggle(vehicle.id, false);
  return next();
});

VehicleEvent.onPlayerEnter(({ player, vehicle, next }) => {
  const vehObjs = vehicleParachuteObject.get(vehicle.id);
  if (vehObjs && vehObjs.length && vehObjs[0]?.isValid()) {
    VehPara.toggle(vehicle.id, false);
    triggerThrown(player, vehicle);
  }
  return next();
});

VehicleEvent.onPlayerExit(({ player, vehicle, next }) => {
  if (VehPara.isUsing(player)) {
    stopVehicleParachuteAction(player);
    triggerThrown(player, vehicle);
  }
  return next();
});

PlayerEvent.onStateChange(({ player, oldState, next }) => {
  if (oldState == PlayerStateEnum.DRIVER && VehPara.isUsing(player)) {
    stopVehicleParachuteAction(player, player.getVehicle());
  }
  return next();
});

PlayerEvent.onKeyStateChange(({ player, newKeys, oldKeys, next }) => {
  if (player.isInAnyVehicle() && player.getVehicleSeat() === 0) {
    const veh = player.getVehicle();
    if (veh && isPressed(newKeys, oldKeys, vehParaConfig.key)) {
      if (VehPara.isToggle(veh.id)) {
        if (VehPara.isUsing(player)) {
          stopVehicleParachuteAction(player);
          triggerThrown(player, veh);
        } else {
          if (
            isCollisionFlag(getVehicleCollisionFlags(veh), POSITION_FLAG_AIR) &&
            veh.getSpeed() > 0.0
          ) {
            startVehicleParachuteAction(player);
            triggerOpened(player, veh);
          } else {
            triggerOpenFail(player, veh);
          }
        }
      }
    }
  }
  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  togglePlayerUsingVehPara(player, false);
  return next();
});

GameMode.onExit(({ next }) => {
  vehicleConfigParachute.clear();
  vehicleParachuteObject.clear();
  playerUsingVehPara.clear();
  return next();
});

export const [onThrown, triggerThrown] = defineEvent({
  name: "OnVehicleParachuteThrown",
  beforeEach(player: Player, vehicle: Vehicle) {
    return {
      player,
      vehicle,
    };
  },
  isNative: false,
});

export const [onOpened, triggerOpened] = defineEvent({
  name: "OnVehicleParachuteOpened",
  beforeEach(player: Player, vehicle: Vehicle) {
    return {
      player,
      vehicle,
    };
  },
  isNative: false,
});

export const [onOpenFail, triggerOpenFail] = defineEvent({
  name: "OnVehicleParachuteOpenFail",
  beforeEach(player: Player, vehicle: Vehicle) {
    return {
      player,
      vehicle,
    };
  },
  isNative: false,
});

export const VehParaEvent = {
  onThrown,
  onOpened,
  onOpenFail,
};
