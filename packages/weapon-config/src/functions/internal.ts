import {
  DynamicCheckpoint,
  DynamicObject,
  DynamicRaceCP,
  FightingStylesEnum,
  GameMode,
  I18n,
  InvalidEnum,
  LimitsEnum,
  Player,
  PlayerStateEnum,
  SpecialActionsEnum,
  StreamerMiscellaneous,
  TextDraw,
  TextDrawFontsEnum,
  useTrigger,
  Vehicle,
  WeaponEnum,
} from "@infernus/core";
import { innerGameModeConfig, innerWeaponConfig } from "../config";
import { setKnifeSync } from "./emulated";
import {
  DamageFeedHit,
  RejectedHit,
  alreadyConnected,
  beingResynced,
  cBugAllowed,
  classSpawnInfo,
  damageDoneArmour,
  damageDoneHealth,
  damageFeedGiven,
  damageFeedHitsGiven,
  damageFeedHitsTaken,
  damageFeedLastUpdate,
  damageFeedTaken,
  damageFeedTimer,
  damageRangeRanges,
  damageRangeSteps,
  damageRangeValues,
  deathTimer,
  delayedDeathTimer,
  enableHealthBar,
  fakeArmour,
  fakeHealth,
  forceClassSelection,
  healthBarForeground,
  healthBarVisible,
  inClassSelection,
  internalPlayerTextDraw,
  internalTextDraw,
  isDying,
  lastDeathTick,
  lastExplosive,
  lastSentArmour,
  lastSentHealth,
  lastShot,
  lastStop,
  lastSyncData,
  lastUpdate,
  lastVehicleEnterTime,
  lastVehicleTick,
  playerArmour,
  playerFallbackSpawnInfo,
  playerHealth,
  playerMaxArmour,
  playerMaxHealth,
  playerTeam,
  rejectedHits,
  rejectedHitsIdx,
  restorePlayerTeleport,
  spawnForStreamedIn,
  spawnInfoModified,
  spectating,
  syncData,
  syncDataFrozen,
  trueDeath,
  vendingMachineObject,
  vendingUseTimer,
  world,
  fakeQuat,
  previousHitI,
  previousHits,
} from "../struct";
import {
  orig_playerMethods,
  orig_PlayerTextDrawAlignment,
  orig_PlayerTextDrawBackgroundColor,
  orig_PlayerTextDrawColor,
  orig_PlayerTextDrawFont,
  orig_PlayerTextDrawHide,
  orig_PlayerTextDrawLetterSize,
  orig_PlayerTextDrawSetOutline,
  orig_PlayerTextDrawSetString,
  orig_PlayerTextDrawShow,
  orig_PlayerTextDrawTextSize,
  orig_TextDrawColor,
  orig_TextDrawFont,
  orig_TextDrawHideForPlayer,
  orig_TextDrawShowForPlayer,
  orig_TextDrawTextSize,
  orig_vehicleMethods,
} from "../hooks/origin";
import {
  DamageTypeEnum,
  InvalidDamageEnum,
  RejectedReasonEnum,
  VendingMachineIndex,
  WC_WeaponEnum,
} from "../enums";
import {
  g_HitRejectReasons,
  s_DamageArmour,
  s_DamageType,
  s_WeaponDamage,
  s_WeaponRange,
  sc_VendingMachines,
  wc_PLAYER_SYNC,
  wc_RPC_CLEAR_ANIMATIONS,
  wc_RPC_REQUEST_SPAWN,
} from "../constants";
import {
  isBulletWeapon,
  isDamageFeedActive,
  isHighRateWeapon,
  isMeleeWeapon,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "./public";
import {
  debugMessage,
  debugMessageAll,
  debugMessageRed,
  debugMessageRedAll,
} from "../utils/debug";
import { floatFraction } from "../utils/math";
import {
  IEditableOnPlayerDamage,
  IEditableOnPlayerPrepareDeath,
  triggerOnInvalidWeaponDamage,
  triggerOnPlayerDamage,
  triggerOnPlayerDamageDone,
  triggerOnPlayerDeathFinished,
  triggerOnPlayerPrepareDeath,
  triggerOnRejectedHit,
} from "../callbacks/custom";
import { wc_GetWeaponName, wc_SetPlayerHealth } from "../hooks";
import { BitStream, OnFootSync, PacketRpcValueType } from "@infernus/raknet";

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

  innerGameModeConfig.healthBarBorder = new TextDraw({
    x: 546.0,
    y: 66.7,
    text: "LD_SPAC:white",
  }).create();

  if (innerGameModeConfig.healthBarBorder.id === InvalidEnum.TEXT_DRAW) {
    console.log("(wc) WARN: Unable to create healthBar border textDraw");
  } else {
    internalTextDraw.set(innerGameModeConfig.healthBarBorder.id, true);
    orig_TextDrawTextSize(innerGameModeConfig.healthBarBorder.id, 61.7, 8.4);
    orig_TextDrawColor(innerGameModeConfig.healthBarBorder.id, 255);
    orig_TextDrawFont(
      innerGameModeConfig.healthBarBorder.id,
      TextDrawFontsEnum.SPRITE_DRAW,
    );
  }

  innerGameModeConfig.healthBarBackground = new TextDraw({
    x: 548.0,
    y: 68.0,
    text: "LD_SPAC:white",
  }).create();
  if (innerGameModeConfig.healthBarBackground.id === InvalidEnum.TEXT_DRAW) {
    console.log("(wc) WARN: Unable to create healthBar background textDraw");
  } else {
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
    lastUpdate.set(player.id, tick);
    damageFeedLastUpdate.set(player.id, tick);
    lastStop.set(player.id, tick);
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
      playerHealth.set(player.id, orig_playerMethods.getHealth.call(player));
      playerArmour.set(player.id, orig_playerMethods.getArmour.call(player));

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
    setFakeFacingAngle(player);
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

export function updatePlayerVirtualWorld(player: Player) {
  let worldId = orig_playerMethods.getVirtualWorld.call(player);
  if (worldId === innerWeaponConfig.DEATH_WORLD) {
    worldId = world.get(player.id);
  } else if (worldId !== world.get(player.id)) {
    world.set(player.id, worldId);
  }
  orig_playerMethods.setVirtualWorld.call(player, worldId);
}

export function hasSameTeam(player: Player, otherId: number) {
  if (
    otherId < 0 ||
    otherId >= LimitsEnum.MAX_PLAYERS ||
    player.id < 0 ||
    player.id >= LimitsEnum.MAX_PLAYERS
  ) {
    return 0;
  }

  if (
    playerTeam.get(player.id) === InvalidEnum.NO_TEAM ||
    playerTeam.get(otherId) === InvalidEnum.NO_TEAM
  ) {
    return 0;
  }

  return playerTeam.get(player.id) === playerTeam.get(otherId);
}

export function wc_CalculateBar(width: number, max: number, value: number) {
  return (width / max) * value;
}

export function updateHealthBar(player: Player, force = false) {
  if (beingResynced.get(player.id) || forceClassSelection.get(player.id)) {
    return;
  }

  let health = Math.ceil(
    (playerHealth.get(player.id) / playerMaxHealth.get(player.id)) * 100.0,
  );
  let armour = Math.ceil(
    (playerArmour.get(player.id) / playerMaxArmour.get(player.id)) * 100.0,
  );

  if (isDying.get(player.id)) {
    health = 0;
    armour = 0;
  } else {
    if (health > 100) {
      health = 100;
    }

    if (armour > 100) {
      armour = 100;
    }
  }

  if (force) {
    lastSentHealth.set(player.id, -1);
    lastSentArmour.set(player.id, -1);
  } else if (
    healthBarVisible.get(player.id) &&
    (!healthBarForeground.get(player.id) ||
      healthBarForeground.get(player.id)!.id === InvalidEnum.TEXT_DRAW) &&
    !isDying.get(player.id)
  ) {
    lastSentHealth.set(player.id, -1);
  } else if (
    health === lastSentHealth.get(player.id) &&
    armour === lastSentArmour.get(player.id)
  ) {
    return;
  }

  setFakeHealth(player, health);
  setFakeArmour(player, armour);

  updateSyncData(player);

  if (health !== lastSentHealth.get(player.id)) {
    lastSentHealth.set(player.id, health);

    orig_playerMethods.setHealth.call(player, 8000000.0 + health);

    if (healthBarVisible.get(player.id) && !isDying.get(player.id)) {
      if (
        !healthBarForeground.get(player.id) ||
        healthBarForeground.get(player.id)!.id === InvalidEnum.TEXT_DRAW
      ) {
        healthBarForeground.set(
          player.id,
          new TextDraw({
            player,
            x: 548.0,
            y: 68.8,
            text: "LD_SPAC:white",
          }).create(),
        );

        if (healthBarForeground.get(player.id)!.id === InvalidEnum.TEXT_DRAW) {
          console.log(
            "(wc) WARN: Unable to create player healthbar foreground",
          );
        } else {
          internalPlayerTextDraw.get(player.id)[
            healthBarForeground.get(player.id)!.id
          ] = true;
          orig_PlayerTextDrawTextSize(
            player.id,
            healthBarForeground.get(player.id)!.id,
            wc_CalculateBar(57.8, 100.0, health),
            4.7,
          );
          orig_PlayerTextDrawColor(
            player.id,
            healthBarForeground.get(player.id)!.id,
            innerWeaponConfig.HEALTH_BAR_FG_COLOR,
          );
          orig_PlayerTextDrawFont(
            player.id,
            healthBarForeground.get(player.id)!.id,
            TextDrawFontsEnum.SPRITE_DRAW,
          );
          orig_PlayerTextDrawShow(
            player.id,
            healthBarForeground.get(player.id)!.id,
          );
        }
      } else if (
        internalPlayerTextDraw.get(player.id)[
          healthBarForeground.get(player.id)!.id
        ]
      ) {
        orig_PlayerTextDrawTextSize(
          player.id,
          healthBarForeground.get(player.id)!.id,
          wc_CalculateBar(57.8, 100.0, health),
          4.7,
        );
        orig_PlayerTextDrawShow(
          player.id,
          healthBarForeground.get(player.id)!.id,
        );
      }
    } else if (
      healthBarForeground.get(player.id) &&
      healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        healthBarForeground.get(player.id)!.id
      ] = false;
      healthBarForeground.get(player.id)!.destroy();
      healthBarForeground.set(player.id, null);
    }
  }

  if (armour !== lastSentArmour.get(player.id)) {
    lastSentArmour.set(player.id, armour);
    orig_playerMethods.setArmour.call(player, armour);
  }
}

export function setHealthBarVisible(player: Player, toggle: boolean) {
  if (!enableHealthBar.get(player.id)) {
    toggle = false;
  }
  if (healthBarVisible.get(player.id) === toggle) {
    return;
  }

  healthBarVisible.set(player.id, toggle);

  if (toggle) {
    if (
      innerGameModeConfig.healthBarBorder &&
      innerGameModeConfig.healthBarBorder.id !== InvalidEnum.TEXT_DRAW
    ) {
      orig_TextDrawShowForPlayer(
        player.id,
        innerGameModeConfig.healthBarBorder.id,
      );
    }

    if (
      innerGameModeConfig.healthBarBackground &&
      innerGameModeConfig.healthBarBackground.id !== InvalidEnum.TEXT_DRAW
    ) {
      orig_TextDrawShowForPlayer(
        player.id,
        innerGameModeConfig.healthBarBackground.id,
      );
    }

    updateHealthBar(player, true);
  } else {
    if (
      healthBarForeground.get(player.id) &&
      healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      orig_PlayerTextDrawHide(
        player.id,
        healthBarForeground.get(player.id)!.id,
      );
    }

    if (
      innerGameModeConfig.healthBarBorder &&
      innerGameModeConfig.healthBarBorder.id !== InvalidEnum.TEXT_DRAW
    ) {
      orig_TextDrawHideForPlayer(
        player.id,
        innerGameModeConfig.healthBarBorder.id,
      );
    }

    if (
      innerGameModeConfig.healthBarBackground &&
      innerGameModeConfig.healthBarBackground.id !== InvalidEnum.TEXT_DRAW
    ) {
      orig_TextDrawHideForPlayer(
        player.id,
        innerGameModeConfig.healthBarBackground.id,
      );
    }
  }
}

export function spawnPlayerInPlace(player: Player) {
  const { x, y, z } = orig_playerMethods.getPos.call(player)!;
  const r = orig_playerMethods.getFacingAngle.call(player);

  orig_playerMethods.setSpawnInfo.call(
    player,
    playerTeam.get(player.id),
    orig_playerMethods.getSkin.call(player),
    x,
    y,
    z,
    r,
    WeaponEnum.FIST,
    0,
    WeaponEnum.FIST,
    0,
    WeaponEnum.FIST,
    0,
  );

  spawnInfoModified.set(player.id, true);

  orig_playerMethods.spawn.call(player);
}

export function angleBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return -(90.0 - (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI);
}

export function updateSyncData(player: Player) {
  if (
    !orig_playerMethods.isConnected.call(player) ||
    orig_playerMethods.getState.call(player) !== PlayerStateEnum.ONFOOT
  ) {
    return;
  }

  Player.getInstances().forEach((i) => {
    if (i !== player && orig_playerMethods.isStreamedIn.call(player, i)) {
      sendLastSyncPacket(player, i);
    }
  });
}

export function isVehicleBike(vehicle: Vehicle) {
  return [
    448, 461, 462, 463, 468, 471, 481, 509, 510, 521, 522, 523, 581, 586,
  ].includes(orig_vehicleMethods.getModel.call(vehicle));
}

export function isVehicleArmedWithWeapon(
  vehicle: Vehicle,
  weaponId: WC_WeaponEnum,
) {
  switch (orig_vehicleMethods.getModel.call(vehicle)) {
    case 425: {
      return (
        weaponId === WC_WeaponEnum.MINIGUN ||
        weaponId === WC_WeaponEnum.ROCKETLAUNCHER
      );
    }

    case 447:
    case 464:
    case 476: {
      return weaponId === WC_WeaponEnum.M4;
    }

    case 432:
    case 520: {
      return weaponId === WC_WeaponEnum.ROCKETLAUNCHER;
    }
  }

  return false;
}

export function wasPlayerInVehicle(player: Player, time: number) {
  if (!lastVehicleTick.get(player.id)) {
    return false;
  }

  if (Date.now() - time < lastVehicleTick.get(player.id)) {
    return true;
  }

  return false;
}

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

export function wc_DeathSkipEnd(player: Player) {
  orig_playerMethods.toggleControllable.call(player, true);

  orig_playerMethods.resetWeapons.call(player);

  for (let i = 0; i < 13; i++) {
    if (syncData.get(player.id).weaponId[i]) {
      orig_playerMethods.giveWeapon.call(
        player,
        syncData.get(player.id).weaponId[i],
        syncData.get(player.id).weaponAmmo[i],
      );
    }
  }

  orig_playerMethods.setArmedWeapon.call(
    player,
    syncData.get(player.id).weapon,
  );
  orig_playerMethods.setSpecialAction.call(player, SpecialActionsEnum.NONE);
}

export function wc_SpawnForStreamedIn(player: Player) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return;
  }
  spawnPlayerForWorld(player);
  Player.getInstances().forEach((i) => {
    if (i !== player && orig_playerMethods.isStreamedIn.call(player, i)) {
      sendLastSyncPacket(player, i);
      clearAnimationsForPlayer(player, i);
    }
  });
}

