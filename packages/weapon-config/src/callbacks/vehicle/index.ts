import {
  VehicleEvent,
  Vehicle,
  Player,
  useTrigger,
  withTriggerOptions,
  InvalidEnum,
} from "@infernus/core";
import { innerWeaponConfig } from "../../config";
import { orig_playerMethods, orig_vehicleMethods } from "../../hooks/origin";
import {
  vendingUseTimer,
  lastVehicleEnterTime,
  lastVehicleTick,
  isDying,
  vehicleRespawnTimer,
  vehicleAlive,
  lastVehicleShooter,
} from "../../struct";

VehicleEvent.onPlayerEnter(({ player, next }) => {
  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (vendingUseTimer.get(player.id)) {
      clearTimeout(vendingUseTimer.get(player.id)!);
      vendingUseTimer.set(player.id, null);
    }
  }

  lastVehicleEnterTime.set(player.id, Date.now() / 1000);
  lastVehicleTick.set(player.id, Date.now());

  if (isDying.get(player.id)) {
    orig_playerMethods.toggleControllable.call(player, false);
    orig_playerMethods.applyAnimation.call(
      player,
      "PED",
      "KO_skid_back",
      4.1,
      false,
      false,
      false,
      true,
      0,
      1,
    );
  }

  return next();
});

VehicleEvent.onPlayerExit(({ player, next }) => {
  lastVehicleTick.set(player.id, Date.now());
  return next();
});

export function wc_KillVehicle(vehicle: Vehicle, killer: Player) {
  useTrigger("OnVehicleDeath")!(
    withTriggerOptions({
      skipToNext: internalVehicleDeath,
      args: [vehicle.id, killer.id],
    }),
  );
  vehicleRespawnTimer.set(
    vehicle.id,
    setTimeout(() => {
      wc_OnDeadVehicleSpawn(vehicle);
    }, 10000),
  );
  return 1;
}

export function wc_OnDeadVehicleSpawn(vehicle: Vehicle) {
  vehicleRespawnTimer.set(vehicle.id, null);
  return orig_vehicleMethods.setRespawn.call(vehicle);
}

VehicleEvent.onSpawn(({ vehicle, next }) => {
  if (vehicleRespawnTimer.get(vehicle.id)) {
    clearTimeout(vehicleRespawnTimer.get(vehicle.id)!);
    vehicleRespawnTimer.set(vehicle.id, null);
  }
  vehicleAlive.set(vehicle.id, true);
  lastVehicleShooter.set(vehicle.id, InvalidEnum.PLAYER_ID);
  return next();
});

const internalVehicleDeath: Parameters<(typeof VehicleEvent)["onDeath"]>[0] = ({
  vehicle,
  next,
}) => {
  if (vehicleRespawnTimer.get(vehicle.id)) {
    clearTimeout(vehicleRespawnTimer.get(vehicle.id)!);
    vehicleRespawnTimer.set(vehicle.id, null);
  }
  if (vehicleAlive.get(vehicle.id)) {
    vehicleAlive.set(vehicle.id, false);
    return next();
  }
  return 1;
};

VehicleEvent.onDeath(internalVehicleDeath);
