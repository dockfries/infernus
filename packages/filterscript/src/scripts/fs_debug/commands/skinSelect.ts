import {
  PlayerEvent,
  CameraCutStylesEnum,
  GameText,
  KeysEnum,
  Player,
} from "@infernus/core";
import {
  gPlayerStatus,
  COLOR_RED,
  aSelNames,
  gPlayerTimers,
  MIN_SKIN_ID,
  MAX_SKIN_ID,
  curPlayerSkin,
  COLOR_GREEN,
} from "../constants";
import { SelStatEnum } from "../enums";
import { IFsDebugOptions } from "../interfaces";
import { getXYInFrontOfPlayer, isInvalidSkin } from "../utils";

function skinSelect(player: Player) {
  // Created by Simon
  /*
  // Make sure the player is not in skin selection before continuing
  if (gPlayerStatus.get(player) !== SKIN_SEL_STAT) {
    const timer = skinTimerID.get(player);
    clearInterval(timer);
    skinTimerID.delete(player);
    return;
  }
  */

  const { keys, leftRight } = player.getKeys();

  let curSkin = curPlayerSkin.get(player) || MIN_SKIN_ID;

  // Right key increases Skin ID
  if (leftRight === KeysEnum.KEY_RIGHT) {
    if (curSkin === MAX_SKIN_ID) {
      curSkin = MIN_SKIN_ID;
    } else {
      curSkin++;
    }
    while (isInvalidSkin(curSkin)) {
      curSkin++;
    }
    curPlayerSkin.set(player, curSkin);
    new GameText(`Skin ID: ${curSkin}`, 1500, 3).forPlayer(player);
    player.setSkin(curSkin);
  }

  // Left key decreases Skin ID
  if (leftRight === KeysEnum.KEY_LEFT) {
    if (curSkin === MIN_SKIN_ID) {
      curSkin = MAX_SKIN_ID;
    } else {
      curSkin--;
    }
    while (isInvalidSkin(curSkin)) {
      curSkin--;
    }
    curPlayerSkin.set(player, curSkin);
    new GameText(`Skin ID: ${curSkin}`, 1500, 3).forPlayer(player);
    player.setSkin(curSkin);
  }

  // Action key exits skin selection
  if (keys & KeysEnum.ACTION) {
    player.setCameraBehind();
    player.toggleControllable(true);
    player.sendClientMessage(
      COLOR_GREEN,
      `[SUCCESS]: You have changed to SKINID ${curSkin}`,
    );

    gPlayerStatus.delete(player);
    const timer = gPlayerTimers.get(player);
    if (timer) {
      clearInterval(timer);
      gPlayerTimers.delete(player);
    }
  }
}

export function registerSkinSelect(options?: IFsDebugOptions) {
  if (options?.skinSelect === false) return [];

  const skinSel = PlayerEvent.onCommandText("ssel", ({ player, next }) => {
    // /ssel allows players to select a skin using playerkeys.
    const status = gPlayerStatus.get(player);
    if (status) {
      player.sendClientMessage(
        COLOR_RED,
        `[ERROR]: You are already using "${aSelNames[status - 1]}".`,
      );
      return next();
    }
    gPlayerStatus.set(player, SelStatEnum.SKIN);
    const pos = player.getPos()!;
    let { x, y } = pos;
    const { z } = pos;
    player.setCameraLookAt(x, y, z, CameraCutStylesEnum.CUT);
    const frontXY = getXYInFrontOfPlayer(player, 3.5);
    x = frontXY.x;
    y = frontXY.y;
    player.setCameraPos(x, y, z);
    player.toggleControllable(false);
    gPlayerTimers.set(
      player,
      setInterval(() => {
        skinSelect(player);
      }),
    );
    return next();
  });

  const skin = PlayerEvent.onCommandText(
    ["s", "skin"],
    ({ player, subcommand, next }) => {
      // /s SKINID allows players to directly select a skin using it's ID.
      if (!subcommand[0]) {
        player.sendClientMessage(COLOR_RED, "[USAGE]: /s SKINID");
        return next();
      }
      const idx = +subcommand[0];
      if (isInvalidSkin(idx) || idx < MIN_SKIN_ID || idx > MAX_SKIN_ID) {
        player.sendClientMessage(COLOR_RED, "[ERROR]: Invalid SKINID");
        return next();
      }
      player.setSkin(idx);
      curPlayerSkin.set(player, idx);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: Changed skin to SKINID ${idx}`,
      );
      return next();
    },
  );

  return [skinSel, skin];
}