export function wc_SetSpawnForStreamedIn(player: Player) {
  spawnForStreamedIn.set(player.id, true);
}

export interface IProcessDamageArgs {
  player: Player;
  issuer: Player | InvalidEnum.PLAYER_ID;
  amount: number;
  weaponId: number;
  bodyPart: number;
  bullets: number;
}

export function processDamage(editable: IProcessDamageArgs) {
  if (editable.amount < 0.0) {
    return InvalidDamageEnum.INVALID_DAMAGE;
  }

  switch (editable.amount) {
    case 3.63000011444091796875:
    case 5.940000057220458984375:
    case 5.610000133514404296875: {
      editable.amount = 2.6400001049041748046875;
      break;
    }

    case 3.30000019073486328125: {
      if (
        editable.weaponId !== WC_WeaponEnum.SHOTGUN &&
        editable.weaponId !== WC_WeaponEnum.SAWEDOFF
      ) {
        editable.amount = 2.6400001049041748046875;
      }
      break;
    }

    case 4.950000286102294921875: {
      if (isMeleeWeapon(editable.weaponId)) {
        editable.amount = 2.6400001049041748046875;
      }
      break;
    }

    case 6.270000457763671875:
    case 6.93000030517578125:
    case 7.2600002288818359375:
    case 7.9200000762939453125:
    case 8.5799999237060546875:
    case 9.24000072479248046875:
    case 11.88000011444091796875:
    case 11.22000026702880859375: {
      editable.amount = 2.6400001049041748046875;
      break;
    }

    case 9.90000057220458984375: {
      switch (editable.weaponId) {
        case (WC_WeaponEnum.REASON_VEHICLE,
        WC_WeaponEnum.VEHICLE_M4,
        WC_WeaponEnum.AK47,
        WC_WeaponEnum.M4,
        WC_WeaponEnum.SHOTGUN,
        WC_WeaponEnum.SAWEDOFF,
        WC_WeaponEnum.SHOTGSPA): {
          break;
        }

        default: {
          editable.amount = 6.6000003814697265625;
        }
      }
    }
  }

  if (
    editable.weaponId === WC_WeaponEnum.HELIBLADES &&
    editable.amount !== 330.0
  ) {
    editable.weaponId = WC_WeaponEnum.CARPARK;
  }

  if (isHighRateWeapon(editable.weaponId)) {
    if (editable.weaponId === WC_WeaponEnum.REASON_DROWN) {
      if (editable.amount > 10.0) editable.amount = 10.0;
    } else if (editable.amount > 1.0) {
      editable.amount = 1.0;
    }

    if (s_WeaponDamage[editable.weaponId] !== 1.0) {
      editable.amount *= s_WeaponDamage[editable.weaponId];
    }

    if (
      editable.weaponId === WC_WeaponEnum.SPRAYCAN ||
      editable.weaponId === WC_WeaponEnum.FIREEXTINGUISHER ||
      (editable.weaponId === WC_WeaponEnum.CARPARK &&
        editable.issuer !== InvalidEnum.PLAYER_ID)
    ) {
      if (editable.issuer === InvalidEnum.PLAYER_ID) {
        return InvalidDamageEnum.NO_ISSUER;
      }

      const { x, y, z } = orig_playerMethods.getPos.call(editable.issuer)!;
      const dist = orig_playerMethods.getDistanceFromPoint.call(
        editable.player,
        x,
        y,
        z,
      );

      if (editable.weaponId === WC_WeaponEnum.CARPARK) {
        if (dist > 15.0) {
          addRejectedHit(
            editable.issuer,
            editable.player,
            RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
            editable.weaponId,
            dist,
          );
          return InvalidDamageEnum.INVALID_DISTANCE;
        }
      } else {
        if (dist > s_WeaponRange[editable.weaponId] + 2.0) {
          addRejectedHit(
            editable.issuer,
            editable.player,
            RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
            editable.weaponId,
            dist,
            s_WeaponRange[editable.weaponId],
          );
          return InvalidDamageEnum.INVALID_DISTANCE;
        }
      }
    }

    return InvalidDamageEnum.NO_ERROR;
  }

  if (
    editable.issuer === InvalidEnum.PLAYER_ID &&
    (isBulletWeapon(editable.weaponId) || isMeleeWeapon(editable.weaponId))
  ) {
    return InvalidDamageEnum.NO_ISSUER;
  }

  if (editable.weaponId === WC_WeaponEnum.PARACHUTE) {
    editable.weaponId = WC_WeaponEnum.UNARMED;
  } else if (editable.weaponId === WC_WeaponEnum.REASON_COLLISION) {
    if (editable.amount > 165.0) {
      editable.amount = 1.0;
    } else {
      editable.amount /= 165.0;
    }
  } else if (editable.weaponId === WC_WeaponEnum.EXPLOSION) {
    editable.amount /= 82.5;

    if (editable.issuer !== InvalidEnum.PLAYER_ID) {
      if (
        orig_playerMethods.getState.call(editable.issuer) ===
        PlayerStateEnum.DRIVER
      ) {
        const vehicle = orig_playerMethods.getVehicle.call(editable.issuer);

        if (
          vehicle &&
          isVehicleArmedWithWeapon(vehicle, WC_WeaponEnum.ROCKETLAUNCHER)
        ) {
          editable.weaponId = WC_WeaponEnum.VEHICLE_ROCKETLAUNCHER;
        }
      } else if (lastExplosive.get(editable.issuer.id)) {
        editable.weaponId = lastExplosive.get(editable.issuer.id);
      }
    } else if (
      orig_playerMethods.getState.call(editable.player) ===
      PlayerStateEnum.DRIVER
    ) {
      const vehicle = orig_playerMethods.getVehicle.call(editable.player);

      if (
        vehicle &&
        isVehicleArmedWithWeapon(vehicle, WC_WeaponEnum.ROCKETLAUNCHER)
      ) {
        editable.weaponId = WC_WeaponEnum.VEHICLE_ROCKETLAUNCHER;
      }
    }
  }

  if (
    (editable.weaponId >= WC_WeaponEnum.COLT45 &&
      editable.weaponId <= WC_WeaponEnum.SNIPER) ||
    [
      WC_WeaponEnum.MINIGUN,
      WC_WeaponEnum.SPRAYCAN,
      WC_WeaponEnum.FIREEXTINGUISHER,
    ].includes(editable.weaponId)
  ) {
    if (editable.amount === 2.6400001049041748046875) {
      editable.bodyPart = editable.weaponId;
      editable.weaponId = WC_WeaponEnum.PISTOLWHIP;
    }
  }

  let melee = isMeleeWeapon(editable.weaponId);

  if (melee && orig_playerMethods.isInAnyVehicle.call(editable.issuer)) {
    return InvalidDamageEnum.INVALID_DAMAGE;
  }

  if (editable.weaponId !== WC_WeaponEnum.PISTOLWHIP) {
    switch (editable.amount) {
      // eslint-disable-next-line no-loss-of-precision
      case 4.62000036239624023437:
      case 1.32000005245208740234375:
      case 1.650000095367431640625:
      case 1.980000019073486328125:
      case 2.3100001811981201171875:
      case 2.6400001049041748046875:
      case 2.9700000286102294921875:
      case 3.96000003814697265625:
      case 4.28999996185302734375:
      case 5.280000209808349609375: {
        if (!melee) {
          debugMessage(
            editable.issuer,
            `weapon changed from ${editable.weaponId} to melee (punch & swap)`,
          );
          editable.weaponId = WC_WeaponEnum.UNARMED;
          melee = true;
        }
        break;
      }

      case 6.6000003814697265625: {
        if (!melee) {
          switch (editable.weaponId) {
            case (WC_WeaponEnum.UZI,
            WC_WeaponEnum.TEC9,
            WC_WeaponEnum.SHOTGUN,
            WC_WeaponEnum.SAWEDOFF): {
              break;
            }

            default: {
              debugMessage(
                editable.issuer,
                `weapon changed from ${editable.weaponId} to melee (punch & swap)`,
              );
              editable.weaponId = WC_WeaponEnum.UNARMED;
              melee = true;
            }
          }
        }
        break;
      }

      case 54.12000274658203125: {
        if (!melee) {
          debugMessage(
            editable.issuer,
            `weapon changed from ${editable.weaponId} to melee (punch & swap)`,
          );
          melee = true;
          editable.weaponId = WC_WeaponEnum.UNARMED;
          editable.amount = 1.32000005245208740234375;
        }

        if (
          editable.issuer !== InvalidEnum.PLAYER_ID &&
          orig_playerMethods.getFightingStyle.call(editable.issuer) !==
            FightingStylesEnum.KNEEHEAD
        ) {
          return InvalidDamageEnum.INVALID_DAMAGE;
        }
        break;
      }

      default: {
        if (melee && editable.weaponId !== WC_WeaponEnum.CHAINSAW) {
          return InvalidDamageEnum.INVALID_DAMAGE;
        }
      }
    }
  }

  if (melee) {
    const { x, y, z } = orig_playerMethods.getPos.call(editable.issuer)!;
    const dist = orig_playerMethods.getDistanceFromPoint.call(
      editable.player,
      x,
      y,
      z,
    );

    if (
      editable.weaponId >= WC_WeaponEnum.UNARMED &&
      editable.weaponId < s_WeaponRange.length &&
      dist > s_WeaponRange[editable.weaponId] + 2.0
    ) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
        editable.weaponId,
        dist,
        s_WeaponRange[editable.weaponId],
      );
      return InvalidDamageEnum.INVALID_DISTANCE;
    }
  }

  switch (editable.weaponId) {
    case WC_WeaponEnum.SHOTGSPA: {
      editable.bullets = editable.amount / 4.950000286102294921875;

      if (8.0 - editable.bullets < -0.05) {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }

      break;
    }

    case (WC_WeaponEnum.SHOTGUN, WC_WeaponEnum.SAWEDOFF): {
      editable.bullets = editable.amount / 3.30000019073486328125;

      if (15.0 - editable.bullets < -0.05) {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }

      break;
    }
  }

  if (editable.bullets) {
    const f = floatFraction(editable.bullets);

    if (f > 0.01 && f < 0.99) {
      return InvalidDamageEnum.INVALID_DAMAGE;
    }

    editable.amount /= editable.bullets;
  }

  if (editable.weaponId === WC_WeaponEnum.CHAINSAW) {
    switch (editable.amount) {
      case 6.6000003814697265625:
      case 13.5300006866455078125:
      case 16.1700000762939453125:
      case 26.40000152587890625:
      case 27.060001373291015625: {
        break;
      }

      default: {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }
    }
  } else if (editable.weaponId === WC_WeaponEnum.DEAGLE) {
    switch (editable.amount) {
      case 46.200000762939453125:
      case 23.1000003814697265625: {
        break;
      }

      default: {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }
    }
  }

  let def_amount = 0.0;

  switch (editable.weaponId) {
    case WC_WeaponEnum.COLT45:
    case WC_WeaponEnum.MP5: {
      def_amount = 8.25;
      break;
    }
    case WC_WeaponEnum.SILENCED: {
      def_amount = 13.200000762939453125;
      break;
    }
    case WC_WeaponEnum.UZI:
    case WC_WeaponEnum.TEC9: {
      def_amount = 6.6000003814697265625;
      break;
    }
    case WC_WeaponEnum.AK47:
    case WC_WeaponEnum.M4:
    case WC_WeaponEnum.VEHICLE_M4: {
      def_amount = 9.90000057220458984375;
      break;
    }
    case WC_WeaponEnum.RIFLE: {
      def_amount = 24.7500019073486328125;
      break;
    }
    case WC_WeaponEnum.SNIPER: {
      def_amount = 41.25;
      break;
    }
    case WC_WeaponEnum.MINIGUN:
    case WC_WeaponEnum.VEHICLE_MINIGUN: {
      def_amount = 46.200000762939453125;
      break;
    }
    case WC_WeaponEnum.REASON_VEHICLE: {
      def_amount = 9.90000057220458984375;
      break;
    }
  }

  if (def_amount && def_amount !== editable.amount) {
    return InvalidDamageEnum.INVALID_DAMAGE;
  }

  switch (s_DamageType[editable.weaponId]) {
    case DamageTypeEnum.MULTIPLIER: {
      if (s_WeaponDamage[editable.weaponId] !== 1.0) {
        editable.amount *= s_WeaponDamage[editable.weaponId];
      }
      break;
    }

    case DamageTypeEnum.STATIC: {
      if (editable.bullets) {
        editable.amount = s_WeaponDamage[editable.weaponId] * editable.bullets;
      } else {
        editable.amount = s_WeaponDamage[editable.weaponId];
      }
      break;
    }

    case DamageTypeEnum.RANGE:
    case DamageTypeEnum.RANGE_MULTIPLIER:
      {
        let length = 0.0;

        if (editable.issuer !== InvalidEnum.PLAYER_ID) {
          if (innerGameModeConfig.lagCompMode) {
            length = lastShot.get(editable.issuer.id).length;
          } else {
            const { x, y, z } = orig_playerMethods.getPos.call(
              editable.issuer,
            )!;
            length = orig_playerMethods.getDistanceFromPoint.call(
              editable.player,
              x,
              y,
              z,
            );
          }
        }

        for (let i = damageRangeSteps[editable.weaponId] - 1; i >= 0; i--) {
          if (
            i === 0 ||
            length >= (damageRangeRanges.get(editable.weaponId)[i] || 0)
          ) {
            if (
              s_DamageType[editable.weaponId] ===
              DamageTypeEnum.RANGE_MULTIPLIER
            ) {
              if ((damageRangeValues.get(editable.weaponId)[i] || 0) !== 1.0) {
                editable.amount *=
                  damageRangeValues.get(editable.weaponId)[i] || 0;
              }
            } else {
              if (editable.bullets) {
                editable.amount =
                  (damageRangeValues.get(editable.weaponId)[i] || 0) *
                  editable.bullets;
              } else {
                editable.amount =
                  damageRangeValues.get(editable.weaponId)[i] || 0;
              }
            }

            break;
          }
        }
      }
      break;
  }

  return InvalidDamageEnum.NO_ERROR;
}

