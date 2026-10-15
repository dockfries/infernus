# 快速上手

## 创建一个 Infernus 应用

本节将介绍如何在本地搭建 `Infernus` 应用。

强烈建议使用 [infernus-starter](https://github.com/dockfries/infernus-starter) 模板来创建，这是一个基于 `TypeScript` 的简洁模板示例。

您需要对原生 `pawn` 开发和 `node` 有一定的基础。

### 脚手架

项目使用 `pnpm` 管理依赖，请先安装 [pnpm](https://pnpm.io/)。

根据命令行的提示，您可以轻松创建项目。

```sh
pnpm dlx @infernus/cli@latest create
```

::: tip
由于脚手架内部调用 GitHub HTTP API，如果网络条件不佳，可能无法顺利创建，此时请参考[手动创建](#手动)。

[了解 API 频率限制](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

`@infernus/cli` 是一个类似于 `sampctl` 的工具，通过解析 `pawn.json` 规则管理包依赖，方便您管理插件或 `open.mp` 基座依赖。

#### 缓存

:::warning
`pnpm dlx` 产生的缓存较为持久，建议定期手动清理 `dlx` 缓存，否则即使指定 `@latest`，也可能使用的是过时版本。
:::

- Windows：`C:\Users\%USERNAME%\AppData\Local\pnpm-cache\dlx`
- Linux：`~/.cache/pnpm/dlx`

[查看缓存目录](https://pnpm.io/settings#cachedir)

#### 示例

```sh
# 全局安装 CLI 工具
pnpm add @infernus/cli -g
# 已全局安装时更新
pnpm update @infernus/cli -g

# 创建项目
infernus create <appName>

# 安装一个或多个依赖，可指定版本号，语法类似 npm 包
infernus add openmultiplayer/open.mp dockfries/samp-streamer-plugin@^2.9.6
# 安装组件依赖
infernus add dockfries/Pawn.RakNet@^1.7.0-omp --component
# 生产模式安装（不复制 inc 文件）
infernus add dockfries/samp-streamer-plugin@^2.9.6 -p

# 安装所有现有依赖（类似 sampctl ensure）
infernus install

# 同上，生产模式（不复制 inc 文件）
infernus install -p

# 卸载一个或多个依赖
infernus remove openmultiplayer/open.mp dockfries/samp-streamer-plugin
infernus remove dockfries/Pawn.RakNet

# 更新依赖（更新全局缓存并应用到当前目录）
infernus update openmultiplayer/open.mp

# 更新到指定版本
infernus update openmultiplayer/open.mp@^1.5.8

# 查看某个依赖有哪些可用版本（哪些满足当前声明的范围、哪个已安装）
infernus versions
infernus versions openmultiplayer/open.mp --all

# 预演一次安装或更新会做什么：只解析版本，不下载、不写入任何文件
infernus update openmultiplayer/open.mp@^1.6.7 --dry-run --verbose

# 排查版本解析问题时打印每一步的缓存判定与 GitHub 请求
infernus update openmultiplayer/open.mp@^1.6.7 --verbose

# 清理全局单个依赖的最低匹配版本
infernus cache clean dockfries/samp-streamer-plugin@^2.9.6
# 清理全局单个依赖的所有版本
infernus cache clean dockfries/samp-streamer-plugin
# 清理所有全局缓存
infernus cache clean -a

# 设置 GitHub Token 以解决 API 频率限制（按需）
# 注：环境变量 gh_token 优先于全局配置
infernus config gh_token <your_github_token>

# 显示全局配置
infernus config -l

# 删除某个全局配置
infernus config gh_token
```

> [!WARNING]
> 在 Windows 的 `cmd.exe` 中，`^` 是转义字符，`@^1.5.8` 会被 shell 吃掉变成 `@1.5.8`。
> 请务必用引号包裹版本号，否则你会得到一条与"版本不存在"无关的困惑报错：
> `infernus update "openmultiplayer/open.mp@^1.5.8"`

#### 版本号怎么写

- `infernus.json` 里写的是 **npm 风格的 semver 范围**（`*`、`^1.5.8`、`~1.6.7`），
  也可以直接写一个具体的 release tag 来锁定单个构建。
- **同一个文件里混着 `2.6.1` 和 `^2.9.6` 是正常的**：CLI 从不改写你写的版本号。
  `2.6.1` 是**精确锁定**，`update` 会一直停在这个 release；
  `^2.9.6` 是**范围**，`update` 会前进到该范围内最新的 release。
  想让它跟着升级，就把范围写上：`infernus add dockfries/samp-node@^2.6.1`。
  不确定某个依赖现在是什么状态，用 `infernus versions` 看：它会标出哪些版本满足声明的范围。
- `infernus-lock.json` 里记的是 **GitHub release 的真实 tag**，例如 `v1.6.7.3218`。
  open.mp 的 tag 是四段式（`v主.次.补.构建号`），所以 `1.6.7` 并不是一个真实 tag；
  CLI 会把它当作范围回退匹配到最新的 `v1.6.7.3218`，`--verbose` 会显示这个回退过程。
- 升级 open.mp 时，新版本自带的文件会替换旧构建留下的文件；
  被项目改动过的文件会被保留并列出，`config.json`、`bans.json`、`gamemodes/` 从不覆盖。
  项目文件会被重写时会额外留一份 `config.json.<时间戳>.bak`。

#### JSON Schema

`infernus.json` 与 `infernus-lock.json` 都有 schema 校验与补全，在文件顶部加一行即可：

```json
{
  "$schema": "https://raw.githubusercontent.com/dockfries/infernus/main/packages/cli/schemas/infernus.schema.json",
  "dependencies": {
    "openmultiplayer/open.mp": "^1.6.7"
  }
}
```

#### 特性

1. 只处理基础的插件依赖管理，不负责纯 `include` 库的管理。
2. 安装的包缓存在 `~/infernus/dependencies` 下，相同版本后续直接复制，无需重复下载。
3. 配置文件位于 `~/infernus/config.json`，目前仅有一个 `gh_token` 配置项，用于解决 GitHub API 频率限制。

### 手动

```sh
# 通过 HTTPS 克隆仓库
git clone https://github.com/dockfries/infernus-starter.git
# 或使用 SSH
git clone git@github.com:dockfries/infernus-starter.git

# 如需 raknet，克隆 raknet 分支
# git clone https://github.com/dockfries/infernus-starter.git -b raknet
# 或使用 SSH
# git clone git@github.com:dockfries/infernus-starter.git -b raknet

# 也可直接从 GitHub 页面下载仓库

# 进入项目根目录
cd infernus-starter

# 修改 config.json 中的 rcon 密码
vim config.json # 您不一定要用 vim，任意编辑器均可

# "rcon": {
#   "password": "changeme" # 将 changeme 换成您自己的密码
# }
```

:::warning
**仓库已删除必要文件**，以确保您始终使用最新版本依赖并减小仓库体积。这意味着您需要手动补全文件。
:::

`so/dll` 取决于服务器的运行环境，请根据环境选择对应版本下载。Linux 只需要 `so`，Windows 只需要 `dll`。

1. 下载 [omp 游戏服务器](https://github.com/openmultiplayer/open.mp/releases)，将 `omp-server[.exe]` 和 `components` 文件夹解压到项目根目录。

2. 下载 [samp-node 插件](https://github.com/dockfries/samp-node/releases)，将 `libnode.so/dll` 放入项目根目录，`samp-node.so/dll` 放入 `plugins` 文件夹（如不存在则手动创建）。

3. 下载 [streamer 插件](https://github.com/dockfries/samp-streamer-plugin/releases)，将 `streamer.so/dll` 放入 `plugins` 文件夹。

4. **（如需使用 raknet）** 下载 [raknet 组件](https://github.com/dockfries/Pawn.RakNet/releases)，将除 `.inc` 后缀外的所有文件放入 `components` 文件夹。
   1. 将 `gamemodes/polyfill_raknet.amx` 替换为 `gamemodes/polyfill.amx`，**或**修改 `config.json` 中的 `pawn.main_scripts` 部分。

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
```

### 安装依赖并运行

> [!TIP]
> 若使用 32 位 samp-node，执行 `pnpm install` 前需设置相应的环境变量，
> 详见[生态系统 → 64 位实验性支持](/zh-Hans/ecosystem#_64-位实验性支持)。

```sh
# 安装依赖
pnpm install

# 运行开发模式（编译、监听变更、自动重启）
pnpm dev
```

### 构建

```sh
# 为生产环境构建
pnpm build

# 运行服务器
pnpm serve
```
