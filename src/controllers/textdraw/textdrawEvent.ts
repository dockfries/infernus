import { InvalidEnum } from "@/enums";
import { IBelongsToEvent, ICommonTextDrawKey } from "@/interfaces";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import {
  OnGameModeExit,
  OnPlayerClickPlayerTextDraw,
  OnPlayerClickTextDraw,
} from "@/wrapper/native/callbacks";
import type { BasePlayer } from "../player";
import type { BaseTextDraw } from "./baseTextDraw";

export abstract class BaseTextDrawEvent<
  P extends BasePlayer = any,
  T extends BaseTextDraw<P> = any
> implements IBelongsToEvent<T>
{
  public readonly textDraws = new Map<ICommonTextDrawKey, T>();
  private readonly destroyOnExit: boolean;
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    this.destroyOnExit = destroyOnExit;

    if (this.destroyOnExit) {
      OnGameModeExit(() => {
        this.textDraws.forEach((t) => t.destroy());
        this.textDraws.clear();
      });
    }

    OnPlayerClickTextDraw((playerid, clickedid): number => {
      const p = this.players.get(playerid);
      if (!p) return 0;
      const t = this.textDraws.get({ id: clickedid, global: true });
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerClick,
        "OnPlayerClickTextDraw"
      );
      return pFn(p, t || InvalidEnum.TEXT_DRAW);
    });
    OnPlayerClickPlayerTextDraw((playerid, clickedid): number => {
      const p = this.players.get(playerid);
      if (!p) return 0;
      const t = this.textDraws.get({ id: clickedid, global: false });
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerClick,
        "OnPlayerClickPlayerTextDraw"
      );
      return pFn(p, t || InvalidEnum.TEXT_DRAW);
    });
  }
  protected abstract onPlayerClick(
    player: P,
    textdraw: T | InvalidEnum.TEXT_DRAW
  ): TCommonCallback;

  public _onCreated(td: T, isGlobal: boolean) {
    this.textDraws.set({ id: td.id, global: isGlobal }, td);
  }

  public _onDestroyed(td: T, isGlobal: boolean) {
    this.textDraws.delete({ id: td.id, global: isGlobal });
  }
}
