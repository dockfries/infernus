//
// Used for testing interpolated rotations with MoveObject
// Also used to test AttachObjectToObject
// A pirate ship goes around and visits some route points
//
// SA-MP 0.3d and above
//
// - Kye 2011
//

import { DynamicObject, Player } from "@infernus/core";
import { DynamicObjectEvent } from "@infernus/core";
import {
  NUM_SHIP_ROUTE_POINTS,
  SHIP_DRAW_DISTANCE,
  SHIP_LINES_ATTACH,
  SHIP_MOVE_SPEED,
  SHIP_OBJECT_ID,
  SHIP_RAILS_ATTACH,
  SHIP_SKULL_ATTACH,
  gShipRoutePoints,
} from "./constants";
import { playSoundForPlayersInRange } from "filterscript/utils/gl_common";
import type { IPirateShipFS } from "./interfaces";

let gShipCurrentPoint = 1; // current route point the ship is at

// SA-MP objects
let gMainShipObject: DynamicObject | null = null;
let gShipSkullAttachment: DynamicObject[] = [];
let gShipRailsAttachment: DynamicObject | null = null;
let gShipLinesAttachment: DynamicObject | null = null;

let timer: NodeJS.Timeout | null = null;

function startMovingTimer() {
  gMainShipObject!.move(
    gShipRoutePoints[gShipCurrentPoint][0],
    gShipRoutePoints[gShipCurrentPoint][1],
    gShipRoutePoints[gShipCurrentPoint][2],
    SHIP_MOVE_SPEED / 4.0, // bit slower for the first point
    gShipRoutePoints[gShipCurrentPoint][3],
    gShipRoutePoints[gShipCurrentPoint][4],
    gShipRoutePoints[gShipCurrentPoint][5],
  );
}

// todo debug?: boolean
export const PirateShip: IPirateShipFS = {
  name: "pirate_ship",
  load(options) {
    const onMoved = DynamicObjectEvent.onMoved(({ object, next }) => {
      if (object !== gMainShipObject) return next();

      if (gShipCurrentPoint > 0 && !(gShipCurrentPoint % 3)) {
        // play some seagulls audio every 3 points
        playSoundForPlayersInRange(
          6200,
          100.0,
          gShipRoutePoints[gShipCurrentPoint][0],
          gShipRoutePoints[gShipCurrentPoint][1],
          gShipRoutePoints[gShipCurrentPoint][2],
        );
      }

      gShipCurrentPoint++;

      if (gShipCurrentPoint === NUM_SHIP_ROUTE_POINTS) {
        gShipCurrentPoint = 0;

        gMainShipObject!.move(
          gShipRoutePoints[gShipCurrentPoint][0],
          gShipRoutePoints[gShipCurrentPoint][1],
          gShipRoutePoints[gShipCurrentPoint][2],
          SHIP_MOVE_SPEED / 4.0, // slower for the last route
          gShipRoutePoints[gShipCurrentPoint][3],
          gShipRoutePoints[gShipCurrentPoint][4],
          gShipRoutePoints[gShipCurrentPoint][5],
        );
        return next();
      }

      if (gShipCurrentPoint === 1) {
        // Before heading to the first route we should wait a bit
        timer && clearTimeout(timer);
        timer = setTimeout(startMovingTimer, 30 * 1000); // pause at route 0 for 30 seconds
        return next();
      }

      if (options && options.debug) {
        const tempDebug = `The ship is at route: ${gShipCurrentPoint}`;
        Player.sendClientMessageToAll(0xffffffff, tempDebug);
      }

      gMainShipObject!.move(
        gShipRoutePoints[gShipCurrentPoint][0],
        gShipRoutePoints[gShipCurrentPoint][1],
        gShipRoutePoints[gShipCurrentPoint][2],
        SHIP_MOVE_SPEED,
        gShipRoutePoints[gShipCurrentPoint][3],
        gShipRoutePoints[gShipCurrentPoint][4],
        gShipRoutePoints[gShipCurrentPoint][5],
      );
    });

    gMainShipObject = new DynamicObject({
      modelId: SHIP_OBJECT_ID,
      x: gShipRoutePoints[0][0],
      y: gShipRoutePoints[0][1],
      z: gShipRoutePoints[0][2],
      rx: gShipRoutePoints[0][3],
      ry: gShipRoutePoints[0][4],
      rz: gShipRoutePoints[0][5],
      drawDistance: SHIP_DRAW_DISTANCE,
    });

    gMainShipObject.create();

    const gShipSkullAttachmentParams = {
      modelId: SHIP_SKULL_ATTACH,
      x: 0.0,
      y: 0.0,
      z: 0.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: SHIP_DRAW_DISTANCE,
    };

    gShipSkullAttachment[0] = new DynamicObject(gShipSkullAttachmentParams);

    gShipSkullAttachment[0].create();

    gShipSkullAttachment[0].attachToObject(
      gMainShipObject,
      4.11,
      -5.53,
      -9.78,
      0.0,
      0.0,
      90.0,
    );

    gShipSkullAttachment[1] = new DynamicObject(gShipSkullAttachmentParams);

    gShipSkullAttachment[1].create();

    gShipSkullAttachment[1].attachToObject(
      gMainShipObject,
      -4.11,
      -5.53,
      -9.78,
      0.0,
      0.0,
      -90.0,
    );

    gShipSkullAttachment[2] = new DynamicObject(gShipSkullAttachmentParams);

    gShipSkullAttachment[2].create();

    gShipSkullAttachment[2].attachToObject(
      gMainShipObject,
      -4.3378,
      -15.2887,
      -9.7863,
      0.0,
      0.0,
      -90.0,
    );

    gShipSkullAttachment[3] = new DynamicObject(gShipSkullAttachmentParams);

    gShipSkullAttachment[3].create();

    gShipSkullAttachment[3].attachToObject(
      gMainShipObject,
      4.3378,
      -15.2887,
      -9.7863,
      0.0,
      0.0,
      90.0,
    );

    gShipRailsAttachment = new DynamicObject({
      modelId: SHIP_RAILS_ATTACH,
      x: 0.0,
      y: 0.0,
      z: 0.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: SHIP_DRAW_DISTANCE,
    });

    gShipRailsAttachment.create();

    gShipRailsAttachment.attachToObject(
      gMainShipObject,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
    );

    gShipLinesAttachment = new DynamicObject({
      modelId: SHIP_LINES_ATTACH,
      x: 0.0,
      y: 0.0,
      z: 0.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: SHIP_DRAW_DISTANCE,
    });

    gShipLinesAttachment.create();

    gShipLinesAttachment.attachToObject(
      gMainShipObject,
      -0.5468,
      -6.1875,
      -0.4375,
      0.0,
      0.0,
      0.0,
    );

    timer && clearTimeout(timer);
    timer = setTimeout(startMovingTimer, 30 * 1000); // pause at route 0 for 30 seconds
    return [onMoved];
  },
  unload() {
    timer && clearTimeout(timer);

    let x = 0;

    gMainShipObject!.destroy();
    gMainShipObject = null;

    x = 0;
    while (x !== 4) {
      gShipSkullAttachment![x].destroy();
      x++;
    }

    gShipSkullAttachment = [];

    gShipRailsAttachment!.destroy();
    gShipRailsAttachment = null;

    gShipLinesAttachment!.destroy();
    gShipLinesAttachment = null;
  },
};
