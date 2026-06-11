# Cómo empezar

## Crear una aplicación

En esta sección describiremos cómo construir la aplicación `Infernus` localmente.

Recomendamos encarecidamente usar la plantilla [infernus-starter](https://github.com/dockfries/infernus-starter) para crear un proyecto TypeScript simple.

Necesita tener conocimientos básicos de desarrollo nativo en `Pawn` y Node.js.

### CLI

El proyecto utiliza `pnpm` para gestionar las dependencias, así que primero debe instalar [pnpm](https://pnpm.io/).

Puede crear un proyecto fácilmente siguiendo las instrucciones de la línea de comandos.

```sh
pnpm dlx @infernus/create-app@latest create
```

::: tip
Dado que el CLI llama internamente a la API HTTP de GitHub, si su conexión de red es deficiente, es posible que no pueda crear la aplicación correctamente. En ese caso, consulte la sección [Manual](#manual).

[Más información sobre los límites de tasa de la API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

`@infernus/create-app` es una herramienta similar a `sampctl` que gestiona las dependencias de paquetes analizando las reglas de `pawn.json`. Puede usarla para administrar cómodamente dependencias de plugins o de `open.mp`.

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
pnpm add @infernus/create-app -g
# Actualizar si ya está instalada globalmente
pnpm update @infernus/create-app -g

# Crear un proyecto
infernus create <nombreApp>

# Instalar una o más dependencias.
# Todas las operaciones pueden especificar un número de versión, similar a la sintaxis de npm.
infernus add openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6
# Instalar una dependencia de componente
infernus add katursis/Pawn.RakNet@^1.6.0-omp --component
# Modo producción (no copia archivos inc)
infernus add samp-incognito/samp-streamer-plugin@^2.9.6 -p

# Instalar todas las dependencias existentes (similar a sampctl ensure)
infernus install

# Modo producción (sin copiar archivos inc)
infernus install -p

# Desinstalar una o más dependencias
infernus remove openmultiplayer/open.mp samp-incognito/samp-streamer-plugin
infernus remove katursis/Pawn.RakNet

# Actualizar una dependencia (actualiza la caché global y el directorio actual)
infernus update openmultiplayer/open.mp

# Actualizar a una versión específica
infernus update openmultiplayer/open.mp@^1.2.0.2670

# Limpiar la versión de menor coincidencia de una dependencia global
infernus cache clean samp-incognito/samp-streamer-plugin@^2.9.6
# Limpiar todas las versiones de una dependencia global
infernus cache clean samp-incognito/samp-streamer-plugin
# Limpiar toda la caché global
infernus cache clean -a

# Configurar un token de GitHub para evitar límites de tasa (bajo demanda)
# Nota: la variable de entorno gh_token tiene prioridad sobre la configuración global
infernus config gh_token <tu_token_github>

# Mostrar la configuración global
infernus config -l

# Eliminar una configuración global
infernus config gh_token
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

3. Descargue el [plugin streamer](https://github.com/samp-incognito/samp-streamer-plugin/releases) y coloque `streamer.so/dll` en la carpeta `plugins`.

4. **(Si necesita usar raknet)** descargue el [plugin raknet](https://github.com/katursis/Pawn.RakNet/releases) y coloque todos los archivos excepto los `.inc` en la carpeta `components`.
   1. Reemplace `gamemodes/polyfill_raknet.amx` por `gamemodes/polyfill.amx`, **o** modifique la sección `pawn.main_scripts` en `config.json`.

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
```

### Instalar dependencias y desarrollo

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
