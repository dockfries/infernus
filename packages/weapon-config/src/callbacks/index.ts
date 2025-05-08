import {
  BulletHitTypesEnum,
  DynamicCheckPointEvent,
  DynamicPickupEvent,
  DynamicRaceCPEvent,
  GameMode,
  InvalidEnum,
  KeysEnum,
  LimitsEnum,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  SpecialActionsEnum,
  useTrigger,
  Vehicle,
  VehicleEvent,
  WeaponEnum,
} from "@infernus/core";
import {
  addRejectedHit,
  angleBetweenPoints,
  clearAnimationsForPlayer,
  damageFeedUpdate,
  freezeSyncPacket,
  hasSameTeam,
  inflictDamage,
  IProcessDamageArgs,
  isVehicleArmedWithWeapon,
  onPlayerDamageDone,
  onPlayerDeathFinished,
  playerDeath,
  processDamage,
  removeDefaultVendingMachines,
  saveSyncData,
  scriptExit,
  scriptInit,
  sendLastSyncPacket,
  setFakeFacingAngle,
  setHealthBarVisible,
  spawnPlayerInPlace,
  updateHealthBar,
  updatePlayerVirtualWorld,
  wasPlayerInVehicle,
  wc_DeathSkipEnd,
  wc_SecondKnifeAnim,
  wc_SetSpawnForStreamedIn,
  wc_SpawnForStreamedIn,
  wc_VendingMachineUsed,
} from "../functions/internal";
import {
  playerMaxHealth,
  playerHealth,
  playerMaxArmour,
  playerArmour,
  lastExplosive,
  lastShotIdx,
  lastShot,
  lastHitIdx,
  rejectedHitsIdx,
  shotsFired,
  hitsIssued,
  playerTeam,
  isDying,
  beingResynced,
  spawnForStreamedIn,
  world,
  lastAnim,
  lastZVelo,
  lastZ,
  lastUpdate,
  damageFeedTimer,
  damageFeedLastUpdate,
  spectating,
  healthBarVisible,
  lastSentHealth,
  lastSentArmour,
  lastStop,
  lastVehicleEnterTime,
  trueDeath,
  inClassSelection,
  forceClassSelection,
  playerClass,
  spawnInfoModified,
  playerFallbackSpawnInfo,
  deathSkip,
  lastVehicleTick,
  previousHitI,
  cBugAllowed,
  cBugFroze,
  deathTimer,
  delayedDeathTimer,
  damageFeedPlayer,
  enableHealthBar,
  fakeHealth,
  fakeArmour,
  tempDataWritten,
  syncDataFrozen,
  gogglesUsed,
  restorePlayerTeleport,
  blockAdminTeleport,
  healthBarForeground,
  internalPlayerTextDraw,
  damageFeedGiven,
  damageFeedTaken,
  previousHits,
  rejectedHits,
  damageFeedHitsGiven,
  damageFeedHitsTaken,
  alreadyConnected,
  firstSpawn,
  RejectedHit,
  DamageFeedHit,
  knifeTimeout,
  lastVehicleShooter,
  vendingUseTimer,
  syncData,
  SpawnInfo,
  playerSpawnInfo,
  classSpawnInfo,
  deathSkipTick,
  damageDoneHealth,
  damageDoneArmour,
  lastDeathTick,
  vehicleRespawnTimer,
  vehicleAlive,
  lastSyncData,
  tempSyncData,
  lastHitTicks,
  lastHitWeapons,
  lastShotTicks,
  lastShotWeapons,
} from "../struct";
import { innerGameModeConfig, innerWeaponConfig } from "../config";
import {
  InvalidDamageEnum,
  RejectedReasonEnum,
  VendingMachineIndex,
  WC_WeaponEnum,
} from "../enums";
import { orig_playerMethods, orig_vehicleMethods } from "../hooks/origin";
import {
  debugMessage,
  debugMessageRed,
  debugMessageRedAll,
} from "../utils/debug";
import {
  IEditableOnPlayerDamage,
  IEditableOnPlayerPrepareDeath,
  IEditableOnPlayerUseVendingMachine,
  triggerOnInvalidWeaponDamage,
  triggerOnPlayerDamage,
  triggerOnPlayerDamageDone,
  triggerOnPlayerPrepareDeath,
  triggerOnPlayerUseVendingMachine,
} from "./custom";
import {
  wc_GetPlayerArmour,
  wc_GetPlayerHealth,
  wc_IsPlayerTeleportAllowed,
  wcc_setPlayerHealth,
} from "../hooks";
import {
  averageHitRate,
  averageShootRate,
  isBulletWeapon,
  isHighRateWeapon,
  isMeleeWeapon,
  resyncPlayer,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "../functions/public";
import {
  s_MaxWeaponShootRate,
  s_ValidDamageGiven,
  s_ValidDamageTaken,
  s_WeaponDamage,
  s_WeaponRange,
  sc_VendingMachines,
} from "../constants";

GameMode.onInit(({ next }) => {
  scriptInit();
  return next();
});

GameMode.onExit(({ next }) => {
  scriptExit();
  return next();
});

PlayerEvent.onConnect(({ player, next }) => {
  const tick = Date.now();

  playerMaxHealth.set(player.id, 100.0);
  playerHealth.set(player.id, 100.0);
  playerMaxArmour.set(player.id, 100.0);
  playerArmour.set(player.id, 0.0);
  lastExplosive.set(player.id, WC_WeaponEnum.UNARMED);
  lastShotIdx.set(player.id, 0);
  lastShot.get(player.id).tick = 0;
  lastHitIdx.set(player.id, 0);
  rejectedHitsIdx.set(player.id, 0);
  shotsFired.set(player.id, 0);
  hitsIssued.set(player.id, 0);
  playerTeam.set(player.id, InvalidEnum.NO_TEAM);
  isDying.set(player.id, false);
  beingResynced.set(player.id, false);
  spawnForStreamedIn.set(player.id, false);
  world.set(player.id, 0);
  lastAnim.set(player.id, -1);
  lastZVelo.set(player.id, 0.0);
  lastZ.set(player.id, 0.0);
  lastUpdate.set(player.id, tick);
  damageFeedTimer.set(player.id, null);
  damageFeedLastUpdate.set(player.id, tick);
  spectating.set(player.id, InvalidEnum.PLAYER_ID);
  healthBarVisible.set(player.id, false);
  lastSentHealth.set(player.id, 0);
  lastSentArmour.set(player.id, 0);
  lastStop.set(player.id, tick);
  lastVehicleEnterTime.set(player.id, 0);
  trueDeath.set(player.id, true);
  inClassSelection.set(player.id, false);
  forceClassSelection.set(player.id, false);
  playerClass.set(player.id, -2);
  spawnInfoModified.set(player.id, false);
  playerFallbackSpawnInfo.get(player.id).skin = -1;
  deathSkip.set(player.id, 0);
  lastVehicleTick.set(player.id, 0);
  previousHitI.set(player.id, 0);
  cBugAllowed.set(player.id, innerGameModeConfig.cBugGlobal);
  cBugFroze.set(player.id, 0);
  deathTimer.set(player.id, null);
  delayedDeathTimer.set(player.id, null);
  damageFeedPlayer.set(player.id, -1);
  enableHealthBar.set(player.id, true);

  fakeHealth.set(player.id, 255);
  fakeArmour.set(player.id, 255);
  tempDataWritten.set(player.id, false);
  syncDataFrozen.set(player.id, false);
  gogglesUsed.set(player.id, 0);

  restorePlayerTeleport.set(player.id, false);

  blockAdminTeleport.set(player.id, false);

  if (
    healthBarForeground.get(player.id) &&
    healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalPlayerTextDraw.get(player.id)[
      healthBarForeground.get(player.id)!.id
    ] = false;
    healthBarForeground.set(player.id, null);
  }

  if (
    damageFeedGiven.get(player.id) &&
    damageFeedGiven.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalPlayerTextDraw.get(player.id)[damageFeedGiven.get(player.id)!.id] =
      false;
    damageFeedGiven.set(player.id, null);
  }

  if (
    damageFeedTaken.get(player.id) &&
    damageFeedTaken.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalPlayerTextDraw.get(player.id)[damageFeedTaken.get(player.id)!.id] =
      false;
    damageFeedTaken.set(player.id, null);
  }

  for (let i = 0; i < previousHits.get(player.id).length; i++) {
    previousHits.get(player.id)[i].tick = 0;
  }

  for (let i = 0; i < innerWeaponConfig.MAX_REJECTED_HITS; i++) {
    rejectedHits.get(player.id)[i] = new RejectedHit();
    rejectedHits.get(player.id)[i]!.time = 0;
  }

  for (let i = 0; i < innerWeaponConfig.FEED_HEIGHT; i++) {
    damageFeedHitsGiven.get(player.id)[i] = new DamageFeedHit();
    damageFeedHitsTaken.get(player.id)[i] = new DamageFeedHit();
    damageFeedHitsGiven.get(player.id)[i]!.tick = 0;
    damageFeedHitsTaken.get(player.id)[i]!.tick = 0;
  }

  orig_playerMethods.setTeam.call(player, playerTeam.get(player.id));
  freezeSyncPacket(player, false);
  setFakeFacingAngle(player);
  damageFeedUpdate(player);

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (!alreadyConnected.get(player.id)) {
      removeDefaultVendingMachines(player);
    }

    alreadyConnected.set(player.id, false);
    firstSpawn.set(player.id, true);
  }

  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  next();

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (vendingUseTimer.get(player.id)) {
      clearTimeout(vendingUseTimer.get(player.id)!);
      vendingUseTimer.set(player.id, null);
    }
  }

  if (delayedDeathTimer.get(player.id)) {
    clearTimeout(delayedDeathTimer.get(player.id)!);
    delayedDeathTimer.set(player.id, null);
  }

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
    deathTimer.set(player.id, null);
  }

  if (knifeTimeout.get(player.id)) {
    clearTimeout(knifeTimeout.get(player.id)!);
    knifeTimeout.set(player.id, null);
  }

  if (
    healthBarForeground.get(player.id) &&
    healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalPlayerTextDraw.get(player.id)[
      healthBarForeground.get(player.id)!.id
    ] = false;
    healthBarForeground.get(player.id)!.destroy();
    healthBarForeground.set(player.id, null);
  }

  if (
    damageFeedGiven.get(player.id) &&
    damageFeedGiven.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalPlayerTextDraw.get(player.id)[damageFeedGiven.get(player.id)!.id] =
      false;
    damageFeedGiven.get(player.id)!.destroy();
    damageFeedGiven.set(player.id, null);
  }

  if (
    damageFeedTaken.get(player.id) &&
    damageFeedTaken.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
  ) {
    internalPlayerTextDraw.get(player.id)[damageFeedTaken.get(player.id)!.id] =
      false;
    damageFeedTaken.get(player.id)!.destroy();
    damageFeedTaken.set(player.id, null);
  }

  if (damageFeedTimer.get(player.id)) {
    clearTimeout(damageFeedTimer.get(player.id)!);
    damageFeedTimer.set(player.id, null);
  }

  setHealthBarVisible(player, false);

  spectating.set(player.id, InvalidEnum.PLAYER_ID);

  for (const [i, v] of lastVehicleShooter) {
    if (v === player.id) {
      lastVehicleShooter.set(i, InvalidEnum.PLAYER_ID);
    }
  }

  for (let i = 0; i < internalPlayerTextDraw.get(player.id).length; i++) {
    internalPlayerTextDraw.get(player.id)[i] = false;
  }

  let j = 0;

  Player.getInstances().forEach((i) => {
    for (j = 0; j < previousHits.get(i.id).length; j++) {
      if (previousHits.get(i.id)[j].issuer === player.id) {
        previousHits.get(i.id)[j].issuer = InvalidEnum.PLAYER_ID;
      }
    }
  });

  return 1;
});

