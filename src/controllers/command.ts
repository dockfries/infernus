import { OnPlayerCommandText } from "@/utils/helper";
import { BasePlayer } from "./player";

type EventName = string | string[];
type EventFunc = (this: BasePlayer, ...args: string[]) => any;

interface ICmd {
  name: EventName;
  fn: EventFunc;
}

interface ICmdErr {
  code: number;
  msg: string;
}

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "Please enter the correct command" },
  notExist: { code: 1, msg: "The command %s you entered does not exist" },
};

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

  static emit(
    player: BasePlayer,
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

  public static OnCommandError(
    fn: (p: BasePlayer, err: ICmdErr) => void
  ): void {
    OnPlayerCommandText((p: BasePlayer, cmdtext: string): void => {
      const regCmdtext = cmdtext.match(/[^/\s]+/gi);
      if (regCmdtext === null || regCmdtext.length === 0) {
        return fn(p, ICmdErrInfo.format);
      }
      /* 
        Use eventBus to observe and subscribe to level 1 instructions, 
        support string and array pass, array used for alias.
      */
      const exist: boolean = CmdBus.emit(
        p,
        regCmdtext[0],
        regCmdtext.splice(1)
      );
      if (exist) return;
      // The command %s you entered does not exist
      fn(p, ICmdErrInfo.notExist);
    });
  }
}
