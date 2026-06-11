# Hooks

`defineHooks` allows you to intercept all subsequent calls to a given function with your own implementation.

**The scope is limited to your TypeScript code — it does not affect other plugins or native Pawn.**

## Basic Example

```ts
import { defineHooks, Player } from "@infernus/core";

// Destructure to get all original methods and the setHook function.
export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
// This example hooks the Player class. Most entity classes (Vehicle, TextDraw, etc.) work similarly.

// The first parameter is the method name to hook, with full TS type hints.
// The return value is your hook function (the second parameter).
export const my_setPlayerArmour = setPlayerHook("setArmour", function (armour: number) {
  // Inside the hook, `this` refers to the current player instance.
  const flag = true; // assume true for this example
  if (flag) {
    console.log("my hook");
    // Call the original setArmour — we subtract 1 and return the original result.
    return orig_playerMethods.setArmour.call(this, armour - 1);
    // Never call this.setArmour(armour) directly — this will cause an infinite loop.
    // Inside the hook body, always use orig_playerMethods for all original calls.
  } else {
    return false;
  }
});

/*
setPlayerHook(
  "setArmour",
  function (armour: number) {
    // You can only hook a method once within the same defineHooks group.
    // If you need to hook a method multiple times, call defineHooks separately
    // in different files or with different variable names.
  },
);
*/
```

## Injectable

> Some entity classes provide a static `__inject__` method for injection.

Due to the special nature of some encapsulated entity classes, you cannot use `defineHooks` directly.

For example, `Vehicle` has `AddStaticVehicle(ex)`, `CreateVehicle`, and `DestroyVehicle`.

These native functions are triggered internally when `Vehicle` creates or destroys an instance.

```ts
import { Vehicle, type LimitsEnum } from "@infernus/core";

export const orig_CreateVehicle = Vehicle.__inject__.create;

export function my_CreateVehicle(...args: Parameters<typeof orig_CreateVehicle>) {
  const id = orig_CreateVehicle(...args);

  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    console.log(`hook: vehicle ${id} created`);
  }

  return id;
}

Vehicle.__inject__.create = my_CreateVehicle;
```