export function inflictDamage(
  player: Player,
  amount: number,
  issuerId: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
  weaponId: WC_WeaponEnum = WC_WeaponEnum.UNKNOWN,
  bodyPart: number = 0,
  ignore_armour = false,
) {
  if (!wc_IsPlayerSpawned(player) || amount < 0.0) {
    return;
  }

  const editable: IEditableOnPlayerDamage = {
    player,
    amount,
    issuerId,
    weaponId,
    bodyPart,
  };

  if (!triggerOnPlayerDamage(editable)) {
    updateHealthBar(editable.player, true);

    if (
      editable.weaponId < WC_WeaponEnum.UNARMED ||
      editable.weaponId > WC_WeaponEnum.UNKNOWN
    ) {
      editable.weaponId = WC_WeaponEnum.UNKNOWN;
    }

    if (innerWeaponConfig.DEBUG) {
      let length = 0.0;

      if (editable.issuerId !== InvalidEnum.PLAYER_ID) {
        if (
          innerGameModeConfig.lagCompMode &&
          isBulletWeapon(editable.weaponId)
        ) {
          length = lastShot.get(editable.issuerId.id).length;
        } else {
          const { x, y, z } = orig_playerMethods.getPos.call(
            editable.issuerId,
          )!;
          length = orig_playerMethods.getDistanceFromPoint.call(
            editable.player,
            x,
            y,
            z,
          );
        }
      }

      if (!isHighRateWeapon(editable.weaponId)) {
        debugMessageAll(
          `!InflictDamage(${editable.player.id}, ${editable.amount.toFixed(4)}, ${editable.issuerId}, ${editable.weaponId}, ${editable.bodyPart}) length = ${length}`,
        );
      }
    }

    return;
  }

  if (
    editable.weaponId < WC_WeaponEnum.UNARMED ||
    editable.weaponId > WC_WeaponEnum.UNKNOWN
  ) {
    editable.weaponId = WC_WeaponEnum.UNKNOWN;
  }

  if (innerWeaponConfig.DEBUG) {
    let length = 0.0;

    if (editable.issuerId !== InvalidEnum.PLAYER_ID) {
      if (
        innerGameModeConfig.lagCompMode &&
        isBulletWeapon(editable.weaponId)
      ) {
        length = lastShot.get(editable.issuerId.id).length;
      } else {
        const { x, y, z } = orig_playerMethods.getPos.call(editable.issuerId)!;
        length = orig_playerMethods.getDistanceFromPoint.call(
          editable.player,
          x,
          y,
          z,
        );
      }
    }

    if (!isHighRateWeapon(editable.weaponId)) {
      debugMessageAll(
        `!InflictDamage(${editable.player.id}, ${editable.amount.toFixed(4)}, ${editable.issuerId}, ${editable.weaponId}, ${editable.bodyPart}) length = ${length}`,
      );
    }
  }

  const s_DamageArmourToggle = innerGameModeConfig.damageArmourToggle;

  if (
    !ignore_armour &&
    editable.weaponId !== WC_WeaponEnum.REASON_COLLISION &&
    editable.weaponId !== WC_WeaponEnum.REASON_DROWN &&
    editable.weaponId !== WC_WeaponEnum.CARPARK &&
    editable.weaponId !== WC_WeaponEnum.UNKNOWN &&
    (!s_DamageArmourToggle[0] ||
      (s_DamageArmour[editable.weaponId][0] &&
        (!s_DamageArmourToggle[1] ||
          (s_DamageArmour[editable.weaponId][1] && editable.bodyPart === 3) ||
          !s_DamageArmour[editable.weaponId][1])))
  ) {
    if (editable.amount <= 0.0) {
      editable.amount =
        playerHealth.get(editable.player.id) +
        playerArmour.get(editable.player.id);
    }

    playerArmour.set(
      editable.player.id,
      playerArmour.get(editable.player.id) - editable.amount,
    );
  } else {
    if (editable.amount <= 0.0) {
      editable.amount = playerHealth.get(editable.player.id);
    }

    playerHealth.set(
      editable.player.id,
      playerHealth.get(editable.player.id) - editable.amount,
    );
  }

  if (playerArmour.get(editable.player.id) < 0.0) {
    damageDoneArmour.set(
      editable.player.id,
      editable.amount + playerArmour.get(editable.player.id),
    );
    damageDoneHealth.set(
      editable.player.id,
      -playerArmour.get(editable.player.id),
    );
    playerHealth.set(
      editable.player.id,
      playerHealth.get(editable.player.id) +
        playerArmour.get(editable.player.id),
    );
    playerArmour.set(editable.player.id, 0);
  } else {
    damageDoneArmour.set(editable.player.id, editable.amount);
    damageDoneHealth.set(editable.player.id, 0.0);
  }

  if (playerHealth.get(editable.player.id) <= 0.0) {
    editable.amount += playerHealth.get(editable.player.id);
    damageDoneHealth.set(
      editable.player.id,
      damageDoneHealth.get(editable.player.id) +
        playerHealth.get(editable.player.id),
    );
    playerHealth.set(editable.player.id, 0.0);
  }

  triggerOnPlayerDamageDone(
    editable.player,
    editable.amount,
    editable.issuerId,
    editable.weaponId,
    editable.bodyPart,
  );
  let animLib = "PED",
    animName = "";

  if (playerHealth.get(editable.player.id) <= 0.0005) {
    const vehicle = orig_playerMethods.getVehicle.call(editable.player);

    if (vehicle) {
      orig_playerMethods.toggleControllable.call(editable.player, false);

      if (isVehicleBike(vehicle)) {
        const {
          x: vx,
          y: vy,
          z: vz,
        } = orig_vehicleMethods.getVelocity.call(vehicle);

        if (vx * vx + vy * vy + vz * vz >= 0.4) {
          animName = "BIKE_fallR";
          playerDeath(editable.player, animLib, animName, false);
        } else {
          animName = "BIKE_fall_off";
          playerDeath(editable.player, animLib, animName, false);
        }
      } else {
        if (orig_playerMethods.getVehicleSeat.call(editable.player) & 1) {
          animName = "CAR_dead_LHS";
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "CAR_dead_RHS";
          playerDeath(editable.player, animLib, animName);
        }
      }
    } else if (
      orig_playerMethods.getSpecialAction.call(editable.player) ===
      SpecialActionsEnum.USEJETPACK
    ) {
      animName = "KO_skid_back";
      playerDeath(editable.player, animLib, animName, false);
    } else {
      if (
        Date.now() / 1000 - lastVehicleEnterTime.get(editable.player.id) <
        10
      ) {
        orig_playerMethods.toggleControllable.call(editable.player, false);
      }

      const anim = orig_playerMethods.getAnimationIndex.call(editable.player);

      if (
        anim === 1250 ||
        (anim >= 1538 && anim <= 1544) ||
        editable.weaponId === WC_WeaponEnum.REASON_DROWN
      ) {
        animName = "Drown";
        playerDeath(editable.player, animLib, animName);
      } else if (anim >= 1195 && anim <= 1198) {
        animName = "KO_skid_back";
        playerDeath(editable.player, animLib, animName);
      } else if (
        editable.weaponId >= WC_WeaponEnum.SHOTGUN &&
        editable.weaponId <= WC_WeaponEnum.SHOTGSPA
      ) {
        if (isPlayerBehindPlayer(editable.issuerId, editable.player)) {
          animName = "KO_shot_front";
          makePlayerFacePlayer(editable.player, editable.issuerId, true);
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "BIKE_fall_off";
          makePlayerFacePlayer(editable.player, editable.issuerId);
          playerDeath(editable.player, animLib, animName);
        }
      } else if (
        editable.weaponId >= WC_WeaponEnum.RIFLE &&
        editable.weaponId <= WC_WeaponEnum.SNIPER
      ) {
        if (editable.bodyPart === 9) {
          animName = "KO_shot_face";
          playerDeath(editable.player, animLib, animName);
        } else if (isPlayerBehindPlayer(editable.issuerId, editable.player)) {
          animName = "KO_shot_front";
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "KO_shot_stom";
          playerDeath(editable.player, animLib, animName);
        }
      } else if (isBulletWeapon(editable.weaponId)) {
        if (editable.bodyPart === 9) {
          animName = "KO_shot_face";
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "KO_shot_front";
          playerDeath(editable.player, animLib, animName);
        }
      } else if (editable.weaponId === WC_WeaponEnum.PISTOLWHIP) {
        animName = "KO_spin_R";
        playerDeath(editable.player, animLib, animName);
      } else if (
        editable.weaponId === WC_WeaponEnum.CARPARK ||
        (isMeleeWeapon(editable.weaponId) &&
          editable.weaponId !== WC_WeaponEnum.CHAINSAW)
      ) {
        animName = "KO_skid_front";
        playerDeath(editable.player, animLib, animName);
      } else if (
        editable.weaponId === WC_WeaponEnum.SPRAYCAN ||
        editable.weaponId === WC_WeaponEnum.FIREEXTINGUISHER
      ) {
        animLib = "KNIFE";
        animName = "KILL_Knife_Ped_Die";
        playerDeath(editable.player, animLib, animName);
      } else {
        animName = "KO_skid_back";
        playerDeath(editable.player, animLib, animName);
      }
    }

    if (cBugAllowed.get(editable.player.id)) {
      useTrigger("OnPlayerDeath")!(
        editable.player.id,
        typeof editable.issuerId === "number"
          ? editable.issuerId
          : editable.issuerId.id,
        editable.weaponId,
      );
    } else {
      if (delayedDeathTimer.get(editable.player.id)) {
        clearTimeout(delayedDeathTimer.get(editable.player.id)!);
      }

      delayedDeathTimer.set(
        editable.player.id,
        setTimeout(() => {
          wc_DelayedDeath(
            editable.player,
            editable.issuerId,
            editable.weaponId,
          );
        }, 1200),
      );
    }
  }

  updateHealthBar(editable.player, true);
}

