# 生命周期

生命周期展示了 `samp-node` 脚本的执行时机。

![生命周期](/images/life-cycle-zh-hans.png)

只需注意一点：**所有与游戏相关的 API 调用都应放在 `on` 回调事件中**，就像原生开发那样。在 `samp.caller` 尚未就绪时调用均为无效。

```ts
import { GameMode } from "@infernus/core";

// 不要这样，这是无效代码
GameMode.setWeather(10);

// 应该这样
GameMode.onInit(({ next }) => {
  GameMode.setWeather(10);
  return next();
});
```
