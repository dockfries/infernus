//-------------------------------------------------
//
// This is an example of using the AttachCameraToObject function
// to create a no-clip flying camera.
//
// h02 2012
//
// SA-MP 0.3e and above
//
//-------------------------------------------------

import type { IFilterScript } from "@infernus/core";
import { KeysEnum } from "@infernus/core";
import { DynamicObject, Player, PlayerEvent } from "@infernus/core";
import type { NoClipOptions } from "./interfaces";
import { CameraMode, Move } from "./enums";
import { ACCEL_RATE, MOVE_SPEED } from "./constants";

const noClipData = new Map<Player, NoClipOptions>();

function resetPlayerClip(player: Player) {
  noClipData.set(player, {
    cameraMode: CameraMode.NONE,
    lrOld: KeysEnum.NONE,
    udOld: KeysEnum.NONE,
    mode: 0,
    lastMove: 0,
    accelMul: 0.0,
  });
}

function getMoveDirectionFromKeys(ud: KeysEnum, lr: KeysEnum) {
  let direction = 0;

  if (lr < 0) {
    if (ud < 0)
      direction = Move.FORWARD_LEFT; // Up & Left key pressed
    else if (ud > 0)
      direction = Move.BACK_LEFT; // Back & Left key pressed
    else direction = Move.LEFT; // Left key pressed
  } else if (lr > 0) {
    // Right pressed
    if (ud < 0)
      direction = Move.FORWARD_RIGHT; // Up & Right key pressed
    else if (ud > 0)
      direction = Move.BACK_RIGHT; // Back & Right key pressed
    else direction = Move.RIGHT; // Right key pressed
  } else if (ud < 0)
    direction = Move.FORWARD; // Up key pressed
  else if (ud > 0) direction = Move.BACK; // Down key pressed

  return direction;
}

function moveCamera(player: Player) {
  const { x: cpX, y: cpY, z: cpZ } = player.getCameraPos(); // 	Cameras position in space
  const { x: fvX, y: fvY, z: fvZ } = player.getCameraFrontVector(); //  Where the camera is looking at

  const clip = noClipData.get(player)!;

  // Increases the acceleration multiplier the longer the key is held
  if (clip.accelMul <= 1) clip.accelMul += ACCEL_RATE;

  // Determine the speed to move the camera based on the acceleration multiplier
  const speed = MOVE_SPEED * clip.accelMul;

  // Calculate the cameras next position based on their current position and the direction their camera is facing
  const { x, y, z } = getNextCameraPosition(
    clip.mode,
    [cpX, cpY, cpZ],
    [fvX, fvY, fvZ],
  );
  clip.flyObject?.move(x, y, z, speed);

  // Store the last time the camera was moved as now
  clip.lastMove = Date.now();

  noClipData.set(player, clip);
}

function getNextCameraPosition(
  move_mode: Move,
  cp: [number, number, number],
  fv: [number, number, number],
) {
  // Calculate the cameras next position based on their current position and the direction their camera is facing
  const offsetX = fv[0] * 6000.0;
  const offsetY = fv[1] * 6000.0;
  const offsetZ = fv[2] * 6000.0;
  let x = 0,
    y = 0,
    z = 0;
  switch (move_mode) {
    case Move.FORWARD:
      {
        x = cp[0] + offsetX;
        y = cp[1] + offsetY;
        z = cp[2] + offsetZ;
      }
      break;
    case Move.BACK:
      {
        x = cp[0] - offsetX;
        y = cp[1] - offsetY;
        z = cp[2] - offsetZ;
      }
      break;
    case Move.LEFT:
      {
        x = cp[0] - offsetY;
        y = cp[1] + offsetX;
        z = cp[2];
      }
      break;
    case Move.RIGHT:
      {
        x = cp[0] + offsetY;
        y = cp[1] - offsetX;
        z = cp[2];
      }
      break;
    case Move.BACK_LEFT:
      {
        x = cp[0] + (-offsetX - offsetY);
        y = cp[1] + (-offsetY + offsetX);
        z = cp[2] - offsetZ;
      }
      break;
    case Move.BACK_RIGHT:
      {
        x = cp[0] + (-offsetX + offsetY);
        y = cp[1] + (-offsetY - offsetX);
        z = cp[2] - offsetZ;
      }
      break;
    case Move.FORWARD_LEFT:
      {
        x = cp[0] + (offsetX - offsetY);
        y = cp[1] + (offsetY + offsetX);
        z = cp[2] + offsetZ;
      }
      break;
    case Move.FORWARD_RIGHT:
      {
        x = cp[0] + (offsetX + offsetY);
        y = cp[1] + (offsetY - offsetX);
        z = cp[2] + offsetZ;
      }
      break;
  }
  return { x, y, z };
}

