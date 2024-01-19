# 差异

差异指的是 `Infernus` 和 `pwn` 之间底层的一些差异。

- 用 `Streamer` 实现的`Object`，`GangZone` 来替代默认的具有上限的 `CreateObject` 等函数，这意味着你无法使用原来的函数，除非你自己实现。
- 弃用了可以被 `JavaScript` 内置函数或第三方库实现的函数，比如 `Math.abs`, `strcmp`，`sqlite db` 操作。
