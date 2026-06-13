# What is Infernus

The name `Infernus` comes from the vehicle with ID `411` in Grand Theft Auto: San Andreas.

`Infernus` is a library built on top of `samp-node` that lets you call the game's SDK from the JavaScript layer.

> [!WARNING]
> Infernus has entered maintenance mode and will be gradually archived. Future ecosystem development will be led by the omp-node community — interested developers are warmly welcome to join and contribute.

## 🚧 Work in Progress

- [omp-node](https://github.com/omp-node) is under active development and will eventually replace `Infernus`.
- If you'd like to try `omp-node` or prefer native syntax with minimal wrapping, check out [@open.mp/node](https://github.com/omp-node/core).

### Comparison

> All details regarding omp-node are subject to its official documentation. The information below is for reference only.

| /              | Infernus + samp-node                                                               | omp-node                     |
| -------------- | ---------------------------------------------------------------------------------- | ---------------------------- |
| Runtime        | Windows/Linux: Node.js 22.22.3                                                     | Windows/Linux: Node.js 18+   |
| Module System  | CommonJS/ESModule                                                                  | ESModule                     |
| Architecture   | x86 (stable) / x64 (experimental, untested)                                        | x86/x64                      |
| Implementation | Via sampgdk → fakeamx → native calls                                               | Direct omp-gdk/omp-sdk calls |
| Performance    | Slow                                                                               | Fast                         |
| Compatibility  | Third-party plugins via polyfill layer                                             | Requires SDK adaptation      |
| Philosophy     | 1. Full Infernus rewrite recommended (avoid Pawn)<br>2. Mandatory Steamer adoption | See official documentation   |

## Limitations

::: danger
Yes, it's important to understand the limitations before getting started.

Several limitations significantly impact the development experience. **We recommend approaching `samp-node` ecosystem development with an experimental mindset.**

**Overall, the ecosystem is currently unstable due to various factors.**
:::

### 32-bit and Bindings Support

Unfortunately, this project is built on a 32-bit embedded Node.js, and `bindings` support is unstable. You may encounter errors and other issues.

Before using this project, please note the following version requirements:

1. **Node Version Matching**
   - Ensure your Node major version matches the version required by samp-node.
   - For example, if samp-node depends on 22.22.3, only 22.x versions can be used.
   - Incompatible versions such as 18.x, 20.x, 24.x, etc. will not work properly.

2. If the project has already been created:
   - First check whether the Node version meets the requirement.
   - Delete the `node_modules` folder.
   - Re-run `pnpm install`.

> Environment support note: `better-sqlite3` has been tested and verified on Windows.

This issue may be resolved in the future with 64-bit `omp-node`.

The 32-bit Node environment has memory limitations. Consider setting up a separate Node project for database operations on your host machine's 64-bit Node. For example, use `NestJS` to build an API specifically for CRUD operations. The game server can then access it via HTTP requests, or you can try more advanced methods like RPC or sockets.

This way, the server only handles game logic while database logic is handled by a separate project. You can even develop an admin management system that shares the same API.

## Composition

In general, you only need to focus on the topmost layer — the application development layer.

`Infernus` primarily works with the second and third layers, depending on `samp-node` and the `omp` game server.

If you're unsure how to start a project, refer to the [Quick Start](./quick-start).

| /   | Layer               | Description                                     |
| --- | ------------------- | ----------------------------------------------- |
| 1   | Application         | GameMode, such as free-roam or role-play        |
| 2   | Class Wrappers      | Functionality wrapped in classes                |
| 3   | Functional Wrappers | Wrappers for libraries like `samp/omp/streamer` |
| 4   | `Samp Node`         | Bridge to the underlying SDK                    |
| 5   | `Omp` Game Server   | Underlying game server                          |

## Why Develop with Infernus

For beginners, using a procedural language like Pawn (which resembles C) for game scripting presents a steep learning curve. Compared to modern object-oriented languages like JavaScript, Pawn's APIs are far more cumbersome — basic operations such as string concatenation or array manipulation require manual implementation, increasing complexity.

Furthermore, the Pawn language ecosystem has notable limitations:

1.  **Weak Asynchronous Support**: It natively lacks modern asynchronous paradigms like `Promise`/`async` found in JavaScript.
2.  **Internationalization Challenges**: Since the SA-MP Pawn compiler was built before Unicode was standard, its character encoding depends on the operating system locale:
    - Western systems typically use `ISO-8859-1`.
    - Chinese systems rely on `GBK`.
    - This creates incompatibility with the universal `UTF-8` standard.

This heavy reliance on locale-specific encodings can lead to unforeseen compatibility issues. For instance, storing GBK data directly in a UTF-8 database without conversion will produce garbled text.

In contrast, a JavaScript-based approach leverages the full advantages of the Node.js ecosystem:

- **Rich Toolchain**: Mature libraries for date handling (Day.js), database drivers (MySQL, Redis, MongoDB), and more.
- **Standardized Asynchrony**: Native support for `Promise`/`async` for managing asynchronous operations.
- **Consistent Encoding**: End-to-end UTF-8, effectively avoiding internationalization problems.

By transitioning to the JavaScript stack, developers can significantly lower the learning barrier while gaining robust internationalization support and modern development tools.

> [!TIP]
> An **AI agent skill** for `@infernus/*` is available under `skills/omp-infernus-core-use/`, which may assist AI coding agents in understanding the framework's API and conventions when generating code. Note that this skill is **experimental and untested** — use at your own discretion.