PlayerEvent.onSpawn(({ player, next }) => {
  trueDeath.set(player.id, false);
  inClassSelection.set(player.id, false);

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
    deathTimer.set(player.id, null);
  }

  if (forceClassSelection.get(player.id)) {
    debugMessage(player, "Being forced into class selection");
    orig_playerMethods.forceClassSelection.call(player);
    orig_playerMethods.setHealth.call(player, 0.0);
    return 1;
  }

  const tick = Date.now();
  lastUpdate.set(player.id, tick);
  lastStop.set(player.id, tick);

  if (beingResynced.get(player.id)) {
    beingResynced.set(player.id, false);

    updateHealthBar(player);

    orig_playerMethods.setPos.call(
      player,
      syncData.get(player.id).posX,
      syncData.get(player.id).posY,
      syncData.get(player.id).posZ,
    );
    orig_playerMethods.setFacingAngle.call(
      player,
      syncData.get(player.id).posA,
    );

    orig_playerMethods.setSkin.call(player, syncData.get(player.id).skin);
    orig_playerMethods.setTeam.call(player, syncData.get(player.id).team);

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

    return 1;
  }

  if (spawnInfoModified.get(player.id)) {
    let spawn_info: SpawnInfo;
    const classId = playerClass.get(player.id);

    spawnInfoModified.set(player.id, false);

    if (classId === -1) {
      spawn_info = playerSpawnInfo.get(player.id);
    } else if (classId === -2) {
      spawn_info = playerFallbackSpawnInfo.get(player.id);
    } else {
      if (
        classSpawnInfo.get(classId).skin === -1 &&
        playerFallbackSpawnInfo.get(player.id).skin !== -1
      ) {
        spawn_info = playerFallbackSpawnInfo.get(player.id);
      } else {
        spawn_info = classSpawnInfo.get(classId);
      }
    }

    if (spawn_info.skin !== -1) {
      orig_playerMethods.setSpawnInfo.call(
        player,
        spawn_info.team,
        spawn_info.skin,
        spawn_info.posX,
        spawn_info.posY,
        spawn_info.posZ,
        spawn_info.rot,
        spawn_info.weapon1,
        spawn_info.ammo1,
        spawn_info.weapon2,
        spawn_info.ammo2,
        spawn_info.weapon3,
        spawn_info.ammo3,
      );
    }
  } else {
    playerFallbackSpawnInfo.get(player.id).team = playerTeam.get(player.id);
    playerFallbackSpawnInfo.get(player.id).skin =
      orig_playerMethods.getSkin.call(player);
    const { x, y, z } = orig_playerMethods.getPos.call(player)!;
    playerFallbackSpawnInfo.get(player.id).posX = x;
    playerFallbackSpawnInfo.get(player.id).posY = y;
    playerFallbackSpawnInfo.get(player.id).posZ = z;
    playerFallbackSpawnInfo.get(player.id).rot =
      orig_playerMethods.getFacingAngle.call(player);
  }

  if (isDying.get(player.id)) {
    isDying.set(player.id, false);

    if (restorePlayerTeleport.get(player.id)) {
      restorePlayerTeleport.set(player.id, false);
      orig_playerMethods.allowTeleport.call(player, true);
    }
  }

  if (playerHealth.get(player.id) === 0.0) {
    playerHealth.set(player.id, playerMaxHealth.get(player.id));
  }

  updatePlayerVirtualWorld(player);
  updateHealthBar(player, true);
  freezeSyncPacket(player, false);
  setFakeFacingAngle(player);
  damageFeedUpdate(player);

  if (orig_playerMethods.getTeam.call(player) !== playerTeam.get(player.id)) {
    orig_playerMethods.setTeam.call(player, playerTeam.get(player.id));
  }

  let animLib = "",
    animName = "";

  if (deathSkip.get(player.id) === 2) {
    const { weapons: w } = orig_playerMethods.getWeaponData.call(player, 0);

    debugMessage(player, "Death skipped");
    orig_playerMethods.setSpecialAction.call(player, SpecialActionsEnum.NONE);
    orig_playerMethods.setArmedWeapon.call(player, w);
    orig_playerMethods.clearAnimations.call(player);

    animLib = "PED";
    animName = "IDLE_stance";
    orig_playerMethods.applyAnimation.call(
      player,
      animLib,
      animName,
      4.1,
      true,
      false,
      false,
      false,
      1,
      1,
    );

    deathSkip.set(player.id, 1);
    deathSkipTick.set(player.id, tick);
    return 1;
  }

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (firstSpawn.get(player.id)) {
      firstSpawn.set(player.id, false);

      if (innerGameModeConfig.customVendingMachines) {
        animLib = "VENDING";
        animName = "null";
        orig_playerMethods.applyAnimation.call(
          player,
          animLib,
          animName,
          0.0,
          false,
          false,
          false,
          false,
          0,
          0,
        );
      }
    }
  }

  return next();
});

PlayerEvent.onRequestClass(({ player, classId, next }) => {
  debugMessage(player, `Requested class: ${classId}`);

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
    deathTimer.set(player.id, null);
  }

  if (deathSkip.get(player.id)) {
    debugMessage(player, "Skipping death - class selection skipped");
    orig_playerMethods.spawn.call(player);

    return 0;
  }

  if (forceClassSelection.get(player.id)) {
    forceClassSelection.set(player.id, false);
  }

  if (beingResynced.get(player.id)) {
    trueDeath.set(player.id, false);

    spawnPlayerInPlace(player);

    return 0;
  }

  if (isDying.get(player.id)) {
    onPlayerDeathFinished(player, false);
    isDying.set(player.id, false);

    if (restorePlayerTeleport.get(player.id)) {
      restorePlayerTeleport.set(player.id, false);
      orig_playerMethods.allowTeleport.call(player, true);
    }
  }

  if (trueDeath.get(player.id)) {
    if (!inClassSelection.get(player.id)) {
      debugMessage(player, "True death class selection");

      const { x, y, z } = orig_playerMethods.getPos.call(player)!;

      orig_playerMethods.removeBuilding.call(player, 1484, x, y, z, 350.0);
      orig_playerMethods.removeBuilding.call(player, 1485, x, y, z, 350.0);
      orig_playerMethods.removeBuilding.call(player, 1486, x, y, z, 350.0);

      inClassSelection.set(player.id, true);
    }

    updatePlayerVirtualWorld(player);

    if (next()) {
      playerClass.set(player.id, classId);
      return 1;
    } else {
      return 0;
    }
  } else {
    debugMessage(player, "Not true death - being respawned");

    forceClassSelection.set(player.id, true);

    orig_playerMethods.setVirtualWorld.call(
      player,
      innerWeaponConfig.DEATH_WORLD,
    );
    spawnPlayerInPlace(player);
    return 0;
  }
});