export function wc_DelayedDeath(
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  reason: number,
) {
  if (delayedDeathTimer.get(player.id)) {
    clearTimeout(delayedDeathTimer.get(player.id)!);
    delayedDeathTimer.set(player.id, null);
  }

  useTrigger("OnPlayerDeath")!(
    player.id,
    typeof issuerId === "number" ? issuerId : issuerId.id,
    reason,
  );
}

export function playerDeath(
  player: Player,
  animLib: string,
  animName: string,
  animLock = false,
  respawnTime = -1,
  freezeSync = true,
  animFreeze = true,
) {
  playerHealth.set(player.id, 0.0);
  playerArmour.set(player.id, 0.0);
  isDying.set(player.id, true);

  if (delayedDeathTimer.get(player.id)) {
    clearTimeout(delayedDeathTimer.get(player.id)!);
    delayedDeathTimer.set(player.id, null);
  }

  if (orig_playerMethods.isTeleportAllowed.call(player)) {
    restorePlayerTeleport.set(player.id, true);
    orig_playerMethods.allowTeleport.call(player, false);
  }

  lastDeathTick.set(player.id, Date.now());

  const action = orig_playerMethods.getSpecialAction.call(player);

  if (
    action !== SpecialActionsEnum.NONE &&
    action !== SpecialActionsEnum.DUCK
  ) {
    if (action === SpecialActionsEnum.USEJETPACK) {
      orig_playerMethods.clearAnimations.call(player);
    }

    orig_playerMethods.setSpecialAction.call(player, SpecialActionsEnum.NONE);

    if (action === SpecialActionsEnum.USEJETPACK) {
      const {
        x: vx,
        y: vy,
        z: vz,
      } = orig_playerMethods.getVelocity.call(player);
      orig_playerMethods.setVelocity.call(player, vx, vy, vz);
    }
  }

  const editable: IEditableOnPlayerPrepareDeath = { animLock, respawnTime };

  triggerOnPlayerPrepareDeath(player, animLib, animName, editable);

  updateHealthBar(player);
  freezeSyncPacket(player, freezeSync);

  if (editable.respawnTime === -1) {
    editable.respawnTime = innerGameModeConfig.respawnTime;
  }

  if (animLib && animName) {
    orig_playerMethods.applyAnimation.call(
      player,
      animLib,
      animName,
      4.1,
      false,
      editable.animLock,
      editable.animLock,
      animFreeze,
      0,
      1,
    );
  }

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
  }

  deathTimer.set(
    player.id,
    setTimeout(() => {
      wc_PlayerDeathRespawn(player);
    }, editable.respawnTime),
  );

  if (
    healthBarForeground.get(player.id) &&
    healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    orig_PlayerTextDrawHide(player.id, healthBarForeground.get(player.id)!.id);
  }

  const dynCp = DynamicCheckpoint.getPlayerVisible(player);
  const dynRaceCp = DynamicRaceCP.getPlayerVisible(player);
  if (dynCp && dynCp.isPlayerIn(player)) {
    useTrigger("OnPlayerLeaveDynamicCP")!(player.id, dynCp.id);
  }

  if (dynRaceCp && dynRaceCp.isPlayerIn(player)) {
    useTrigger("OnPlayerLeaveDynamicRaceCP")!(player.id, dynRaceCp.id);
  }
}

