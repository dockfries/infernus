import fs from "fs";
import path from "path";
import {
  PlayerEvent,
  CameraCutStylesEnum,
  KeysEnum,
  Player,
} from "@infernus/core";
import {
  COLOR_GREEN,
  COLOR_RED,
  curPlayerCamD,
  gPlayerStatus,
  aSelNames,
  gPlayerTimers,
  CAMERA_MODE_A,
  CAMERA_MODE_B,
} from "../constants";
import { SelStatEnum } from "../enums";
import { IFsDebugOptions, P_CAMERA_D } from "../interfaces";
import { getXYInFrontOfPlayer } from "../utils";

function cameraSelect(player: Player) {
  // CAMERA_MODE_A 0	Up/Down = IncreaseZ/DecreaseZ; Left/Right = IncreaseX/DecreaseX; Num4/Num6 = IncreaseY/DecreaseY
  // CAMERA_MODE_B 1	Up/Down = Rotate Up/Down; Left/Right = Rotate Left/Right; Num4/Num6 = Move Left/Right

  const { keys, upDown, leftRight } = player.getKeys();

  console.log(
    `Player (${player.id}) keys = ${keys}, upDown = ${upDown}, leftRight = ${leftRight}`,
  );

  const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);

  if (p_curPlayerCamD.MODE === CAMERA_MODE_A) {
    if (leftRight === KeysEnum.KEY_RIGHT) {
      p_curPlayerCamD.POS_X += p_curPlayerCamD.RATE;
      p_curPlayerCamD.LOOK_X += p_curPlayerCamD.RATE;
      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraLookAt(
        p_curPlayerCamD.LOOK_X,
        p_curPlayerCamD.LOOK_Y,
        p_curPlayerCamD.LOOK_Z,
        CameraCutStylesEnum.CUT,
      );
    }

    if (leftRight === KeysEnum.KEY_LEFT) {
      p_curPlayerCamD.POS_X -= p_curPlayerCamD.RATE;
      p_curPlayerCamD.LOOK_X -= p_curPlayerCamD.RATE;
      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraLookAt(
        p_curPlayerCamD.LOOK_X,
        p_curPlayerCamD.LOOK_Y,
        p_curPlayerCamD.LOOK_Z,
        CameraCutStylesEnum.CUT,
      );
    }

    if (upDown === KeysEnum.KEY_UP) {
      p_curPlayerCamD.POS_Z += p_curPlayerCamD.RATE;
      p_curPlayerCamD.LOOK_Z += p_curPlayerCamD.RATE;
      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraLookAt(
        p_curPlayerCamD.LOOK_X,
        p_curPlayerCamD.LOOK_Y,
        p_curPlayerCamD.LOOK_Z,
        CameraCutStylesEnum.CUT,
      );
    }

    if (upDown === KeysEnum.KEY_DOWN) {
      p_curPlayerCamD.POS_Z -= p_curPlayerCamD.RATE;
      p_curPlayerCamD.LOOK_Z -= p_curPlayerCamD.RATE;
      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraLookAt(
        p_curPlayerCamD.LOOK_X,
        p_curPlayerCamD.LOOK_Y,
        p_curPlayerCamD.LOOK_Z,
        CameraCutStylesEnum.CUT,
      );
    }

    if (keys & KeysEnum.ANALOG_RIGHT) {
      p_curPlayerCamD.POS_Y += p_curPlayerCamD.RATE;
      p_curPlayerCamD.LOOK_Y += p_curPlayerCamD.RATE;
      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraLookAt(
        p_curPlayerCamD.LOOK_X,
        p_curPlayerCamD.LOOK_Y,
        p_curPlayerCamD.LOOK_Z,
        CameraCutStylesEnum.CUT,
      );
    }

    if (keys & KeysEnum.ANALOG_LEFT) {
      p_curPlayerCamD.POS_Y -= p_curPlayerCamD.RATE;
      p_curPlayerCamD.LOOK_Y -= p_curPlayerCamD.RATE;
      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      player.setCameraLookAt(
        p_curPlayerCamD.LOOK_X,
        p_curPlayerCamD.LOOK_Y,
        p_curPlayerCamD.LOOK_Z,
        CameraCutStylesEnum.CUT,
      );
    }
  }

  if (p_curPlayerCamD.MODE === CAMERA_MODE_B) {
    if (leftRight === KeysEnum.KEY_RIGHT) {
      // Rotate Y +
    }

    if (leftRight === KeysEnum.KEY_LEFT) {
      // Rotate Y -
    }

    if (upDown === KeysEnum.KEY_UP) {
      // Rotate X +
    }

    if (upDown === KeysEnum.KEY_DOWN) {
      // Rotate X -
    }

    if (keys & KeysEnum.ANALOG_RIGHT) {
      // Rotate Z +
    }

    if (keys & KeysEnum.ANALOG_LEFT) {
      // Rotate Z -
    }
  }

  if (keys & KeysEnum.ACTION) {
    player.setCameraBehind();
    player.toggleControllable(true);

    const date = new Date();
    const D = date.getDate();
    const M = date.getMonth() + 1;
    const Y = date.getFullYear();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const cString = `// ${D}-${M}-${Y} @ ${h}:${m}:${s}\nSetPlayerCameraPos(playerid, ${p_curPlayerCamD.POS_X}, ${p_curPlayerCamD.POS_Y}, ${p_curPlayerCamD.POS_Z});\r\nSetPlayerCameraLookAt(playerid, ${p_curPlayerCamD.LOOK_X}, ${p_curPlayerCamD.LOOK_Y}, ${p_curPlayerCamD.LOOK_Z});\n`;
    const fullPath = path.resolve(process.cwd(), "scriptfiles", "CAMERA.txt");
    fs.writeFile(fullPath, cString, { flag: "a" }, (err) => {
      if (err) {
        console.log('Failed to create the file "CAMERA.txt".\n');
        console.log(err);
      } else {
        console.log("\n" + cString + "\n");
        player.sendClientMessage(
          COLOR_GREEN,
          "Current camera data saved to 'CAMERA.txt'",
        );
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

export function registerCameraSelect(options?: IFsDebugOptions) {
  if (options?.cameraSelect === false) return [];

  const camera = PlayerEvent.onCommandText("camera", ({ player, next }) => {
    player.sendClientMessage(
      COLOR_RED,
      "[USAGE]: /camera [RATE/MODE] [RATE/MODEID]",
    );
    return next();
  });

  const cameraRate = PlayerEvent.onCommandText(
    "camera rate",
    ({ player, subcommand, next }) => {
      const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);
      p_curPlayerCamD.RATE = +subcommand[0] || 0;
      curPlayerCamD.set(player, p_curPlayerCamD);
      return next();
    },
  );

  const cameraMode = PlayerEvent.onCommandText(
    "camera mode",
    ({ player, subcommand, next }) => {
      const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);
      p_curPlayerCamD.MODE = +subcommand[0] || 0;
      curPlayerCamD.set(player, p_curPlayerCamD);
      return next();
    },
  );

  const cameraSel = PlayerEvent.onCommandText("csel", ({ player, next }) => {
    const status = gPlayerStatus.get(player);
    if (status) {
      player.sendClientMessage(
        COLOR_RED,
        `[ERROR]: You are already using "${aSelNames[status]}".`,
      );
      return next();
    }
    gPlayerStatus.set(player, SelStatEnum.CAMERA);
    player.toggleControllable(false);

    const { x, y, z } = player.getPos()!;

    const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);

    p_curPlayerCamD.POS_X = x;
    p_curPlayerCamD.POS_Y = y;
    p_curPlayerCamD.POS_Z = z;

    const { x: cloo_x, y: cloo_y } = getXYInFrontOfPlayer(player, 5.0);

    p_curPlayerCamD.LOOK_X = cloo_x;
    p_curPlayerCamD.LOOK_Y = cloo_y;
    p_curPlayerCamD.LOOK_Z = p_curPlayerCamD.POS_Z;

    curPlayerCamD.set(player, p_curPlayerCamD);

    gPlayerTimers.set(
      player,
      setInterval(() => {
        cameraSelect(player);
      }, 200),
    );
  });

  return [camera, cameraRate, cameraMode, cameraSel];
}
