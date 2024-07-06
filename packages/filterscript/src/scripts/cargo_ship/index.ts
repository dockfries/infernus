// Used for testing interpolated rotations with MoveObject
// Also used to test AttachObjectToObject
// A cargo ship goes around and visits some route points
//
// SA-MP 0.3d and above
//
// - Kye 2011

import type { IFilterScript } from "@infernus/core";
import { PlayerEvent, DynamicObject, DynamicObjectEvent } from "@infernus/core";
import {
  NUM_SHIP_ATTACHMENTS,
  NUM_SHIP_ROUTE_POINTS,
  SHIP_DRAW_DISTANCE,
  SHIP_HULL_ID,
  SHIP_MOVE_SPEED,
  gShipAttachmentModelIds,
  gShipAttachmentPos,
  gShipHullOrigin,
  gShipRoutePoints,
} from "./constants";
import { playSoundForPlayersInRange } from "filterscript/utils/gl_common";

let gShipCurrentPoint = 1; // current route point the ship is at. We start at route 1

// SA-MP objects
let gMainShipObject: DynamicObject | null = null;
let timer: NodeJS.Timeout | null = null;
const gShipsAttachments: Array<DynamicObject> = [];

function startMovingTimer() {
  if (!gMainShipObject) return;
  gMainShipObject.move(
    gShipRoutePoints[gShipCurrentPoint][0],
    gShipRoutePoints[gShipCurrentPoint][1],
    gShipRoutePoints[gShipCurrentPoint][2],
    SHIP_MOVE_SPEED / 2.0, // slower for the first route
    gShipRoutePoints[gShipCurrentPoint][3],
    gShipRoutePoints[gShipCurrentPoint][4],
    gShipRoutePoints[gShipCurrentPoint][5],
  );
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export const CargoShip: IFilterScript = {
  name: "cargo_ship",
  load() {
    const moved = DynamicObjectEvent.onMoved(({ object, next }) => {
      if (object !== gMainShipObject) return next();

      if (gShipCurrentPoint > 0 && !(gShipCurrentPoint % 5)) {
        // play some seagulls audio every 5 points
        playSoundForPlayersInRange(
          6200,
          200.0,
          gShipRoutePoints[gShipCurrentPoint][0],
          gShipRoutePoints[gShipCurrentPoint][1],
          gShipRoutePoints[gShipCurrentPoint][2],
        );
      }

      gShipCurrentPoint++;

      if (gShipCurrentPoint === NUM_SHIP_ROUTE_POINTS) {
        gShipCurrentPoint = 0;

        gMainShipObject.move(
          gShipRoutePoints[gShipCurrentPoint][0],
          gShipRoutePoints[gShipCurrentPoint][1],
          gShipRoutePoints[gShipCurrentPoint][2],
          SHIP_MOVE_SPEED / 2.0, // slower for the last route
          gShipRoutePoints[gShipCurrentPoint][3],
          gShipRoutePoints[gShipCurrentPoint][4],
          gShipRoutePoints[gShipCurrentPoint][5],
        );
        return 1;
      }

      if (gShipCurrentPoint === 1) {
        // Before heading to the first route we should wait a bit
        clearTimer();
        timer = setTimeout(startMovingTimer, 30 * 1000); // pause at route 0 for 30 seconds
        return 1;
      }

      // const tempDebug = `The ship is at route: ${gShipCurrentPoint}"`;
      // Player.sendClientMessageToAll(0xffffffff, tempDebug);

      gMainShipObject.move(
        gShipRoutePoints[gShipCurrentPoint][0],
        gShipRoutePoints[gShipCurrentPoint][1],
        gShipRoutePoints[gShipCurrentPoint][2],
        SHIP_MOVE_SPEED,
        gShipRoutePoints[gShipCurrentPoint][3],
        gShipRoutePoints[gShipCurrentPoint][4],
        gShipRoutePoints[gShipCurrentPoint][5],
      );

      return next();
    });

    gMainShipObject = new DynamicObject({
      modelId: SHIP_HULL_ID,
      x: gShipRoutePoints[0][0],
      y: gShipRoutePoints[0][1],
      z: gShipRoutePoints[0][2],
      rx: gShipRoutePoints[0][3],
      ry: gShipRoutePoints[0][4],
      rz: gShipRoutePoints[0][5],
      drawDistance: SHIP_DRAW_DISTANCE,
    });

    gMainShipObject.create();

    let x = 0;
    while (x !== NUM_SHIP_ATTACHMENTS) {
      const obj = new DynamicObject({
        modelId: gShipAttachmentModelIds[x],
        x: 0.0,
        y: 0.0,
        z: 0.0,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: SHIP_DRAW_DISTANCE,
      });

      obj.create();

      gShipsAttachments[x] = obj;

      obj.attachToObject(
        gMainShipObject,
        gShipAttachmentPos[x][0] - gShipHullOrigin[0],
        gShipAttachmentPos[x][1] - gShipHullOrigin[1],
        gShipAttachmentPos[x][2] - gShipHullOrigin[2],
        0.0,
        0.0,
        0.0,
      );
      x++;
    }

    clearTimer();
    timer = setTimeout(startMovingTimer, 30 * 1000); // pause at route 0 for 30 seconds

    const cmd1 = PlayerEvent.onCommandText("boardship", ({ player, next }) => {
      if (gShipCurrentPoint !== 1) {
        player.sendClientMessage(
          0xffff0000,
          "The ship can't be boarded right now",
        );
        return 1;
      }
      player.setPos(-1937.7816, 2017.7969, 16.664);
      return next();
    });

    const cmd2 = PlayerEvent.onCommandText("stopship", ({ next }) => {
      gMainShipObject && gMainShipObject.stop();
      return next();
    });

    return [moved, cmd1, cmd2];
  },
  unload() {
    clearTimer();
    gMainShipObject && gMainShipObject.destroy();
    gMainShipObject = null;
    let x = 0;
    while (x !== NUM_SHIP_ATTACHMENTS) {
      gShipsAttachments[x].destroy();
      x++;
    }
    gShipsAttachments.length = 0;
  },
};
