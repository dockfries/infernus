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
| Runtime        | Windows/Linux: Node.js 22.17+                                                                | Windows/Linux: Node.js 18+   |
| Module System  | CommonJS/ESModule(experimental)                                                              | ESModule                     |
| Architecture   | x86 only                                                                                     | x86/x64                      |
| Implementation | Via sampgdk→fakeamx→native calls                                                             | Direct omp-gdk/omp-sdk calls |
| Performance    | Lento                                                                                        | Rápido                       |
| Compatibility  | Plugins de terceros vía capa polyfill                                                        | Requiere adaptación del SDK  |
| Philosophy     | 1. Reescribir completamente con Infernus (evitar Pawn)<br>2. Adopción obligatoria de Steamer | Ver documentación oficial    |

## Limitaciones

::: danger
Sí, es importante entender las limitaciones antes de comenzar.

Varias limitaciones impactan significativamente la experiencia de desarrollo. **Se recomienda abordar el desarrollo del ecosistema `samp-node` con una mentalidad experimental.**

**En general, el ecosistema es actualmente inestable debido a varios factores.**
:::

### Ecosistema

::: info
[Haz clic para ver los paquetes implementados del ecosistema](https://github.com/dockfries/infernus/tree/main/packages). Ten en cuenta que los resultados pueden diferir de las bibliotecas originales y se esperan algunos errores.
:::

Existiendo librerías desarrolladas en `Pawn`, pueden presentarse dos situaciones en tu proyecto si dependes de ellas: **mantenimiento inexistente o incompatible**.

Teniendo en cuenta que el plugin desarrollo de `samp-node` está basado en `samp` y no en `omp`, ciertos ecosistemas de algunos plugins no son compatibles. Por ejemplo, acceder a las funciones nativas de ciertos plugins, como `raknet`, no es posible.

Esto limita bastante el desarrollo de plugins de `samp` usando el ecosistema de `node.js`. Requiere un trabajo conjunto de la comunidad para abordar este problema.

### Soporte de bindings

Lamentablemente, este proyecto está basado en un `node.js` embebido de 32 bits, y el soporte para `bindings` es inestable - puedes encontrarte con errores.

Antes de usar este proyecto, ten en cuenta:

1. **Compatibilidad de versiones**
   - Asegúrate que la versión principal de Node coincida con lo que necesita samp-node
   - Ejemplo: si samp-node requiere 22.17.0, solo usa versiones 22.x
   - Versiones como 18.x, 20.x, 24.x no son compatibles

2. Para proyectos existentes:
   - Primero verifica la versión de Node
   - Borra la carpeta node_modules
   - Ejecuta `pnpm install` nuevamente

> Nota: El módulo better-sqlite3 ha sido probado en Windows

Quizás esto se resuelva en el futuro con un `omp-node` de 64 bits.

### Bloqueo de terminal

> [!IMPORTANT]
> Este problema se ha solucionado a través de [monkeyPatch](https://github.com/dockfries/infernus-starter/blob/main/src/polyfill.js) como la solución actual.

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

Para principiantes en programación o desarrolladores front-end, utilizar un lenguaje procedural como Pawn (similar a C) para crear scripts de juego supone una curva de aprendizaje considerable. En comparación con lenguajes modernos orientados a objetos como JavaScript, las API básicas de Pawn son más engorrosas: operaciones fundamentales como la concatenación de cadenas o la manipulación de arrays requieren implementación manual, lo que incrementa la complejidad del desarrollo.

Además, el ecosistema del lenguaje Pawn presenta limitaciones importantes:

1.  **Soporte Asíncrono Débil**: Carece de forma nativa de paradigmas de programación asíncrona modernos como `Promise/Async` disponibles en JavaScript.
2.  **Barreras para la Internacionalización**: Dado que el compilador Pawn (SA-MP) se creó en una etapa temprana, su esquema de codificación de caracteres depende de la configuración regional del sistema operativo:
    - Los sistemas occidentales suelen utilizar la codificación `ISO-8859-1`;
    - Los sistemas chinos dependen de la codificación `GBK`;
    - Esto genera incompatibilidad con el estándar universal `UTF-8`.

Esta fuerte dependencia de codificaciones específicas puede provocar problemas de compatibilidad imprevistos. Por ejemplo, almacenar datos en `GBK` directamente en una base de datos `UTF-8` sin una conversión adecuada dará lugar a texto corrupto o ilegible.

Por el contrario, un enfoque basado en JavaScript aprovecha las ventajas del ecosistema Node.js:

- **Caja de Herramientas Rica**: Acceso a librerías sólidas para manejo de fechas (Day.js), controladores de bases de datos (MySQL, Redis, MongoDB), entre otros.
- **Asincronía Estandarizada**: Soporte nativo para `Promise/Async` para gestionar operaciones asíncronas.
- **Uniformidad en la Codificación**: Uo de la codificación `UTF-8` de extremo a extremo, evitando eficazmente problemas de compatibilidad en internacionalización.

Al migrar a la pila tecnológica de JavaScript, los desarrolladores pueden reducir significativamente la barrera de entrada y acceder simultáneamente a un soporte de internacionalización más robusto y a herramientas de desarrollo modernas.
