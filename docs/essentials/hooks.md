# Hooks

With `defineHooks` you can define some `hooks`, which ensures that subsequent calls to that function will pass through your defined function.

**The scope is limited to your `ts` code and does not take effect in other plugins or native `pawn`.**

## Basic Example

```ts
import { defineHooks, Player } from "@infernus/core";

// Destructure to get all original methods and the method to set hooks.
export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
// This demonstrates hooking the Player class. Most entity classes can be passed in, such as Vehicle, TextDraw...

// The first parameter is the name of the hookable method, which will have TS type hints.
// The return value is the second parameter you passed in.
export const my_setPlayerArmour = setPlayerHook(
  "setArmour",
  function (armour: number) {
    // Here, `this` refers to the current player
    const flag = true; // Assume true for this example
    if (flag) {
      console.log("my hook");
      // Call the original setArmour method, but we intentionally subtract 1 and return the original call result
      return orig_playerMethods.setArmour.call(this, armour - 1);
      // Never directly use this.setArmour(armour), as it will cause an infinite loop
      // Inside the hook function body, you can only call all original functions via orig_playerMethods.
    } else {
      return false;
    }
  },
);

/*
setPlayerHook(
  "setArmour",
  function (armour: number) {
    // You can only hook a method once within the same defineHooks group
    // Never hook the same method again.
    // If you need to hook multiple times, use the defineHooks function multiple times and split files or define different variable names.
  },
);
*/
```

## Injectable

> Some entity classes provide static methods prefixed with `__inject` for injection.

Due to the special nature of some encapsulated entity classes, you cannot directly use `defineHooks`.

For example, `AddStaticVehicle(ex), CreateVehicle, DestroyVehicle` on the `Vehicle` class.

These native functions are triggered when `create` or `destroy` is called internally in `Vehicle`.

```ts
import { Vehicle, type LimitsEnum } from "@infernus/core";

export const orig_CreateVehicle = Vehicle.__inject_CreateVehicle;

export function my_CreateVehicle(
  ...args: Parameters<typeof orig_CreateVehicle>
) {
  const id = orig_CreateVehicle(...args);

  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    console.log(`hook: vehicle ${id} created`);
  }

  return id;
}

Vehicle.__inject_CreateVehicle = my_CreateVehicle;
```
