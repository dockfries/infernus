//
// This is an example of using cessil's LS mall replacement
// mesh, which contains enterable shop interiors which
// you can decorate yourself.
//
// It's recommended you use Jernej's map editor, found on the
// SA-MP forum, and import this script (Import .pwn) if you
// want to place new objects in the shops.
//
// SA-MP 0.3d and above
//

import type { IFilterScript } from "@infernus/core";
import { Player, PlayerEvent, DynamicObject } from "@infernus/core";
import {
  MALL_OBJECT_DRAW_DIST,
  createObjects,
  removeBuildings,
} from "./constants";

let createdObjects: DynamicObject[] = [];

function removeBuildingsForMall(player: Player) {
  removeBuildings.forEach((b) => {
    const [modelId, fX, fY, fZ, fRadius] = b;
    player.removeBuilding(modelId, fX, fY, fZ, fRadius);
  });
}

export const LsMall: IFilterScript = {
  name: "ls_mall",
  load() {
    Player.getInstances().forEach((p) => {
      removeBuildingsForMall(p);
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuildingsForMall(player);
      return next();
    });

    createdObjects = createObjects.map((o) => {
      const [modelId, x, y, z, rx, ry, rz, drawDistance] = o;
      const obj = new DynamicObject({
        modelId,
        x,
        y,
        z,
        rx,
        ry,
        rz,
        drawDistance: drawDistance || MALL_OBJECT_DRAW_DIST,
      });
      obj.create();
      return obj;
    });

    return [onConnect];
  },
  unload() {
    createdObjects.forEach((o) => {
      o.destroy();
    });
    createdObjects = [];
  },
};
