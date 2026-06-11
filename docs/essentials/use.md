# Use

**`GameMode.use` simulates a `filterscript` for reusing logic across GameModes.**

::: tip
Since this is a simulation rather than a real `filterscript`, you cannot manage these scripts through commands like `rcon loadfs/unloadfs`.
:::

## Type

```ts
interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => Array<() => void> | Promise<Array<() => void>>;
  unload: () => any;
  [propName: string | number | symbol]: any;
}

type Use = (plugin: IFilterScript, ...options: Array<any>) => GameMode;
```

## Defining a Script

You can write reusable logic scripts and share them via `node package` or other means.

```ts
import { GameMode } from "@infernus/core";
import type { IFilterScript } from "@infernus/core";

interface IMyScriptOptions {
  debug?: boolean;
}

interface IMyScript extends IFilterScript {
  load(options: IMyScriptOptions): ReturnType<IFilterScript["load"]>;
}

const MyScript: IMyScript = {
  name: "my_script",
  load(...args) {
    console.log("My script loaded.", args);
  },
  unload() {
    console.log("My script unloaded.");
  },
};

// No arguments passed to load
GameMode.use(MyScript);
// With arguments passed to load
GameMode.use(MyScript, "arg1", "arg2", "arg...");
```

::: tip
Registered scripts are automatically loaded after GameMode initialization.
Loaded scripts are automatically unloaded when the GameMode exits.
:::

## Load Commands

- `GameMode.loadUseScript(name: string)`: Load a registered script
- `GameMode.unloadUseScript(name: string)`: Unload a registered script
- `GameMode.reloadUseScript(name: string)`: Reload a registered script

### Example

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandText("reloadMyScript", ({ next }) => {
  GameMode.reloadUseScript("my_script");
  return next();
});
```

## Important Notes

::: warning
You should not register `GameMode.onInit` inside the `load` function, since `load` is already executed within that event.

If you use middleware functions inside `load`, make sure to return an array of their cancel functions at the end — otherwise memory will leak! Similarly, global variables like timers should be reset in the `unload` function.

The reason is simple: without this, middleware won't be cleaned up when the GameMode restarts or when you manually reload the script. Each reload adds new middleware, causing a memory leak!
:::

Additionally, you should not call `script.load()` or `script.unload()` directly — use the [load commands](#load-commands) instead.

```ts
import { PlayerEvent } from "@infernus/core";

const MyScript = {
  name: "my_script",
  load(...args) {
    const off1 = PlayerEvent.onCommandText("foo", ({ player, next }) => {
      return next();
    });

    const off2 = PlayerEvent.onConnect(({ player, next }) => {
      return next();
    });

    return [off1, off2];
  },
  unload() {},
};

GameMode.use(MyScript);
```

## Rewriting Official Filterscripts

`Infernus` has reimplemented the official filterscripts. You can try them by installing [@infernus/fs](https://github.com/dockfries/infernus/tree/main/packages/filterscript).

If you're interested, these examples can help you get familiar with the syntax more quickly. You can also download the source code and modify it to better suit your GameMode.

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { A51Base } from "@infernus/fs";

GameMode.use(A51Base, { debug: true });
```

Then enter `/a51` in-game to teleport to the base.
