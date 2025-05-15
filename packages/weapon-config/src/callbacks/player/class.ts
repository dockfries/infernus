import { PlayerEvent } from "@infernus/core";
import { innerWeaponConfig } from "../../config";
import { orig_playerMethods } from "../../hooks/origin";
import {
  deathTimer,
  deathSkip,
  forceClassSelection,
  beingResynced,
  trueDeath,
  isDying,
  restorePlayerTeleport,
  inClassSelection,
  playerClass,
} from "../../struct";
import { debugMessage } from "../../utils/debug";
import {
  spawnPlayerInPlace,
  updatePlayerVirtualWorld,
} from "../../functions/internal/set";
import { onPlayerDeathFinished } from "../../functions/internal/event";

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
