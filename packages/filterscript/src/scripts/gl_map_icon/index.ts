//-------------------------------------------------
//
// These are the default map icons from San Andreas
// Cluckin Bell, Ammu, Burgershot etc
//
// Kye 2010
//
//-------------------------------------------------

import { DynamicMapIcon, MapIconStyles } from "@infernus/core";
import type { IFilterScript } from "@infernus/core";
import { mapIcons } from "./constants";

let instances: DynamicMapIcon[] | null = null;

export const GlMapIcon: IFilterScript = {
  name: "gl_map_icon",
  offs: [],
  load() {
    instances = mapIcons.map((icon) => {
      const [x, y, z, type] = icon;
      const instance = new DynamicMapIcon({
        x,
        y,
        z,
        type,
        color: 0,
        style: MapIconStyles.LOCAL,
        playerId: -1, // for all players
      });
      instance.create();
      return instance;
    });
  },
  unload() {
    instances!.forEach((instance) => {
      instance.destroy();
    });
    instances = null;
  },
};
