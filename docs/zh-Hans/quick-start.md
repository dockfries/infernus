# 快速上手

## 创建一个 Infernus 应用

本节将介绍如何在本地搭建 `Infernus` 应用。

强烈建议使用 [infernus-starter](https://github.com/dockfries/infernus-starter) 模板来创建，这是一个基于 `TypeScript` 的简洁模板示例。

您需要对原生 `pawn` 开发和 `node` 有一定的基础。

### 脚手架

项目使用 `pnpm` 管理依赖，请先安装 [pnpm](https://pnpm.io/)。

根据命令行的提示，您可以轻松创建项目。

```sh
pnpm dlx @infernus/create-app@latest create
```

::: tip
由于脚手架内部调用 GitHub HTTP API，如果网络条件不佳，可能无法顺利创建，此时请参考[手动创建](#手动)。

[了解 API 频率限制](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

`@infernus/create-app` 是一个类似于 `sampctl` 的工具，通过解析 `pawn.json` 规则管理包依赖，方便您管理插件或 `open.mp` 基座依赖。

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
pnpm add @infernus/create-app -g
# 已全局安装时更新
pnpm update @infernus/create-app -g

# 创建项目
infernus create <appName>

# 安装一个或多个依赖，可指定版本号，语法类似 npm 包
infernus add openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6
# 安装组件依赖
infernus add katursis/Pawn.RakNet@^1.6.0-omp --component
# 生产模式安装（不复制 inc 文件）
infernus add samp-incognito/samp-streamer-plugin@^2.9.6 -p

# 安装所有现有依赖（类似 sampctl ensure）
infernus install

# 同上，生产模式（不复制 inc 文件）
infernus install -p

# 卸载一个或多个依赖
infernus remove openmultiplayer/open.mp samp-incognito/samp-streamer-plugin
infernus remove katursis/Pawn.RakNet

# 更新依赖（更新全局缓存并应用到当前目录）
infernus update openmultiplayer/open.mp

# 更新到指定版本
infernus update openmultiplayer/open.mp@^1.2.0.2670

# 清理全局单个依赖的最低匹配版本
infernus cache clean samp-incognito/samp-streamer-plugin@^2.9.6
# 清理全局单个依赖的所有版本
infernus cache clean samp-incognito/samp-streamer-plugin
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

3. 下载 [streamer 插件](https://github.com/samp-incognito/samp-streamer-plugin/releases)，将 `streamer.so/dll` 放入 `plugins` 文件夹。

4. **（如需使用 raknet）** 下载 [raknet 插件](https://github.com/katursis/Pawn.RakNet/releases)，将除 `.inc` 后缀外的所有文件放入 `components` 文件夹。
   1. 将 `gamemodes/polyfill_raknet.amx` 替换为 `gamemodes/polyfill.amx`，**或**修改 `config.json` 中的 `pawn.main_scripts` 部分。

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
```

### 安装依赖并运行

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
