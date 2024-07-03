# Use

**`GameMode.use` 是一种模拟`过滤脚本`的方法，它用于逻辑复用到游戏模式。**

::: tip
由于是模拟而不是真正的`过滤脚本`，因此您不能通过 `rcon` 的 `loadfs/unloadfs` 等命令操作这些脚本。
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

您可以自己写一些逻辑复用的脚本并通过`node package`或其他方式分享给他人。

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
    console.log("我的脚本加载了", args);
  },
  unload() {
    console.log("我的脚本卸载了");
  },
};

// 无参数传递给load方法
GameMode.use(MyScript);
// 带参数传递给load方法
GameMode.use(MyScript, "参数1", "参数2", "参数...");
```

::: tip
游戏模式初始化后将自动加载已注册的脚本。
游戏模式退出后将自动卸载已加载的脚本。
:::

## 加载命令

- `GameMode.loadUseScript(name: string)`：加载一个注册过的脚本
- `GameMode.unloadUseScript(name: string)`：卸载一个注册过的脚本
- `GameMode.reloadUseScript(name: string)`：重新加载一个注册过的脚本

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
您不应该在`load`函数中注册`GameMode.onInit`事件，因为函数通过`GameMode.use`加载时，就在其事件中执行。

如果您在`load`函数中使用了中间件函数，您应当在最后返回要取消的中间件函数数组，否则会出现内存泄漏现象！对于其他全局变量，如计时器等，您应当在`unload`函数重置它！

原因很简单，如果您不这样做，中间件不会随着游戏模式重启或手动执行重启脚本命令而卸载，而每一次脚本的加载又添加了新的中间函数，这会导致内存泄漏！
:::

另外，您不应该手动调用 `script.load()` 或 `script.unload()`，您应该使用[加载命令](#加载命令)来调用。

```ts
import { PlayerEvent } from "@infernus/core";

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

## 重写官方过滤脚本

`Infernus` 尝试了重写官方的过滤脚本，不过目前只实现了一点点，您可以通过安装 [@infernus/fs](https://github.com/dockfries/infernus/tree/main/packages/filterscript) 来体验，如果您感兴趣也可以继续完善未重写的官方过滤脚本，将这些例子提交到仓库中。

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { A51Base } from "@infernus/fs";

GameMode.use(A51Base, { debug: true });
```

然后您在游戏中输入 `/a51` 来传送到对应的基地。
