import { InvalidEnum } from "@/enums";
import { ICommonTextDrawKey } from "@/interfaces";
import {
  OnPlayerClickPlayerTextDraw,
  OnPlayerClickTextDraw,
} from "@/wrapper/callbacks";
import { BasePlayer } from "../player";
import { BaseTextDraw } from "./baseTextDraw";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export abstract class BaseTextDrawEvent<
  P extends BasePlayer,
  T extends BaseTextDraw<P>
> {
  public readonly textDraws = new Map<ICommonTextDrawKey, T>();
  private readonly players;
  constructor(playersMap: Map<number, P>) {
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
    OnPlayerClickTextDraw((playerid, clickedid): number => {
      const p = this.players.get(playerid);
      if (!p) return 0;
      const t = this.textDraws.get({ id: clickedid, global: true });
      return this.onPlayerClick(p, t || InvalidEnum.TEXT_DRAW);
    });
    OnPlayerClickPlayerTextDraw((playerid, clickedid): number => {
      const p = this.players.get(playerid);
      if (!p) return 0;
      const t = this.textDraws.get({ id: clickedid, global: false });
      return this.onPlayerClick(p, t || InvalidEnum.TEXT_DRAW);
    });
  }
  protected abstract onPlayerClick(
    player: P,
    textdraw: T | InvalidEnum.TEXT_DRAW
  ): number;
}
