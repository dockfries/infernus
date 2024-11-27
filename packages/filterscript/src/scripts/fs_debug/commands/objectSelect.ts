import {
  PlayerEvent,
  DynamicObject,
  CameraCutStylesEnum,
  KeysEnum,
  Player,
  GameText,
} from "@infernus/core";
import {
  COLOR_WHITE,
  pObjectRate,
  COLOR_GREEN,
  OBJECT_MODE_SELECTOR,
  OBJECT_MODE_ROTATOR,
  curPlayerObjM,
  OBJECT_MODE_MOVER,
  COLOR_RED,
  curPlayerObjI,
  curPlayerCamD,
  gPlayerStatus,
  aSelNames,
  OBJECT_DISTANCE,
  gPlayerTimers,
  MAX_OBJECT_ID,
  MIN_OBJECT_ID,
} from "../constants";
import { SelStatEnum } from "../enums";
import {
  IFsDebugOptions,
  I_OBJECT,
  I_OBJ_RATE,
  P_CAMERA_D,
} from "../interfaces";
import { getXYInFrontOfPlayer, isValidModel } from "../utils";

function objectSelect(player: Player) {
  const { keys, upDown, leftRight } = player.getKeys();

  const p_curPlayerObjM = curPlayerObjM.get(player)!;
  const p_curPlayerCamD = curPlayerCamD.get(player)!;
  const p_pObjectRate = pObjectRate.get(player)!;

  const objId = curPlayerObjI.get(player)!;
  let obj = DynamicObject.getInstance(objId)!;

  switch (p_curPlayerObjM.OBJ_MOD) {
    case OBJECT_MODE_SELECTOR: {
      if (upDown === KeysEnum.KEY_UP) {
        p_curPlayerObjM.OBJ_MDL += 10;

        if (p_curPlayerObjM.OBJ_MDL >= MAX_OBJECT_ID) {
          p_curPlayerObjM.OBJ_MDL = MIN_OBJECT_ID;
        }

        while (!isValidModel(p_curPlayerObjM.OBJ_MDL)) {
          p_curPlayerObjM.OBJ_MDL++;
        }

        obj.destroy();
        obj = new DynamicObject({
          modelId: p_curPlayerObjM.OBJ_MDL,
          x: p_curPlayerObjM.OBJ_X,
          y: p_curPlayerObjM.OBJ_Y,
          z: p_curPlayerObjM.OBJ_Z,
          rx: p_curPlayerObjM.OBJ_RX,
          ry: p_curPlayerObjM.OBJ_RY,
          rz: p_curPlayerObjM.OBJ_RZ,
        });
        obj.create();
        curPlayerObjI.set(player, obj.id);
        new GameText(`Model ID: ${p_curPlayerObjM.OBJ_MDL}`, 1500, 3).forPlayer(
          player,
        );
      }

      if (upDown === KeysEnum.KEY_DOWN) {
        p_curPlayerObjM.OBJ_MDL -= 10;

        if (p_curPlayerObjM.OBJ_MDL <= MIN_OBJECT_ID) {
          p_curPlayerObjM.OBJ_MDL = MAX_OBJECT_ID;
        }

        while (!isValidModel(p_curPlayerObjM.OBJ_MDL)) {
          p_curPlayerObjM.OBJ_MDL--;
        }

        obj.destroy();
        obj = new DynamicObject({
          modelId: p_curPlayerObjM.OBJ_MDL,
          x: p_curPlayerObjM.OBJ_X,
          y: p_curPlayerObjM.OBJ_Y,
          z: p_curPlayerObjM.OBJ_Z,
          rx: p_curPlayerObjM.OBJ_RX,
          ry: p_curPlayerObjM.OBJ_RY,
          rz: p_curPlayerObjM.OBJ_RZ,
        });
        obj.create();
        curPlayerObjI.set(player, obj.id);

        new GameText(`Model ID: ${p_curPlayerObjM.OBJ_MDL}`, 1500, 3).forPlayer(
          player,
        );
      }

      if (leftRight === KeysEnum.KEY_LEFT) {
        p_curPlayerObjM.OBJ_MDL--;

        if (p_curPlayerObjM.OBJ_MDL <= MIN_OBJECT_ID) {
          p_curPlayerObjM.OBJ_MDL = MAX_OBJECT_ID;
        }

        while (!isValidModel(p_curPlayerObjM.OBJ_MDL)) {
          p_curPlayerObjM.OBJ_MDL--;
        }

        obj.destroy();
        obj = new DynamicObject({
          modelId: p_curPlayerObjM.OBJ_MDL,
          x: p_curPlayerObjM.OBJ_X,
          y: p_curPlayerObjM.OBJ_Y,
          z: p_curPlayerObjM.OBJ_Z,
          rx: p_curPlayerObjM.OBJ_RX,
          ry: p_curPlayerObjM.OBJ_RY,
          rz: p_curPlayerObjM.OBJ_RZ,
        });
        obj.create();
        curPlayerObjI.set(player, obj.id);

        new GameText(`Model ID: ${p_curPlayerObjM.OBJ_MDL}`, 1500, 3).forPlayer(
          player,
        );
      }

      if (leftRight === KeysEnum.KEY_RIGHT) {
        p_curPlayerObjM.OBJ_MDL++;

        if (p_curPlayerObjM.OBJ_MDL >= MAX_OBJECT_ID) {
          p_curPlayerObjM.OBJ_MDL = MIN_OBJECT_ID;
        }

        while (!isValidModel(p_curPlayerObjM.OBJ_MDL)) {
          p_curPlayerObjM.OBJ_MDL++;
        }

        obj.destroy();
        obj = new DynamicObject({
          modelId: p_curPlayerObjM.OBJ_MDL,
          x: p_curPlayerObjM.OBJ_X,
          y: p_curPlayerObjM.OBJ_Y,
          z: p_curPlayerObjM.OBJ_Z,
          rx: p_curPlayerObjM.OBJ_RX,
          ry: p_curPlayerObjM.OBJ_RY,
          rz: p_curPlayerObjM.OBJ_RZ,
        });
        obj.create();
        curPlayerObjI.set(player, obj.id);

        new GameText(`Model ID: ${p_curPlayerObjM.OBJ_MDL}`, 1500, 3).forPlayer(
          player,
        );
      }
      break;
    }

    case OBJECT_MODE_MOVER: {
      if (upDown === KeysEnum.KEY_UP) {
        p_curPlayerObjM.OBJ_Z += p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.POS_Z += p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.LOOK_Z += p_pObjectRate.OBJ_RATE_MOVE;
      }

      if (upDown === KeysEnum.KEY_DOWN) {
        p_curPlayerObjM.OBJ_Z -= p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.POS_Z -= p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.LOOK_Z -= p_pObjectRate.OBJ_RATE_MOVE;
      }

      if (leftRight === KeysEnum.KEY_LEFT) {
        p_curPlayerObjM.OBJ_Y -= p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.POS_Y -= p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.LOOK_Y -= p_pObjectRate.OBJ_RATE_MOVE;
      }

      if (leftRight === KeysEnum.KEY_RIGHT) {
        p_curPlayerObjM.OBJ_Y += p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.POS_Y += p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.LOOK_Y += p_pObjectRate.OBJ_RATE_MOVE;
      }

      if (keys & KeysEnum.ANALOG_LEFT) {
        p_curPlayerObjM.OBJ_Y -= p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.POS_Y -= p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.LOOK_Y -= p_pObjectRate.OBJ_RATE_MOVE;
      }

      if (keys & KeysEnum.ANALOG_LEFT) {
        p_curPlayerObjM.OBJ_X += p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.POS_X += p_pObjectRate.OBJ_RATE_MOVE;
        p_curPlayerCamD.LOOK_X += p_pObjectRate.OBJ_RATE_MOVE;
      }

      player.setPos(
        p_curPlayerCamD.POS_X,
        p_curPlayerCamD.POS_Y,
        p_curPlayerCamD.POS_Z,
      );
      obj.setPos(
        p_curPlayerObjM.OBJ_X,
        p_curPlayerObjM.OBJ_Y,
        p_curPlayerObjM.OBJ_Z,
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

      break;
    }

    case OBJECT_MODE_ROTATOR: {
      if (upDown === KeysEnum.KEY_UP) {
        p_curPlayerObjM.OBJ_RZ += p_pObjectRate.OBJ_RATE_ROT;
      }

      if (upDown === KeysEnum.KEY_DOWN) {
        p_curPlayerObjM.OBJ_RZ -= p_pObjectRate.OBJ_RATE_ROT;
      }

      if (leftRight === KeysEnum.KEY_LEFT) {
        p_curPlayerObjM.OBJ_RY -= p_pObjectRate.OBJ_RATE_ROT;
      }

      if (leftRight === KeysEnum.KEY_RIGHT) {
        p_curPlayerObjM.OBJ_RY += p_pObjectRate.OBJ_RATE_ROT;
      }

      if (keys & KeysEnum.ANALOG_LEFT) {
        p_curPlayerObjM.OBJ_RY -= p_pObjectRate.OBJ_RATE_ROT;
      }

      if (keys & KeysEnum.ANALOG_LEFT) {
        p_curPlayerObjM.OBJ_RX += p_pObjectRate.OBJ_RATE_ROT;
      }

      obj.setRot(
        p_curPlayerObjM.OBJ_RX,
        p_curPlayerObjM.OBJ_RY,
        p_curPlayerObjM.OBJ_RZ,
      );

      break;
    }
  }

  curPlayerObjM.set(player, p_curPlayerObjM);
  curPlayerCamD.set(player, p_curPlayerCamD);
  pObjectRate.set(player, p_pObjectRate);

  if (keys & KeysEnum.ACTION) {
    gPlayerStatus.delete(player);
    player.toggleControllable(true);
    player.setCameraBehind();
    const timer = gPlayerTimers.get(player);
    if (timer) {
      clearInterval(timer);
      gPlayerTimers.delete(player);
    }
  }
}

export function registerObjectSelect(options?: IFsDebugOptions) {
  if (options?.objectSelect === false) return [];

  const obj = PlayerEvent.onCommandText("object", ({ player, next }) => {
    player.sendClientMessage(
      COLOR_WHITE,
      "[USAGE]: /object [RRATE/MRATE/CAMERA] [RATE/ID]",
    );
    return next();
  });

  const objRate = PlayerEvent.onCommandText(
    "object rrate",
    ({ player, subcommand, next }) => {
      const p_pObjectRate = pObjectRate.get(player) || ({} as I_OBJ_RATE);
      p_pObjectRate.OBJ_RATE_ROT = +subcommand[0] || 0;
      pObjectRate.set(player, p_pObjectRate);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: Object rotation rate changed to ${p_pObjectRate.OBJ_RATE_ROT}.`,
      );
      return next();
    },
  );

  const objMoveRate = PlayerEvent.onCommandText(
    "object mrate",
    ({ player, subcommand, next }) => {
      const p_pObjectRate = pObjectRate.get(player) || ({} as I_OBJ_RATE);
      p_pObjectRate.OBJ_RATE_MOVE = +subcommand[0] || 0;
      pObjectRate.set(player, p_pObjectRate);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: Object movement rate changed to ${p_pObjectRate.OBJ_RATE_MOVE}.`,
      );
      return next();
    },
  );

  const objMode = PlayerEvent.onCommandText(
    "object mode",
    ({ player, subcommand, next }) => {
      const mode = +subcommand[0];
      if (mode >= OBJECT_MODE_SELECTOR || mode <= OBJECT_MODE_ROTATOR) {
        const p_curPlayerObjM = curPlayerObjM.get(player) || ({} as I_OBJECT);
        p_curPlayerObjM.OBJ_MOD = mode;
        curPlayerObjM.set(player, p_curPlayerObjM);
        switch (mode) {
          case OBJECT_MODE_SELECTOR:
            player.sendClientMessage(
              COLOR_GREEN,
              "[SUCCESS]: Object mode changed to Object Selection.",
            );
            break;
          case OBJECT_MODE_MOVER:
            player.sendClientMessage(
              COLOR_GREEN,
              "[SUCCESS]: Object mode changed to Object Mover.",
            );
            break;
          case OBJECT_MODE_ROTATOR:
            player.sendClientMessage(
              COLOR_GREEN,
              "[SUCCESS]: Object mode changed to Object Rotator.",
            );
            break;
        }
        return next();
      }
      player.sendClientMessage(COLOR_RED, "[ERROR]: Invalid modeId.");
      return next();
    },
  );

  const objFocus = PlayerEvent.onCommandText(
    "object focus",
    ({ player, subcommand, next }) => {
      const objId = +subcommand[0] || -1;
      const obj = DynamicObject.getInstance(objId);
      if (!obj) {
        player.sendClientMessage(COLOR_RED, "[ERROR]: Enter a valid objectid.");
        return next();
      }
      curPlayerObjI.set(player, objId);

      const p_curPlayerObjM = curPlayerObjM.get(player) || ({} as I_OBJECT);

      const { x, y, z } = obj.getPos();

      p_curPlayerObjM.OBJ_X = x;
      p_curPlayerObjM.OBJ_Y = y;
      p_curPlayerObjM.OBJ_Z = z;

      const { rx, ry, rz } = obj.getRot();

      p_curPlayerObjM.OBJ_X = rx;
      p_curPlayerObjM.OBJ_Y = ry;
      p_curPlayerObjM.OBJ_Z = rz;

      curPlayerObjM.set(player, p_curPlayerObjM);

      const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);

      p_curPlayerCamD.POS_X = p_curPlayerObjM.OBJ_X + 5.0;
      p_curPlayerCamD.POS_Y = p_curPlayerObjM.OBJ_Y - 20.0;
      p_curPlayerCamD.POS_Z = p_curPlayerObjM.OBJ_Z + 30.0;

      p_curPlayerCamD.LOOK_X = p_curPlayerObjM.OBJ_X;
      p_curPlayerCamD.LOOK_Y = p_curPlayerObjM.OBJ_Y;
      p_curPlayerCamD.LOOK_Z = p_curPlayerObjM.OBJ_Z;

      curPlayerCamD.set(player, p_curPlayerCamD);

      if (gPlayerStatus.get(player) === SelStatEnum.OBJECT) {
        player.setCameraPos(
          p_curPlayerCamD.POS_X,
          p_curPlayerCamD.POS_Y,
          p_curPlayerCamD.POS_Z,
        );
        player.setCameraLookAt(
          p_curPlayerObjM.OBJ_X,
          p_curPlayerObjM.OBJ_Y,
          p_curPlayerObjM.OBJ_Z,
          CameraCutStylesEnum.CUT,
        );
      }
      return next();
    },
  );

  const objCamera = PlayerEvent.onCommandText(
    "object camera",
    ({ player, subcommand, next }) => {
      const cameraId = +subcommand[0];
      if (cameraId >= 0 && cameraId < 4) {
        const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);
        const p_curPlayerObjM = curPlayerObjM.get(player) || ({} as I_OBJECT);
        switch (cameraId) {
          case 0: {
            p_curPlayerCamD.POS_X = p_curPlayerObjM.OBJ_X + 7.0;
            p_curPlayerCamD.POS_Y = p_curPlayerObjM.OBJ_Y - 20.0;
            p_curPlayerCamD.POS_Z = p_curPlayerObjM.OBJ_Z + 30.0;
            break;
          }

          case 1: {
            p_curPlayerCamD.POS_X = p_curPlayerObjM.OBJ_X + 7.0;
            p_curPlayerCamD.POS_Y = p_curPlayerObjM.OBJ_Y + 15.0;
            p_curPlayerCamD.POS_Z = p_curPlayerObjM.OBJ_X + 15.0;
            break;
          }

          case 2: {
            p_curPlayerCamD.POS_X = p_curPlayerObjM.OBJ_X - 20.0;
            p_curPlayerCamD.POS_Y = p_curPlayerObjM.OBJ_Y + 20.0;
            p_curPlayerCamD.POS_Z = p_curPlayerObjM.OBJ_X + 20.0;
            break;
          }

          case 3: {
            p_curPlayerCamD.POS_X = p_curPlayerObjM.OBJ_X - 10.0;
            p_curPlayerCamD.POS_Y = p_curPlayerObjM.OBJ_Y + 25.0;
            p_curPlayerCamD.POS_Z = p_curPlayerObjM.OBJ_X + 15.0;
            break;
          }
        }
        curPlayerCamD.set(player, p_curPlayerCamD);
        player.setCameraPos(
          p_curPlayerCamD.POS_X,
          p_curPlayerCamD.POS_Y,
          p_curPlayerCamD.POS_Z,
        );
        player.setCameraLookAt(
          p_curPlayerObjM.OBJ_X,
          p_curPlayerObjM.OBJ_Y,
          p_curPlayerObjM.OBJ_Z,
          CameraCutStylesEnum.CUT,
        );

        return next();
      }
      player.sendClientMessage(COLOR_RED, "[ERROR]: Invalid object camera id.");
      return next();
    },
  );

  const objSel = PlayerEvent.onCommandText("osel", ({ player, next }) => {
    const status = gPlayerStatus.get(player);

    if (status) {
      player.sendClientMessage(
        COLOR_RED,
        `[ERROR]: You are already using "${aSelNames[status - 1]}".`,
      );
      return next();
    }

    gPlayerStatus.set(player, SelStatEnum.OBJECT);

    const p_curPlayerCamD = curPlayerCamD.get(player) || ({} as P_CAMERA_D);
    const p_curPlayerObjM = curPlayerObjM.get(player) || ({} as I_OBJECT);

    const { x, y, z } = player.getPos()!;

    p_curPlayerCamD.POS_X = x;
    p_curPlayerCamD.POS_Y = y;
    p_curPlayerCamD.POS_Z = z;

    p_curPlayerCamD.POS_Z += 5.0;
    player.setCameraPos(
      p_curPlayerCamD.POS_X,
      p_curPlayerCamD.POS_Y,
      p_curPlayerCamD.POS_Z,
    );

    const { x: cloo_x, y: cloo_y } = getXYInFrontOfPlayer(
      player,
      OBJECT_DISTANCE,
    );

    p_curPlayerCamD.LOOK_X = cloo_x;
    p_curPlayerCamD.LOOK_Y = cloo_y;
    p_curPlayerCamD.LOOK_Z = p_curPlayerCamD.POS_Z - 5.0;

    player.setCameraLookAt(
      p_curPlayerCamD.LOOK_X,
      p_curPlayerCamD.LOOK_Y,
      p_curPlayerCamD.LOOK_Z,
      CameraCutStylesEnum.CUT,
    );

    curPlayerCamD.set(player, p_curPlayerCamD);

    player.toggleControllable(false);

    p_curPlayerObjM.OBJ_X = p_curPlayerCamD.LOOK_X;
    p_curPlayerObjM.OBJ_Y = p_curPlayerCamD.LOOK_Y;
    p_curPlayerObjM.OBJ_Z = p_curPlayerCamD.LOOK_Z;
    p_curPlayerObjM.OBJ_RX = 0.0;
    p_curPlayerObjM.OBJ_RY = 0.0;
    p_curPlayerObjM.OBJ_RZ = 0.0;

    curPlayerObjM.set(player, p_curPlayerObjM);

    const obj = new DynamicObject({
      modelId: p_curPlayerObjM.OBJ_MDL,
      x: p_curPlayerObjM.OBJ_X,
      y: p_curPlayerObjM.OBJ_Y,
      z: p_curPlayerObjM.OBJ_Z,
      rx: p_curPlayerObjM.OBJ_RX,
      ry: p_curPlayerObjM.OBJ_RY,
      rz: p_curPlayerObjM.OBJ_RZ,
    });
    obj.create();
    curPlayerObjI.set(player, obj.id);

    gPlayerTimers.set(
      player,
      setInterval(() => {
        objectSelect(player);
      }, 200),
    );
    return next();
  });

  return [obj, objRate, objMoveRate, objMode, objFocus, objCamera, objSel];
}