export function onRejectedHit(player: Player, hit: RejectedHit) {
  if (innerWeaponConfig.DEBUG) {
    let output = "";
    const reason = hit.reason;
    const i1 = hit.info1;
    const i2 = hit.info2;
    const i3 = hit.info3;
    const weapon = hit.weapon;

    const name = wc_GetWeaponName(weapon);

    output = `(${name} -> ${hit.name}) ${g_HitRejectReasons(reason + "", [i1, i2, i3])}`;

    debugMessageRed(player, `Rejected hit: ${output}`);
  }

  triggerOnRejectedHit(player, hit);
}

export function onPlayerDeathFinished(player: Player, cancelable: boolean) {
  if (playerHealth.get(player.id) === 0.0) {
    playerHealth.set(player.id, playerMaxHealth.get(player.id));
  }

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
    deathTimer.set(player.id, null);
  }

  const retVal = triggerOnPlayerDeathFinished(player);

  if (!retVal && cancelable) {
    return 0;
  }

  orig_playerMethods.resetWeapons.call(player);

  return 1;
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

export function wc_DamageFeedUpdate(player: Player) {
  damageFeedTimer.set(player.id, null);

  if (
    orig_playerMethods.isConnected.call(player) &&
    isDamageFeedActive(player)
  ) {
    damageFeedUpdate(player, true);
  }
}