PlayerEvent.onDeath(({ player, killer, reason, next }) => {
  trueDeath.set(player.id, true);
  inClassSelection.set(player.id, false);

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (vendingUseTimer.get(player.id)) {
      clearTimeout(vendingUseTimer.get(player.id)!);
      vendingUseTimer.set(player.id, null);
    }
  }

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
    deathTimer.set(player.id, null);
  }

  if (beingResynced.get(player.id) || forceClassSelection.get(player.id)) {
    return 1;
  }

  if (isDying.get(player.id)) {
    debugMessageRedAll(`death while dying ${player.id}`);

    return 1;
  }

  if (
    killer !== InvalidEnum.PLAYER_ID &&
    !orig_playerMethods.isStreamedIn.call(killer, player)
  ) {
    killer = InvalidEnum.PLAYER_ID;
  }

  debugMessageRedAll(
    `OnPlayerDeath(${player.id} died by ${reason} from ${typeof killer === "number" ? killer : killer.id})`,
  );

  if (reason < WC_WeaponEnum.UNARMED || reason > WC_WeaponEnum.UNKNOWN) {
    reason = WC_WeaponEnum.UNKNOWN;
  }

  const vehicle = orig_playerMethods.getVehicle.call(player);

  if (
    vehicle &&
    vehicle.id !== InvalidEnum.VEHICLE_ID &&
    orig_vehicleMethods.isValid.call(vehicle)
  ) {
    reason = WC_WeaponEnum.EXPLOSION;
    killer = InvalidEnum.PLAYER_ID;

    if (!hasSameTeam(player, lastVehicleShooter.get(vehicle.id))) {
      killer = lastVehicleShooter.get(vehicle.id);
    }
  }

  const amount = 0.0,
    bodyPart = 0;

  if (reason === WC_WeaponEnum.PARACHUTE) {
    reason = WC_WeaponEnum.REASON_COLLISION;
  }

  const editable: IEditableOnPlayerDamage = {
    player,
    amount,
    issuerId: killer,
    weaponId: reason,
    bodyPart,
  };

  if (triggerOnPlayerDamage(editable)) {
    if (
      editable.weaponId < WC_WeaponEnum.UNARMED ||
      editable.weaponId > WC_WeaponEnum.UNKNOWN
    ) {
      editable.weaponId = WC_WeaponEnum.UNKNOWN;
    }

    if (editable.amount === 0.0) {
      editable.amount =
        playerHealth.get(editable.player.id) +
        playerArmour.get(editable.player.id);
    }

    if (
      editable.weaponId === WC_WeaponEnum.REASON_COLLISION ||
      editable.weaponId === WC_WeaponEnum.REASON_DROWN ||
      editable.weaponId === WC_WeaponEnum.CARPARK
    ) {
      if (editable.amount <= 0.0) {
        editable.amount = playerHealth.get(editable.player.id);
      }

      playerHealth.set(
        editable.player.id,
        playerHealth.get(editable.player.id) - editable.amount,
      );
    } else {
      if (editable.amount <= 0.0) {
        editable.amount =
          playerHealth.get(editable.player.id) +
          playerArmour.get(editable.player.id);
      }

      playerArmour.set(
        editable.player.id,
        playerArmour.get(editable.player.id) - editable.amount,
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
      playerArmour.set(editable.player.id, 0.0);
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

    onPlayerDamageDone(
      editable.player,
      editable.amount,
      editable.issuerId,
      editable.weaponId,
      editable.bodyPart,
    );
  }

  if (playerHealth.get(editable.player.id) <= 0.0005) {
    playerHealth.set(editable.player.id, 0.0);
    isDying.set(editable.player.id, true);

    lastDeathTick.set(editable.player.id, Date.now());

    if (orig_playerMethods.isTeleportAllowed.call(editable.player)) {
      restorePlayerTeleport.set(editable.player.id, true);
      orig_playerMethods.allowTeleport.call(editable.player, false);
    }

    const editablePrepare: IEditableOnPlayerPrepareDeath = {
      animLock: false,
      respawnTime: 0,
    };

    triggerOnPlayerPrepareDeath(editable.player, "", "", editablePrepare);

    next({
      player: editable.player,
      killer: editable.issuerId,
      reason: editable.weaponId,
    });

    onPlayerDeathFinished(editable.player, false);
  } else {
    if (vehicle || wasPlayerInVehicle(editable.player, 10000)) {
      const { x, y, z } = orig_playerMethods.getPos.call(editable.player)!;
      orig_playerMethods.setPos.call(editable.player, x, y, z);
      saveSyncData(editable.player);

      let r = 0;

      if (vehicle) {
        r = orig_vehicleMethods.getZAngle.call(vehicle);
      } else {
        r = orig_playerMethods.getFacingAngle.call(editable.player);
      }

      deathSkip.set(editable.player.id, 2);

      const { weapons: w } = orig_playerMethods.getWeaponData.call(
        editable.player,
        0,
      );

      orig_playerMethods.forceClassSelection.call(editable.player);
      orig_playerMethods.setSpawnInfo.call(
        editable.player,
        playerTeam.get(editable.player.id),
        orig_playerMethods.getSkin.call(editable.player),
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
      orig_playerMethods.toggleSpectating.call(editable.player, true);
      orig_playerMethods.toggleSpectating.call(editable.player, false);
      orig_playerMethods.setSpawnInfo.call(
        editable.player,
        playerTeam.get(editable.player.id),
        orig_playerMethods.getSkin.call(editable.player),
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
      orig_playerMethods.toggleControllable.call(editable.player, true);
      orig_playerMethods.setArmedWeapon.call(editable.player, w);
    } else {
      spawnPlayerInPlace(editable.player);
    }
  }

  updateHealthBar(editable.player);

  return 1;
});

export function wc_CbugPunishment(player: Player, weapon: number) {
  freezeSyncPacket(player, false);
  orig_playerMethods.setArmedWeapon.call(player, weapon);

  if (!isDying.get(player.id)) {
    orig_playerMethods.clearAnimations.call(player, true);
  }
}

PlayerEvent.onKeyStateChange(({ player, newKeys, oldKeys, next }) => {
  let animLib = "",
    animName = "";

  if (
    !cBugAllowed.get(player.id) &&
    !isDying.get(player.id) &&
    orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT
  ) {
    if (newKeys & KeysEnum.CROUCH) {
      const tick = Date.now();
      const diff = tick - lastShot.get(player.id).tick;

      if (
        lastShot.get(player.id).tick &&
        diff < 1200 &&
        !cBugFroze.get(player.id)
      ) {
        orig_playerMethods.playSound.call(player, 1055, 0.0, 0.0, 0.0);

        if (
          lastShot.get(player.id).valid &&
          Math.abs(lastShot.get(player.id).hX) > 1.0 &&
          Math.abs(lastShot.get(player.id).hY) > 1.0
        ) {
          orig_playerMethods.setFacingAngle.call(
            player,
            angleBetweenPoints(
              lastShot.get(player.id).hX,
              lastShot.get(player.id).hY,
              lastShot.get(player.id).oX,
              lastShot.get(player.id).oY,
            ),
          );
        }

        const { weapons: w } = orig_playerMethods.getWeaponData.call(player, 0);

        animLib = "PED";
        animName = "IDLE_stance";
        orig_playerMethods.clearAnimations.call(player, true);
        orig_playerMethods.applyAnimation.call(
          player,
          animLib,
          animName,
          4.1,
          true,
          false,
          false,
          false,
          0,
          1,
        );
        freezeSyncPacket(player, true);
        orig_playerMethods.setArmedWeapon.call(player, w);
        setTimeout(() => {
          wc_CbugPunishment(player, orig_playerMethods.getWeapon.call(player));
        }, 600);

        cBugFroze.set(player.id, tick);

        let j = 0,
          health = 0,
          armour = 0;

        Player.getInstances().forEach((i) => {
          for (j = 0; j < previousHits.get(i.id).length; j++) {
            if (
              previousHits.get(i.id)[j].issuer === player.id &&
              tick - previousHits.get(i.id)[j].tick <= 1200
            ) {
              previousHits.get(i.id)[j].issuer = InvalidEnum.PLAYER_ID;

              health = wc_GetPlayerHealth.call(i);
              armour = wc_GetPlayerArmour.call(i);

              if (isDying.get(i.id)) {
                if (!delayedDeathTimer.get(i.id)) {
                  continue;
                }

                clearTimeout(delayedDeathTimer.get(i.id)!);
                delayedDeathTimer.set(i.id, null);
                orig_playerMethods.clearAnimations.call(i, true);
                setFakeFacingAngle(i);
                freezeSyncPacket(i, false);

                isDying.set(i.id, false);

                if (restorePlayerTeleport.get(i.id)) {
                  restorePlayerTeleport.set(i.id, false);
                  orig_playerMethods.allowTeleport.call(i, true);
                }

                if (deathTimer.get(i.id)) {
                  clearTimeout(deathTimer.get(i.id)!);
                  deathTimer.set(i.id, null);
                }
              }

              health += previousHits.get(i.id)[j].health;
              armour += previousHits.get(i.id)[j].armour;

              wcc_setPlayerHealth(i, health, armour);
            }
          }
        });
      }
    }
  }

  if (orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT) {
    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      if (
        innerGameModeConfig.customVendingMachines &&
        newKeys === KeysEnum.SECONDARY_ATTACK &&
        !oldKeys &&
        !vendingUseTimer.get(player.id) &&
        orig_playerMethods.getAnimationIndex.call(player) !== 1660
      ) {
        let failed = false;

        if (
          orig_playerMethods.getMoney.call(player) <= 0 ||
          playerHealth.get(player.id) >= playerMaxHealth.get(player.id)
        ) {
          failed = true;
        }

        const { z } = orig_playerMethods.getPos.call(player)!;

        for (
          let i = 0, healthGiven = 35.0;
          i < sc_VendingMachines.length;
          i++
        ) {
          if (
            Math.abs(z - sc_VendingMachines[i][VendingMachineIndex.posZ]) > 1.5
          ) {
            continue;
          }

          if (
            orig_playerMethods.isInRangeOfPoint.call(
              player,
              0.5,
              sc_VendingMachines[i][VendingMachineIndex.frontX],
              sc_VendingMachines[i][VendingMachineIndex.frontY],
              z,
            )
          ) {
            if (failed) {
              orig_playerMethods.playSound.call(player, 1055, 0.0, 0.0, 0.0);
              break;
            }

            const editable: IEditableOnPlayerUseVendingMachine = {
              healthGiven,
            };

            if (triggerOnPlayerUseVendingMachine(player, editable)) {
              vendingUseTimer.set(
                player.id,
                setTimeout(() => {
                  wc_VendingMachineUsed(player, editable.healthGiven);
                }, 2500),
              );

              animLib = "VENDING";
              animName = "VEND_USE";
              orig_playerMethods.setFacingAngle.call(
                player,
                sc_VendingMachines[i][VendingMachineIndex.rotZ],
              );
              orig_playerMethods.setPos.call(
                player,
                sc_VendingMachines[i][VendingMachineIndex.frontX],
                sc_VendingMachines[i][VendingMachineIndex.frontY],
                z,
              );
              orig_playerMethods.applyAnimation.call(
                player,
                animLib,
                animName,
                4.1,
                false,
                false,
                true,
                false,
                0,
                1,
              );

              orig_playerMethods.playSound.call(player, 42600, 0.0, 0.0, 0.0);
            } else {
              orig_playerMethods.playSound.call(player, 1055, 0.0, 0.0, 0.0);
            }

            break;
          }
        }
      }
    }

    if (newKeys & KeysEnum.FIRE) {
      const weapon = orig_playerMethods.getWeapon.call(player);

      switch (weapon) {
        case WeaponEnum.BOMB:
        case WeaponEnum.SATCHEL: {
          lastExplosive.set(player.id, WeaponEnum.SATCHEL);
          break;
        }

        case WeaponEnum.ROCKETLAUNCHER:
        case WeaponEnum.HEATSEEKER:
        case WeaponEnum.GRENADE: {
          lastExplosive.set(player.id, weapon);
        }
      }
    }
  }

  if (!isDying.get(player.id)) {
    return next();
  }
  return 0;
});

PlayerEvent.onStreamIn(({ player, forPlayer, next }) => {
  if (isDying.get(player.id) || inClassSelection.get(player.id)) {
    sendLastSyncPacket(player, forPlayer!, 0x2e040000 + 1150);
  }
  return next();
});

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

PlayerEvent.onStateChange(({ player, newState, oldState, next }) => {
  if (
    spectating.get(player.id) !== InvalidEnum.PLAYER_ID &&
    newState !== PlayerStateEnum.SPECTATING
  ) {
    spectating.set(player.id, InvalidEnum.PLAYER_ID);
  }

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (vendingUseTimer.get(player.id)) {
      clearTimeout(vendingUseTimer.get(player.id)!);
      vendingUseTimer.set(player.id, null);
    }
  }

  if (
    isDying.get(player.id) &&
    (newState === PlayerStateEnum.DRIVER ||
      newState === PlayerStateEnum.PASSENGER)
  ) {
    orig_playerMethods.toggleControllable.call(player, false);
  }

  if (
    oldState === PlayerStateEnum.DRIVER ||
    oldState === PlayerStateEnum.PASSENGER
  ) {
    lastVehicleTick.set(player.id, Date.now());

    if (newState === PlayerStateEnum.ONFOOT) {
      const {
        x: vx,
        y: vy,
        z: vz,
      } = orig_playerMethods.getVelocity.call(player);

      if (vx * vx + vy * vy + vz * vz <= 0.05) {
        Player.getInstances().forEach((i) => {
          if (i !== player && orig_playerMethods.isStreamedIn.call(player, i)) {
            sendLastSyncPacket(player, i);
            clearAnimationsForPlayer(player, i);
          }
        });
      }
    }
  }

  switch (newState) {
    case PlayerStateEnum.ONFOOT:
    case PlayerStateEnum.DRIVER:
    case PlayerStateEnum.PASSENGER: {
      setHealthBarVisible(player, true);
      break;
    }

    default: {
      setHealthBarVisible(player, false);
    }
  }

  return next();
});

