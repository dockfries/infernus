# 特性

## 自动销毁实例

游戏模式退出时，所有 `Streamer/车辆/文本绘制/菜单...` 实例会自动销毁，无需重复编写大量销毁函数。

不过，如果实例需要在玩家断开连接时销毁，仍需手动处理。

## 弃用

弃用了可被 JavaScript 内置函数或第三方库替代的功能，如 `floatabs`、`strcmp`、`sqlite db`、`setTimer` 等。这意味着您应使用 JavaScript 库，而不再需要也不应使用 `mysql`、`timerfix` 等原生插件。

## 字符串获取

对于大多数字符串获取，您不再需要像原生开发那样定义固定长度数组。`Infernus` 内部已对常用函数进行了处理，其原理是分配一个最大长度的缓冲区，然后自动迭代到第一个字节为 `0` 的位置截取为有效字符串，例如 `GetPlayerName` 即 `player.getName().name`。

该截取方法源自国际化中的[实用函数](./i18n.md#实用函数)，遇到类似场景时不必重复造轮子。

## 颜色转换

`Infernus` 底层的颜色转换基于 [Peter Szombati 的 samp-node-lib](https://github.com/peterszombati/samp-node-lib)，让您在开发中可以使用更语义化的颜色值，如 `#fff`、`#ffffff`、`(r, g, b)`、`(r, g, b, a)`。

如果在某些场景（如文本绘制）中使用颜色值后未达到预期，反而渲染成黑色或白色，可以尝试换一种格式，如将 `#fff` 改为 `(255, 255, 255, 255)`，或使用原生开发的数值格式。

## 玩家属性

- `getFps()`：获取玩家当前帧率，每 1 秒仅能获取 1 次，可能为 `0`。
- `lastUpdateTick`：玩家最后一次更新的时间戳。
- `lastUpdateFpsTick`：玩家最后一次更新的 FPS 时间戳。
- `lastDrunkLevel`：玩家最后一次上报的醉酒级别。

## 暂停事件

内置了玩家暂停 `onPause` 和恢复 `onResume` 的回调事件。该功能不一定适用于 SA 重制版或安卓版，它通过计时器和 `onUpdate` 判定，存在一定误差。

:::tip
玩家网络状况不佳时也可能误触发该回调。
:::
