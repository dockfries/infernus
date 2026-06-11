# 事件

`Infernus` 的事件与原生事件贴近，建议前往 [Open Multiplayer](https://open.mp) 查阅原生开发的相关文档。

## 基础示例

以 `OnGameModeInit` 为例，在 `Infernus` 中即为 `GameMode.onInit(callback)`。

其他事件类大多以 `Event` 结尾，例如 `PlayerEvent`。

配合 TypeScript 的类型提示，您一定能快速上手。

```ts
import { GameMode } from "@infernus/core";

GameMode.onInit(({ next }) => {
  console.log("游戏模式已初始化");
  return next();
});

GameMode.onExit(({ next }) => {
  console.log("游戏模式已退出");
  return next();
});

GameMode.onIncomingConnection(({ next, playerId, ipAddress, port }) => {
  console.log(`玩家 ID：${playerId}，IP：${ipAddress}，端口：${port} 尝试连接`);
  return next();
});
```

## 默认行为

::: tip
**默认行为是指当我们不返回值或返回某个值时，所触发的游戏服务器底层行为。**

并非所有默认行为的返回值都是 `true`，也可能是 `false`，具体取决于游戏服务器底层函数的定义。
:::

以玩家输入文本事件为例：返回 `true` 或 `1` 表示让游戏服务器底层的文本输入事件继续执行，**此时聊天框将输出默认格式的消息。**

```ts
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return true;
});
```

## 中间件模式

您可能注意到几乎所有事件的回调函数中都有一个 `next` 参数，类似于 Express 等框架，用于执行中间件链中的下一个函数。

**借助中间件模式，您可以更方便地拆分事件逻辑，而不是把所有代码塞进同一个函数。**

:::warning
除非您确定下一个函数不应执行，否则请不要忘记调用 `next()`。
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  console.log("玩家连入 1");
  // return next(); 假设忘记调用
});

PlayerEvent.onConnect(({ player, next }) => {
  console.log("玩家连入 2");
  // 此中间件不会被执行
  return next();
});
```

### 异步支持

以玩家事件为例，玩家的事件类为 `PlayerEvent`。

您可以在回调中使用 `async/await` 或返回 `Promise`。

```ts
import { Player, PlayerEvent } from "@infernus/core";

// 用于演示的虚假异步
const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// 推荐使用 async/await 语法
PlayerEvent.onCommandText("async", async ({ player, next }) => {
  await fakePromise();
  player.sendClientMessage("#fff", "延迟 1 秒后发送消息。");
  return next();
});

// Promise 也可行，但不推荐
PlayerEvent.onCommandText("promise", ({ player, next }) => {
  return new Promise((resolve) => {
    fakePromise().then(() => {
      player.sendClientMessage("#fff", "延迟 1 秒后发送消息。");
      resolve();
      return next();
    });
  });
});
```

### 异步返回值

:::warning
由于底层逻辑限制，**异步函数的返回值是没有意义的！**

虽然 TypeScript 类型要求返回一个值，但实际上并不会被使用。

**如果您始终将 `next()` 的返回值作为自身返回值，那么遇到异步函数时，实际返回的将是底层的默认值。**
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
  // 因为是异步，具体返回值取决于 defineEvent 定义的默认值，
  // 而非异步函数实际返回的内容。
  // onText 默认为 true，底层会转换为 int 1。
  const ret = next(); // 执行后续函数
  return ret; // false 转换为 int 0
});

// 异步函数之后定义的同步返回值同样无效，
// 遇到异步函数时已返回了默认值。
PlayerEvent.onText(({ player, next }) => {
  return false;
});
```

### 取消

::: tip
所有通过 [defineEvent](#自定义事件) 定义的事件的中间件函数均可取消，现有绝大部分回调都是通过它定义的。
:::

此功能在只想执行一次或在某个时刻取消时非常实用。

```ts
// 定义一个一次性命令
const off = PlayerEvent.onCommandText("once", ({ player, next }) => {
  console.log("此命令只执行一次，之后再执行将无效。");
  const ret = next();
  off(); // 务必在 next 之后调用 off
  return ret;
});
```

## 获取实例

通常您需要根据 ID 获取 `Infernus` 封装的面向对象实例，例如玩家实例。

以下方式可获取实例，载具等其他实例类似。

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  const players = Player.getInstances(); // 获取所有玩家实例数组
  players.forEach((p) => {
    p.sendClientMessage("#fff", `玩家 ${player.getName().name} 已连接`);
  });

  const player = Player.getInstance(0); // 获取 ID 为 0 的玩家实例
  console.log(player);

  return next();
});
```

## 玩家命令

上述示例中已使用了玩家命令事件，它在语法上相较于原生 Pawn 有了极大提升，简化了 `strcmp` 等繁琐判断，并可通过中间件模式抽离命令逻辑。如果您有过原生开发经验，一定能体会其中的便利。

**玩家命令事件支持一次性定义多个字符串，也可以方便地定义子命令。**

玩家命令还支持取消定义，`onCommandText` 的返回值即为取消函数。

玩家命令还提供了前置守卫、后置守卫和错误守卫，参考了 Pawn 库中 `zcmd` 的设计思想。

### 示例

```ts
import { Player, PlayerEvent } from "@infernus/core";

