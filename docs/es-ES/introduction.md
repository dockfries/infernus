# ¿Qué es Infernus?

El nombre `Infernus` proviene del vehículo con el ID `411` en el juego (concretamente en `GTA: San Andreas`).

`Infernus` es una biblioteca construida sobre `samp-node`, que permite llamar al `SDK` del juego desde la capa de `JavaScript`.

> [!WARNING]
> El proyecto Infernus ha entrado en modo de mantenimiento y será archivado gradualmente. El desarrollo futuro del ecosistema estará liderado por la comunidad omp-node, y damos una cálida bienvenida a los desarrolladores interesados a unirse y contribuir.

## 🚧 Trabajo en Curso

- [omp-node](https://github.com/omp-node) está actualmente en desarrollo activo, reemplazará a `Infernus` en el futuro.
- si quiere probar `omp-node` o prefiere la sintaxis nativa sin demasiado envoltorio, revise [@open.mp/node](https://github.com/omp-node/core).

### Comparación

| /              | Infernus + samp-node                                                                         | omp-node                     |
| -------------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| Runtime        | Windows: Node.js 16/20<br/>Linux: Node.js 16                                                 | Windows/Linux: Node.js 18+   |
| Module System  | CommonJS                                                                                     | ESModule                     |
| Architecture   | x86                                                                                          | x86/x64                      |
| Implementation | Via sampgdk→fakeamx→native calls                                                             | Direct omp-gdk/omp-sdk calls |
| Performance    | Relativamente más lento                                                                      | Más optimizado               |
| Compatibility  | Plugins de terceros vía capa polyfill                                                        | Requiere adaptación del SDK  |
| Philosophy     | 1. Reescribir completamente con Infernus (evitar Pawn)<br>2. Adopción obligatoria de Steamer | Ver documentación oficial    |

## Limitaciones

::: danger
Sí, es importante entender las limitaciones antes de comenzar.

Varias limitaciones impactan significativamente la experiencia de desarrollo. **Se recomienda abordar el desarrollo del ecosistema `samp-node` con una mentalidad experimental.**

**En general, el ecosistema es actualmente inestable debido a varios factores.**
:::

### Ecosistema de SAMP-NODE

Existiendo librerías desarrolladas en `Pawn`, tales como `fcnpc`, `colandreas`, `nexac` y otras también conocidas, pueden presentarse dos situaciones en tu proyecto si dependes de ellas: **mantenimiento inexistente o incompatible**.

Teniendo en cuenta que el plugin desarrollo de `samp-node` está basado en `samp` y no en `omp`, ciertos ecosistemas de algunos plugins no son compatibles. Por ejemplo, acceder a las funciones nativas de ciertos plugins, como `raknet`, no es posible.

Esto limita bastante el desarrollo de plugins de `samp` usando el ecosistema de `node.js`. Requiere juntar esfuerzos de los autores de samp-node y la comunidad para abordar este problema.

Sin embargo, el enfoque de `omp` está principalmente en construir `omp` en sí en lugar de bibliotecas de terceros.

### Soporte para Sqlite y Bindings

Lamentablemente, este proyecto está basado en un `node.js` embebido de 32 bits, que no es compatible con `node-sqlite` ni con llamadas a `bindings` de otros lenguajes de programación como Rust.

Quizás esto se resuelva en el futuro con un `omp-node` de 64 bits.

### Bloqueo de terminal

> [!IMPORTANT]
> Este problema se ha solucionado a través de [monkeyPatch](https://github.com/dockfries/infernus-starter/commit/b69583a607ce398131ba795007fe97af39104469) como la solución actual.

Debido a la pobre compatibilidad entre el `samp-node` subyacente y ciertas librerías asíncronas de `node.js`, ocasionalmente puede haber bloqueo de terminal.

Por ejemplo, cuando usas librerías de orm como `typeorm/sequelize`, puede casar bloqueo de terminal y el server deja de responder hasta que manualmente presionas enter en la terminal.

Por lo tanto, es recomendado adoptar un enfoque de desarrollo distribuido, aunque pueda parecer molesto.

Un enfoque es crear un proyecto separado de `node.js` para las operaciones de base de datos, como el uso de `NestJS` para construir una `API` específicamente para operaciones `CRUD`. El servidor del juego puede acceder a la lógica de la base de datos a través de peticiones `HTTP`, o puedes explorar métodos de comunicación avanzada como `RPC` o `sockets`.

El beneficio de este enfoque es que el servidor del juego solo maneja la lógica del juego, mientras que la lógica de la base de datos está transferida en otro proyecto. Adicionalmente, puedes desarrollar un sistema de administración que comparta la misma `API` que el servidor del juego.

## Composición

En general, sólo hay que centrarse en la capa superior, que es la de desarrollo de aplicaciones.

`Infernus` trabaja principalmente con la segunda y tercera capa, dependiendo de `samp-node` y del servidor de juego `omp`.

Si no está seguro de cómo iniciar un proyecto, consulte el [Inicio rápido](./quick-start).

| /   | Capa                    | Descripción                                         |
| --- | ----------------------- | --------------------------------------------------- |
| 1   | Aplicación              | Modo de juego, como free-roam o role-play           |
| 2   | Envoltorios de clase    | Funcionalidad envuelta en clases                    |
| 3   | Envoltorios funcionales | Envoltorios para librerías como `samp/omp/streamer` |
| 4   | `SAMP NODE`             | Puente hacia el `SDK` subyacente                    |
| 5   | `OMP` Servidor de juego | Servidor de juego subyacente                        |

## ¿Por qué desarrollar?

Para los principiantes en programación o los desarrolladores frontales (front-end developers), iniciarse en el desarrollo de scripts de juegos utilizando «Pawn», un lenguaje procedimental similar a «C», puede resultar complicado. Además, realizar operaciones básicas de bajo nivel en `Pawn`, como la concatenación de cadenas, la eliminación y la manipulación de matrices, es más engorroso en comparación con `JavaScript` orientado a objetos.

Además, implementar funcionalidades asíncronas es bastante difícil dentro del ecosistema del lenguaje `Pawn`. La internacionalización se consigue normalmente utilizando la codificación `UTF-8`, pero como el lanzamiento de `sa` fue bastante temprano, no utilizó `UTF-8` para la internacionalización. En su lugar, utilizaba diferentes conjuntos de caracteres basados en la norma `ANSI` del sistema Windows, como `ISO-8859-1` en los países occidentales y la codificación `GBK` en China.

El desarrollo de scripts localizados en `Pawn` a menudo requiere configurar la codificación del archivo para que coincida con el conjunto de caracteres del idioma localizado del sistema Windows. Esto puede dar lugar a problemas de codificación imprevistos, como el almacenamiento de datos `GBK` en una base de datos `UTF-8`, que puede dar lugar a datos confusos si no se manejan correctamente.

Al utilizar `JavaScript` para el desarrollo, podemos aprovechar la potencia del ecosistema `Node.js`, incluyendo librerías para el procesamiento de fecha y hora (por ejemplo, `dayjs`), bases de datos (por ejemplo, `MySQL`, `Redis`, `MongoDB`), y programación asíncrona (por ejemplo, `Promises, Async/await`). Esto nos permite sustituir las librerías del ecosistema `Pawn` por otras equivalentes del ecosistema `Node.js`.