DynamicPickupEvent.onPlayerPickUp(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

PlayerEvent.onUpdate(({ player, next }) => {
  if (tempDataWritten.get(player.id)) {
    if (orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT) {
      lastSyncData.set(player.id, tempSyncData.get(player.id));
      tempDataWritten.set(player.id, false);
    }
  }

  if (isDying.get(player.id)) {
    return 1;
  }

  if (forceClassSelection.get(player.id)) {
    return 0;
  }

  const tick = Date.now();

  if (deathSkip.get(player.id) === 1) {
    if (deathSkipTick.get(player.id)) {
      if (tick - deathSkipTick.get(player.id) > 1000) {
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

        deathSkipTick.set(player.id, 0);

        const animLib = "PED",
          animName = "IDLE_stance";
        orig_playerMethods.applyAnimation.call(
          player,
          animLib,
          animName,
          4.1,
          true,
          false,
          false,
          false,
          1,
          1,
        );
      }
    } else {
      if (orig_playerMethods.getAnimationIndex.call(player) !== 1189) {
        deathSkip.set(player.id, 0);

        wc_DeathSkipEnd(player);

        debugMessage(player, "Death skip end");
      }
    }
  }

  if (spawnForStreamedIn.get(player.id)) {
    wc_SpawnForStreamedIn(player);

    spawnForStreamedIn.set(player.id, false);
  }

  lastUpdate.set(player.id, tick);

  if (innerGameModeConfig.customFallDamage) {
    let { z: vz } = orig_playerMethods.getVelocity.call(player);
    const { z } = orig_playerMethods.getPos.call(player)!;

    const surfingVehicle = orig_playerMethods.getSurfingVehicle.call(player);
    let surfing = false;

    if (!surfingVehicle || surfingVehicle.id === InvalidEnum.VEHICLE_ID) {
      const obj = orig_playerMethods.getSurfingObject.call(player);
      surfing = Boolean(obj && obj.id !== InvalidEnum.OBJECT_ID);
    } else {
      surfing = true;
    }

    if (surfing || tick - lastStop.get(player.id) < 2000) {
      vz = 0.0;
      lastZVelo.set(player.id, 0.0);
    } else {
      if (vz !== 0.0) {
        lastZVelo.set(player.id, vz);
      }

      if (z - lastZ.get(player.id) > 1.0) {
        lastZVelo.set(player.id, 0.1);
        vz = 0.1;
      }
    }

    lastZ.set(player.id, z);

    const anim = orig_playerMethods.getAnimationIndex.call(player);

    if (anim !== lastAnim.get(player.id)) {
      const prev = lastAnim.get(player.id);
      lastAnim.set(player.id, anim);

      if (
        (prev === 1130 && vz === 0.0) ||
        (anim >= 1128 && anim <= 1134) ||
        anim === 1208
      ) {
        let amount = -1.0;
        debugMessage(player, `vz: ${vz} anim: ${anim} prev: ${prev}`);

        vz = lastZVelo.get(player.id);

        if (vz <= innerGameModeConfig.fallDeathVelocity) {
          amount = 0.0;
        } else if (vz <= -0.2) {
          if (vz === -0.2) {
            amount = s_WeaponDamage[WeaponEnum.REASON_COLLISION] * 0.2;
          } else {
            amount = (vz + 0.2) / (innerGameModeConfig.fallDeathVelocity + 0.2);
            amount *= s_WeaponDamage[WeaponEnum.REASON_COLLISION];
          }
        }

        if (
          orig_playerMethods.getWeapon.call(player) === WeaponEnum.PARACHUTE &&
          anim === 1134
        ) {
          amount = -1.0;
        }

        if (amount >= 0.0) {
          debugMessage(
            player,
            `fall dmg: ${amount.toFixed(5)} (vz: ${vz}, anim: ${anim}, prev:${prev})`,
          );

          inflictDamage(
            player,
            amount,
            InvalidEnum.PLAYER_ID,
            WC_WeaponEnum.REASON_COLLISION,
            3,
          );
        }
      }
    }
  }

  return next();
});

PlayerEvent.onGiveDamage(({ player, damage, amount, weapon, bodyPart }) => {
  if (!isHighRateWeapon(weapon)) {
    debugMessage(
      player,
      `OnPlayerGiveDamage(${player.id} gave ${amount} to ${damage.id} using ${weapon} on bodyPart ${bodyPart})`,
    );
  }

  if (!orig_playerMethods.isConnected.call(damage)) {
    triggerOnInvalidWeaponDamage(
      player,
      damage,
      amount,
      weapon,
      bodyPart,
      InvalidDamageEnum.NO_DAMAGED,
      true,
    );
    addRejectedHit(player, damage, RejectedReasonEnum.HIT_NO_DAMAGEDID, weapon);
    return 0;
  }

  if (isDying.get(damage.id)) {
    addRejectedHit(player, damage, RejectedReasonEnum.HIT_DYING_PLAYER, weapon);
    return 0;
  }

  if (!innerGameModeConfig.lagCompMode) {
    const npc = orig_playerMethods.isNpc.call(damage);

    if (weapon === WeaponEnum.KNIFE && amount === 0.0) {
      if (damage === player) {
        return 0;
      }

      if (knifeTimeout.get(damage.id)) {
        clearTimeout(knifeTimeout.get(damage.id)!);
      }

      knifeTimeout.set(
        damage.id,
        setTimeout(() => {
          wc_SetSpawnForStreamedIn(damage);
        }, 2500),
      );
    }

    if (!npc) {
      return 0;
    }
  }

  if (
    weapon < WC_WeaponEnum.UNARMED ||
    weapon >= s_ValidDamageGiven.length ||
    !s_ValidDamageGiven[weapon]
  ) {
    if (
      weapon !== WeaponEnum.FLAMETHROWER &&
      weapon !== WeaponEnum.REASON_VEHICLE
    ) {
      addRejectedHit(
        player,
        damage,
        RejectedReasonEnum.HIT_INVALID_WEAPON,
        weapon,
      );
    }

    return 0;
  }

  let tick = Date.now();
  if (tick === 0) tick = 1;

  if (!wc_IsPlayerSpawned(player) && tick - lastDeathTick.get(player.id) > 80) {
    if (!isBulletWeapon(weapon) || lastShot.get(player.id).valid) {
      addRejectedHit(
        player,
        damage,
        RejectedReasonEnum.HIT_NOT_SPAWNED,
        weapon,
      );
    }

    return 0;
  }

  const npc = orig_playerMethods.isNpc.call(damage);

  if (amount === 1833.33154296875) {
    return 0;
  }

  if (weapon === WeaponEnum.KNIFE) {
    if (amount === 0.0) {
      const { weapons: w } = orig_playerMethods.getWeaponData.call(player, 0);

      if (damage === player) {
        return 0;
      }

      if (npc || hasSameTeam(player, damage.id)) {
        if (knifeTimeout.get(damage.id)) {
          clearTimeout(knifeTimeout.get(damage.id)!);
        }

        knifeTimeout.set(
          damage.id,
          setTimeout(() => {
            wc_SpawnForStreamedIn(damage);
          }, 150),
        );
        orig_playerMethods.clearAnimations.call(player, true);
        orig_playerMethods.setArmedWeapon.call(player, w);

        return 0;
      } else {
        const { x, y, z } = orig_playerMethods.getPos.call(player)!;

        if (
          orig_playerMethods.getDistanceFromPoint.call(damage, x, y, z) >
          s_WeaponRange[weapon] + 2.0
        ) {
          if (knifeTimeout.get(damage.id)) {
            clearTimeout(knifeTimeout.get(damage.id)!);
          }

          knifeTimeout.set(
            damage.id,
            setTimeout(() => {
              wc_SpawnForStreamedIn(damage);
            }, 150),
          );
          orig_playerMethods.clearAnimations.call(player, true);
          orig_playerMethods.setArmedWeapon.call(player, w);

          return 0;
        }
      }

      const editable: IEditableOnPlayerDamage = {
        player: damage,
        amount,
        issuerId: player,
        weaponId: weapon,
        bodyPart,
      };

      if (!triggerOnPlayerDamage(editable)) {
        if (knifeTimeout.get(editable.player.id)) {
          clearTimeout(knifeTimeout.get(editable.player.id)!);
        }

        knifeTimeout.set(
          editable.player.id,
          setTimeout(() => {
            wc_SpawnForStreamedIn(editable.player);
          }, 150),
        );

        if (editable.issuerId === InvalidEnum.PLAYER_ID) {
          return 0;
        }

        orig_playerMethods.clearAnimations.call(editable.issuerId, true);
        orig_playerMethods.setArmedWeapon.call(editable.issuerId, w);
        return 0;
      }

      if (editable.issuerId === InvalidEnum.PLAYER_ID) {
        return 0;
      }

      damageDoneHealth.set(
        editable.issuerId.id,
        playerHealth.get(editable.issuerId.id),
      );
      damageDoneArmour.set(
        editable.issuerId.id,
        playerArmour.get(editable.issuerId.id),
      );

      onPlayerDamageDone(
        editable.player,
        playerHealth.get(editable.player.id) +
          playerArmour.get(editable.player.id),
        editable.issuerId.id,
        editable.weaponId,
        editable.bodyPart,
      );

      orig_playerMethods.clearAnimations.call(editable.player, true);

      const animLib = "KNIFE";
      let animName = "KILL_Knife_Ped_Damage";
      playerDeath(editable.player, animLib, animName, false, 5200);

      setTimeout(() => {
        wc_SecondKnifeAnim(editable.player);
      }, 2200);

      useTrigger("OnPlayerDeath")!(
        editable.player.id,
        editable.issuerId.id,
        editable.weaponId,
      );

      debugMessage(
        editable.player.id,
        `being knifed by ${editable.issuerId.id}`,
      );
      debugMessage(editable.issuerId.id, `knifing ${editable.player.id}`);

      let forceSync = 2;

      const angle = orig_playerMethods.getFacingAngle.call(editable.player);
      orig_playerMethods.setFacingAngle.call(editable.issuerId, angle);

      orig_playerMethods.setVelocity.call(editable.player, 0.0, 0.0, 0.0);
      orig_playerMethods.setVelocity.call(editable.issuerId, 0.0, 0.0, 0.0);

      const animIndex = orig_playerMethods.getAnimationIndex.call(
        editable.issuerId,
      );

      if (animIndex !== 747) {
        debugMessageRed(
          editable.issuerId,
          `applying knife anim for you too (current: ${animIndex})`,
        );
        forceSync = 1;
      }

      animName = "KILL_Knife_Player";
      orig_playerMethods.applyAnimation.call(
        editable.issuerId,
        animLib,
        animName,
        4.1,
        false,
        true,
        true,
        false,
        1800,
        forceSync,
      );

      return 0;
    }
  }

  if (hasSameTeam(player, damage.id)) {
    addRejectedHit(player, damage, RejectedReasonEnum.HIT_SAME_TEAM, weapon);
    return 0;
  }

  if (
    (!orig_playerMethods.isStreamedIn.call(player, damage) &&
      !wc_IsPlayerPaused(damage)) ||
    !orig_playerMethods.isStreamedIn.call(damage, player)
  ) {
    addRejectedHit(
      player,
      damage,
      RejectedReasonEnum.HIT_UNSTREAMED,
      weapon,
      damage.id,
    );
    return 0;
  }

  const bullets = 0;
  let err = 0;

  const editable: IProcessDamageArgs = {
    player: damage,
    issuer: player,
    amount,
    weaponId: weapon,
    bodyPart,
    bullets,
  };

  if ((err = processDamage(editable))) {
    if (err === InvalidDamageEnum.INVALID_DAMAGE) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_INVALID_DAMAGE,
        editable.weaponId,
        editable.amount,
      );
    }

    if (err !== InvalidDamageEnum.INVALID_DISTANCE) {
      triggerOnInvalidWeaponDamage(
        editable.issuer,
        editable.player,
        editable.amount,
        editable.weaponId,
        editable.bodyPart,
        err,
        true,
      );
    }

    return 0;
  }

  if (editable.issuer === InvalidEnum.PLAYER_ID) return 0;

  let idx =
    (lastHitIdx.get(editable.issuer.id) + 1) %
    lastHitTicks.get(editable.issuer.id).length;

  if (idx < 0) {
    idx += lastHitTicks.get(editable.issuer.id).length;
  }

  lastHitIdx.set(editable.issuer.id, idx);
  lastHitTicks.get(editable.issuer.id)[idx] = tick;
  lastHitWeapons.get(editable.issuer.id)[idx] = editable.weaponId;
  hitsIssued.set(editable.issuer.id, hitsIssued.get(editable.issuer.id) + 1);

  if (innerWeaponConfig.DEBUG) {
    if (hitsIssued.get(editable.issuer.id) > 1) {
      let prev_tick_idx =
        (idx - 1) % lastHitTicks.get(editable.issuer.id).length;

      if (prev_tick_idx < 0) {
        prev_tick_idx += lastHitTicks.get(editable.issuer.id).length;
      }

      const prev_tick = lastHitTicks.get(editable.issuer.id)[prev_tick_idx];

      debugMessage(
        player,
        `(hit) last: ${tick - prev_tick} last 3: ${averageHitRate(editable.issuer, 3)}`,
      );
    }
  }

  const { multiple_weapons, ret: avg_rate } = averageHitRate(
    editable.issuer,
    innerGameModeConfig.maxHitRateSamples,
  );

  if (avg_rate !== -1) {
    if (multiple_weapons) {
      if (avg_rate < 100) {
        addRejectedHit(
          editable.issuer,
          editable.player,
          RejectedReasonEnum.HIT_RATE_TOO_FAST_MULTIPLE,
          editable.weaponId,
          avg_rate,
          innerGameModeConfig.maxHitRateSamples,
        );
        return 0;
      }
    } else if (s_MaxWeaponShootRate[editable.weaponId] - avg_rate > 20) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_RATE_TOO_FAST,
        editable.weaponId,
        avg_rate,
        innerGameModeConfig.maxHitRateSamples,
        s_MaxWeaponShootRate[editable.weaponId],
      );
      return 0;
    }
  }

  let valId = true;

  if (
    orig_playerMethods.getState.call(editable.issuer) === PlayerStateEnum.DRIVER
  ) {
    if (
      (editable.weaponId >= WeaponEnum.UZI &&
        editable.weaponId <= WeaponEnum.MP5) ||
      editable.weaponId === WeaponEnum.TEC9
    ) {
      const { keys } = orig_playerMethods.getKeys.call(editable.issuer);

      valId = Boolean(keys & KeysEnum.LOOK_RIGHT || keys & KeysEnum.LOOK_LEFT);
    } else {
      valId = false;
    }
  } else if (
    isBulletWeapon(editable.weaponId) &&
    amount !== 2.6400001049041748046875
  ) {
    if (
      !lastShot.get(editable.issuer.id).valid ||
      (tick - lastShot.get(editable.issuer.id).tick > 1500 &&
        editable.weaponId !== WeaponEnum.SNIPER)
    ) {
      valId = false;
      debugMessageRed(editable.issuer, "last shot not valid");
    } else if (
      editable.weaponId >= WeaponEnum.SHOTGUN &&
      editable.weaponId <= WeaponEnum.SHOTGSPA
    ) {
      if (lastShot.get(editable.issuer.id).hits >= 2) {
        valId = false;
        addRejectedHit(
          editable.issuer,
          editable.player,
          RejectedReasonEnum.HIT_MULTIPLE_PLAYERS_SHOTGUN,
          editable.weaponId,
          lastShot.get(editable.issuer.id).hits + 1,
        );
      }
    } else if (lastShot.get(editable.issuer.id).hits > 0) {
      if (
        lastShot.get(editable.issuer.id).hits >= 3 &&
        editable.weaponId !== WeaponEnum.SNIPER
      ) {
        valId = false;
        addRejectedHit(
          editable.issuer,
          editable.player,
          RejectedReasonEnum.HIT_MULTIPLE_PLAYERS,
          editable.weaponId,
          lastShot.get(editable.issuer.id).hits + 1,
        );
      } else {
        debugMessageRed(
          editable.issuer,
          `hit ${lastShot.get(editable.issuer.id).hits + 1} players with 1 shot`,
        );
      }
    }

    if (valId) {
      const dist = orig_playerMethods.getDistanceFromPoint.call(
        editable.player,
        lastShot.get(editable.issuer.id).hX,
        lastShot.get(editable.issuer.id).hY,
        lastShot.get(editable.issuer.id).hZ,
      );

      if (dist > 20.0) {
        const suf_veh = orig_playerMethods.getSurfingVehicle.call(
          editable.player,
        );
        const in_veh =
          orig_playerMethods.isInAnyVehicle.call(editable.player) ||
          (suf_veh && suf_veh.id !== InvalidEnum.VEHICLE_ID);

        const suf_obj = orig_playerMethods.getSurfingObject.call(
          editable.player,
        );

        if (
          (!in_veh && (!suf_obj || suf_obj.id === InvalidEnum.OBJECT_ID)) ||
          dist > 50.0
        ) {
          valId = false;
          addRejectedHit(
            editable.issuer,
            editable.player,
            RejectedReasonEnum.HIT_TOO_FAR_FROM_SHOT,
            editable.weaponId,
            dist,
          );
        }
      }
    }

    lastShot.get(editable.issuer.id).hits += 1;
  }

  if (!valId) {
    return 0;
  }

  if (npc) {
    onPlayerDamageDone(
      editable.player,
      amount,
      editable.issuer,
      editable.weaponId,
      editable.bodyPart,
    );
  } else {
    inflictDamage(
      editable.player,
      amount,
      editable.issuer,
      editable.weaponId,
      editable.bodyPart,
    );
  }

  return 0;
});

