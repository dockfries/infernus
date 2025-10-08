# What is Infernus

The name `Infernus` comes from the vehicle with the ID `411` in the game (specifically in `san andreas`).

`Infernus` is a library built on top of `samp-node`, which allows calling the game's `SDK` from the `JavaScript` layer.

> [!WARNING]
> Infernus project has entered maintenance mode and will be gradually archived. Future ecosystem development will be led by the omp-node community, and we warmly welcome interested developers to join and contribute.

## 🚧 Work in Progress

- [omp-node](https://github.com/omp-node) is currently in active development, it will replace `Infernus` in the future.
- If you want to try out `omp-node` or prefer the native syntax without too much wrapping, check out [@open.mp/node](https://github.com/omp-node/core).

### Comparison

| /              | Infernus + samp-node                                                               | omp-node                     |
| -------------- | ---------------------------------------------------------------------------------- | ---------------------------- |
| Runtime        | Windows/Linux: Node.js 22.17+                                                      | Windows/Linux: Node.js 18+   |
| Module System  | CommonJS/ESModule(experimental)                                                    | ESModule                     |
| Architecture   | x86 only                                                                           | x86/x64                      |
| Implementation | Via sampgdk→fakeamx→native calls                                                   | Direct omp-gdk/omp-sdk calls |
| Performance    | Slow                                                                               | Fast                         |
| Compatibility  | Third-party plugins via polyfill layer                                             | Requires SDK adaptation      |
| Philosophy     | 1. Full Infernus rewrite recommended (avoid Pawn)<br>2. Mandatory Steamer adoption | See official documentation   |

## Limitations

::: danger
Yes, it's important to understand the limitations before getting started.

Several limitations significantly impact the development experience. **It is recommended to approach `samp-node` ecosystem development with an experimental mindset.**

**Overall, the ecosystem is currently unstable due to various factors.**
:::

### Ecosystem

::: info
[Click to view implemented ecosystem packages](https://github.com/dockfries/infernus/tree/main/packages). Note that results may differ from original libraries and some bugs are expected.
:::

Existing libraries developed in `Pawn`, may present two situations if your project depends on them: **nobody maintenance or incompatible**.

Since `samp-node` plugin development is based on `samp` and not `omp`, certain plugin ecosystems are not compatible. For example, accessing certain plugins' native functions, such as `raknet`, is not possible.

This greatly limits the development of `samp` plugins using the `node.js` ecosystem. It requires joint efforts from the community to address this issue.

### Bindings Support

Unfortunately, this project is based on a 32-bit embedded `node.js`, and the support for `bindings` is unstable - you may encounter errors.

Before using this project, please note the version requirements:

1. **Node Version Matching**
   - Make sure your Node major version matches samp-node's requirement
   - e.g. if samp-node needs 22.17.0, only use 22.x versions
   - Incompatible versions like 18.x, 20.x, 24.x won't work

2. For existing projects:
   - First verify your Node version
   - Delete the node_modules folder
   - Run `pnpm install` again

> Environment support: better-sqlite3 module has been tested on Windows

Perhaps this will be resolved in the future with a 64-bit `omp-node`.

### Terminal Blocking

> [!IMPORTANT]
> This issue has been fixed via [monkeyPatch](https://github.com/dockfries/infernus-starter/blob/main/src/polyfill.js) as the current solution.

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

## Why Development

For programming beginners or front-end developers, using a procedural language like Pawn (which resembles C) for game scripting presents a significant learning curve. Compared to modern object-oriented languages like JavaScript, Pawn's foundational APIs are more cumbersome—elementary operations such as string concatenation or array manipulation require manual implementation, increasing development complexity.

Furthermore, the Pawn language ecosystem exhibits notable limitations:

1.  **Weak Asynchronous Support**: It natively lacks modern asynchronous programming paradigms like `Promise/Async` found in JavaScript.
2.  **Internationalization Challenges**: Since the Pawn compiler (SA-MP) was developed earlier, its character encoding relies on the operating system's locale settings:
    - Western systems typically use `ISO-8859-1` encoding;
    - Chinese systems rely on `GBK` encoding;
    - This creates incompatibility with the universal `UTF-8` standard.

This strong dependency on specific encodings can lead to unforeseen compatibility issues. For instance, directly storing `GBK` data into a `UTF-8` database without proper conversion will result in garbled text.

In contrast, a JavaScript-based approach leverages the full advantages of the Node.js ecosystem:

- **Rich Toolchain**: Access to robust libraries for date handling (e.g., Day.js), database drivers (e.g., MySQL, Redis, MongoDB), and more.
- **Standardized Asynchrony**: Native support for `Promise/Async` for managing asynchronous operations.
- **Encoding Uniformity**: End-to-end use of `UTF-8` encoding, effectively avoiding internationalization compatibility problems.

By transitioning to the JavaScript technology stack, developers can significantly reduce the learning barrier while gaining more robust internationalization support and access to modern development tools.
