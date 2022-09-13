import { BaseTextDraw } from "./baseTextDraw";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export abstract class BasePlayerTextDraw extends BaseTextDraw {
  public override create() {
    textDrawBus.emit(textDrawHooks.created, {
      key: {
        id: 1,
        global: false,
      },
      value: this,
    });
  }
  public override destroy() {
    textDrawBus.emit(textDrawHooks.destroyed, {
      id: this.id,
      global: false,
    });
  }
}