// 定义一级命令
PlayerEvent.onCommandText("help", ({ player, next }) => {
  console.log(`玩家 ${player.getName().name}，您好`);
  return next();
});

// 定义二级命令
PlayerEvent.onCommandText("help teleport", ({ player, next }) => {
  console.log(`玩家 ${player.getName().name} 想获取传送相关的帮助`);
  return next();
});

// 定义可由 /msg 或 /message 触发的命令
PlayerEvent.onCommandText(["msg", "message"], ({ player, subcommand, next }) => {
  console.log(
    `玩家 ${player.getName().name} 输入了此命令，子命令：${subcommand.toString()}`,
  );

  // 相当于玩家输入了 /message global 或 /msg global
  if (subcommand[0] === "global") {
    return next();
  } else {
    next();
    return false; // 视为无效命令，将触发后置守卫
  }
});
```

### 区分大小写

默认情况下，命令注册**不区分**大小写。

您可以通过 `GameMode` 实例下的方法来启用、禁用或查询当前状态。

```ts
import { GameMode } from "@infernus/core";

console.log(GameMode.isCmdCaseSensitive());

GameMode.enableCmdCaseSensitive(); // 启用命令区分大小写
GameMode.disableCmdCaseSensitive(); // 禁用命令区分大小写
```

:::warning
注意，启用/禁用命令通常**不能**放在 `GameMode.onInit` 等回调中，因为通过 `PlayerEvent.onCommandText` 注册命令的时机更早。

如果更改全局设置后导入其他包，也会影响这些包中全局命令的大小写设置，例如 `@infernus/fs`。

当定义多个同名命令且分别设置了是否区分大小写时，**区分大小写的中间件被视为严格匹配，优先于不区分的执行。**
:::

您可以灵活地启用或禁用，以控制后续注册的命令是否区分大小写。

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

GameMode.disableCmdCaseSensitive();

// 此时注册的命令不区分大小写，玩家可通过 help、HeLP 等方式调用
PlayerEvent.onCommandText("help", ({ player, next }) => {
  player.sendClientMessage(-1, "help 命令（不区分大小写）");
  return next();
});

GameMode.enableCmdCaseSensitive();

// 此时注册的命令区分大小写，玩家只能通过 Help 调用
PlayerEvent.onCommandText("Help", ({ player, next }) => {
  player.sendClientMessage(-1, "help 命令（区分大小写）");
  return next();
});
```

### 局部区分大小写

您可以传递配置项，指定当前注册的命令是否区分大小写，不受全局设置影响。

```ts
PlayerEvent.onCommandText({
  caseSensitive: false, // 指定该命令是否区分大小写
  command: "foo",
  run({ player, subcommand, next }) {
    return next();
  },
});
```

### 前置守卫

前置守卫 `onCommandReceived` 在 `onCommandText` 之前执行，可添加额外逻辑。

返回 `false` 视为主动拒绝，将进入错误守卫。

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandReceived(({ player, command, next }) => {
  return next();
});
```

### 后置守卫

后置守卫 `onCommandPerformed` 在 `onCommandText` 之后执行，可添加额外逻辑。

返回 `false` 视为主动拒绝，将进入错误守卫。

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  return next();
});
```

### 错误守卫

错误守卫 `onCommandError` 在前置/后置守卫返回 `false` 或玩家输入了未定义的命令时触发。可添加处理逻辑，通常全局只定义一个。

返回 `false` 将执行原生事件 `OnPlayerCommandText` 的默认行为。

```ts
PlayerEvent.onCommandError(({ player, command, error, next }) => {
  player.sendClientMessage(
    "#f00",
    `玩家 ${player.id} 输入了 ${command}，错误 ${error.code}：${error.msg}`,
  );

  next(); // 如有其他 onCommandError 中间件，继续执行
  return true; // 表示已处理错误，不再触发默认事件
});
```

## 自定义事件

您可以通过 `defineEvent` 自定义中间件事件，通常用于扩展新的回调。

例如，您可以在 `onUpdate` 中根据某些条件触发自定义事件，然后在其他位置使用对应的中间件。

```ts
import type { Player } from "@infernus/core";
import { defineEvent, PlayerEvent } from "@infernus/core";

const healthDangerSet = new Set<Player>();

const [onPlayerDanger, trigger] = defineEvent({
  // 仅列出常用选项
  isNative: false, // 非原生事件，即自定义事件
  name: "OnPlayerDanger", // 请使用唯一名称，避免与现有事件冲突
  defaultValue: true, // 中间件默认返回值
  // 如果自定义事件有回调参数，务必编写 beforeEach 以增强 TS 类型提示
  // beforeEach 在所有中间件执行前运行，用于增强参数
  beforeEach(player: Player, health: number) {
    // 必须返回一个对象
    return { player, health };
  },
  // afterEach 在所有中间件（含异步）执行完毕后运行
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
  player.sendClientMessage("#ff0", `危险！您的生命值仅剩 ${health}，3 秒后将自动回血`);
  setTimeout(() => {
    player.setHealth(100);
  }, 3000);
  return next();
});
```
