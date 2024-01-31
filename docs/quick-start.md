# Quick Start

## Create application

In this section, we will describe how to build the `Infernus` application locally.

It is strongly recommended that you use [infernus-starter](https://github.com/dockfries/infernus-starter) template to create a very simple template example based on `TypeScript`.

You need to have a foundation for native `pawn` development and `node`.

### CLI

The project uses `pnpm` to manage dependencies, so you need to install [pnpm](https://pnpm.io/).

You can easily create a project according to the command line prompts.

```sh
pnpm create @infernus/app
```

::: tip
Because the `github https api` is called inside the scaffolding, if your network environment is not good, you may not be able to create it smoothly. In this case, you can refer to [Manual](#manual).
:::

### Manual

```sh
# Clone the repository through https protocol.
git clone https://github.com/dockfries/infernus-starter
# or use ssh protocol.
git clone git@github.com:dockfries/infernus-starter.git
# you can also download the repository directly from the github page.

# enter the project root directory.
cd infernus-starter

# modify the rcon password in config.json.
vim config.json # you don't necessarily need to use vim, any editor is fine.

# "rcon": {
#   "password": "changeme" # change changeme to your own password.
#}
```

:::warning
**The repository deleted the necessary files**, to ensure that you always use the latest version dependencies and reduce the repository file size, which means you need to complete the files manually
:::

The `so/dll` depends on the environment in which you want to run the server, and you need to select the corresponding version to download according to the environment. Only `so` is needed under `linux`, and only `dll` is needed under `windows`.

1. Download [omp game server](https://github.com/openmultiplayer/open.mp/releases), and later extract the `omp-server[.exe]` and `components` folders to the project root directory.

2. Download [samp-node plugin](https://github.com/AmyrAhmady/samp-node/releases), and later extract the `libnode.so/dll` in the root directory of the project, and `plugins` in the `plugins` folder (if the root directory does not have a `plugins` folder, you need to create it manually).

3. Download [streamer plugin](https://github.com/samp-incognito/samp-streamer-plugin/releases), and later put `streamer.so/dll` in the `plugins` folder.

4. **(If you needs to use raknet)** download [raknet plugin](https://github.com/katursis/Pawn.RakNet/releases), and later put all files except the `.inc` suffix into the `components` folder.
   1. replace `gamemodes/polyfill_raknet.amx` with `gamemodes/polyfill.amx`, **or** modify the `pawn.main_scripts` section of the root file `config.json`.

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
```

### Install dependency & dev

```sh
# installation dependency
pnpm install

# run development mode commands (start compilation, listen for changes and restart automatically)
pnpm dev
```

### Build

```sh
# build for production environment
pnpm build

# run the server
pnpm serve
```
