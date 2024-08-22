# Events

The event of `Infernus` is close to the native event. You should go to [Open Multiplayer](https://open.mp) to refer to the relevant documentation of native development.

## Example

Take `OnGameModeInit` as an example, in `Infernus`, it is `GameMode.onInit(callback)`.

Other event classes have the same similar syntax, which you can understand with the type of `TypeScript`.

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
  console.log(
    `player id:${playerId},ip:${ipAddress},port:${port} try to connect`,
  );
  return next();
});
```

## Default behavior

::: tip
**The default behavior refers to the underlying behavior of the game server that is triggered when we do not return or return a value.**

Not all default behaviors return `true`, but it may also be `false`, depending on how the underlying functions of the game server are defined.

:::

Take the player input text event as an example, if we return `true` or `1`, it means that the underlying text input event of the game server continues to execute. **At this point you will see a default message format output in the chat box.**

```ts
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return true;
});
```

## Middleware

You may have noticed that there is a `next` parameter in the callback function of almost all events, which is similar to many frameworks, such as `express`, which is used to execute the next function in the middleware.

**with the middleware pattern, you can split your events more easily instead of writing all events in the same function.**

:::warning
Don't forget to call `next()`unless you know very well that the next function should not be executed.
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  console.log("player connected 1");
  // return next(); Suppose you forget to call the
});

PlayerEvent.onConnect(({ player, next }) => {
  console.log("player connected 2");
  // This middleware will not be executed
  return next();
});
```

### Async support

Take player events as an example. The player's event class is `PlayerEvent`.

You can use `async` grammar sugar or return a `Promise` function in the callback.

```ts
import { Player, PlayerEvent } from "@infernus/core";

// In order to demonstrate the false async
const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// You can use async grammar sugar, which is also the recommended grammar
PlayerEvent.onCommandText("async", async ({ player, next }) => {
  await fakePromise();
  player.sendClientMessage("#fff", "Send a message after a delay of 1 second.");
  return next();
});

// Promise is OK, but it is not recommended
PlayerEvent.onCommandText("promise", ({ player, next }) => {
  return new Promise((resolve) => {
    fakePromise().then(() => {
      player.sendClientMessage(
        "#fff",
        "Send a message after a delay of 1 second.",
      );
      resolve();
      return next();
    });
  });
});
```

### Async return

:::warning
Because of the underlying logic, **the return value of the async function you define is meaningless!**

Although the `TypeScript` type requires you to return a value, it is not actually used.

**If you always return the return value of the next middleware as the return value, the return value always returns the underlying default value when an async function is encountered.**
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
  // because it is async,
  // the specific return value depends on the default return value of
  // the event defined by the underlying defineEvent of the source code.
  //
  // does not depend on what the async function returns.
  // onText defaults to true, and the underlying layer will be converted to int, that is, 1
  const ret = next(); // the function after execution
  return ret; // convert false to int = 0
});

// The synchronous return value defined after the async function also makes no sense,
// and the default value has been returned when an async function is encountered
PlayerEvent.onText(({ player, next }) => {
  return false;
});
```

### Cancel

::: tip
All middleware functions for events defined by [defineEvent](#custom-event) can be canceled, and most existing callbacks are defined through it.
:::

This feature is commonly used when you only want to execute once or cancel at some point.

```ts
// Define an one-time command
const off = PlayerEvent.onCommandText("once", ({ player, next }) => {
  console.log(
    "This command is only executed once, and the next execution will not exist.",
  );
  const ret = next();
  off(); // next function should be executed before the off function
  return ret;
});
```

## Get instance

Usually, you may need to obtain all the object-oriented instances encapsulated by `Infernus`, such as player instances, according to `id`.

You can obtain examples in the following ways, as well as other examples such as vehicles.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  const players = Player.getInstances(); // Get an array of all player instances
  players.forEach((p) => {
    p.sendClientMessage("#fff", `player ${player.getName()} connected`);
  });

  const player = Player.getInstance(0); // Get the instance of a player whose id is 0
  console.log(player);

  return next();
});
```

## Player command

The player command event has been used in the above case, which has a great improvement in syntax compared with the previous `pawn` native writing, simplifies the judgment of many functions such as `strcmp`, and can extract command logic with middleware mode. If you have used native development, you will know what I am talking about.

**Player command events support the definition of multiple strings at a time, or you can easily define subcommands.**

The player command also supports undefinition, and the return value of `onCommandText` is the cancel function.

The player command also provides front guard, rear guard and wrong guard, which refers to the idea of `zcmd` in the `pawn` library.

### Example

