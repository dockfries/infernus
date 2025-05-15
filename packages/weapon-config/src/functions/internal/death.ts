import {
  Player,
  useTrigger,
  withTriggerOptions,
  DynamicCheckpoint,
  DynamicRaceCP,
  SpecialActionsEnum,
  InvalidEnum,
} from "@infernus/core";
import {
  internalLeaveDynamicCP,
  internalLeaveDynamicRaceCP,
} from "../../callbacks/checkpoint";
import {
  IEditableOnPlayerPrepareDeath,
  triggerOnPlayerPrepareDeath,
} from "../../callbacks/custom";
import { internalPlayerDeath } from "../../callbacks/player/spawn";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import {
  orig_playerMethods,
  orig_PlayerTextDrawHide,
} from "../../hooks/origin";
import {
  syncData,
  delayedDeathTimer,
  playerHealth,
  playerArmour,
  isDying,
  restorePlayerTeleport,
  lastDeathTick,
  deathTimer,
  healthBarForeground,
  trueDeath,
} from "../../struct";
import { onPlayerDeathFinished } from "./event";
import { freezeSyncPacket } from "./raknet";
import { updateHealthBar, setFakeFacingAngle } from "./set";

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
    withTriggerOptions({
      skipToNext: internalPlayerDeath,
      args: [
        player.id,
        typeof issuerId === "number" ? issuerId : issuerId.id,
        reason,
      ],
    }),
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
    useTrigger("OnPlayerLeaveDynamicCP")!(
      withTriggerOptions({
        skipToNext: internalLeaveDynamicCP,
        args: [player.id, dynCp.id],
      }),
    );
  }

  if (dynRaceCp && dynRaceCp.isPlayerIn(player)) {
    useTrigger("OnPlayerLeaveDynamicRaceCP")!(
      withTriggerOptions({
        skipToNext: internalLeaveDynamicRaceCP,
        args: [player.id, dynRaceCp.id],
      }),
    );
  }
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
