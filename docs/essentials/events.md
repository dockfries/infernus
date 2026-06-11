# Events

`Infernus` events closely mirror their native counterparts. You should refer to the [Open Multiplayer](https://open.mp) documentation for native event details.

## Example

Take `OnGameModeInit` — in `Infernus`, it's `GameMode.onInit(callback)`.

Most other event classes end with `Event`, such as `PlayerEvent`.

With TypeScript type hints, you'll get the hang of it quickly.

```ts
import { GameMode } from "@infernus/core";

GameMode.onInit(({ next }) => {
  console.log("GameMode is initialized.");
  return next();
});

GameMode.onExit(({ next }) => {
  console.log("GameMode is exited.");
  return next();
});

GameMode.onIncomingConnection(({ next, playerId, ipAddress, port }) => {
  console.log(`player id: ${playerId}, ip: ${ipAddress}, port: ${port} trying to connect`);
  return next();
});
```

## Default Behavior

::: tip
**Default behavior refers to the underlying game server behavior that is triggered when we do not return a value, or return a specific value.**

Not all default behaviors return `true` — some may return `false`, depending on how the underlying functions are defined.
:::

Take the player text input event: returning `true` or `1` means the underlying text input event continues to execute. **You will see a default message format output in the chat box.**

```ts
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return true;
});
```

## Middleware

You may have noticed the `next` parameter in almost all event callbacks. Similar to frameworks like `Express`, it executes the next function in the middleware chain.

**With the middleware pattern, you can split your events into separate functions instead of lumping everything into one.**

:::warning
Don't forget to call `next()` unless you are certain the next function should not execute.
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  console.log("player connected 1");
  // return next(); // Suppose you forget to call it
});

PlayerEvent.onConnect(({ player, next }) => {
  console.log("player connected 2");
  // This middleware won't be executed
  return next();
});
```

### Async Support

Taking player events as an example — the player event class is `PlayerEvent`.

You can use `async`/`await` or return a `Promise` in the callback.

```ts
import { Player, PlayerEvent } from "@infernus/core";

// A fake async function for demonstration
const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// Using async/await is the recommended approach
PlayerEvent.onCommandText("async", async ({ player, next }) => {
  await fakePromise();
  player.sendClientMessage("#fff", "Message sent after a 1-second delay.");
  return next();
});

// Promise also works, but is not recommended
PlayerEvent.onCommandText("promise", ({ player, next }) => {
  return new Promise((resolve) => {
    fakePromise().then(() => {
      player.sendClientMessage("#fff", "Message sent after a 1-second delay.");
      resolve();
      return next();
    });
  });
});
```

### Async Return Value

:::warning
Due to underlying implementation details, **the return value of async functions is meaningless!**

Although TypeScript types require you to return a value, it is not actually used.

**If you always pass through the return value of `next()`, the default underlying value will be returned whenever an async function is encountered.**
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return next(); // 1
});

PlayerEvent.onText(({ player, next }) => {
  return next(); // 1
});

PlayerEvent.onText(async ({ player, next }) => {
  // Because it's async, the return value depends on the default value
  // defined by defineEvent, not on what the async function returns.
  // onText defaults to true, which converts to int 1.
  const ret = next(); // execute the next function
  return ret; // false converts to int 0
});

// Synchronous return values after an async function are also ignored;
// the default value has already been returned when the async function was encountered.
PlayerEvent.onText(({ player, next }) => {
  return false;
});
```

### Cancellation

::: tip
All middleware functions for events defined by [defineEvent](#custom-event) can be cancelled. Most existing callbacks are defined through it.
:::

This is useful when you want to execute a handler only once, or cancel it at a specific point.

```ts
// Define a one-time command
const off = PlayerEvent.onCommandText("once", ({ player, next }) => {
  console.log("This command only runs once; subsequent invocations won't trigger it.");
  const ret = next();
  off(); // call off() after next()
  return ret;
});
```

## Getting Instances

You'll often need to retrieve object-oriented instances encapsulated by `Infernus` (e.g., player instances) by their `id`.

Here's how to get instances — vehicles and other entities work similarly.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  const players = Player.getInstances(); // array of all player instances
  players.forEach((p) => {
    p.sendClientMessage("#fff", `player ${player.getName().name} connected`);
  });

  const player = Player.getInstance(0); // player with id 0
  console.log(player);

  return next();
});
```

## Player Commands

The player command event has been used in examples above. It offers a significant syntax improvement over native Pawn — it eliminates cumbersome `strcmp` chains and lets you extract command logic using the middleware pattern. If you've done native development, you'll know what I mean.

**Player command events support defining multiple command strings at once, and make subcommands easy.**

Player commands also support cancellation — the return value of `onCommandText` is the cancel function.

Additionally, player commands provide before-guard, after-guard, and error-guard, inspired by the `zcmd` library in Pawn.

### Example

```ts
import { Player, PlayerEvent } from "@infernus/core";

// Define a top-level command
PlayerEvent.onCommandText("help", ({ player, next }) => {
  console.log(`Hello, player ${player.getName().name}`);
  return next();
});

