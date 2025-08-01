# Infernus 是什么

`Infernus` 的名字来源于游戏中 `id` 为 `411` 的载具(特指 `sa` 中)。

`Infernus` 是一个基于 `samp-node` 打造的库，用于在 `JavaScript` 层调用游戏的 `sdk`。

> [!WARNING]
> Infernus项目已进入维护阶段并将逐步归档，后续生态建设将由omp-node社区主导推进，诚邀感兴趣的开发者共同参与。

## 🚧 施工中

- [omp-node](https://github.com/omp-node) 目前正在积极开发中，**未来它会取代`Infernus`。**
- 如果您想尝鲜`omp-node`，或更喜欢原生语法而没有过多封装，请关注 [@open.mp/node](https://github.com/omp-node/core)。

### 差异

| /          | Infernus + samp-node                                                            | omp-node                    |
| ---------- | ------------------------------------------------------------------------------- | --------------------------- |
| 运行环境   | Windows/Linux: Node.js 20.19+                                                   | Windows/Linux: Node.js 18+  |
| 模块规范   | CommonJS                                                                        | ESModule                    |
| 架构支持   | 仅x86                                                                           | x64                         |
| 底层实现   | 通过sampgdk→fakeamx→原生调用                                                    | 直接调用omp-gdk/omp-sdk     |
| 执行效率   | 相对较低                                                                        | 性能更优                    |
| 兼容性策略 | 通过兼容层polyfill支持三方插件                                                  | 插件需适配sdk并使用特定版本 |
| 设计理念   | 1. 提倡完全使用Infernus重构，避免Pawn代码开发<br>2. 强制采用Steamer替代原生接口 | 详见官方文档                |

## 缺陷

::: danger
是的，一切的开始前您需要了解缺陷。

一些缺陷极大影响了开发体验，**建议您以实验性的心态**尝试使用 `samp-node` 生态开发。

**总的来说目前生态并不稳定，这是多方面因素导致的。**
:::

### 生态系统

::: info
[点击查看已实现的生态包](https://github.com/dockfries/infernus/tree/main/packages)，不保证和原型库执行结果相同，且一定存在BUG。
:::

原有的以 `pawn` 开发的库，如果您的项目必须依赖这些，那么目前而言会出现两种情况：无人开发或是不兼容。

由于 `samp-node` 的插件开发是基于 `samp` 而不是基于 `omp`，所以对于 `omp` 而言，一些插件生态基本无法兼容，比如无法访问到一些插件的 `native` 函数，比如 `raknet`。

这极大程度上的限制了基于 `node` 的 `samp` 插件生态库开发，这一点需要社区共同努力推进。

### Bindings支持

很遗憾，本项目是基于32位的嵌入式`node.js`，对于`bindings`的支持是不稳定的，你可能会遇到报错等情况。

在使用本项目前，请注意以下版本要求：

1. **Node版本匹配**
   - 请确保你的Node主版本号与samp-node依赖的版本一致
   - 例如samp-node依赖22.17.0，则只能使用22.x版本
   - 不兼容的版本如18.x、20.x、24.x等将无法正常工作

2. 如果项目已经创建：
   - 先检查Node版本是否符合要求
   - 删除node_modules文件夹
   - 重新运行`pnpm install`

> 环境支持说明：目前better-sqlite3模块已在Windows平台测试通过

也许在未来64位的`omp-node`上迎刃而解。

### 终端阻塞

> [!IMPORTANT]重要信息
> 已通过 [monkeyPatch](https://github.com/dockfries/infernus-starter/blob/main/src/polyfill.js) 作为目前的解决方案，修复了此问题。

由于底层的 `samp-node` 对于部分异步的 `node` 生态库的兼容性不佳，会导致概率性的终端阻塞。

比如 `typeorm/sequlize` 等 `orm` 库，如果使用了，它将一直阻塞导致服务器未响应，除非您手动在终端敲下回车。

所以更建议您采取分布式开发，虽然这听起来很蠢……

即另外再建立一个数据库操作的 `node` 项目，比如用 `nestjs` 搭建 `api`，专门用来 `crud`，游戏服务端采用 `http` 请求来访问，或者您可以尝试用一些更高级的 `rpc` 或者 `socket` 来实现通信。

不过这样的好处是服务端只处理游戏逻辑，数据库逻辑交给另外的项目，顺手您还可以再开发一个后台管理系统，这样后台和服务端采用的是同一套 `api`。

## 组成

通常来说您只需要关注第一层，即应用开发层。

`Infernus` 主要做的就是第二层和第三层的工作，依赖于 `samp-node` 和 `omp` 游戏服务器。

如果您不知道怎样开始建立一个项目，请参考 [快速上手](./quick-start)。

| /   | 层               | 介绍                            |
| --- | ---------------- | ------------------------------- |
| 1   | 应用开发层       | 游戏模式，比如自由或角色扮演    |
| 2   | 类包装层         | 通过类来调用函数式包装          |
| 3   | 函数式包装层     | 例如 `samp/omp/streamer` 的包装 |
| 4   | `Samp Node`      | `SDK` 通往底层的桥梁            |
| 5   | `Omp` 游戏服务器 | 底层                            |

## 为何开发

对于编程初学者或者前端程序员而言，用类似于 `C` 语言的面向过程的 `Pawn` 语言开发游戏脚本上手具有一定难度。
同时对于一些基础的底层 `api`，比如字符串拼接，删除，数组的操作，远比面向对象的 `JavaScript` 要麻烦。

另外，在 `Pawn` 语言生态中，想要实现异步是比较困难的。
要实现国际化，一般都使用 `utf8` 编码，而由于 `sa` 发行的年代很早，没有使用 `utf8` 字符集来实现国际化差异。
比如在西方国家使用了 `ISO-8859-1`，在中国使用了 `gbk` 编码，这些都取决于 `windows` 系统语言的 `ansi`。

通常使用 `Pawn` 语言开发本土化脚本，需要把开发的文件编码设置为本土化的 `windows` 系统语言字符集。
这会引发一些不可预料的一些编码 `bug`，比如将`gbk` 的数据存入到 `utf8` 的数据库当中，如果处理不妥当可能会出现乱码数据。

而基于 `JavaScript` 开发，我们就可以拥抱强大的 `node` 生态，比如日期时间处理库 `dayjs`，数据库 `mysql/redis/mongodb`，异步 `Promise/Async` 等等，以 `node` 生态替代 `pawn` 生态的库。
