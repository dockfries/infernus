import type { BasePlayer } from "@/controllers/player";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import { StreamerItemTypes } from "omp-wrapper-streamer";
import { Streamer } from "../common";
import { DynamicMapIcon } from "./baseMapIcon";

import { mapIconBus, mapIconHooks } from "./mapIconBus";

export abstract class DynamicMapIconEvent<
  P extends BasePlayer,
  M extends DynamicMapIcon
> {
  private readonly mapIcons = new Map<number, M>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    mapIconBus.on(mapIconHooks.created, (mapIcon: M) => {
      this.mapIcons.set(mapIcon.id, mapIcon);
    });
    mapIconBus.on(mapIconHooks.destroyed, (mapIcon: M) => {
      this.mapIcons.delete(mapIcon.id);
    });
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.MAP_ICON) {
        const mi = this.mapIcons.get(item);
        const p = this.players.get(player);
        if (mi && p)
          return promisifyCallback.call(
            this,
            this.onStreamIn,
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
          return promisifyCallback.call(
            this,
            this.onStreamOut,
            "Streamer_OnItemStreamOut"
          )(mi, p);
      }
      return 1;
    });
    OnGameModeExit(() => {
      setTimeout(() => {
        this.getMapIconsArr().forEach((i) => {
          i.isValid() && i.destroy();
        });
      });
    });
  }

  protected abstract onStreamIn(mapIcon: M, player: P): TCommonCallback;
  protected abstract onStreamOut(mapIcon: M, player: P): TCommonCallback;

  public getMapIconsArr(): Array<M> {
    return [...this.mapIcons.values()];
  }

  public getMapIconsMap(): Map<number, M> {
    return this.mapIcons;
  }
}
