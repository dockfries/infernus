import { ICommonTextDrawKey } from "@/interfaces";
import { BasePlayer } from "../player";
import { BaseTextDraw } from "./baseTextDraw";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export abstract class BaseTextDrawEvent<
  P extends BasePlayer,
  T extends BaseTextDraw
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
      this.textDraws.delete(res);
    });
  }
}
