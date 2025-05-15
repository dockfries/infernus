import {
  Player,
  DynamicObject,
  PlayerStateEnum,
  StreamerMiscellaneous,
} from "@infernus/core";
import { sc_VendingMachines } from "../../constants";
import { VendingMachineIndex } from "../../enums";
import { wc_SetPlayerHealth } from "../../hooks";
import { orig_playerMethods } from "../../hooks/origin";
import {
  vendingUseTimer,
  isDying,
  playerHealth,
  playerMaxHealth,
  vendingMachineObject,
} from "../../struct";

export function removeDefaultVendingMachines(player: Player) {
  orig_playerMethods.removeBuilding.call(player, 955, 0.0, 0.0, 0.0, 20000.0);
  orig_playerMethods.removeBuilding.call(player, 956, 0.0, 0.0, 0.0, 20000.0);
  orig_playerMethods.removeBuilding.call(player, 1209, 0.0, 0.0, 0.0, 20000.0);
  orig_playerMethods.removeBuilding.call(player, 1302, 0.0, 0.0, 0.0, 20000.0);
  orig_playerMethods.removeBuilding.call(player, 1775, 0.0, 0.0, 0.0, 20000.0);
  orig_playerMethods.removeBuilding.call(player, 1776, 0.0, 0.0, 0.0, 20000.0);
  orig_playerMethods.removeBuilding.call(player, 1977, 0.0, 0.0, 0.0, 20000.0);

  for (let i = 0; i < sc_VendingMachines.length; i++) {
    orig_playerMethods.removeBuilding.call(
      player,
      sc_VendingMachines[i][VendingMachineIndex.model],
      sc_VendingMachines[i][VendingMachineIndex.posX],
      sc_VendingMachines[i][VendingMachineIndex.posY],
      sc_VendingMachines[i][VendingMachineIndex.posZ],
      1.0,
    );
  }
}

export function wc_VendingMachineUsed(player: Player, healthGiven: number) {
  vendingUseTimer.set(player.id, null);

  if (
    orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT &&
    !isDying.get(player.id)
  ) {
    let health = playerHealth.get(player.id);

    health += healthGiven;

    if (health > playerMaxHealth.get(player.id)) {
      health = playerMaxHealth.get(player.id);
    }

    wc_SetPlayerHealth.call(player, health);
  }
}

export function createVendingMachines() {
  destroyVendingMachines();

  for (let i = 0; i < sc_VendingMachines.length; i++) {
    vendingMachineObject[i] = new DynamicObject({
      modelId: sc_VendingMachines[i][VendingMachineIndex.model],
      x: sc_VendingMachines[i][VendingMachineIndex.posX],
      y: sc_VendingMachines[i][VendingMachineIndex.posY],
      z: sc_VendingMachines[i][VendingMachineIndex.posZ],
      rx: sc_VendingMachines[i][VendingMachineIndex.rotX],
      ry: sc_VendingMachines[i][VendingMachineIndex.rotY],
      rz: sc_VendingMachines[i][VendingMachineIndex.rotZ],
      interiorId: sc_VendingMachines[i][VendingMachineIndex.interior],
    }).create();
  }
}

export function destroyVendingMachines() {
  vendingMachineObject.forEach((obj) => {
    if (obj.id !== StreamerMiscellaneous.INVALID_ID) {
      obj.destroy();
    }
  });
  vendingMachineObject.length = 0;
}
