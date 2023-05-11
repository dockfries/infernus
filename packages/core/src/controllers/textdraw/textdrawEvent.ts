import { InvalidEnum } from "@/enums";
import type { ICommonTextDrawKey } from "@/interfaces";
import type { TCommonCallback } from "@/types";
import { defineAsyncCallback } from "@/utils/helperUtils";
import {
  OnGameModeExit,
  OnPlayerClickPlayerTextDraw,
  OnPlayerClickTextDraw,
} from "@/wrapper/native/callbacks";
import type { Player } from "../player";
import type { TextDraw } from "./baseTextDraw";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export class TextDrawEvent<P extends Player, T extends TextDraw<P>> {
  readonly textDraws = new Map<ICommonTextDrawKey, T>();
  private readonly players;
  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    textDrawBus.on(
      textDrawHooks.created,
      (res: { key: ICommonTextDrawKey; value: T }) => {
        this.textDraws.set(res.key, res.value);
      }
    );
    textDrawBus.on(textDrawHooks.destroyed, (res: ICommonTextDrawKey) => {
      if (this.textDraws.has(res)) this.textDraws.delete(res);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.textDraws.forEach((t) => t.destroy());
        this.textDraws.clear();
      });
    }
    OnPlayerClickTextDraw((playerid, clickedid): number => {
      const p = this.players.get(playerid);
      if (!p) return 0;
      const t = this.textDraws.get({ id: clickedid, global: true });
      const pFn = defineAsyncCallback(this, "onPlayerClick");
      return pFn(p, t || InvalidEnum.TEXT_DRAW);
    });
    OnPlayerClickPlayerTextDraw((playerid, clickedid): number => {
      const p = this.players.get(playerid);
      if (!p) return 0;
      const t = this.textDraws.get({ id: clickedid, global: false });
      const pFn = defineAsyncCallback(this, "onPlayerClick");
      return pFn(p, t || InvalidEnum.TEXT_DRAW);
    });
  }
  onPlayerClick?(
    player: P,
    textdraw: T | InvalidEnum.TEXT_DRAW
  ): TCommonCallback;
}