```ts
import { Player, PlayerEvent } from "@infernus/core";

// Define a first-level command
PlayerEvent.onCommandText("help", ({ player, next }) => {
  console.log(`player ${player.getName()}, hello`);
  return next();
});

// Define a second-level command
PlayerEvent.onCommandText("help teleport", ({ player, next }) => {
  console.log(
    `player ${player.getName()} want to get help information related to teleport`,
  );
  return next();
});

// Define a command that can be triggered by /msg or /message
PlayerEvent.onCommandText(
  ["msg", "message"],
  ({ player, subcommand, next }) => {
    console.log(
      `player ${player.getName()} entered this command, and may also have entered a subcommand ${subcommand.toString()}`,
    );

    // It is equivalent to the player entering / message global or / msg global
    if (subcommand[0] === "global") {
      // Extra logic
      return next();
    } else {
      next();
      // Thought to be an invalid command, will trigger the rear guard
      return false;
    }
  },
);
```

### Case sensitivity

By default, command registration **does not differentiate** between cases.

You can enable, disable, and retrieve the current status through methods under the `GameMode` instance.

```ts
import { GameMode } from "@infernus/core";

console.log(GameMode.isCmdCaseSensitive());

GameMode.enableCmdCaseSensitive(); // Enable case sensitivity for commands
GameMode.disableCmdCaseSensitive(); // Disable case sensitivity for commands
```

:::warning
Note that enabling and disabling commands typically **cannot be placed** in callback events like `GameMode.OnInit.` This is because registering commands via `PlayerEvent.onCommandText` occurs earlier.

Assuming you change the global enable/disable setting and then import other packages, it will also affect the case sensitivity of globally registered commands in other packages such as `@infernus/fs`.
:::

You can flexibly enable or disable to control whether subsequently registered commands are case sensitive.

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

GameMode.disableCmdCaseSensitive();

// Commands registered at this point are not case sensitive, 
// allowing players to use commands like help, HeLP, etc.
PlayerEvent.onCommandText("help", ({ player, next }) => {
  player.sendClientMessage(-1, "help command (not case sensitive)");
  return next();
});

GameMode.enableCmdCaseSensitive();

// Commands registered at this point are case sensitive, 
// requiring players to use Help only.
PlayerEvent.onCommandText("Help", ({ player, next }) => {
  player.sendClientMessage(-1, "help command (case sensitive)");
  return next();
});
```

### Partial case sensitivity

You can pass a option to specify whether the command being registered is case sensitive, independent of the global case sensitivity setting.

```ts
PlayerEvent.onCommandText({
  caseSensitive: false, // Specify if the command is case sensitive
  command: "foo", // Your command
  run({ player, subcommand, next }) {
    return next();
  },
});
```

### Before guard

Before guard `onCommandReceived` executes before `onCommandText`, and you can add some additional logic.

If you return `false`, you will consider this as an active refusal and enter the error guard.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandReceived(({ player, command, next }) => {
  return next();
});
```

### After guard

After guard `onCommandPerformed` is executed after `onCommandText`. You can add some additional logic.

If you return `false`, you will consider this as an active refusal and enter the error guard.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  return next();
});
```

### Error guard

The error guard `onCommandError` is executed when the before / after guard `return false` or when the player enters an undefined command, you can add some additional logic, usually only one is defined globally.

If `false` is returned, the default behavior will be executed, that is, the default behavior of the native event `OnPlayerCommandText`.

```ts
PlayerEvent.onCommandError(({ player, command, error, next }) => {
  player.sendClientMessage(
    "#f00",
    `player ${player.id} command ${command} with error ${error.code}, ${error.msg}`,
  );

  next(); // If there are other onCommandError middleware, execute
  return true; // Returning true indicates that the error has been handled and the default event is no longer triggered
});
```

## Custom event

You can define a middleware event yourself through `defineEvent`, which is usually used to extend some new callbacks.

For example, you can trigger the new event you defined in `onUpdate` according to certain conditions, and then you can use the new event middleware you defined in some places.

```ts
import type { Player } from "@infernus/core";
import { defineEvent, PlayerEvent } from "@infernus/core";

const healthDangerSet = new Set<Player>();

const [onPlayerDanger, trigger] = defineEvent({
  // Only the commonly used parts are listed
  isNative: false, // It is not a native event, that is, our custom event.
  // If it is true, it means the native event in pwn or the native event of the plugin.
  name: "OnPlayerDanger", // Please raise a unique, do not conflict with the existing event name, usually in this format
  defaultValue: true, // Define the default return value of middleware as true
  // If your custom event has callback parameters, be sure to write beforeEach to enhance the ts type prompt
  // BeforeEach is executed before all the middleware is executed to enhance the parameters
  beforeEach(player: Player, health: number) {
    // You are required to return an object
    return { player, health };
  },
  // AfterEach is used to execute after all middleware is executed (waiting for all async ones to finish)
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
    `DANGER! Your health is only ${health}, and the system will automatically return blood for you after 3 seconds.`,
  );
  setTimeout(() => {
    player.setHealth(100);
  }, 3000);
  return next();
});
```