PlayerEvent.onTakeDamage(({ player, damage, amount, weapon, bodyPart }) => {
  if (orig_playerMethods.isNpc.call(player)) {
    return 0;
  }

  updateHealthBar(player, true);

  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }

  if (!isHighRateWeapon(weapon)) {
    debugMessage(
      player,
      `OnPlayerTakeDamage(${player.id} took ${amount} from ${typeof damage === "number" ? damage : damage.id} by ${weapon} on bodyPart ${bodyPart})`,
    );
  }

  if (
    weapon < WC_WeaponEnum.UNARMED ||
    weapon >= s_ValidDamageTaken.length ||
    !s_ValidDamageTaken[weapon]
  ) {
    return 0;
  }

  if (weapon === WeaponEnum.REASON_COLLISION && amount === 0.0) {
    return 0;
  }

  if (amount === 1833.33154296875) {
    return 0;
  }

  if (weapon === WeaponEnum.REASON_COLLISION) {
    if (innerGameModeConfig.customFallDamage) {
      return 0;
    }

    const anim = orig_playerMethods.getAnimationIndex.call(player);

    if (anim >= 1061 && anim <= 1067) {
      debugMessage(player, "climb bug prevented");
      return 0;
    }
  } else if (weapon === WeaponEnum.KNIFE) {
    if (amount === 0.0) {
      if (damage === player) {
        return 0;
      }

      if (knifeTimeout.get(player.id)) {
        clearTimeout(knifeTimeout.get(player.id)!);
        knifeTimeout.set(player.id, null);
      }

      if (damage === InvalidEnum.PLAYER_ID || hasSameTeam(player, damage.id)) {
        resyncPlayer(player);

        return 0;
      } else {
        const { x, y, z } = orig_playerMethods.getPos.call(damage)!;

        if (
          orig_playerMethods.getDistanceFromPoint.call(player, x, y, z) >
          s_WeaponRange[weapon] + 2.0
        ) {
          resyncPlayer(player);
          return 0;
        }
      }

      const editable: IEditableOnPlayerDamage = {
        player,
        amount,
        issuerId: damage,
        weaponId: weapon,
        bodyPart,
      };

      if (!triggerOnPlayerDamage(editable)) {
        resyncPlayer(editable.player);
        return 0;
      }

      if (editable.issuerId === InvalidEnum.PLAYER_ID) {
        return 0;
      }

      weapon = WeaponEnum.KNIFE;
      amount = 0.0;

      damageDoneHealth.set(
        editable.player.id,
        playerHealth.get(editable.player.id),
      );
      damageDoneArmour.set(
        editable.player.id,
        playerArmour.get(editable.player.id),
      );

      triggerOnPlayerDamageDone(
        editable.player.id,
        playerHealth.get(editable.player.id) +
          playerArmour.get(editable.player.id),
        editable.issuerId,
        weapon,
        bodyPart,
      );

      const animLib = "KNIFE";
      let animName = "KILL_Knife_Ped_Die";
      playerDeath(
        editable.player,
        animLib,
        animName,
        false,
        4000 - orig_playerMethods.getPing.call(editable.player),
      );

      useTrigger("OnPlayerDeath")!(
        editable.player.id,
        editable.issuerId,
        weapon,
      );

      orig_playerMethods.setHealth.call(editable.player, 0x7f7fffff);

      debugMessage(
        editable.player.id,
        `being knifed by ${editable.issuerId.id}`,
      );
      debugMessage(editable.issuerId, `knifing ${editable.player.id}`);

      let forceSync = 2;

      const a = orig_playerMethods.getFacingAngle.call(editable.player);
      orig_playerMethods.setFacingAngle.call(editable.issuerId, a);

      orig_playerMethods.setVelocity.call(editable.player, 0.0, 0.0, 0.0);
      orig_playerMethods.setVelocity.call(editable.issuerId, 0.0, 0.0, 0.0);

      const animIndex = orig_playerMethods.getAnimationIndex.call(
        editable.issuerId,
      );
      if (animIndex !== 747) {
        debugMessageRed(
          editable.issuerId,
          `applying knife anim for you too (current: ${animIndex})`,
        );

        forceSync = 1;
      }

      animName = "KILL_Knife_Player";
      orig_playerMethods.applyAnimation.call(
        editable.issuerId,
        animLib,
        animName,
        4.1,
        false,
        true,
        true,
        false,
        1800,
        forceSync,
      );

      return 0;
    }
  }

  if (innerGameModeConfig.lagCompMode && s_ValidDamageTaken[weapon] !== 2) {
    if (
      damage !== InvalidEnum.PLAYER_ID &&
      (weapon === WeaponEnum.M4 || weapon === WeaponEnum.MINIGUN) &&
      orig_playerMethods.getState.call(damage) === PlayerStateEnum.DRIVER
    ) {
      const vehicle = orig_playerMethods.getVehicle.call(damage);

      if (
        vehicle &&
        isVehicleArmedWithWeapon(vehicle, weapon as unknown as WC_WeaponEnum)
      ) {
        if ((weapon as unknown as number) === WC_WeaponEnum.MINIGUN) {
          weapon = WC_WeaponEnum.VEHICLE_MINIGUN as unknown as number;
        } else {
          weapon = WC_WeaponEnum.VEHICLE_M4 as unknown as number;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  if (
    damage !== InvalidEnum.PLAYER_ID &&
    orig_playerMethods.isConnected.call(damage)
  ) {
    if (hasSameTeam(player, damage.id)) {
      return 0;
    }

    if (
      isDying.get(damage.id) &&
      (isBulletWeapon(weapon) || isMeleeWeapon(weapon)) &&
      Date.now() - lastDeathTick.get(damage.id) > 80
    ) {
      debugMessageRed(player, `shot/punched by dead player (${damage.id})`);
      return 0;
    }

    if (beingResynced.get(damage.id)) {
      return 0;
    }

    if (
      weapon === WeaponEnum.REASON_COLLISION ||
      weapon === WeaponEnum.REASON_DROWN
    ) {
      return 0;
    }

    if (
      weapon === WeaponEnum.REASON_VEHICLE ||
      (weapon as number) === WC_WeaponEnum.HELIBLADES
    ) {
      if (orig_playerMethods.getState.call(damage) !== PlayerStateEnum.DRIVER) {
        return 0;
      }
    }

    if (
      (!orig_playerMethods.isStreamedIn.call(player, damage) &&
        !wc_IsPlayerPaused(damage)) ||
      !orig_playerMethods.isStreamedIn.call(damage, player)
    ) {
      if (innerGameModeConfig.lagCompMode) {
        damage = InvalidEnum.PLAYER_ID;
      } else {
        addRejectedHit(
          player,
          damage,
          RejectedReasonEnum.HIT_UNSTREAMED,
          weapon,
          damage.id,
        );
        return 0;
      }
    }
  }

  const bullets = 0.0;
  let err = 0;

  const editable: IProcessDamageArgs = {
    player,
    issuer: damage,
    amount,
    weaponId: weapon,
    bodyPart,
    bullets,
  };

  if ((err = processDamage(editable))) {
    if (err === InvalidDamageEnum.INVALID_DAMAGE) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_INVALID_DAMAGE,
        editable.weaponId,
        editable.amount,
      );
    }

    if (err !== InvalidDamageEnum.INVALID_DISTANCE) {
      triggerOnInvalidWeaponDamage(
        editable.issuer,
        editable.player,
        editable.amount,
        editable.weaponId,
        editable.bodyPart,
        err,
        false,
      );
    }

    return 0;
  }

  if (isBulletWeapon(editable.weaponId)) {
    const { x, y, z } = orig_playerMethods.getPos.call(editable.issuer)!;
    const dist = orig_playerMethods.getDistanceFromPoint.call(
      editable.player,
      x,
      y,
      z,
    );

    if (dist > s_WeaponRange[editable.weaponId] + 2.0) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_OUT_OF_RANGE,
        editable.weaponId,
        dist,
        s_WeaponRange[editable.weaponId],
      );
      return 0;
    }
  }

  inflictDamage(
    editable.player,
    editable.amount,
    editable.issuer,
    editable.weaponId,
    editable.bodyPart,
  );

  return 0;
});

