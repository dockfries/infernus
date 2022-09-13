import { CommonTextDraw } from "@/interfaces";
import { BasePlayerTextDraw } from "./basePlayerTextDraw";
import { BaseTextDraw } from "./baseTextDraw";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export abstract class BaseTextDrawEvent<
  T extends BaseTextDraw,
  PT extends BasePlayerTextDraw
> {
  public readonly textDraws = new Set<CommonTextDraw<T, PT>>();
  constructor() {
    textDrawBus.on(textDrawHooks.created, (textDraw: CommonTextDraw<T, PT>) => {
      this.textDraws.add(textDraw);
    });
    textDrawBus.on(
      textDrawHooks.destroyed,
      (textDraw: CommonTextDraw<T, PT>) => {
        this.textDraws.delete(textDraw);
      }
    );
  }
}
