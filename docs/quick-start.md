# Quick Start

## Create application

In this section, we will describe how to build the `Infernus` application locally.

It is strongly recommended that you use [infernus-starter](https://github.com/dockfries/infernus-starter) template to create a very simple template example based on `TypeScript`.

You need to have a foundation for native `pawn` development and `node`.

### CLI

The project uses `pnpm` to manage dependencies, so you need to install [pnpm](https://pnpm.io/).

You can easily create a project according to the command line prompts.

```sh
pnpm dlx @infernus/create-app
```

::: tip
Because the CLI internally calls the `github HTTP API`, if your network environment is poor, you may not be able to create the app successfully. In this case, you can refer to [Manual](#manual).

[Click here to learn about API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

#### Example

```sh
#Install the CLI tool globally
pnpm add @infernus/create-app -g

# Create a project
infernus create <appName>

# Install one or more dependencies, 
# all operations' dependencies can be followed by a version number, 
# it is similar to the syntax of npm packages.
infernus add openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6
# Server environment installation dependencies (not handling inc files)
infernus add samp-incognito/samp-streamer-plugin@^2.9.6 -p

# Install all existing dependencies, similar to sampctl ensure
infernus install

# Uninstall one or more dependencies
infernus remove openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6

# Update a dependency (update global cache and apply to current directory)
infernus update openmultiplayer/open.mp

# Update a dependency to a specific version
infernus update openmultiplayer/open.mp@^1.2.0.2670

# Clear the lowest matching version of a single global dependency
infernus cache clean samp-incognito/samp-streamer-plugin@^2.9.6
# Clear all versions of a single global dependency
infernus cache clean samp-incognito/samp-streamer-plugin
# Clear all global cache dependencies
infernus cache clean -a

# Set a GitHub token to resolve API rate limit issues (on-demand).
# Note: environment variable gh_token will take precedence over the global config.
infernus config gh_token <your_github_token>

# Display global configuration information
infernus config -l

# Delete a global configuration
infernus config gh_token
```

#### Feature

1. It only handles the most basic plugin dependency management, and does not manage pure `include` library management.
2. Installed packages are cached in `~/infernus/dependencies`, and subsequent installations of the same version are copied directly instead of downloaded.
3. The configuration file is located at `~/infernus/config.json`, and currently only has a `gh_token` configuration item to solve the frequency limit of the `github api`.

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