export function damageFeedUpdate(player: Player, modified = false) {
  if (!isDamageFeedActive(player)) {
    if (
      damageFeedGiven.get(player.id) &&
      damageFeedGiven.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        damageFeedGiven.get(player.id)!.id
      ] = false;
      damageFeedGiven.get(player.id)!.destroy();
      damageFeedGiven.set(player.id, null);
    }

    if (
      damageFeedTaken.get(player.id) &&
      damageFeedTaken.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        damageFeedTaken.get(player.id)!.id
      ] = false;
      damageFeedTaken.get(player.id)!.destroy();
      damageFeedTaken.set(player.id, null);
    }

    return;
  }

  if (
    !damageFeedGiven.get(player.id) ||
    damageFeedGiven.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    const td = new TextDraw({ player, x: 200.0, y: 365.0, text: "_" }).create();

    if (td.id === InvalidEnum.TEXT_DRAW) {
      console.log("(wc) WARN: Unable to create damage feed textDraw");
    } else {
      internalPlayerTextDraw.get(player.id)[td.id] = true;
      orig_PlayerTextDrawLetterSize(player.id, td.id, 0.2, 0.9);
      orig_PlayerTextDrawColor(
        player.id,
        td.id,
        innerWeaponConfig.FEED_GIVEN_COLOR,
      );
      orig_PlayerTextDrawAlignment(player.id, td.id, 2);
      orig_PlayerTextDrawSetOutline(player.id, td.id, 1);
      orig_PlayerTextDrawBackgroundColor(player.id, td.id, 0x0000001a);
      damageFeedGiven.set(player.id, td);
    }
  }

  if (
    !damageFeedTaken.get(player.id) ||
    damageFeedTaken.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    const td = new TextDraw({ player, x: 440.0, y: 365.0, text: "_" }).create();

    if (td.id === InvalidEnum.TEXT_DRAW) {
      console.log("(wc) WARN: Unable to create damage feed textDraw");
    } else {
      internalPlayerTextDraw.get(player.id)[td.id] = true;

      orig_PlayerTextDrawLetterSize(player.id, td.id, 0.2, 0.9);
      orig_PlayerTextDrawColor(
        player.id,
        td.id,
        innerWeaponConfig.FEED_TAKEN_COLOR,
      );
      orig_PlayerTextDrawAlignment(player.id, td.id, 2);
      orig_PlayerTextDrawSetOutline(player.id, td.id, 1);
      orig_PlayerTextDrawBackgroundColor(player.id, td.id, 0x0000001a);

      damageFeedTaken.set(player.id, td);
    }
  }

  let tick = Date.now();
  if (tick === 0) tick = 1;
  let lowest_tick = tick + 1;

  for (
    let i = 0, j = 0;
    i < damageFeedHitsGiven.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsGiven.get(player.id)[i]?.tick) {
      break;
    }

    if (
      tick - damageFeedHitsGiven.get(player.id)[i]!.tick >=
      innerGameModeConfig.damageFeedHideDelay
    ) {
      modified = true;

      for (j = i; j < damageFeedHitsGiven.get(player.id).length - 1; j++) {
        if (!damageFeedHitsGiven.get(player.id)[j]) {
          damageFeedHitsGiven.get(player.id)[j] = new DamageFeedHit();
        }
        damageFeedHitsGiven.get(player.id)[j]!.tick = 0;
      }

      break;
    }

    if (damageFeedHitsGiven.get(player.id)[i]!.tick < lowest_tick) {
      lowest_tick = damageFeedHitsGiven.get(player.id)[i]!.tick;
    }
  }

  for (
    let i = 0, j = 0;
    i < damageFeedHitsTaken.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsTaken.get(player.id)[i]?.tick) {
      break;
    }

    if (
      tick - damageFeedHitsTaken.get(player.id)[i]!.tick >=
      innerGameModeConfig.damageFeedHideDelay
    ) {
      modified = true;

      for (j = i; j < damageFeedHitsTaken.get(player.id).length - 1; j++) {
        if (!damageFeedHitsTaken.get(player.id)[j]) {
          damageFeedHitsTaken.get(player.id)[j] = new DamageFeedHit();
        }
        damageFeedHitsTaken.get(player.id)[j]!.tick = 0;
      }

      break;
    }

    if (damageFeedHitsTaken.get(player.id)[i]!.tick < lowest_tick) {
      lowest_tick = damageFeedHitsTaken.get(player.id)[i]!.tick;
    }
  }

  if (damageFeedTimer.get(player.id)) {
    clearTimeout(damageFeedTimer.get(player.id)!);
  }

  if (
    tick - damageFeedLastUpdate.get(player.id) <
      innerGameModeConfig.damageFeedMaxUpdateRate &&
    modified
  ) {
    damageFeedTimer.set(
      player.id,
      setTimeout(
        () => {
          wc_DamageFeedUpdate(player);
        },
        innerGameModeConfig.damageFeedMaxUpdateRate -
          (tick - damageFeedLastUpdate.get(player.id)),
      ),
    );
  } else {
    if (lowest_tick === tick + 1) {
      damageFeedTimer.set(player.id, null);
      modified = true;
    } else {
      damageFeedTimer.set(
        player.id,
        setTimeout(
          () => {
            wc_DamageFeedUpdate(player);
          },
          innerGameModeConfig.damageFeedHideDelay - (tick - lowest_tick) + 10,
        ),
      );
    }

    if (modified) {
      damageFeedUpdateText(player);

      damageFeedLastUpdate.set(player.id, tick);
    }
  }
}

export function damageFeedUpdateText(player: Player) {
  let buf = "";

  for (
    let i = 0, weapon = "";
    i < damageFeedHitsGiven.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsGiven.get(player.id)[i]?.tick) {
      break;
    }

    if (damageFeedHitsGiven.get(player.id)[i]!.weapon === -1) {
      weapon = "Multiple";
    } else {
      weapon = wc_GetWeaponName(damageFeedHitsGiven.get(player.id)[i]!.weapon);
    }

    if (
      damageFeedHitsGiven.get(player.id)[i]!.issuer === InvalidEnum.PLAYER_ID
    ) {
      buf = `${buf}${weapon} +${(damageFeedHitsGiven.get(player.id)[i]!.amount + 0.009).toFixed(2)}~n~`;
    } else {
      buf = `${buf}${damageFeedHitsGiven.get(player.id)[i]!.name} - ${weapon} +${(damageFeedHitsGiven.get(player.id)[i]!.amount + 0.009).toFixed(2)} (${playerHealth.get(damageFeedHitsGiven.get(player.id)[i]!.issuer).toFixed(2)})~n~`;
    }
  }

  if (
    !damageFeedGiven.get(player.id) ||
    damageFeedGiven.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    console.log("(wc) WARN: Doesn't have feed textDraw when needed");
  } else if (
    internalPlayerTextDraw.get(player.id)[damageFeedGiven.get(player.id)!.id]
  ) {
    if (buf) {
      orig_PlayerTextDrawSetString(
        player.id,
        damageFeedGiven.get(player.id)!.id,
        I18n.encodeToBuf(buf, player.charset),
      );
      orig_PlayerTextDrawShow(player.id, damageFeedGiven.get(player.id)!.id);
    } else {
      orig_PlayerTextDrawHide(player.id, damageFeedGiven.get(player.id)!.id);
    }
  }

  buf = "";

  for (
    let i = 0, weapon = "";
    i < damageFeedHitsTaken.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsTaken.get(player.id)[i]?.tick) {
      break;
    }

    if (damageFeedHitsTaken.get(player.id)[i]!.weapon === -1) {
      weapon = "Multiple";
    } else {
      weapon = wc_GetWeaponName(damageFeedHitsTaken.get(player.id)[i]!.weapon);
    }

    if (
      damageFeedHitsTaken.get(player.id)[i]!.issuer === InvalidEnum.PLAYER_ID
    ) {
      buf = `${buf}${weapon} +${(damageFeedHitsTaken.get(player.id)[i]!.amount + 0.009).toFixed(2)} (${playerHealth.get(player.id).toFixed(2)})~n~`;
    } else {
      buf = `${buf}${damageFeedHitsTaken.get(player.id)[i]!.name} - ${weapon} -${(damageFeedHitsTaken.get(player.id)[i]!.amount + 0.009).toFixed(2)} (${playerHealth.get(damageFeedHitsGiven.get(player.id)[i]!.issuer).toFixed(2)})~n~`;
    }
  }

  if (
    !damageFeedTaken.get(player.id) ||
    damageFeedTaken.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    console.log("(wc) WARN: Doesn't have feed textDraw when needed");
  } else if (
    internalPlayerTextDraw.get(player.id)[damageFeedTaken.get(player.id)!.id]
  ) {
    if (buf) {
      orig_PlayerTextDrawSetString(
        player.id,
        damageFeedTaken.get(player.id)!.id,
        I18n.encodeToBuf(buf, player.charset),
      );
      orig_PlayerTextDrawShow(player.id, damageFeedTaken.get(player.id)!.id);
    } else {
      orig_PlayerTextDrawHide(player.id, damageFeedTaken.get(player.id)!.id);
    }
  }
}

