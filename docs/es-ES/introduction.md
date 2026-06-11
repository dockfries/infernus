# ¿Qué es Infernus?

El nombre `Infernus` proviene del vehículo con ID `411` en GTA: San Andreas.

`Infernus` es una librería construida sobre `samp-node` que permite llamar al SDK del juego desde la capa de JavaScript.

> [!WARNING]
> El proyecto Infernus ha entrado en modo de mantenimiento y será archivado gradualmente. El desarrollo futuro del ecosistema estará liderado por la comunidad de omp-node. Damos una cálida bienvenida a los desarrolladores interesados en unirse y contribuir.

## 🚧 Trabajo en curso

- [omp-node](https://github.com/omp-node) está en desarrollo activo y eventualmente reemplazará a `Infernus`.
- Si quiere probar `omp-node` o prefiere una sintaxis nativa con menos envoltorio, visite [@open.mp/node](https://github.com/omp-node/core).

### Comparación

> Todos los detalles sobre omp-node están sujetos a su documentación oficial. La siguiente información es solo de referencia.

| /              | Infernus + samp-node                                                                         | omp-node                     |
| -------------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| Runtime        | Windows/Linux: Node.js 22.22.3                                                               | Windows/Linux: Node.js 18+   |
| Module System  | CommonJS/ESModule                                                                            | ESModule                     |
| Architecture   | x86 (estable) / x64 (experimental, sin probar)                                               | x86/x64                      |
| Implementation | Via sampgdk → fakeamx → llamadas nativas                                                     | Llamadas directas omp-gdk/omp-sdk |
| Performance    | Lento                                                                                        | Rápido                       |
| Compatibility  | Plugins de terceros mediante capa polyfill                                                   | Requiere adaptación del SDK  |
| Philosophy     | 1. Reescribir completamente con Infernus (evitar Pawn)<br>2. Adopción obligatoria de Steamer | Ver documentación oficial    |

## Limitaciones

::: danger
Sí, es importante entender las limitaciones antes de comenzar.

Varias limitaciones afectan significativamente la experiencia de desarrollo. **Recomendamos abordar el desarrollo del ecosistema `samp-node` con una mentalidad experimental.**

**En general, el ecosistema es actualmente inestable debido a múltiples factores.**
:::

### Ecosistema

::: info
[Haga clic para ver los paquetes del ecosistema implementados](https://github.com/dockfries/infernus/tree/main/packages). Tenga en cuenta que los resultados pueden diferir de las librerías originales y es probable que haya errores.
:::

Las librerías existentes desarrolladas en Pawn pueden presentar dos problemas si su proyecto depende de ellas: **sin mantenimiento o incompatibles**.

Dado que el desarrollo de plugins de `samp-node` se basa en `samp` y no en `omp`, ciertos ecosistemas de plugins son incompatibles. Por ejemplo, no es posible acceder a funciones nativas de plugins como `raknet`.

Esto limita enormemente el desarrollo de plugins de `samp` usando el ecosistema de Node.js y requiere un esfuerzo conjunto de la comunidad para resolverlo.

### Soporte para 32 bits y Bindings

Lamentablemente, este proyecto se basa en Node.js embebido de 32 bits, y el soporte para `bindings` es inestable. Puede encontrar errores y otros problemas.

Antes de usar este proyecto, tenga en cuenta los siguientes requisitos de versión:

1. **Coincidencia de versión de Node**
   - Asegúrese de que la versión principal de Node coincida con la requerida por samp-node.
   - Por ejemplo, si samp-node depende de 22.22.3, solo se pueden usar versiones 22.x.
   - Versiones incompatibles como 18.x, 20.x, 24.x, etc. no funcionarán correctamente.

2. Si el proyecto ya ha sido creado:
   - Primero verifique si la versión de Node cumple el requisito.
   - Elimine la carpeta `node_modules`.
   - Vuelva a ejecutar `pnpm install`.

> Nota de soporte del entorno: `better-sqlite3` ha sido probado y verificado en la plataforma Windows.

Este problema podría resolverse en el futuro con `omp-node` de 64 bits.

> [!TIP]
> Ahora se proporcionan compilaciones de 64 bits de `samp-node` solo para uso experimental. Deben ejecutarse en un servidor OMP de 64 bits con plugins de 64 bits compatibles (p. ej. [streamer](https://github.com/dockfries/samp-streamer-plugin/releases/tag/v2.9.6), [gps](https://github.com/dockfries/samp-gps-plugin/releases/tag/v1.4.1), [raknet](https://github.com/dockfries/Pawn.RakNet/releases/tag/1.6.1-omp-rc1)).
>
> Tenga en cuenta que `@infernus/create-app` no admite la descarga de estas dependencias de 64 bits en este momento.
>
> Al usar el plugin raknet de 64 bits, es posible que deba recompilar manualmente el polyfill para que coincida con la versión de Pawn.RakNet y evitar advertencias de incompatibilidad de versiones.
>
> Al migrar de una plantilla de 32 bits a 64 bits (o viceversa), elimine `arch=ia32` y `target_arch=ia32` del `.npmrc` (o agréguelos al volver). Tenga en cuenta que en pnpm >= 11, el manejo de `.npmrc` se ha simplificado y estas propiedades pueden no tener efecto — consulte la guía de migración de pnpm para más detalles.

El entorno de Node de 32 bits tiene limitaciones de memoria. Considere configurar un proyecto separado de Node para operaciones de base de datos en el Node de 64 bits de su máquina anfitriona. Por ejemplo, use NestJS para construir una API específicamente para operaciones CRUD. El servidor de juego puede acceder a ella mediante peticiones HTTP, o puede probar métodos más avanzados como RPC o sockets.

De esta forma, el servidor solo maneja la lógica del juego mientras que la lógica de la base de datos es gestionada por un proyecto separado. Incluso puede desarrollar un sistema de administración que comparta la misma API.

## Composición

En general, solo necesita centrarse en la capa superior — la capa de desarrollo de aplicaciones.

`Infernus` trabaja principalmente con la segunda y tercera capa, dependiendo de `samp-node` y del servidor de juego `omp`.

Si no sabe cómo empezar un proyecto, consulte la [Guía de inicio rápido](./quick-start).

| /   | Capa                    | Descripción                                         |
| --- | ----------------------- | --------------------------------------------------- |
| 1   | Aplicación              | Modo de juego, como free-roam o role-play           |
| 2   | Envoltorios de clase    | Funcionalidad envuelta en clases                    |
| 3   | Envoltorios funcionales | Envoltorios para librerías como `samp/omp/streamer` |
| 4   | `Samp Node`             | Puente hacia el SDK subyacente                      |
| 5   | `Omp` Game Server       | Servidor de juego subyacente                        |

## ¿Por qué desarrollar con Infernus?

Para los principiantes, usar un lenguaje procedural como Pawn (similar a C) para crear scripts de juego supone una curva de aprendizaje pronunciada. En comparación con lenguajes orientados a objetos modernos como JavaScript, las API de Pawn son mucho más engorrosas — operaciones básicas como la concatenación de cadenas o la manipulación de arreglos requieren implementación manual, lo que aumenta la complejidad.

Además, el ecosistema de Pawn tiene limitaciones notables:

1. **Soporte asíncrono débil**: Carece de paradigmas asíncronos modernos como `Promise`/`async` presentes en JavaScript.
2. **Problemas de internacionalización**: Dado que el compilador de Pawn de SA-MP se creó antes de que Unicode fuera estándar, su codificación de caracteres depende de la configuración regional del sistema operativo:
   - Los sistemas occidentales suelen usar `ISO-8859-1`.
   - Los sistemas chinos dependen de `GBK`.
   - Esto genera incompatibilidad con el estándar universal UTF-8.

Esta fuerte dependencia de codificaciones específicas de la configuración regional puede provocar problemas de compatibilidad imprevistos. Por ejemplo, almacenar datos GBK directamente en una base de datos UTF-8 sin conversión producirá texto ilegible.

Por el contrario, un enfoque basado en JavaScript aprovecha todas las ventajas del ecosistema Node.js:

- **Ecosistema rico**: Librerías maduras para manejo de fechas (Day.js), controladores de bases de datos (MySQL, Redis, MongoDB) y más.
- **Asincronía estandarizada**: Soporte nativo de `Promise`/`async` para gestionar operaciones asíncronas.
- **Codificación consistente**: UTF-8 de principio a fin, evitando eficazmente los problemas de internacionalización.

Al migrar a la pila de JavaScript, los desarrolladores pueden reducir significativamente la barrera de entrada, al tiempo que obtienen un soporte de internacionalización robusto y herramientas de desarrollo modernas.

> [!TIP]
> Hay una **habilidad para agente de IA** para `@infernus/*` disponible en `skills/omp-infernus-core-use/`, que puede ayudar a los asistentes de codificación de IA a comprender las API y convenciones del framework al generar código. Tenga en cuenta que esta habilidad es **experimental y no ha sido probada** — úsela bajo su propio criterio.
