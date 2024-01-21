# Use

**`GameMode.use` Is a method to simulate `filterscript', which is used for logical reuse into game mode.**

::: tip
Because it is a simulation rather than a real `filterscript`, you cannot operate these scripts through commands such as `rcon loadfs/unloadfs`.
:::

## Type

```ts
interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => any;
  unload: () => any;
  [propName: string | number | symbol]: any;
}

type Use = (plugin: IFilterScript, ...options: Array<any>) => GameMode;
```

## Define script

You can write some logical reuse scripts yourself and share them with others through `node package` or other ways.

```ts
import { GameMode } from "@infernus/core";

const script = {
  name: 'my_script',
  load(...args) {
    console.log('My script loaded.')
  }
  unload() {
    console.log('My script unloaded.')
  }
}

// No parameters are passed to the load method
GameMode.use(script);
// Pass parameters to the load method
GameMode.use(script, 'arg1', 'arg2');
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
If you use middleware functions in your script, you should cancel these intermediate functions when the script is unloaded, otherwise there will be a memory leak!
The reason is simple: if you don't, the middleware will not be uninstalled as the game mode restarts or manually executes the restart script command, and each time a new intermediate function is added to the script's `load` function, which will lead to a memory leak!
:::

In addition, you should not call the `script.load()` or `script.unload()`，You should use the [load command](#load-command) to call.

```ts

const offs = []

const script = {
  name: 'my_script',
  load(...args) {
    const off = GameMode.onInit(() => {
    })
    offs.push(off)
  }
  unload() {
    offs.forEach(off => off());
  }
}

GameMode.use(script);

```

## Rewrite the official filterscript

`Infernus` has tried to rewrite the official filterscript, but only a little has been implemented so far. You can try it by installing `@infernus/fs`. If you are interested, you can continue to improve the official filterscript that has not been rewritten and commit to the repository.

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { useA51BaseFS } from "@infernus/fs";

GameMode.use(useA51BaseFS({ debug: true }));
```

Then you enter `/a51` in the game to teleport to the base.