PlayerEvent.onWeaponShot(
  ({ player, weapon, hitType, hitId, fX, fY, fZ, next }) => {
    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      if (vendingUseTimer.get(player.id)) {
        clearTimeout(vendingUseTimer.get(player.id)!);
        vendingUseTimer.set(player.id, null);
      }
    }

    lastShot.get(player.id).valid = false;

    let tick = Date.now();
    if (tick === 0) tick = 1;

    if (cBugFroze.get(player.id) && tick - cBugFroze.get(player.id) < 900) {
      return 0;
    }

    cBugFroze.set(player.id, 0);

    let damagedId: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID;

    if (
      hitType === BulletHitTypesEnum.PLAYER &&
      hitId !== InvalidEnum.PLAYER_ID
    ) {
      if (!orig_playerMethods.isConnected.call(Player.getInstance(hitId))) {
        addRejectedHit(
          player,
          hitId,
          RejectedReasonEnum.HIT_DISCONNECTED,
          weapon,
          hitId,
        );
        return 0;
      }

      damagedId = Player.getInstance(hitId)!;
    }

    if (
      hitType < BulletHitTypesEnum.NONE ||
      hitType > BulletHitTypesEnum.PLAYER_OBJECT
    ) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_INVALID_HITTYPE,
        weapon,
        hitType,
      );

      return 0;
    }

    if (innerWeaponConfig.DEBUG) {
      if (hitType === BulletHitTypesEnum.PLAYER) {
        debugMessage(
          player,
          `OnPlayerWeaponShot(${player.id} shot ${hitId} with ${weapon} at ${fX}, ${fY}, ${fZ})`,
        );
      } else if (hitType) {
        debugMessage(
          player,
          `OnPlayerWeaponShot(${player.id} shot ${hitType} ${hitId} with ${weapon} at ${fX}, ${fY}, ${fZ})`,
        );
      } else {
        debugMessage(
          player,
          `OnPlayerWeaponShot(${player.id} shot with ${weapon} at ${fX}, ${fY}, ${fZ})`,
        );
      }
    }

    if (beingResynced.get(player.id)) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_BEING_RESYNCED,
        weapon,
      );
      return 0;
    }

    if (
      !wc_IsPlayerSpawned(player) &&
      tick - lastDeathTick.get(player.id) > 80
    ) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_NOT_SPAWNED,
        weapon,
      );
      return 0;
    }

    if (!isBulletWeapon(weapon)) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_INVALID_WEAPON,
        weapon,
      );

      return 0;
    }

    const { x, y, z } = orig_playerMethods.getPos.call(player)!;
    const { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ } =
      orig_playerMethods.getLastShotVectors.call(player);

    const length = GameMode.vectorSize(
      fOriginX - fHitPosX,
      fOriginY - fHitPosY,
      fOriginZ - fHitPosZ,
    );
    const origin_dist = GameMode.vectorSize(
      fOriginX - x,
      fOriginY - y,
      fOriginZ - z,
    );

    if (origin_dist > 15.0) {
      const suf_veh = orig_playerMethods.getSurfingVehicle.call(player);

      const in_veh =
        orig_playerMethods.isInAnyVehicle.call(player) ||
        (suf_veh && suf_veh.id !== InvalidEnum.VEHICLE_ID);

      const suf_obj = orig_playerMethods.getSurfingObject.call(player);

      if (
        (!in_veh && (!suf_obj || suf_obj.id === InvalidEnum.OBJECT_ID)) ||
        origin_dist > 50.0
      ) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
          weapon,
          origin_dist,
        );

        return 0;
      }
    }

    if (hitType !== BulletHitTypesEnum.NONE) {
      if (length > s_WeaponRange[weapon]) {
        if (hitType === BulletHitTypesEnum.PLAYER) {
          addRejectedHit(
            player,
            damagedId,
            RejectedReasonEnum.HIT_OUT_OF_RANGE,
            weapon,
            length,
            s_WeaponRange[weapon],
          );
        }

        return 0;
      }

      if (hitType === BulletHitTypesEnum.PLAYER) {
        if (
          orig_playerMethods.isInAnyVehicle.call(player) &&
          orig_playerMethods.getVehicle.call(player) ===
            orig_playerMethods.getVehicle.call(Player.getInstance(hitId)!)
        ) {
          addRejectedHit(
            player,
            damagedId,
            RejectedReasonEnum.HIT_SAME_VEHICLE,
            weapon,
          );
          return 0;
        }

        const dist = orig_playerMethods.getDistanceFromPoint.call(
          Player.getInstance(hitId)!,
          fHitPosX,
          fHitPosY,
          fHitPosZ,
        );
        const suf_veh = orig_playerMethods.getSurfingVehicle.call(
          Player.getInstance(hitId)!,
        );
        const in_veh =
          orig_playerMethods.isInAnyVehicle.call(Player.getInstance(hitId)!) ||
          (suf_veh && suf_veh.id !== InvalidEnum.VEHICLE_ID);

        if (dist > 20.0) {
          const suf_obj = orig_playerMethods.getSurfingObject.call(
            Player.getInstance(hitId)!,
          );
          if (
            (!in_veh && (!suf_obj || suf_obj.id === InvalidEnum.OBJECT_ID)) ||
            dist > 50.0
          ) {
            addRejectedHit(
              player,
              damagedId,
              RejectedReasonEnum.HIT_TOO_FAR_FROM_SHOT,
              weapon,
              dist,
            );

            return 0;
          }
        }
      }
    }

    let idx =
      (lastShotIdx.get(player.id) + 1) % lastShotTicks.get(player.id).length;

    if (idx < 0) {
      idx += lastShotTicks.get(player.id).length;
    }

    lastShotIdx.set(player.id, idx);
    lastShotTicks.get(player.id)[idx] = tick;
    lastShotWeapons.get(player.id)[idx] = weapon;
    shotsFired.set(player.id, shotsFired.get(player.id) + 1);

    if (innerWeaponConfig.DEBUG) {
      if (shotsFired.get(player.id) > 1) {
        let prev_tick_idx = (idx - 1) % lastShotTicks.get(player.id).length;

        if (prev_tick_idx < 0) {
          prev_tick_idx += lastShotTicks.get(player.id).length;
        }

        const prev_tick = lastShotTicks.get(player.id)[prev_tick_idx];

        debugMessage(
          player,
          `(shot) last: ${tick - prev_tick} last 3: ${averageShootRate(player, 3)}`,
        );
      }
    }

    lastShot.get(player.id).tick = tick;
    lastShot.get(player.id).weapon = weapon as number;
    lastShot.get(player.id).hitType = hitType;
    lastShot.get(player.id).hitId = hitId;
    lastShot.get(player.id).x = fX;
    lastShot.get(player.id).y = fY;
    lastShot.get(player.id).z = fZ;
    lastShot.get(player.id).oX = fOriginX;
    lastShot.get(player.id).oY = fOriginY;
    lastShot.get(player.id).oZ = fOriginZ;
    lastShot.get(player.id).hX = fHitPosX;
    lastShot.get(player.id).hY = fHitPosY;
    lastShot.get(player.id).hZ = fHitPosZ;
    lastShot.get(player.id).length = length;
    lastShot.get(player.id).hits = 0;

    const { multiple_weapons, ret: avg_rate } = averageShootRate(
      player,
      innerGameModeConfig.maxShootRateSamples,
    );

    if (avg_rate !== -1) {
      if (multiple_weapons) {
        if (avg_rate < 100) {
          addRejectedHit(
            player,
            damagedId,
            RejectedReasonEnum.SHOOTING_RATE_TOO_FAST_MULTIPLE,
            weapon,
            avg_rate,
            innerGameModeConfig.maxShootRateSamples,
          );
          return 0;
        }
      } else if (s_MaxWeaponShootRate[weapon] - avg_rate > 20) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.SHOOTING_RATE_TOO_FAST,
          weapon,
          avg_rate,
          innerGameModeConfig.maxShootRateSamples,
          s_MaxWeaponShootRate[weapon],
        );
        return 0;
      }
    }

    if (hitType === BulletHitTypesEnum.VEHICLE) {
      if (
        hitId < 0 ||
        hitId > LimitsEnum.MAX_VEHICLES ||
        !Vehicle.getInstance(hitId) ||
        !orig_vehicleMethods.isValid.call(Vehicle.getInstance(hitId))
      ) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_INVALID_VEHICLE,
          weapon,
          hitId,
        );
        return 0;
      }

      if (
        !orig_vehicleMethods.isStreamedIn.call(
          Vehicle.getInstance(hitId)!,
          player,
        )
      ) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_UNSTREAMED,
          weapon,
          hitId,
        );
        return 0;
      }

      const vehicle = orig_playerMethods.getVehicle.call(player);

      if (!vehicle || hitId === vehicle.id) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_OWN_VEHICLE,
          weapon,
        );
        return 0;
      }

      if (innerGameModeConfig.vehiclePassengerDamage) {
        let has_driver = false,
          has_passenger = false,
          seat;

        Player.getInstances().forEach((other) => {
          if (other === player) {
            return;
          }

          const veh = orig_playerMethods.getVehicle.call(other);

          if (veh && veh.id !== hitId) {
            return;
          }

          seat = orig_playerMethods.getVehicleSeat.call(other);

          if (seat === 0) {
            has_driver = true;
          } else {
            has_passenger = true;
          }
        });

        if (!has_driver && has_passenger) {
          let health = orig_vehicleMethods.getHealth.call(
            Vehicle.getInstance(hitId)!,
          );

          if (weapon >= WeaponEnum.SHOTGUN && weapon <= WeaponEnum.SHOTGSPA) {
            health -= 120.0;
          } else {
            health -= s_WeaponDamage[weapon] * 3.0;
          }

          if (health <= 0.0) {
            health = 0.0;
          }

          orig_vehicleMethods.setHealth.call(
            Vehicle.getInstance(hitId)!,
            health,
          );
        }
      }

      if (innerGameModeConfig.vehicleUnoccupiedDamage) {
        let has_occupant = false;

        Player.getInstances().forEach((other) => {
          if (other === player) {
            return;
          }

          const veh = orig_playerMethods.getVehicle.call(other);

          if (veh && veh.id !== hitId) {
            return;
          }

          has_occupant = true;
        });

        if (!has_occupant) {
          let health = orig_vehicleMethods.getHealth.call(
            Vehicle.getInstance(hitId),
          );

          if (health >= 250.0) {
            if (weapon >= WeaponEnum.SHOTGUN && weapon <= WeaponEnum.SHOTGSPA) {
              health -= 120.0;
            } else {
              health -= s_WeaponDamage[weapon] * 3.0;
            }

            if (health < 250.0) {
              if (!vehicleRespawnTimer.get(hitId)) {
                health = 249.0;
                vehicleRespawnTimer.set(
                  hitId,
                  setTimeout(() => {
                    wc_KillVehicle(Vehicle.getInstance(hitId)!, player);
                  }, 6000),
                );
              }
            }

            orig_vehicleMethods.setHealth.call(
              Vehicle.getInstance(hitId)!,
              health,
            );
          }
        }
      }
    }

    const retVal = next();

    lastShot.get(player.id).valid = !!retVal;

    if (retVal) {
      if (hitType === BulletHitTypesEnum.VEHICLE) {
        lastVehicleShooter.set(hitId, player.id);
      }
    }
    return retVal;
  },
);

