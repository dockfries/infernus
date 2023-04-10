import { TEventFunc, TEventName } from "@/types";
import { PlayerEvent } from "../player";

// This is an event bus for distributing instructions entered by the user.
// You can bind a single instruction as a string, or you can bind multiple alias instructions as an array string

type trigger = PlayerEvent<any>;
type callFn<P = any> = TEventFunc<P>;

export class CmdBus {
  readonly eventMap: Map<string, Map<trigger, callFn[]>> = new Map();

  on = (trigger: trigger, name: TEventName, fn: callFn | callFn[]) => {
    if (!(name instanceof Array)) name = [name];
    name.forEach((e) => {
      const events = this.eventMap.get(e);
      // No events registered
      if (!events) {
        this.eventMap.set(
          e,
          // init the trigger and fns
          new Map().set(trigger, fn instanceof Array ? fn : [fn])
        );
      } else {
        // Has event registration, but does not know if it already contains the same trigger (playerEvent instance)
        const registeredFns = events.get(trigger);
        // If registered, add fn to what you already have
        if (registeredFns) {
          (fn instanceof Array ? fn : [fn]).forEach((f) =>
            registeredFns.push(f)
          );
        } else {
          // this trigger not registered，init the trigger and fns
          events.set(trigger, fn instanceof Array ? fn : [fn]);
        }
      }
    });
    return () => this.off(trigger, name, fn);
  };

  off = (trigger: trigger, name: TEventName, fn: callFn | callFn[]) => {
    if (!(name instanceof Array)) name = [name];
    name.forEach((e) => {
      const events = this.eventMap.get(e);
      if (!events) return;
      const registeredFns = events.get(trigger);
      if (!registeredFns) return;
      if (!(fn instanceof Array)) fn = [fn];
      for (let i = 0; i < registeredFns.length; i++) {
        const f = registeredFns[i];
        if (!fn.includes(f)) continue;
        registeredFns.splice(i, 1);
        i--;
      }
    });
  };
}
