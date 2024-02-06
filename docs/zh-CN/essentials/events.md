# 事件

`Infernus` 的事件贴近原生的事件，您应当前往 [Open Multiplayer](https://open.mp) 来参考原生开发的相关文档。

## 基础示例

以`OnGameModeInit`为例，在`Infernus`中即为`GameMode.onInit(callback)`。

其他事件类也是一样的类似语法，配合 `TypeScript` 的类型提示您一定能理解。

```ts
import { GameMode } from "@infernus/core";

GameMode.onInit(({ next }) => {
  console.log("游戏模式初始化了");
  return next();
});

GameMode.onExit(({ next }) => {
  console.log("游戏模式退出了");
  return next();
});

GameMode.onIncomingConnection(({ next, playerId, ipAddress, port }) => {
  console.log(`玩家id:${playerId},ip:${ipAddress},端口:${port}尝试连入服务器`);
  return next();
});
```

## 默认行为

::: tip
**默认行为指的是当我们不返回或返回某个值时，会触发的游戏服务器底层的行为。**

不是所有的默认行为的返回值都是 `true`，它也可能是 `false` ，具体取决于游戏服务器底层的函数是怎样定义的。

:::

以玩家输入文本事件为例，如果我们返回 `true` 或 `1`，意味着让游戏服务器底层的文本输入事件继续执行。**此时您在聊天框中将看到一个默认的消息格式输出。**

```ts
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return true;
});
```

## 中间件模式

您可能注意到几乎所有事件的回调函数中都有一个`next`参数，它类似于很多框架，比如 `express`，它用于执行中间件中的下一个函数。

**有了中间件模式，您可以更方便的拆分您的事件，而不是把所有事件都写在同一个函数中。**

:::warning
您千万不要忘记调用 `next()` ，除非您很清楚的知道不应当执行下一个函数。
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  console.log("玩家连入1");
  // return next(); 假设您忘记了调用
});

PlayerEvent.onConnect(({ player, next }) => {
  console.log("玩家连入2");
  // 这个中间件并不会被执行
  return next();
});
```

### 异步支持

以玩家事件为例，玩家的事件类为`PlayerEvent`。

您可以在回调中使用 `async` 语法糖或是返回一个 `Promise` 函数。

```ts
import { Player, PlayerEvent } from "@infernus/core";

// 为了演示用的虚假异步
const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// 您可以采用async语法糖，这也是推荐的语法
PlayerEvent.onCommandText("async", async ({ player, next }) => {
  await fakePromise();
  player.sendClientMessage("#fff", "延迟了1秒后发送消息。");
  return next();
});

// promise也可以，但是不推荐
PlayerEvent.onCommandText("promise", ({ player, next }) => {
  return new Promise((resolve) => {
    fakePromise().then(() => {
      player.sendClientMessage("#fff", "延迟了1秒后发送消息。");
      resolve();
      return next();
    });
  });
});
```

### 异步返回值

:::warning
由于底层逻辑，**您定义的异步函数的返回值是无意义的**！

虽然 `TypeScript` 类型要求您必须返回一个值，但是实际上不会被使用。

**如果您始终返回下一个的中间件的返回值作为返回值，那么当遇到异步函数时，返回值始终返回的是底层的默认值。**
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
  // 由于是异步，具体的返回值取决于源码底层defineEvent定义的事件的默认返回值
  // 而不取决于异步函数返回了什么
  // onText默认为true,底层会转换为int，也就是1
  const ret = next(); // 执行之后的函数
  return ret; // false转换为int = 0
});

// 在异步函数之后定义的同步返回值也没有意义，当遇到异步函数时已经返回了默认值
PlayerEvent.onText(({ player, next }) => {
  return false;
});
```

### 取消

