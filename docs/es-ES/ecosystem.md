# Ecosistema

El ecosistema `@infernus/*` está diseñado para integrar las librerías Pawn include en el mundo de Node.js. Envuelve capacidades existentes de Pawn en paquetes de Node.js, permitiéndote usar funcionalidades que antes solo estaban disponibles en Pawn a través de TypeScript/JavaScript.

`@infernus/*` proporciona los siguientes paquetes del ecosistema:

| Paquete                     | Descripción                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `@infernus/core`            | Librería de Node.js para crear scripts en Open Multiplayer                                                                            |
| `@infernus/cef`             | Un envoltorio del componente omp-cef para samp-node                                                                                   |
| `@infernus/colandreas`      | Un envoltorio del plugin ColAndreas para samp-node                                                                                    |
| `@infernus/create-app`      | Interfaz de línea de comandos para desarrollo rápido con infernus                                                                     |
| `@infernus/distance`        | Un envoltorio de la librería distance para samp-node                                                                                  |
| `@infernus/drift-detection` | Un envoltorio de la librería driftDetection para samp-node                                                                            |
| `@infernus/e-selection`     | Un envoltorio de la librería eSelection para samp-node                                                                                |
| `@infernus/fcnpc`           | Un envoltorio del plugin FCNPC para samp-node                                                                                         |
| `@infernus/fs`              | Una colección de todos los filterscripts integrados                                                                                   |
| `@infernus/gps`             | Un envoltorio del plugin GPS para samp-node                                                                                           |
| `@infernus/map-loader`      | Una herramienta para conversión, análisis y carga de objetos                                                                          |
| `@infernus/mapandreas`      | Implementación de mapa de altura en TypeScript puro, sin plugin nativo                                                                |
| `@infernus/s-art`           | Un envoltorio de la popular librería s-art para renderizar imágenes de píxeles en el juego usando DynamicObject con texto de material |
| `@infernus/nex-ac`          | Un envoltorio de la librería nex-ac para samp-node                                                                                    |
| `@infernus/progress`        | Una barra de progreso basada en `LD_SPAC:white` para control preciso                                                                  |
| `@infernus/qrcode`          | Genera objetos qrcode simples para infernus                                                                                           |
| `@infernus/query`           | API simple para enviar consultas SA-MP con TypeScript                                                                                 |
| `@infernus/raknet`          | Un envoltorio del plugin raknet de open.mp para samp-node                                                                             |
| `@infernus/rec`             | Conversor de formato de archivo de `.rec` a `.json` y viceversa                                                                       |
| `@infernus/samp-voice`      | Un envoltorio de la librería SA-MP voice para samp-node                                                                               |
| `@infernus/shared`          | Utilidades y tipos compartidos para paquetes infernus (interno)                                                                       |
| `@infernus/streamer`        | Un envoltorio del plugin streamer SA-MP (v2.9.6, **privado**)                                                                         |
| `@infernus/types`           | Tipos de API samp-node minimizados para infernus (interno)                                                                            |
| `@infernus/weapon-config`   | Un envoltorio de la librería weapon-config para samp-node                                                                             |

## Ejemplos

| Proyecto                                                            | Descripción                                                           |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [omp-gm-grandlarc](https://github.com/dockfries/omp-gm-grandlarc)   | El modo de juego de muestra GrandLarceny escrito con infernus-starter |
| [omp-gm-rivershell](https://github.com/dockfries/omp-gm-rivershell) | El modo de juego de muestra RiverShell escrito con infernus-starter   |
| [fme](https://github.com/dockfries/fme)                             | Fusez Map Editor Version 3 — un editor de mapas para samp-node        |
| [nte](https://github.com/dockfries/nte)                             | Nexor's TextDraw Editor para samp-node                                |

## Filosofía de diseño

### Evitar Filterscripts

No recomendamos usar ningún Filterscript junto con Infernus. Los filterscripts de Pawn fueron diseñados como módulos de script independientes que se ejecutan junto a los GameModes, pero en el entorno de Infernus esto introduce complejidad innecesaria.

Nuestras recomendaciones:

- Reescribe los filterscripts existentes usando Infernus e intégralos directamente en tu GameMode.
- No escribas lógica de GameMode en Pawn (excepto para el código polyfill necesario).
- En resumen, **implementa todo a través de Infernus**.

Esto mantiene toda la lógica unificada en el entorno Node.js/TypeScript, evitando la fragmentación entre Pawn y Node.js.

## Compatibilidad

### Edición sin Polyfill

Debido a las limitaciones de implementación subyacentes de los plugins, `samp-node`, `sampgdk` y `omp`, ciertas funciones nativas de plugins no pueden llamarse directamente a través de `samp-node`. Por ejemplo, las funciones nativas de `raknet` anteriormente requerían una solución alternativa mediante `polyfill`.

A partir de **v0.14.0+**, `@infernus/raknet` proporciona una **edición sin polyfill** — la directiva `#include <polyfill/raknet>` ya **no es necesaria**. Utilice nuestro fork mantenido [dockfries/Pawn.RakNet](https://github.com/dockfries/Pawn.RakNet) para comenzar.

> **⚠️ La edición sin polyfill es experimental** — pueden existir errores. Si depende del enfoque basado en polyfill, continúe usando `@infernus/raknet@0.13.x` con el Pawn.RakNet original.

### Soporte Experimental de 64 bits

`samp-node` ahora proporciona compilaciones de 64 bits para uso experimental. Requieren un servidor OMP de 64 bits con plugins de 64 bits compatibles:

- [streamer](https://github.com/dockfries/samp-streamer-plugin/releases/tag/v2.9.6)
- [gps](https://github.com/dockfries/samp-gps-plugin/releases/tag/v1.4.1)
- [raknet](https://github.com/dockfries/Pawn.RakNet/releases/tag/1.6.1-omp-rc1)
- [ColAndreas](https://github.com/dockfries/ColAndreas/releases/tag/v1.6.0)
- [sampvoice](https://github.com/dockfries/sampvoice)

> Tenga en cuenta que `@infernus/create-app` no admite la descarga de estas dependencias de 64 bits en este momento.

Al usar el plugin raknet de 64 bits, es posible que deba recompilar manualmente el polyfill para que coincida con la versión de Pawn.RakNet y evitar advertencias de incompatibilidad de versiones.

Antes de ejecutar `pnpm install`, verifica si tu samp-node es de 32 bits (x86) o 64 bits (x64) y establece las variables de entorno correspondientes. Si ya has ejecutado `pnpm install`, elimina la carpeta `node_modules` primero antes de reinstalar.

```sh
# bash
export npm_config_arch=ia32
export npm_config_target_arch=ia32

# powershell
# $env:npm_config_arch="ia32";
# $env:npm_config_target_arch="ia32";

# cmd
# set npm_config_arch=ia32
# set npm_config_target_arch=ia32
```

Asegúrate de establecer estas variables de entorno cada vez que ejecutes `pnpm install`. No son necesarias para samp-node de 64 bits.