export function wc_KillVehicle(vehicle: Vehicle, killer: Player) {
  useTrigger("OnVehicleDeath")!(vehicle.id, killer.id);
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

VehicleEvent.onDeath(({ vehicle, next }) => {
  if (vehicleRespawnTimer.get(vehicle.id)) {
    clearTimeout(vehicleRespawnTimer.get(vehicle.id)!);
    vehicleRespawnTimer.set(vehicle.id, null);
  }
  if (vehicleAlive.get(vehicle.id)) {
    vehicleAlive.set(vehicle.id, false);
    return next();
  }
  return 1;
});

DynamicCheckPointEvent.onPlayerEnter(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

DynamicCheckPointEvent.onPlayerLeave(({ player, next }) => {
  if (isDying.get(player.id)) {
    return 0;
  }
  return next();
});

DynamicRaceCPEvent.onPlayerEnter(({ player, next }) => {
  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }
  return next();
});

DynamicRaceCPEvent.onPlayerLeave(({ player, next }) => {
  if (isDying.get(player.id)) {
    return 0;
  }
  return next();
});

PlayerEvent.onClickMap(({ player, next }) => {
  if (
    (GameMode.isAdminTeleportAllowed() &&
      orig_playerMethods.isAdmin.call(player)) ||
    wc_IsPlayerTeleportAllowed.call(player)
  ) {
    if (!isDying.get(player.id)) {
      lastStop.set(player.id, Date.now());
    } else {
      blockAdminTeleport.set(player.id, true);
    }
  }
  return next();
});