export function damageFeedAddHitGiven(
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  amount: number,
  weapon: number,
) {
  Player.getInstances().forEach((i) => {
    if (spectating.get(i.id) === player.id && i !== player) {
      damageFeedAddHit(
        damageFeedHitsGiven.get(i.id),
        i,
        issuerId,
        amount,
        weapon,
      );
    }
  });

  damageFeedAddHit(
    damageFeedHitsGiven.get(player.id),
    player,
    issuerId,
    amount,
    weapon,
  );
}

export function damageFeedAddHitTaken(
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  amount: number,
  weapon: number,
) {
  Player.getInstances().forEach((i) => {
    if (spectating.get(i.id) === player.id && i !== player) {
      damageFeedAddHit(
        damageFeedHitsTaken.get(i.id),
        i,
        issuerId,
        amount,
        weapon,
      );
    }
  });

  damageFeedAddHit(
    damageFeedHitsTaken.get(player.id),
    player,
    issuerId,
    amount,
    weapon,
  );
}

export function damageFeedAddHit(
  arr: (DamageFeedHit | null)[],
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  amount: number,
  weapon: number,
) {
  if (!isDamageFeedActive(player)) {
    return;
  }

  let tick = Date.now();
  if (tick === 0) tick = 1;
  let idx = -1;

  for (let i = 0; i < arr.length - 1; i++) {
    if (!arr[i] || !arr[i]!.tick) {
      break;
    }

    if (tick - arr[i]!.tick >= innerGameModeConfig.damageFeedHideDelay) {
      damageFeedRemoveHit(arr, i);
      break;
    }

    if (arr[i]!.issuer === issuerId) {
      // // Multiple weapons
      // if (arr[i]!.weapon !== weapon) {
      //   //weapon = -1;
      // }

      amount += arr[i]!.amount;
      idx = i;
      break;
    }
  }

  if (idx === -1) {
    idx = 0;

    for (let i = arr.length - 1; i >= 1; i--) {
      arr[i] = arr[i - 1];
    }
  }

  if (!arr[idx]) {
    arr[idx] = new DamageFeedHit();
  }

  arr[idx]!.tick = tick;
  arr[idx]!.amount = amount;
  arr[idx]!.issuer = typeof issuerId === "number" ? issuerId : issuerId.id;
  arr[idx]!.weapon = weapon;

  if (typeof issuerId !== "number") {
    arr[idx]!.name = orig_playerMethods.getName.call(issuerId);
  }

  damageFeedUpdate(player, true);
}

export function damageFeedRemoveHit(
  arr: (DamageFeedHit | null)[],
  idx: number,
) {
  for (let i = 0; i < arr.length; i++) {
    if (i >= idx) {
      if (!arr[i]) {
        arr[i] = new DamageFeedHit();
      }
      arr[i]!.tick = 0;
    }
  }
}

export function saveSyncData(player: Player) {
  syncData.get(player.id).health = orig_playerMethods.getHealth.call(player);
  syncData.get(player.id).armour = orig_playerMethods.getArmour.call(player);

  const { x, y, z } = orig_playerMethods.getPos.call(player)!;
  syncData.get(player.id).posX = x;
  syncData.get(player.id).posY = y;
  syncData.get(player.id).posZ = z;
  syncData.get(player.id).posA = orig_playerMethods.getFacingAngle.call(player);

  syncData.get(player.id).skin = orig_playerMethods.getSkin.call(player);
  syncData.get(player.id).team = orig_playerMethods.getTeam.call(player);

  syncData.get(player.id).weapon = orig_playerMethods.getWeapon.call(player);

  for (let i = 0; i < 13; i++) {
    const { ammo, weapons } = orig_playerMethods.getWeaponData.call(player, i);
    syncData.get(player.id).weaponId[i] = weapons;
    syncData.get(player.id).weaponAmmo[i] = ammo;
  }
}

export function makePlayerFacePlayer(
  player: Player,
  target: Player | InvalidEnum.PLAYER_ID,
  opposite = false,
  forceSync = true,
) {
  if (target === InvalidEnum.PLAYER_ID) return;

  const { x: x1, y: y1 } = orig_playerMethods.getPos.call(player)!;
  const { x: x2, y: y2 } = orig_playerMethods.getPos.call(target)!;

  let angle = angleBetweenPoints(x2, y2, x1, y1);

  if (opposite) {
    angle += 180.0;
    if (angle > 360.0) angle -= 360.0;
  }

  if (angle < 0.0) angle += 360.0;
  if (angle > 360.0) angle -= 360.0;

  orig_playerMethods.setFacingAngle.call(player, angle);

  if (forceSync) {
    setFakeFacingAngle(player, angle);
    updateSyncData(player);
  }
}

export function isPlayerBehindPlayer(
  player: Player | InvalidEnum.PLAYER_ID,
  target: Player,
  diff = 90.0,
) {
  if (player === InvalidEnum.PLAYER_ID) return false;

  const { x: x1, y: y1 } = orig_playerMethods.getPos.call(player)!;
  const { x: x2, y: y2 } = orig_playerMethods.getPos.call(target)!;

  let ang = orig_playerMethods.getFacingAngle.call(target);

  let angDiff = angleBetweenPoints(x1, y1, x2, y2);

  if (angDiff < 0.0) angDiff += 360.0;
  if (angDiff > 360.0) angDiff -= 360.0;

  ang = ang - angDiff;

  if (ang > 180.0) ang -= 360.0;
  if (ang < -180.0) ang += 360.0;

  return Math.abs(ang) > diff;
}

export function addRejectedHit(
  player: Player | InvalidEnum.PLAYER_ID,
  damaged: Player | InvalidEnum.PLAYER_ID,
  reason: number,
  weapon: number,
  i1 = 0,
  i2 = 0,
  i3 = 0,
) {
  if (
    typeof player !== "number" &&
    player.id >= 0 &&
    player.id < LimitsEnum.MAX_PLAYERS
  ) {
    let idx = rejectedHitsIdx.get(player.id);

    if (
      rejectedHits.get(player.id)[idx] &&
      rejectedHits.get(player.id)[idx]!.time
    ) {
      idx += 1;

      if (idx >= rejectedHits.get(player.id).length) {
        idx = 0;
      }

      rejectedHitsIdx.set(player.id, idx);
    }

    const time = Date.now() / 1000;
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const second = new Date().getSeconds();

    if (!rejectedHits.get(player.id)[idx]) {
      rejectedHits.get(player.id)[idx] = new RejectedHit();
    }

    rejectedHits.get(player.id)[idx]!.reason = reason;
    rejectedHits.get(player.id)[idx]!.time = time;
    rejectedHits.get(player.id)[idx]!.weapon = weapon;
    rejectedHits.get(player.id)[idx]!.hour = hour;
    rejectedHits.get(player.id)[idx]!.minute = minute;
    rejectedHits.get(player.id)[idx]!.second = second;
    rejectedHits.get(player.id)[idx]!.info1 = i1;
    rejectedHits.get(player.id)[idx]!.info2 = i2;
    rejectedHits.get(player.id)[idx]!.info3 = i3;

    if (
      typeof damaged !== "number" &&
      damaged.id >= 0 &&
      damaged.id < LimitsEnum.MAX_PLAYERS
    ) {
      rejectedHits.get(player.id)[idx]!.name =
        orig_playerMethods.getName.call(damaged);
    } else {
      rejectedHits.get(player.id)[idx]!.name = "#\0";
    }

    onRejectedHit(
      player,
      rejectedHits.get(typeof player === "number" ? player : player.id)[idx]!,
    );
  }
}

