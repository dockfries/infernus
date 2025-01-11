# 快速上手

## 创建一个 Infernus 应用

在本节中，我们将介绍如何在本地搭建 `Infernus` 应用。

强烈建议您使用 [infernus-starter](https://github.com/dockfries/infernus-starter) 模板来创建，这是一个非常简单的模板示例，基于 `TypeScript` 开发。

您需要对原生 `pawn` 开发和 `node` 有一定的基础。

### 脚手架

项目采用了 `pnpm` 来管理依赖，所以您需要安装[pnpm](https://pnpm.io/)。

根据命令行的提示您可以轻松的创建一个项目。

```sh
pnpm dlx @infernus/create-app@latest create
```

::: tip
由于脚手架内部调用了 `github https api`，如果您网络环境条件不佳，可能无法顺利创建，此时您可以参考[手动创建](#手动)。

[点此了解API频率限制](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

`@infernus/create-app` 是一个类似于`sampctl`的工具，尝试通过解析`pawn.json`规则来管理包依赖，你可以用它来简单的管理插件或是`open.mp`基座依赖。

#### 示例

```sh
# 全局安装cli工具
pnpm add @infernus/create-app -g

# 创建一个项目
infernus create <appName>

# 安装一个或多个依赖，所有操作的依赖后面都可以跟版本号，它类似于npm包的语法
infernus add openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6
# 安装组件依赖
infernus add katursis/Pawn.RakNet@^1.6.0-omp --component
# 服务端环境安装依赖(不复制inc文件)
infernus add samp-incognito/samp-streamer-plugin@^2.9.6 -p

# 安装现有所有依赖，类似于sampctl ensure
infernus install

# 同上， 但生产模式安装依赖 (不复制inc文件)
infernus install -p

# 卸载一个或多个依赖
infernus remove openmultiplayer/open.mp samp-incognito/samp-streamer-plugin
infernus remove katursis/Pawn.RakNet

# 更新一个依赖（更新全局缓存并应用到当前目录）
infernus update openmultiplayer/open.mp

# 更新一个依赖到指定版本
infernus update openmultiplayer/open.mp@^1.2.0.2670

# 清理全局单个依赖的最低匹配版本
infernus cache clean samp-incognito/samp-streamer-plugin@^2.9.6
# 清理全局单个依赖的所有版本
infernus cache clean samp-incognito/samp-streamer-plugin
# 清理所有全局缓存依赖
infernus cache clean -a

# 设置一个github token来解决api rate limit问题(按需)
# 注：环境变量的gh_token将优先于全局配置
infernus config gh_token <your_github_token>

# 显示全局配置信息
infernus config -l

# 删除一个全局配置
infernus config gh_token
```

#### 特性

1. 只负责最基础的插件依赖管理，不负责纯`include`库的管理。
2. 安装的包缓存在`~/infernus/dependencies`下，相同版本后续安装直接复制而不是下载
3. 配置文件在`~/infernus/config.json`，目前只有一个`gh_token`配置项来解决`github api`频率限制

### 手动

```sh
# 通过https协议克隆仓库
git clone https://github.com/dockfries/infernus-starter.git
# 或是使用ssh协议
git clone git@github.com:dockfries/infernus-starter.git

# 如果你需要raknet，克隆raknet分支
# 通过https协议克隆仓库
# git clone https://github.com/dockfries/infernus-starter.git -b raknet
# 或是使用ssh协议
# git clone git@github.com:dockfries/infernus-starter.git -b raknet

# 您也可以直接在github页面下载仓库

# 进入项目根目录
cd infernus-starter

# 修改config.json中的rcon密码
vim config.json # 您不一定需要用vim，任意编辑器都可以

"rcon": {
  "password": "changeme" # 把changeme换成您自己的密码
}，
```

:::warning
**仓库删除了必要的文件**以确保始终使用最新版本依赖并减小存储库文件大小，这意味着您需要手动补全文件
:::

`so/dll` 取决于您要将服务器运行于什么环境，您需要根据环境来选择对应的版本下载。`linux` 下只需要 `so`，`windows` 下只需要 `dll`。

1. 下载[omp 游戏服务器](https://github.com/openmultiplayer/open.mp/releases)，稍后将`omp-server[.exe]`和`components`文件夹解压到项目根目录。

2. 下载[samp-node 插件](https://github.com/dockfries/samp-node/releases)，稍后将`libnode.so/dll`放入工程根目录，`samp-node.so/dll`放入 `plugins` 文件夹（如果根目录没有 `plugins` 文件夹，需要您手动创建）。

3. 下载[streamer 插件](https://github.com/samp-incognito/samp-streamer-plugin/releases)，稍后将`streamer.so/dll`放入插件文件夹。

4. **(如果您需要用到 raknet)**，下载[raknet 插件](https://github.com/katursis/Pawn.RakNet/releases)，稍后将除了`.inc`后缀的文件都放入`components`文件夹。
   1. 将`gamemodes/polyfill_raknet.amx`替换为`gamemodes/polyfill.amx`，**或者**修改根文件`config.json`中的 `pawn.main_scripts` 部分。

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"]，
  }，
```

### 安装依赖并运行

```sh
# 安装依赖
pnpm install

# 运行开发模式命令 (开始编译、侦听更改并自动重新启动)
pnpm dev
```

### 构建

```sh
# 为生产环境而构建
pnpm build

# 运行服务器
pnpm serve
```
