import { InvalidEnum, Player, PlayerEvent } from "@infernus/core";
import {
  playerMaxHealth,
  playerHealth,
  playerMaxArmour,
  playerArmour,
  lastExplosive,
  lastShotIdx,
  lastShot,
  lastHitIdx,
  rejectedHitIdx,
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
  lastUpdateTick,
  damageFeedTimer,
  damageFeedUpdateTick,
  spectating,
  healthBarVisible,
  lastSentHealth,
  lastSentArmour,
  lastStopTick,
  lastVehicleEnterTime,
  trueDeath,
  inClassSelection,
  forceClassSelection,
  playerClass,
  spawnInfoModified,
  playerFallbackSpawnInfo,
  deathSkip,
  lastVehicleTick,
  previousHitIdx,
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
} from "../../struct";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import { WC_WeaponEnum } from "../../enums";
import { orig_playerMethods } from "../..//hooks/origin";
import { damageFeedUpdate } from "../../functions/internal/damageFeed";
import { freezeSyncPacket } from "../../functions/internal/raknet";
import {
  // setFakeFacingAngle,
  setHealthBarVisible,
} from "../../functions/internal/set";
import { removeDefaultVendingMachines } from "../../functions/internal/vendingMachines";

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
  rejectedHitIdx.set(player.id, 0);
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
  lastUpdateTick.set(player.id, tick);
  damageFeedTimer.set(player.id, null);
  damageFeedUpdateTick.set(player.id, tick);
  spectating.set(player.id, InvalidEnum.PLAYER_ID);
  healthBarVisible.set(player.id, false);
  lastSentHealth.set(player.id, 0);
  lastSentArmour.set(player.id, 0);
  lastStopTick.set(player.id, tick);
  lastVehicleEnterTime.set(player.id, 0);
  trueDeath.set(player.id, true);
  inClassSelection.set(player.id, false);
  forceClassSelection.set(player.id, false);
  playerClass.set(player.id, -2);
  spawnInfoModified.set(player.id, false);
  playerFallbackSpawnInfo.get(player.id).skin = -1;
  deathSkip.set(player.id, 0);
  lastVehicleTick.set(player.id, 0);
  previousHitIdx.set(player.id, 0);
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
  // setFakeFacingAngle(player);
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
