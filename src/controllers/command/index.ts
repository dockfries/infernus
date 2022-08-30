import { ICmd } from "@/interfaces";
import { EventFunc, EventName } from "@/types";
import { BasePlayer } from "../player";

// This is an event bus for distributing instructions entered by the user.
// You can bind a single instruction as a string, or you can bind multiple alias instructions as an array string
export class CmdBus {
  private static eventList: Array<ICmd> = [];
  private constructor() {}

  static on(eventName: EventName, eventFunction: EventFunc) {
    const idx: number = CmdBus.findEventIdxByName(eventName);
    if (idx > -1)
      return console.log(
        "[CommandBus]: It is not supported to listen for the same event more than once"
      );
    CmdBus.eventList.push({ name: eventName, fn: eventFunction });
  }

  static off(eventName: EventName) {
    const idx: number = CmdBus.findEventIdxByName(eventName);
    if (idx === -1) return;
    CmdBus.eventList.splice(idx, 1);
  }

  static emit<T extends BasePlayer>(
    player: T,
    userEventName: EventName,
    userEventArgs: Array<string>
  ): boolean {
    const idx: number = CmdBus.findEventIdxByName(userEventName);
    if (idx > -1) {
      CmdBus.eventList[idx].fn.apply(player, userEventArgs);
      return true;
    }
    return false;
  }

  private static findEventIdxByName(eventName: EventName): number {
    return CmdBus.eventList.findIndex((v) => {
      const { name: registered } = v;
      if (registered instanceof Array) {
        if (eventName instanceof Array) {
          return registered.some((e) => eventName.includes(e));
        }
        return registered.includes(eventName);
      }
      if (typeof registered === "string" && eventName instanceof Array) {
        return eventName.includes(registered);
      }
      return registered === eventName;
    });
  }
}
