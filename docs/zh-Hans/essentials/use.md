# Use

**`GameMode.use` 是一种模拟过滤脚本的方法，用于将逻辑复用到游戏模式中。**

::: tip
由于是模拟而非真正的过滤脚本，因此不能通过 `rcon loadfs/unloadfs` 等命令操作这些脚本。
:::

## 类型

```ts
interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => Array<() => void> | Promise<Array<() => void>>;
  unload: () => any;
  [propName: string | number | symbol]: any;
}

type Use = (plugin: IFilterScript, ...options: Array<any>) => GameMode;
```

## 定义脚本

您可以自己编写可复用的逻辑脚本，并通过 `node package` 等方式分享给他人。

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
    console.log("我的脚本已加载", args);
  },
  unload() {
    console.log("我的脚本已卸载");
  },
};

// 无参数传递给 load 方法
GameMode.use(MyScript);
// 带参数传递给 load 方法
GameMode.use(MyScript, "参数1", "参数2", "参数...");
```

::: tip
注册的脚本会在游戏模式初始化后自动加载，游戏模式退出后自动卸载。
:::

## 加载命令

- `GameMode.loadUseScript(name: string)`：加载已注册的脚本
- `GameMode.unloadUseScript(name: string)`：卸载已注册的脚本
- `GameMode.reloadUseScript(name: string)`：重新加载已注册的脚本

### 示例

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandText("reloadMyScript", ({ next }) => {
  GameMode.reloadUseScript("my_script");
  return next();
});
```

## 注意事项

::: warning
不应在 `load` 函数中注册 `GameMode.onInit` 事件，因为 `load` 本身就是在该事件中被执行的。

如果在 `load` 函数中使用中间件函数，务必在最后返回要取消的中间件函数数组，否则会导致内存泄漏！对于其他全局变量（如计时器），应在 `unload` 函数中重置。

原因很简单：若不这样做，中间件不会随游戏模式重启或手动重启脚本而卸载，每次重新加载都会新增中间件，从而造成内存泄漏！
:::

另外，不应直接调用 `script.load()` 或 `script.unload()`，应使用[加载命令](#加载命令)来操作。

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

## 重写官方过滤脚本

`Infernus` 尝试重写了官方过滤脚本，您可以通过安装 [@infernus/fs](https://github.com/dockfries/infernus/tree/main/packages/filterscript) 来体验。

如感兴趣，可参考这些示例以更快熟悉语法，也可以下载源码自行修改，让其更好地适配您的游戏模式。

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { A51Base } from "@infernus/fs";

GameMode.use(A51Base, { debug: true });
```

然后在游戏中输入 `/a51` 即可传送到对应的基地。
