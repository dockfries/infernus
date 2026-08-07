import { GameMode, Player, InvalidEnum, PlayerStateEnum } from "@infernus/core";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import { orig_playerMethods } from "../../hooks/origin";
import {
  classSpawnInfo,
  playerTeam,
  world,
  lastUpdateTick,
  damageFeedUpdateTick,
  lastStopTick,
  lastVehicleEnterTime,
  trueDeath,
  inClassSelection,
  playerFallbackSpawnInfo,
  alreadyConnected,
  playerHealth,
  playerArmour,
  playerMaxHealth,
  healthBarForeground,
  internalPlayerTextDraw,
  damageFeedGiven,
  damageFeedTaken,
  healthBarBorder,
  healthBarBackground,
  playerHealthBarPos,
  playerHealthBarSize,
  playerHealthBarPadding,
} from "../../struct";
import { setKnifeSync } from "../emulated";
import { damageFeedUpdate } from "./damageFeed";
import { freezeSyncPacket } from "./raknet";
import {
  updateHealthBar,
  setHealthBarVisible,
  setFakeHealth,
  setFakeArmour,
  setFakeFacingAngle,
  updatePlayerVirtualWorld,
} from "./set";
import {
  createVendingMachines,
  removeDefaultVendingMachines,
  destroyVendingMachines,
} from "./vendingMachines";

export function scriptInit() {
  innerGameModeConfig.lagCompMode = !!GameMode.getConsoleVarAsInt("game.lag_compensation_mode");

  if (innerGameModeConfig.lagCompMode) {
    setKnifeSync(false);
  } else {
    innerGameModeConfig.damageTakenSound = 0;
    setKnifeSync(true);
  }

  for (let i = 0; i < innerWeaponConfig.MAX_CLASSES; i++) {
    classSpawnInfo.get(i).skin = -1;
  }

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES && innerGameModeConfig.customVendingMachines) {
    createVendingMachines();
  }

  let worldId = 0;
  const tick = Date.now();

  Player.getInstances().forEach((player) => {
    setFakeHealth(player, 255.0);
    setFakeArmour(player, 255.0);

    playerTeam.set(player.id, orig_playerMethods.getTeam.call(player));

    orig_playerMethods.setTeam.call(player, playerTeam.get(player.id));
    freezeSyncPacket(player, false);
    setFakeFacingAngle(player);
    damageFeedUpdate(player);

    worldId = orig_playerMethods.getVirtualWorld.call(player);

    if (worldId === innerWeaponConfig.DEATH_WORLD) {
      worldId = 0;

      orig_playerMethods.setVirtualWorld.call(player, worldId);
    }

    world.set(player.id, worldId);
    lastUpdateTick.set(player.id, tick);
    damageFeedUpdateTick.set(player.id, tick);
    lastStopTick.set(player.id, tick);
    lastVehicleEnterTime.set(player.id, 0);
    playerFallbackSpawnInfo.get(player.id).skin = -1;

    playerHealthBarPos.set(player.id, [Number.NaN, Number.NaN]);
    playerHealthBarSize.set(player.id, [Number.NaN, Number.NaN]);
    playerHealthBarPadding.set(player.id, [Number.NaN, Number.NaN, Number.NaN, Number.NaN]);

    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      alreadyConnected.set(player.id, true);
      removeDefaultVendingMachines(player);
    }

    const state = orig_playerMethods.getState.call(player);
    if (state >= PlayerStateEnum.ONFOOT && state <= PlayerStateEnum.PASSENGER) {
      playerHealth.set(player.id, orig_playerMethods.getHealth.call(player).health);
      playerArmour.set(player.id, orig_playerMethods.getArmour.call(player).armour);

      if (playerHealth.get(player.id) === 0.0) {
        playerHealth.set(player.id, playerMaxHealth.get(player.id));
      }

      updateHealthBar(player);
    }

    switch (state) {
      case PlayerStateEnum.ONFOOT:
      case PlayerStateEnum.DRIVER:
      case PlayerStateEnum.PASSENGER:
      case PlayerStateEnum.SPAWNED: {
        trueDeath.set(player.id, false);
        inClassSelection.set(player.id, false);

        setHealthBarVisible(player, true);
        break;
      }

      default: {
        trueDeath.set(player.id, true);
        inClassSelection.set(player.id, true);

        setHealthBarVisible(player, false);
      }
    }
  });
}

export function scriptExit() {
  setKnifeSync(true);

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    destroyVendingMachines();
  }

  let health = 0;

  Player.getInstances().forEach((player) => {
    orig_playerMethods.setTeam.call(player, playerTeam.get(player.id));

    const state = orig_playerMethods.getState.call(player);

    if (state >= PlayerStateEnum.ONFOOT && state <= PlayerStateEnum.PASSENGER) {
      health = playerHealth.get(player.id);

      if (health === 0.0) {
        health = playerMaxHealth.get(player.id);
      }

      orig_playerMethods.setHealth.call(player, health);
      orig_playerMethods.setArmour.call(player, playerArmour.get(player.id));
    }

    setFakeHealth(player, 255);
    setFakeArmour(player, 255);
    updatePlayerVirtualWorld(player);
    freezeSyncPacket(player, false);
    setFakeFacingAngle(player);
    setHealthBarVisible(player, false);

    if (
      healthBarBorder.has(player.id) &&
      healthBarBorder.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarBorder.get(player.id)!.id] = false;
      healthBarBorder.get(player.id)!.destroy();
      healthBarBorder.set(player.id, null);
    }

    if (
      healthBarBackground.has(player.id) &&
      healthBarBackground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarBackground.get(player.id)!.id] = false;
      healthBarBackground.get(player.id)!.destroy();
      healthBarBackground.set(player.id, null);
    }

    if (
      healthBarForeground.has(player.id) &&
      healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarForeground.get(player.id)!.id] = false;
      healthBarForeground.get(player.id)!.destroy();
      healthBarForeground.set(player.id, null);
    }

    if (
      damageFeedGiven.has(player.id) &&
      damageFeedGiven.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[damageFeedGiven.get(player.id)!.id] = false;
      damageFeedGiven.get(player.id)!.destroy();
      damageFeedGiven.set(player.id, null);
    }

    if (
      damageFeedTaken.has(player.id) &&
      damageFeedTaken.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[damageFeedTaken.get(player.id)!.id] = false;
      damageFeedTaken.get(player.id)!.destroy();
      damageFeedTaken.set(player.id, null);
    }
  });
}
