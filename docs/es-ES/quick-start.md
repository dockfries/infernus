# Cómo empezar

## Crear una aplicación

En esta sección describiremos cómo construir la aplicación `Infernus` localmente.

Recomendamos encarecidamente usar la plantilla [infernus-starter](https://github.com/dockfries/infernus-starter) para crear un proyecto TypeScript simple.

Necesita tener conocimientos básicos de desarrollo nativo en `Pawn` y Node.js.

### CLI

El proyecto utiliza `pnpm` para gestionar las dependencias, así que primero debe instalar [pnpm](https://pnpm.io/).

Puede crear un proyecto fácilmente siguiendo las instrucciones de la línea de comandos.

```sh
pnpm dlx @infernus/cli@latest create
```

::: tip
Dado que el CLI llama internamente a la API HTTP de GitHub, si su conexión de red es deficiente, es posible que no pueda crear la aplicación correctamente. En ese caso, consulte la sección [Manual](#manual).

[Más información sobre los límites de tasa de la API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

`@infernus/cli` es una herramienta similar a `sampctl` que gestiona las dependencias de paquetes analizando las reglas de `pawn.json`. Puede usarla para administrar cómodamente dependencias de plugins o de `open.mp`.

#### Caché

:::warning
La caché generada por `pnpm dlx` puede ser demasiado persistente. Se recomienda eliminar manualmente la caché de `dlx` periódicamente; de lo contrario, incluso especificando `@latest` podría ejecutar una versión desactualizada.
:::

- Windows: `C:\Users\%USERNAME%\AppData\Local\pnpm-cache\dlx`
- Linux: `~/.cache/pnpm/dlx`

[Ver directorio de caché](https://pnpm.io/settings#cachedir)

#### Ejemplo

```sh
# Instalar la CLI globalmente
pnpm add @infernus/cli -g
# Actualizar si ya está instalada globalmente
pnpm update @infernus/cli -g

# Crear un proyecto
infernus create <nombreApp>

# Instalar una o más dependencias.
# Todas las operaciones pueden especificar un número de versión, similar a la sintaxis de npm.
infernus add openmultiplayer/open.mp dockfries/samp-streamer-plugin@^2.9.6
# Instalar una dependencia de componente
infernus add dockfries/Pawn.RakNet@^1.7.0-omp --component
# Modo producción (no copia archivos inc)
infernus add dockfries/samp-streamer-plugin@^2.9.6 -p

# Instalar todas las dependencias existentes (similar a sampctl ensure)
infernus install

# Modo producción (sin copiar archivos inc)
infernus install -p

# Instalar exactamente lo que registra el lockfile, y fallar si ya no cumple
# el manifiesto (el `npm ci` de esta CLI)
infernus install --frozen

# Desinstalar una o más dependencias
infernus remove openmultiplayer/open.mp dockfries/samp-streamer-plugin
infernus remove dockfries/Pawn.RakNet

# Subir todas las dependencias declaradas dentro de su rango y reescribir el lockfile
infernus update

# Actualizar una dependencia (actualiza la caché global y el directorio actual)
infernus update openmultiplayer/open.mp

# Actualizar a una versión específica
infernus update openmultiplayer/open.mp@^1.6.7

# Añadir una dependencia sin versión: el manifiesto recibe el rango que escribiría
# npm (^2.8.1), o la etiqueta exacta con --save-exact
infernus add dockfries/samp-node
infernus add dockfries/samp-node --save-exact

# Listar las versiones disponibles de una dependencia
# (cuáles cumplen el manifiesto y cuál está instalada)
infernus versions
infernus versions openmultiplayer/open.mp --all

# Previsualizar lo que haría una instalación o actualización: solo resuelve,
# no descarga ni escribe ningún archivo
infernus update openmultiplayer/open.mp@^1.6.7 --dry-run --verbose

# Imprimir cada decisión de caché y cada petición a GitHub, para problemas de versión
infernus update openmultiplayer/open.mp@^1.6.7 --verbose

# Limpiar todas las versiones de una dependencia global que el rango cumpla
infernus clean dockfries/samp-streamer-plugin@^2.9.6
# Limpiar todas las versiones de una dependencia global
infernus clean dockfries/samp-streamer-plugin
# Limpiar toda la caché global
infernus clean -a

# Configurar un token de GitHub para evitar límites de tasa (bajo demanda)
# Nota: la variable de entorno gh_token tiene prioridad sobre la configuración global
infernus config gh_token <tu_token_github>

# Mostrar la configuración global
infernus config -l

# Eliminar una configuración global
infernus config gh_token
```

> [!WARNING]
> En `cmd.exe` de Windows el circunflejo es un carácter de escape, así que `@^1.6.7`
> llega a la CLI como `@1.5.8` y provoca un error confuso de "versión no encontrada".
> Entrecomille la versión: `infernus update "openmultiplayer/open.mp@^1.6.7"`

#### Cómo se escriben las versiones

- `infernus.json` contiene un **rango semver estilo npm** (`*`, `^1.5.8`, `~1.6.7`) y también
  puede indicar una etiqueta de release concreta para fijar esa compilación.
- **Mezclar `2.6.1` y `^2.9.6` en el mismo archivo es normal**: la CLI nunca reescribe el
  especificador. `2.6.1` es un **anclaje exacto**, así que `update` se queda en ese release;
  `^2.9.6` es un **rango**, así que `update` avanza al release más reciente que permite.
  Para seguir los releases, escriba el rango: `infernus add dockfries/samp-node@^2.6.1`.
  `infernus versions` muestra qué releases cumplen lo declarado en el manifiesto.
- `infernus-lock.json` contiene la **etiqueta real del release de GitHub**, por ejemplo
  `v1.6.7.3218`. Las etiquetas de open.mp tienen cuatro segmentos
  (`vmayor.menor.parche.build`), así que `1.6.7` no es una etiqueta: la CLI la trata como
  rango y elige `v1.6.7.3218`, algo que `--verbose` muestra paso a paso.
- **El lockfile decide qué puede mover una instalación**, igual que `package-lock.json` en
  npm: una entrada cuyo release todavía cumple el manifiesto se instala tal como está
  registrada, sin consultar GitHub, y solo se resuelven de nuevo las entradas que faltan en
  el lockfile o que el manifiesto ya no acepta. `infernus update` es lo que resuelve otra vez
  los rangos declarados y reescribe el lockfile; `infernus install --frozen` reproduce el
  lockfile tal cual y rechaza un proyecto que ya no describe.
- **La instalación es idempotente**: una dependencia cuyo release ya está instalado, y cuyos
  archivos siguen en su sitio, no se toca, así que los binarios de plugin y los includes que
  el proyecto editó no se reescriben. Los archivos se comprueban en vez de suponerse, de modo
  que un clon recién hecho (con lockfile y sin `plugins/`) se completa igualmente.
- `infernus update` sin argumentos sube **todas** las dependencias declaradas dentro de su
  rango y reescribe el lockfile; `infernus update <pkg>` hace lo mismo con una sola.
- `infernus add <pkg>` sin versión declara el rango que escribiría npm (`^2.8.1`), y
  `--save-exact` declara la etiqueta exacta. Una dependencia ya declarada en el manifiesto
  conserva su especificador: nombrarla sin versión nunca lo amplía.
- Al actualizar open.mp se reemplazan los archivos de la compilación anterior, se conservan
  y se listan los archivos modificados por el proyecto, y nunca se sobrescriben
  `config.json`, `bans.json` ni `gamemodes/`. Si se reescribe la configuración del
  proyecto, queda una copia `config.json.<marca-de-tiempo>.bak`.

#### JSON Schema

Tanto `infernus.json` como `infernus-lock.json` tienen validación y autocompletado.
Añada una línea al principio del archivo:

```json
{
  "$schema": "https://raw.githubusercontent.com/dockfries/infernus/main/packages/cli/schemas/infernus.schema.json",
  "dependencies": {
    "openmultiplayer/open.mp": "^1.6.7"
  }
}
```

#### Características

1. Solo gestiona dependencias básicas de plugins; no administra librerías `include` puras.
2. Los paquetes instalados se almacenan en caché en `~/infernus/dependencies`; las instalaciones posteriores de la misma versión copian desde la caché en lugar de descargar de nuevo.
3. La configuración se encuentra en `~/infernus/config.json` y actualmente solo contiene un campo `gh_token` para evitar los límites de tasa de la API de GitHub.

### Manual

```sh
# Clonar mediante HTTPS
git clone https://github.com/dockfries/infernus-starter.git
# o mediante SSH
git clone git@github.com:dockfries/infernus-starter.git

# Si necesita raknet, clone la rama raknet
# git clone https://github.com/dockfries/infernus-starter.git -b raknet
# o mediante SSH
# git clone git@github.com:dockfries/infernus-starter.git -b raknet

# También puede descargar el repositorio directamente desde GitHub.

# Entre al directorio raíz del proyecto
cd infernus-starter

# Modifique la contraseña de rcon en config.json
vim config.json # no es necesario usar vim; cualquier editor vale

# "rcon": {
#   "password": "changeme" # cambie changeme por su propia contraseña
# }
```

:::warning
**El repositorio ha eliminado los archivos necesarios** para garantizar que siempre use las versiones más recientes de las dependencias y reducir el tamaño del repositorio. Esto significa que deberá completar los archivos manualmente.
:::

Los archivos `so/dll` dependen del entorno donde ejecutará el servidor; elija la versión adecuada según su caso. En Linux solo necesita `so`; en Windows solo `dll`.

1. Descargue el [servidor de juego OMP](https://github.com/openmultiplayer/open.mp/releases) y extraiga `omp-server[.exe]` y la carpeta `components` en la raíz del proyecto.

2. Descargue el [plugin samp-node](https://github.com/dockfries/samp-node/releases), extraiga `libnode.so/dll` en la raíz del proyecto y `samp-node.so/dll` en la carpeta `plugins` (créela si no existe).

3. Descargue el [plugin streamer](https://github.com/dockfries/samp-streamer-plugin/releases) y coloque `streamer.so/dll` en la carpeta `plugins`.

4. **(Si necesita usar raknet)** descargue el [componente raknet](https://github.com/dockfries/Pawn.RakNet/releases) y coloque todos los archivos excepto los `.inc` en la carpeta `components`.
   1. Reemplace `gamemodes/polyfill_raknet.amx` por `gamemodes/polyfill.amx`, **o** modifique la sección `pawn.main_scripts` en `config.json`.

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
```

### Instalar dependencias y desarrollo

> [!TIP]
> Si usas samp-node de 32 bits, necesitas establecer las variables de entorno antes de ejecutar `pnpm install`.
> Consulta [Ecosistema → Soporte Experimental de 64 bits](/es-ES/ecosystem#soporte-experimental-de-64-bits) para más detalles.

```sh
# Instalar dependencias
pnpm install

# Modo desarrollo (compilar, observar cambios y reiniciar automáticamente)
pnpm dev
```

### Compilación y ejecución

```sh
# Compilar para producción
pnpm build

# Ejecutar el servidor
pnpm serve
```
