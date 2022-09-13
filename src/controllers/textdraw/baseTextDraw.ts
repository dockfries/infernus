import { textDrawBus, textDrawHooks } from "./textdrawBus";

export abstract class BaseTextDraw {
  private _id = -1;
  public get id() {
    return this._id;
  }
  public create() {
    textDrawBus.emit(textDrawHooks.created, {
      key: {
        id: 1,
        global: true,
      },
      value: this,
    });
  }
  public destroy() {
    textDrawBus.emit(textDrawHooks.destroyed, {
      id: this.id,
      global: true,
    });
  }
}
