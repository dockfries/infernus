# ¿Qué es Infernus?

El nombre `Infernus` proviene del vehículo con el ID `411` en el juego (concretamente en `GTA: San Andreas`).

`Infernus` es una biblioteca construida sobre `samp-node`, que permite llamar al `SDK` del juego desde la capa de `JavaScript`.

## Limitaciones

::: danger
Sí, es importante entender las limitaciones antes de comenzar.

Varias limitaciones impactan significativamente la experiencia de desarrollo. **Se recomienda abordar el desarrollo del ecosistema `samp-node` con una mentalidad experimental.**

**En general, el ecosistema es actualmente inestable debido a varios factores.**
:::

### Ecosistema de SAMP-NODE

Existing libraries developed in `Pawn`, such as `fcnpc`, `colandreas`, `nexac`, and other well-known libraries, may present two situations if your project depends on them: **nobody maintenance or incompatible**.

Since `samp-node` plugin development is based on `samp` and not `omp`, certain plugin ecosystems are not compatible. For example, accessing certain plugins' native functions, such as `raknet`, is not possible.

This greatly limits the development of `samp` plugins using the `node.js` ecosystem. It requires joint efforts from samp-node's authors and the community to address this issue.

However, `omp's` focus is primarily on building `omp` itself rather than third-party libraries.

### Bloqueo de terminal

Due to poor compatibility between the underlying `samp-node` and certain asynchronous `node.js` libraries, there may be occasional terminal blocking.

For example, when using orm libraries like `typeorm/sequelize`, it can cause terminal blocking and the server becomes unresponsive until you manually press enter in the terminal.

Therefore, it is recommended to adopt a distributed development approach, even though it may sound cumbersome.

One approach is to create another separate `node.js` project for database operations, such as using `NestJS` to build an `API` specifically for `CRUD` operations. The game server can then access the database logic through `HTTP` requests, or you can explore more advanced communication methods like `RPC` or `sockets`.

The benefit of this approach is that the game server only handles game logic, while the database logic is offloaded to another project. Additionally, you can develop an administration system that shares the same `API` as the game server.

## Composición

En general, sólo hay que centrarse en la capa superior, que es la de desarrollo de aplicaciones.

`Infernus` trabaja principalmente con la segunda y tercera capa, dependiendo de `samp-node` y del servidor de juego `omp`.

Si no está seguro de cómo iniciar un proyecto, consulte el [Inicio rápido](./quick-start).

| /   | Capa                    | Descripción                                             |
| --- | ----------------------- | ------------------------------------------------------- |
| 1   | Aplicación              | Modo de juego, como free-roam o role-play               |
| 2   | Envoltorios de clase    | Funcionalidad envuelta en clases                        |
| 3   | Envoltorios funcionales | Envoltorios para librerías como `samp/omp/streamer`     |
| 4   | `SAMP NODE`             | Puente hacia el `SDK` subyacente                        |
| 5   | `OMP` Servidor de juego | Servidor de juego subyacente                            |

## ¿Por qué desarrollar?

Para los principiantes en programación o los desarrolladores frontales (front-end developers), iniciarse en el desarrollo de scripts de juegos utilizando «Pawn», un lenguaje procedimental similar a «C», puede resultar complicado. Además, realizar operaciones básicas de bajo nivel en `Pawn`, como la concatenación de cadenas, la eliminación y la manipulación de matrices, es más engorroso en comparación con `JavaScript` orientado a objetos.

Además, implementar funcionalidades asíncronas es bastante difícil dentro del ecosistema del lenguaje `Pawn`. La internacionalización se consigue normalmente utilizando la codificación `UTF-8`, pero como el lanzamiento de `sa` fue bastante temprano, no utilizó `UTF-8` para la internacionalización. En su lugar, utilizaba diferentes conjuntos de caracteres basados en la norma `ANSI` del sistema Windows, como `ISO-8859-1` en los países occidentales y la codificación `GBK` en China.

El desarrollo de scripts localizados en `Pawn` a menudo requiere configurar la codificación del archivo para que coincida con el conjunto de caracteres del idioma localizado del sistema Windows. Esto puede dar lugar a problemas de codificación imprevistos, como el almacenamiento de datos `GBK` en una base de datos `UTF-8`, que puede dar lugar a datos confusos si no se manejan correctamente.

Al utilizar `JavaScript` para el desarrollo, podemos aprovechar la potencia del ecosistema `Node.js`, incluyendo librerías para el procesamiento de fecha y hora (por ejemplo, `dayjs`), bases de datos (por ejemplo, `MySQL`, `Redis`, `MongoDB`), y programación asíncrona (por ejemplo, `Promises, Async/await`). Esto nos permite sustituir las librerías del ecosistema `Pawn` por otras equivalentes del ecosistema `Node.js`.
