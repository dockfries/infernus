# Cómo empezar

## Crear aplicación

En esta sección, describiremos cómo construir la aplicación `Infernus` localmente.

Se recomienda encarecidamente utilizar la plantilla [infernus-starter](https://github.com/dockfries/infernus-starter) para crear un ejemplo de plantilla muy simple basado en `TypeScript`.

Necesitas tener una base para el desarrollo nativo de `pawn` y `node`.

### CLI

El proyecto utiliza `pnpm` para gestionar las dependencias, por lo que es necesario instalar [pnpm](https://pnpm.io/).

Puede crear fácilmente un proyecto siguiendo las instrucciones de la línea de comandos.

```sh
pnpm dlx @infernus/create-app create
```

::: tip
Debido a que el CLI llama internamente al `github HTTP API`, si tu entorno de red es pobre, puede que no seas capaz de crear la aplicación con éxito. En este caso, puedes consultar el [Manual](#manual).

[Pulse aquí para conocer sobre los límites de tarifa de la API (API Rate-limit)](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-primary-rate-limits)
:::

`@infernus/create-app` es una herramienta similar a `sampctl` que gestiona las dependencias de paquetes analizando las reglas de `pawn.json`. Puede utilizarlo para simplemente administrar dependencias de base de plugins o `open.mp`.

#### Ejemplo

```sh
# Instalar la herramienta CLI globalmente
pnpm add @infernus/create-app -g

# Crear un proyecto
infernus create <nombre de la aplicación>

# Instalar una o más dependencias, 
# todas las dependencias de las operaciones pueden ir seguidas de un número de versión, 
# es similar a la sintaxis de los paquetes npm.
infernus add openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6
# Instalar dependencias en modo producción (no copia archivos inc)
infernus add samp-incognito/samp-streamer-plugin@^2.9.6 -p

# Instalar todas las dependencias existentes, similar a sampctl ensure
infernus install

# Instalar todas las dependencias existentes en modo de producción (sin copiar archivos inc).
infernus install -p

# Desinstalar una o varias dependencias
infernus remove openmultiplayer/open.mp samp-incognito/samp-streamer-plugin@^2.9.6

# Actualizar una dependencia (actualizar la caché global y aplicarla al directorio actual)
infernus update openmultiplayer/open.mp

# Actualizar una dependencia a una versión específica
infernus update openmultiplayer/open.mp@^1.2.0.2670

# Borrar la versión menos coincidente de una única dependencia global
infernus cache clean samp-incognito/samp-streamer-plugin@^2.9.6
# Borrar todas las versiones de una única dependencia global
infernus cache clean samp-incognito/samp-streamer-plugin
# Borrar todas las dependencias de la caché global
infernus cache clean -a

# Establezca un token de GitHub para resolver problemas de límite de velocidad de la API (a petición).
# Nota: la variable de entorno gh_token tendrá prioridad sobre la configuración global.
infernus config gh_token <tu_github_token>

# Mostrar información de configuración global
infernus config -l

# Borrar una configuración global
infernus config gh_token
```

#### Características

1. Sólo se encarga de la gestión de dependencias de plugins más básica, y no gestiona la librería `include` pura.
2. Los paquetes instalados se almacenan en caché en `~/infernus/dependencies`, y las instalaciones posteriores de la misma versión se copian directamente en lugar de descargarse.
3. El archivo de configuración se encuentra en `~/infernus/config.json`, y actualmente sólo tiene un elemento de configuración `gh_token` para resolver el límite de frecuencia de la `github api`.

### Manual

```sh
# Clonar el repositorio a través del protocolo https.
git clone https://github.com/dockfries/infernus-starter
# o utilizar el protocolo ssh.
git clone git@github.com:dockfries/infernus-starter.git
# también puede descargar el repositorio directamente desde la página de GitHub.

# Ingresa al directorio raíz del proyecto.
cd infernus-starter

# Modifique la contraseña rcon en config.json.
vim config.json # no es necesario utilizar vim, cualquier editor es bueno.

# "rcon": {
#   "password": "changeme" # cambie changeme por su propia contraseña.
#}
```

:::warning
**El repositorio ha eliminado los archivos necesarios**, para asegurarse de que siempre utiliza las dependencias de la última versión y reducir el tamaño de los archivos del repositorio, lo que significa que debe completar los archivos manualmente
:::

La `so/dll` depende del entorno en el que quieras ejecutar el servidor, y necesitas seleccionar la versión correspondiente para descargar según el entorno. En `linux` sólo se necesita `so`, y en `windows` sólo se necesita `dll`.

1. Descarga [omp game server](https://github.com/openmultiplayer/open.mp/releases), y posteriormente extrae las carpetas `omp-server[.exe]` y `components` al directorio raíz del proyecto.

2. Descarga [samp-node plugin](https://github.com/dockfries/samp-node/releases), y posteriormente extrae el `libnode.so/dll` en el directorio raíz del proyecto, y `plugins` en la carpeta `plugins` (si el directorio raíz no tiene una carpeta `plugins`, deberás crearla manualmente).

3. Descarga [streamer plugin](https://github.com/samp-incognito/samp-streamer-plugin/releases), y después pon `streamer.so/dll` en la carpeta `plugins`.

4. **(Si necesitas usar raknet)** descarga [raknet plugin](https://github.com/katursis/Pawn.RakNet/releases), y después pon todos los archivos excepto el sufijo `.inc` en la carpeta `components`.
   1. sustituye `gamemodes/polyfill_raknet.amx` por `gamemodes/polyfill.amx`, **o** modifica la sección `pawn.main_scripts` del archivo raíz `config.json`.

```json
  "pawn": {
    "main_scripts": ["polyfill_raknet 1"],
  },
```

### Instalar dependencias y desarrollo

```sh
# instalación de las dependencias
pnpm install

# ejecutar comandos en modo de desarrollo (iniciar la compilación, escuchar los cambios y reiniciar automáticamente)
pnpm dev
```

### Compilación y ejecutación

```sh
# compilación para el entorno de producción
pnpm build

# ejecutar el servidor
pnpm serve
```
