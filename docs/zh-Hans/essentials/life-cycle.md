# 生命周期

生命周期可以让您了解到 `samp-node` 的脚本是何时执行的。

![生命周期](/images/life-cycle-zh-hans.png)

您只需要注意一点，**有关游戏的 `api` 调用应该都放在 `on` 回调事件里**，就像用原生开发时那样，否则当 `samp.caller` 还没准备完毕时的调用都是无效的。

```ts
import { GameMode } from "@infernus/core";

// 不要这样,这样是无效的代码
GameMode.setWeather(10);

// 要这样
GameMode.onInit(({ next }) => {
  GameMode.setWeather(10);
  return next();
});
```
