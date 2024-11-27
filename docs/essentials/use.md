# Use

**`GameMode.use` Is a method to simulate `filterscript`, which is used for logical reuse into GameMode.**

::: tip
Because it is a simulation rather than a real `filterscript`, you cannot operate these scripts through commands such as `rcon loadfs/unloadfs`.
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

## Define script

You can write some logical reuse scripts yourself and share them with others through `node package` or other ways.

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
    console.log('My script loaded.', args);
  },
  unload() {
    console.log('My script unloaded.');
  }
};

// No parameters are passed to the load method
GameMode.use(MyScript);
// Pass parameters to the load method
GameMode.use(MyScript, 'arg1', 'arg2', "arg...");
```

::: tip
Registered scripts are automatically loaded after the GameMode init.
The loaded script is automatically unloaded when the GameMode exit.
:::

## Load command

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

## Notice

::: warning
You should not register the `GameMode.onInit` event in the `load` function, because the function is executed in its event when it is loaded through `GameMode.use`.

If you use middleware functions in the `load` function, you should return an array of canceled middleware functions at the end, otherwise there will be a memory leak phenomenon! For other global variables, such as timers, you should reset them in the `unload` function!

The reason is simple, if you don't do this, the middleware will not be unloaded when the GameMode is restarted or manually executed the script command restart, and every time the script is loaded, a new middle function is added, which will cause memory leak!
:::

In addition, you should not call the `script.load()` or `script.unload()`，You should use the [load command](#load-command) to call.

```ts

const MyScript = {
  name: 'my_script',
  load(...args) {
    const off1 = PlayerEvent.onCommandText("foo", ({ player, next }) => {
      return next();
    });

    const off2 = PlayerEvent.onConnect(({ player, next }) => {
      return next();
    });

    return [off1, off2];
  },
  unload() {

  }
}

GameMode.use(MyScript);

```

## Rewrite the official filterscript

`Infernus` has tried to rewrite the official filterscript. You can try it by installing [@infernus/fs](https://github.com/dockfries/infernus/tree/main/packages/filterscript).

If you are interested, you can refer to these cases to familiarize you with the syntax faster. You can also download the source code and modify it to better apply it in your GameMode.

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { A51Base } from "@infernus/fs";

GameMode.use(A51Base, { debug: true });
```

Then you enter `/a51` in the game to teleport to the base.
