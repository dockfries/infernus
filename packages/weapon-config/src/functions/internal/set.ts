import { Player, TextDraw, InvalidEnum, TextDrawFontsEnum, WeaponEnum } from "@infernus/core";
import { BitStream, PacketRpcValueType } from "@infernus/raknet";
import { innerWeaponConfig } from "../../config";
import { WC_RPC_REQUEST_SPAWN } from "../../constants";
import {
  orig_playerMethods,
  orig_PlayerTextDrawTextSize,
  orig_PlayerTextDrawColor,
  orig_PlayerTextDrawFont,
  orig_PlayerTextDrawShow,
} from "../../hooks/origin";
import {
  spawnForStreamedIn,
  beingReSynced,
  forceClassSelection,
  playerHealth,
  playerMaxHealth,
  playerArmour,
  playerMaxArmour,
  isDying,
  lastSentHealth,
  lastSentArmour,
  healthBarVisible,
  healthBarForeground,
  internalPlayerTextDraw,
  enableHealthBar,
  playerTeam,
  spawnInfoModified,
  world,
  fakeHealth,
  fakeArmour,
  fakeQuat,
  healthBarBorder,
  healthBarBackground,
} from "../../struct";
import { angleBetweenPoints, wc_CalculateBar } from "../../utils/math";
import { clearAnimationsForPlayer } from "./anim";
import { getRotationQuaternion } from "./get";
import { sendLastSyncPacket, updateSyncData } from "./raknet";
import { wc_IsPlayerPaused } from "../public/is";
import { getPlayerActualSkin } from "./get";
import {
  getHealthBarSize,
  getHealthBarPadding,
  getHealthBarColor,
  getHealthBarPosition,
} from "../public/get";

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

export function updateHealthBar(player: Player, force = false, forceSync = false) {
  if (beingReSynced.get(player.id) || forceClassSelection.get(player.id)) {
    return;
  }

  let health = Math.ceil((playerHealth.get(player.id) / playerMaxHealth.get(player.id)) * 100.0);
  let armour = Math.ceil((playerArmour.get(player.id) / playerMaxArmour.get(player.id)) * 100.0);

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
  } else if (health === lastSentHealth.get(player.id) && armour === lastSentArmour.get(player.id)) {
    return;
  }

  setFakeHealth(player, health);
  setFakeArmour(player, armour);

  if (forceSync || wc_IsPlayerPaused(player)) {
    updateSyncData(player);
  }

  if (health !== lastSentHealth.get(player.id)) {
    lastSentHealth.set(player.id, health);

    orig_playerMethods.setHealth.call(player, 8000000.0 + health);

    if (healthBarVisible.get(player.id) && !isDying.get(player.id)) {
      const { x: sizeX, y: sizeY } = getHealthBarSize(player);
      const { padding } = getHealthBarPadding(player);
      const { fgColor } = getHealthBarColor(player);

      if (
        !healthBarForeground.get(player.id) ||
        healthBarForeground.get(player.id)!.id === InvalidEnum.TEXT_DRAW
      ) {
        const { x: posX, y: posY } = getHealthBarPosition(player);

        healthBarForeground.set(
          player.id,
          new TextDraw({
            player,
            x: posX + padding[3],
            y: posY + padding[0],
            text: "LD_SPAC:white",
          }).create(),
        );

        if (healthBarForeground.get(player.id)!.id === InvalidEnum.TEXT_DRAW) {
          console.log("(wc) WARN: Cannot create player healthbar foreground");
        } else {
          internalPlayerTextDraw.get(player.id)[healthBarForeground.get(player.id)!.id] = true;
          orig_PlayerTextDrawTextSize(
            player.id,
            healthBarForeground.get(player.id)!.id,
            wc_CalculateBar(sizeX - padding[1] - padding[3], 100.0, health),
            sizeY - padding[0] - padding[2],
          );
          orig_PlayerTextDrawColor(player.id, healthBarForeground.get(player.id)!.id, fgColor);
          orig_PlayerTextDrawFont(
            player.id,
            healthBarForeground.get(player.id)!.id,
            TextDrawFontsEnum.SPRITE_DRAW,
          );
          orig_PlayerTextDrawShow(player.id, healthBarForeground.get(player.id)!.id);
        }
      } else if (internalPlayerTextDraw.get(player.id)[healthBarForeground.get(player.id)!.id]) {
        orig_PlayerTextDrawTextSize(
          player.id,
          healthBarForeground.get(player.id)!.id,
          wc_CalculateBar(sizeX - padding[1] - padding[3], 100.0, health),
          sizeY - padding[0] - padding[2],
        );
        orig_PlayerTextDrawShow(player.id, healthBarForeground.get(player.id)!.id);
      }
    } else if (
      healthBarForeground.get(player.id) &&
      healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarForeground.get(player.id)!.id] = false;
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
    const { x: posX, y: posY } = getHealthBarPosition(player);
    const { x: sizeX, y: sizeY } = getHealthBarSize(player);
    const { padding } = getHealthBarPadding(player);
    const { borderColor, bgColor } = getHealthBarColor(player);

    if (!healthBarBorder.get(player.id)) {
      try {
        const td = new TextDraw({
          x: posX,
          y: posY,
          text: "LD_SPAC:white",
          player,
        });
        td.create();

        healthBarBorder.set(player.id, td);
        internalPlayerTextDraw.get(player.id)[healthBarBorder.get(player.id)!.id] = true;
        td.setTextSize(sizeX, sizeY);
        td.setColor(borderColor);
        td.setFont(TextDrawFontsEnum.SPRITE_DRAW);
        td.show();
      } catch {
        console.log("(wc) WARN: Unable to create player healthbar border");
      }
    } else if (internalPlayerTextDraw.get(player.id)[healthBarBorder.get(player.id)!.id]) {
      healthBarBorder.get(player.id)!.show();
    }

    if (!healthBarBackground.get(player.id)) {
      try {
        const td = new TextDraw({
          x: posX + padding[3],
          y: posY + padding[0],
          text: "LD_SPAC:white",
          player,
        });
        td.create();

        healthBarBackground.set(player.id, td);
        internalPlayerTextDraw.get(player.id)[healthBarBackground.get(player.id)!.id] = true;
        td.setTextSize(sizeX - padding[1] - padding[3], sizeY - padding[0] - padding[2]);
        td.setColor(bgColor);
        td.setFont(TextDrawFontsEnum.SPRITE_DRAW);
        td.show();
      } catch {
        console.log("(wc) WARN: Unable to create player healthbar background");
      }
    } else if (internalPlayerTextDraw.get(player.id)[healthBarBackground.get(player.id)!.id]) {
      healthBarBackground.get(player.id)!.show();
    }

    updateHealthBar(player, true);
  } else {
    if (
      healthBarForeground.get(player.id) &&
      healthBarForeground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarForeground.get(player.id)!.id] = false;
      healthBarForeground.get(player.id)!.destroy();
      healthBarForeground.set(player.id, null);
    }

    if (
      healthBarBorder.get(player.id) &&
      healthBarBorder.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarBorder.get(player.id)!.id] = false;
      healthBarBorder.get(player.id)!.destroy();
      healthBarBorder.set(player.id, null);
    }

    if (
      healthBarBackground.get(player.id) &&
      healthBarBackground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[healthBarBackground.get(player.id)!.id] = false;
      healthBarBackground.get(player.id)!.destroy();
      healthBarBackground.set(player.id, null);
    }
  }
}

