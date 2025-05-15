import {
  InvalidEnum,
  PlayerEvent,
  SpecialActionsEnum,
  WeaponEnum,
} from "@infernus/core";
import {
  playerMaxHealth,
  playerHealth,
  playerArmour,
  playerTeam,
  isDying,
  beingResynced,
  lastUpdate,
  lastStop,
  trueDeath,
  inClassSelection,
  forceClassSelection,
  playerClass,
  spawnInfoModified,
  playerFallbackSpawnInfo,
  deathSkip,
  deathTimer,
  restorePlayerTeleport,
  firstSpawn,
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
} from "../../struct";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import { WC_WeaponEnum } from "../../enums";
import { orig_playerMethods, orig_vehicleMethods } from "../../hooks/origin";
import { debugMessage, debugMessageRedAll } from "../../utils/debug";
import {
  IEditableOnPlayerDamage,
  IEditableOnPlayerPrepareDeath,
  triggerOnPlayerDamage,
  triggerOnPlayerPrepareDeath,
} from "../custom";
import { damageFeedUpdate } from "../../functions/internal/damageFeed";
import { hasSameTeam, wasPlayerInVehicle } from "../../functions/internal/is";
import {
  freezeSyncPacket,
  saveSyncData,
} from "../../functions/internal/raknet";
import {
  updateHealthBar,
  updatePlayerVirtualWorld,
  // setFakeFacingAngle,
  spawnPlayerInPlace,
} from "../../functions/internal/set";
import {
  onPlayerDamageDone,
  onPlayerDeathFinished,
} from "../../functions/internal/event";

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
  // setFakeFacingAngle(player);
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

export const internalPlayerDeath: Parameters<
  (typeof PlayerEvent)["onDeath"]
>[0] = ({ player, killer, reason, next }) => {
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
};

PlayerEvent.onDeath(internalPlayerDeath, true);

samp.defined._INC_WEAPON_INTERNAL.playerDeath = internalPlayerDeath;
