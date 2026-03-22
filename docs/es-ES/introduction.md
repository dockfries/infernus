# ¿Qué es Infernus?

El nombre `Infernus` proviene del vehículo con el ID `411` en el juego (concretamente en `GTA: San Andreas`).

`Infernus` es una biblioteca construida sobre `samp-node`, que permite llamar al `SDK` del juego desde la capa de `JavaScript`.

> [!WARNING]
> El proyecto Infernus ha entrado en modo de mantenimiento y será archivado gradualmente. El desarrollo futuro del ecosistema estará liderado por la comunidad omp-node, y damos una cálida bienvenida a los desarrolladores interesados a unirse y contribuir.

## 🚧 Trabajo en Curso

- [omp-node](https://github.com/omp-node) está actualmente en desarrollo activo, reemplazará a `Infernus` en el futuro.
- si quiere probar `omp-node` o prefiere la sintaxis nativa sin demasiado envoltorio, revise [@open.mp/node](https://github.com/omp-node/core).

### Comparación

> En relación con omp-node, la información concreta está sujeta a la documentación oficial posterior. El siguiente contenido es meramente informativo.

| /              | Infernus + samp-node                                                                         | omp-node                     |
| -------------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| Runtime        | Windows/Linux: Node.js 22.22.1                                                               | Windows/Linux: Node.js 18+   |
| Module System  | CommonJS/ESModule                                                                            | ESModule                     |
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

### Soporte para 32 bits y Bindings

Lamentablemente, este proyecto está basado en `node.js` embebido de 32 bits, y el soporte para `bindings` es inestable. Puede que encuentres errores y otros problemas.

Antes de usar este proyecto, ten en cuenta los siguientes requisitos de versión:

1. **Coincidencia de Versión de Node**
   - Asegúrate de que la versión principal de Node coincida con la versión requerida por samp-node
   - Por ejemplo, si samp-node depende de 22.22.1, solo se pueden usar versiones 22.x
   - Versiones incompatibles como 18.x, 20.x, 24.x, etc. no funcionarán correctamente

2. Si el proyecto ya ha sido creado:
   - Primero verifica si la versión de Node cumple con los requisitos
   - Elimina la carpeta node_modules
   - Vuelve a ejecutar `pnpm install`

> Nota de soporte del entorno: El módulo better-sqlite3 ha sido probado y verificado en la plataforma Windows.

Este problema podría resolverse en el futuro con `omp-node` de 64 bits.

El entorno de 32 bits de `node` tiene limitaciones de memoria. Se recomienda configurar un proyecto separado de `node` para operaciones de base de datos, ejecutándose en `node` de 64 bits de la máquina host. Por ejemplo, usa `nestjs` para construir una `api` específicamente para operaciones `CRUD`. El servidor de juegos puede acceder a ella mediante solicitudes `http`, o puedes probar métodos más avanzados como `rpc` o `socket` para la comunicación.

La ventaja es que el servidor solo maneja la lógica del juego, mientras que la lógica de la base de datos es manejada por un proyecto separado. Adicionalmente, puedes desarrollar un sistema de administración que use el mismo conjunto de `api` que el servidor de juegos.

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

Para principiantes en programación, utilizar un lenguaje procedural como Pawn (similar a C) para crear scripts de juego supone una curva de aprendizaje considerable. En comparación con lenguajes modernos orientados a objetos como JavaScript, las API básicas de Pawn son más engorrosas: operaciones fundamentales como la concatenación de cadenas o la manipulación de arrays requieren implementación manual, lo que incrementa la complejidad del desarrollo.

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