// Define a subcommand
PlayerEvent.onCommandText("help teleport", ({ player, next }) => {
  console.log(`player ${player.getName().name} wants help with teleport`);
  return next();
});

// Define a command that can be triggered by /msg or /message
PlayerEvent.onCommandText(["msg", "message"], ({ player, subcommand, next }) => {
  console.log(
    `player ${player.getName().name} entered this command, subcommand: ${subcommand.toString()}`,
  );

  // Equivalent to /message global or /msg global
  if (subcommand[0] === "global") {
    return next();
  } else {
    next();
    return false; // treat as invalid, triggering the after guard
  }
});
```

### Case Sensitivity

By default, command registration is **case-insensitive**.

You can toggle this via methods on the `GameMode` instance.

```ts
import { GameMode } from "@infernus/core";

console.log(GameMode.isCmdCaseSensitive());

GameMode.enableCmdCaseSensitive(); // Enable case sensitivity
GameMode.disableCmdCaseSensitive(); // Disable case sensitivity
```

:::warning
Note that toggling case sensitivity typically **cannot** be placed inside callback events like `GameMode.onInit`, because commands are registered via `PlayerEvent.onCommandText` before those events fire.

If you change the global setting and then import other packages, it will also affect case sensitivity of commands in those packages (e.g., `@infernus/fs`).

When multiple commands share the same name with different case sensitivity settings, **case-sensitive middlewares are considered strict matches and take precedence over case-insensitive ones.**
:::

You can flexibly enable or disable case sensitivity for subsequently registered commands.

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

GameMode.disableCmdCaseSensitive();

// Commands registered now are case-insensitive.
// Players can use help, HeLP, etc.
PlayerEvent.onCommandText("help", ({ player, next }) => {
  player.sendClientMessage(-1, "help command (not case sensitive)");
  return next();
});

GameMode.enableCmdCaseSensitive();

// Commands registered now are case-sensitive.
// Players must use Help exactly.
PlayerEvent.onCommandText("Help", ({ player, next }) => {
  player.sendClientMessage(-1, "help command (case sensitive)");
  return next();
});
```

### Per-Command Case Sensitivity

You can pass an option to specify whether a specific command is case-sensitive, independent of the global setting.

```ts
PlayerEvent.onCommandText({
  caseSensitive: false, // override for this command
  command: "foo",
  run({ player, subcommand, next }) {
    return next();
  },
});
```

### Before Guard

The before guard `onCommandReceived` executes before `onCommandText`, allowing you to add additional logic.

Returning `false` is treated as an active rejection and enters the error guard.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandReceived(({ player, command, next }) => {
  return next();
});
```

### After Guard

The after guard `onCommandPerformed` executes after `onCommandText`. You can add additional logic here.

Returning `false` is treated as an active rejection and enters the error guard.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  return next();
});
```

### Error Guard

The error guard `onCommandError` triggers when the before/after guard returns `false`, or when a player enters an undefined command. You can add handling logic here; typically only one error guard is defined globally.

Returning `false` falls through to the default behavior of the native `OnPlayerCommandText`.

```ts
PlayerEvent.onCommandError(({ player, command, error, next }) => {
  player.sendClientMessage(
    "#f00",
    `player ${player.id} command ${command} error ${error.code}: ${error.msg}`,
  );

  next(); // continue to other onCommandError middlewares if any
  return true; // indicates the error has been handled; don't trigger the default event
});
```

## Custom Event

You can define custom middleware events through `defineEvent`, typically used to extend the available callbacks.

For example, you can trigger your custom event in `onUpdate` based on certain conditions, and then use the corresponding middleware elsewhere.

```ts
import type { Player } from "@infernus/core";
import { defineEvent, PlayerEvent } from "@infernus/core";

const healthDangerSet = new Set<Player>();

const [onPlayerDanger, trigger] = defineEvent({
  // Only the commonly used options are listed
  isNative: false, // not a native event — this is custom
  name: "OnPlayerDanger", // must be unique; follow this naming convention
  defaultValue: true, // default middleware return value
  // If your custom event has callback parameters, use beforeEach for better TS type hints.
  // beforeEach runs before all middlewares to augment the parameters.
  beforeEach(player: Player, health: number) {
    // Must return an object
    return { player, health };
  },
  // afterEach runs after all middlewares complete (including async ones)
  afterEach({ player, health }) {},
});

PlayerEvent.onUpdate(({ player, next }) => {
  const isDanger = healthDangerSet.has(player);
  const health = player.getHealth();

  if (!isDanger && health <= 10) {
    healthDangerSet.add(player);
    const ret = trigger(player, health);
    if (!ret) return false;
  }
  if (isDanger && health > 10) {
    healthDangerSet.delete(player);
  }

  return next();
});

onPlayerDanger(({ player, health, next }) => {
  player.sendClientMessage(
    "#ff0",
    `DANGER! Your health is only ${health}. Auto-heal in 3 seconds.`,
  );
  setTimeout(() => {
    player.setHealth(100);
  }, 3000);
  return next();
});
```