::: tip
所有通过 [defineEvent](#自定义事件) 定义的事件的中间件函数都可以被取消，现有的绝大部分回调都是通过它定义的。
:::

这个特性对于只想执行一次或在某个时刻取消时很常用。

```ts
import { PlayerEvent } from "@infernus/core";
// 定义一个一次性命令
const off = PlayerEvent.onCommandText("once", ({ player, next }) => {
  console.log("这个命令只执行一次，下一次执行就不存在了");
  off();
  return next();
});
```

## 获取实例

通常您可能需要获取所有或根据 `id` 来获取 `Infernus` 封装的面向对象的实例，例如玩家实例。

您可以通过以下方法获得实例，载具等其他实例也类似。

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  const players = Player.getInstances(); // 获取所有玩家实例数组
  players.forEach((p) => {
    p.sendClientMessage("#fff", `玩家${player.getName()}连接了游戏`);
  });

  const player = Player.getInstance(0); // 获取玩家id为0的玩家实例
  console.log(player);

  return next();
});
```

## 玩家命令

上述案例中已经使用了玩家命令事件，它相较于过去的 `pawn` 原生写法有了极大的语法上的提升，简化了很多 `strcmp` 等函数判断，并且配合中间件模式可以抽离命令逻辑，如果您使用过原生开发的话您会知道我在说什么。

**玩家命令事件支持一次性定义多个字符串，也可以方便定义子命令。**

玩家命令还支持取消定义，`onCommandText` 的返回值即为取消函数。

玩家命令还提供了前置守卫，后置守卫和错误守卫，这参考了`pawn` 库中的 `zcmd` 的思想。

### 基础示例

```ts
import { Player, PlayerEvent } from "@infernus/core";

// 定义一个一级命令
PlayerEvent.onCommandText("help", ({ player, next }) => {
  console.log(`玩家 ${player.getName()}，您好`);
  return next();
});

// 定义一个二级命令
PlayerEvent.onCommandText("help teleport", ({ player, next }) => {
  console.log(`玩家 ${player.getName()}想得到传送相关的帮助信息`);
  return next();
});

// 定义一个命令，可以由msg或message触发
PlayerEvent.onCommandText(
  ["msg", "message"],
  ({ player, subcommand, next }) => {
    console.log(
      `玩家 ${player.getName()}，输入了此命令，并且可能还输入了子命令 ${subcommand.toString()}`
    );

    // 相当于玩家输入了/message global或/msg global
    if (subcommand[0] === "global") {
      // 额外的逻辑
      return next();
    } else {
      next();
      // 认为是个无效的命令,将触发后置守卫
      return false;
    }
  }
);
```

### 前置守卫

前置守卫 `onCommandReceived` 在 `onCommandText` 之前执行，您可以额外加一些逻辑。

返回 `false` 将认为这是主动拒绝，进入到错误守卫中。

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandReceived(({ player, command, next }) => {
  return next();
});
```

### 后置守卫

后置守卫 `onCommandPerformed` 在 `onCommandText` 之后执行，您可以额外加一些逻辑。

返回 `false` 将认为这是主动拒绝，进入到错误守卫中。

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  return next();
});
```

### 错误守卫

错误守卫 `onCommandError` 在前置/后置守卫`return false`或玩家输入了一个没有定义的命令时执行，您可以额外加一些逻辑，通常全局只定义一个。

如果返回 `false` 则将执行默认行为，即原生事件 `OnPlayerCommandText` 的默认行为。

```ts
PlayerEvent.onCommandError(({ player, command, error, next }) => {
  player.sendClientMessage(
    "#f00",
    `玩家${player.id}输入了${command},出现错误${error.code}, ${error.msg}`
  );

  next(); // 如果后续还有onCommandError，则执行
  return true; // 返回true表示已经处理了错误，不再触发默认事件
});
```

## 自定义事件

您可以通过 `defineEvent` 来自己定义一个中间件事件，它通常用于扩展一些新的回调。

比如您可以在 `onUpdate` 中根据某些条件来触发您定义的新事件，然后您在某些地方可以使用您定义的新事件中间件。

```ts
import type { Player } from "@infernus/core";
import { defineEvent, PlayerEvent } from "@infernus/core";

const healthDangerSet = new Set<Player>();

const [onPlayerDanger, trigger] = defineEvent({
  // 只列了常用部分
  isNative: false, // 不是原生事件，即我们的自定义事件，如果为true则意味着在pwn中的native事件或是插件的native事件
  name: "OnPlayerDanger", // name请起一个唯一的，不要与现有的事件名冲突，通常为这种格式
  defaultValue: true, // 定义中间件默认返回值为true
  // 如果您的自定义事件会有回调参数，请一定要写beforeEach来增强ts类型提示
  // beforeEach会在所有该中间件执行前执行，用于增强参数
  beforeEach(player: Player, health: number) {
    // 要求您一定要返回一个对象
    return { player, health };
  },
  // afterEach用于在所有中间件执行后执行(会等待所有异步的也执行完毕)
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
    `危险! 您生命值仅为${health}, 3秒后系统将自动为您回血`
  );
  setTimeout(() => {
    player.setHealth(100);
  }, 3000);
  return next();
});
```
