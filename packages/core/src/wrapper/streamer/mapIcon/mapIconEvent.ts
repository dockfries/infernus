import type { Player } from "@/controllers/player";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import { StreamerItemTypes } from "@infernus/streamer";
import { Streamer } from "../common";
import { DynamicMapIcon } from "./baseMapIcon";

import { mapIconBus, mapIconHooks } from "./mapIconBus";

export class DynamicMapIconEvent<P extends Player, M extends DynamicMapIcon> {
  private readonly mapIcons = new Map<number, M>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    mapIconBus.on(mapIconHooks.created, (mapIcon: M) => {
      this.mapIcons.set(mapIcon.id, mapIcon);
    });
    mapIconBus.on(mapIconHooks.destroyed, (mapIcon: M) => {
      this.mapIcons.delete(mapIcon.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.mapIcons.forEach((c) => c.destroy());
        this.mapIcons.clear();
      });
    }
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.MAP_ICON) {
        const mi = this.mapIcons.get(item);
        const p = this.players.get(player);
        if (mi && p)
          return promisifyCallback(
            this,
            "onStreamIn",
            "Streamer_OnItemStreamIn"
          )(mi, p);
      }
      return 1;
    });
    Streamer.onItemStreamOut((type, item, player) => {
      if (type === StreamerItemTypes.MAP_ICON) {
        const mi = this.mapIcons.get(item);
        const p = this.players.get(player);
        if (mi && p)
          return promisifyCallback(
            this,
            "onStreamOut",
            "Streamer_OnItemStreamOut"
          )(mi, p);
      }
      return 1;
    });
  }

  onStreamIn?(mapIcon: M, player: P): TCommonCallback;
  onStreamOut?(mapIcon: M, player: P): TCommonCallback;

  getMapIconsArr(): Array<M> {
    return [...this.mapIcons.values()];
  }

  getMapIconsMap(): Map<number, M> {
    return this.mapIcons;
  }
}
