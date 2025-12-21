import {
  GameMode,
  TextDraw,
  Player,
  InvalidEnum,
  TextDrawFontsEnum,
  PlayerStateEnum,
} from "@infernus/core";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import {
  orig_TextDrawTextSize,
  orig_TextDrawColor,
  orig_TextDrawFont,
  orig_playerMethods,
} from "../../hooks/origin";
import {
  classSpawnInfo,
  internalTextDraw,
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
  vendingUseTimer,
  healthBarForeground,
  internalPlayerTextDraw,
  damageFeedGiven,
  damageFeedTaken,
} from "../../struct";
import { setKnifeSync } from "../emulated";
import { damageFeedUpdate } from "./damageFeed";
import { freezeSyncPacket } from "./raknet";
import {
  updateHealthBar,
  setHealthBarVisible,
  setFakeHealth,
  setFakeArmour,
  // setFakeFacingAngle,
} from "./set";
import {
  createVendingMachines,
  removeDefaultVendingMachines,
  destroyVendingMachines,
} from "./vendingMachines";

export function scriptInit() {
  innerGameModeConfig.lagCompMode = !!GameMode.getConsoleVarAsInt(
    "game.lag_compensation_mode",
  );

  if (innerGameModeConfig.lagCompMode) {
    setKnifeSync(false);
  } else {
    innerGameModeConfig.damageTakenSound = 0;
    setKnifeSync(true);
  }

  for (let i = 0; i < innerWeaponConfig.MAX_CLASSES; i++) {
    classSpawnInfo.get(i).skin = -1;
  }

  try {
    innerGameModeConfig.healthBarBorder = new TextDraw({
      x: 546.0,
      y: 66.7,
      text: "LD_SPAC:white",
    }).create();
    internalTextDraw.set(innerGameModeConfig.healthBarBorder.id, true);
    orig_TextDrawTextSize(innerGameModeConfig.healthBarBorder.id, 61.7, 8.4);
    orig_TextDrawColor(innerGameModeConfig.healthBarBorder.id, 255);
    orig_TextDrawFont(
      innerGameModeConfig.healthBarBorder.id,
      TextDrawFontsEnum.SPRITE_DRAW,
    );
  } catch (err) {
    console.log("(wc) WARN: Cannot create healthBar border textDraw");
    console.log(err);
  }

  try {
    innerGameModeConfig.healthBarBackground = new TextDraw({
      x: 548.0,
      y: 68.0,
      text: "LD_SPAC:white",
    }).create();

    internalTextDraw.set(innerGameModeConfig.healthBarBackground.id, true);
    orig_TextDrawTextSize(
      innerGameModeConfig.healthBarBackground.id,
      57.8,
      4.7,
    );
    orig_TextDrawColor(
      innerGameModeConfig.healthBarBackground.id,
      innerWeaponConfig.HEALTH_BAR_BG_COLOR,
    );
    orig_TextDrawFont(
      innerGameModeConfig.healthBarBackground.id,
      TextDrawFontsEnum.SPRITE_DRAW,
    );
  } catch (err) {
    console.log("(wc) WARN: Cannot create healthBar background textDraw");
    console.log(err);
  }

  if (
    innerWeaponConfig.CUSTOM_VENDING_MACHINES &&
    innerGameModeConfig.customVendingMachines
  ) {
    createVendingMachines();
  }

  let worldId = 0;
  const tick = Date.now();

  Player.getInstances().forEach((player) => {
    playerTeam.set(player.id, orig_playerMethods.getTeam.call(player));
    orig_playerMethods.setTeam.call(player, playerTeam.get(player.id));
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
    trueDeath.set(player.id, true);
    inClassSelection.set(player.id, true);
    playerFallbackSpawnInfo.get(player.id).skin = -1;

    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      alreadyConnected.set(player.id, true);
      removeDefaultVendingMachines(player);
    }

    const state = orig_playerMethods.getState.call(player);
    if (state >= PlayerStateEnum.ONFOOT && state <= PlayerStateEnum.PASSENGER) {
      playerHealth.set(
        player.id,
        orig_playerMethods.getHealth.call(player).health,
      );
      playerArmour.set(
        player.id,
        orig_playerMethods.getArmour.call(player).armour,
      );

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
        setHealthBarVisible(player, true);
        break;
      }

      default: {
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
    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      if (vendingUseTimer.get(player.id)) {
        clearTimeout(vendingUseTimer.get(player.id)!);
        vendingUseTimer.set(player.id, null);
      }
    }

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
    freezeSyncPacket(player, false);
    // setFakeFacingAngle(player);
    setHealthBarVisible(player, false);

    if (
      healthBarForeground.has(player.id) &&
      healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        healthBarForeground.get(player.id)!.id
      ] = false;
      healthBarForeground.get(player.id)!.destroy();
      healthBarForeground.set(player.id, null);
    }

    if (
      damageFeedGiven.has(player.id) &&
      damageFeedGiven.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        damageFeedGiven.get(player.id)!.id
      ] = false;
      damageFeedGiven.get(player.id)!.destroy();
      damageFeedGiven.set(player.id, null);
    }

    if (
      damageFeedTaken.has(player.id) &&
      damageFeedTaken.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        damageFeedTaken.get(player.id)!.id
      ] = false;
      damageFeedTaken.get(player.id)!.destroy();
      damageFeedTaken.set(player.id, null);
    }
  });

  if (
    innerGameModeConfig.healthBarBorder &&
    innerGameModeConfig.healthBarBorder.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalTextDraw.set(innerGameModeConfig.healthBarBorder.id, false);
    innerGameModeConfig.healthBarBorder.destroy();
  }

  if (
    innerGameModeConfig.healthBarBackground &&
    innerGameModeConfig.healthBarBackground.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalTextDraw.set(innerGameModeConfig.healthBarBackground.id, false);
    innerGameModeConfig.healthBarBackground.destroy();
  }
}
