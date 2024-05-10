# What is Infernus

The name `Infernus` comes from the vehicle with the ID `411` in the game (specifically in `san andreas`).

`Infernus` is a library built on top of `samp-node`, which allows calling the game's `SDK` from the `JavaScript` layer.

## Limitations

::: danger
Yes, it's important to understand the limitations before getting started.

Several limitations significantly impact the development experience. **It is recommended to approach `samp-node` ecosystem development with an experimental mindset.**

**Overall, the ecosystem is currently unstable due to various factors.**
:::

### Samp Node Ecosystem

Existing libraries developed in `Pawn`, such as `fcnpc`, `colandreas`, `nexac`, and other well-known libraries, may present two situations if your project depends on them: **nobody maintenance or incompatible**.

Since `samp-node` plugin development is based on `samp` and not `omp`, certain plugin ecosystems are not compatible. For example, accessing certain plugins' native functions, such as `raknet`, is not possible.

This greatly limits the development of `samp` plugins using the `node.js` ecosystem. It requires joint efforts from samp-node's authors and the community to address this issue.

However, `omp's` focus is primarily on building `omp` itself rather than third-party libraries.

### Terminal Blocking

Due to poor compatibility between the underlying `samp-node` and certain asynchronous `node.js` libraries, there may be occasional terminal blocking.

For example, when using orm libraries like `typeorm/sequelize`, it can cause terminal blocking and the server becomes unresponsive until you manually press enter in the terminal.

Therefore, it is recommended to adopt a distributed development approach, even though it may sound cumbersome.

One approach is to create another separate `node.js` project for database operations, such as using `NestJS` to build an `API` specifically for `CRUD` operations. The game server can then access the database logic through `HTTP` requests, or you can explore more advanced communication methods like `RPC` or `sockets`.

The benefit of this approach is that the game server only handles game logic, while the database logic is offloaded to another project. Additionally, you can develop an administration system that shares the same `API` as the game server.

## Composition

In general, you only need to focus on the topmost layer, which is the application development layer.

`Infernus` primarily works with the second and third layers, depending on `samp-node` and `omp` game server.

If you are unsure how to start a project, please refer to the [Quick Start](./quick-start).

| /   | Layer               | Description                                     |
| --- | ------------------- | ----------------------------------------------- |
| 1   | Application         | GameMode, such as free-roam or role-play        |
| 2   | Class Wrappers      | Functionality wrapped in classes                |
| 3   | Functional Wrappers | Wrappers for libraries like `samp/omp/streamer` |
| 4   | `Samp Node`         | Bridge to the underlying `SDK`                  |
| 5   | `Omp` Game Server   | Underlying game server                          |

## Why Develop

For beginners in programming or frontend developers, getting started with game script development using `Pawn`, a procedural language similar to `C`, can be challenging. Additionally, performing basic low-level operations in `Pawn`, such as string concatenation, deletion, and array manipulation, is more cumbersome compared to object-oriented `JavaScript`.

Furthermore, implementing asynchronous functionality is quite difficult within the `Pawn` language ecosystem. Internationalization is typically achieved using `UTF-8` encoding, but since the release of `sa` was quite early, it did not utilize `UTF-8` for internationalization. Instead, it relied on different charsets based on the `ANSI` of the Windows system, such as `ISO-8859-1` in Western countries and `GBK` encoding in China.

Developing localized scripts in `Pawn` often requires setting the file encoding to match the localized Windows system language charset. This can lead to unforeseen encoding issues, such as storing `GBK` data in a `UTF-8` database, which may result in garbled data if not handled properly.

By using `JavaScript` for development, we can leverage the power of the `Node.js` ecosystem, including libraries for date and time processing (e.g., `dayjs`), databases (e.g., `MySQL`, `Redis`, `MongoDB`), and asynchronous programming (e.g., `Promises, Async/await`). This allows us to replace `Pawn` ecosystem libraries with equivalent ones from the `Node.js` ecosystem.