export function spawnPlayerForWorld(player: Player) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  const bs = new BitStream();

  bs.writeValue([PacketRpcValueType.UInt32, player.id]);

  Player.getInstances().forEach((i) => {
    if (i !== player) {
      bs.sendRPC(i, wc_RPC_REQUEST_SPAWN);
    }
  });

  bs.delete();

  return 1;
}

export function freezeSyncPacket(player: Player, toggle: boolean) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  lastSyncData.get(player.id)!.keys = 0;
  lastSyncData.get(player.id)!.udKey = 0;
  lastSyncData.get(player.id)!.lrKey = 0;
  lastSyncData.get(player.id)!.specialAction = SpecialActionsEnum.NONE;
  lastSyncData.get(player.id)!.velocity = [0.0, 0.0, 0.0];

  syncDataFrozen.set(player.id, toggle);

  return 1;
}

export function setFakeHealth(player: Player, health: number) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  fakeHealth.set(player.id, health);

  return 1;
}

export function setFakeArmour(player: Player, armour: number) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  fakeArmour.set(player.id, armour);

  return 1;
}

export function getRotationQuaternion(x: number, y: number, z: number) {
  const cx = Math.cos(-0.5 * x);
  const sx = Math.sin(-0.5 * x);
  const cy = Math.cos(-0.5 * y);
  const sy = Math.sin(-0.5 * y);
  const cz = Math.cos(-0.5 * z);
  const sz = Math.sin(-0.5 * z);

  const qw = cx * cy * cz + sx * sy * sz;
  const qx = cx * sy * sz + sx * cy * cz;
  const qy = cx * sy * cz - sx * cy * sz;
  const qz = cx * cy * sz - sx * sy * cz;

  return { qw, qx, qy, qz };
}

export function setFakeFacingAngle(player: Player, angle = 0x7fffffff) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  const { qw, qx, qy, qz } = getRotationQuaternion(0.0, 0.0, angle);

  fakeQuat.set(player.id, [qw, qx, qy, qz]);

  return 1;
}

export function sendLastSyncPacket(
  player: Player,
  toPlayer: Player,
  animation = 0,
) {
  if (
    !orig_playerMethods.isConnected.call(player) ||
    !orig_playerMethods.isConnected.call(toPlayer)
  ) {
    return 0;
  }

  const bs = new BitStream();

  bs.writeValue(
    [PacketRpcValueType.UInt8, wc_PLAYER_SYNC],
    [PacketRpcValueType.UInt16, player.id],
  );

  // if (s_FakeQuat.get(player.id)[0] === s_FakeQuat.get(player.id)[0]) { ????
  lastSyncData.get(player.id).quaternion = [...fakeQuat.get(player.id)];
  // }

  if (fakeHealth.get(player.id) !== 255) {
    lastSyncData.get(player.id).health = fakeHealth.get(player.id);
  }

  if (fakeArmour.get(player.id) !== 255) {
    lastSyncData.get(player.id).armour = fakeArmour.get(player.id);
  }

  if (wc_IsPlayerPaused(player)) {
    lastSyncData.get(player.id).velocity = [0.0, 0.0, 0.0];
  }

  if (!animation) {
    lastSyncData.get(player.id).animationId = 0;
    lastSyncData.get(player.id).animationFlags = 0;
  }

  const ofs = new OnFootSync(bs);
  ofs.writeSync(lastSyncData.get(player.id), true);
  ofs.sendPacket(toPlayer); // PR_RELIABLE_SEQUENCED
  ofs.delete();

  return 1;
}

export function clearAnimationsForPlayer(player: Player, forPlayer: Player) {
  if (
    !orig_playerMethods.isConnected.call(player) ||
    !orig_playerMethods.isConnected.call(forPlayer)
  ) {
    return 0;
  }

  const bs = new BitStream();

  bs.writeValue([PacketRpcValueType.UInt16, player.id]);
  bs.sendRPC(forPlayer, wc_RPC_CLEAR_ANIMATIONS);
  bs.delete();

  return 1;
}

export function wc_SecondKnifeAnim(player: Player) {
  const animLib = "KNIFE",
    animName = "KILL_Knife_Ped_Die";
  orig_playerMethods.applyAnimation.call(
    player,
    animLib,
    animName,
    4.1,
    false,
    true,
    true,
    true,
    3000,
    1,
  );
}

export function wc_PlayerDeathRespawn(player: Player) {
  if (!isDying.get(player.id)) {
    return;
  }

  isDying.set(player.id, false);

  if (!onPlayerDeathFinished(player, true)) {
    updateHealthBar(player);
    setFakeFacingAngle(player);
    freezeSyncPacket(player, false);

    return;
  }

  isDying.set(player.id, true);
  trueDeath.set(player.id, false);

  if (orig_playerMethods.isInAnyVehicle.call(player)) {
    const { x, y, z } = orig_playerMethods.getPos.call(player)!;
    orig_playerMethods.setPos.call(player, x, y, z);
  }

  orig_playerMethods.setVirtualWorld.call(
    player,
    innerWeaponConfig.DEATH_WORLD,
  );
  setFakeFacingAngle(player);
  orig_playerMethods.toggleSpectating.call(player, true);
  orig_playerMethods.toggleSpectating.call(player, false);
}

export function onInvalidWeaponDamage(
  player: Player,
  damaged: Player,
  amount: number,
  weapon: number,
  bodyPart: number,
  error: InvalidDamageEnum,
  given: boolean,
) {
  debugMessageRedAll(
    `OnInvalidWeaponDamage(${player.id}, ${damaged.id}, ${amount}, ${weapon}, ${bodyPart}, ${error}, ${given}})`,
  );

  triggerOnInvalidWeaponDamage(
    player,
    damaged,
    amount,
    weapon,
    bodyPart,
    error,
    given,
  );
}

export function onPlayerDamageDone(
  player: Player,
  amount: number,
  issuer: Player | InvalidEnum.PLAYER_ID,
  weapon: number,
  bodyPart: number,
) {
  const idx = previousHitI.get(player.id);

  previousHitI.set(
    player.id,
    (previousHitI.get(player.id) - 1) % previousHits.get(player.id).length,
  );

  if (previousHitI.get(player.id) < 0) {
    previousHitI.set(
      player.id,
      previousHitI.get(player.id) + previousHits.get(player.id).length,
    );
  }

  previousHits.get(player.id)[idx].tick = Date.now();
  previousHits.get(player.id)[idx].issuer =
    typeof issuer === "number" ? issuer : issuer.id;
  previousHits.get(player.id)[idx].weapon = weapon;
  previousHits.get(player.id)[idx].amount = amount;
  previousHits.get(player.id)[idx].bodyPart = bodyPart;
  previousHits.get(player.id)[idx].health = damageDoneHealth.get(player.id);
  previousHits.get(player.id)[idx].armour = damageDoneArmour.get(player.id);

  if (!isHighRateWeapon(weapon)) {
    debugMessageAll(
      `OnPlayerDamageDone(${typeof issuer === "number" ? issuer : issuer.id} did ${amount} to ${player.id} with ${weapon} on bodyPart ${bodyPart})`,
    );

    if (innerGameModeConfig.damageTakenSound) {
      orig_playerMethods.playSound.call(
        player,
        innerGameModeConfig.damageTakenSound,
        0.0,
        0.0,
        0.0,
      );

      Player.getInstances().forEach((i) => {
        if (spectating.get(i.id) === player.id && i !== player) {
          orig_playerMethods.playSound.call(
            i,
            innerGameModeConfig.damageTakenSound,
            0.0,
            0.0,
            0.0,
          );
        }
      });
    }

    if (
      innerGameModeConfig.damageGivenSound &&
      issuer !== InvalidEnum.PLAYER_ID
    ) {
      orig_playerMethods.playSound.call(
        issuer,
        innerGameModeConfig.damageGivenSound,
        0.0,
        0.0,
        0.0,
      );

      Player.getInstances().forEach((i) => {
        if (spectating.get(i.id) === issuer.id && i !== issuer) {
          orig_playerMethods.playSound.call(
            i,
            innerGameModeConfig.damageGivenSound,
            0.0,
            0.0,
            0.0,
          );
        }
      });
    }
  }

  if (issuer !== InvalidEnum.PLAYER_ID) {
    damageFeedAddHitGiven(issuer, player, amount, weapon);
  }

  damageFeedAddHitTaken(player, issuer, amount, weapon);

  triggerOnPlayerDamageDone(player, amount, issuer, weapon, bodyPart);
}
