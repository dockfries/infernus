import type { BasePlayer } from "@/controllers/player";
import { TCommonCallback } from "@/types";
import { StreamerItemTypes } from "omp-wrapper-streamer";
import { Streamer } from "../common";
import { Dynamic3DTextLabel } from "./base3DText";

import { _3dTextBus, _3dTextHooks } from "./3dTextBus";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import { promisifyCallback } from "@/utils/helperUtils";

export abstract class Dynamic3dTextLabelEvent<
  P extends BasePlayer,
  D extends Dynamic3DTextLabel
> {
  private readonly _3dTexts = new Map<number, D>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    _3dTextBus.on(_3dTextHooks.created, (_3dText: D) => {
      this._3dTexts.set(_3dText.id, _3dText);
    });
    _3dTextBus.on(_3dTextHooks.destroyed, (_3dText: D) => {
      this._3dTexts.delete(_3dText.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this._3dTexts.forEach((t) => t.destroy());
        this._3dTexts.clear();
      });
    }
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.TEXT_3D_LABEL) {
        const tl = this._3dTexts.get(item);
        const p = this.players.get(player);
        if (tl && p)
          return promisifyCallback.call(
            this,
            this.onStreamIn,
            "Streamer_OnItemStreamIn"
          )(tl, p);
      }
      return 1;
    });
    Streamer.onItemStreamOut((type, item, player) => {
      if (type === StreamerItemTypes.TEXT_3D_LABEL) {
        const tl = this._3dTexts.get(item);
        const p = this.players.get(player);
        if (tl && p)
          return promisifyCallback.call(
            this,
            this.onStreamOut,
            "Streamer_OnItemStreamOut"
          )(tl, p);
      }
      return 1;
    });
  }

  protected abstract onStreamIn(label: D, player: P): TCommonCallback;
  protected abstract onStreamOut(label: D, player: P): TCommonCallback;

  public get3dTextLabelsArr(): Array<D> {
    return [...this._3dTexts.values()];
  }

  public get3dTextLabelsMap(): Map<number, D> {
    return this._3dTexts;
  }
}
