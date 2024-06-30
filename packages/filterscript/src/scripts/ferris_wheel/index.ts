//
// Used for testing interpolated rotations with MoveObject
// Also used to test AttachObjectToObject
// The other ferris wheel (that actually spins!)
// Located on the opposite peer at LS
//
// SA-MP 0.3d and above
//
// - Kye 2011
//

import type { IFilterScript } from "@infernus/core";
import { DynamicObject, DynamicObjectEvent } from "@infernus/core";
import {
  FERRIS_BASE_ID,
  FERRIS_CAGE_ID,
  FERRIS_DRAW_DISTANCE,
  FERRIS_WHEEL_ID,
  FERRIS_WHEEL_SPEED,
  FERRIS_WHEEL_Z_ANGLE,
  NUM_FERRIS_CAGES,
  gFerrisCageOffsets,
  gFerrisOrigin,
} from "./constants";

// SA-MP objects
let gFerrisWheel: DynamicObject | null = null;
let gFerrisBase: DynamicObject | null = null;
let gFerrisCages: DynamicObject[] = [];
let timer: NodeJS.Timeout | null = null;

//-------------------------------------------------

let gCurrentTargetYAngle = 0.0; // Angle of the Y axis of the wheel to rotate to.
let gWheelTransAlternate = 0; // Since MoveObject requires some translation target to intepolate
// rotation, the world pos target is alternated by a small amount.

function updateWheelTarget() {
  gCurrentTargetYAngle += 36.0; // There are 10 carts, so 360 / 10
  if (gCurrentTargetYAngle >= 360.0) {
    gCurrentTargetYAngle = 0.0;
  }
  if (gWheelTransAlternate) gWheelTransAlternate = 0;
  else gWheelTransAlternate = 1;
}

function rotateWheel() {
  updateWheelTarget();
  let fModifyWheelZPos = 0.0;
  if (gWheelTransAlternate) fModifyWheelZPos = 0.05;
  gFerrisWheel!.move(
    gFerrisOrigin[0],
    gFerrisOrigin[1],
    gFerrisOrigin[2] + fModifyWheelZPos,
    FERRIS_WHEEL_SPEED,
    0.0,
    gCurrentTargetYAngle,
    FERRIS_WHEEL_Z_ANGLE,
  );
  timer = null;
}

export const FerrisWheel: IFilterScript = {
  name: "ferris_wheel",
  offs: [],
  load() {
    const moved = DynamicObjectEvent.onMoved(({ object, next }) => {
      if (object === gFerrisWheel) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(rotateWheel, 3 * 1000);
      }
      return next();
    });

    gFerrisWheel = new DynamicObject({
      modelId: FERRIS_WHEEL_ID,
      x: gFerrisOrigin[0],
      y: gFerrisOrigin[1],
      z: gFerrisOrigin[2],
      rx: 0.0,
      ry: 0.0,
      rz: FERRIS_WHEEL_Z_ANGLE,
      drawDistance: FERRIS_DRAW_DISTANCE,
    });

    gFerrisWheel.create();

    gFerrisBase = new DynamicObject({
      modelId: FERRIS_BASE_ID,
      x: gFerrisOrigin[0],
      y: gFerrisOrigin[1],
      z: gFerrisOrigin[2],
      rx: 0.0,
      ry: 0.0,
      rz: FERRIS_WHEEL_Z_ANGLE,
      drawDistance: FERRIS_DRAW_DISTANCE,
    });

    gFerrisBase.create();

    let x = 0;
    while (x != NUM_FERRIS_CAGES) {
      gFerrisCages[x] = new DynamicObject({
        modelId: FERRIS_CAGE_ID,
        x: gFerrisOrigin[0],
        y: gFerrisOrigin[1],
        z: gFerrisOrigin[2],
        rx: 0.0,
        ry: 0.0,
        rz: FERRIS_WHEEL_Z_ANGLE,
        drawDistance: FERRIS_DRAW_DISTANCE,
      });

      gFerrisCages[x].create();

      gFerrisCages[x].attachToObject(
        gFerrisWheel,
        gFerrisCageOffsets[x][0],
        gFerrisCageOffsets[x][1],
        gFerrisCageOffsets[x][2],
        0.0,
        0.0,
        FERRIS_WHEEL_Z_ANGLE,
        false,
      );

      x++;
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(rotateWheel, 3 * 1000);

    this.offs.push(moved);
  },
  unload() {
    this.offs.forEach((off) => off());
    this.offs = [];

    let x = 0;

    gFerrisWheel?.destroy();
    gFerrisWheel = null;

    gFerrisBase?.destroy();
    gFerrisBase = null;

    x = 0;
    while (x !== NUM_FERRIS_CAGES) {
      gFerrisCages[x].destroy();
      x++;
    }
    gFerrisCages = [];
  },
};