function cancelFlyMode(player: Player, isConnected = true) {
  const clip = noClipData.get(player);
  if (clip && clip.cameraMode === CameraMode.FLY) {
    clip.flyObject!.destroy();

    if (isConnected) {
      clip.cameraMode = CameraMode.NONE;

      player.endObjectEditing();
      player.toggleSpectating(false);

      noClipData.set(player, clip);
    } else {
      noClipData.delete(player);
    }
  }
}

function flyMode(player: Player) {
  // Create an invisible object for the players camera to be attached to
  const { x, y, z } = player.getPos()!;

  const clip = noClipData.get(player)!;

  clip.flyObject = new DynamicObject({
    modelId: 19300,
    x,
    y,
    z,
    playerId: player.id,
    rx: 0,
    ry: 0,
    rz: 0,
  });

  clip.flyObject.create();

  // Place the player in spectating mode so objects will be streamed based on camera location
  player.toggleSpectating(true);
  // Attach the players camera to the created object

  clip.flyObject.attachCamera(player);
  clip.cameraMode = CameraMode.FLY;

  noClipData.set(player, clip);
}

export const FlyMode: IFilterScript = {
  name: "fly_mode",
  load() {
    const onDisconnect = PlayerEvent.onDisconnect(({ player, next }) => {
      cancelFlyMode(player, false);
      return next();
    });

    const flyCommand = PlayerEvent.onCommandText(
      "flymode",
      ({ player, next }) => {
        // Place the player in and out of edit mode
        const clip = noClipData.get(player);

        if (!clip) {
          resetPlayerClip(player);
          flyMode(player);
          return next();
        }
        if (clip.cameraMode === CameraMode.NONE) {
          flyMode(player);
        } else {
          cancelFlyMode(player);
        }
        return next();
      },
    );

    const onUpdate = PlayerEvent.onUpdate(({ player, next }) => {
      const clip = noClipData.get(player);
      if (!clip) return next();

      if (clip.cameraMode === CameraMode.FLY) {
        const { upDown: ud, leftRight: lr } = player.getKeys();

        if (clip.mode && Date.now() - clip.lastMove > 100) {
          // If the last move was > 100ms ago, process moving the object the players camera is attached to
          moveCamera(player);
        }

        // Is the players current key state different than their last keystate?
        if (clip.udOld !== ud || clip.lrOld !== lr) {
          if (
            (clip.udOld || clip.lrOld) &&
            ud === KeysEnum.NONE &&
            lr === KeysEnum.NONE
          ) {
            // All keys have been released, stop the object the camera is attached to and reset the acceleration multiplier
            clip.flyObject!.stop();
            clip.mode = 0;
            clip.accelMul = 0.0;
          } else {
            // Indicates a let key has been pressed

            // Get the direction the player wants to move as indicated by the keys
            clip.mode = getMoveDirectionFromKeys(ud, lr);

            // Process moving the object the players camera is attached to
            moveCamera(player);
          }
        }
        clip.udOld = ud;
        clip.lrOld = lr; // Store current keys pressed for comparison next update
        noClipData.set(player, clip);
        return false;
      }
      return next();
    });

    return [onDisconnect, flyCommand, onUpdate];
  },
  unload() {
    // If any players are still in edit mode, boot them out before the filterScript unloads
    Player.getInstances().forEach((p) => {
      if (
        !noClipData.has(p) ||
        noClipData.get(p)!.cameraMode === CameraMode.FLY
      )
        return;
      cancelFlyMode(p);
    });
    noClipData.clear();
  },
};
