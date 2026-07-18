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

| /              | Infernus + samp-node                                                                         | omp-node                          |
| -------------- | -------------------------------------------------------------------------------------------- | --------------------------------- |
| Runtime        | Windows/Linux: Node.js 22.23.1                                                               | Windows/Linux: Node.js 18+        |
| Module System  | CommonJS/ESModule                                                                            | ESModule                          |
| Architecture   | x86 (estable) / x64 (experimental, sin probar)                                               | x86/x64                           |
| Implementation | Via sampgdk → fakeamx → llamadas nativas                                                     | Llamadas directas omp-gdk/omp-sdk |
| Performance    | Lento                                                                                        | Rápido                            |
| Compatibility  | Plugins de terceros mediante capa polyfill                                                   | Requiere adaptación del SDK       |
| Philosophy     | 1. Reescribir completamente con Infernus (evitar Pawn)<br>2. Adopción obligatoria de Steamer | Ver documentación oficial         |

## Limitaciones

::: danger
Sí, es importante entender las limitaciones antes de comenzar.

Varias limitaciones afectan significativamente la experiencia de desarrollo. **Recomendamos abordar el desarrollo del ecosistema `samp-node` con una mentalidad experimental.**

**En general, el ecosistema es actualmente inestable debido a múltiples factores.**
:::

### Soporte para 32 bits y Bindings

Lamentablemente, este proyecto se basa en Node.js embebido de 32 bits, y el soporte para `bindings` es inestable. Puede encontrar errores y otros problemas.

Antes de usar este proyecto, tenga en cuenta los siguientes requisitos de versión:

1. **Coincidencia de versión de Node**
   - Asegúrese de que la versión principal de Node coincida con la requerida por samp-node.
   - Por ejemplo, si samp-node depende de 22.23.1, solo se pueden usar versiones 22.x.
   - Versiones incompatibles como 18.x, 20.x, 24.x, etc. no funcionarán correctamente.

2. Si el proyecto ya ha sido creado:
   - Primero verifique si la versión de Node cumple el requisito.
   - Elimine la carpeta `node_modules`.
   - Vuelva a ejecutar `pnpm install`.

> Nota de soporte del entorno: `better-sqlite3` ha sido probado y verificado en la plataforma Windows.

Este problema podría resolverse en el futuro con `omp-node` de 64 bits.

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
