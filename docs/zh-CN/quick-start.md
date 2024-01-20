# 快速上手

## 创建一个 Infernus 应用

在本节中，我们将介绍如何在本地搭建 `Infernus` 应用。

强烈建议您使用 [infernus-starter](https://github.com/dockfries/infernus-starter) 模板来创建，这是一个非常简单的模板示例，基于 `TypeScript` 开发。

您需要对原生 `pawn` 开发和 `node` 有一定的基础。

:::warning
由于 `raknet` 兼容性问题，此前在介绍中初步提及到，所以强烈不建议您使用。您在后续脚手架选项中也应当忽略它。
:::

### 脚手架

项目采用了 `pnpm` 来管理依赖，所以您需要安装[pnpm](https://pnpm.io/)。

根据命令行的提示您可以轻松的创建一个项目。

```sh
pnpm create @infernus/app
```

::: tip
由于脚手架内部调用了 `github` 的 `https api`，如果您网络环境条件不佳，可能无法顺利创建，此时您可以参考[手动创建](#手动)。
:::

### 手动

```sh
# 通过https协议克隆仓库
git clone https://github.com/dockfries/infernus-starter
# 或是使用ssh协议
git clone git@github.com:dockfries/infernus-starter.git
# 您也可以直接在github页面下载仓库

# 进入项目根目录
cd infernus-starter

# 修改config.json中的rcon密码
vim config.json # 您不一定需要用vim,任意编辑器都可以

"rcon": {
  "password": "changeme" # 把changeme换成您自己的密码
},
```

:::warning
**仓库删除了必要的文件**以确保始终使用最新版本依赖并减小存储库文件大小，这意味着您需要手动补全文件
:::

`so/dll` 取决于您要将服务器运行于什么环境，您需要根据环境来选择对应的版本下载。`linux` 下只需要 `so`，`windows` 下只需要 `dll`。

1. 下载[omp 游戏服务器](https://github.com/openmultiplayer/open.mp/releases)，稍后将`omp-server[.exe]`和`components`文件夹解压到项目根目录。

2. 下载[samp-node 插件](https://github.com/AmyrAhmady/samp-node/releases)，稍后将`libnode.so/dll`放入工程根目录，`samp-node.so/dll`放入 `plugins` 文件夹（如果根目录没有 `plugins` 文件夹，需要您手动创建）。

3. 下载[streamer 插件](https://github.com/samp-incognito/samp-streamer-plugin/releases)，稍后将`streamer.so/dll`放入插件文件夹。

4. **(您应当忽略这一步，除非生态已经稳定)**，下载[raknet 插件](https://github.com/katursis/Pawn.RakNet/releases)，稍后将除了`.inc`后缀的文件都放入`components`文件夹。
   1. 将`gamemodes/polyfill_raknet.amx`替换为`gamemodes/polyfill.amx`，**或者**修改根文件`config.json`中的 `pawn.main_scripts` 部分。

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
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
