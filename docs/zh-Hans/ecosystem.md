# 生态系统

`@infernus/*` 生态系统的本质，是为了在 Infernus 环境中使用曾经那些 Pawn include 库的能力。通过将 Pawn 层的能力封装为 Node.js 包，你可以在 TypeScript/JavaScript 中直接调用原本需要 Pawn 编写的功能。

`@infernus/*` 提供了以下生态包：

| 包名 | 说明 |
| --- | --- |
| `@infernus/core` | 核心库，用于编写 Open Multiplayer 脚本 |
| `@infernus/cef` | 对 omp-cef 组件的封装 |
| `@infernus/colandreas` | 对 ColAndreas 插件的封装 |
| `@infernus/create-app` | 命令行脚手架，快速创建项目 |
| `@infernus/distance` | 对 distance 库的封装 |
| `@infernus/drift-detection` | 对 driftDetection 库的封装 |
| `@infernus/e-selection` | 对 eSelection 库的封装 |
| `@infernus/fcnpc` | 对 FCNPC 插件的封装 |
| `@infernus/fs` | 内置 filterscript 合集 |
| `@infernus/gps` | 对 GPS 插件的封装 |
| `@infernus/map-loader` | 用于 obj 转换、解析和加载的工具 |
| `@infernus/mapandreas` | 纯 TypeScript 高度图查询实现，无需原生插件 |
| `@infernus/nex-ac` | 对 nex-ac 库的封装 |
| `@infernus/progress` | 基于 `LD_SPAC:white` 的进度条 |
| `@infernus/qrcode` | 二维码生成 |
| `@infernus/query` | 用于发送 SA-MP 查询的简易 API |
| `@infernus/raknet` | 对 open.mp raknet 插件的封装 |
| `@infernus/rec` | `.rec` 与 `.json` 文件格式互转 |
| `@infernus/samp-voice` | 对 SA-MP voice 库的封装 |
| `@infernus/shared` | 共享工具和类型（内部包） |
| `@infernus/streamer` | 对 SA-MP streamer 插件 (v2.9.6) 的封装（**私有包**） |
| `@infernus/types` | 精简的 samp-node API 类型定义（内部包） |
| `@infernus/weapon-config` | 对 weapon-config 库的封装 |

## 设计理念

### 避免使用 Filterscript

我们不鼓励在使用 Infernus 时使用任何 Filterscript。Pawn 的 Filterscript 本质上是独立于 GameMode 运行的脚本模块，但在 Infernus 环境下，这种做法会引入不必要的复杂度。

我们的建议：

- 将原本的 Filterscript 用 Infernus 重写，并直接集成到你的 GameMode 中。
- 不要在 Pawn 中编写 GameMode 逻辑（除了必要的 polyfill 代码）。
- 总之，**一切功能都通过 Infernus 实现**。

这样可以让所有逻辑统一在 Node.js/TypeScript 环境中管理，避免 Pawn 和 Node.js 之间的割裂。

## 兼容性

### 无 Polyfill 版本

由于插件、`samp-node`、`sampgdk` 或 `omp` 的底层实现限制，某些插件的 native 函数无法直接被 `samp-node` 调用。例如，`raknet` 的 native 函数之前需要通过 `polyfill` 间接调用。

从 **v0.14.0+** 起，`@infernus/raknet` 提供了**无 polyfill 版本**，不再需要 `#include <polyfill/raknet>` 指令。配合我们维护的 [dockfries/Pawn.RakNet](https://github.com/dockfries/Pawn.RakNet) 即可使用。

> **⚠️ 无 polyfill 版本为实验性**，可能存在 Bug。如果您依赖旧的 polyfill 方案，请继续使用 `@infernus/raknet@0.13.x` 及原版 Pawn.RakNet。

### 64 位实验性支持

`samp-node` 现已提供 64 位构建，仅供实验性使用。需要搭配 64 位的 OMP 服务端以及对应的 64 位插件使用：

- [streamer](https://github.com/dockfries/samp-streamer-plugin/releases/tag/v2.9.6)
- [gps](https://github.com/dockfries/samp-gps-plugin/releases/tag/v1.4.1)
- [raknet](https://github.com/dockfries/Pawn.RakNet/releases/tag/1.6.1-omp-rc1)
- [ColAndreas](https://github.com/dockfries/ColAndreas/releases/tag/v1.6.0)

> 请注意，`@infernus/create-app` 目前暂不支持下载这些 64 位依赖。

使用 64 位的 raknet 插件时，可能需要手动重新编译 polyfill 以匹配 Pawn.RakNet 的版本，避免版本不匹配的警告。

从 32 位模板迁移到 64 位（或反之）时，需移除 `.npmrc` 中的 `arch=ia32` 和 `target_arch=ia32`（切回时则添加）。注意，在 pnpm >= 11 中，`.npmrc` 的作用方式已被精简，这两项属性可能不再生效，具体请查阅 pnpm 升级迁移文档。