export function updateHealthBarSize(player: Player) {
  if (!player.isConnected() || !healthBarVisible.get(player.id)) {
    return;
  }

  const { x: sizeX, y: sizeY } = getHealthBarSize(player);
  const { padding } = getHealthBarPadding(player);

  if (
    healthBarBorder.get(player.id) &&
    healthBarBorder.get(player.id)!.id !== InvalidEnum.TEXT_DRAW &&
    internalPlayerTextDraw.get(player.id)[healthBarBorder.get(player.id)!.id]
  ) {
    healthBarBorder.get(player.id)!.setTextSize(sizeX, sizeY).show();
  }

  if (
    healthBarBackground.get(player.id) &&
    healthBarBackground.get(player.id)!.id !== InvalidEnum.TEXT_DRAW &&
    internalPlayerTextDraw.get(player.id)[healthBarBackground.get(player.id)!.id]
  ) {
    healthBarBackground
      .get(player.id)!
      .setTextSize(sizeX - padding[1] - padding[3], sizeY - padding[0] - padding[2])
      .show();
  }

  if (!isDying.get(player.id)) {
    updateHealthBar(player, true);
  }
}

export function spawnPlayerInPlace(player: Player) {
  const { x, y, z } = orig_playerMethods.getPos.call(player)!;
  const r = orig_playerMethods.getFacingAngle.call(player).angle;

  orig_playerMethods.setSpawnInfo.call(
    player,
    playerTeam.get(player.id),
    getPlayerActualSkin(player),
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

export function updatePlayerVirtualWorld(player: Player) {
  let worldId = orig_playerMethods.getVirtualWorld.call(player);
  if (worldId === innerWeaponConfig.DEATH_WORLD) {
    worldId = world.get(player.id);
  } else if (worldId !== world.get(player.id)) {
    world.set(player.id, worldId);
  }
  orig_playerMethods.setVirtualWorld.call(player, worldId);
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

export function setFakeFacingAngle(player: Player, angle = NaN) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  if (isNaN(angle)) {
    fakeQuat.set(player.id, [NaN, NaN, NaN, NaN]);
  } else {
    const { qw, qx, qy, qz } = getRotationQuaternion(0.0, 0.0, angle);
    fakeQuat.set(player.id, [qw, qx, qy, qz]);
  }

  return 1;
}

export function spawnPlayerForWorld(player: Player) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  const bs = new BitStream();

  bs.writeValue([PacketRpcValueType.UInt32, player.id]);

  Player.getInstances().forEach((i) => {
    if (i !== player) {
      bs.sendRPC(i, WC_RPC_REQUEST_SPAWN);
    }
  });

  bs.delete();

  return 1;
}
