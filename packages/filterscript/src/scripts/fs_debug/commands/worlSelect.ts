import fs from "fs";
import path from "path";
import {
  PlayerEvent,
  GameMode,
  GameText,
  CameraCutStylesEnum,
  Player,
  KeysEnum,
} from "@infernus/core";
import {
  COLOR_RED,
  COLOR_GREEN,
  MIN_WEAT_ID,
  MAX_WEAT_ID,
  gWorldStatus,
  MIN_TIME_ID,
  MAX_TIME_ID,
  gPlayerStatus,
  aSelNames,
  gPlayerTimers,
} from "../constants";
import { SelStatEnum } from "../enums";
import { IFsDebugOptions } from "../interfaces";
import { getXYInFrontOfPlayer } from "../utils";

function worldSelect(player: Player) {
  // Created by Simon
  /*
  // Make sure the player is not in world selection before continuing
  if (gPlayerStatus.get(player) !== WORL_SEL_STAT) {
    const timer = skinTimerID.get(player);
    clearInterval(timer);
    skinTimerID.delete(player);
    return;
  }
  */

  const { keys, upDown, leftRight } = player.getKeys();

  // Right key increases World Time
  if (leftRight === KeysEnum.KEY_RIGHT) {
    if (gWorldStatus[0] === MAX_TIME_ID) {
      gWorldStatus[0] = MIN_TIME_ID;
    } else {
      gWorldStatus[0]++;
    }
    new GameText(
      `World Time: ${gWorldStatus[0]}~n~Weather ID: ${gWorldStatus[1]}`,
      1500,
      3,
    ).forPlayer(player);
    GameMode.setWorldTime(gWorldStatus[0]);
  }

  // Left key decreases World Time
  if (leftRight === KeysEnum.KEY_LEFT) {
    if (gWorldStatus[0] === MIN_TIME_ID) {
      gWorldStatus[0] = MAX_TIME_ID;
    } else {
      gWorldStatus[0]--;
    }
    new GameText(
      `World Time: ${gWorldStatus[0]}~n~Weather ID: ${gWorldStatus[1]}`,
      1500,
      3,
    ).forPlayer(player);
    GameMode.setWorldTime(gWorldStatus[0]);
  }

  // Up key increases Weather ID
  if (upDown === KeysEnum.KEY_UP) {
    if (gWorldStatus[1] === MAX_WEAT_ID) {
      gWorldStatus[1] = MIN_WEAT_ID;
    } else {
      gWorldStatus[1]++;
    }
    new GameText(
      `World Time: ${gWorldStatus[0]}~n~Weather ID: ${gWorldStatus[1]}`,
      1500,
      3,
    ).forPlayer(player);
    GameMode.setWeather(gWorldStatus[1]);
  }

  // Down key decreases Weather ID
  if (upDown === KeysEnum.KEY_DOWN) {
    if (gWorldStatus[1] === MIN_WEAT_ID) {
      gWorldStatus[1] = MAX_WEAT_ID;
    } else {
      gWorldStatus[1]--;
    }
    new GameText(
      `World Time: ${gWorldStatus[0]}~n~Weather ID: ${gWorldStatus[1]}`,
      1500,
      3,
    ).forPlayer(player);
    GameMode.setWeather(gWorldStatus[1]);
  }

  // Action key exits WorldSelection
  if (keys & KeysEnum.ACTION) {
    player.setCameraBehind();
    player.toggleControllable(true);
    player.sendClientMessage(
      COLOR_GREEN,
      `[SUCCESS]: Time changed to ${gWorldStatus[0]} hours and weather changed to WEATHERID ${gWorldStatus[1]}`,
    );

    const date = new Date();
    const D = date.getDate();
    const M = date.getMonth() + 1;
    const Y = date.getFullYear();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const cString = `// ${D}-${M}-${Y} @ ${h}:${m}:${s}\nSetWeather(${gWorldStatus[1]});\nSetWorldTime(${gWorldStatus[0]});\n`;
    const fullPath = path.resolve(
      process.cwd(),
      "scriptfiles",
      "TIME-WEATHER.txt",
    );
    fs.writeFile(fullPath, cString, { flag: "a" }, (err) => {
      if (err) {
        console.log('Failed to create the file "TIME-WEATHER.txt".\n');
        console.log(err);
      } else {
        console.log(cString);
      }
    });

    gPlayerStatus.delete(player);
    const timer = gPlayerTimers.get(player);
    if (timer) {
      clearInterval(timer);
      gPlayerTimers.delete(player);
    }
  }
}

export function registerWorlSelect(options?: IFsDebugOptions) {
  if (options?.worldSelect === false) return [];

  const gravity = PlayerEvent.onCommandText(
    ["g", "gravity"],
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(
          COLOR_RED,
          "[USAGE]: /g GRAVITY or /gravity GRAVITY",
        );
        return next();
      }
      const gravity = +subcommand[0] || 0;
      GameMode.setGravity(gravity);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: World gravity changed to ${gravity}`,
      );
      return next();
    },
  );

  const weather = PlayerEvent.onCommandText(
    ["w", "weather"],
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(
          COLOR_RED,
          "[USAGE]: /w WEATHERID or /weather WEATHERID",
        );
        return next();
      }
      const idx = +subcommand[0];
      if (idx < MIN_WEAT_ID || idx > MAX_WEAT_ID) {
        player.sendClientMessage(COLOR_RED, "[ERROR]: Invalid WEATHERID");
        return next();
      }
      gWorldStatus[1] = idx;
      GameMode.setWeather(idx);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: Weather has changed to WEATHERID ${idx}`,
      );
      return next();
    },
  );

  const time = PlayerEvent.onCommandText(
    ["t", "time"],
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(COLOR_RED, "[USAGE]: /t HOUR or /time HOUR");
        return next();
      }
      const idx = +subcommand[0];
      if (idx < MIN_TIME_ID || idx > MAX_TIME_ID) {
        player.sendClientMessage(COLOR_RED, "[ERROR]: Invalid HOUR");
        return next();
      }
      gWorldStatus[0] = idx;
      GameMode.setWorldTime(idx);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: Time has changed to HOUR ${idx}`,
      );
      return next();
    },
  );

  const worldSel = PlayerEvent.onCommandText("wsel", ({ player, next }) => {
    const status = gPlayerStatus.get(player);
    if (status) {
      player.sendClientMessage(
        COLOR_RED,
        `[ERROR]: You are already using "${aSelNames[status - 1]}".`,
      );
      return next();
    }
    gPlayerStatus.set(player, SelStatEnum.WORL);
    const pos = player.getPos()!;
    let { x, y } = pos;
    const z = pos.z;
    player.setCameraPos(x, y, z + 40.0);
    const frontXY = getXYInFrontOfPlayer(player, 100.0);
    x = frontXY.x;
    y = frontXY.y;
    player.setCameraLookAt(x, y, z + 5.0, CameraCutStylesEnum.CUT);
    player.toggleControllable(false);
    gPlayerTimers.set(
      player,
      setInterval(() => {
        worldSelect(player);
      }, 200),
    );
    new GameText("WorldSelect", 1500, 3).forPlayer(player);
    return next();
  });

  return [gravity, weather, time, worldSel];
}
